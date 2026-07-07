# Skrot do publikacji na GitHub.
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
& (Join-Path $ScriptDir "publish_to_github.ps1") @args
