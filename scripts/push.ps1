<#
.SYNOPSIS
  Stage all changes, commit with the given message and push to GitHub.
.EXAMPLE
  .\scripts\push.ps1 "feat: add scan folders"
  .\scripts\push.ps1 "fix: handle missing exe path" -NoPush
#>
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Message,

    # Commit only, do not push
    [switch]$NoPush,

    # Skip the sensitive-file check
    [switch]$Force
)

function Invoke-Git {
    & git @args
    if ($LASTEXITCODE -ne 0) {
        throw "git $($args -join ' ') failed (exit code $LASTEXITCODE)"
    }
}

# Always run from the repository root, wherever the script is called from
$repoRoot = & git rev-parse --show-toplevel 2>$null
if ($LASTEXITCODE -ne 0) {
    throw "This folder is not inside a git repository."
}
Set-Location $repoRoot

$changes = & git status --porcelain
if (-not $changes) {
    Write-Host "Nothing to commit. Working tree is clean." -ForegroundColor Yellow
    exit 0
}

# Soft check: Conventional Commits style (feat, fix, refactor, ...)
$pattern = '^(feat|fix|refactor|docs|style|test|chore|perf|build|ci)(\([\w\-]+\))?: .+'
if ($Message -notmatch $pattern) {
    Write-Host "Tip: use a prefix like 'feat: ...' or 'fix(scope): ...' for a cleaner history." -ForegroundColor Yellow
}

# Block files that should never be pushed (secrets, keys, local databases)
if (-not $Force) {
    $risky = $changes | Where-Object { $_ -match '(\.env(\.|"?$)|\.(pem|key|pfx|db|sqlite3?)"?$)' }
    if ($risky) {
        Write-Host "Sensitive-looking files found, aborting:" -ForegroundColor Red
        $risky | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
        Write-Host "Add them to .gitignore, or re-run with -Force to push anyway." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Changes to commit:" -ForegroundColor Cyan
& git status --short

Invoke-Git add -A
Invoke-Git commit -m $Message

if ($NoPush) {
    Write-Host "Committed locally. Push skipped." -ForegroundColor Green
    exit 0
}

$branch = (& git rev-parse --abbrev-ref HEAD).Trim()
& git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    Invoke-Git push
} else {
    Invoke-Git push -u origin $branch
}

Write-Host "Done: pushed '$Message' to origin/$branch" -ForegroundColor Green