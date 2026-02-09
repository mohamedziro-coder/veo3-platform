@echo off
echo Pushing updates to GitHub...
git add .
git commit -m "fix: resolve hydration error and React hooks order in voice page"
git push
echo Done!
pause
