$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "Uruchamiam lokalny serwer PWA..." -ForegroundColor Cyan
Write-Host "Adres: http://localhost:8080" -ForegroundColor Green
Write-Host "Zatrzymanie: Ctrl + C" -ForegroundColor Yellow

python -m http.server 8080
