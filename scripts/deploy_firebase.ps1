# eSkarbnik - wdrozenie do Firebase Hosting + Firestore
# Skrypt uzywa przenosnego Node.js 20 i lokalnego Firebase CLI 14.18.0.
# Nie korzysta z globalnego Node/Firebase CLI z Windows.

param(
    [string]$ProjectId = "eskarbnik-fa364",
    [string]$FirebaseAccount = ""
)

$ErrorActionPreference = "Stop"

try {
    chcp 65001 | Out-Null
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    [Console]::InputEncoding = [System.Text.Encoding]::UTF8
} catch {}

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$FirebaseCliVersion = "14.18.0"
$RequiredNodeMajor = "v20."

function Stop-WithPause {
    param([string]$Message)

    Write-Host ""
    if (-not [string]::IsNullOrWhiteSpace($Message)) {
        Write-Host $Message -ForegroundColor Red
        Write-Host ""
    }
    Write-Host "Deploy Firebase NIE zostal wykonany." -ForegroundColor Red
    Write-Host ""
    pause
    exit 1
}

function Run-Command {
    param(
        [string]$File,
        [string[]]$Arguments
    )

    Write-Host ""
    Write-Host ("> " + $File + " " + ($Arguments -join " ")) -ForegroundColor DarkGray
    & $File @Arguments
    $Exit = $LASTEXITCODE
    if ($Exit -ne 0) {
        throw "Polecenie zakonczylo sie bledem ($Exit): $File $($Arguments -join ' ')"
    }
}

function Run-Command-NoThrow {
    param(
        [string]$File,
        [string[]]$Arguments
    )

    Write-Host ""
    Write-Host ("> " + $File + " " + ($Arguments -join " ")) -ForegroundColor DarkGray
    & $File @Arguments
    return $LASTEXITCODE
}

function Get-PortableNodeExe {
    param([string]$NodeBaseDir)

    $ExistingNode = Get-ChildItem -Path $NodeBaseDir -Filter "node.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($ExistingNode) {
        try {
            $ExistingVersion = (& $ExistingNode.FullName -v).Trim()
            if ($ExistingVersion -like "$RequiredNodeMajor*") {
                return $ExistingNode
            }
        } catch {}
    }

    return $null
}

function Install-PortableNode20 {
    param(
        [string]$ToolsDir,
        [string]$NodeBaseDir
    )

    $NodeExe = Get-PortableNodeExe -NodeBaseDir $NodeBaseDir
    if ($NodeExe) {
        return $NodeExe
    }

    Write-Host "Pobieram przenosny Node.js 20 LTS..." -ForegroundColor Cyan

    if (Test-Path $NodeBaseDir) {
        Remove-Item $NodeBaseDir -Recurse -Force -ErrorAction SilentlyContinue
    }
    New-Item -ItemType Directory -Force -Path $NodeBaseDir | Out-Null

    $NodeIndexUrl = "https://nodejs.org/dist/latest-v20.x/"
    $Index = Invoke-WebRequest -Uri $NodeIndexUrl -UseBasicParsing
    $ZipName = ([regex]::Matches($Index.Content, 'node-v20\.[0-9]+\.[0-9]+-win-x64\.zip') | ForEach-Object { $_.Value } | Select-Object -Unique | Select-Object -First 1)

    if ([string]::IsNullOrWhiteSpace($ZipName)) {
        throw "Nie znaleziono paczki Node.js 20 win-x64 na nodejs.org."
    }

    $ZipUrl = $NodeIndexUrl + $ZipName
    $ZipPath = Join-Path $ToolsDir $ZipName

    if (Test-Path $ZipPath) {
        Remove-Item $ZipPath -Force -ErrorAction SilentlyContinue
    }

    Write-Host "Pobieram: $ZipName" -ForegroundColor Cyan
    Invoke-WebRequest -Uri $ZipUrl -OutFile $ZipPath

    if (-not (Test-Path $ZipPath)) {
        throw "Nie udalo sie pobrac Node.js."
    }

    $ZipSizeMb = [math]::Round(((Get-Item $ZipPath).Length / 1MB), 1)
    if ($ZipSizeMb -lt 10) {
        throw "Pobrany plik Node.js jest podejrzanie maly: $ZipSizeMb MB."
    }

    Write-Host "Rozpakowuje Node.js..." -ForegroundColor Cyan

    $Extracted = $false
    $Tar = Get-Command tar.exe -ErrorAction SilentlyContinue
    if ($Tar) {
        & tar.exe -xf $ZipPath -C $NodeBaseDir
        if ($LASTEXITCODE -eq 0) {
            $Extracted = $true
        }
    }

    if (-not $Extracted) {
        try {
            Add-Type -AssemblyName System.IO.Compression.FileSystem
            [System.IO.Compression.ZipFile]::ExtractToDirectory($ZipPath, $NodeBaseDir)
            $Extracted = $true
        } catch {
            throw "Nie udalo sie rozpakowac Node.js: $($_.Exception.Message)"
        }
    }

    $NodeExe = Get-PortableNodeExe -NodeBaseDir $NodeBaseDir
    if (-not $NodeExe) {
        throw "Po rozpakowaniu nie znaleziono poprawnego node.exe v20."
    }

    return $NodeExe
}

