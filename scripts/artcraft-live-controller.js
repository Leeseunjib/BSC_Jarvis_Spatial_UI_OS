/**
 * ============================================================================
 * 🎨 BSC J.A.R.V.I.S. OS × ArtCraft 13 Creative Suite — Live Control & Screen Bridge
 * ============================================================================
 * - Connects J.A.R.V.I.S. OS directly to all 13 native Rust ArtCraft apps + Launcher
 * - Syncs %LOCALAPPDATA%\ArtCraft\ai\connections.json (craft-ai-integrations SharedStore)
 *   with local Ollama Gemma 4 (gemma4:e4b / e2b / 31b) & J.A.R.V.I.S. AI Bridge
 * - Drives apps via:
 *   1) Native Loopback JSON-Lines Control Protocol (--control <port> --control-token <hex>)
 *      -> ui.screenshot, ui.inspect, engine.execute, ui.set, ui.click, ui.pointer, ui.key, ui.type
 *   2) Win32 Native Window Capture & Input Bridge (GetWindowRect + CopyFromScreen + SendKeys/Mouse)
 *      for DX12 apps without --control flag
 */

const fs = require('fs');
const path = require('path');
const net = require('net');
const os = require('os');
const { spawn, execFileSync } = require('child_process');

const SUITE_DIR = 'C:/BeausCreators/05.BSC_Skill_Warehouse/1.Imported_Skills/2026-10-19_TechPack/artcraft-suite';
const LAUNCHER_DIR = path.join(SUITE_DIR, 'artcraft-launcher-portable/artcraft-launcher-0.5.1-windows-x64-portable');
const APPS_DIR = path.join(LAUNCHER_DIR, 'ArtCraftLauncherData/data/apps');
const LAUNCHER_EXE = path.join(LAUNCHER_DIR, 'artcraft-launcher.exe');

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const AUTOMATION_WORK_DIR = path.join(WORKSPACE_ROOT, 'public', 'data', 'artcraft_workspace');
const TOKENS_DIR = path.join(WORKSPACE_ROOT, 'public', 'data', 'artcraft_tokens');

// Fixed 64-hex token for local loopback control channel (127.0.0.1 only)
const DEFAULT_CONTROL_TOKEN = 'b5c0a7c4a1f720261023beauscreatorsjarvisoscontroltoken00000000001';

