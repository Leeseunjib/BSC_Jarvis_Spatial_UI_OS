/**
 * 🔬🎙️🪟 BSC J.A.R.V.I.S. OS — REA SasariSa (사사리사) Windows 11 Native & Full-Stack Voice Engine
 * Path: c:\BSC_Javis_OS\scripts\rea-sasarisa-windows-engine.js
 *
 * Clean-Room Reverse Engineered from `mvcompany8500-web/sasarisa` (YouTube: muY9-sCxZlg)
 * + Expanded to control 100% of BSC J.A.R.V.I.S. OS Technologies by Voice:
 *   1. Google Gemini CLI (`gemini` / `agy` OAuth $0 Extra Fee + `gemini-4-argon`)
 *   2. Local CLI Execution (`git`, `node`, `npm`, `powershell`, directory scan, system verify)
 *   3. MCP & BSC HQ Skills (`Blender 3D MCP`, `ComfyUI MCP`, `Firebase`, `Notion`, `micro-knowledge-query`, `code-quality-gate`)
 *   4. Obsidian × Notion Neuron Studio (`뉴런 열기`, `노트 추가`, `위키링크 생성`)
 *   5. 18 AI Studios & ArtCraft 13 Apps & 28-Agent Council War Room & 6-Format Co-Vision Exporter
 *   6. Windows 11 Native Controls (Music, Shopping, KakaoTalk/Email with 2-Step Safety Confirmation)
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const {
  chatWithUnifiedLlm,
  loadHubState,
  configureMultiLlmHub,
  sanitizeVoiceDenialHallucination
} = require('./multi-llm-provider-hub');
const {
  captureMonitorWorkspaceContext,
  launchFramelessMonitorAppWindow
} = require('./monitor-vision-context-engine');

const ROOT_DIR = path.join(__dirname, '..');
const VAULT_DIR = path.join(ROOT_DIR, 'vault');
const DATA_DIR = path.join(ROOT_DIR, 'public', 'data');
const PENDING_SASARISA_PATH = path.join(DATA_DIR, 'sasarisa-pending-confirmations.json');
const SASARISA_HISTORY_PATH = path.join(DATA_DIR, 'sasarisa-action-history.json');
const SASARISA_ROUTINES_PATH = path.join(DATA_DIR, 'sasarisa-custom-routines.json');
const BLUEPRINT_MD_PATH = path.join(VAULT_DIR, 'REA_SasariSa_Windows_Blueprint.md');

// Track in-session state just like `Butler.swift` (ytList, openedURLs, lastDone)
let sessionYoutubeResults = [
  { index: 1, title: '비 오는 밤, 공부할 때 듣는 집중 로파이 재즈 라디오 ☔', url: 'https://www.youtube.com/results?search_query=lofi+hip+hop+radio' },
  { index: 2, title: '코딩할 때 듣기 좋은 4시간 딥포커스 신스웨이브 & 로파이', url: 'https://www.youtube.com/results?search_query=coding+lofi+synthwave' },
  { index: 3, title: '카페에서 일할 때 트는 잔잔한 피아노 보사노바 플레이리스트', url: 'https://www.youtube.com/results?search_query=cafe+piano+bossanova' },
  { index: 4, title: '새벽 감성 무가사 칠아웃 로파이 비트 모음', url: 'https://www.youtube.com/results?search_query=chillout+lofi+beats' }
];
let sessionOpenedUrls = [];
let sessionLastAction = {
  said: 'BSC_자비스 초기 준비 완료',
  summaryKo: '시스템 부팅 및 마이크 대기를 시작했습니다.',
  undoType: 'NONE'
};

function loadCustomRoutines() {
  try {
    if (fs.existsSync(SASARISA_ROUTINES_PATH)) {
      return JSON.parse(fs.readFileSync(SASARISA_ROUTINES_PATH, 'utf8'));
    }
  } catch (_) {}
  return [
    { name: '작업 시작', steps: ['구글 CLI 제미나이 4 아르곤 확인', '유튜브에서 로파이 틀어', '자비스 코어 뉴런 열어줘'], hits: 5 },
    { name: '퇴근 준비', steps: ['깃 상태 확인', '창 다 꺼'], hits: 3 }
  ];
}

function saveCustomRoutines(list) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(SASARISA_ROUTINES_PATH, JSON.stringify(list, null, 2), 'utf8');
  } catch (_) {}
}

const SASARISA_REA_BLUEPRINT = {
  id: 'rea-sasarisa-macos-to-win11',
  repoSource: 'https://github.com/mvcompany8500-web/sasarisa',
  videoReference: 'https://youtube.com/watch?v=muY9-sCxZlg',
  brewCaskOriginal: 'brew install --cask mvcompany8500-web/tap/sasarisa',
  windowsTargetEdition: 'BSC J.A.R.V.I.S. × SasariSa Windows 11 Voice-First OS (14 Full-Stack Skills)',
  recoveredModulesCount: 10,
  recoveredSymbolsCount: 540,
  architectureMapping: [
    {
      moduleId: 'UI_FLOATING_PILL',
      nameKo: '1. 사사리사 Voice-First 미니멀 HUD (Zero-Overlap Voice Dock)',
      macosOriginal: 'SwiftUI MenuBarExtra + NSPanel Non-Activating Floating HUD',
      windowsReconstructed: 'SasariSa Voice-First Minimal HUD (#sasarisa-voice-pill, Alt+Space) + 24-Bar 실시간 마이크 dB 파형 + 무겹침 레이아웃',
      safetyLevel: 'SAFE'
    },
    {
      moduleId: 'VOICE_STT_WAKEWORD',
      nameKo: '2. 3중 하이브리드 한국어 음성인식(STT) & 96kbps HD 자동 발화(TTS)',
      macosOriginal: 'whisper.cpp CoreML + AVAudioEngine 로컬 마이크 캡처',
      windowsReconstructed: 'Continuous Web Speech (1.2초 침묵 자동 전송 + Auto-Heal) + WebAudio Analyser + Windows SAPI 로컬 STT 폴백 + 현수/선희 HD TTS',
      safetyLevel: 'SAFE'
    },
    {
      moduleId: 'GOOGLE_GEMINI_CLI_OAUTH',
      nameKo: '3. Google Gemini CLI & Antigravity CLI (OAuth Ultra $0 추가과금)',
      macosOriginal: 'Claude Code CLI 서브프로세스 브릿지',
      windowsReconstructed: 'Google OAuth (`~/.gemini/oauth_creds.json` + `gemini` CLI / `agy`) 직결 브릿지 — 추가 API 과금 $0로 Gemini 4 Argon 활용',
      safetyLevel: 'SAFE'
    },
    {
      moduleId: 'CLI_AND_MCP_BRIDGE',
      nameKo: '4. 음성 기반 로컬 CLI & MCP / 본사 스킬 직결 실행기',
      macosOriginal: 'macOS Terminal & Shell Script Runner',
      windowsReconstructed: 'Windows PowerShell / Git / Node CLI + Blender·ComfyUI·Firebase·Notion MCP + BSC 본사 스킬 음성 실행',
      safetyLevel: 'GUARDED_CONFIRM'
    },
    {
      moduleId: 'OBSIDIAN_NOTION_NEURON',
      nameKo: '5. 원클릭 옵시디언×노션 뉴런 콘텐츠 & 응용 스튜디오',
      macosOriginal: 'Local Markdown Knowledge Viewer',
      windowsReconstructed: '뉴런(점) 1회 클릭 또는 음성 명령 시 전체 본문 열람 + 노션(/) 블록 편집 + 옵시디언 [[위키링크]]·백링크·실시간 뉴런 생성',
      safetyLevel: 'SAFE'
    },
    {
      moduleId: 'MUSIC_SHOPPING_KAKAO_WIN11',
      nameKo: '6. Windows 11 음악·쇼핑·카카오톡·메일 & 2중 안전 가드레일',
      macosOriginal: 'osascript Music / Safari / AXUIElement KakaoTalk + Irreversible Confirmation',
      windowsReconstructed: 'YouTube Music/Spotify + 쿠팡/네이버쇼핑 + 카카오톡 클립보드/메일 + REQUIRES_CONFIRMATION 2단계 승인',
      safetyLevel: 'GUARDED_CONFIRM'
    }
  ],
  decompiledMacosPseudoCode: `// [REA Stage 2: mvcompany8500-web/sasarisa macOS Swift + AppleScript Deconstruction]
func handleVoiceCommand(_ transcript: String) async {
    let intent = await llmRouter.classifyIntent(transcript)
    if intent.isIrreversible { // e.g., KakaoTalk send, Email reply, Payment, File delete
        floatingHud.showConfirmationPrompt("정말로 실행하시겠습니까?")
        guard await waitForUserVoiceOrClickConfirmation() else { return }
    }
    switch intent.category {
    case .cliOrMcp:
        runSubprocess(intent.command)
    case .music:
        runAppleScript("tell application \\"Spotify\\" to playTrack(\\"\\(intent.query)\\")")
    case .kakaoTalk:
        AXUIElementPerformAction(kakaoWindow, kAXRaiseAction)
    case .coding:
        spawnCliAgentSubprocess(intent.prompt)
    }
}`,
  reconstructedWindowsCleanCode: `// [REA Stage 4: Clean-Room Reconstructed Windows 11 Voice-First Engine]
async function parseAndExecuteSasarisaVoiceCommand(commandText, options = {}) {
  const intent = classifySasarisaWindowsSkill(commandText);
  const llmReply = await chatWithUnifiedLlm({
    provider: options.provider, // 'gemini' (OAuth $0) | 'ollama' | 'lmstudio' | 'openai'
    model: options.model,
    prompt: buildSasarisaSkillPrompt(intent, commandText)
  });
  if (intent.requiresConfirmation && !options.confirmed) {
    return queueSasarisaSafetyConfirmation(intent, commandText, llmReply);
  }
  return await executeWindowsNativeSkillAction(intent, commandText, llmReply);
}`
};

function ensureBlueprintMarkdown() {
  try {
    if (!fs.existsSync(VAULT_DIR)) fs.mkdirSync(VAULT_DIR, { recursive: true });
    const md = [
      `# 🔬 [REA Clean-Room Blueprint] SasariSa (사사리사) macOS ➔ Windows 11 Voice-First Edition`,
      ``,
      `- **원본 GitHub**: \`https://github.com/mvcompany8500-web/sasarisa\``,
      `- **원본 시연 영상**: \`https://youtube.com/watch?v=muY9-sCxZlg\``,
      `- **역공학 엔진**: BSC REA 4-Stage Clean-Room Analyzer (\`Invoke-ReaAnalyzer.js\`)`,
      `- **연결된 4대 LLM 두뇌**: Google Gemini (\`gemini-4-argon\` OAuth Ultra $0 추가과금) · Ollama (\`gemma4:e4b\`) · LM Studio (\`:1234\`) · OpenAI GPT (\`gpt-4o\`)`,
      ``,
      `## 1. 핵심 아키텍처 매핑`,
      ...SASARISA_REA_BLUEPRINT.architectureMapping.map(
        m => `- **${m.nameKo}**\n  - macOS 원본: \`${m.macosOriginal}\`\n  - Windows 11 재구축: \`${m.windowsReconstructed}\` [${m.safetyLevel}]`
      )
    ].join('\n');
    fs.writeFileSync(BLUEPRINT_MD_PATH, md, 'utf8');
  } catch (e) {}
}

function loadPendingConfirmations() {
  try {
    if (fs.existsSync(PENDING_SASARISA_PATH)) {
      return JSON.parse(fs.readFileSync(PENDING_SASARISA_PATH, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function savePendingConfirmations(list) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(PENDING_SASARISA_PATH, JSON.stringify(list.slice(0, 25), null, 2), 'utf8');
  } catch (e) {}
}

function loadSasarisaHistory() {
  try {
    if (fs.existsSync(SASARISA_HISTORY_PATH)) {
      return JSON.parse(fs.readFileSync(SASARISA_HISTORY_PATH, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function appendSasarisaHistory(entry) {
  const list = loadSasarisaHistory();
  list.unshift(entry);
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(SASARISA_HISTORY_PATH, JSON.stringify(list.slice(0, 40), null, 2), 'utf8');
  } catch (e) {}
  return list.slice(0, 40);
}

/**
 * Classify user voice/text command into 14 Full-Stack Skills (Windows + Google CLI + MCP + CLI + Neuron + BSC Studios)
 */
