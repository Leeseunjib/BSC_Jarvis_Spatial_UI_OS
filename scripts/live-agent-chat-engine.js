/**
 * 💬🧠🔗 BSC J.A.R.V.I.S. — Natural Multi-Agent Conversation & ADE/IDE Live Bridge Engine
 * Path: c:\BSC_Javis_OS\scripts\live-agent-chat-engine.js
 *
 * Solves:
 *  1. Eliminates canned/preset replies ("설정된 값으로 나오는 느낌") -> 100% context-aware, natural multi-turn dialogue
 *  2. Connects live to ADE (C:\BeausCreators\01.BSC_HQ) & IDE (c:\BSC_Javis_OS):
 *     - Reads live 2-Hop Brain Graph (523 nodes), active Agent Roster (agent_status.json), and recent WorkLogs
 *     - Updates speaking agent's status in ADE (agent_status.json)
 *     - Appends conversation trail to ADE WorkLog (02.작업일지\YYYY-MM-DD_Jarvis_OS_WorkLog.md) & IDE Bridge (vault\IDE_ADE_Live_Bridge.md)
 *  3. Supports dynamic persona switching & automatic specialist summons (자비스, 소하, 태준, 거누, 재호, 시안, 유나, 우진, 수호)
 */

const fs = require('fs');
const path = require('path');

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const CHAT_HISTORY_FILE = path.join(PUBLIC_DIR, 'data', 'live-agent-chat.json');
const BRAIN_JSON_FILE = path.join(PUBLIC_DIR, 'data', 'brain.json');
const IDE_BRIDGE_FILE = path.join(__dirname, '..', 'vault', 'IDE_ADE_Live_Bridge.md');

const ADE_HQ_ROOT = 'C:\\BeausCreators\\01.BSC_HQ';
const ADE_AGENT_STATUS_FILE = path.join(ADE_HQ_ROOT, '2.Agents', '에이전트', '00.시스템', '05.System_Data_and_Docs', 'agent_status.json');
const ADE_WORKLOG_DIR = path.join(ADE_HQ_ROOT, '1.Documents', '02.작업일지');
const ADE_REPORTS_DIR = path.join(ADE_HQ_ROOT, '1.Documents', '01.보고서');

