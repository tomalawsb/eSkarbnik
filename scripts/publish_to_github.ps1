# eSkarbnik - publikacja kodu na GitHub
# Repo: https://github.com/tomalawsb/eSkarbnik
# Ten skrypt pilnuje, zeby na GitHub NIE trafial lokalny Node z .firebase_node20.

param(
    [string]$RepoUrl = "https://github.com/tomalawsb/eSkarbnik.git",
    [string]$Branch = "main",
    [string]$CommitMessage = "eSkarbnik - aktualizacja",
    [switch]$Force
)

$ErrorActionPreference = "Stop"

try {
    chcp 65001 | Out-Null
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    [Console]::InputEncoding = [System.Text.Encoding]::UTF8
} catch {}

function Stop-WithPause {
    param([string]$Message)

    Write-Host ""
    if (-not [string]::IsNullOrWhiteSpace($Message)) {
        Write-Host $Message -ForegroundColor Red
        Write-Host ""
    }
    Write-Host "Publikacja na GitHub NIE zostala wykonana." -ForegroundColor Red
    Write-Host ""
    pause
    exit 1
}

function Run-Git {
    param([string[]]$Arguments)

    Write-Host ""
    Write-Host ("> git " + ($Arguments -join " ")) -ForegroundColor DarkGray
    git @Arguments
    $Exit = $LASTEXITCODE
    if ($Exit -ne 0) {
        throw "Git zakonczyl sie bledem ($Exit): git $($Arguments -join ' ')"
    }
}

function Get-GitOutput {
    param([string[]]$Arguments)

    $OldErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        $Output = git @Arguments 2>$null
        $Exit = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $OldErrorActionPreference
    }

    if ($Exit -eq 0) {
        return ($Output -join "`n").Trim()
    }
    return ""
}

function Ensure-IgnoreFile {
    $GitignorePath = Join-Path (Get-Location) ".gitignore"
    $LinesToEnsure = @(
        ".firebase_node20",
        ".firebase_node20/",
        "node_modules/",
        ".firebase/",
        "firebase-debug.log",
        "firestore-debug.log",
        "ui-debug.log",
        "*.zip",
        "*.bak",
        "*.tmp",
        ".env",
        ".env.*",
        ".firebaserc",
        "firebase-service-account*.json",
        "service-account*.json"
    )

    if (Test-Path $GitignorePath) {
        $Content = Get-Content -Path $GitignorePath -Raw -Encoding UTF8
    } else {
        $Content = ""
    }

    foreach ($Line in $LinesToEnsure) {
        if ($Content -notmatch [regex]::Escape($Line)) {
            $Content = $Content.TrimEnd() + "`r`n" + $Line + "`r`n"
        }
    }

    Set-Content -Path $GitignorePath -Value $Content -Encoding UTF8

    $AttrPath = Join-Path (Get-Location) ".gitattributes"
    if (-not (Test-Path $AttrPath)) {
        Set-Content -Path $AttrPath -Value "* text=auto eol=lf`n*.png binary`n*.jpg binary`n*.jpeg binary`n*.webp binary`n*.ico binary`n*.exe binary`n" -Encoding UTF8
    }
}

function Test-HeadContainsFirebaseNode {
    $Tracked = Get-GitOutput @("ls-tree", "-r", "--name-only", "HEAD")
    if ([string]::IsNullOrWhiteSpace($Tracked)) {
        return $false
    }
    return ($Tracked -split "`n" | Where-Object { $_ -like ".firebase_node20/*" } | Select-Object -First 1) -ne $null
}

