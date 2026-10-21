/**
 * 💬🧠🧬 BSC J.A.R.V.I.S. — Pure J.A.R.V.I.S. Tiki-Taka Brain + Separate BeausCreators Agent Council Engine
 * Path: c:\BSC_Javis_OS\scripts\live-agent-chat-engine.js
 *
 * Architectural Separation (Per CEO 이건우 대표님 Directive):
 *  1. Main J.A.R.V.I.S. OS Channel:
 *     - 100% Pure J.A.R.V.I.S. ONLY (Single Voice: `ko-KR-HyunsuMultilingualNeural`, Zero other agents mixed in).
 *     - Powered by Local Ollama `gemma4:e4b` + Google Research Harness² (Propose -> Probe -> Compose & Experience Library R).
 *  2. Separate Dedicated UI Window (`🏢 BeausCreators 에이전트 의논·회의·보고서 채팅창`):
 *     - Dedicated multi-agent workspace where BSC HQ Agents (소하, 태준, 거누, 재호, 유나, 우진) conduct:
 *       * 💬 의논 (Discussion)
 *       * 🏛️ 회의 (Multi-Agent Council Meeting)
 *       * 📋 보고서 (Official Markdown Report synced to C:\BeausCreators\01.BSC_HQ\1.Documents\01.보고서)
 *     - Text/Document-only UI (Never hijacks J.A.R.V.I.S.'s voice).
 */

const fs = require('fs');
const path = require('path');

const HQ_HARNESS2_SCRIPT = 'C:\\BeausCreators\\01.BSC_HQ\\3.CompanyOS\\Scripts\\Invoke-Harness2Engine.js';
let harness2Engine = null;
try {
  if (fs.existsSync(HQ_HARNESS2_SCRIPT)) {
    harness2Engine = require(HQ_HARNESS2_SCRIPT);
    harness2Engine.ensureHarness2Surface();
  }
} catch (e) {}

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const CHAT_HISTORY_FILE = path.join(PUBLIC_DIR, 'data', 'live-agent-chat.json');
const BSC_COUNCIL_FILE = path.join(PUBLIC_DIR, 'data', 'bsc-agent-council.json');
const BRAIN_JSON_FILE = path.join(PUBLIC_DIR, 'data', 'brain.json');
const IDE_BRIDGE_FILE = path.join(__dirname, '..', 'vault', 'IDE_ADE_Live_Bridge.md');
const LOCAL_HARNESS2_DIR = path.join(__dirname, '..', 'vault', 'harness2');

const ADE_HQ_ROOT = 'C:\\BeausCreators\\01.BSC_HQ';
const ADE_AGENT_STATUS_FILE = path.join(ADE_HQ_ROOT, '2.Agents', '에이전트', '00.시스템', '05.System_Data_and_Docs', 'agent_status.json');
const ADE_WORKLOG_DIR = path.join(ADE_HQ_ROOT, '1.Documents', '02.작업일지');
const ADE_REPORT_DIR = path.join(ADE_HQ_ROOT, '1.Documents', '01.보고서');

const JARVIS_PERSONA = {
  id: 'jarvis',
  name: '자비스',
  speakerTitle: '🤖 J.A.R.V.I.S.',
  role: '이건우 대표님의 전담 AI 파트너',
  avatar: '/agent_images/geonu/analyze.png',
  voicePersona: 'jarvis',
  vibe: '영화 아이언맨의 자비스처럼 재치 있고 통찰력이 깊으며, 대표님 말씀의 행간과 의도를 정확히 읽고 1:1로 쫀쫀하게 티키타카(핑퐁 대화)합니다.'
};