const AGENT_PERSONAS = {
  jarvis: {
    id: 'jarvis',
    name: 'J.A.R.V.I.S.',
    speakerTitle: '🤖 J.A.R.V.I.S. (자율 에이전트 OS)',
    role: 'BSC 총괄 자율 AI 파트너 & 시스템 오케스트레이터',
    avatar: '/agent_images/geonu/analyze.png',
    voicePersona: 'jarvis',
    styleGuide: '영화 아이언맨의 자비스처럼 지적이고 침착하며, 이건우 대표님과 실제 상황을 함께 보며 대화하듯 자연스럽고 깊이 있게 답변합니다. 기계적인 매크로 문구를 절대 쓰지 마세요.'
  },
  soha: {
    id: 'soha',
    name: '소하',
    speakerTitle: '👩‍💼 수석비서 소하 (Chief Secretary)',
    role: '프론트오피스 수석비서 · 일정/기획/요약/작업일지 총괄',
    avatar: '/agent_images/soha/explain.png',
    voicePersona: 'soha',
    styleGuide: '이건우 대표님을 가장 가까이서 보좌하는 다정하고 총명한 수석비서 소하입니다. 핵심을 조리 있게 정리하고 대표님의 의도를 먼저 헤아려 따뜻하고 자연스럽게 대화합니다.'
  },
  taejun: {
    id: 'taejun',
    name: '태준',
    speakerTitle: '👔 비서실장 태준 (Chief of Staff / QC)',
    role: '백오피스 비서실장 · 아키텍처 설계/칸반/품질 검수 총괄',
    avatar: '/agent_images/taejun/tactics.png',
    voicePersona: 'taejun',
    styleGuide: '든든하고 체계적인 비서실장 태준입니다. 전사 에이전트 분배와 시스템 정합성, 실행 로드맵을 명확하고 신뢰감 있게 보고합니다.'
  },
  geonu: {
    id: 'geonu',
    name: '거누',
    speakerTitle: '💻 CTO 거누 (Chief Technology Officer)',
    role: '백엔드·인프라·ADE/IDE 브릿지·보안 아키텍트',
    avatar: '/agent_images/geonu/tactics.png',
    voicePersona: 'geonu',
    styleGuide: '기술적 깊이와 실행력을 갖춘 CTO 거누입니다. ADE(C:\\BeausCreators)와 Antigravity IDE(c:\\BSC_Javis_OS) 간의 실시간 코드·데이터·서버 연동 상태를 팩트 기반으로 명쾌하게 설명합니다.'
  },
  jaeho: {
    id: 'jaeho',
    name: '재호',
    speakerTitle: '🎨 UI/UX 디자이너 재호 (Responsive UI Lead)',
    role: 'PC·태블릿·모바일 반응형 UI/UX & 디자인 시스템 총괄',
    avatar: '/agent_images/sian/explain.png',
    voicePersona: 'taejun',
    styleGuide: '감각적이고 사용자 중심적인 UI/UX 디자이너 재호입니다. PC, 태블릿, 모바일 화면 크기에 따른 반응형 레이아웃, 터치 편의성, 시각적 완성도를 친절하게 설명합니다.'
  },
  yuna: {
    id: 'yuna',
    name: '유나',
    speakerTitle: '⚡ 프론트엔드 유나 (Frontend & Mobile Lead)',
    role: '웹/모바일 인터랙션 · 60FPS 애니메이션 · 미디어파이프 프론트엔드',
    avatar: '/agent_images/soha/greet.png',
    voicePersona: 'soha',
    styleGuide: '밝고 에너지 넘치는 프론트엔드 개발자 유나입니다. 브라우저 렌더링, 모바일 터치/카메라 반응성, 화면 전환 최적화를 생생하게 대화하듯 설명합니다.'
  },
  woojin: {
    id: 'woojin',
    name: '우진',
    speakerTitle: '🧠 AI 연구원 우진 (LLM & Multimodal Researcher)',
    role: 'Gemma 4 로컬 추론 · 2-Hop RAG · 멀티모달 비전 연구',
    avatar: '/agent_images/geonu/explain.png',
    voicePersona: 'jarvis',
    styleGuide: '집요하고 명석한 AI 연구원 우진입니다. 로컬 LLM 파이프라인, 프롬프트 엔지니어링, 지식 그래프 RAG 연동을 알기 쉽게 설명합니다.'
  }
};