const ARTCRAFT_13_CATALOG = [
  { id: 'photocraft', num: '01', name: 'PhotoCraft', kr: '포토샵 대체 · 사진/PSD 레이어 편집', port: 17801, supportsControlFlag: true, githubUrl: 'https://github.com/storytold/photocraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'vectorcraft', num: '02', name: 'VectorCraft', kr: '일러스트 대체 · 벡터/SVG 그래픽', port: 17802, supportsControlFlag: true, githubUrl: 'https://github.com/storytold/vectorcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'filmcraft', num: '03', name: 'FilmCraft', kr: '프리미어 대체 · 비선형 영상 편집', port: 17803, supportsControlFlag: true, githubUrl: 'https://github.com/storytold/filmcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'effectcraft', num: '04', name: 'EffectCraft', kr: '애프터이펙트 대체 · 모션/VFX 합성', port: 17804, supportsControlFlag: false, githubUrl: 'https://github.com/storytold/effectcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'designcraft', num: '05', name: 'DesignCraft', kr: '인디자인 대체 · 출판/다중페이지 조판', port: 17805, supportsControlFlag: false, githubUrl: 'https://github.com/storytold/designcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'figcraft', num: '06', name: 'FigCraft', kr: '피그마 대체 · UI/UX 프로토타이핑', port: 17806, supportsControlFlag: false, githubUrl: 'https://github.com/storytold/figcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'lightcraft', num: '07', name: 'LightCraft', kr: '라이트룸 대체 · RAW 사진 현상/색보정', port: 17807, supportsControlFlag: true, githubUrl: 'https://github.com/storytold/lightcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'pdfcraft', num: '08', name: 'PdfCraft', kr: '아크로뱃 대체 · PDF 편집/주석/보안', port: 17808, supportsControlFlag: false, githubUrl: 'https://github.com/storytold/pdfcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'wordcraft', num: '09', name: 'WordCraft', kr: 'MS워드 대체 · 워드프로세서/문서', port: 17809, supportsControlFlag: true, githubUrl: 'https://github.com/storytold/wordcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'deckcraft', num: '10', name: 'DeckCraft', kr: '파워포인트 대체 · 슬라이드 프레젠테이션', port: 17810, supportsControlFlag: true, githubUrl: 'https://github.com/storytold/deckcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'gridcraft', num: '11', name: 'GridCraft', kr: '엑셀 대체 · 스프레드시트/수식/차트', port: 17811, supportsControlFlag: false, githubUrl: 'https://github.com/storytold/gridcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'soundcraft', num: '12', name: 'SoundCraft', kr: '오디션 대체 · 멀티트랙 오디오 편집', port: 17812, supportsControlFlag: false, githubUrl: 'https://github.com/storytold/soundcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' },
  { id: 'cadcraft', num: '13', name: 'CADCraft', kr: '오토캐드 대체 · 2D/3D 정밀 CAD 도면', port: 17813, supportsControlFlag: false, githubUrl: 'https://github.com/storytold/cadcraft', demoImage: '/data/artcraft_workspace/demo_photocraft.jpg' }
];

// Active launched process state
const activeProcesses = new Map();

function ensureWorkspaceDirs() {
  fs.mkdirSync(AUTOMATION_WORK_DIR, { recursive: true });
  fs.mkdirSync(TOKENS_DIR, { recursive: true });
  // Copy sample demo image from photocraft docs if available
  const sampleSrc = path.join(SUITE_DIR, 'photocraft/docs/images/photocraft-demo.jpg');
  const sampleDst = path.join(AUTOMATION_WORK_DIR, 'demo_photocraft.jpg');
  if (fs.existsSync(sampleSrc) && !fs.existsSync(sampleDst)) {
    try { fs.copyFileSync(sampleSrc, sampleDst); } catch (_) {}
  }
}

/**
 * Syncs %LOCALAPPDATA%\ArtCraft\ai\connections.json so all 13 ArtCraft apps share
 * J.A.R.V.I.S. OS's local Ollama Gemma 4 (gemma4:e4b / e2b / 31b) & ComfyUI connection
 */
function syncArtCraftSharedAiStore() {
  ensureWorkspaceDirs();
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
  const aiDir = path.join(localAppData, 'ArtCraft', 'ai');
  fs.mkdirSync(aiDir, { recursive: true });

  const storePath = path.join(aiDir, 'connections.json');
  const sharedStorePayload = {
    version: 1,
    connections: [
      {
        id: 'jarvis-ollama-gemma4',
        label: 'BSC J.A.R.V.I.S. Local Brain (Ollama Gemma 4)',
        provider: 'openai_compatible',
        endpoint: 'http://127.0.0.1:11434/v1',
        enabled: true,
        models: [
          { id: 'gemma4:e4b', label: 'Google Gemma 4 E4B (Multimodal Vision & Chat)', capabilities: ['text', 'vision', 'tools'] },
          { id: 'gemma4:e2b', label: 'Google Gemma 4 E2B (Ultra-Fast Router)', capabilities: ['text', 'tools'] },
          { id: 'gemma4:31b', label: 'Google Gemma 4 31B (Deep Architecture & Code)', capabilities: ['text', 'tools'] },
          { id: 'embeddinggemma:300m-qat-q8_0', label: 'EmbeddingGemma 300M (768d RAG)', capabilities: ['embedding'] }
        ]
      },
      {
        id: 'jarvis-os-bridge',
        label: 'BSC J.A.R.V.I.S. OS Creative & Co-Vision Bridge',
        provider: 'artcraft_omni',
        endpoint: 'http://127.0.0.1:7777/api/jarvis/artcraft-ai',
        enabled: true
      }
    ],
    defaults: {
      chat: { connection_id: 'jarvis-ollama-gemma4', model_id: 'gemma4:e4b' },
      vision: { connection_id: 'jarvis-ollama-gemma4', model_id: 'gemma4:e4b' },
      code: { connection_id: 'jarvis-ollama-gemma4', model_id: 'gemma4:31b' }
    },
    custom_tools: [
      {
        id: 'bsc.jarvis.cleanroom_redesign',
        label: 'J.A.R.V.I.S. 클린룸 레이어 자동 리디자인',
        capability: 'vision',
        inputs: ['selection', 'layer', 'prompt']
      }
    ],
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(storePath, JSON.stringify(sharedStorePayload, null, 2), 'utf8');
  return {
    ok: true,
    storePath: storePath.replace(/\\/g, '/'),
    connectionsCount: sharedStorePayload.connections.length,
    modelsLinked: ['gemma4:e4b', 'gemma4:e2b', 'gemma4:31b', 'embeddinggemma:300m-qat-q8_0']
  };
}

/**
 * Sends a single authenticated JSON-lines RPC request to an ArtCraft --control port
 */
function sendControlRpc(port, token, method, params = {}, timeoutMs = 4500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let buffer = '';
    let authed = false;
    let finished = false;

    const done = (resObj) => {
      if (finished) return;
      finished = true;
      try { socket.destroy(); } catch (_) {}
      resolve(resObj);
    };

    const timer = setTimeout(() => {
      done({ ok: false, error: `Control TCP timeout on 127.0.0.1:${port}` });
    }, timeoutMs);

    socket.connect(port, '127.0.0.1', () => {
      const authMsg = JSON.stringify({ id: 'auth', method: 'auth', params: { token } }) + '\n';
      socket.write(authMsg);
    });

    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      let nlIdx;
      while ((nlIdx = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, nlIdx).trim();
        buffer = buffer.slice(nlIdx + 1);
        if (!line) continue;
        let msg;
        try {
          msg = JSON.parse(line);
        } catch (e) {
          continue;
        }
        if (msg.id === 'auth') {
          if (!msg.ok) {
            clearTimeout(timer);
            return done({ ok: false, error: msg.error || 'Control auth failed' });
          }
          authed = true;
          const reqMsg = JSON.stringify({ id: 1, method, params }) + '\n';
          socket.write(reqMsg);
        } else if (msg.id === 1 && authed) {
          clearTimeout(timer);
          return done(msg);
        }
      }
    });

    socket.on('error', (err) => {
      clearTimeout(timer);
      done({ ok: false, error: err.message });
    });
  });
}

