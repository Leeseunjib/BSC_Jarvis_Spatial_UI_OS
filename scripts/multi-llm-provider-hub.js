/**
 * 🌐🧠 BSC J.A.R.V.I.S. OS — 4-Way Multi-LLM Provider Hub (Cloud + Local AI Unified Bridge)
 * Path: c:\BSC_Javis_OS\scripts\multi-llm-provider-hub.js
 *
 * Connects 4 Major LLM Ecosystems into a Single Seamless Router:
 *  1. OpenAI GPT     (Cloud API: gpt-4o, gpt-4o-mini, o3-mini)
 *  2. Google Gemini  (Cloud API: gemini-2.5-pro, gemini-2.5-flash, gemini-2.0-flash)
 *  3. LM Studio      (Local AI : http://127.0.0.1:1234/v1 + Local Disk .gguf auto-scanner)
 *  4. Ollama         (Local AI : http://127.0.0.1:11434 + Gemma 4 E4B/E2B/31B, Qwen 2.5 Coder, DeepSeek-R1)
 *
 * Security & Resilience Guarantees (Per CEO 이건우 대표님 Charter):
 *  - API keys are NEVER hardcoded or exposed in public JSON; strictly isolated in `c:\BSC_Javis_OS\.env`.
 *  - Ollama calls enforce `think: false` and `keep_alive: '30m'` for sub-second Korean Tiki-Taka.
 *  - Automatic zero-downtime fallback to Local AI (LM Studio / Ollama) if cloud key is missing or offline.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT_DIR = path.join(__dirname, '..');
const ENV_FILE_PATH = path.join(ROOT_DIR, '.env');
const DATA_DIR = path.join(ROOT_DIR, 'public', 'data');
const HUB_STATE_PATH = path.join(DATA_DIR, 'multi-llm-hub-state.json');

// Default Provider Catalog & Models
const MULTI_LLM_CATALOG = {
  ollama: {
    id: 'ollama',
    name: '🟢 Ollama (로컬 온디바이스 AI · $0 무료)',
    type: 'LOCAL',
    defaultEndpoint: 'http://127.0.0.1:11434',
    defaultModel: 'gemma4:e4b',
    models: [
      { id: 'gemma4:e4b', label: 'Gemma 4 E4B (9.6GB · 주력 대화·비전·코딩)', badge: '$0 로컬 주력' },
      { id: 'gemma4:e2b', label: 'Gemma 4 E2B (7.2GB · 0.5초 초고속 음성비서)', badge: '$0 초고속' },
      { id: 'gemma4:31b', label: 'Gemma 4 31B (19GB · 심층 아키텍처·코딩)', badge: '$0 플래그십' },
      { id: 'qwen2.5-coder:14b', label: 'Qwen 2.5 Coder 14B (코딩·스크립트 특화)', badge: '$0 코딩' },
      { id: 'deepseek-r1:14b', label: 'DeepSeek-R1 14B (심층 추론·기획)', badge: '$0 추론' },
      { id: 'llama3.2:3b', label: 'Llama 3.2 3B (초경량 SLM)', badge: '$0 경량' }
    ]
  },
  lmstudio: {
    id: 'lmstudio',
    name: '🟣 LM Studio (로컬 GGUF 서버 · $0 무료)',
    type: 'LOCAL',
    defaultEndpoint: 'http://127.0.0.1:1234',
    defaultModel: 'local-model',
    models: [
      { id: 'local-model', label: '현재 LM Studio에 로드된 활성 GGUF 모델 (자동 감지)', badge: '$0 로컬 GGUF' },
      { id: 'google/gemma-4-e4b-it-GGUF', label: 'Gemma 4 E4B Instruct GGUF', badge: 'GGUF 호환' },
      { id: 'Qwen/Qwen2.5-Coder-14B-Instruct-GGUF', label: 'Qwen 2.5 Coder 14B GGUF', badge: 'GGUF 코딩' },
      { id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B-GGUF', label: 'DeepSeek-R1 Distill 14B GGUF', badge: 'GGUF 추론' },
      { id: 'LGAI-EXAONE/EXAONE-3.5-7.8B-Instruct-GGUF', label: 'LG EXAONE 3.5 7.8B GGUF', badge: '한국어 특화' }
    ]
  },
  gemini: {
    id: 'gemini',
    name: '🔵 Google Gemini (클라우드 멀티모달 AI)',
    type: 'CLOUD',
    defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-2.5-flash',
    models: [
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (초고속 멀티모달·음성비서 표준)', badge: '고속 추천' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (고난도 코딩·역공학·심층 추론)', badge: '플래그십' },
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (범용 실시간 에이전트)', badge: '경량 고속' }
    ]
  },
  openai: {
    id: 'openai',
    name: '🟠 OpenAI GPT (클라우드 추론·코딩 AI)',
    type: 'CLOUD',
    defaultEndpoint: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o (옴니 멀티모달·자연어 대화·코딩 주력)', badge: '주력 표준' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini (초고속 응답·사사리사 명령 분류)', badge: '초고속' },
      { id: 'o3-mini', label: 'OpenAI o3-mini (고난도 알고리즘·역공학 추론)', badge: '심층 추론' }
    ]
  }
};

function parseDotEnvFile() {
  const envMap = {};
  if (!fs.existsSync(ENV_FILE_PATH)) return envMap;
  try {
    const raw = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      envMap[key] = val;
    }
  } catch (e) {}
  return envMap;
}

function updateDotEnvKeys(updates = {}) {
  const current = parseDotEnvFile();
  for (const [k, v] of Object.entries(updates)) {
    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (trimmed) {
        current[k] = trimmed;
        process.env[k] = trimmed;
      }
    }
  }
  const lines = [
    '# 🛡️ BSC_Javis_OS Isolated Credentials (.env — DO NOT COMMIT)',
    ...Object.entries(current).map(([k, v]) => `${k}=${v}`)
  ];
  fs.writeFileSync(ENV_FILE_PATH, lines.join('\n') + '\n', 'utf8');
}

function getSecretKey(envVarName) {
  if (process.env[envVarName] && String(process.env[envVarName]).trim()) {
    return String(process.env[envVarName]).trim();
  }
  const parsed = parseDotEnvFile();
  if (parsed[envVarName] && String(parsed[envVarName]).trim()) {
    process.env[envVarName] = String(parsed[envVarName]).trim();
    return process.env[envVarName];
  }
  return '';
}

function maskApiKey(key) {
  const s = String(key || '').trim();
  if (!s) return '';
  if (s.length <= 8) return '****';
  return `${s.slice(0, 5)}...${s.slice(-4)}`;
}

function loadHubState() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(HUB_STATE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(HUB_STATE_PATH, 'utf8'));
      return {
        activeProvider: parsed.activeProvider || 'ollama',
        activeModel: parsed.activeModel || 'gemma4:e4b',
        autoFallbackToLocal: parsed.autoFallbackToLocal !== false,
        ollamaEndpoint: parsed.ollamaEndpoint || process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
        lmstudioEndpoint: parsed.lmstudioEndpoint || process.env.LMSTUDIO_BASE_URL || 'http://127.0.0.1:1234',
        openaiModel: parsed.openaiModel || 'gpt-4o',
        geminiModel: parsed.geminiModel || 'gemini-2.5-flash',
        lmstudioModel: parsed.lmstudioModel || 'local-model',
        ollamaModel: parsed.ollamaModel || 'gemma4:e4b',
        updatedAt: parsed.updatedAt || new Date().toISOString()
      };
    }
  } catch (e) {}

  return {
    activeProvider: 'ollama',
    activeModel: 'gemma4:e4b',
    autoFallbackToLocal: true,
    ollamaEndpoint: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
    lmstudioEndpoint: process.env.LMSTUDIO_BASE_URL || 'http://127.0.0.1:1234',
    openaiModel: 'gpt-4o',
    geminiModel: 'gemini-2.5-flash',
    lmstudioModel: 'local-model',
    ollamaModel: 'gemma4:e4b',
    updatedAt: new Date().toISOString()
  };
}

function saveHubState(partial = {}) {
  const current = loadHubState();
  const next = {
    ...current,
    ...partial,
    updatedAt: new Date().toISOString()
  };
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(HUB_STATE_PATH, JSON.stringify(next, null, 2), 'utf8');
  } catch (e) {}
  return next;
}

function scanLmStudioDiskGguf() {
  const home = os.homedir();
  const dirs = [
    path.join(home, '.lmstudio', 'models'),
    path.join(home, '.cache', 'lm-studio', 'models'),
    path.join(home, 'AppData', 'Local', 'LM-Studio', 'models')
  ];
  const found = [];
  function walk(dir, depth = 0) {
    if (depth > 4 || !fs.existsSync(dir)) return;
    try {
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(full, depth + 1);
        else if (ent.isFile() && ent.name.toLowerCase().endsWith('.gguf')) {
          const st = fs.statSync(full);
          found.push({
            id: ent.name.replace(/\.gguf$/i, ''),
            fileName: ent.name,
            sizeGb: Number((st.size / (1024 ** 3)).toFixed(2))
          });
        }
      }
    } catch (e) {}
  }
  for (const d of dirs) walk(d, 0);
  return found;
}

async function getMultiLlmStatus() {
  const state = loadHubState();
  const openaiKey = getSecretKey('OPENAI_API_KEY');
  const geminiKey = getSecretKey('GEMINI_API_KEY') || getSecretKey('GOOGLE_API_KEY');

  // 1. Check Ollama
  let ollamaOnline = false;
  let ollamaInstalled = [];
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch(`${state.ollamaEndpoint}/api/tags`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      ollamaOnline = true;
      ollamaInstalled = (data.models || []).map(m => ({
        id: m.name,
        name: m.name,
        sizeGb: Number(((m.size || 0) / (1024 ** 3)).toFixed(2)),
        quantization: m.details?.quantization_level || ''
      }));
    }
  } catch (e) {}

  // 2. Check LM Studio
  let lmstudioOnline = false;
  let lmstudioLoaded = [];
  const lmstudioDiskGguf = scanLmStudioDiskGguf();
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1600);
    const res = await fetch(`${state.lmstudioEndpoint}/v1/models`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      lmstudioOnline = true;
      lmstudioLoaded = (data.data || []).map(m => ({
        id: m.id,
        name: m.id
      }));
    }
  } catch (e) {}

  return {
    ok: true,
    timestamp: new Date().toISOString(),
    state,
    providers: {
      ollama: {
        ...MULTI_LLM_CATALOG.ollama,
        endpoint: state.ollamaEndpoint,
        online: ollamaOnline,
        ready: ollamaOnline,
        selectedModel: state.ollamaModel,
        installedModels: ollamaInstalled,
        statusLabel: ollamaOnline
          ? `🟢 온라인 (${ollamaInstalled.length}개 로컬 모델 설치됨)`
          : '⚪ 오프라인 (ollama serve 대기)'
      },
      lmstudio: {
        ...MULTI_LLM_CATALOG.lmstudio,
        endpoint: state.lmstudioEndpoint,
        online: lmstudioOnline,
        ready: lmstudioOnline || lmstudioDiskGguf.length > 0,
        selectedModel: lmstudioLoaded[0]?.id || state.lmstudioModel,
        loadedModels: lmstudioLoaded,
        diskGgufModels: lmstudioDiskGguf,
        statusLabel: lmstudioOnline
          ? `🟢 온라인 (로드된 모델 ${lmstudioLoaded.length}개)`
          : (lmstudioDiskGguf.length > 0
            ? `🟡 디스크 GGUF ${lmstudioDiskGguf.length}개 감지됨 (:1234 서버 대기)`
            : '⚪ 로컬 서버(:1234) 대기 중 (Ollama 자동 폴백 활성)')
      },
      gemini: {
        ...MULTI_LLM_CATALOG.gemini,
        configured: Boolean(geminiKey),
        ready: Boolean(geminiKey),
        maskedKey: maskApiKey(geminiKey),
        selectedModel: state.geminiModel,
        statusLabel: geminiKey
          ? `🟢 API Key 연결됨 (${maskApiKey(geminiKey)})`
          : '🔑 .env API Key 미설정 (로컬 AI 자동 폴백 활성)'
      },
      openai: {
        ...MULTI_LLM_CATALOG.openai,
        configured: Boolean(openaiKey),
        ready: Boolean(openaiKey),
        maskedKey: maskApiKey(openaiKey),
        selectedModel: state.openaiModel,
        statusLabel: openaiKey
          ? `🟢 API Key 연결됨 (${maskApiKey(openaiKey)})`
          : '🔑 .env API Key 미설정 (로컬 AI 자동 폴백 활성)'
      }
    }
  };
}

function configureMultiLlmHub(payload = {}) {
  const envUpdates = {};
  if (typeof payload.openaiApiKey === 'string' && payload.openaiApiKey.trim()) {
    envUpdates.OPENAI_API_KEY = payload.openaiApiKey.trim();
  }
  if (typeof payload.geminiApiKey === 'string' && payload.geminiApiKey.trim()) {
    envUpdates.GEMINI_API_KEY = payload.geminiApiKey.trim();
  }
  if (typeof payload.ollamaEndpoint === 'string' && payload.ollamaEndpoint.trim()) {
    envUpdates.OLLAMA_BASE_URL = payload.ollamaEndpoint.trim().replace(/\/+$/, '');
  }
  if (typeof payload.lmstudioEndpoint === 'string' && payload.lmstudioEndpoint.trim()) {
    envUpdates.LMSTUDIO_BASE_URL = payload.lmstudioEndpoint.trim().replace(/\/+$/, '');
  }
  if (Object.keys(envUpdates).length > 0) {
    updateDotEnvKeys(envUpdates);
  }

  const current = loadHubState();
  const nextProvider = payload.activeProvider || payload.provider || current.activeProvider;
  let nextModel = payload.activeModel || payload.model || current.activeModel;

  const statePatch = {
    activeProvider: nextProvider
  };

  if (payload.ollamaEndpoint) statePatch.ollamaEndpoint = payload.ollamaEndpoint.trim().replace(/\/+$/, '');
  if (payload.lmstudioEndpoint) statePatch.lmstudioEndpoint = payload.lmstudioEndpoint.trim().replace(/\/+$/, '');
  if (typeof payload.autoFallbackToLocal === 'boolean') statePatch.autoFallbackToLocal = payload.autoFallbackToLocal;

  if (nextProvider === 'openai') {
    statePatch.openaiModel = payload.openaiModel || payload.model || current.openaiModel || 'gpt-4o';
    nextModel = statePatch.openaiModel;
  } else if (nextProvider === 'gemini') {
    statePatch.geminiModel = payload.geminiModel || payload.model || current.geminiModel || 'gemini-2.5-flash';
    nextModel = statePatch.geminiModel;
  } else if (nextProvider === 'lmstudio') {
    statePatch.lmstudioModel = payload.lmstudioModel || payload.model || current.lmstudioModel || 'local-model';
    nextModel = statePatch.lmstudioModel;
  } else if (nextProvider === 'ollama') {
    statePatch.ollamaModel = payload.ollamaModel || payload.model || current.ollamaModel || 'gemma4:e4b';
    nextModel = statePatch.ollamaModel;
  }

  statePatch.activeModel = nextModel;
  const saved = saveHubState(statePatch);

  // Sync with jarvis-active-brain.json so existing Brain Dashboard stays 100% in sync
  try {
    const brainPath = path.join(DATA_DIR, 'jarvis-active-brain.json');
    let existingBrain = {};
    if (fs.existsSync(brainPath)) {
      existingBrain = JSON.parse(fs.readFileSync(brainPath, 'utf8'));
    }
    fs.writeFileSync(brainPath, JSON.stringify({
      ...existingBrain,
      activeProvider: saved.activeProvider,
      activeModel: saved.activeModel,
      lastSwappedAt: new Date().toISOString()
    }, null, 2), 'utf8');
  } catch (e) {}

  return {
    ok: true,
    state: saved,
    message: `이건우 대표님, 주력 AI 두뇌가 [${saved.activeProvider.toUpperCase()} · ${saved.activeModel}] 엔진으로 연결되었습니다.`
  };
}

async function callOpenAiApi(messages, model = 'gpt-4o', opts = {}) {
  const apiKey = getSecretKey('OPENAI_API_KEY');
  if (!apiKey) {
    return { ok: false, error: 'OPENAI_API_KEY_NOT_CONFIGURED' };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs || 18000);
  try {
    const isReasoningModel = /^o[134]/i.test(model);
    const body = {
      model,
      messages
    };
    if (!isReasoningModel) {
      body.temperature = opts.temperature ?? 0.65;
      body.max_tokens = opts.maxTokens ?? 400;
    } else {
      body.max_completion_tokens = opts.maxTokens ?? 600;
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      signal: ctrl.signal,
      body: JSON.stringify(body)
    });
    clearTimeout(timer);
    if (!res.ok) {
      const errTxt = await res.text().catch(() => '');
      return { ok: false, error: `OpenAI HTTP ${res.status}: ${errTxt.slice(0, 120)}` };
    }
    const data = await res.json();
    const text = String(data?.choices?.[0]?.message?.content || '').trim();
    return { ok: Boolean(text), provider: 'openai', model, text };
  } catch (e) {
    clearTimeout(timer);
    return { ok: false, error: e.message };
  }
}

async function callGeminiApi(messages, model = 'gemini-2.5-flash', opts = {}) {
  const apiKey = getSecretKey('GEMINI_API_KEY') || getSecretKey('GOOGLE_API_KEY');
  if (!apiKey) {
    return { ok: false, error: 'GEMINI_API_KEY_NOT_CONFIGURED' };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs || 18000);
  try {
    const sysMsg = messages.find(m => m.role === 'system');
    const chatMsgs = messages.filter(m => m.role !== 'system');
    const contents = chatMsgs.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '') }]
    }));
    const payload = {
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: '안녕하세요' }] }],
      generationConfig: {
        temperature: opts.temperature ?? 0.65,
        maxOutputTokens: opts.maxTokens ?? 450
      }
    };
    if (sysMsg && sysMsg.content) {
      payload.systemInstruction = { parts: [{ text: String(sysMsg.content) }] };
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify(payload)
    });
    clearTimeout(timer);
    if (!res.ok) {
      const errTxt = await res.text().catch(() => '');
      return { ok: false, error: `Gemini HTTP ${res.status}: ${errTxt.slice(0, 120)}` };
    }
    const data = await res.json();
    const text = String(data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '').trim();
    return { ok: Boolean(text), provider: 'gemini', model, text };
  } catch (e) {
    clearTimeout(timer);
    return { ok: false, error: e.message };
  }
}

async function callLmStudioApi(messages, model = 'local-model', endpoint = 'http://127.0.0.1:1234', opts = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs || 15000);
  try {
    const res = await fetch(`${endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: model || 'local-model',
        messages,
        temperature: opts.temperature ?? 0.65,
        max_tokens: opts.maxTokens ?? 400,
        stream: false
      })
    });
    clearTimeout(timer);
    if (!res.ok) {
      return { ok: false, error: `LM Studio HTTP ${res.status}` };
    }
    const data = await res.json();
    const text = String(data?.choices?.[0]?.message?.content || '').trim();
    const usedModel = data?.model || model || 'lmstudio-gguf';
    return { ok: Boolean(text), provider: 'lmstudio', model: usedModel, text };
  } catch (e) {
    clearTimeout(timer);
    return { ok: false, error: e.message };
  }
}

async function callOllamaApi(messages, model = 'gemma4:e4b', endpoint = 'http://127.0.0.1:11434', opts = {}) {
  const candidateModels = [model];
  for (const fallback of ['gemma4:e4b', 'gemma4:e2b', 'gemma4:31b']) {
    if (!candidateModels.includes(fallback)) candidateModels.push(fallback);
  }

  for (const targetModel of candidateModels) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs || 15000);
    try {
      const res = await fetch(`${endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: targetModel,
          stream: false,
          think: false,
          keep_alive: '30m',
          options: {
            num_predict: opts.maxTokens ?? 260,
            temperature: opts.temperature ?? 0.65,
            top_p: 0.9
          },
          messages
        })
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const text = String(data?.message?.content || '').trim();
        if (text) {
          return { ok: true, provider: 'ollama', model: targetModel, text };
        }
      }
    } catch (e) {
      clearTimeout(timer);
    }
  }
  return { ok: false, error: 'OLLAMA_UNREACHABLE_OR_EMPTY' };
}

/**
 * Unified 4-Way LLM Query with Zero-Downtime Local Fallback
 */