function Get-PythonCommand {
    $Python = Get-Command python -ErrorAction SilentlyContinue
    if ($Python) {
        return @($Python.Source)
    }

    $Py = Get-Command py -ErrorAction SilentlyContinue
    if ($Py) {
        return @($Py.Source, "-3")
    }

    return $null
}

function Run-PythonValidation {
    param([string]$ProjectRoot)

    # Wymuszenie tablicy: bez @(...) PowerShell rozwija pojedynczy string
    # i $PythonCommand[0] zwraca tylko pierwszą literę ścieżki, np. "E" zamiast "E:\...\python.exe".
    $PythonCommand = @(Get-PythonCommand)
    if (-not $PythonCommand) {
        Write-Host "Pominieto validate_project.py - nie znaleziono Pythona w PATH." -ForegroundColor Yellow
        return
    }

    $PythonExe = $PythonCommand[0]
    $PythonArgs = @()
    if ($PythonCommand.Count -gt 1) {
        $PythonArgs += $PythonCommand[1..($PythonCommand.Count - 1)]
    }
    $PythonArgs += "validate_project.py"

    Run-Command $PythonExe $PythonArgs
}

function Get-ProjectIdFromFirebaserc {
    param([string]$FirebasercPath)

    if (-not (Test-Path $FirebasercPath)) {
        return ""
    }

    try {
        $Json = Get-Content -Path $FirebasercPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $DefaultProject = $Json.projects.PSObject.Properties["default"].Value
        if (-not [string]::IsNullOrWhiteSpace($DefaultProject)) {
            return [string]$DefaultProject
        }
    } catch {}

    return ""
}

function Save-ProjectIdToFirebaserc {
    param(
        [string]$FirebasercPath,
        [string]$ResolvedProjectId
    )

    $Content = @{
        projects = @{
            default = $ResolvedProjectId
        }
    } | ConvertTo-Json -Depth 5

    Set-Content -Path $FirebasercPath -Value $Content -Encoding UTF8
}

function Resolve-FirebaseProjectId {
    param(
        [string]$InputProjectId,
        [string]$ProjectRoot
    )

    if (-not [string]::IsNullOrWhiteSpace($InputProjectId)) {
        return $InputProjectId.Trim()
    }

    if (-not [string]::IsNullOrWhiteSpace($env:FIREBASE_PROJECT_ID)) {
        return $env:FIREBASE_PROJECT_ID.Trim()
    }

    $FirebasercPath = Join-Path $ProjectRoot ".firebaserc"
    $FromFile = Get-ProjectIdFromFirebaserc -FirebasercPath $FirebasercPath
    if (-not [string]::IsNullOrWhiteSpace($FromFile)) {
        return $FromFile.Trim()
    }

    Write-Host ""
    Write-Host "Nie znaleziono Firebase Project ID." -ForegroundColor Yellow
    Write-Host "Wpisz Project ID z Firebase Console dla konta wolak82, np. eskarbnik-fa364." -ForegroundColor Yellow
    $TypedProjectId = Read-Host "Firebase Project ID"

    if ([string]::IsNullOrWhiteSpace($TypedProjectId)) {
        throw "Nie podano Firebase Project ID."
    }

    $TypedProjectId = $TypedProjectId.Trim()
    Save-ProjectIdToFirebaserc -FirebasercPath $FirebasercPath -ResolvedProjectId $TypedProjectId
    Write-Host "Zapisano Project ID w lokalnym pliku .firebaserc." -ForegroundColor Cyan

    return $TypedProjectId
}