/**
 * Captures a running Windows process window via PowerShell + .NET System.Drawing.CopyFromScreen
 */
function captureWin32ProcessWindow(processName) {
  try {
    const psScript = `
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32Cap {
  [StructLayout(LayoutKind.Sequential)]
  public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@
Add-Type -AssemblyName System.Drawing
$procs = Get-Process -Name "${processName}" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }
if (-not $procs) { Write-Output "NO_WINDOW"; exit 0 }
$p = $procs[0]
$hwnd = $p.MainWindowHandle
[Win32Cap]::ShowWindow($hwnd, 9) | Out-Null
[Win32Cap]::SetForegroundWindow($hwnd) | Out-Null
Start-Sleep -Milliseconds 120
$rect = New-Object Win32Cap+RECT
[Win32Cap]::GetWindowRect($hwnd, [ref]$rect) | Out-Null
$w = [Math]::Max(320, $rect.Right - $rect.Left)
$h = [Math]::Max(240, $rect.Bottom - $rect.Top)
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($rect.Left, $rect.Top, 0, 0, (New-Object System.Drawing.Size($w, $h)))
$g.Dispose()
$ms = New-Object System.IO.MemoryStream
$bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$b64 = [Convert]::ToBase64String($ms.ToArray())
$ms.Dispose()
Write-Output ("OK|" + $w + "x" + $h + "|" + $p.MainWindowTitle + "|" + $b64)
`;
    const out = execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psScript], {
      encoding: 'utf8',
      timeout: 5000,
      maxBuffer: 25 * 1024 * 1024
    }).trim();
    if (out.startsWith('OK|')) {
      const parts = out.split('|');
      return {
        ok: true,
        dimensions: parts[1],
        windowTitle: parts[2],
        screenshotBase64: parts[3]
      };
    }
  } catch (_) {}
  return { ok: false };
}

/**
 * Lists all 13 ArtCraft apps + Launcher with live installation & running status
 */
function getArtCraftSuiteStatus() {
  const aiSync = syncArtCraftSharedAiStore();
  let runningNames = new Set();
  try {
    const out = execFileSync('tasklist', ['/FO', 'CSV', '/NH'], { encoding: 'utf8', timeout: 3000 });
    for (const line of out.split(/\r?\n/)) {
      const m = line.match(/^"([^"]+)\.exe"/i);
      if (m) runningNames.add(m[1].toLowerCase());
    }
  } catch (_) {}

  const apps = ARTCRAFT_13_CATALOG.map(item => {
    const exePath = path.join(APPS_DIR, item.id, `${item.id}.exe`);
    const installed = fs.existsSync(exePath);
    const sizeMb = installed ? Number((fs.statSync(exePath).size / 1048576).toFixed(1)) : 0;
    const isRunning = runningNames.has(item.id);
    return {
      ...item,
      exePath: exePath.replace(/\\/g, '/'),
      installed,
      sizeMb,
      isRunning
    };
  });

  return {
    ok: true,
    aiBridge: aiSync,
    launcher: {
      id: 'launcher',
      name: 'ArtCraft 통합 런처 (v0.5.1)',
      exePath: LAUNCHER_EXE.replace(/\\/g, '/'),
      installed: fs.existsSync(LAUNCHER_EXE),
      isRunning: runningNames.has('artcraft-launcher')
    },
    apps
  };
}

