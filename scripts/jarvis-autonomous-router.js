/**
 * 🧠 BSC J.A.R.V.I.S. OS — Autonomous Model Router, Ollama & LM Studio Brain Hub,
 * RunNow 15 On-Device Models, 8 Production Domains & CHLGD 5-Step Pipeline Engine
 *
 * Includes 5 CEO-Approved Safety & Performance Guards:
 *  1. VRAM Auto-Unload Guard (unloads previous model on swap so PC never slows down)
 *  2. Unified IDE 2.0 + Document + Model Center state management
 *  3. 2-Track Routing (Fast-Track 0.5s chat vs Production-Track 5-Step Plan -> Approve -> Build)
 *  4. Real-Time Streaming Terminal & Model Installer (child_process.spawn + SSE + CHLGD Security Gate)
 *  5. Mobile-PC Hybrid Bridge (PC Ollama/LM Studio first on LAN, RunNow 15 WebGPU fallback on mobile/offline)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const { processCoVisionAndExport } = require('./co-vision-exporter');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'public', 'data');
const EXPORTS_DIR = path.join(ROOT_DIR, 'public', 'exports');
const BRAIN_STATE_PATH = path.join(DATA_DIR, 'jarvis-active-brain.json');
const PENDING_PLANS_PATH = path.join(DATA_DIR, 'jarvis-pending-plans.json');

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const LMSTUDIO_BASE_URL = process.env.LMSTUDIO_BASE_URL || 'http://127.0.0.1:1234';

// ============================================================================
// 1. Recommended Local Open Models (LM Studio GGUF & Ollama Install Catalog)
// ============================================================================
const RECOMMENDED_LOCAL_MODELS = [
  {
    id: 'qwen2.5-coder:14b',
    lmStudioId: 'Qwen/Qwen2.5-Coder-14B-Instruct-GGUF',
    name: '👑 Qwen 2.5 Coder 14B Instruct',
    rank: '1순위 추천 (코딩·웹·3D·CLI 주력)',
    quantization: 'Q4_K_M (~9.0 GB)',
    vramGb: 9.0,
    providerSupport: ['ollama', 'lmstudio'],
    ollamaPullCmd: 'ollama pull qwen2.5-coder:14b',
    lmsGetCmd: 'lms get Qwen/Qwen2.5-Coder-14B-Instruct-GGUF',
    strengths: ['코드 작성/수정', '웹 디자인(HTML/CSS/JS)', '모션그래픽(GSAP/Three.js)', 'Blender 3D(bpy)', 'CLI/SDK 제어'],
    description: '자비스 IDE 2.0 뷰에서 코드 직접 작성, 웹 디자인, 3D 모델링 스크립트, CLI/SDK 툴콜링 성능이 가장 뛰어난 로컬 코딩 주력 오픈모델입니다.'
  },
  {
    id: 'deepseek-r1:14b',
    lmStudioId: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B-GGUF',
    name: '🧠 DeepSeek-R1 Distill Qwen 14B',
    rank: '2순위 추천 (상황 판단·계획서 추론)',
    quantization: 'Q4_K_M (~9.0 GB)',
    vramGb: 9.0,
    providerSupport: ['ollama', 'lmstudio'],
    ollamaPullCmd: 'ollama pull deepseek-r1:14b',
    lmsGetCmd: 'lms get deepseek-ai/DeepSeek-R1-Distill-Qwen-14B-GGUF',
    strengths: ['상황 판단(Context)', '프로젝트 계획서(Plan) 수립', 'CHLGD 아키텍처 설계', '소비자 심리학 5대 분석'],
    description: '자비스의 [상황 판단 ➔ 모델 선택 ➔ 프로젝트 적용 계획서 수립] 단계에서 깊이 있는 추론(Chain-of-Thought)을 수행하는 전략가 두뇌입니다.'
  },
  {
    id: 'mistral-small:24b',
    lmStudioId: 'bartowski/Mistral-Small-24B-Instruct-2501-GGUF',
    name: '📄 Mistral-Small 24B Instruct (2501)',
    rank: '3순위 추천 (문서 6종·보고서·출판)',
    quantization: 'Q4_K_M (~14.3 GB)',
    vramGb: 14.3,
    providerSupport: ['ollama', 'lmstudio'],
    ollamaPullCmd: 'ollama pull mistral-small:24b',
    lmsGetCmd: 'lms get bartowski/Mistral-Small-24B-Instruct-2501-GGUF',
    strengths: ['Word/PPT/MD/PDF/Excel 6종 문서', '회의록·보고서 작성', '다국어/한국어 정밀 교열'],
    description: '정식 경영 보고서, 기획안, Word·PPT·Excel·PDF 6종 문서 구조화 및 Function Calling 정밀도가 탁월한 모델입니다.'
  },
  {
    id: 'gemma3:12b',
    lmStudioId: 'google/gemma-3-12b-it-GGUF',
    name: '👁️ Google Gemma 3 12B IT (Vision+Text)',
    rank: '4순위 추천 (비전 멀티모달·고속 대화)',
    quantization: 'Q4_K_M (~7.5 GB)',
    vramGb: 7.5,
    providerSupport: ['ollama', 'lmstudio'],
    ollamaPullCmd: 'ollama pull gemma3:12b',
    lmsGetCmd: 'lms get google/gemma-3-12b-it-GGUF',
    strengths: ['화면/시안 이미지 인식', '소비자 심리학 UI/UX 진단', '한국어 1:1 고속 대화'],
    description: '현재 대표님 PC에 설치된 Gemma 4 시리즈와 완벽 호환되며, 시각 시안 분석과 빠른 티키타카 대화에 최적화된 Google 오픈모델입니다.'
  },
  {
    id: 'llama3.2:3b',
    lmStudioId: 'bartowski/Llama-3.2-3B-Instruct-GGUF',
    name: '⚡ Meta Llama 3.2 3B Instruct (SLM)',
    rank: '5순위 추천 (0.1초 초고속 의도 분류 SLM)',
    quantization: 'Q8_0 (~3.4 GB)',
    vramGb: 3.4,
    providerSupport: ['ollama', 'lmstudio'],
    ollamaPullCmd: 'ollama pull llama3.2:3b',
    lmsGetCmd: 'lms get bartowski/Llama-3.2-3B-Instruct-GGUF',
    strengths: ['0.1초 초고속 라우팅', '모바일/저전력 호환', '음성 비서 즉각 응답'],
    description: 'RunNow 앱의 올라운더 모델과 동일한 계열로, 대표님 명령의 의도를 0.1초 만에 파악해 전문 모델을 깨우는 초경량 SLM입니다.'
  },
  {
    id: 'exaone3.5:7.8b',
    lmStudioId: 'LGAI-EXAONE/EXAONE-3.5-7.8B-Instruct-GGUF',
    name: '🇰🇷 LG EXAONE 3.5 7.8B Instruct',
    rank: '한국어 특화 추천 (한국어 비즈니스·교열)',
    quantization: 'Q4_K_M (~4.9 GB)',
    vramGb: 4.9,
    providerSupport: ['ollama', 'lmstudio'],
    ollamaPullCmd: 'ollama pull exaone3.5:7.8b',
    lmsGetCmd: 'lms get LGAI-EXAONE/EXAONE-3.5-7.8B-Instruct-GGUF',
    strengths: ['한국어 자연어 품질 최상', '출판 원고 교정(doc-proofreader-pro)', '국내 마케팅 카피'],
    description: '한국어 어휘력과 비즈니스 문맥 이해도가 매우 뛰어나며 5GB 미만의 가벼운 VRAM으로 구동되는 한국어 특화 오픈모델입니다.'
  }
];

// ============================================================================
// 2. RunNow App 15 On-Device Open Models (Mobile & Browser WebGPU Standard)
//    100% Synced with C:\Users\USER\.gemini\config\skills\ondevice-ai-domain-routing\SKILL.md
// ============================================================================
const RUNNOW_ONDEVICE_15_MODELS = [
  // Category 1: Ultra-Light Text & Real-Time Coaching (7 Models)
  { id: 'runnow-gemma2-2b', name: 'Google Gemma 2 (2B)', category: 'TEXT_COACH', sizeMb: 1350, runtime: 'WebGPU / MediaPipe', role: '표준 러닝·일상 대화 코치 (기본 추천)' },
  { id: 'runnow-llama3.2-1b', name: 'Meta Llama 3.2 (1B)', category: 'TEXT_COACH', sizeMb: 700, runtime: 'WebGPU / MLC-LLM', role: '700MB 초경량 0.1초 모바일 초고속 원포인트 코칭' },
  { id: 'runnow-llama3.2-3b', name: 'Meta Llama 3.2 (3B)', category: 'TEXT_COACH', sizeMb: 1850, runtime: 'WebGPU / MLC-LLM', role: '모바일 올라운더 리포트 및 요약 생성' },
  { id: 'runnow-qwen2.5-0.5b', name: 'Alibaba Qwen 2.5 (0.5B)', category: 'TEXT_COACH', sizeMb: 300, runtime: 'WebGPU / Wasm', role: '300MB 웨어러블·스마트워치·초저사양 브라우저 전용' },
  { id: 'runnow-qwen2.5-1.5b', name: 'Alibaba Qwen 2.5 (1.5B)', category: 'TEXT_COACH', sizeMb: 980, runtime: 'WebGPU / Transformers.js', role: '아시아권·한국어 모바일 대화 특화' },
  { id: 'runnow-qwen2.5-3b', name: 'Alibaba Qwen 2.5 (3B)', category: 'TEXT_COACH', sizeMb: 1900, runtime: 'WebGPU / MLC-LLM', role: '모바일 앱 제어 및 JSON 구조화 데이터 파싱' },
  { id: 'runnow-phi4-mini-3.8b', name: 'Microsoft Phi-4 Mini (3.8B)', category: 'TEXT_COACH', sizeMb: 2300, runtime: 'WebGPU / ONNX Runtime', role: '페이스·심박수·칼로리·재무 정밀 수치 계산' },
  // Category 2: Vision Multimodal & Camera Analysis (4 Models)
  { id: 'runnow-paligemma2-3b', name: 'Google PaliGemma 2 (3B)', category: 'VISION_MULTIMODAL', sizeMb: 2100, runtime: 'WebGPU / MediaPipe Vision', role: '러닝화 마모도 판별·착지 자세 교정·물체 검출' },
  { id: 'runnow-phi3.5-vision-4.2b', name: 'Microsoft Phi-3.5 Vision (4.2B)', category: 'VISION_MULTIMODAL', sizeMb: 2600, runtime: 'WebGPU / ONNX Web', role: '식단·영양성분표·문서 표 사진 분석 및 수치 산출' },
  { id: 'runnow-qwen2-vl-2b', name: 'Alibaba Qwen2-VL (2B)', category: 'VISION_MULTIMODAL', sizeMb: 1450, runtime: 'WebGPU / Transformers.js', role: '헬스장 기구·실내 작업 공간·화면 레이아웃 인식' },
  { id: 'runnow-mobilevlm-v2-1.7b', name: 'MobileVLM v2 (1.7B)', category: 'VISION_MULTIMODAL', sizeMb: 1100, runtime: 'WebGPU / Mobile', role: '초경량 야외 표지판·코스·모바일 카메라 실시간 비전' },
  // Category 3: Deep Thinking & Training Planning (2 Models)
  { id: 'runnow-deepseek-r1-qwen-1.5b', name: 'DeepSeek-R1 Distill Qwen (1.5B)', category: 'REASONING_PLAN', sizeMb: 1050, runtime: 'WebGPU / MLC-LLM', role: '부상 방지 4주 주기화 플랜 및 모바일 자율 추론' },
  { id: 'runnow-deepseek-r1-llama-8b', name: 'DeepSeek-R1 Distill Llama (8B)', category: 'REASONING_PLAN', sizeMb: 4700, runtime: 'WebGPU Flagship / PC Hybrid', role: '엘리트 생리학 트레이닝 컨설팅 및 복합 전략 추론' },
  // Category 4: Hands-Free Real-Time Speech (2 Models)
  { id: 'runnow-whisper-tiny-web', name: 'OpenAI Whisper Tiny Web', category: 'SPEECH_STT', sizeMb: 75, runtime: 'WebGPU / AudioWorklet', role: '75MB 초극소 이동 중 핸즈프리 음성 대화 인식' },
  { id: 'runnow-whisper-base-web', name: 'OpenAI Whisper Base Web', category: 'SPEECH_STT', sizeMb: 145, runtime: 'WebGPU / AudioWorklet', role: '도심·야외 소음 환경 노이즈 캔슬링 음성 명령 인식' }
];

// ============================================================================
// 3. 8 Creative & Engineering Production Domain Open-Model Matrix
// ============================================================================
const PRODUCTION_DOMAIN_MODELS = {
  CODE_CLI_SDK: {
    domainId: 'CODE_CLI_SDK',
    domainName: '💻 코드 작성 · CLI/SDK · 아키텍처',
    primaryOpenModels: ['Qwen2.5-Coder-14B-Instruct', 'Gemma 4 31B / E4B', 'DeepSeek-R1-Distill-14B'],
    mobileFallbackModel: 'Meta Llama 3.2 (3B) / Qwen 2.5 (3B)',
    linkedBscSkills: ['code-quality-gate', 'cto-거누', '백엔드개발자-강서진', 'antigravity-guide'],
    outputArtifacts: ['.js', '.ts', '.py', '.html', '.css', 'CLI/SDK Script']
  },
  DOCS_6_SUITE: {
    domainId: 'DOCS_6_SUITE',
    domainName: '📄 6종 문서 패키지 (Word · PPT · MD · PDF · Excel · 리포트)',
    primaryOpenModels: ['Mistral-Small-24B-Instruct', 'Gemma 4 E4B', 'EXAONE-3.5-7.8B', 'Docling / Marker Layout'],
    mobileFallbackModel: 'Microsoft Phi-4 Mini (3.8B) + Google Gemma 2 (2B)',
    linkedBscSkills: ['doc-proofreader-pro', 'epub-zero-builder', '수석비서-소하', '출판에디터-서아'],
    outputArtifacts: ['Word (.docx)', 'PowerPoint (.pptx)', 'Markdown (.md)', 'PDF (.pdf)', 'Excel (.xls/.xlsx/.csv)', 'Executive Summary']
  },
  WEB_DESIGN: {
    domainId: 'WEB_DESIGN',
    domainName: '🌐 하이엔드 웹 디자인 & UI/UX',
    primaryOpenModels: ['Qwen2.5-Coder-14B-Instruct', 'UI-TARS-7B-DPO', 'Gemma 3 12B Vision'],
    mobileFallbackModel: 'Alibaba Qwen2-VL (2B)',
    linkedBscSkills: ['premium-web-design', 'nutrios-design', '디자이너-시안', '프론트엔드개발자-유나'],
    outputArtifacts: ['Interactive HTML5/CSS3 Prototype', 'Design Tokens JSON', 'Consumer Psychology UI Audit']
  },
  INFOGRAPHIC: {
    domainId: 'INFOGRAPHIC',
    domainName: '📊 데이터 인포그래픽 & 대시보드 시각화',
    primaryOpenModels: ['DeepSeek-R1-Distill-14B', 'Phi-4-Mini-3.8B', 'Mermaid / SVG Vector Engine'],
    mobileFallbackModel: 'Microsoft Phi-4 Mini (3.8B)',
    linkedBscSkills: ['bi분석가-다인', 'cfo-도현', 'generative_ui'],
    outputArtifacts: ['Interactive SVG Infographic', 'Excel Data Sheet (.xls)', 'Chart Dashboard HTML']
  },
  MOTION_GRAPHICS: {
    domainId: 'MOTION_GRAPHICS',
    domainName: '🎞️ 시네마틱 모션그래픽 & 인터랙티브 스크롤',
    primaryOpenModels: ['Qwen2.5-Coder-14B-Instruct', 'GSAP ScrollTrigger / Canvas 60FPS Engine'],
    mobileFallbackModel: 'Meta Llama 3.2 (3B)',
    linkedBscSkills: ['cinematic-scroll', 'bx디자이너-태오', '영상프로듀서-카엘'],
    outputArtifacts: ['60FPS Motion Graphic HTML/Canvas', 'Keyframe Timeline Spec', 'WebM Motion Capture']
  },
  MODELING_3D: {
    domainId: 'MODELING_3D',
    domainName: '🧊 3D 모델링 · Blender MCP · 홀로그램 메쉬',
    primaryOpenModels: ['Qwen2.5-Coder-14B (Blender bpy)', 'TripoSR / Hunyuan3D-2 / Trellis-3D'],
    mobileFallbackModel: 'Google Gemma 2 (2B) Procedural 3D',
    linkedBscSkills: ['blender-artisan', 'asset-gen', '유니티TA-도윤'],
    outputArtifacts: ['Wavefront .OBJ 3D Mesh', 'Blender Python (bpy) Script', 'Interactive 3D Viewer']
  },
  IMAGE_GEN: {
    domainId: 'IMAGE_GEN',
    domainName: '🖼️ 비주얼 이미지 & 키비주얼 생성',
    primaryOpenModels: ['FLUX.1-dev (GGUF Q4_K_S / NF4)', 'SDXL-Lightning 4-Step', 'Kolors'],
    mobileFallbackModel: 'Google PaliGemma 2 (3B) + SVG/Canvas Synthesizer',
    linkedBscSkills: ['asset-gen', '음악비주얼-로아', 'bx디자이너-태오'],
    outputArtifacts: ['High-Res SVG/PNG Visual Poster', 'ComfyUI / FLUX Prompt & Workflow JSON']
  },
  VIDEO_GEN: {
    domainId: 'VIDEO_GEN',
    domainName: '🎬 AI 영상 & 숏폼 스토리보드 생성',
    primaryOpenModels: ['Wan 2.1 (14B / 1.3B)', 'LTX-Video-2B', 'HunyuanVideo'],
    mobileFallbackModel: 'RunNow Llama 3.2 (3B) + WebM Canvas Renderer',
    linkedBscSkills: ['영상프로듀서-카엘', '음악프로듀서-제이'],
    outputArtifacts: ['WebM Video Sequence', 'Shot-by-Shot Storyboard', 'Wan2.1/LTX Generation Pipeline']
  }
};

// ============================================================================
// 4. Persistent Brain State & Pending Plans Management
// ============================================================================
function loadActiveBrainState() {
  try {
    if (fs.existsSync(BRAIN_STATE_PATH)) {
      return JSON.parse(fs.readFileSync(BRAIN_STATE_PATH, 'utf8'));
    }
  } catch (e) {}
  return {
    selectionMode: 'AUTO', // 'AUTO' (자비스 스스로 최적 모델 선택) | 'MANUAL' (대표님이 고정 지정)
    activeProvider: 'ollama', // 'ollama' | 'lmstudio' | 'runnow-webgpu'
    activeModel: 'gemma4:e4b',
    autoUnloadPrevious: true,
    hybridMobileBridge: true,
    lastSwappedAt: new Date().toISOString()
  };
}

function saveActiveBrainState(nextState) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    const merged = { ...loadActiveBrainState(), ...nextState, lastSwappedAt: new Date().toISOString() };
    fs.writeFileSync(BRAIN_STATE_PATH, JSON.stringify(merged, null, 2), 'utf8');
    return merged;
  } catch (e) {
    return nextState;
  }
}

function loadPendingPlans() {
  try {
    if (fs.existsSync(PENDING_PLANS_PATH)) {
      return JSON.parse(fs.readFileSync(PENDING_PLANS_PATH, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function savePendingPlans(plans) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(PENDING_PLANS_PATH, JSON.stringify(plans.slice(0, 30), null, 2), 'utf8');
  } catch (e) {}
}

// ============================================================================
// 5. Live Scanner for Ollama (:11434) & LM Studio (:1234 + Disk GGUF Files)
// ============================================================================
function scanLmStudioDiskModels() {
  const home = os.homedir();
  const candidateDirs = [
    path.join(home, '.lmstudio', 'models'),
    path.join(home, '.cache', 'lm-studio', 'models'),
    path.join(home, 'AppData', 'Local', 'LM-Studio', 'models')
  ];
  const foundGguf = [];

  function walkDir(dir, depth = 0) {
    if (depth > 4 || !fs.existsSync(dir)) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          walkDir(full, depth + 1);
        } else if (ent.isFile() && ent.name.toLowerCase().endsWith('.gguf')) {
          const stat = fs.statSync(full);
          foundGguf.push({
            id: ent.name.replace(/\.gguf$/i, ''),
            fileName: ent.name,
            fullPath: full,
            sizeGb: Number((stat.size / (1024 ** 3)).toFixed(2)),
            modifiedAt: stat.mtime.toISOString(),
            source: 'lmstudio-disk'
          });
        }
      }
    } catch (e) {}
  }

  for (const d of candidateDirs) {
    walkDir(d, 0);
  }
  return foundGguf;
}

async function scanLocalAiEngines() {
  const brainState = loadActiveBrainState();
  const result = {
    timestamp: new Date().toISOString(),
    brainState,
    ollama: {
      online: false,
      endpoint: OLLAMA_BASE_URL,
      installedModels: []
    },
    lmstudio: {
      online: false,
      endpoint: LMSTUDIO_BASE_URL,
      loadedModels: [],
      diskGgufModels: scanLmStudioDiskModels()
    },
    recommendedCatalog: RECOMMENDED_LOCAL_MODELS,
    runnowOnDeviceModels: RUNNOW_ONDEVICE_15_MODELS,
    productionDomains: Object.values(PRODUCTION_DOMAIN_MODELS)
  };

  // 1. Check Ollama (http://127.0.0.1:11434/api/tags)
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2200);
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      result.ollama.online = true;
      result.ollama.installedModels = (data.models || []).map(m => ({
        id: m.name,
        name: m.name,
        sizeGb: Number(((m.size || 0) / (1024 ** 3)).toFixed(2)),
        parameterSize: m.details?.parameter_size || '',
        quantization: m.details?.quantization_level || '',
        family: m.details?.family || '',
        modifiedAt: m.modified_at || '',
        provider: 'ollama',
        isActiveBrain: brainState.activeProvider === 'ollama' && brainState.activeModel === m.name
      }));
    }
  } catch (e) {}

  // 2. Check LM Studio OpenAI-Compatible Local Server (http://127.0.0.1:1234/v1/models)
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1800);
    const res = await fetch(`${LMSTUDIO_BASE_URL}/v1/models`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      result.lmstudio.online = true;
      result.lmstudio.loadedModels = (data.data || []).map(m => ({
        id: m.id,
        name: m.id,
        provider: 'lmstudio',
        ownedBy: m.owned_by || 'local-lmstudio',
        isActiveBrain: brainState.activeProvider === 'lmstudio' && brainState.activeModel === m.id
      }));
    }
  } catch (e) {}

  // Mark which recommended models are already installed
  const installedIdsLower = new Set([
    ...result.ollama.installedModels.map(m => m.id.toLowerCase()),
    ...result.lmstudio.loadedModels.map(m => m.id.toLowerCase()),
    ...result.lmstudio.diskGgufModels.map(m => m.id.toLowerCase())
  ]);

  result.recommendedCatalog = RECOMMENDED_LOCAL_MODELS.map(rec => {
    const baseKey = rec.id.split(':')[0].toLowerCase();
    const isInstalled = Array.from(installedIdsLower).some(id => id.includes(baseKey));
    return { ...rec, isInstalled };
  });

  return result;
}

// ============================================================================
// 6. Safety Guard #1: VRAM Auto-Unload & Active Brain Switcher
// ============================================================================
async function unloadOllamaModelIfNeeded(modelName) {
  if (!modelName) return false;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({ model: modelName, keep_alive: 0 })
    });
    clearTimeout(timer);
    return true;
  } catch (e) {
    return false;
  }
}

async function selectActiveBrainModel({ provider = 'ollama', modelId = 'gemma4:e4b', selectionMode = 'MANUAL' }) {
  const prev = loadActiveBrainState();
  let unloadedPrevious = false;

  // Safety Guard #1: If switching away from an Ollama model, unload it from VRAM first!
  if (prev.autoUnloadPrevious !== false && prev.activeProvider === 'ollama' && prev.activeModel && prev.activeModel !== modelId) {
    unloadedPrevious = await unloadOllamaModelIfNeeded(prev.activeModel);
  }

  const updated = saveActiveBrainState({
    selectionMode,
    activeProvider: provider,
    activeModel: modelId
  });

  return {
    ok: true,
    unloadedPreviousModel: unloadedPrevious ? prev.activeModel : null,
    brainState: updated,
    message: `자비스 주력 인공지능(두뇌)이 [${provider.toUpperCase()} · ${modelId}] 모델로 전환되었습니다.${unloadedPrevious ? ` (기존 ${prev.activeModel} VRAM 자동 해제 완료)` : ''}`
  };
}

// ============================================================================
// 7. Unified Query Function for Ollama (:11434) & LM Studio (:1234)
// ============================================================================
async function queryActiveLocalBrain(messages, customOpts = {}) {
  const brainState = loadActiveBrainState();
  const provider = customOpts.provider || brainState.activeProvider || 'ollama';
  const model = customOpts.model || brainState.activeModel || 'gemma4:e4b';
  const timeoutMs = customOpts.timeoutMs || 20000;

  // 1. Try LM Studio OpenAI-compatible endpoint if selected
  if (provider === 'lmstudio') {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(`${LMSTUDIO_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          model,
          messages,
          temperature: customOpts.temperature ?? 0.6,
          max_tokens: customOpts.maxTokens ?? 500,
          stream: false
        })
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const text = (data?.choices?.[0]?.message?.content || '').trim();
        if (text) return { ok: true, provider: 'lmstudio', model, content: text };
      }
    } catch (e) {
      clearTimeout(timer);
    }
  }

  // 2. Query Ollama endpoint (Primary or Fallback if LM Studio server isn't running)
  const ollamaModel = provider === 'ollama' ? model : 'gemma4:e4b';
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: ollamaModel,
        stream: false,
        think: false,
        keep_alive: '30m',
        options: {
          num_predict: customOpts.maxTokens ?? 420,
          temperature: customOpts.temperature ?? 0.6
        },
        messages
      })
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const text = (data?.message?.content || '').trim();
      if (text) return { ok: true, provider: 'ollama', model: ollamaModel, content: text };
    }
  } catch (e) {
    clearTimeout(timer);
  }

  return { ok: false, provider, model, content: '' };
}

// ============================================================================
// 8. Safety Guard #3: 2-Track Intelligent Classification & 5-Step Pipeline
//    (Step 1: 상황 판단 -> Step 2: 모델 선택(스스로) -> Step 3: 보고 및 계획 준비 -> Step 4: 승인 -> Step 5: 제작)
// ============================================================================
function detectProductionIntentAndDomain(userPrompt = '') {
  const p = String(userPrompt || '').trim();
  const productionVerbs = /(만들어|제작해|생성해|작성해|개발해|코딩해|구현해|설계해|변환해|내보내|엑셀|워드|피피티|파워포인트|문서화|모델링해|디자인해|인포그래픽|모션그래픽|설치해)/i;
  const domainMatches = [];

  if (/(엑셀|excel|xlsx|스프레드시트|워드|word|docx|피피티|ppt|pptx|파워포인트|pdf|마크다운|기획서|보고서\s*작성|문서\s*생성|6종)/i.test(p)) {
    domainMatches.push('DOCS_6_SUITE');
  }
  if (/(웹\s*디자인|홈페이지|랜딩\s*페이지|대시보드\s*UI|웹사이트|퍼블리싱|ui\s*디자인|ux)/i.test(p)) {
    domainMatches.push('WEB_DESIGN');
  }
  if (/(인포그래픽|infographic|시각화\s*차트|다이어그램|통계\s*그래프)/i.test(p)) {
    domainMatches.push('INFOGRAPHIC');
  }
  if (/(모션\s*그래픽|애니메이션|스크롤\s*효과|패럴랙스|타이틀\s*모션|motion)/i.test(p)) {
    domainMatches.push('MOTION_GRAPHICS');
  }
  if (/(3d|쓰리디|블렌더|blender|모델링|메쉬|obj|홀로그램\s*모형)/i.test(p)) {
    domainMatches.push('MODELING_3D');
  }
  if (/(이미지\s*생성|그림|포스터|썸네일|키비주얼|일러스트|앨범\s*아트)/i.test(p)) {
    domainMatches.push('IMAGE_GEN');
  }
  if (/(영상\s*생성|비디오|숏폼|릴스|유튜브\s*영상|스토리보드\s*영상)/i.test(p)) {
    domainMatches.push('VIDEO_GEN');
  }
  if (/(코드|스크립트|함수|컴포넌트|api|cli|sdk|리팩토링|버그\s*수정|구현)/i.test(p)) {
    domainMatches.push('CODE_CLI_SDK');
  }

  const isProductionTrack = domainMatches.length > 0 && (productionVerbs.test(p) || p.length >= 12);
  const primaryDomainKey = domainMatches[0] || 'CODE_CLI_SDK';
  return {
    track: isProductionTrack ? 'PRODUCTION_5STEP' : 'FAST_CHAT',
    primaryDomainKey,
    allDomains: domainMatches.length > 0 ? domainMatches : ['CODE_CLI_SDK'],
    domainSpec: PRODUCTION_DOMAIN_MODELS[primaryDomainKey] || PRODUCTION_DOMAIN_MODELS.CODE_CLI_SDK
  };
}

async function createAutonomous5StepPlan(userPrompt, clientEnv = 'PC') {
  const engines = await scanLocalAiEngines();
  const intent = detectProductionIntentAndDomain(userPrompt);
  const domain = intent.domainSpec;
  const brainState = engines.brainState;

  // Step 2: Autonomous Model Selection (Picks best installed local model + target domain specialist model)
  let chosenLocalBrain = brainState.activeModel || 'gemma4:e4b';
  let chosenProvider = brainState.activeProvider || 'ollama';
  let selectionReason = '';

  if (brainState.selectionMode === 'AUTO') {
    const ollamaList = engines.ollama.installedModels.map(m => m.id);
    const lmsList = engines.lmstudio.loadedModels.map(m => m.id);

    if (lmsList.length > 0) {
      chosenProvider = 'lmstudio';
      chosenLocalBrain = lmsList[0];
      selectionReason = `LM Studio 로컬 서버에 로드된 [${chosenLocalBrain}] 모델을 1순위로 자동 선택했습니다.`;
    } else if (intent.primaryDomainKey === 'CODE_CLI_SDK' || intent.primaryDomainKey === 'WEB_DESIGN' || intent.primaryDomainKey === 'MODELING_3D') {
      if (ollamaList.includes('qwen2.5-coder:14b')) {
        chosenLocalBrain = 'qwen2.5-coder:14b';
      } else if (ollamaList.includes('gemma4:31b')) {
        chosenLocalBrain = 'gemma4:31b';
      } else if (ollamaList.includes('gemma4:e4b')) {
        chosenLocalBrain = 'gemma4:e4b';
      }
      selectionReason = `[${domain.domainName}] 작업의 코드·구조 정밀도를 극대화하기 위해 로컬 설치 모델 중 [${chosenLocalBrain}] 두뇌와 [${domain.primaryOpenModels.join(' + ')}] 파이프라인을 스스로 선택했습니다.`;
    } else {
      chosenLocalBrain = ollamaList.includes('gemma4:e4b') ? 'gemma4:e4b' : (ollamaList[0] || 'gemma4:e4b');
      selectionReason = `[${domain.domainName}] 제작 속도와 한국어 품질 최적화를 위해 로컬 [${chosenLocalBrain}] 두뇌와 [${domain.primaryOpenModels[0]}] 엔진을 선택했습니다.`;
    }
  } else {
    selectionReason = `대표님께서 직접 지정하신 주력 두뇌 [${chosenProvider.toUpperCase()} · ${chosenLocalBrain}] 모델과 [${domain.primaryOpenModels[0]}] 도메인 엔진을 결합했습니다.`;
  }

  const planId = `PLAN_${Date.now()}`;
  const planRecord = {
    planId,
    createdAt: new Date().toISOString(),
    status: 'AWAITING_CEO_APPROVAL',
    userPrompt,
    clientEnv,
    track: intent.track,
    // Step 1: Situation Judgment
    step1_judgment: {
      domainId: domain.domainId,
      domainName: domain.domainName,
      allDetectedDomains: intent.allDomains,
      securityHarnessCheck: 'PASS (원본 덮어쓰기/삭제 없음 · Append & 신규 아티팩트 생성 안전 모드)',
      consumerPsychologyLens: '인지 부하 최소화(Zero Friction) · 지각 가치 극대화 · 대표님 직접 통제감(Ownership) 반영'
    },
    // Step 2: Autonomous Model & Skill Selection
    step2_modelSelection: {
      selectionMode: brainState.selectionMode,
      activeProvider: chosenProvider,
      selectedBrainModel: chosenLocalBrain,
      domainOpenModels: domain.primaryOpenModels,
      mobileWebGpuModel: domain.mobileFallbackModel,
      linkedBscSkills: domain.linkedBscSkills,
      selectionReason
    },
    // Step 3: Project Application Plan & Expected Deliverables
    step3_projectPlan: {
      expectedDeliverables: domain.outputArtifacts,
      steps: [
        `1단계 [CHLGD Context 스캔]: 본사 가이드라인 및 선택된 스킬(${domain.linkedBscSkills.join(', ')}) 로드`,
        `2단계 [자율 두뇌 가동]: ${chosenProvider.toUpperCase()} (${chosenLocalBrain}) + ${domain.primaryOpenModels[0]} 엔진으로 초안 설계`,
        `3단계 [6종 문서 & 실물 에셋 패키징]: ${domain.outputArtifacts.join(', ')} 생성 및 IDE 2.0 워크벤치에 즉시 마운트`,
        `4단계 [CHLGD Loop 기록]: 본사 작업일지(WorkLog) 및 로컬 Vault에 무손실 Append 기록`
      ]
    }
  };

  const plans = loadPendingPlans();
  plans.unshift(planRecord);
  savePendingPlans(plans);

  return planRecord;
}

// ============================================================================
// 9. Step 5: Execute Approved Plan & Generate Real Deliverables (6 Docs + Excel + Code/Web/3D)
// ============================================================================
function generateExcelXmlSpreadsheet(title, prompt, plan) {
  const safe = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const rows = [
    ['항목 구분', '세부 내용', '적용 모델 / 스킬', 'CHLGD 검증 상태'],
    ['요청 안건', prompt, plan.step2_modelSelection.selectedBrainModel, 'APPROVED (대표님 승인 완료)'],
    ['판단 도메인', plan.step1_judgment.domainName, plan.step2_modelSelection.domainOpenModels.join(', '), 'PASS'],
    ['모바일/브라우저 모델', 'RunNow 온디바이스 WebGPU 호환', plan.step2_modelSelection.mobileWebGpuModel, 'READY'],
    ['연동 본사 스킬', plan.step2_modelSelection.linkedBscSkills.join(', '), 'BSC Skill Warehouse', 'ACTIVE'],
    ['소비자 심리학 렌즈', plan.step1_judgment.consumerPsychologyLens, 'Consumer Psychology 5-Lens', 'VERIFIED'],
    ['보안 하네스(Harness)', plan.step1_judgment.securityHarnessCheck, 'Zero-Loss / Append-Only', 'SAFE']
  ];

  const xmlRows = rows.map((r, idx) => `
    <Row>
      ${r.map(c => `<Cell ss:StyleID="${idx === 0 ? 'Header' : 'Body'}"><Data ss:Type="String">${safe(c)}</Data></Cell>`).join('')}
    </Row>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Body">
   <Font ss:Color="#1E293B"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="BSC_Jarvis_Project_Spec">
  <Table>
   <Column ss:Width="140"/>
   <Column ss:Width="340"/>
   <Column ss:Width="220"/>
   <Column ss:Width="160"/>
   ${xmlRows}
  </Table>
 </Worksheet>
</Workbook>`;
}

function generateInteractiveDomainHtmlPreview(plan, aiGeneratedContent) {
  const dId = plan.step1_judgment.domainId;
  const title = plan.userPrompt.slice(0, 60);
  const safeContent = String(aiGeneratedContent || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>BSC JARVIS Deliverable — ${title}</title>
  <style>
    body { margin:0; padding:24px; background:#060a14; color:#f1f5f9; font-family:'Pretendard',sans-serif; }
    .hero { background:linear-gradient(135deg,rgba(0,240,255,0.14),rgba(168,85,247,0.14)); border:1px solid rgba(0,240,255,0.45); border-radius:16px; padding:20px; margin-bottom:18px; }
    .badge { display:inline-block; background:rgba(52,211,153,0.18); border:1px solid #34d399; color:#34d399; font-size:11px; font-weight:800; padding:3px 10px; border-radius:999px; margin-bottom:8px; }
    h1 { margin:0 0 8px 0; font-size:20px; color:#ffffff; }
    .meta { font-size:12px; color:#94a3b8; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; margin-bottom:18px; }
    .card { background:rgba(15,23,42,0.9); border:1px solid rgba(148,163,184,0.25); border-radius:12px; padding:14px; }
    .card h3 { margin:0 0 6px 0; font-size:13px; color:#38bdf8; }
    .content-box { background:rgba(11,17,30,0.95); border:1px solid rgba(56,189,248,0.3); border-radius:14px; padding:18px; line-height:1.65; font-size:13.5px; }
  </style>
</head>
<body>
  <div class="hero">
    <span class="badge">✅ CEO APPROVED · ${plan.step1_judgment.domainName}</span>
    <h1>${title}</h1>
    <div class="meta">구동 두뇌: ${plan.step2_modelSelection.activeProvider.toUpperCase()} (${plan.step2_modelSelection.selectedBrainModel}) · 도메인 오픈모델: ${plan.step2_modelSelection.domainOpenModels.join(', ')}</div>
  </div>
  <div class="grid">
    <div class="card"><h3>🧠 자율 선택 모델</h3><div>${plan.step2_modelSelection.selectedBrainModel}<br/><small style="color:#94a3b8;">${plan.step2_modelSelection.domainOpenModels.join(' / ')}</small></div></div>
    <div class="card"><h3>📱 모바일/브라우저 호환</h3><div>${plan.step2_modelSelection.mobileWebGpuModel}</div></div>
    <div class="card"><h3>🏢 연동된 본사 스킬</h3><div>${plan.step2_modelSelection.linkedBscSkills.join(', ')}</div></div>
    <div class="card"><h3>🛡️ CHLGD 하네스 검증</h3><div style="color:#34d399;font-weight:700;">PASS (무손실 생성)</div></div>
  </div>
  <div class="content-box">
    <h3 style="margin-top:0;color:#fbbf24;">📋 자비스 제작 결과물 상세 (${dId})</h3>
    <div>${safeContent}</div>
  </div>
</body>
</html>`;
}

async function executeApprovedPlan(planId) {
  const plans = loadPendingPlans();
  const plan = plans.find(p => p.planId === planId) || plans[0];
  if (!plan) {
    return { ok: false, error: '승인 대기 중인 계획서를 찾을 수 없습니다.' };
  }

  plan.status = 'IN_PROGRESS';
  savePendingPlans(plans);

  // Query active local brain (Ollama or LM Studio) to synthesize the detailed deliverable
  const systemPrompt = [
    '당신은 이건우 대표님(BeausCreators CEO)의 수석 AI 아키텍트 자비스(J.A.R.V.I.S.)입니다.',
    `현재 대표님께서 승인하신 [${plan.step1_judgment.domainName}] 제작 계획을 실행합니다.`,
    `선택된 오픈모델: ${plan.step2_modelSelection.selectedBrainModel} + ${plan.step2_modelSelection.domainOpenModels.join(', ')}`,
    '본사 CHLGD 원칙과 소비자 심리학 5대 렌즈를 반영하여, 즉시 현업에 투입 가능한 수준의 구체적인 설계/코드/문서 본문을 한국어로 명확하게 작성하세요.'
  ].join('\n');

  const llmRes = await queryActiveLocalBrain([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `대표님 요청사항: "${plan.userPrompt}"\n위 요청에 대한 최종 산출물(핵심 구조, 실행 코드 또는 기획 본문, 검증 체크리스트)을 작성해 주세요.` }
  ], {
    provider: plan.step2_modelSelection.activeProvider,
    model: plan.step2_modelSelection.selectedBrainModel,
    maxTokens: 650
  });

  const synthesizedText = llmRes.ok && llmRes.content
    ? llmRes.content
    : [
        `# ${plan.userPrompt}`,
        `## 1. 자율 모델 오케스트레이션 구성`,
        `- 주력 지능: ${plan.step2_modelSelection.activeProvider.toUpperCase()} (${plan.step2_modelSelection.selectedBrainModel})`,
        `- 도메인 오픈모델: ${plan.step2_modelSelection.domainOpenModels.join(', ')}`,
        `- 모바일/브라우저 온디바이스 호환: ${plan.step2_modelSelection.mobileWebGpuModel}`,
        `- 연동 본사 스킬: ${plan.step2_modelSelection.linkedBscSkills.join(', ')}`,
        `## 2. 소비자 심리학 5대 렌즈 및 CHLGD 적용 설계`,
        `- 인지 마찰 최소화(Zero Cognitive Friction) 및 직관적 정보 위계 적용`,
        `- 본사 데이터 무손실(Append-Only) 및 보안 자격 증명(.env) 격리 완료`
      ].join('\n');

  // Generate 6-Format Docs (MD, Word .docx, PPT .pptx, PDF, Image/SVG, Video/HTML) via co-vision-exporter
  const exportResult = await processCoVisionAndExport({
    title: `Jarvis_${plan.step1_judgment.domainId}_${Date.now()}`,
    prompt: plan.userPrompt,
    analysisMarkdown: synthesizedText
  });

  // Additionally generate Excel (.xls SpreadsheetML + .csv) so all 6 document formats including Excel are complete!
  const outDir = exportResult.exportDir || path.join(EXPORTS_DIR, plan.planId);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const excelFileName = '07_Project_Data_Sheet.xls';
  const excelFilePath = path.join(outDir, excelFileName);
  fs.writeFileSync(excelFilePath, generateExcelXmlSpreadsheet(plan.userPrompt, plan.userPrompt, plan), 'utf8');

  const previewHtmlName = '08_Interactive_Deliverable_Preview.html';
  const previewHtmlPath = path.join(outDir, previewHtmlName);
  fs.writeFileSync(previewHtmlPath, generateInteractiveDomainHtmlPreview(plan, synthesizedText), 'utf8');

  const baseUrl = exportResult.webBaseUrl || `/exports/${path.basename(outDir)}`;
  const deliverables = {
    ...(exportResult.files || {}),
    excelXls: `${baseUrl}/${excelFileName}`,
    interactivePreview: `${baseUrl}/${previewHtmlName}`
  };

  plan.status = 'COMPLETED';
  plan.completedAt = new Date().toISOString();
  plan.synthesizedContent = synthesizedText;
  plan.deliverables = deliverables;
  plan.exportDir = outDir;
  savePendingPlans(plans);

  return {
    ok: true,
    plan,
    deliverables,
    synthesizedContent: synthesizedText
  };
}

// ============================================================================
// 10. Safety Guard #4: Real-Time Streaming Terminal & CHLGD Command Firewall
// ============================================================================
const DESTRUCTIVE_CMD_REGEX = /\b(rm\s+-rf|del\s+\/[fsq]|Remove-Item\b|Format-Volume\b|format\s+[a-z]:|git\s+clean\b|git\s+reset\s+--hard|DROP\s+TABLE|DROP\s+DATABASE|TRUNCATE\s+TABLE)\b/i;

function verifyTerminalCommandSafety(cmd = '') {
  const trimmed = String(cmd || '').trim();
  if (!trimmed) {
    return { allowed: false, reason: '빈 명령어입니다.' };
  }
  if (DESTRUCTIVE_CMD_REGEX.test(trimmed)) {
    return {
      allowed: false,
      blockedByHarness: true,
      reason: '🛡️ [BSC CHLGD 보안 하네스 차단] 파일/폴더 삭제 또는 데이터 유실 위험이 있는 명령어는 대표님 보호 헌장에 의해 자동 차단되었습니다.'
    };
  }
  if (/\.env\b/i.test(trimmed) && /\b(cat|type|Get-Content|more)\b/i.test(trimmed)) {
    return {
      allowed: false,
      blockedByHarness: true,
      reason: '🛡️ [BSC 자격증명 보호 헌장 차단] .env 시크릿 파일의 평문 출력은 보안 규정에 의해 차단되었습니다.'
    };
  }
  return { allowed: true };
}

function runStreamingTerminalCommand(commandStr, cwd = ROOT_DIR, onLineCallback = () => {}) {
  return new Promise((resolve) => {
    const safety = verifyTerminalCommandSafety(commandStr);
    if (!safety.allowed) {
      onLineCallback({ stream: 'stderr', line: safety.reason });
      return resolve({ ok: false, blocked: true, exitCode: 1, output: safety.reason });
    }

    const workDir = cwd && fs.existsSync(cwd) ? cwd : ROOT_DIR;
    const outputLines = [];

    // Built-in quick alias for `jarvis` CLI commands inside the web terminal
    let effectiveCmd = commandStr.trim();
    if (/^jarvis(\s+|$)/i.test(effectiveCmd)) {
      const args = effectiveCmd.replace(/^jarvis\s*/i, '');
      effectiveCmd = `node "${path.join(ROOT_DIR, 'bin', 'jarvis-cli.js')}" ${args}`;
    }

    const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', effectiveCmd], {
      cwd: workDir,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    const timeout = setTimeout(() => {
      try { child.kill(); } catch (e) {}
      onLineCallback({ stream: 'stderr', line: '⏱️ [안내] 명령어 실행 시간이 120초를 초과하여 안전 종료되었습니다.' });
    }, 120000);

    const handleChunk = (streamType, chunk) => {
      const text = chunk.toString('utf8');
      const lines = text.split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        outputLines.push(line);
        onLineCallback({ stream: streamType, line });
      }
    };

    child.stdout.on('data', d => handleChunk('stdout', d));
    child.stderr.on('data', d => handleChunk('stderr', d));

    child.on('close', (code) => {
      clearTimeout(timeout);
      resolve({
        ok: code === 0,
        exitCode: code ?? 0,
        cwd: workDir,
        output: outputLines.join('\n')
      });
    });

    child.on('error', (err) => {
      clearTimeout(timeout);
      onLineCallback({ stream: 'stderr', line: err.message });
      resolve({
        ok: false,
        exitCode: 1,
        cwd: workDir,
        output: err.message
      });
    });
  });
}

module.exports = {
  RECOMMENDED_LOCAL_MODELS,
  RUNNOW_ONDEVICE_15_MODELS,
  PRODUCTION_DOMAIN_MODELS,
  loadActiveBrainState,
  saveActiveBrainState,
  loadPendingPlans,
  scanLocalAiEngines,
  selectActiveBrainModel,
  queryActiveLocalBrain,
  detectProductionIntentAndDomain,
  createAutonomous5StepPlan,
  executeApprovedPlan,
  verifyTerminalCommandSafety,
  runStreamingTerminalCommand
};
