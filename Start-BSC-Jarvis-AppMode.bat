@echo off
chcp 65001 > nul
title BSC J.A.R.V.I.S. OS — Standalone Holographic Desktop App Launcher
cd /d "%~dp0"

echo ====================================================================
echo 🛡️ BSC J.A.R.V.I.S. OS (18-Studio + Open-Source TTS + Gemma 4)
echo 🌐 Launching Standalone Frameless Desktop App Mode...
echo ====================================================================

:: 1. Ensure Node Server on port 7777 is actually answering before the app window opens
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:7777/' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %errorlevel% neq 0 (
    start "BSC_JARVIS_SERVER" /min cmd /c "node server.js"
    powershell -NoProfile -Command "$ok = $false; foreach ($i in 1..30) { try { $r = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:7777/' -TimeoutSec 2; if ($r.StatusCode -eq 200) { $ok = $true; break } } catch {}; Start-Sleep -Milliseconds 400 }; if ($ok) { exit 0 } else { exit 1 }"
    if %errorlevel% neq 0 (
        echo 서버가 열리지 않았습니다. 포트 7777을 확인해 주십시오.
        pause
        exit /b 1
    )
)

:: 2. Launch Edge or Chrome in Frameless Native Desktop App Mode (--app=http://localhost:7777)
start msedge --app=http://localhost:7777 --window-size=1680,980
exit
