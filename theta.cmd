@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\run-cli.ps1" %*
exit /b %errorlevel%
