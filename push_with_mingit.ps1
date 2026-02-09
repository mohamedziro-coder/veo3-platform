$ErrorActionPreference = "Stop"

$mingitUrl = "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.1/MinGit-2.47.1-64-bit.zip"
$mingitDir = Join-Path $PWD ".mingit"
$mingitZip = Join-Path $PWD "mingit.zip"

Write-Host "Downloading MinGit..."
Invoke-WebRequest -Uri $mingitUrl -OutFile $mingitZip

if (-not (Test-Path $mingitDir)) {
    New-Item -ItemType Directory -Path $mingitDir | Out-Null
}

Write-Host "Extracting MinGit..."
Expand-Archive -Path $mingitZip -DestinationPath $mingitDir -Force

$env:Path = "$mingitDir\cmd;$env:Path"

Write-Host "Verifying Git..."
git --version

Write-Host "Pushing changes..."
git add .
git commit -m "fix: resolve hydration error and React hooks order in voice page"
git push

Write-Host "Done!"
