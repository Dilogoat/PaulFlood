# GitHub Bootstrap — E-Prime

Creates milestones, labels, issues (#1–#28), and a GitHub Project board for the multi-agent rebuild.

## Prerequisites

1. [GitHub CLI](https://cli.github.com/) installed
2. Authenticated with project scopes:
   ```powershell
   gh auth login -s repo,read:org,project,read:project
   ```
   Or refresh an existing login:
   ```powershell
   gh auth refresh -h github.com -s read:project,project
   ```
3. Repo access to `Dilogoat/PaulFlood`

### If `gh` is not recognized

GitHub CLI is usually installed to `C:\Program Files\GitHub CLI\gh.exe`. New terminals may not see it until you **restart the terminal** (or restart Cursor).

**Option A — refresh PATH in the current session:**

```powershell
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
gh --version
```

**Option B — use the full path:**

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" --version
& "C:\Program Files\GitHub CLI\gh.exe" auth login
```

**Option C — install if missing:**

```powershell
winget install --id GitHub.cli -e
```

The bootstrap script (`bootstrap-e-prime.ps1`) resolves `gh` from these locations automatically — you can run it even when `gh` alone fails in PATH.

## Run

```powershell
cd c:\Users\jonat\OneDrive\Documents\Cursor\PaulFlood
.\scripts\github\bootstrap-e-prime.ps1
```

Optional dry-run (prints commands without executing):

```powershell
.\scripts\github\bootstrap-e-prime.ps1 -DryRun
```

## What gets created

| Object | Count | Details |
|--------|-------|---------|
| Milestones | 7 | M0–M6 |
| Labels | 18 | `agent:*`, `type:*`, `priority:*` |
| Issues | 28 | Numbered #1–#28; see `issues.json` |
| Project | 1 | "E-Prime Rebuild" with Status field |

## After bootstrap

1. Open the project board: link printed by script
2. Assign yourself (or agents) to issues by `agent:*` label
3. Start with **#1** only — branch/tag setup before any feature PRs
4. Pin issue **#1** as the tracking epic on the repo (optional)

## Re-running

The script is idempotent where possible:
- Skips milestones/labels that already exist
- Issues are only created if title not found (fuzzy match on `[E-Prime]` prefix)

To force fresh issues, delete existing `[E-Prime]` issues first.

## Manual fallback

If `gh` is unavailable, copy issue bodies from `docs/github/issues/` into GitHub UI manually.
