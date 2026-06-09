#Requires -RunAsAdministrator
<#
.SYNOPSIS
  Enable WSL2 + Virtual Machine Platform for Docker Desktop on Windows.

.NOTES
  Run in PowerShell as Administrator, then reboot.
  Also enable virtualization (Intel VT-x / AMD-V) in BIOS/UEFI if WSL still fails.

.EXAMPLE
  Set-ExecutionPolicy -Scope Process Bypass
  .\scripts\setup-docker-wsl.ps1
#>
$ErrorActionPreference = "Stop"

Write-Host "Enabling Windows features for WSL2..." -ForegroundColor Cyan

dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

Write-Host "Setting WSL default version to 2..." -ForegroundColor Cyan
wsl --set-default-version 2

$distros = wsl -l -q 2>$null
if (-not $distros) {
  Write-Host "Installing Ubuntu (WSL2)..." -ForegroundColor Cyan
  wsl --install -d Ubuntu --no-launch
} else {
  Write-Host "WSL distro already present: $distros" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done. REBOOT your PC, then:" -ForegroundColor Green
Write-Host "  1. Start 'Docker Desktop' from the Start menu"
Write-Host "  2. Wait until Docker says it is running"
Write-Host "  3. In this repo:"
Write-Host "       docker compose up -d"
Write-Host "       npm run db:migrate"