/**
 * Launches an ArtCraft app with --control <port> --control-token <hex> and returns initial live state
 */
async function launchAndConnectArtCraftApp(appId = 'photocraft') {
  ensureWorkspaceDirs();
  syncArtCraftSharedAiStore();

  const normalizedId = String(appId || 'photocraft').toLowerCase().trim();
  if (normalizedId === 'launcher' || normalizedId === 'artcraft-launcher') {
    if (!fs.existsSync(LAUNCHER_EXE)) {
      return { ok: false, error: `런처 파일이 없습니다: ${LAUNCHER_EXE}` };
    }
    const child = spawn(LAUNCHER_EXE, [], {
      cwd: LAUNCHER_DIR,
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    await new Promise(r => setTimeout(r, 1400));
    const cap = captureWin32ProcessWindow('artcraft-launcher');
    return {
      ok: true,
      appId: 'launcher',
      name: 'ArtCraft 통합 런처',
      mode: 'WIN32_NATIVE',
      screenshotBase64: cap.ok ? cap.screenshotBase64 : null,
      windowTitle: cap.windowTitle || 'ArtCraft Launcher v0.5.1',
      message: 'ArtCraft 통합 런처를 실행하고 자비스 제어 화면과 연결했습니다.'
    };
  }

  const appMeta = ARTCRAFT_13_CATALOG.find(a => a.id === normalizedId) || ARTCRAFT_13_CATALOG[0];
  const exePath = path.join(APPS_DIR, appMeta.id, `${appMeta.id}.exe`);
  const workDir = path.join(APPS_DIR, appMeta.id);

  if (!fs.existsSync(exePath)) {
    return { ok: false, error: `실행 파일을 찾을 수 없습니다: ${exePath}` };
  }

  const tokenFile = path.join(TOKENS_DIR, `${appMeta.id}.token`);
  fs.writeFileSync(tokenFile, DEFAULT_CONTROL_TOKEN, 'utf8');

  // Check if control port is already alive
  let ping = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'ui.inspect', {}, 900);
  if (!ping.ok) {
    const args = appMeta.supportsControlFlag
      ? [
          '--new-instance',
          '--control', String(appMeta.port),
          '--control-token', DEFAULT_CONTROL_TOKEN,
          '--automation-read-root', AUTOMATION_WORK_DIR,
          '--automation-write-root', AUTOMATION_WORK_DIR
        ]
      : [];

    const child = spawn(exePath, args, {
      cwd: workDir,
      detached: true,
      stdio: 'ignore',
      env: {
        ...process.env,
        CRAFT_AI_DIR: path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'ArtCraft', 'ai')
      }
    });
    child.unref();
    activeProcesses.set(appMeta.id, { pid: child.pid, port: appMeta.port, launchedAt: Date.now() });

    // Wait up to 3.5 seconds for the control port or window to come online
    for (let i = 0; i < 6; i++) {
      await new Promise(r => setTimeout(r, 550));
      if (appMeta.supportsControlFlag) {
        ping = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'ui.inspect', {}, 900);
        if (ping.ok) break;
      } else {
        const cap = captureWin32ProcessWindow(appMeta.id);
        if (cap.ok) break;
      }
    }
  }

  return await inspectAndCaptureArtCraftApp(appMeta.id);
}

/**
 * Captures live screenshot + UI state of any ArtCraft app
 */