try {
    Write-Host "=== eSkarbnik - publikacja GitHub ===" -ForegroundColor Green

    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $ProjectRoot = Split-Path -Parent $ScriptDir
    Set-Location $ProjectRoot
    Write-Host "Folder projektu: $ProjectRoot" -ForegroundColor Cyan

    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw "Brak Git w systemie. Zainstaluj Git dla Windows."
    }

    Ensure-IgnoreFile

    if (Test-Path ".git") {
        if (Test-HeadContainsFirebaseNode) {
            Write-Host "W lokalnej historii Git wykryto .firebase_node20. Czyszcze lokalne repo, zeby nie wyslac Node.js na GitHub." -ForegroundColor Yellow
            Remove-Item -Recurse -Force ".git"
        }
    }

    if (-not (Test-Path ".git")) {
        Write-Host "Inicjalizuje lokalne repozytorium Git..." -ForegroundColor Cyan
        Run-Git @("init")
    }

    Run-Git @("config", "core.autocrlf", "false")

    $CurrentBranch = Get-GitOutput @("branch", "--show-current")
    if ([string]::IsNullOrWhiteSpace($CurrentBranch)) {
        Run-Git @("checkout", "-B", $Branch)
    } elseif ($CurrentBranch -ne $Branch) {
        Run-Git @("branch", "-M", $Branch)
    }

    $RemoteListText = Get-GitOutput @("remote")
    $RemoteList = @()
    if (-not [string]::IsNullOrWhiteSpace($RemoteListText)) {
        $RemoteList = $RemoteListText -split "`n"
    }

    $CurrentOrigin = ""
    if ($RemoteList -contains "origin") {
        $CurrentOrigin = Get-GitOutput @("remote", "get-url", "origin")
    }

    if ([string]::IsNullOrWhiteSpace($CurrentOrigin)) {
        Run-Git @("remote", "add", "origin", $RepoUrl)
    } elseif ($CurrentOrigin -ne $RepoUrl) {
        Write-Host "Zmieniam origin:" -ForegroundColor Yellow
        Write-Host "Stary: $CurrentOrigin" -ForegroundColor Yellow
        Write-Host "Nowy:  $RepoUrl" -ForegroundColor Yellow
        Run-Git @("remote", "set-url", "origin", $RepoUrl)
    } else {
        Write-Host "Origin GitHub ustawiony poprawnie: $CurrentOrigin" -ForegroundColor Green
    }

    Write-Host "Sprawdzam, czy .firebase_node20 jest ignorowane przez Git..." -ForegroundColor Cyan
    $IgnoredNode = Get-GitOutput @("check-ignore", ".firebase_node20/")
    if ([string]::IsNullOrWhiteSpace($IgnoredNode)) {
        $IgnoredNode = Get-GitOutput @("check-ignore", ".firebase_node20")
    }
    if ([string]::IsNullOrWhiteSpace($IgnoredNode)) {
        throw ".firebase_node20 nie jest ignorowane przez Git. Sprawdz plik .gitignore."
    }

    Run-Git @("add", ".")

    $TrackedBad = Get-GitOutput @("ls-files", ".firebase_node20")
    if (-not [string]::IsNullOrWhiteSpace($TrackedBad)) {
        Run-Git @("rm", "-r", "--cached", ".firebase_node20")
    }

    $HasChanges = Get-GitOutput @("status", "--porcelain")
    if (-not [string]::IsNullOrWhiteSpace($HasChanges)) {
        Run-Git @("commit", "-m", $CommitMessage)
    } else {
        Write-Host "Brak zmian do zatwierdzenia." -ForegroundColor Yellow
    }

    if ($Force) {
        Write-Host "Wysylam z nadpisaniem starej historii GitHub." -ForegroundColor Yellow
        Run-Git @("push", "-u", "origin", $Branch, "--force")
    } else {
        Run-Git @("push", "-u", "origin", $Branch)
    }

    Write-Host ""
    Write-Host "Gotowe. Kod wyslany do GitHub." -ForegroundColor Green
    Write-Host $RepoUrl -ForegroundColor Yellow
    Write-Host ""
    pause
}
catch {
    Write-Host ""
    Write-Host "Jesli GitHub odrzucil push, bo repo ma juz stara historie, uruchom:" -ForegroundColor Yellow
    Write-Host ".\publish_to_github.ps1 -Force" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Jesli jestes w folderze glownym projektu, uruchom:" -ForegroundColor Yellow
    Write-Host ".\scripts\publish_to_github.ps1 -Force" -ForegroundColor Yellow
    Stop-WithPause $_.Exception.Message
}