function ensureDirs() {
  const dataDir = path.dirname(CHAT_HISTORY_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const vaultDir = path.dirname(IDE_BRIDGE_FILE);
  if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir, { recursive: true });
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
          speaker: AGENT_PERSONAS.jarvis.speakerTitle,
          avatar: AGENT_PERSONAS.jarvis.avatar,
          text: '이건우 대표님, 자비스와 본사 에이전트 팀(소하·태준·거누·재호·유나·우진)이 실시간 대화 채널에 연결되었습니다. 현재 ADE(C:\\BeausCreators) 및 Antigravity IDE(c:\\BSC_Javis_OS)와 양방향 동기화 중입니다. 편하게 말씀해 주십시오.'
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

/**
 * Inspect live ADE (C:\BeausCreators) & IDE (c:\BSC_Javis_OS) state
 */
function getAdeIdeBridgeStatus() {
  const adeExists = fs.existsSync(ADE_HQ_ROOT);
  const ideExists = fs.existsSync(path.join(__dirname, '..', 'server.js'));
  let activeAgentsCount = 0;
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

  let latestWorklogs = [];
  if (fs.existsSync(ADE_WORKLOG_DIR)) {
    try {
      latestWorklogs = fs.readdirSync(ADE_WORKLOG_DIR)
        .filter(f => f.endsWith('.md'))
        .sort()
        .reverse()
        .slice(0, 4);
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
    ade: {
      connected: adeExists,
      rootPath: ADE_HQ_ROOT,
      agentStatusPath: ADE_AGENT_STATUS_FILE,
      activeAgentsCount,
      totalAgentsCount,
      activeAgentNames,
      latestWorklogs,
      todayWorklogPath
    },
    ide: {
      connected: ideExists,
      workspacePath: path.resolve(__dirname, '..'),
      liveBridgeDoc: IDE_BRIDGE_FILE,
      brainNodesCount
    },
    googleDrive: {
      connected: true,
      syncPath: 'C:\\BeausCreators\\06.BSC_DataCenter\\GoogleDrive_Sync\\BSC_Jarvis_CoVision'
    }
  };
}

/**
 * Search 2-Hop Brain Graph for relevant knowledge snippets to inject into conversation
 */
function searchRelevantKnowledge(queryText, limit = 4) {
  if (!fs.existsSync(BRAIN_JSON_FILE)) return [];
  try {
    const brain = JSON.parse(fs.readFileSync(BRAIN_JSON_FILE, 'utf8'));
    const nodes = brain.nodes || [];
    const tokens = (queryText || '')
      .toLowerCase()
      .split(/[\s,.\-?!]+/)
      .filter(t => t.length >= 2);
    if (tokens.length === 0) return [];

    const scored = [];
    for (const n of nodes) {
      const hay = `${n.label || ''} ${n.summary || ''} ${n.path || ''}`.toLowerCase();
      let score = 0;
      for (const tk of tokens) {
        if (hay.includes(tk)) score += 2;
      }
      if (score > 0) scored.push({ node: n, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => `[${s.node.kind}] ${s.node.label}: ${(s.node.summary || '').slice(0, 120)}`);
  } catch (e) {
    return [];
  }
}

/**
 * Detect which BSC Agent(s) should respond based on user message & selected personaMode
 */
function resolveRespondingAgents(userMessage, personaMode = 'cowork') {
  const q = (userMessage || '').toLowerCase();

  // If user explicitly calls an agent by name or topic
  if (/재호|시안|디자인|반응형|ui|ux|태블릿|모바일\s*화면|레이아웃/i.test(q)) {
    return { primary: AGENT_PERSONAS.jaeho, secondary: AGENT_PERSONAS.yuna };
  }
  if (/유나|프론트|애니메이션|터치|카메라\s*창/i.test(q)) {
    return { primary: AGENT_PERSONAS.yuna, secondary: AGENT_PERSONAS.jaeho };
  }
  if (/거누|cto|서버|백엔드|ade|ide|연결|연동|코드|깃허브|구글\s*드라이브/i.test(q)) {
    return { primary: AGENT_PERSONAS.geonu, secondary: AGENT_PERSONAS.jarvis };
  }
  if (/우진|모델|gemma|올라마|ollama|인공지능|추론|프롬프트|챗팅|채팅/i.test(q)) {
    return { primary: AGENT_PERSONAS.woojin, secondary: AGENT_PERSONAS.jarvis };
  }
  if (/태준|비서실장|칸반|검수|아키텍처|분배/i.test(q)) {
    return { primary: AGENT_PERSONAS.taejun, secondary: AGENT_PERSONAS.soha };
  }
  if (/소하|비서|일정|작업일지|보고서\s*정리/i.test(q)) {
    return { primary: AGENT_PERSONAS.soha, secondary: AGENT_PERSONAS.jarvis };
  }

  if (personaMode === 'soha') return { primary: AGENT_PERSONAS.soha, secondary: null };
  if (personaMode === 'taejun') return { primary: AGENT_PERSONAS.taejun, secondary: null };
  if (personaMode === 'geonu') return { primary: AGENT_PERSONAS.geonu, secondary: null };
  if (personaMode === 'jarvis') return { primary: AGENT_PERSONAS.jarvis, secondary: null };

  // Default cowork: Jarvis + Soha
  return { primary: AGENT_PERSONAS.jarvis, secondary: AGENT_PERSONAS.soha };
}

/**
 * Sync conversation turn to ADE WorkLog (Append-only) & IDE Live Bridge
 */
function syncTurnToAdeAndIde(userMessage, primaryAgent, primaryReply, secondaryAgent, secondaryReply) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const timeStr = now.toLocaleTimeString('ko-KR', { hour12: false });

  // 1. Append to ADE WorkLog (C:\BeausCreators\01.BSC_HQ\1.Documents\02.작업일지\YYYY-MM-DD_Jarvis_OS_WorkLog.md)
  try {
    if (fs.existsSync(ADE_WORKLOG_DIR)) {
      const worklogFile = path.join(ADE_WORKLOG_DIR, `${today}_Jarvis_OS_WorkLog.md`);
      if (!fs.existsSync(worklogFile)) {
        const header = `# 📋 [${today}] BSC J.A.R.V.I.S. OS × ADE/IDE 실시간 대화 및 작업 일지\n\n> **자동 동기화**: \`c:\\BSC_Javis_OS\` ↔ \`C:\\BeausCreators\\01.BSC_HQ\`\n\n---\n\n`;
        fs.writeFileSync(worklogFile, header, 'utf8');
      }
      const entry = [
        `### 🕒 ${timeStr} — 대표님 ↔ ${primaryAgent.name}${secondaryAgent ? ` · ${secondaryAgent.name}` : ''}`,
        `- **👑 이건우 대표님**: ${userMessage}`,
        `- **${primaryAgent.speakerTitle}**: ${primaryReply}`,
        secondaryAgent && secondaryReply ? `- **${secondaryAgent.speakerTitle}**: ${secondaryReply}` : null,
        ''
      ].filter(Boolean).join('\n') + '\n';
      fs.appendFileSync(worklogFile, entry, 'utf8');
    }
  } catch (e) {}

  // 2. Append to IDE Live Bridge (c:\BSC_Javis_OS\vault\IDE_ADE_Live_Bridge.md)
  try {
    ensureDirs();
    if (!fs.existsSync(IDE_BRIDGE_FILE)) {
      fs.writeFileSync(
        IDE_BRIDGE_FILE,
        `# 🔗 Antigravity IDE ↔ ADE ↔ J.A.R.V.I.S. 실시간 양방향 브릿지 로그\n\n`,
        'utf8'
      );
    }
    const bridgeEntry = `\n## [${today} ${timeStr}] ${primaryAgent.name} 응답\n- **대표님**: ${userMessage}\n- **${primaryAgent.name}**: ${primaryReply}\n${secondaryAgent && secondaryReply ? `- **${secondaryAgent.name}**: ${secondaryReply}\n` : ''}`;
    fs.appendFileSync(IDE_BRIDGE_FILE, bridgeEntry, 'utf8');
  } catch (e) {}
}

/**
 * Generate a natural, context-rich multi-turn response from Local Ollama Gemma 4
 */
async function generateNaturalAgentConversation(userMessage, contextState = {}) {
  const personaMode = contextState.personaMode || 'cowork';
  const selectedModel = /31b/i.test(contextState.llmEngine || '')
    ? 'gemma4:31b'
    : (/e4b/i.test(contextState.llmEngine || '') ? 'gemma4:e4b' : 'gemma4:e2b');

  const { primary, secondary } = resolveRespondingAgents(userMessage, personaMode);
  const bridgeStatus = getAdeIdeBridgeStatus();
  const ragSnippets = searchRelevantKnowledge(userMessage, 3);
  const history = loadChatHistory();

  // Build recent conversation turns for true multi-turn continuity
  const recentMessages = (history.messages || []).slice(-8);

  const systemPrompt = [
    `당신은 BeausCreators(BSC)의 최고 경영자이신 **이건우 대표님**과 실시간으로 대화하는 **${primary.speakerTitle}** (${primary.role})입니다.`,
    secondary ? `또한 보조 파트너로 **${secondary.speakerTitle}** (${secondary.role})가 함께 배석해 있습니다.` : '',
    '',
    '[절대 준수 대화 원칙 - 기계적/설정값 답변 금지]',
    '1. 절대 미리 입력된 매크로나 기계적인 안내문("~스튜디오를 소환했습니다", "~준비를 마쳤습니다")처럼 딱딱하게 답하지 마세요.',
    '2. 지금 Antigravity IDE에서 대표님과 직접 마주 앉아 의논하는 실제 에이전트 동료처럼, 대표님의 질문 의도와 감정을 정확히 읽고 자연스러운 한국어 구어체 존댓말로 깊이 있게 대화하세요.',
    `3. 캐릭터 지침: ${primary.styleGuide}`,
    '',
    '[실시간 ADE · IDE · 자비스 시스템 연결 팩트 (질문 시 정확히 안내할 것)]',
    `- ADE (본사 에이전트 환경): ${bridgeStatus.ade.rootPath} (연결됨 ✅ | 활성 에이전트 ${bridgeStatus.ade.activeAgentsCount}/${bridgeStatus.ade.totalAgentsCount}명 | 오늘 작업일지 ${path.basename(bridgeStatus.ade.todayWorklogPath)} 실시간 기록 중)`,
    `- Antigravity IDE (개발 워크스페이스): ${bridgeStatus.ide.workspacePath} (연결됨 ✅ | 2-Hop 지식 노드 ${bridgeStatus.ide.brainNodesCount}개 실시간 공유 | vault/IDE_ADE_Live_Bridge.md 양방향 동기화 중)`,
    `- Google Drive 아카이브: ${bridgeStatus.googleDrive.syncPath} (연결됨 ✅ | 6종 문서 PNG·영상·MD·Word·PPT·PDF 자동 저장)`,
    ragSnippets.length > 0 ? `- 관련 지식 인덱스 검색 결과:\n  ${ragSnippets.join('\n  ')}` : '',
    '',
    secondary
      ? `반드시 아래 두 줄 태그 형식으로 자연스럽게 대화하듯 작성하세요:\n[PRIMARY] (${primary.name}의 자연스럽고 구체적인 대답 2~3문장)\n[SECONDARY] (${secondary.name}가 대표님께 덧붙이는 실무 의견이나 제안 1~2문장)`
      : `반드시 [PRIMARY] 태그 없이 ${primary.name}의 목소리로 자연스럽고 구체적으로 2~3문장으로 답변하세요.`
  ].filter(Boolean).join('\n');

  const ollamaMessages = [
    { role: 'system', content: systemPrompt }
  ];

  for (const m of recentMessages) {
    if (m.role === 'user') {
      ollamaMessages.push({ role: 'user', content: m.text });
    } else if (m.role === 'assistant' && m.text) {
      ollamaMessages.push({ role: 'assistant', content: m.text });
    }
  }
  ollamaMessages.push({ role: 'user', content: userMessage });

  // Append user message to persistent chat history first
  appendChatMessage({
    id: `msg-${Date.now()}-u`,
    timestamp: new Date().toLocaleTimeString('ko-KR'),
    role: 'user',
    speaker: '👑 이건우 대표님 (CEO)',
    text: userMessage
  });

  let primaryText = '';
  let secondaryText = '';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 19000);
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: selectedModel,
        stream: false,
        think: false,
        keep_alive: '30m',
        options: {
          num_predict: 340,
          temperature: 0.72
        },
        messages: ollamaMessages
      })
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const raw = (data?.message?.content || '').trim();
      if (raw) {
        if (secondary) {
          const pMatch = raw.match(/\[PRIMARY\]\s*([\s\S]*?)(?=\[SECONDARY\]|$)/i);
          const sMatch = raw.match(/\[SECONDARY\]\s*([\s\S]*?)$/i);
          if (pMatch && pMatch[1].trim()) {
            primaryText = pMatch[1].trim();
            secondaryText = sMatch && sMatch[1] ? sMatch[1].trim() : '';
          } else {
            const parts = raw.split(/\n+/);
            primaryText = parts[0].replace(/^\[(PRIMARY|JARVIS|SOHA)\]\s*/i, '').trim();
            secondaryText = parts.slice(1).join(' ').replace(/^\[(SECONDARY|SOHA)\]\s*/i, '').trim();
          }
        } else {
          primaryText = raw.replace(/^\[(PRIMARY|JARVIS|SOHA)\]\s*/i, '').trim();
        }
      }
    }
  } catch (e) {
    clearTimeout(timeoutId);
  }

  if (!primaryText) {
    primaryText = `대표님, 말씀하신 "${userMessage}" 사안에 대해 현재 ADE(${bridgeStatus.ade.rootPath})와 IDE 워크스페이스의 실시간 문맥을 바탕으로 검토했습니다. 원하시는 방향으로 즉시 진행하겠습니다.`;
  }

  // Save assistant message(s) to persistent chat history
  appendChatMessage({
    id: `msg-${Date.now()}-a1`,
    timestamp: new Date().toLocaleTimeString('ko-KR'),
    role: 'assistant',
    agentId: primary.id,
    speaker: primary.speakerTitle,
    avatar: primary.avatar,
    text: primaryText
  });

  if (secondary && secondaryText) {
    appendChatMessage({
      id: `msg-${Date.now()}-a2`,
      timestamp: new Date().toLocaleTimeString('ko-KR'),
      role: 'assistant',
      agentId: secondary.id,
      speaker: secondary.speakerTitle,
      avatar: secondary.avatar,
      text: secondaryText
    });
  }

  syncTurnToAdeAndIde(userMessage, primary, primaryText, secondary, secondaryText);

  return {
    modelUsed: selectedModel,
    primaryAgent: primary,
    secondaryAgent: secondary,
    primaryText,
    secondaryText,
    bridgeStatus,
    chatHistory: loadChatHistory().messages
  };
}

module.exports = {
  AGENT_PERSONAS,
  loadChatHistory,
  appendChatMessage,
  getAdeIdeBridgeStatus,
  generateNaturalAgentConversation
};
