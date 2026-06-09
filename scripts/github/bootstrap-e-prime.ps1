#Requires -Version 5.1
<#
.SYNOPSIS
  Creates GitHub milestones, labels, issues, and project board for E-Prime rebuild.

.PARAMETER DryRun
  Print actions without executing.

.EXAMPLE
  .\scripts\github\bootstrap-e-prime.ps1
  .\scripts\github\bootstrap-e-prime.ps1 -DryRun
#>
param(
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$IssuesFile = Join-Path $RepoRoot "docs\github\issues.json"

Set-Location $RepoRoot

function Resolve-GhExe {
  $cmd = Get-Command gh -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  $candidates = @(
    "${env:ProgramFiles}\GitHub CLI\gh.exe",
    "${env:ProgramFiles(x86)}\GitHub CLI\gh.exe",
    "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
  )
  foreach ($path in $candidates) {
    if (Test-Path $path) { return $path }
  }

  throw @"
GitHub CLI (gh) not found.

Install:
  winget install --id GitHub.cli -e

Then either restart your terminal, or run:
  `$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')

Full path (if already installed):
  & `"${env:ProgramFiles}\GitHub CLI\gh.exe`" auth login
"@
}

$script:GhExe = Resolve-GhExe

function Invoke-Gh {
  param([string[]]$GhArgs)
  if ($DryRun) {
    Write-Host "[dry-run] gh $($GhArgs -join ' ')" -ForegroundColor DarkGray
    return $null
  }
  $output = & $script:GhExe @GhArgs
  if ($LASTEXITCODE -ne 0) {
    throw "gh failed: gh $($GhArgs -join ' ') -> $output"
  }
  return $output
}

function Get-GhJson {
  param([string[]]$GhArgs)
  $raw = Invoke-Gh -GhArgs $GhArgs
  if ($null -eq $raw) { return $null }
  $text = if ($raw -is [array]) { $raw -join "`n" } else { $raw.ToString() }
  $text = $text.Trim()
  if (-not $text) { return $null }
  return $text | ConvertFrom-Json
}

function Get-GhText {
  param($Output)
  if ($null -eq $Output) { return "" }
  if ($Output -is [array]) {
    return ($Output | Select-Object -First 1).ToString().Trim()
  }
  return $Output.ToString().Trim()
}

function Test-GhAuth {
  try {
    Invoke-Gh -GhArgs @("auth", "status") | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Get-RepoSlug {
  $remote = git remote get-url origin 2>$null
  if (-not $remote) { throw "No git remote 'origin' found." }
  if ($remote -match "github\.com[:/](.+?)(?:\.git)?$") {
    return $Matches[1]
  }
  throw "Could not parse GitHub repo from remote: $remote"
}

function Ensure-Milestone {
  param([string]$Title, [string]$Description)
  if ($DryRun) {
    Write-Host "[dry-run] ensure milestone: $Title"
    return
  }
  $milestones = Get-GhJson -GhArgs @("api", "repos/{owner}/{repo}/milestones", "--paginate")
  if ($milestones | Where-Object { $_.title -eq $Title }) {
    Write-Host "Milestone exists: $Title" -ForegroundColor Yellow
    return
  }
  Invoke-Gh -GhArgs @(
    "api", "repos/{owner}/{repo}/milestones",
    "-f", "title=$Title",
    "-f", "description=$Description",
    "-f", "state=open"
  ) | Out-Null
  Write-Host "Created milestone: $Title" -ForegroundColor Green
}

function Ensure-Label {
  param([string]$Name, [string]$Color, [string]$Description)
  if ($DryRun) {
    Write-Host "[dry-run] ensure label: $Name"
    return
  }
  $labels = Get-GhJson -GhArgs @("label", "list", "--limit", "200", "--json", "name")
  if ($labels | Where-Object { $_.name -eq $Name }) {
    Write-Host "Label exists: $Name" -ForegroundColor Yellow
    return
  }
  Invoke-Gh -GhArgs @("label", "create", $Name, "--color", $Color, "--description", $Description) | Out-Null
  Write-Host "Created label: $Name" -ForegroundColor Green
}

function Get-MilestoneTitle {
  param([string]$Title)
  if ($DryRun) { return "M0 - Planning" }
  $milestones = Get-GhJson -GhArgs @("api", "repos/{owner}/{repo}/milestones", "--paginate")
  $match = $milestones | Where-Object { $_.title -eq $Title } | Select-Object -First 1
  if (-not $match) {
    throw "Milestone not found: $Title"
  }
  return $match.title
}

function Find-ExistingIssue {
  param([string]$Title)
  if ($DryRun) { return $null }
  $issues = Get-GhJson -GhArgs @("issue", "list", "--label", "e-prime", "--state", "all", "--limit", "100", "--json", "number,title")
  if (-not $issues) { return $null }
  $match = $issues | Where-Object { $_.title -eq $Title } | Select-Object -First 1
  if ($match) { return [int]$match.number }
  return $null
}

function New-Issue {
  param(
    [string]$Title,
    [string]$Body,
    [string]$Milestone,
    [string[]]$Labels
  )
  $existing = Find-ExistingIssue -Title $Title
  if ($existing) {
    Write-Host "Issue exists: #$existing $Title" -ForegroundColor Yellow
    return $existing
  }

  $milestoneTitle = Get-MilestoneTitle -Title $Milestone
  $labelArgs = @()
  foreach ($l in $Labels) { $labelArgs += @("--label", $l) }

  if ($DryRun) {
    Write-Host "[dry-run] create issue: $Title" -ForegroundColor DarkGray
    return 0
  }

  $bodyFile = New-TemporaryFile
  try {
    Set-Content -Path $bodyFile -Value $Body -Encoding UTF8
    $url = Get-GhText (Invoke-Gh -GhArgs @(
      @(
        "issue", "create",
        "--title", $Title,
        "--body-file", $bodyFile,
        "--milestone", $milestoneTitle
      ) + $labelArgs
    ))
    Write-Host "Created: $url" -ForegroundColor Green
    if ($url -match "/issues/(\d+)") { return [int]$Matches[1] }
    return 0
  } finally {
    Remove-Item $bodyFile -Force -ErrorAction SilentlyContinue
  }
}

function New-Project {
  param([int[]]$IssueNumbers)
  if ($DryRun) {
    Write-Host "[dry-run] create project: E-Prime Rebuild"
    return
  }

  try {
    Invoke-Gh -GhArgs @("auth", "status") | Out-Null
  } catch {
    throw $_
  }

  $owner = Get-GhText (Invoke-Gh -GhArgs @("repo", "view", "--json", "owner", "--jq", ".owner.login"))
  $existing = ""
  $projects = Get-GhJson -GhArgs @("project", "list", "--owner", $owner, "--format", "json")
  if ($projects.projects) {
    $match = $projects.projects | Where-Object { $_.title -eq "E-Prime Rebuild" } | Select-Object -First 1
    if ($match) { $existing = "$($match.number)" }
  }
  if ($existing) {
    Write-Host "Project exists: E-Prime Rebuild (#$existing)" -ForegroundColor Yellow
    $projectNum = $existing
  } else {
    $projectJson = Get-GhText (Invoke-Gh -GhArgs @(
      "project", "create",
      "--owner", $owner,
      "--title", "E-Prime Rebuild",
      "--format", "json"
    ))
    $project = $projectJson | ConvertFrom-Json
    $projectNum = $project.number
    Write-Host "Created project: $($project.url)" -ForegroundColor Green
  }

  foreach ($num in $IssueNumbers) {
    if ($num -le 0) { continue }
    try {
      Invoke-Gh -GhArgs @("project", "item-add", $projectNum, "--owner", $owner, "--url", "https://github.com/$(Get-RepoSlug)/issues/$num") | Out-Null
    } catch {
      Write-Host "Could not add issue #$num to project (may already exist)" -ForegroundColor Yellow
    }
  }

  $ownerName = $owner
  Write-Host ""
  Write-Host "Project board: https://github.com/users/$ownerName/projects/$projectNum" -ForegroundColor Cyan
}

# --- Main ---

Write-Host "E-Prime GitHub Bootstrap" -ForegroundColor Cyan
Write-Host "Repo: $(Get-RepoSlug)"

if (-not $DryRun -and -not (Test-GhAuth)) {
  Write-Host ""
  Write-Host "ERROR: Not logged in to GitHub CLI." -ForegroundColor Red
  Write-Host "Run: gh auth login" -ForegroundColor Yellow
  Write-Host "Then re-run: .\scripts\github\bootstrap-e-prime.ps1" -ForegroundColor Yellow
  exit 1
}

if (-not (Test-Path $IssuesFile)) {
  throw "Missing issues file: $IssuesFile"
}

$config = Get-Content $IssuesFile -Raw | ConvertFrom-Json

Write-Host "`n--- Milestones ---" -ForegroundColor Cyan
foreach ($m in $config.milestones) {
  Ensure-Milestone -Title $m.title -Description $m.description
}

Write-Host "`n--- Labels ---" -ForegroundColor Cyan
foreach ($l in $config.labels) {
  Ensure-Label -Name $l.name -Color $l.color -Description $l.description
}

Write-Host "`n--- Issues ---" -ForegroundColor Cyan
$issueNumbers = @()
foreach ($i in $config.issues) {
  $num = New-Issue -Title $i.title -Body $i.body -Milestone $i.milestone -Labels $i.labels
  $issueNumbers += $num
}

Write-Host "`n--- Project Board ---" -ForegroundColor Cyan
try {
  New-Project -IssueNumbers $issueNumbers
} catch {
  Write-Host "Project board skipped: $_" -ForegroundColor Yellow
  Write-Host "Grant project scope, then re-run:" -ForegroundColor Yellow
  Write-Host "  gh auth refresh -h github.com -s read:project,project" -ForegroundColor Yellow
  Write-Host "  .\scripts\github\bootstrap-e-prime.ps1" -ForegroundColor Yellow
  Write-Host "Or create manually: https://github.com/users/Dilogoat/projects/new" -ForegroundColor Yellow
}

Write-Host "`nDone." -ForegroundColor Green
Write-Host "Next: Start work on Issue #1 (repo bootstrap). See docs/E_PRIME_PLAN.md"