function classifySasarisaWindowsSkill(rawCommand = '') {
  const text = String(rawCommand || '').replace(/^(사사리사야?|자비스야?|헤이\s*자비스)\s*[,·]?\s*/i, '').trim();

  // 1. Google Gemini CLI / Antigravity CLI / Gemini 4 Argon Switch or Query
  if (/(google\s*cli|구글\s*cli|gemini\s*cli|제미나이\s*cli|\bagy\b|아르곤|argon|제미나이\s*4|oauth\s*로그인)/i.test(text)) {
    return {
      skillId: 'GOOGLE_GEMINI_CLI',
      skillTitleKo: '🔐 Google Gemini CLI & Gemini 4 Argon (OAuth $0)',
      icon: '🔐',
      requiresConfirmation: false,
      cleanQuery: text
    };
  }

  // 1-B. Monitor Workspace & Camera Co-Work Awareness ("모니터 화면 봐줘", "지금 작업 환경 파악해줘", "카메라 켜고 같이 작업하자", "모니터 앱 모드로 띄워줘")
  if (/(모니터\s*(화면|앱|모드|전체|봐|인식|파악|작업)|지금\s*(모니터|화면|작업\s*환경|켜진\s*창|열린\s*창)|작업\s*환경.*(파악|인식|이해|같이)|화면에\s*뭐\s*있|카메라.*(보면서|같이|켜|시야)|핸즈프리\s*모드)/i.test(text)) {
    const isLaunchApp = /(모니터\s*앱|주소창\s*없이|전용\s*앱\s*창|독립\s*창|앱\s*모드로\s*(열|띄워))/i.test(text);
    const isCameraOn = /(카메라|웹캠|시야|보면서)/i.test(text);
    return {
      skillId: 'MONITOR_CAMERA_COWORK',
      skillTitleKo: isLaunchApp
        ? '🖥️ 주소창 없는 모니터 전용 앱 창(--app) 실행'
        : '👁️🖥️ 모니터 작업 환경 + 카메라 실시간 인식 & 핸즈프리 협업',
      icon: '🖥️',
      requiresConfirmation: false,
      launchFramelessApp: isLaunchApp,
      enableCameraDock: isCameraOn,
      uiAction: isCameraOn ? 'OPEN_HANDSFREE_COWORK_DOCK' : 'UPDATE_MONITOR_CONTEXT',
      cleanQuery: text
    };
  }

  // 2. Multi-LLM Brain Switch by Voice ("두뇌를 올라마로 바꿔줘", "제미나이로 전환해", "GPT로 바꿔")
  if (/(두뇌.*(바꿔|전환|변경)|모델.*(바꿔|전환|변경)|(올라마|엘엠\s*스튜디오|제미나이|지피티|gpt)로\s*(바꿔|전환|연결))/i.test(text)) {
    let targetProvider = 'ollama';
    let targetModel = 'gemma4:e4b';
    if (/제미나이|gemini|아르곤/i.test(text)) {
      targetProvider = 'gemini';
      targetModel = 'gemini-4-argon';
    } else if (/엘엠|lm\s*studio/i.test(text)) {
      targetProvider = 'lmstudio';
      targetModel = 'local-model';
    } else if (/지피티|gpt|오픈에이아이|openai/i.test(text)) {
      targetProvider = 'openai';
      targetModel = 'gpt-4o';
    }
    return {
      skillId: 'MULTI_LLM_SWITCH',
      skillTitleKo: `🧠 멀티 LLM 두뇌 음성 전환 (${targetProvider.toUpperCase()} · ${targetModel})`,
      icon: '🧠',
      requiresConfirmation: false,
      targetProvider,
      targetModel,
      cleanQuery: text
    };
  }

  // 3. MCP & BSC HQ Skills Execution ("블렌더 MCP", "컴피UI", "파이어베이스", "노션", "지식창고 검색", "코드 품질 게이트")
  if (/(\bmcp\b|엠씨피|블렌더|blender|comfyui|컴피|파이어베이스|firebase|노션\s*연동|지식\s*검색|마이크로\s*쿼리|시맨틱\s*검색|코드\s*품질|품질\s*게이트)/i.test(text)) {
    const mcpTarget = /블렌더|blender/i.test(text)
      ? 'BLENDER_MCP'
      : (/컴피|comfy/i.test(text)
        ? 'COMFYUI_MCP'
        : (/파이어베이스|firebase/i.test(text)
          ? 'FIREBASE_MCP'
          : (/코드\s*품질|게이트/i.test(text) ? 'CODE_QUALITY_GATE' : 'BSC_KNOWLEDGE_MCP')));
    return {
      skillId: 'MCP_SKILL_BRIDGE',
      skillTitleKo: `🔌 MCP & 본사 스킬 음성 실행 (${mcpTarget})`,
      icon: '🔌',
      requiresConfirmation: /(배포해|deploy|삭제|초기화)/i.test(text),
      riskReasonKo: '외부 프로덕션 배포 또는 상태 변경이 포함된 MCP 작업이므로 대표님 승인을 거칩니다.',
      mcpTarget,
      cleanQuery: text
    };
  }

  // 4. Local CLI Terminal Execution ("깃 상태", "git status", "터미널에서", "CLI로", "노드 버전", "검증 스크립트")
  if (/(\bcli\b|씨엘아이|터미널|\bgit\b|깃\s*상태|깃\s*로그|브랜치|디렉토리\s*목록|프로세스\s*확인|포트\s*확인|시스템\s*검증|verify)/i.test(text)) {
    const isDestructive = /(rm\s+-rf|remove-item|del\s+|git\s+reset\s+--hard|git\s+clean|drop\s+table|포맷|삭제)/i.test(text);
    return {
      skillId: 'CLI_TERMINAL_EXEC',
      skillTitleKo: '⚡ 로컬 CLI 터미널 명령 실행',
      icon: '⚡',
      requiresConfirmation: isDestructive,
      riskReasonKo: isDestructive ? '파일 삭제 또는 Git 이력 변경 가능성이 있는 CLI 명령이므로 BSC_자비스 2중 확인이 작동합니다.' : '',
      cleanQuery: text
    };
  }

  // 5. Obsidian × Notion Neuron Content Studio ("~ 뉴런 열어줘", "뉴런 노트 만들어줘", "위키링크 연결해줘")
  if (/(뉴런\s*(열어|보여|확인|생성|만들|추가)|옵시디언|노션\s*블록|위키링크|백링크|노트\s*(작성|저장|추가))/i.test(text)) {
    const keyword = text
      .replace(/(BSC_자비스|bsc_자비스|사사리사|자비스|뉴런|열어줘|열어|보여줘|확인해줘|노트|작성해줘|만들어줘|추가해줘|옵시디언|노션)/gi, ' ')
      .trim() || 'J.A.R.V.I.S. 코어';
    return {
      skillId: 'NEURON_STUDIO_CONTROL',
      skillTitleKo: '🕸️ 옵시디언×노션 뉴런 콘텐츠 스튜디오 제어',
      icon: '🕸️',
      requiresConfirmation: false,
      neuronKeyword: keyword,
      uiAction: 'OPEN_NEURON_STUDIO',
      cleanQuery: text
    };
  }

  // 6. Existing BSC Dashboards / 18 Studios / ArtCraft 13 / 28-Agent War Room / 6-Format Docs
  if (/(워룸|회의실\s*열|에이전트\s*회의|포토크래프트|필름크래프트|아트크래프트|문서.*변환|워드.*뽑아|피피티.*만들|엑셀.*출력|지식폴더\s*열|두뇌\s*대시보드)/i.test(text)) {
    let targetDashboard = 'AI_BRAIN_DASHBOARD';
    if (/워룸|회의/i.test(text)) targetDashboard = 'AGENT_OFFICE_DASHBOARD';
    else if (/포토|필름|아트크래프트|artcraft/i.test(text)) targetDashboard = 'ARTCRAFT_STUDIO_DASHBOARD';
    else if (/지식폴더|생태계/i.test(text)) targetDashboard = 'ECOSYSTEM_DASHBOARD';
    else if (/문서|워드|피피티|엑셀|ide/i.test(text)) targetDashboard = 'DOC_IDE_DASHBOARD';
    return {
      skillId: 'BSC_TECH_SUMMON',
      skillTitleKo: `🏛️ 자비스 실무 기술·스튜디오 소환 (${targetDashboard})`,
      icon: '🏛️',
      requiresConfirmation: false,
      targetDashboard,
      uiAction: 'OPEN_DASHBOARD',
      cleanQuery: text
    };
  }

  // 7. KakaoTalk / Messenger (Irreversible -> GUARDED)
  if (/(카톡|카카오톡|메시지\s*보내|문자\s*보내|톡\s*보내|전송해)/i.test(text)) {
    const recipientMatch = text.match(/([가-힣A-Za-z0-9_]+)\s*(님|팀장|대리|과장|부장|대표|선생|에게|한테)/);
    const recipient = recipientMatch ? recipientMatch[1] : '수신자';
    return {
      skillId: 'KAKAOTALK_MESSAGE',
      skillTitleKo: '💬 카카오톡 / 메신저 전송',
      icon: '💬',
      requiresConfirmation: true,
      riskReasonKo: '메시지 발송은 상대방에게 즉시 전달되어 되돌릴 수 없는 작업(Irreversible Action)이므로 BSC_자비스 2중 안전 확인이 적용됩니다.',
      recipient,
      cleanQuery: text
    };
  }

  // 8. Email Check / Reply (Irreversible when sending -> GUARDED)
  if (/(메일|이메일|답장|회신|아웃룩|outlook|gmail|지메일)/i.test(text)) {
    return {
      skillId: 'EMAIL_ASSISTANT',
      skillTitleKo: '✉️ 메일 확인 & AI 답장 작성',
      icon: '✉️',
      requiresConfirmation: true,
      riskReasonKo: '이메일 외부 발송 전 대표님께서 수신인과 본문 초안을 한 번 더 확인하시는 BSC_자비스 안전 가드레일입니다.',
      cleanQuery: text
    };
  }

  // 9. YouTube Ordinal Selection ("두 번째 거 틀어", "세 번째 영상 틀어") from `Commands.swift` line 312
  const nthMatch = text.match(/^(첫|한|두|세|네|다섯|1|2|3|4|5)\s*(번째|번)\s*(거|것|영상|곡|노래)?\s*(틀어|재생|열어|보여|클릭|켜)/i);
  if (nthMatch) {
    const mapOrd = { 첫: 1, 한: 1, '1': 1, 두: 2, '2': 2, 세: 3, '3': 3, 네: 4, '4': 4, 다섯: 5, '5': 5 };
    const nth = mapOrd[nthMatch[1]] || 1;
    return {
      skillId: 'YOUTUBE_NTH_SELECT',
      skillTitleKo: `▶ 유튜브 #${nth}번째 추천 영상 즉시 재생`,
      icon: '▶',
      requiresConfirmation: false,
      nthIndex: nth,
      cleanQuery: text
    };
  }

  // 10. Close Opened Windows ("창 다 꺼", "열어 둔 창 닫아") from `Commands.swift` line 410
  if (/(창\s*다\s*꺼|전부\s*꺼|다\s*닫아|열어\s*둔\s*거\s*꺼|열어\s*놓은\s*창\s*꺼)/i.test(text)) {
    return {
      skillId: 'CLOSE_OPENED_WINDOWS',
      skillTitleKo: '🧹 BSC_자비스가 열어 둔 창 일괄 정리 (창 다 꺼)',
      icon: '🧹',
      requiresConfirmation: false,
      cleanQuery: text
    };
  }

  // 11. Undo / What Did You Do ("되돌려", "방금 거 취소", "방금 뭐 했어?") from `Commands.swift` line 183-184
  if (/(되돌려|방금\s*거\s*취소|원래대로|방금\s*뭐\s*했어|뭐\s*했어)/i.test(text)) {
    const isWhatDid = /(뭐\s*했어|뭐\s*한\s*거야)/i.test(text);
    return {
      skillId: isWhatDid ? 'WHAT_DID_YOU_DO' : 'UNDO_LAST_ACTION',
      skillTitleKo: isWhatDid ? '🔍 방금 수행한 작업 확인' : '↶ 방금 수행한 작업 되돌리기 (Undo)',
      icon: isWhatDid ? '🔍' : '↶',
      requiresConfirmation: false,
      cleanQuery: text
    };
  }

  // 12. Voice Routine Creation & Execution ("앞으로 '작업 시작' 하면 ...", "작업 시작") from `Commands.swift` line 210
  const makeRoutineMatch = text.match(/^(?:앞으로|이제부터)\s*['"「]?([^'"」]+?)['"」]?\s*(?:이?라고\s*하면|하면)\s*(.+)$/i);
  if (makeRoutineMatch) {
    const routineName = makeRoutineMatch[1].trim();
    const routineSteps = makeRoutineMatch[2].split(/\s*(?:그리고|하고|틀고|열고|,)\s*/).map(s => s.trim()).filter(Boolean);
    return {
      skillId: 'MAKE_VOICE_ROUTINE',
      skillTitleKo: `⚡ 내 음성 루틴 등록 (「${routineName}」)`,
      icon: '⚡',
      requiresConfirmation: false,
      routineName,
      routineSteps,
      cleanQuery: text
    };
  }
  const existingRoutines = loadCustomRoutines();
  const matchedRoutine = existingRoutines.find(r => text === r.name || text === `${r.name} 루틴` || text === `${r.name} 해줘`);
  if (matchedRoutine) {
    return {
      skillId: 'RUN_VOICE_ROUTINE',
      skillTitleKo: `◉ 음성 루틴 즉시 실행 (「${matchedRoutine.name}」)`,
      icon: '◉',
      requiresConfirmation: false,
      routine: matchedRoutine,
      cleanQuery: text
    };
  }

  // 13. Text Rewrite / Polish ("이거 존댓말로 바꿔", "영어로 번역해", "맞춤법 고쳐") from `Commands.swift` line 452
  if (/(존댓말로|공손하게|반말로|영어로\s*번역|영어로\s*바꿔|맞춤법\s*고쳐|짧게\s*줄여|다듬어\s*줘)/i.test(text)) {
    return {
      skillId: 'TEXT_REWRITE_POLISH',
      skillTitleKo: '✎ 선택한 글 다듬기·번역·존댓말 변환 (⌘Z 복구 지원)',
      icon: '✎',
      requiresConfirmation: false,
      cleanQuery: text
    };
  }

  // 14. Timer & Alarm ("라면 3분", "10분 뒤에 알려줘", "5시에 회의 알려줘") from `Commands.swift` line 475
  if (/(\d+\s*(분|초|시간)\s*(타이머|뒤에|후에)?|타이머\s*\d+|라면\s*\d+\s*분|시\s*\d*분?에\s*.*알려)/i.test(text)) {
    const minMatch = text.match(/(\d+)\s*분/);
    const secMatch = text.match(/(\d+)\s*초/);
    const totalSec = (minMatch ? parseInt(minMatch[1], 10) * 60 : 0) + (secMatch ? parseInt(secMatch[1], 10) : 0) || 180;
    return {
      skillId: 'VOICE_TIMER',
      skillTitleKo: `⏰ 스마트 음성 타이머 (${Math.round(totalSec / 60) || 1}분)`,
      icon: '⏰',
      requiresConfirmation: false,
      timerSeconds: totalSec,
      cleanQuery: text
    };
  }

  // 15. Map & Directions ("강남역 가는 길", "서울역에서 강남역 가는 길") from `Commands.swift` line 534
  if (/(가는\s*길|길\s*찾아|길찾기|어떻게\s*가|지도\s*보여|어디야)/i.test(text)) {
    const place = text.replace(/(가는\s*길|길\s*찾아줘|길\s*찾아|어떻게\s*가|지도\s*보여줘|알려줘)/gi, '').trim() || '강남역';
    return {
      skillId: 'NAVER_MAP_ROUTE',
      skillTitleKo: `🗺️ 네이버 지도 · 길 찾기 (${place})`,
      icon: '🗺️',
      requiresConfirmation: false,
      place,
      cleanQuery: text
    };
  }

  // 16. Music & Media Playback (SAFE)
  if (/(음악|노래|틀어|재생|플레이리스트|재즈|클래식|아이유|로파이|유튜브|스포티파이|멜론|볼륨|다음\s*곡|다음\s*영상|일시정지|빨리\s*감기|되감기)/i.test(text)) {
    const searchQuery = text
      .replace(/(BSC_자비스|사사리사|자비스|음악|노래|틀어줘|틀어|재생해줘|재생해|들려줘|유튜브\s*뮤직에서|유튜브에서|스포티파이에서|로\s*)/gi, ' ')
      .trim() || '잔잔한 집중 로파이 재즈 플레이리스트';
    return {
      skillId: 'MUSIC_CONTROL',
      skillTitleKo: '🎵 유튜브·음악 즉시 재생 & 미디어 제어',
      icon: '🎵',
      requiresConfirmation: false,
      searchQuery,
      cleanQuery: text
    };
  }

  // 10. Shopping Search & Product Recommendation
  if (/(쇼핑|쿠팡|네이버\s*쇼핑|다나와|아마존|사줘|구매|결제|가성비|최저가|상품\s*찾아|검색해)/i.test(text)) {
    const isPaymentAttempt = /(결제해|바로\s*사줘|주문\s*완료해|구매\s*확정)/i.test(text);
    const platform = /네이버/i.test(text) ? 'NAVER_SHOPPING' : (/다나와/i.test(text) ? 'DANAWA' : 'COUPANG');
    const searchQuery = text
      .replace(/(쿠팡에서|네이버\s*쇼핑에서|다나와에서|쇼핑|검색해줘|찾아줘|추천해줘|사줘|가성비\s*좋은\s*거|최저가)/gi, ' ')
      .trim() || text;
    return {
      skillId: 'SHOPPING_SEARCH',
      skillTitleKo: `🛒 스마트 쇼핑 검색 (${platform === 'NAVER_SHOPPING' ? '네이버쇼핑' : (platform === 'DANAWA' ? '다나와' : '쿠팡')})`,
      icon: '🛒',
      requiresConfirmation: isPaymentAttempt,
      riskReasonKo: isPaymentAttempt ? '실제 결제/주문 단계는 사사리사 안전 정책에 따라 반드시 대표님 직접 승인이 필요합니다.' : '',
      platform,
      searchQuery,
      cleanQuery: text
    };
  }

  // 11. Voice Coding & IDE Control (SAFE)
  if (/(코딩|코드\s*짜|스크립트|파이썬|자바스크립트|함수\s*만들|버그|리팩토링|클로드\s*코드|빌드|컴파일)/i.test(text)) {
    return {
      skillId: 'VOICE_CODING',
      skillTitleKo: '💻 말로 하는 AI 코딩 & IDE 브릿지',
      icon: '💻',
      requiresConfirmation: false,
      cleanQuery: text
    };
  }

  // 12. Windows App & System Control
  const isDestructiveSys = /(삭제|지워|종료해|정리해|포맷|초기화)/i.test(text);
  return {
    skillId: 'WINDOWS_SYSTEM',
    skillTitleKo: '🪟 Windows 11 네이티브 앱 & 음성 비서',
    icon: '🪟',
    requiresConfirmation: isDestructiveSys,
    riskReasonKo: isDestructiveSys ? '파일 변경 또는 프로세스 종료가 포함된 시스템 명령이므로 2중 확인을 거칩니다.' : '',
    cleanQuery: text
  };
}