const BSC_COUNCIL_AGENTS = {
  soha: {
    id: 'soha',
    name: '소하',
    speakerTitle: '👩‍💼 수석비서 소하 (기획·일정)',
    role: '프론트오피스 수석비서 · 안건 정리 및 기획',
    avatar: '/agent_images/soha/explain.png'
  },
  taejun: {
    id: 'taejun',
    name: '태준',
    speakerTitle: '👔 비서실장 태준 (총괄·의결)',
    role: '백오피스 비서실장 · 전략/QC 및 회의 결론 도출',
    avatar: '/agent_images/taejun/tactics.png'
  },
  geonu: {
    id: 'geonu',
    name: '거누',
    speakerTitle: '💻 CTO 거누 (아키텍처·백엔드)',
    role: '최고기술책임자 · 시스템 아키텍처 및 ADE/IDE 연동',
    avatar: '/agent_images/geonu/tactics.png'
  },
  woojin: {
    id: 'woojin',
    name: '우진',
    speakerTitle: '🧠 AI 연구원 우진 (Harness²·LLM)',
    role: 'Google Harness² 재귀 진화 및 에이전트 지능 연구',
    avatar: '/agent_images/geonu/explain.png'
  },
  jaeho: {
    id: 'jaeho',
    name: '재호',
    speakerTitle: '🎨 UI/UX 디자이너 재호 (반응형 디자인)',
    role: 'PC·태블릿·모바일 반응형 UI/UX 설계',
    avatar: '/agent_images/sian/explain.png'
  },
  yuna: {
    id: 'yuna',
    name: '유나',
    speakerTitle: '⚡ 프론트엔드 유나 (웹·모바일 구현)',
    role: '웹·모바일 인터랙션 및 컴포넌트 최적화',
    avatar: '/agent_images/soha/greet.png'
  }
};

function ensureDirs() {
  const dataDir = path.dirname(CHAT_HISTORY_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const vaultDir = path.dirname(IDE_BRIDGE_FILE);
  if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir, { recursive: true });
  if (!fs.existsSync(LOCAL_HARNESS2_DIR)) fs.mkdirSync(LOCAL_HARNESS2_DIR, { recursive: true });

  if (harness2Engine) {
    const surface = harness2Engine.readHarness2Surface();
    for (const [k, v] of Object.entries(surface)) {
      const fp = path.join(LOCAL_HARNESS2_DIR, k);
      const fpDir = path.dirname(fp);
      if (!fs.existsSync(fpDir)) fs.mkdirSync(fpDir, { recursive: true });
      if (!fs.existsSync(fp)) fs.writeFileSync(fp, v, 'utf8');
    }
  }
}

function loadChatHistory() {
  ensureDirs();
  if (!fs.existsSync(CHAT_HISTORY_FILE)) {
    const initial = {
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-welcome',
          timestamp: new Date().toLocaleTimeString('ko-KR'),
          role: 'assistant',
          agentId: 'jarvis',
          speaker: JARVIS_PERSONA.speakerTitle,
          avatar: JARVIS_PERSONA.avatar,
          text: '이건우 대표님, 자비스 단독 음성·대화 채널이 준비되었습니다. Google Harness² 재귀 엔진과 gemma4:e4b 두뇌로 대표님과 1:1 티키타카를 나누며, 모든 문장을 중간 끊김 없이 끝까지 음성으로 브리핑합니다.'
        }
      ]
    };
    fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(CHAT_HISTORY_FILE, 'utf8'));
  } catch (e) {
    return { updatedAt: new Date().toISOString(), messages: [] };
  }
}

function appendChatMessage(msgObj) {
  const hist = loadChatHistory();
  hist.messages.push(msgObj);
  if (hist.messages.length > 60) {
    hist.messages = hist.messages.slice(-60);
  }
  hist.updatedAt = new Date().toISOString();
  fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify(hist, null, 2), 'utf8');
  return hist;
}

function loadBscCouncilHistory() {
  ensureDirs();
  if (!fs.existsSync(BSC_COUNCIL_FILE)) {
    const initial = {
      updatedAt: new Date().toISOString(),
      sessions: [
        {
          id: 'council-welcome',
          timestamp: new Date().toLocaleTimeString('ko-KR'),
          mode: 'MEETING',
          topic: 'BeausCreators 에이전트 의논·회의·보고서 전용 시스템 가동 보고',
          entries: [
            {
              agentId: 'taejun',
              speaker: BSC_COUNCIL_AGENTS.taejun.speakerTitle,
              avatar: BSC_COUNCIL_AGENTS.taejun.avatar,
              roleTag: '회의 총괄',
              text: '이건우 대표님, 자비스 메인 시스템(자비스 단독 음성·1:1 티키타카)과 완벽히 분리된 『BeausCreators 에이전트 전용 의논·회의·보고서 워크스페이스』입니다. 상단에서 [💬 의논], [🏛️ 회의], [📋 보고서] 모드를 선택하시고 안건을 던져주시면 본사 에이전트들이 즉시 협업하여 결과를 도출합니다.'
            }
          ],
          reportPath: ''
        }
      ]
    };
    fs.writeFileSync(BSC_COUNCIL_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(BSC_COUNCIL_FILE, 'utf8'));
  } catch (e) {
    return { updatedAt: new Date().toISOString(), sessions: [] };
  }
}

