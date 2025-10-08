<#
upload-to-github.ps1
A helper PowerShell script to prepare and push the current workspace to a remote GitHub repository.
Behavior and important notes:
- DOES NOT create or modify any README file.
- Initializes a local git repo if none exists.
- Adds and commits all files.
- Creates/renames the local branch to `main`.
- Adds the remote you supplied and pushes.
- If the remote already contains commits, the push may be rejected. You can re-run the script with -Force to force-push (overwrites remote branch).

Usage examples (run in workspace root):
  .\upload-to-github.ps1 -Remote "https://github.com/KunalBagheleIT27/DocuFlow.git"
  .\upload-to-github.ps1 -Remote "https://github.com/KunalBagheleIT27/DocuFlow.git" -Force
#>
param(
    [string]$Remote = "https://github.com/KunalBagheleIT27/DocuFlow.git",
    <#
    upload-to-github.ps1
    A helper PowerShell script to prepare and push the current workspace to a remote GitHub repository.
    Behavior and important notes:
    - DOES NOT create or modify any README file.
    - Initializes a local git repo if none exists.
    - Adds and commits all files.
    - Creates/renames the local branch to `main`.
    - Adds the remote you supplied and pushes.
    - If the remote already contains commits, the push may be rejected. You can re-run the script with -Force to force-push (overwrites remote branch).

    Usage examples (run in workspace root):
      .\upload-to-github.ps1 -Remote "https://github.com/KunalBagheleIT27/DocuFlow.git"
      .\upload-to-github.ps1 -Remote "https://github.com/KunalBagheleIT27/DocuFlow.git" -Force
    #>
    param(
        [string]$Remote = "https://github.com/KunalBagheleIT27/DocuFlow.git",
        <#
        upload-to-github.ps1
        A helper PowerShell script to prepare and push the current workspace to a remote GitHub repository.
        Behavior and important notes:
        - DOES NOT create or modify any README file.
        - Initializes a local git repo if none exists.
        - Adds and commits all files.
        - Creates/renames the local branch to `main`.
        - Adds the remote you supplied and pushes.
        - If the remote already contains commits, the push may be rejected. You can re-run the script with -Force to force-push (overwrites remote branch).

        Usage examples (run in workspace root):
          .\upload-to-github.ps1 -Remote "https://github.com/KunalBagheleIT27/DocuFlow.git"
          .\upload-to-github.ps1 -Remote "https://github.com/KunalBagheleIT27/DocuFlow.git" -Force
        #>
        param(
            [string]$Remote = "https://github.com/KunalBagheleIT27/DocuFlow.git",
            <#
            upload-to-github.ps1
            A helper PowerShell script to prepare and push the current workspace to a remote GitHub repository.
            This script does NOT create or modify README.md.

            Usage (from workspace root):
              .\upload-to-github.ps1 -Remote "https://github.com/KunalBagheleIT27/DocuFlow.git"
              .\upload-to-github.ps1 -Remote "https://github.com/KunalBagheleIT27/DocuFlow.git" -Force
            #>

            param(
                [string]$Remote = "https://github.com/KunalBagheleIT27/DocuFlow.git",
                [switch]$Force
            )

            function Ensure-Git {
                if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
                    Write-Error "git is not installed or not on PATH. Install Git and try again."
                    exit 2
                }
            }

            function Ensure-GitUserConfig {
                $name = git config --local user.name 2>$null
                $email = git config --local user.email 2>$null
                if ([string]::IsNullOrWhiteSpace($name)) {
                    Write-Host "Local git user.name not set. Setting temporary value 'Your Name'." -ForegroundColor Yellow
                    git config --local user.name "Your Name"
                }
                if ([string]::IsNullOrWhiteSpace($email)) {
                    Write-Host "Local git user.email not set. Setting temporary value 'you@example.com'." -ForegroundColor Yellow
                    git config --local user.email "you@example.com"
                }
            }

            try {
                Push-Location -ErrorAction Stop

                Ensure-Git

                if (-not (Test-Path .git)) {
                    Write-Host "No git repository found. Initializing..." -ForegroundColor Cyan
                    git init
                } else {
                    Write-Host "Git repository already initialized." -ForegroundColor Green
                }

                Ensure-GitUserConfig

                # Stage all changes
                git add -A

                # Commit if there are changes
                $status = git status --porcelain
                if (-not [string]::IsNullOrWhiteSpace($status)) {
                    git commit -m "Initial commit - adding project files"
                    if ($LASTEXITCODE -eq 0) { Write-Host "Committed changes." -ForegroundColor Green }
                    else { Write-Host "Commit returned non-zero exit code." -ForegroundColor Yellow }
                } else {
                    Write-Host "No changes to commit." -ForegroundColor Yellow
                }

                # Ensure branch named main
                git branch -M main 2>$null

                # Add or update remote origin
                $existing = git remote get-url origin 2>$null
                if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($existing)) {
                    Write-Host "Remote 'origin' exists. Setting URL to $Remote" -ForegroundColor Cyan
                    git remote set-url origin $Remote
                } else {
                    Write-Host "Adding remote origin -> $Remote" -ForegroundColor Cyan
                    git remote add origin $Remote
                }

                # Attempt to push
                Write-Host "Pushing to origin main..." -ForegroundColor Cyan
                if ($Force.IsPresent) {
                    git push -u origin main --force
                } else {
                    git push -u origin main
                }

                if ($LASTEXITCODE -eq 0) { Write-Host "Push succeeded." -ForegroundColor Green }
                else {
                    Write-Host "Push failed. If the remote contains commits and you want to overwrite it, re-run with -Force to force-push:" -ForegroundColor Yellow
                    Write-Host "  .\\upload-to-github.ps1 -Remote '$Remote' -Force" -ForegroundColor Yellow
                }

            } catch {
                Write-Error ("An unexpected error occurred: {0}" -f $_)
            } finally {
                Pop-Location
            }