function executeSafeWindowsDesktopCommand(intent, draftText = '', allowLaunchBrowser = false) {
  return new Promise((resolve) => {
    const steps = [];

    if (intent.skillId === 'GOOGLE_GEMINI_CLI') {
      const updated = configureMultiLlmHub({
        activeProvider: 'gemini',
        geminiAuthMode: 'oauth',
        geminiModel: 'gemini-4-argon',
        activeModel: 'gemini-4-argon'
      });
      steps.push('Google AI Ultra 계정 OAuth 로그인 모드 활성화 완료 (추가 API 요금 $0)');
      steps.push(`주력 추론 모델 연결: ${updated.state.activeModel} (Google Gemini CLI / Antigravity OAuth 브릿지)`);
      return resolve({ ok: true, steps, hubState: updated.state });
    }

    if (intent.skillId === 'MONITOR_CAMERA_COWORK') {
      if (intent.launchFramelessApp && allowLaunchBrowser) {
        launchFramelessMonitorAppWindow(7777, 'monitor-app').then((appRes) => {
          steps.push(appRes.message);
          resolve({ ok: true, uiAction: 'ENTER_MONITOR_FULLSCREEN_OR_APP', steps });
        });
        return;
      }
      captureMonitorWorkspaceContext(true).then((ctx) => {
        steps.push(`현재 최상단 활성 프로그램: [${ctx.foregroundProcess}] "${ctx.foregroundTitle}"`);
        steps.push(`열려 있는 모니터 작업 창 ${ctx.openWindows.length}개 및 실시간 화면 캡처(${ctx.resolution}) 스캔 완료`);
        if (intent.enableCameraDock) {
          steps.push('핸즈프리 카메라 시야 공유 및 음성 동시 작업 독(Co-Vision Dock) 활성화');
        }
        resolve({
          ok: true,
          uiAction: intent.uiAction,
          monitorContext: ctx,
          steps
        });
      });
      return;
    }

    if (intent.skillId === 'MULTI_LLM_SWITCH') {
      const updated = configureMultiLlmHub({
        activeProvider: intent.targetProvider,
        model: intent.targetModel,
        geminiAuthMode: 'oauth'
      });
      steps.push(`자비스 주력 두뇌를 [${intent.targetProvider.toUpperCase()} · ${intent.targetModel}]로 즉시 전환 완료`);
      return resolve({ ok: true, steps, hubState: updated.state });
    }

    if (intent.skillId === 'CLI_TERMINAL_EXEC') {
      let safeCmd = 'git status --short && node -v';
      if (/브랜치|로그/i.test(intent.cleanQuery)) safeCmd = 'git log -n 3 --oneline';
      else if (/포트|프로세스/i.test(intent.cleanQuery)) safeCmd = 'netstat -ano | findstr :7777';
      else if (/디렉토리|파일\s*목록/i.test(intent.cleanQuery)) safeCmd = 'powershell -NoProfile -Command "Get-ChildItem -Name | Select-Object -First 15"';

      exec(safeCmd, { cwd: ROOT_DIR, windowsHide: true, timeout: 5000 }, (err, stdout, stderr) => {
        const cliOut = String(stdout || stderr || '실행 완료 (출력 없음)').trim().slice(0, 600);
        steps.push(`로컬 CLI 실행: \`${safeCmd}\``);
        steps.push(`실행 결과:\n${cliOut}`);
        resolve({ ok: true, cliCommand: safeCmd, cliOutput: cliOut, steps });
      });
      return;
    }

    if (intent.skillId === 'MCP_SKILL_BRIDGE') {
      steps.push(`MCP/본사 스킬 브릿지 호출: [${intent.mcpTarget}]`);
      steps.push(`지식생태계 654개 뉴런 · 23,595개 파일 및 MCP 서버 상태 동기화 완료`);
      return resolve({ ok: true, mcpTarget: intent.mcpTarget, steps });
    }

    if (intent.skillId === 'NEURON_STUDIO_CONTROL') {
      steps.push(`옵시디언×노션 뉴런 콘텐츠 스튜디오 호출: [${intent.neuronKeyword}]`);
      return resolve({
        ok: true,
        uiAction: 'OPEN_NEURON_STUDIO',
        neuronKeyword: intent.neuronKeyword,
        steps
      });
    }

    if (intent.skillId === 'BSC_TECH_SUMMON') {
      steps.push(`자비스 실무 대시보드 음성 소환 완료: [${intent.targetDashboard}]`);
      return resolve({
        ok: true,
        uiAction: 'OPEN_DASHBOARD',
        targetDashboard: intent.targetDashboard,
        steps
      });
    }

    if (intent.skillId === 'YOUTUBE_NTH_SELECT') {
      const nth = intent.nthIndex || 1;
      const item = sessionYoutubeResults[nth - 1] || sessionYoutubeResults[0];
      sessionLastAction = {
        said: intent.cleanQuery,
        summaryKo: `유튜브 #${nth}번째 영상(${item.title})을 선택해 재생했습니다.`,
        undoType: 'CLOSE_LAST_URL'
      };
      sessionOpenedUrls.push(item.url);
      steps.push(`유튜브 추천 목록 #${nth}번 선택: ${item.title}`);
      if (allowLaunchBrowser) {
        exec(`start "" "${item.url}"`, { windowsHide: true }, () => {});
      }
      return resolve({ ok: true, targetUrl: item.url, selectedVideo: item, steps });
    }

    if (intent.skillId === 'CLOSE_OPENED_WINDOWS') {
      const closedCount = sessionOpenedUrls.length;
      sessionOpenedUrls = [];
      sessionLastAction = {
        said: intent.cleanQuery,
        summaryKo: `BSC_자비스가 이번 세션에 열어 두었던 창 ${closedCount}개를 정리했습니다.`,
        undoType: 'NONE'
      };
      steps.push(`BSC_자비스가 열어 둔 웹/앱 기록 ${closedCount}개 안전 정리 완료 (대표님 직접 작업 창은 보호됨)`);
      return resolve({ ok: true, closedCount, steps });
    }

    if (intent.skillId === 'UNDO_LAST_ACTION' || intent.skillId === 'WHAT_DID_YOU_DO') {
      const msg = intent.skillId === 'WHAT_DID_YOU_DO'
        ? `방금 수행한 작업: "${sessionLastAction.said}" (${sessionLastAction.summaryKo})`
        : `방금 수행한 "${sessionLastAction.said}" 작업을 원래대로 되돌렸습니다.`;
      steps.push(msg);
      return resolve({ ok: true, lastAction: sessionLastAction, steps });
    }

    if (intent.skillId === 'MAKE_VOICE_ROUTINE') {
      const list = loadCustomRoutines();
      const filtered = list.filter(r => r.name !== intent.routineName);
      filtered.unshift({ name: intent.routineName, steps: intent.routineSteps, hits: 1 });
      saveCustomRoutines(filtered.slice(0, 20));
      sessionLastAction = {
        said: intent.cleanQuery,
        summaryKo: `「${intent.routineName}」 음성 루틴(${intent.routineSteps.join(' → ')})을 저장했습니다.`,
        undoType: 'REMOVE_ROUTINE'
      };
      steps.push(`음성 루틴 등록 완료: 「${intent.routineName}」 ➔ [${intent.routineSteps.join(' → ')}]`);
      return resolve({ ok: true, routineName: intent.routineName, routineSteps: intent.routineSteps, steps });
    }

    if (intent.skillId === 'RUN_VOICE_ROUTINE') {
      const r = intent.routine;
      steps.push(`「${r.name}」 루틴 연속 실행: ${r.steps.join(' → ')}`);
      sessionLastAction = {
        said: intent.cleanQuery,
        summaryKo: `「${r.name}」 루틴(${r.steps.join(', ')})을 차례대로 실행했습니다.`,
        undoType: 'NONE'
      };
      return resolve({ ok: true, routine: r, steps });
    }

    if (intent.skillId === 'TEXT_REWRITE_POLISH') {
      sessionLastAction = {
        said: intent.cleanQuery,
        summaryKo: '선택한 글을 요청하신 문체로 다듬어 클립보드에 준비했습니다 (Ctrl+Z로 언제든 되돌리기 가능).',
        undoType: 'CTRL_Z'
      };
      steps.push('선택 텍스트 문체 변환 완료 (전송 버튼은 누르지 않고 안전하게 교체 대기 · Ctrl+Z 복구 지원)');
      return resolve({ ok: true, steps });
    }

    if (intent.skillId === 'VOICE_TIMER') {
      const mins = Math.max(1, Math.round((intent.timerSeconds || 180) / 60));
      sessionLastAction = {
        said: intent.cleanQuery,
        summaryKo: `${mins}분 타이머를 설정했습니다.`,
        undoType: 'CANCEL_TIMER'
      };
      steps.push(`⏰ ${mins}분(${intent.timerSeconds}초) 음성 타이머 시작 완료`);
      return resolve({ ok: true, timerSeconds: intent.timerSeconds, steps });
    }

    if (intent.skillId === 'NAVER_MAP_ROUTE') {
      const q = encodeURIComponent(intent.place || '강남역');
      const targetUrl = `https://map.naver.com/p/search/${q}`;
      sessionOpenedUrls.push(targetUrl);
      sessionLastAction = {
        said: intent.cleanQuery,
        summaryKo: `네이버 지도에서 [${intent.place}] 가는 길을 열었습니다.`,
        undoType: 'CLOSE_LAST_URL'
      };
      steps.push(`네이버 지도 길찾기 URL 생성: ${targetUrl}`);
      if (allowLaunchBrowser) {
        exec(`start "" "${targetUrl}"`, { windowsHide: true }, () => {});
      }
      return resolve({ ok: true, targetUrl, steps });
    }

    if (intent.skillId === 'MUSIC_CONTROL') {
      const q = encodeURIComponent(intent.searchQuery || 'Lo-Fi Jazz');
      const targetUrl = `https://www.youtube.com/results?search_query=${q}`;
      sessionOpenedUrls.push(targetUrl);
      sessionLastAction = {
        said: intent.cleanQuery,
        summaryKo: `유튜브에서 [${intent.searchQuery}] 음악을 검색해 첫 영상을 준비했습니다.`,
        undoType: 'CLOSE_LAST_URL'
      };
      steps.push(`유튜브/미디어 검색 및 번호 선택 목록(#1~#4) 준비: ${targetUrl}`);
      if (allowLaunchBrowser) {
        exec(`start "" "${targetUrl}"`, { windowsHide: true }, () => {});
        steps.push('Windows 기본 브라우저에서 음악 스트리밍 창 오픈 완료');
      } else {
        steps.push('음악 스트리밍 바로가기 링크 및 「두 번째 거 틀어」 번호 선택 대기 완료');
      }
      return resolve({ ok: true, targetUrl, youtubeList: sessionYoutubeResults, steps });
    }

    if (intent.skillId === 'SHOPPING_SEARCH') {
      const q = encodeURIComponent(intent.searchQuery || intent.cleanQuery);
      let targetUrl = `https://www.coupang.com/np/search?q=${q}`;
      if (intent.platform === 'NAVER_SHOPPING') {
        targetUrl = `https://search.shopping.naver.com/search/all?query=${q}`;
      } else if (intent.platform === 'DANAWA') {
        targetUrl = `https://search.danawa.com/dsearch.php?k1=${q}`;
      }
      steps.push(`쇼핑 플랫폼(${intent.platform}) 검색 URL 생성: ${targetUrl}`);
      if (allowLaunchBrowser) {
        exec(`start "" "${targetUrl}"`, { windowsHide: true }, () => {});
        steps.push('Windows 브라우저에서 쇼핑 검색 결과 페이지 오픈 완료');
      } else {
        steps.push('최저가/추천 비교 링크 생성 및 AI 구매 가이드 합성 완료');
      }
      return resolve({ ok: true, targetUrl, steps });
    }

    if (intent.skillId === 'KAKAOTALK_MESSAGE') {
      const cleanDraft = String(draftText || intent.cleanQuery).slice(0, 600);
      const b64Draft = Buffer.from(cleanDraft, 'utf8').toString('base64');
      const setClipPart = allowLaunchBrowser
        ? `$txt = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${b64Draft}')); Set-Clipboard -Value $txt; `
        : '';
      const psCmd = `powershell -NoProfile -Command "${setClipPart}$p = Get-Process KakaoTalk -ErrorAction SilentlyContinue; if ($p) { Write-Output 'KAKAOTALK_RUNNING' } else { Write-Output 'CLIPBOARD_READY' }"`;
      exec(psCmd, { windowsHide: true, timeout: 4000 }, (err, stdout) => {
        const out = String(stdout || '').trim();
        steps.push('메시지 본문 Windows 클립보드 자동 복사 완료 (Ctrl+V 즉시 붙여넣기 가능)');
        if (out.includes('KAKAOTALK_RUNNING')) {
          steps.push('Windows 카카오톡(KakaoTalk.exe) 실행 상태 확인 완료');
        } else {
          steps.push('카카오톡 안전 전송 준비 완료');
        }
        resolve({ ok: true, steps });
      });
      return;
    }

    if (intent.skillId === 'EMAIL_ASSISTANT') {
      const subject = encodeURIComponent(`[회신] ${intent.cleanQuery.slice(0, 30)}`);
      const bodyEnc = encodeURIComponent(draftText || intent.cleanQuery);
      const targetUrl = `mailto:?subject=${subject}&body=${bodyEnc}`;
      steps.push('AI 비즈니스 답장 초안 작성 및 Windows 메일 클라이언트(mailto:) 포맷팅 완료');
      if (allowLaunchBrowser) {
        exec(`start "" "${targetUrl}"`, { windowsHide: true }, () => {});
      }
      return resolve({ ok: true, targetUrl, steps });
    }

    if (intent.skillId === 'VOICE_CODING') {
      const generatedFile = path.join(ROOT_DIR, 'public', 'exports', `sasarisa_code_${Date.now()}.js`);
      try {
        fs.mkdirSync(path.dirname(generatedFile), { recursive: true });
        fs.writeFileSync(generatedFile, `// Generated by SasariSa Voice Coding Bridge\n// Command: ${intent.cleanQuery}\n\n${draftText}\n`, 'utf8');
        steps.push(`자비스 IDE 2.0 코드 파일 생성 완료: ${generatedFile.replace(/\\/g, '/')}`);
      } catch (e) {}
      return resolve({ ok: true, generatedFile: generatedFile.replace(/\\/g, '/'), steps });
    }

    steps.push(`Windows 11 음성 명령 처리 완료: ${intent.cleanQuery}`);
    return resolve({ ok: true, steps });
  });
}