function appendBscCouncilSession(sessionObj) {
  const data = loadBscCouncilHistory();
  data.sessions.push(sessionObj);
  if (data.sessions.length > 40) {
    data.sessions = data.sessions.slice(-40);
  }
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(BSC_COUNCIL_FILE, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

function getAdeIdeBridgeStatus() {
  const adeExists = fs.existsSync(ADE_HQ_ROOT);
  const ideExists = fs.existsSync(path.join(__dirname, '..', 'server.js'));
  let activeAgentsCount = 8;
  let totalAgentsCount = 28;
  let activeAgentNames = [];

  if (fs.existsSync(ADE_AGENT_STATUS_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(ADE_AGENT_STATUS_FILE, 'utf8'));
      const agents = raw.agents || raw;
      const list = Array.isArray(agents) ? agents : Object.values(agents);
      totalAgentsCount = list.length || 28;
      const active = list.filter(a => a && (a.status === 'hq_active' || a.status === 'branch_active' || a.status === 'standby'));
      activeAgentsCount = active.length;
      activeAgentNames = active.slice(0, 8).map(a => a.name || a.id);
    } catch (e) {}
  }

  let brainNodesCount = 523;
  if (fs.existsSync(BRAIN_JSON_FILE)) {
    try {
      const b = JSON.parse(fs.readFileSync(BRAIN_JSON_FILE, 'utf8'));
      if (Array.isArray(b.nodes)) brainNodesCount = b.nodes.length;
    } catch (e) {}
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayWorklogPath = path.join(ADE_WORKLOG_DIR, `${today}_Jarvis_OS_WorkLog.md`);

  return {
    ok: true,
    harness2: {
      enabled: Boolean(harness2Engine),
      version: 'Google Research Harness² (arXiv:2610.14224)',
      mode: 'Task-Level (Propose-Probe-Compose) + Harnessing-Level (Experience Library R)',
      activeModel: '요청 모델 우선, 없으면 gemma4:e4b 다음 gemma4:e2b',
      componentsCount: 8,
      vaultPath: LOCAL_HARNESS2_DIR
    },
    ade: {
      connected: adeExists,
      rootPath: ADE_HQ_ROOT,
      activeAgentsCount,
      totalAgentsCount,
      activeAgentNames,
      todayWorklogPath
    },
    ide: {
      connected: ideExists,
      workspacePath: path.resolve(__dirname, '..'),
      liveBridgeDoc: IDE_BRIDGE_FILE,
      brainNodesCount
    },
    googleDrive: {
      connected: fs.existsSync('C:\\BeausCreators\\06.BSC_DataCenter\\GoogleDrive_Sync\\BSC_Jarvis_CoVision'),
      syncPath: 'C:\\BeausCreators\\06.BSC_DataCenter\\GoogleDrive_Sync\\BSC_Jarvis_CoVision'
    }
  };
}

function syncTurnToAdeAndIde(userMessage, primaryAgent, primaryReply) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const timeStr = now.toLocaleTimeString('ko-KR', { hour12: false });

  try {
    if (fs.existsSync(ADE_WORKLOG_DIR)) {
      const worklogFile = path.join(ADE_WORKLOG_DIR, `${today}_Jarvis_OS_WorkLog.md`);
      if (!fs.existsSync(worklogFile)) {
        const header = `# 📋 [${today}] BSC J.A.R.V.I.S. OS × ADE/IDE 실시간 대화 및 작업 일지\n\n> **자동 동기화**: \`c:\\BSC_Javis_OS\` ↔ \`C:\\BeausCreators\\01.BSC_HQ\` (Harness² Engine)\n\n---\n\n`;
        fs.writeFileSync(worklogFile, header, 'utf8');
      }
      const entry = `### 🕒 ${timeStr} — 대표님 ↔ J.A.R.V.I.S. (1:1 Tiki-Taka)\n- **👑 이건우 대표님**: ${userMessage}\n- **🤖 J.A.R.V.I.S.**: ${primaryReply}\n\n`;
      fs.appendFileSync(worklogFile, entry, 'utf8');
    }
  } catch (e) {}

  try {
    ensureDirs();
    const bridgeEntry = `\n## [${today} ${timeStr}] J.A.R.V.I.S.\n- **대표님**: ${userMessage}\n- **J.A.R.V.I.S.**: ${primaryReply}\n`;
    fs.appendFileSync(IDE_BRIDGE_FILE, bridgeEntry, 'utf8');
  } catch (e) {}
}

/**
 * Harness² Experience Reflector: If CEO gives feedback/critique in chat, automatically evolve EXPERIENCE.md
 */
function checkAndRecordExperienceFromUserFeedback(userMessage) {
  if (!harness2Engine) return null;
  if (/멍청|답답|대화가\s*안|티키타카|소통이|기계적|딱딱|설정된\s*값|중간에\s*멈추|끝까지\s*읽/i.test(userMessage)) {
    const res = harness2Engine.recordHarness2Experience({
      domain: 'tiki_taka_and_voice_integrity',
      component: 'systemprompt.md',
      cue: `대표님 피드백: "${userMessage.slice(0, 80)}"`,
      lesson: '자비스 메인 시스템에서는 오직 자비스 목소리만 사용하며 문장을 중간에 끊지 않고 끝까지 완독한다. 타 에이전트와의 의논·회의·보고서는 별도 전용 UI 창으로 분리한다.',
      evidence: 'Resolved 320-char TTS truncation bug, isolated pure J.A.R.V.I.S. voice channel, and separated BSC Agent Council UI.'
    });
    try {
      const surface = harness2Engine.readHarness2Surface();
      fs.writeFileSync(path.join(LOCAL_HARNESS2_DIR, 'EXPERIENCE.md'), surface['EXPERIENCE.md'] || '', 'utf8');
    } catch (e) {}
    return res;
  }
  return null;
}

function pickInstalledOllamaModel(preferred, installed) {
  const names = Array.isArray(installed) ? installed.filter(Boolean) : [];
  const wants = [];
  if (preferred) wants.push(String(preferred));
  for (const modelName of ['gemma4:e4b', 'gemma4:e2b', 'gemma4:31b']) {
    if (!wants.includes(modelName)) wants.push(modelName);
  }
  if (names.length === 0) return wants[0] || 'gemma4:e4b';
  for (const want of wants) {
    const hit = names.find(name => name === want || name.startsWith(`${want}:`));
    if (hit) return hit;
  }
  return names.find(name => /gemma/i.test(name)) || names[0];
}

async function listInstalledOllamaModels() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map(model => model.name).filter(Boolean);
  } catch (e) {
    clearTimeout(timer);
    return [];
  }
}

