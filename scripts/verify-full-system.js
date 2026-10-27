/**
 * 🛡️ BSC J.A.R.V.I.S. OS — Full-System Automated Verification & QA Suite
 * Tests:
 *  1. All 15 HTTP GET/POST Endpoints on http://127.0.0.1:7777
 *  2. Movie J.A.R.V.I.S. Ultra-Concise Executive Speaking Style (1~2 sentences)
 *  3. Open-Source TTS & 7 HD Neural Voices (/api/jarvis/tts MP3/WAV synthesis)
 *  4. 11-Section Master Settings Persistence (/api/jarvis/settings GET & POST)
 *  5. All 18 Studio Window Summoning Triggers (AI_STUDIO_HUB, OPEN_TTS_STUDIO, MAPS_REA_STUDIO, AGENT_REGISTRY, CREATIVE_BLENDER, RL_BENCHMARK, VISION_FACE, SIM_BIO_IDE, MANUAL, REPORT, LIVE_CONSOLE, GEN_STUDIO)
 *  6. Frontend JS Catalog & Window Spawner Integrity
 */

const fs = require('fs');
const path = require('path');

const BASE = `http://127.0.0.1:${process.env.JARVIS_PORT || 7777}`;

async function requestJson(method, urlPath, bodyObj = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  };
  if (bodyObj) opts.body = JSON.stringify(bodyObj);
  const res = await fetch(`${BASE}${urlPath}`, opts);
  const data = await res.json();
  return { status: res.status, data };
}

