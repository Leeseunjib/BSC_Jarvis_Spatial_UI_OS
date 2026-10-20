@echo off
chcp 65001 >nul
title BSC J.A.R.V.I.S. (Autonomous Agent OS - Coram Deo ^& Together)
cd /d "%~dp0"

echo ============================================================================
echo 🛡️  BSC J.A.R.V.I.S. (Autonomous Agent OS) 기동 중...
echo ✝️  Worldview: Coram Deo ^& Together (이건우 대표님 전용 청지기 관제탑)
echo 🌐  HUD URL  : http://localhost:7777
echo ============================================================================

node scripts/build-brain-map.js
start "" "http://localhost:7777"
node server.js
pause