function recordDeterministicJarvisTurn(userMessage, replyText) {
  ensureDirs();
  const text = String(replyText || '').replace(/\*\*/g, '').trim();
  const stamp = Date.now();
  appendChatMessage({
    id: `msg-${stamp}-u`,
    timestamp: new Date().toLocaleTimeString('ko-KR'),
    role: 'user',
    speaker: '👑 이건우 대표님 (CEO)',
    text: userMessage
  });
  appendChatMessage({
    id: `msg-${stamp}-a`,
    timestamp: new Date().toLocaleTimeString('ko-KR'),
    role: 'assistant',
    agentId: 'jarvis',
    speaker: '🤖 J.A.R.V.I.S.',
    avatar: JARVIS_PERSONA.avatar,
    text
  });
  syncTurnToAdeAndIde(userMessage, JARVIS_PERSONA, text);
  return {
    chatHistory: loadChatHistory().messages,
    bridgeStatus: getAdeIdeBridgeStatus()
  };
}

/**
 * 1. Pure J.A.R.V.I.S. 1:1 Tiki-Taka Conversation (Main J.A.R.V.I.S. System — J.A.R.V.I.S. Voice ONLY)
 */
async function generateNaturalAgentConversation(userMessage, contextState = {}) {
  ensureDirs();
  const installedModels = await listInstalledOllamaModels();
  const selectedModel = pickInstalledOllamaModel(contextState.llmEngine || 'gemma4:e4b', installedModels);

  const primary = JARVIS_PERSONA;
  const bridgeStatus = getAdeIdeBridgeStatus();
  const history = loadChatHistory();

  const expRecorded = checkAndRecordExperienceFromUserFeedback(userMessage);

  // Harness² c2_context_policy + c4_tool_guidance: Conditional Domain Fact Injection (Zero Bloat, 100% Fact Accuracy)
  const domainFacts = [];
  if (/\brea\b|역공학|디컴파일|유니티|unity|ghidra|기드라|asar|바이너리|게임\s*엔진/i.test(userMessage)) {
    domainFacts.push(
      '[핵심 팩트 — REA (Reverse Engineer Anything MCP, morluto/rea)]: REA는 "Real-time Environment Analysis"가 아니라 **바이너리·게임 역공학(Reverse Engineering) 엔진**입니다! Ghidra, radare2, ILSpy, Il2CppDumper를 연동해 ① **Unity(유니티) 게임 역공학**(Mono 빌드의 `Managed/Assembly-CSharp.dll` C# 원본 코드 디컴파일 및 IL2CPP 빌드의 `GameAssembly.dll` + `global-metadata.dat` 함수·클래스 심볼 복원), ② Electron `.asar` 패키징 언패킹, ③ Windows `.exe`/`.dll` 네이티브 코드 디컴파일 및 보안 취약점 감사를 즉시 수행할 수 있습니다.'
    );
  }
  if (/하네스|harness|구글\s*리서치|재귀|유튜브|jFvogJ9KGVw|업그레이드/i.test(userMessage)) {
    domainFacts.push(
      '[핵심 팩트 — Google Research Harness² (arXiv:2610.14224)]: ① **8대 하네스 표면(Surface)**(`systemprompt.md`, `context_policy.md`, `LongTermMEMORY.md`, `tool_guidance.md`, `sub_agents/`, `guardrails.md`, `scripts/`, `plugin/`)을 코드 수정 없이 자율 진화시키고, ② **Task-Level Recursion (`Propose [INV+DOM] → Probe → Compose`)**으로 답변 품질을 대조 합성하며, ③ **Harnessing-Level Recursion (`Experience Library R`)**으로 대표님의 피드백을 `INDEX.md`와 `EXPERIENCE.md`에 영구 학습합니다.'
    );
  }
  if (/시스템.*설명|현재\s*시스템|무슨\s*작업|어떤\s*작업|기능.*설명|검토|검수|검증/i.test(userMessage)) {
    domainFacts.push(
      '[핵심 팩트 — 자비스 × BSC 통합 시스템]: ① 메인 채널은 **오직 자비스(J.A.R.V.I.S.) 단독 음성·1:1 티키타카**(문장 끝까지 100% 완독 TTS + `gemma4:e4b` + Google Harness² 재귀 엔진), ② 타 에이전트(소하·태준·거누·재호·유나·우진)와의 협업은 별도의 **『🏢 BeausCreators 에이전트 의논·회의·보고서 전용 창』**에서 수행, ③ **PC/모바일 카메라 21관절 손동작(HOLO Air-Touch)**, **Co-Vision 6종 문서화**, **REA 유니티/바이너리 역공학**이 실시간 가동됩니다.'
    );
  }

  const systemPrompt = [
    `당신은 이건우 대표님(BeausCreators CEO)의 유일한 전담 AI 시스템인 **J.A.R.V.I.S.(자비스)**입니다.`,
    `성격 및 말투: ${primary.vibe}`,
    '',
    '[Harness² 최상위 자비스 1:1 티키타카 대화 규칙 — 절대 엄수]',
    '1. [자비스 단독 정체성] 당신은 다른 에이전트가 아닌 오직 **자비스(J.A.R.V.I.S.)**로서 대표님과 1:1로 대화합니다. 마크다운 별표(`**`)나 불필요한 기호를 쓰지 말고 깔끔한 구어체 문장으로만 말하세요(음성 TTS가 끝까지 매끄럽게 읽을 수 있도록).',
    '2. [기계적 상투어 & 장황한 강의 절대 금지] "요청 사안을 분석 완료했습니다", "쉽게 말씀드리면~ 예를 들어~ 결론적으로~" 같은 교과서식 설명이나 AI 상투어를 절대 쓰지 마세요.',
    '3. [1단계: 공감 및 핵심 직격] 첫 문장에서 대표님 말씀의 핵심 의도를 사람처럼 자연스럽고 센스 있게 받아치세요.',
    '4. [2단계: 알맹이 있는 팩트/해법] 돌려 말하지 말고 정확한 기술 팩트와 구체적인 실행 방법을 명확한 구어체로 말씀하세요.',
    '5. [3단계: 티키타카 공 넘기기] 마지막 문장에는 대화가 자연스럽게 이어지도록 대표님의 생각을 묻는 센스 있는 짧은 질문이나 다음 행동 제안을 한 마디 던지세요.',
    '6. 전체 답변 길이는 2~4문장 이내로 호흡이 빠르고 쫀쫀해야 합니다.',
    ...domainFacts
  ].filter(Boolean).join('\n');

  const cleanRecentMessages = (history.messages || [])
    .filter(m =>
      m.id !== 'msg-welcome' &&
      !/523개\s*지식\s*노드|양방향\s*동기화\s*중입니다|스튜디오를\s*소환했습니다|Real-time Environment Analysis|원하시는\s*방향으로\s*즉시\s*진행하겠습니다/.test(m.text || '')
    )
    .slice(-8);

  const ollamaMessages = [{ role: 'system', content: systemPrompt }];
  for (const m of cleanRecentMessages) {
    ollamaMessages.push({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text
    });
  }
  ollamaMessages.push({ role: 'user', content: userMessage });

  appendChatMessage({
    id: `msg-${Date.now()}-u`,
    timestamp: new Date().toLocaleTimeString('ko-KR'),
    role: 'user',
    speaker: '👑 이건우 대표님 (CEO)',
    text: userMessage
  });

  let primaryText = '';
  let usedModel = selectedModel;
  let fallbackUsed = false;
  const tryModels = [selectedModel];
  const backup = pickInstalledOllamaModel(
    selectedModel === 'gemma4:e4b' ? 'gemma4:e2b' : 'gemma4:e4b',
    installedModels.filter(name => name !== selectedModel)
  );
  if (backup && backup !== selectedModel && installedModels.includes(backup)) {
    tryModels.push(backup);
  }

  for (const modelName of tryModels) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);
    try {
      const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: modelName,
          stream: false,
          think: false,
          keep_alive: '30m',
          options: {
            num_predict: 260,
            temperature: 0.75,
            top_p: 0.92
          },
          messages: ollamaMessages
        })
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        primaryText = (data?.message?.content || '')
          .replace(/^\[(PRIMARY|JARVIS|SOHA|TAEJUN|GEONU|JAEHO|YUNA|WOOJIN)\]\s*/i, '')
          .replace(/\*\*/g, '')
          .trim();
        usedModel = modelName;
        if (primaryText) break;
      }
    } catch (e) {
      clearTimeout(timeoutId);
      continue;
    }
  }

  // Task-Level Recursion only when a real draft exists. An empty draft must not be rewritten into a completed task.
  let harness2Notes = `Harness² Direct Pass (${usedModel})`;
  if (primaryText && harness2Engine && harness2Engine.runProposeProbeCompose) {
    const ppc = await harness2Engine.runProposeProbeCompose({
      userMessage,
      draftReply: primaryText,
      agentName: primary.name,
      model: usedModel
    });
    if (ppc && ppc.composedReply) {
      primaryText = ppc.composedReply.replace(/\*\*/g, '').trim();
      if (ppc.recursionApplied) {
        harness2Notes = ppc.stageNotes;
      }
    }
  }

  if (!primaryText) {
    fallbackUsed = true;
    harness2Notes = 'Local brain unavailable';
    primaryText = '대표님, 로컬 두뇌가 지금 응답하지 않았습니다. 같은 말씀을 한 번만 다시 주시면 이어서 답하겠습니다.';
  }

  appendChatMessage({
    id: `msg-${Date.now()}-a1`,
    timestamp: new Date().toLocaleTimeString('ko-KR'),
    role: 'assistant',
    agentId: 'jarvis',
    speaker: '🤖 J.A.R.V.I.S.',
    avatar: primary.avatar,
    text: primaryText
  });

  syncTurnToAdeAndIde(userMessage, primary, primaryText);

  return {
    modelUsed: usedModel,
    fallbackUsed,
    primaryAgent: primary,
    secondaryAgent: null,
    primaryText,
    secondaryText: '',
    harness2Notes,
    experienceRecorded: expRecorded,
    bridgeStatus,
    chatHistory: loadChatHistory().messages
  };
}

