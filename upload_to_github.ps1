# ZenTask Deploy Helper
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       ZenTask GitHub Push Helper       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ensure we are in the correct directory
Set-Location "C:\Users\USER\.gemini\antigravity\scratch\task-management-system"

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "Initializing Git..." -ForegroundColor Yellow
    git init
}

# Set remote origin URL
Write-Host "Setting remote origin to loki77-star/zentasks..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/loki77-star/zentasks.git

# Set local identity in case it is missing
git config user.email "dev@zentask.com"
git config user.name "ZenTask Developer"

# Add and commit files
Write-Host "Staging and committing files..." -ForegroundColor Yellow
git add -A
git commit -m "feat: restructure project for direct Vercel hosting" 2>$null

# Perform the push
Write-Host ""
Write-Host "Pushing to GitHub (https://github.com/loki77-star/zentasks)..." -ForegroundColor Green
Write-Host "If prompted, please log in or authorize GitHub in the browser window." -ForegroundColor Yellow
Write-Host ""

git push -u origin master --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host " SUCCESS! Files successfully pushed to GitHub.     " -ForegroundColor Green
    Write-Host " Vercel will now deploy automatically.             " -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Red
    Write-Host " ERROR: Push failed.                              " -ForegroundColor Red
    Write-Host " Make sure you created 'zentasks' on your GitHub. " -ForegroundColor Red
    Write-Host "==================================================" -ForegroundColor Red
}

Write-Host ""
Read-Host -Prompt "Press Enter to exit..."
