@echo off
chcp 65001 > nul
title BSC J.A.R.V.I.S. OS — Standalone Holographic Desktop App Launcher
cd /d "%~dp0"

echo ====================================================================
echo 🛡️ BSC J.A.R.V.I.S. OS (18-Studio + Open-Source TTS + Gemma 4)
echo 🌐 Launching Standalone Frameless Desktop App Mode...
echo ====================================================================

:: 1. Ensure Node Server on port 7777 is running
netstat -ano | findstr ":7777" > nul
if %errorlevel% neq 0 (
    start "BSC_JARVIS_SERVER" /min cmd /c "node server.js"
    timeout /t 2 /nobreak > nul
)

:: 2. Launch Edge or Chrome in Frameless Native Desktop App Mode (--app=http://localhost:7777)
start msedge --app=http://localhost:7777 --window-size=1680,980
exit