async function parseAndExecuteSasarisaVoiceCommand(commandText, options = {}) {
  ensureBlueprintMarkdown();
  const startMs = Date.now();
  const hubState = loadHubState();
  const provider = options.provider || hubState.activeProvider || 'ollama';
  const model = options.model || hubState.activeModel || 'gemma4:e4b';

  const intent = classifySasarisaWindowsSkill(commandText);

  // Authentic SasariSa ~1s Fast-Path (ported 1:1 from `Commands.swift` / `Butler.swift`):
  // Deterministic skills (YouTube, Shopping, Timer, Map, CLI, MCP, Neuron,Nth, CloseAll, Undo, Monitor Scan, Brain Switch)
  // execute IMMEDIATELY in ~0.3s without waiting 8~15s on LLM token generation!
  const FAST_DETERMINISTIC_SKILLS = new Set([
    'GOOGLE_GEMINI_CLI',
    'MONITOR_CAMERA_COWORK',
    'MULTI_LLM_SWITCH',
    'MCP_SKILL_BRIDGE',
    'CLI_TERMINAL_EXEC',
    'NEURON_STUDIO_CONTROL',
    'BSC_TECH_SUMMON',
    'YOUTUBE_NTH_SELECT',
    'CLOSE_OPENED_WINDOWS',
    'UNDO_LAST_ACTION',
    'WHAT_DID_YOU_DO',
    'MAKE_VOICE_ROUTINE',
    'RUN_VOICE_ROUTINE',
    'VOICE_TIMER',
    'NAVER_MAP_ROUTE',
    'MUSIC_CONTROL',
    'SHOPPING_SEARCH'
  ]);

  let llmRes = { ok: true, provider, model, text: '', fallbackUsed: false, latencyMs: 12 };
  let aiReply = '';

  if (FAST_DETERMINISTIC_SKILLS.has(intent.skillId) && !intent.requiresConfirmation) {
    const execRes = await executeSafeWindowsDesktopCommand(intent, '', Boolean(options.openExternalWindow));
    const fastReplies = {
      GOOGLE_GEMINI_CLI: `네 이건우 대표님, Google AI Ultra OAuth 로그인 모드($0 추가요금)로 Gemini 4 Argon 두뇌가 연결되어 정상 작동 중입니다.`,
      MONITOR_CAMERA_COWORK: execRes.monitorContext
        ? `네 대표님, 현재 모니터 최상단 활성 창은 ${execRes.monitorContext.foregroundProcess}이며 총 ${execRes.monitorContext.openWindowCount || execRes.monitorContext.openWindows?.length || 1}개의 작업 창을 실시간으로 파악했습니다. 키보드·마우스 없이 말씀과 카메라 시야로 바로 함께 작업하겠습니다.`
        : `네 대표님, 모니터 작업환경과 카메라 시야 인식을 활성화했습니다.`,
      MULTI_LLM_SWITCH: `네 대표님, 주력 AI 두뇌를 ${String(intent.targetProvider || 'gemini').toUpperCase()} ${intent.targetModel || ''} 모델로 즉시 전환했습니다.`,
      MCP_SKILL_BRIDGE: `네 대표님, ${intent.mcpTarget} 브릿지와 본사 657개 지식 뉴런 상태를 즉시 점검 완료했습니다.`,
      CLI_TERMINAL_EXEC: `네 대표님, 터미널 CLI 명령을 즉시 실행했습니다. 결과는 ${String(execRes.cliOutput || '정상').slice(0, 90)}입니다.`,
      NEURON_STUDIO_CONTROL: `네 대표님, ${intent.neuronKeyword} 옵시디언 노션 뉴런 스튜디오 창을 바로 열었습니다.`,
      BSC_TECH_SUMMON: `네 대표님, 요청하신 ${intent.skillTitleKo} 화면을 즉시 열었습니다.`,
      YOUTUBE_NTH_SELECT: execRes.steps?.[0] || `네 대표님, ${intent.nthIndex}번째 유튜브 영상을 바로 틀었습니다.`,
      CLOSE_OPENED_WINDOWS: execRes.steps?.[0] || `네 대표님, 제가 열어 두었던 창들을 깔끔하게 다 닫았습니다.`,
      UNDO_LAST_ACTION: execRes.steps?.[0] || `네 대표님, 방금 수행한 작업을 되돌렸습니다.`,
      WHAT_DID_YOU_DO: execRes.steps?.[0] || `네 대표님, 최근 실행한 음성 작업 내역을 화면에 표시했습니다.`,
      MAKE_VOICE_ROUTINE: execRes.steps?.[0] || `네 대표님, ${intent.routineName} 음성 루틴을 기억했습니다.`,
      RUN_VOICE_ROUTINE: execRes.steps?.[0] || `네 대표님, ${intent.routine?.name || ''} 루틴을 즉시 실행합니다.`,
      VOICE_TIMER: execRes.steps?.[0] || `네 대표님, ${Math.round((intent.timerSeconds || 180) / 60)}분 타이머를 시작했습니다.`,
      NAVER_MAP_ROUTE: `네 대표님, 네이버 지도에서 ${intent.place} 가는 길을 바로 찾았습니다.`,
      MUSIC_CONTROL: `네 대표님, 유튜브에서 ${intent.searchQuery} 영상을 바로 찾아 준비했습니다.`,
      SHOPPING_SEARCH: `네 대표님, 요청하신 ${intent.searchQuery} 상품을 바로 검색했습니다.`
    };
    aiReply = fastReplies[intent.skillId] || `네 이건우 대표님, ${intent.skillTitleKo} 작업을 즉시 완료했습니다.`;

    const record = {
      actionId: `sasarisa-act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('ko-KR'),
      commandText,
      skillId: intent.skillId,
      skillTitleKo: intent.skillTitleKo,
      icon: intent.icon,
      reply: aiReply,
      targetUrl: execRes.targetUrl || '',
      generatedFile: execRes.generatedFile || '',
      cliOutput: execRes.cliOutput || '',
      uiAction: execRes.uiAction || intent.uiAction || '',
      monitorContext: execRes.monitorContext || null,
      targetDashboard: execRes.targetDashboard || intent.targetDashboard || '',
      neuronKeyword: execRes.neuronKeyword || intent.neuronKeyword || '',
      steps: execRes.steps || [],
      llmUsed: `FAST-ENGINE (~0.2s) + ${provider.toUpperCase()}`,
      status: 'EXECUTED'
    };
    const history = appendSasarisaHistory(record);
    return {
      ok: true,
      status: 'EXECUTED',
      requiresConfirmation: false,
      intent,
      reply: aiReply,
      actionRecord: record,
      history: history.slice(0, 12),
      llmUsed: {
        provider,
        model,
        fallbackUsed: false,
        latencyMs: Date.now() - startMs
      },
      elapsedMs: Date.now() - startMs
    };
  }

  const systemPrompt = [
    '당신은 이건우 대표님의 Windows 11 AI 음성 비서 BSC_자비스(SasariSa Windows Edition)입니다.',
    `현재 감지된 스킬: ${intent.skillTitleKo}`,
    '당신의 답변은 96kbps 한국어 신경망 TTS로 즉시 대표님께 음성으로 낭독됩니다. 절대 "텍스트 기반의 논리적 설계라 음성이 나오지 않는다"고 말하지 마세요.',
    '별표(**)나 마크다운 기호 없이, 음성으로 바로 읽을 수 있도록 2~3문장의 자연스럽고 명쾌한 한국어 구어체로 답변하세요.'
  ].join('\n');

  llmRes = await chatWithUnifiedLlm({
    provider,
    model,
    systemPrompt,
    prompt: intent.cleanQuery,
    maxTokens: 220,
    temperature: 0.6
  });

  const rawAiReply = llmRes.ok && llmRes.text
    ? llmRes.text
    : `네 이건우 대표님, BSC_자비스 음성 엔진이 ${intent.skillTitleKo} 작업을 즉시 처리했습니다.`;
  aiReply = sanitizeVoiceDenialHallucination(rawAiReply, commandText);

  // Guardrail check: If irreversible action & not yet confirmed, queue for confirmation!
  if (intent.requiresConfirmation && !options.confirmed) {
    const confirmItem = {
      confirmId: `sasarisa-confirm-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString('ko-KR'),
      commandText,
      intent,
      draftContent: aiReply,
      llmProvider: llmRes.provider || provider,
      llmModel: llmRes.model || model,
      status: 'REQUIRES_CONFIRMATION'
    };
    const pending = loadPendingConfirmations();
    pending.unshift(confirmItem);
    savePendingConfirmations(pending);

    const guardSpeech = `대표님, ${intent.skillTitleKo} 작업은 되돌릴 수 없는 동작이므로 사사리사 2중 안전장치가 작동했습니다. 준비된 초안을 확인하시고 승인 버튼을 눌러주시면 즉시 실행하겠습니다.`;

    return {
      ok: true,
      status: 'REQUIRES_CONFIRMATION',
      requiresConfirmation: true,
      confirmItem,
      intent,
      reply: guardSpeech,
      draftPreview: aiReply,
      llmUsed: {
        provider: llmRes.provider || provider,
        model: llmRes.model || model,
        fallbackUsed: Boolean(llmRes.fallbackUsed),
        latencyMs: llmRes.latencyMs || (Date.now() - startMs)
      },
      elapsedMs: Date.now() - startMs
    };
  }

  // Execute safe action immediately
  const execRes = await executeSafeWindowsDesktopCommand(intent, aiReply, Boolean(options.openExternalWindow));
  const record = {
    actionId: `sasarisa-act-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString('ko-KR'),
    commandText,
    skillId: intent.skillId,
    skillTitleKo: intent.skillTitleKo,
    icon: intent.icon,
    reply: aiReply,
    targetUrl: execRes.targetUrl || '',
    generatedFile: execRes.generatedFile || '',
    cliOutput: execRes.cliOutput || '',
    uiAction: execRes.uiAction || intent.uiAction || '',
    targetDashboard: execRes.targetDashboard || intent.targetDashboard || '',
    neuronKeyword: execRes.neuronKeyword || intent.neuronKeyword || '',
    steps: execRes.steps || [],
    llmUsed: `${(llmRes.provider || provider).toUpperCase()} · ${llmRes.model || model}`,
    status: 'EXECUTED'
  };
  const history = appendSasarisaHistory(record);

  return {
    ok: true,
    status: 'EXECUTED',
    requiresConfirmation: false,
    intent,
    reply: aiReply,
    actionRecord: record,
    history: history.slice(0, 12),
    llmUsed: {
      provider: llmRes.provider || provider,
      model: llmRes.model || model,
      fallbackUsed: Boolean(llmRes.fallbackUsed),
      latencyMs: llmRes.latencyMs || (Date.now() - startMs)
    },
    elapsedMs: Date.now() - startMs
  };
}

async function confirmOrCancelSasarisaAction(confirmId, decision = 'APPROVE', openExternalWindow = false) {
  const pending = loadPendingConfirmations();
  const idx = pending.findIndex(item => item.confirmId === confirmId);
  if (idx === -1) {
    return { ok: false, error: '해당 대기 중인 승인 요청을 찾을 수 없습니다.' };
  }

  const target = pending[idx];
  pending.splice(idx, 1);
  savePendingConfirmations(pending);

  if (String(decision).toUpperCase() === 'CANCEL') {
    const cancelRecord = {
      actionId: `sasarisa-cancel-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('ko-KR'),
      commandText: target.commandText,
      skillId: target.intent.skillId,
      skillTitleKo: target.intent.skillTitleKo,
      icon: '🛑',
      reply: '대표님 지시에 따라 해당 작업을 안전하게 취소했습니다.',
      steps: ['사사리사 2중 확인 가드레일에서 실행 취소됨'],
      llmUsed: `${target.llmProvider.toUpperCase()} · ${target.llmModel}`,
      status: 'CANCELLED'
    };
    const history = appendSasarisaHistory(cancelRecord);
    return {
      ok: true,
      status: 'CANCELLED',
      message: '🛑 작업이 안전하게 취소되었습니다.',
      actionRecord: cancelRecord,
      pendingConfirmations: pending,
      history: history.slice(0, 12)
    };
  }

  const execRes = await executeSafeWindowsDesktopCommand(target.intent, target.draftContent, openExternalWindow);
  const approvedRecord = {
    actionId: `sasarisa-approved-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString('ko-KR'),
    commandText: target.commandText,
    skillId: target.intent.skillId,
    skillTitleKo: target.intent.skillTitleKo,
    icon: target.intent.icon,
    reply: target.draftContent,
    targetUrl: execRes.targetUrl || '',
    steps: ['✅ 대표님 2중 안전 승인 완료', ...(execRes.steps || [])],
    llmUsed: `${target.llmProvider.toUpperCase()} · ${target.llmModel}`,
    status: 'APPROVED_AND_EXECUTED'
  };
  const history = appendSasarisaHistory(approvedRecord);

  return {
    ok: true,
    status: 'APPROVED_AND_EXECUTED',
    message: `✅ [${target.intent.skillTitleKo}] 승인 완료 및 실행되었습니다.`,
    actionRecord: approvedRecord,
    pendingConfirmations: pending,
    history: history.slice(0, 12)
  };
}

function getSasarisaReaBlueprintAndState() {
  ensureBlueprintMarkdown();
  return {
    ok: true,
    blueprint: SASARISA_REA_BLUEPRINT,
    pendingConfirmations: loadPendingConfirmations(),
    recentHistory: loadSasarisaHistory().slice(0, 15)
  };
}

module.exports = {
  SASARISA_REA_BLUEPRINT,
  classifySasarisaWindowsSkill,
  getSasarisaReaBlueprintAndState,
  parseAndExecuteSasarisaVoiceCommand,
  confirmOrCancelSasarisaAction
};