async function inspectAndCaptureArtCraftApp(appId = 'photocraft') {
  ensureWorkspaceDirs();
  const normalizedId = String(appId || 'photocraft').toLowerCase().trim();
  const appMeta = ARTCRAFT_13_CATALOG.find(a => a.id === normalizedId) || ARTCRAFT_13_CATALOG[0];

  // 1. Try JSON-Lines Control Protocol first (ui.inspect + ui.screenshot)
  if (appMeta.supportsControlFlag) {
    const inspectRes = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'ui.inspect', {}, 2200);
    if (inspectRes && inspectRes.ok) {
      const shotRes = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'ui.screenshot', { focus: true }, 3500);
      const b64 = shotRes?.result?.png || shotRes?.result?.data || (typeof shotRes?.result === 'string' ? shotRes.result : null);
      return {
        ok: true,
        appId: appMeta.id,
        name: appMeta.name,
        kr: appMeta.kr,
        port: appMeta.port,
        controlConnected: true,
        mode: 'JSON_CONTROL_PROTOCOL',
        uiState: inspectRes.result || {},
        screenshotBase64: b64 || null,
        fallbackDemoUrl: appMeta.demoImage
      };
    }
  }

  // 2. Try Win32 Native Window Capture if process is running on Windows
  const winCap = captureWin32ProcessWindow(appMeta.id);
  if (winCap.ok && winCap.screenshotBase64) {
    return {
      ok: true,
      appId: appMeta.id,
      name: appMeta.name,
      kr: appMeta.kr,
      port: appMeta.port,
      controlConnected: true,
      mode: 'WIN32_WINDOW_CAPTURE',
      uiState: { windowTitle: winCap.windowTitle, dimensions: winCap.dimensions, backend: 'DirectX 12 (wgpu)' },
      screenshotBase64: winCap.screenshotBase64,
      fallbackDemoUrl: appMeta.demoImage
    };
  }

  // 3. Fallback: Return ready-to-launch status with official PhotoCraft demo render
  return {
    ok: true,
    appId: appMeta.id,
    name: appMeta.name,
    kr: appMeta.kr,
    port: appMeta.port,
    controlConnected: false,
    mode: 'STANDBY_PREVIEW',
    uiState: { status: '대기 중 (우측 상단 [🚀 프로그램 실행 및 제어 연결] 클릭 시 실시간 화면 스트리밍 시작)' },
    screenshotBase64: null,
    fallbackDemoUrl: appMeta.demoImage
  };
}

/**
 * Executes a control action (command, tool switch, pointer click/stroke, keyboard shortcut)
 * on the target ArtCraft app and immediately returns the updated screenshot & UI state!
 */
async function executeArtCraftControlAction(appId = 'photocraft', action = {}) {
  const normalizedId = String(appId || 'photocraft').toLowerCase().trim();
  const appMeta = ARTCRAFT_13_CATALOG.find(a => a.id === normalizedId) || ARTCRAFT_13_CATALOG[0];

  // Ensure app is running first
  let check = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'ui.inspect', {}, 800);
  if (!check.ok && appMeta.supportsControlFlag) {
    await launchAndConnectArtCraftApp(appMeta.id);
  }

  let rpcReply = null;
  const kind = String(action.kind || 'command');

  if (kind === 'command') {
    // e.g. file.new, layer.new.layer, layer.newAdjustmentLayer.curves, view.fitOnScreen
    rpcReply = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'engine.execute', {
      command: action.command || 'file.new',
      params: action.params || null
    });
  } else if (kind === 'ui.set') {
    rpcReply = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'ui.set', action.params || {});
  } else if (kind === 'ui.click') {
    rpcReply = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'ui.click', {
      x: Number(action.x || 400),
      y: Number(action.y || 300),
      button: action.button || 'left',
      count: Number(action.count || 1)
    });
  } else if (kind === 'ui.key') {
    rpcReply = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'ui.key', action.params || { key: 'Enter' });
  } else if (kind === 'ui.type') {
    rpcReply = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'ui.type', { text: String(action.text || '') });
  } else if (kind === 'paint.demo') {
    // Creates a 1280x720 canvas if needed, adds a layer, and paints a smooth stroke
    await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'engine.execute', {
      command: 'file.new',
      params: { width: 1280, height: 720, mode: 'rgb', depth: 8, background: 'white' }
    });
    await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'engine.execute', {
      command: 'layer.new.layer',
      params: { name: 'JARVIS AI Paint Layer' }
    });
    rpcReply = await sendControlRpc(appMeta.port, DEFAULT_CONTROL_TOKEN, 'engine.execute', {
      command: 'paint.stroke',
      params: {
        points: [[240, 360, 0.9], [440, 220, 1.0], [640, 360, 1.0], [840, 500, 1.0], [1040, 360, 0.9]],
        size: 28,
        color: '#00f0ff'
      }
    });
  }

  // Wait 120ms for GPU frame render, then capture updated screenshot
  await new Promise(r => setTimeout(r, 120));
  const snapshot = await inspectAndCaptureArtCraftApp(appMeta.id);
  return {
    ...snapshot,
    lastAction: action,
    rpcReply
  };
}

module.exports = {
  ARTCRAFT_13_CATALOG,
  syncArtCraftSharedAiStore,
  getArtCraftSuiteStatus,
  launchAndConnectArtCraftApp,
  inspectAndCaptureArtCraftApp,
  executeArtCraftControlAction
};