async function chatWithUnifiedLlm(opts = {}) {
  const startMs = Date.now();
  const state = loadHubState();
  const requestedProvider = String(opts.provider || state.activeProvider || 'ollama').toLowerCase();
  const requestedModel = opts.model || state.activeModel || 'gemma4:e4b';

  const messages = Array.isArray(opts.messages) && opts.messages.length > 0
    ? opts.messages
    : [
        ...(opts.systemPrompt ? [{ role: 'system', content: opts.systemPrompt }] : []),
        { role: 'user', content: String(opts.prompt || '안녕하세요') }
      ];

  let primaryResult = null;

  if (requestedProvider === 'openai') {
    primaryResult = await callOpenAiApi(messages, requestedModel, opts);
  } else if (requestedProvider === 'gemini') {
    primaryResult = await callGeminiApi(messages, requestedModel, opts);
  } else if (requestedProvider === 'lmstudio') {
    primaryResult = await callLmStudioApi(messages, requestedModel, state.lmstudioEndpoint, opts);
  } else {
    primaryResult = await callOllamaApi(messages, requestedModel, state.ollamaEndpoint, opts);
  }

  if (primaryResult && primaryResult.ok && primaryResult.text) {
    return {
      ok: true,
      provider: primaryResult.provider,
      model: primaryResult.model,
      text: primaryResult.text.replace(/\*\*/g, '').trim(),
      fallbackUsed: false,
      latencyMs: Date.now() - startMs
    };
  }

  // Auto-Fallback Chain: LM Studio -> Ollama (gemma4:e4b / e2b) -> Deterministic Response
  if (state.autoFallbackToLocal !== false) {
    if (requestedProvider !== 'lmstudio') {
      const lmsTry = await callLmStudioApi(messages, state.lmstudioModel, state.lmstudioEndpoint, { ...opts, timeoutMs: 2500 });
      if (lmsTry.ok && lmsTry.text) {
        return {
          ok: true,
          provider: 'lmstudio',
          model: lmsTry.model,
          text: lmsTry.text.replace(/\*\*/g, '').trim(),
          fallbackUsed: true,
          fallbackReason: primaryResult?.error || 'Primary unavailable',
          latencyMs: Date.now() - startMs
        };
      }
    }

    if (requestedProvider !== 'ollama') {
      const ollamaTry = await callOllamaApi(messages, state.ollamaModel || 'gemma4:e4b', state.ollamaEndpoint, opts);
      if (ollamaTry.ok && ollamaTry.text) {
        return {
          ok: true,
          provider: 'ollama',
          model: ollamaTry.model,
          text: ollamaTry.text.replace(/\*\*/g, '').trim(),
          fallbackUsed: true,
          fallbackReason: primaryResult?.error || 'Switched to local Ollama',
          latencyMs: Date.now() - startMs
        };
      }
    }
  }

  return {
    ok: false,
    provider: requestedProvider,
    model: requestedModel,
    text: '',
    error: primaryResult?.error || 'All LLM providers unreachable',
    latencyMs: Date.now() - startMs
  };
}

module.exports = {
  MULTI_LLM_CATALOG,
  loadHubState,
  saveHubState,
  getMultiLlmStatus,
  configureMultiLlmHub,
  chatWithUnifiedLlm
};