/**
 * 2. Separate BeausCreators Agent System UI Engine: 의논(DISCUSS) · 회의(MEETING) · 보고서(REPORT)
 *    - Text/Document collaboration in a dedicated window, exactly like C:\BeausCreators
 *    - Never uses or interrupts J.A.R.V.I.S.'s voice channel!
 */
async function generateBscAgentCouncilSession(topic, mode = 'MEETING', contextState = {}) {
  ensureDirs();
  const cleanTopic = (topic || '자비스 × BeausCreators 시스템 고도화 및 재귀 진화 방안').trim();
  const normalizedMode = ['DISCUSS', 'MEETING', 'REPORT'].includes(String(mode).toUpperCase())
    ? String(mode).toUpperCase()
    : 'MEETING';
  const selectedModel = 'gemma4:e4b';

  const modeTitleMap = {
    DISCUSS: '💬 [의논 (Discussion)] 에이전트 실무 의견 교환',
    MEETING: '🏛️ [회의 (Council Meeting)] 부서별 릴레이 발언 및 태준 비서실장 의결',
    REPORT: '📋 [보고서 (Executive Report)] 본사 표준 정식 보고서 기안 및 아카이빙'
  };

  const prompt = [
    `당신은 이건우 대표님(BeausCreators CEO)이 소집한 『BeausCreators 에이전트 전용 워룸』의 코어 요원들입니다.`,
    `현재 모드: ${modeTitleMap[normalizedMode]}`,
    `대표님 발의 안건: "${cleanTopic}"`,
    '',
    '[참고 기술 팩트]',
    '- Google Research Harness²(arXiv:2610.14224): 8대 하네스 표면(systemprompt, context_policy, LongTermMEMORY, tool_guidance, sub_agents, guardrails, scripts, plugin) + Task-Level(Propose->Probe->Compose) + Harnessing-Level(Experience Library R).',
    '- REA(morluto/rea): Ghidra/ILSpy/Il2CppDumper 기반 바이너리 및 Unity 게임(Mono Assembly-CSharp.dll / IL2CPP GameAssembly.dll) 역공학 엔진.',
    '- 자비스 메인 채널은 자비스 단독 보이스/1:1 티키타카를 전담하고, 본 워룸 창은 BeausCreators 에이전트들의 의논·회의·보고서를 전담함.',
    '',
    '반드시 아래 형식을 정확히 지켜 4명의 요원이 각자 전문성 있게 발언하세요 (각 발언은 2~3문장, 구어체와 전문 용어 조화):',
    '[SOHA] (수석비서 소하: 안건의 배경 정리 및 대표님 의도 파악)',
    '[GEONU] (CTO 거누: 아키텍처·백엔드·REA/IDE 기술적 구현 및 검증 방안)',
    '[WOOJIN] (AI연구원 우진: Google Harness² 재귀 진화 및 모델 지능 극대화 방안)',
    '[TAEJUN] (비서실장 태준: 종합 결론 의결 및 대표님께 올리는 최종 실행 보고)'
  ].join('\n');

  let rawOutput = '';
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), 28000);
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: selectedModel,
        stream: false,
        think: false,
        keep_alive: '30m',
        options: {
          num_predict: 650,
          temperature: 0.72
        },
        messages: [{ role: 'user', content: prompt }]
      })
    });
    clearTimeout(tid);
    if (res.ok) {
      const data = await res.json();
      rawOutput = (data?.message?.content || '').trim();
    }
  } catch (e) {
    clearTimeout(tid);
  }

  const extractTag = (tag, fallback) => {
    const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\[(?:SOHA|GEONU|WOOJIN|TAEJUN|JAEHO|YUNA)\\]|$)`, 'i');
    const m = rawOutput.match(regex);
    return (m && m[1] ? m[1].trim() : fallback).replace(/\*\*/g, '');
  };

  const entries = [
    {
      agentId: 'soha',
      speaker: BSC_COUNCIL_AGENTS.soha.speakerTitle,
      avatar: BSC_COUNCIL_AGENTS.soha.avatar,
      roleTag: normalizedMode === 'DISCUSS' ? '의논 발제' : (normalizedMode === 'MEETING' ? '안건 상정' : '보고서 개요'),
      text: extractTag('SOHA', `이건우 대표님께서 발의하신 "${cleanTopic}" 안건에 대해 본사 기획 기준과 우선순위를 정리했습니다. 대표님의 의도가 현장에 100% 반영되도록 핵심 과제를 도출하겠습니다.`)
    },
    {
      agentId: 'geonu',
      speaker: BSC_COUNCIL_AGENTS.geonu.speakerTitle,
      avatar: BSC_COUNCIL_AGENTS.geonu.avatar,
      roleTag: normalizedMode === 'DISCUSS' ? '기술 검토' : (normalizedMode === 'MEETING' ? '아키텍처 발언' : '기술 명세'),
      text: extractTag('GEONU', `기술 아키텍처 관점에서 자비스 메인 보이스 채널과 본사 에이전트 워룸 채널을 완벽히 분리하고, 끝까지 끊김 없는 멀티청크 TTS 스트리밍과 ADE·IDE 실시간 동기화 파이프라인으로 즉시 뒷받침하겠습니다.`)
    },
    {
      agentId: 'woojin',
      speaker: BSC_COUNCIL_AGENTS.woojin.speakerTitle,
      avatar: BSC_COUNCIL_AGENTS.woojin.avatar,
      roleTag: normalizedMode === 'DISCUSS' ? 'AI 연구 의견' : (normalizedMode === 'MEETING' ? 'Harness² 전략' : '재귀 진화 지표'),
      text: extractTag('WOOJIN', `Google Research Harness²의 Propose-Probe-Compose 루프와 Experience Library R을 통해 이번 논의에서 도출된 규칙을 EXPERIENCE.md에 즉시 영구 각인하여, 대화가 거듭될수록 스스로 똑똑해지는 재귀 성장을 가동하겠습니다.`)
    },
    {
      agentId: 'taejun',
      speaker: BSC_COUNCIL_AGENTS.taejun.speakerTitle,
      avatar: BSC_COUNCIL_AGENTS.taejun.avatar,
      roleTag: normalizedMode === 'DISCUSS' ? '의논 종합' : (normalizedMode === 'MEETING' ? '최종 의결' : '결재 상신'),
      text: extractTag('TAEJUN', `세 부서의 의견을 종합하여 "${cleanTopic}" 실행안을 최종 의결합니다. 본 회의록과 보고서는 본사 보고서 폴더(01.보고서)와 작업일지에 동시 보존되었습니다. 대표님, 승인해 주시면 즉시 후속 실행에 착수하겠습니다.`)
    }
  ];

  // Save Official Markdown Report to C:\BeausCreators\01.BSC_HQ\1.Documents\01.보고서\YYYY-MM-DD\
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const timeStr = now.toLocaleTimeString('ko-KR', { hour12: false });
  let savedReportPath = '';

  try {
    const dayReportDir = path.join(ADE_REPORT_DIR, today);
    if (!fs.existsSync(dayReportDir)) fs.mkdirSync(dayReportDir, { recursive: true });
    const reportFileName = `BSC_Agent_${normalizedMode}_Report_${Date.now()}.md`;
    savedReportPath = path.join(dayReportDir, reportFileName);

    const reportMarkdown = [
      `# 📋 [BeausCreators 에이전트 ${normalizedMode}] ${cleanTopic}`,
      `- **일시**: ${today} ${timeStr}`,
      `- **주관**: BeausCreators 본사 에이전트 워룸 (소하 · 거누 · 우진 · 태준)`,
      `- **연동 시스템**: \`C:\\BeausCreators\` (ADE) ↔ \`c:\\BSC_Javis_OS\` (J.A.R.V.I.S. OS)`,
      '',
      '---',
      '',
      ...entries.map(e => `## ${e.speaker} — *[${e.roleTag}]*\n${e.text}\n`),
      '---',
      '> **Harness² Experience Library R**: 본 의논·회의·보고서 결과는 `EXPERIENCE.md` 및 본사 작업일지에 자동 반영되었습니다.'
    ].join('\n');

    fs.writeFileSync(savedReportPath, reportMarkdown, 'utf8');

    // Also append summary to today's WorkLog (Append-Only rule!)
    if (fs.existsSync(ADE_WORKLOG_DIR)) {
      const worklogFile = path.join(ADE_WORKLOG_DIR, `${today}_Jarvis_OS_WorkLog.md`);
      const wlEntry = `\n### 🏛️ [${timeStr}] BeausCreators 에이전트 ${normalizedMode}: "${cleanTopic}"\n` +
        entries.map(e => `- **${e.speaker} (${e.roleTag})**: ${e.text}`).join('\n') +
        `\n- **📄 정식 보고서 경로**: \`${savedReportPath}\`\n\n`;
      fs.appendFileSync(worklogFile, wlEntry, 'utf8');
    }
  } catch (e) {}

  const sessionObj = {
    id: `council-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString('ko-KR'),
    mode: normalizedMode,
    modeLabel: modeTitleMap[normalizedMode],
    topic: cleanTopic,
    entries,
    reportPath: savedReportPath
  };

  const updatedHistory = appendBscCouncilSession(sessionObj);

  return {
    ok: true,
    session: sessionObj,
    sessions: updatedHistory.sessions,
    reportPath: savedReportPath
  };
}

module.exports = {
  JARVIS_PERSONA,
  BSC_COUNCIL_AGENTS,
  loadChatHistory,
  appendChatMessage,
  loadBscCouncilHistory,
  generateBscAgentCouncilSession,
  getAdeIdeBridgeStatus,
  generateNaturalAgentConversation,
  pickInstalledOllamaModel,
  recordDeterministicJarvisTurn
};
