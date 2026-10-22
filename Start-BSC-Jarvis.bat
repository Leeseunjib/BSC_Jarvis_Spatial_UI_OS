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

powershell -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:7777/' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if %errorlevel%==0 (
  echo 서버가 이미 켜져 있습니다. 브라우저를 엽니다.
  start "" "http://localhost:7777"
  exit /b 0
)

echo 서버를 시작한 뒤, 응답이 오면 브라우저를 엽니다.
start "BSC_JARVIS_SERVER" cmd /k "node server.js"

powershell -NoProfile -Command "$ok = $false; foreach ($i in 1..30) { try { $r = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:7777/' -TimeoutSec 2; if ($r.StatusCode -eq 200) { $ok = $true; break } } catch {}; Start-Sleep -Milliseconds 400 }; if ($ok) { exit 0 } else { exit 1 }"
if %errorlevel% neq 0 (
  echo 서버가 15초 안에 열리지 않았습니다. BSC_JARVIS_SERVER 창의 오류를 확인해 주십시오.
  pause
  exit /b 1
)

start "" "http://localhost:7777"
echo 브라우저를 열었습니다. 서버 창은 닫지 마십시오.
pause