try {
    Write-Host "=== eSkarbnik - wdrozenie Firebase ===" -ForegroundColor Green

    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $ProjectRoot = Split-Path -Parent $ScriptDir
    Set-Location $ProjectRoot
    Write-Host "Folder projektu: $ProjectRoot" -ForegroundColor Cyan

    $ResolvedProjectId = Resolve-FirebaseProjectId -InputProjectId $ProjectId -ProjectRoot $ProjectRoot
    Write-Host "Projekt Firebase: $ResolvedProjectId" -ForegroundColor Cyan

    $env:NODE_OPTIONS = "--dns-result-order=ipv4first"

    $ToolsDir = Join-Path $ProjectRoot ".firebase_node20"
    $NodeBaseDir = Join-Path $ToolsDir "node"
    $NpmPrefix = Join-Path $ToolsDir "npm-global"

    New-Item -ItemType Directory -Force -Path $ToolsDir, $NpmPrefix | Out-Null

    $NodeExe = Install-PortableNode20 -ToolsDir $ToolsDir -NodeBaseDir $NodeBaseDir
    $NodeDir = Split-Path -Parent $NodeExe.FullName

    $env:Path = "$NodeDir;$NpmPrefix;$env:Path"
    $env:NPM_CONFIG_PREFIX = $NpmPrefix

    Write-Host "Node uzywany przez skrypt:" -ForegroundColor Cyan
    & $NodeExe.FullName -v

    $NodeVersion = (& $NodeExe.FullName -v).Trim()
    if ($NodeVersion -notlike "$RequiredNodeMajor*") {
        throw "Skrypt nie uzywa Node.js 20. Aktualnie: $NodeVersion"
    }

    $NpmCmd = Join-Path $NodeDir "npm.cmd"
    if (-not (Test-Path $NpmCmd)) {
        throw "Nie znaleziono npm.cmd w folderze Node.js: $NodeDir"
    }

    Write-Host "Kontrola projektu..." -ForegroundColor Cyan
    Run-PythonValidation -ProjectRoot $ProjectRoot

    Write-Host "Kontrola skladni JavaScript..." -ForegroundColor Cyan
    Run-Command $NodeExe.FullName @("--check", "app.js")
    Run-Command $NodeExe.FullName @("--check", "db.js")
    Run-Command $NodeExe.FullName @("--check", "service-worker.js")

    $FirebaseCmd = Join-Path $NpmPrefix "firebase.cmd"
    $NeedInstallFirebase = $true

    if (Test-Path $FirebaseCmd) {
        try {
            $CurrentFirebaseVersion = (& $FirebaseCmd --version).Trim()
            if ($CurrentFirebaseVersion -eq $FirebaseCliVersion) {
                $NeedInstallFirebase = $false
            }
        } catch {
            $NeedInstallFirebase = $true
        }
    }

    if ($NeedInstallFirebase) {
        Write-Host "Instaluje Firebase CLI $FirebaseCliVersion lokalnie dla tego projektu..." -ForegroundColor Cyan
        Run-Command $NpmCmd @("install", "-g", "firebase-tools@$FirebaseCliVersion")
    }

    if (-not (Test-Path $FirebaseCmd)) {
        throw "Nie znaleziono firebase.cmd po instalacji Firebase CLI."
    }

    Write-Host "Firebase CLI uzywany przez skrypt:" -ForegroundColor Cyan
    & $FirebaseCmd --version

    if (-not [string]::IsNullOrWhiteSpace($FirebaseAccount)) {
        Write-Host "Przelaczam konto Firebase CLI na: $FirebaseAccount" -ForegroundColor Cyan
        $AccountExit = Run-Command-NoThrow $FirebaseCmd @("login:use", $FirebaseAccount)
        if ($AccountExit -ne 0) {
            Write-Host "Nie udalo sie przelaczyc konta. Zaloguj konto i sprobuj ponownie." -ForegroundColor Yellow
            Run-Command $FirebaseCmd @("login:add", "--no-localhost")
            Run-Command $FirebaseCmd @("login:use", $FirebaseAccount)
        }
    }

    Write-Host "Sprawdzam zapisane logowanie Firebase..." -ForegroundColor Cyan
    Run-Command-NoThrow $FirebaseCmd @("login:list") | Out-Null

    Write-Host "Wgrywam aplikacje, reguly i indeksy Firestore do projektu: $ResolvedProjectId" -ForegroundColor Cyan
    $DeployExit = Run-Command-NoThrow $FirebaseCmd @("deploy", "--project", $ResolvedProjectId, "--only", "hosting,firestore")

    if ($DeployExit -ne 0) {
        Write-Host ""
        Write-Host "Pierwsza proba deploy nie przeszla." -ForegroundColor Yellow
        Write-Host "Uruchamiam ponowne logowanie Firebase. Wybierz konto Google, ktore ma dostep do projektu: $ResolvedProjectId" -ForegroundColor Yellow
        Write-Host "Po zalogowaniu ponowie deploy automatycznie." -ForegroundColor Yellow
        Run-Command $FirebaseCmd @("login", "--reauth", "--no-localhost")

        Write-Host "Ponawiam deploy..." -ForegroundColor Cyan
        Run-Command $FirebaseCmd @("deploy", "--project", $ResolvedProjectId, "--only", "hosting,firestore")
    }

    Write-Host ""
    Write-Host "Gotowe. Wdrozenie Firebase zakonczone poprawnie." -ForegroundColor Green
    Write-Host "Adres aplikacji:" -ForegroundColor Green
    Write-Host "https://$ResolvedProjectId.web.app" -ForegroundColor Yellow
    Write-Host "https://$ResolvedProjectId.firebaseapp.com" -ForegroundColor Yellow
    Write-Host ""
    pause
}
catch {
    Stop-WithPause $_.Exception.Message
}
