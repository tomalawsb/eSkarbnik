$ErrorActionPreference = "Stop"
Set-Location -Path (Join-Path $PSScriptRoot "..")

python validate_project.py
node --check app.js
node --check db.js
node --check service-worker.js

Write-Host "OK: projekt gotowy do publikacji." -ForegroundColor Green