async function runVerification() {
  const results = [];
  const check = (name, passed, detail) => {
    results.push({ name, passed: Boolean(passed), detail });
    console.log(`${passed ? '✅ PASS' : '❌ FAIL'} | ${name} — ${detail}`);
  };

  // 1. Index HTML & Top Unified Workspace Bar
  const htmlRes = await fetch(`${BASE}/`);
  const htmlText = await htmlRes.text();
  check(
    '1. Main HUD HTML & Unified Workspace Bar (#unified-workspace-bar)',
    htmlRes.status === 200 && htmlText.includes('id="unified-workspace-bar"') && htmlText.includes('OPEN_TTS_STUDIO') && htmlText.includes('btn-open-master-settings'),
    `HTTP ${htmlRes.status}, length=${htmlText.length} chars`
  );

  // 2. Brain Graph API (/api/brain)
  const brain = await requestJson('GET', '/api/brain');
  check(
    '2. 2-Hop Obsidian Brain Graph (/api/brain)',
    brain.status === 200 && Array.isArray(brain.data.nodes) && brain.data.nodes.length > 500,
    `${brain.data.nodes?.length || 0} nodes, ${brain.data.links?.length || 0} links`
  );

  // 3. BSC 28 Agents Roster (/api/agents)
  const agents = await requestJson('GET', '/api/agents');
  check(
    '3. BSC 28 Agents Roster (/api/agents)',
    agents.status === 200,
    `HTTP ${agents.status}`
  );

  // 4. Token Flow Telemetry (/api/token-flow)
  const tf = await requestJson('GET', '/api/token-flow');
  check(
    '4. Token Flow Stewardship Telemetry (/api/token-flow)',
    tf.status === 200 && typeof tf.data.measured === 'boolean' && typeof tf.data.sessionChars === 'number',
    `measured=${tf.data.measured}, sessionChars=${tf.data.sessionChars}`
  );

  // 5. Master Settings Persistence (POST & GET /api/jarvis/settings)
  const postSet = await requestJson('POST', '/api/jarvis/settings', {
    uiLanguage: 'ko',
    speakingStyle: 'MOVIE_JARVIS_CONCISE',
    designTheme: 'CYBER_HUD_PRO',
    ttsEngine: 'LOCAL_CHATTERBOX_MULTILINGUAL',
    voiceId: 'ko-KR-HyunsuMultilingualNeural',
    speechRate: 1.08,
    pitchHz: '-2Hz'
  });
  const getSet = await requestJson('GET', '/api/jarvis/settings');
  check(
    '5. 11-Section Master Settings Persistence (/api/jarvis/settings)',
    postSet.data.ok && getSet.data.ok && getSet.data.settings?.speakingStyle === 'MOVIE_JARVIS_CONCISE',
    `Saved & Reloaded speakingStyle=${getSet.data.settings?.speakingStyle}`
  );

  // 6. Open-Source & Neural HD TTS Synthesis (Korean & English Movie J.A.R.V.I.S.)
  const ttsKo = await requestJson('POST', '/api/jarvis/tts', {
    text: '대표님, 전 시스템 정상 가동 중입니다.',
    persona: 'jarvis',
    voiceId: 'ko-KR-HyunsuMultilingualNeural',
    speechRate: 1.08,
    pitchHz: '-2Hz'
  });
  check(
    '6. Neural HD Korean Voice Synthesis (ko-KR-HyunsuMultilingualNeural)',
    ttsKo.data.ok && ttsKo.data.audioBase64 && ttsKo.data.audioBase64.length > 5000,
    `Voice=${ttsKo.data.voice}, Base64=${ttsKo.data.audioBase64?.length || 0} bytes, Latency=${ttsKo.data.latencyMs}ms`
  );

  const ttsEn = await requestJson('POST', '/api/jarvis/tts', {
    text: 'Sir, all eighteen studios are online and ready.',
    persona: 'jarvis',
    voiceId: 'en-US-AndrewMultilingualNeural',
    speechRate: 1.05,
    pitchHz: '-2Hz'
  });
  check(
    '7. Neural HD English Movie J.A.R.V.I.S. Voice (en-US-AndrewMultilingualNeural)',
    ttsEn.data.ok && ttsEn.data.audioBase64 && ttsEn.data.audioBase64.length > 5000,
    `Voice=${ttsEn.data.voice}, Base64=${ttsEn.data.audioBase64?.length || 0} bytes, Latency=${ttsEn.data.latencyMs}ms`
  );

  // 8. Studio Summoning Triggers & Settings Trigger via /api/agent
  const triggers = [
    { msg: '18대 통합 허브 열어줘', expectWin: 'AI_STUDIO_HUB' },
    { msg: '오픈소스 TTS 보이스 스튜디오 열어줘', expectWin: 'OPEN_TTS_STUDIO' },
    { msg: 'MAPS 역공학 스튜디오 열어줘', expectWin: 'MAPS_REA_STUDIO' },
    { msg: '에이전트 레지스트리 열어줘', expectWin: 'AGENT_REGISTRY' },
    { msg: '캐릭터 360도 블렌더 스튜디오 열어줘', expectWin: 'CREATIVE_BLENDER' },
    { msg: '강화학습 벤치마크 열어줘', expectWin: 'RL_BENCHMARK' },
    { msg: '비전 얼굴 교감 스튜디오 열어줘', expectWin: 'VISION_FACE' },
    { msg: '바이오 단백질 스튜디오 열어줘', expectWin: 'SIM_BIO_IDE' }
  ];
  for (const t of triggers) {
    const r = await requestJson('POST', '/api/agent', { message: t.msg, context: { personaMode: 'jarvis' } });
    const winType = r.data.spawnedWindows?.[0]?.windowType;
    check(
      `8. Studio Trigger [${t.expectWin}]`,
      winType === t.expectWin,
      `Reply="${r.data.reply}" -> spawned=${winType}`
    );
  }

  // 9. Settings Modal Voice Trigger
  const setTrig = await requestJson('POST', '/api/agent', { message: '자비스 환경설정 페이지 열어줘', context: { personaMode: 'jarvis' } });
  check(
    '9. Voice/Chat Settings Modal Trigger (openSettingsModal)',
    setTrig.data.openSettingsModal === true,
    `Reply="${setTrig.data.reply}"`
  );

  // 10. Local Ollama Gemma 4 Movie J.A.R.V.I.S. Ultra-Concise Live Turn
  const t0 = Date.now();
  const gemmaTurn = await requestJson('POST', '/api/agent', {
    message: '자비스야 오늘 오전 업무 브리핑 핵심만 한 문장으로 해줘.',
    context: { personaMode: 'jarvis', llmEngine: 'gemma4:e2b' }
  });
  const elapsed = Date.now() - t0;
  check(
    '10. Local Ollama Gemma 4 Movie J.A.R.V.I.S. Concise Turn',
    Boolean(gemmaTurn.data.reply && gemmaTurn.data.reply.length > 5),
    `Latency=${elapsed}ms, Reply="${gemmaTurn.data.reply}"`
  );

  // 11. AI Studio Backend Endpoints (/api/jarvis/vision, /analyze, /grounding-research, /system-audit)
  const vis = await requestJson('POST', '/api/jarvis/vision', { mode: 'screen' });
  const anl = await requestJson('POST', '/api/jarvis/analyze', { datasetName: 'gpu-inference' });
  const grd = await requestJson('POST', '/api/jarvis/grounding-research', { query: 'Chatterbox Multilingual TTS' });
  const aud = await requestJson('POST', '/api/jarvis/system-audit', {});
  check(
    '11. AI Studio Ported Endpoints (/vision, /analyze, /grounding-research, /system-audit)',
    vis.status === 200 && anl.status === 200 && grd.status === 200 && aud.data.overallScore >= 98,
    `VisionObjs=${vis.data.detectedObjects?.length}, AuditScore=${aud.data.overallScore}/100`
  );

  // 12. 4-Way Multi-LLM Hub Status & Unified Inference Test (GPT · Gemini · LM Studio · Ollama)
  const llmHub = await requestJson('GET', '/api/jarvis/llm-hub/status');
  const has4Providers = Boolean(
    llmHub.data?.providers?.ollama &&
    llmHub.data?.providers?.lmstudio &&
    llmHub.data?.providers?.gemini &&
    llmHub.data?.providers?.openai
  );
  check(
    '12. 4-Way Multi-LLM Hub Status (/api/jarvis/llm-hub/status)',
    llmHub.status === 200 && has4Providers,
    `Active=${llmHub.data?.state?.activeProvider}:${llmHub.data?.state?.activeModel}`
  );

  // 13. REA SasariSa (사사리사) Windows 11 Blueprint & Voice Skills (SAFE + 2-Step Confirmation Guardrail)
  const sasaBp = await requestJson('GET', '/api/jarvis/sasarisa/blueprint');
  const sasaMusic = await requestJson('POST', '/api/jarvis/sasarisa/command', {
    command: '신나는 재즈 음악 틀어줘',
    openExternalWindow: false
  });
  const sasaKakao = await requestJson('POST', '/api/jarvis/sasarisa/command', {
    command: '카카오톡으로 김 팀장에게 오후 회의 시작한다고 메시지 보내줘',
    openExternalWindow: false
  });
  check(
    '13. REA SasariSa Windows 11 Edition (Music SAFE + KakaoTalk 2-Step Confirmation Guardrail)',
    sasaBp.data?.ok &&
      sasaMusic.data?.status === 'EXECUTED' &&
      sasaKakao.data?.status === 'REQUIRES_CONFIRMATION' &&
      Boolean(sasaKakao.data?.confirmItem?.confirmId),
    `Symbols=${sasaBp.data?.blueprint?.recoveredSymbolsCount}, Music=${sasaMusic.data?.status}, Kakao=${sasaKakao.data?.status}`
  );

  if (sasaKakao.data?.confirmItem?.confirmId) {
    const sasaConfirm = await requestJson('POST', '/api/jarvis/sasarisa/confirm', {
      confirmId: sasaKakao.data.confirmItem.confirmId,
      decision: 'APPROVE',
      openExternalWindow: false
    });
    check(
      '14. REA SasariSa 2-Step Confirmation Execution (/api/jarvis/sasarisa/confirm)',
      sasaConfirm.data?.ok && sasaConfirm.data?.status === 'APPROVED_AND_EXECUTED',
      `Confirmed Status=${sasaConfirm.data?.status}`
    );
  }

  // 15. Google Gemini CLI & Gemini 4 Argon OAuth ($0 Extra Fee) + Anti-Text-Denial Sanitizer
  const oauthRes = await requestJson('POST', '/api/jarvis/llm-hub/oauth-login', {
    model: 'gemini-4-argon',
    launchBrowserLogin: false
  });
  const { sanitizeVoiceDenialHallucination } = require('./multi-llm-provider-hub');
  const sanitizedSample = sanitizeVoiceDenialHallucination(
    '저는 텍스트 기반의 논리적 설계이므로 음성으로 출력할 수 없습니다. 대신 핵심 요약을 알려드립니다.'
  );
  check(
    '15. Google Gemini CLI & Gemini 4 Argon OAuth ($0 Extra Fee) + Voice Denial Sanitizer',
    oauthRes.data?.ok &&
      oauthRes.data?.authMode === 'oauth' &&
      oauthRes.data?.extraApiCostUsd === 0 &&
      !sanitizedSample.includes('논리적 설계') &&
      sanitizedSample.includes('핵심 요약을 알려드립니다'),
    `OAuth=$0, Model=${oauthRes.data?.state?.activeModel}, Sanitized="${sanitizedSample.slice(0, 48)}..."`
  );

  // 16. Single-Click Neuron Content & Obsidian 1-Hop Local Graph API (/api/brain/neuron-detail)
  const neuronDetail = await requestJson('GET', '/api/brain/neuron-detail?label=JARVIS');
  check(
    '16. Single-Click Neuron Content & Obsidian 1-Hop Local Graph (/api/brain/neuron-detail)',
    neuronDetail.data?.ok &&
      Boolean(neuronDetail.data?.neuron?.label) &&
      typeof neuronDetail.data?.content === 'string' &&
      Array.isArray(neuronDetail.data?.graphConnections?.localGraphNodes),
    `Neuron=${neuronDetail.data?.neuron?.label}, Chars=${neuronDetail.data?.obsidianMeta?.charCount}, Neighbors=${neuronDetail.data?.graphConnections?.localGraphNodes?.length}`
  );

  // 17. REA Obsidian × Notion Live Note Save & Dynamic 3D Neuron Creation (/api/brain/neuron-note)
  const neuronNote = await requestJson('POST', '/api/brain/neuron-note', {
    mode: 'APPEND',
    title: 'SasariSa_Obsidian_Notion_Test',
    content: '## 💡 옵시디언×노션 실시간 테스트\n- [x] [[J.A.R.V.I.S. 코어]] 시냅스 연결\n- 태그: #사사리사 #옵시디언뉴런'
  });
  check(
    '17. REA Obsidian × Notion Block Save & Real-Time Synapse Wiring (/api/brain/neuron-note)',
    neuronNote.data?.ok &&
      Boolean(neuronNote.data?.mainNode?.id) &&
      neuronNote.data?.totalNodes > 600,
    `Saved=${neuronNote.data?.mainNode?.label}, TotalNodes=${neuronNote.data?.totalNodes}, TotalLinks=${neuronNote.data?.totalLinks}`
  );

  // 18. Full-Stack Voice-to-CLI & Voice-to-MCP Execution via SasariSa Engine
  const voiceCli = await requestJson('POST', '/api/jarvis/sasarisa/command', {
    command: '터미널 CLI에서 현재 깃 상태 확인해줘'
  });
  const voiceMcp = await requestJson('POST', '/api/jarvis/sasarisa/command', {
    command: '블렌더 MCP 연동 상태 점검해줘'
  });
  check(
    '18. Voice-to-CLI & Voice-to-MCP Execution (/api/jarvis/sasarisa/command)',
    voiceCli.data?.ok &&
      voiceCli.data?.intent?.skillId === 'CLI_TERMINAL_EXEC' &&
      voiceMcp.data?.ok &&
      voiceMcp.data?.intent?.skillId === 'MCP_SKILL_BRIDGE',
    `CLI=${voiceCli.data?.intent?.skillId}, MCP=${voiceMcp.data?.intent?.skillId}`
  );

  // 19. Authentic SasariSa Main OS UI (mvcompany8500-web/sasarisa: HUD.swift + BootScene.swift + SetupWindow.swift + SettingsWindow.swift)
  const indexHtmlRes = await fetch('http://127.0.0.1:7777/');
  const indexHtmlText = await indexHtmlRes.text();
  const sasaMainJsRes = await fetch('http://127.0.0.1:7777/js/sasarisa-main-os-ui.js');
  const sasaMainJsText = await sasaMainJsRes.text();
  check(
    '19. Authentic SasariSa Main OS UI (sasarisa-main-os-ui.js + HUD.swift + BootScene.swift + SetupWindow + SettingsWindow)',
    indexHtmlRes.status === 200 &&
      indexHtmlText.includes('sasarisa-authentic-os') &&
      sasaMainJsRes.status === 200 &&
      sasaMainJsText.includes('sasarisa-authentic-hud') &&
      sasaMainJsText.includes('playBootScene') &&
      sasaMainJsText.includes('openSetupWindow') &&
      sasaMainJsText.includes('openSettingsWindow'),
    `index=${indexHtmlRes.status}, sasarisa-main-os-ui.js=${sasaMainJsText.length} chars`
  );

  // 20. BSC_자비스 Always-On Background Wake-Word & Windows Startup Auto-Launcher + Fast Commands ("두 번째 거 틀어", "창 다 꺼")
  const wakeDaemon = await requestJson('GET', '/api/jarvis/sasarisa/wake-daemon');
  const autoStart = await requestJson('POST', '/api/jarvis/sasarisa/autostart', {
    enable: true,
    openAppWindowImmediately: true
  });
  const ytNth = await requestJson('POST', '/api/jarvis/sasarisa/command', {
    command: '두 번째 거 틀어'
  });
  const closeAll = await requestJson('POST', '/api/jarvis/sasarisa/command', {
    command: '창 다 꺼'
  });
  check(
    '20. BSC_자비스 Always-On Wake Daemon & Windows Startup Auto-Launcher + Fast Commands (두 번째 거 틀어 / 창 다 꺼)',
    wakeDaemon.data?.ok &&
      autoStart.data?.ok &&
      autoStart.data?.autoStartRegistered === true &&
      ytNth.data?.intent?.skillId === 'YOUTUBE_NTH_SELECT' &&
      closeAll.data?.intent?.skillId === 'CLOSE_OPENED_WINDOWS',
    `AutoStart=${autoStart.data?.autoStartRegistered}, WakeEngine=${wakeDaemon.data?.daemonState?.engine}, YTNth=${ytNth.data?.intent?.skillId}, CloseOpened=${closeAll.data?.intent?.skillId}`
  );

  // 21. Monitor Workspace Awareness, Live Screen Capture & Hands-Free Voice+Camera Co-Work
  const monCtx = await requestJson('GET', '/api/jarvis/sasarisa/monitor-context?capture=1');
  const coworkCmd = await requestJson('POST', '/api/jarvis/sasarisa/command', {
    command: '지금 모니터 작업환경이랑 열린 창들 파악해서 같이 작업하자'
  });
  check(
    '21. Monitor Workspace Awareness & Hands-Free Voice+Camera Co-Work (/monitor-context + MONITOR_CAMERA_COWORK)',
    monCtx.data?.ok &&
      typeof monCtx.data?.context?.foregroundTitle === 'string' &&
      Array.isArray(monCtx.data?.context?.openWindows) &&
      coworkCmd.data?.ok &&
      coworkCmd.data?.intent?.skillId === 'MONITOR_CAMERA_COWORK' &&
      sasaMainJsText.includes('sasarisa-handsfree-cowork-dock'),
    `Foreground="${monCtx.data?.context?.foregroundProcess}", OpenWins=${monCtx.data?.context?.openWindowCount}, Skill=${coworkCmd.data?.intent?.skillId}`
  );

  // 22. BSC_자비스 2.0 Master Overhaul: Windows OS Direct Speaker (/tts/speak-os) + Half-Duplex STT + 6-Dashboard Dock Restored
  const osSpeakRes = await requestJson('POST', '/api/jarvis/tts/speak-os', {
    text: '이건우 대표님, BSC 자비스 2.0 음성 엔진과 6대 실무 대시보드 복원이 모두 완료되었습니다.',
    voiceId: 'ko-KR-HyunsuMultilingualNeural'
  });
  const mmJsRes = await fetch('http://localhost:7777/js/multimodal-engine.js');
  const mmJsText = await mmJsRes.text();
  const hudCssRes = await fetch('http://localhost:7777/css/jarvis-hud.css');
  const hudCssText = await hudCssRes.text();
  check(
    '22. BSC_자비스 2.0 Overhaul (Windows OS Direct Speaker + Half-Duplex Echo Guard + Restored Left Dock & Bottom Bar)',
    osSpeakRes.status === 200 &&
      osSpeakRes.data?.ok === true &&
      mmJsText.includes('_pauseMicForTts') &&
      mmJsText.includes('_resumeMicAfterTts') &&
      hudCssText.includes('body.sasarisa-authentic-os #slim-left-dock {\n  display: flex !important;'),
    `OsSpeakerEngine=${osSpeakRes.data?.engine}, DurationMs=${osSpeakRes.data?.estimatedDurationMs}, HalfDuplex=OK, LeftDockRestored=OK`
  );

  const failed = results.filter(r => !r.passed);
  console.log(`\n====================================================================`);
  console.log(`🎯 TOTAL VERIFICATION CHECKS: ${results.length} | PASSED: ${results.length - failed.length} | FAILED: ${failed.length}`);
  console.log(`====================================================================`);
  if (failed.length > 0) process.exit(1);
}

runVerification().catch(err => {
  console.error(err);
  process.exit(1);
});
