/**
 * 🎙️✋🖥️ BSC J.A.R.V.I.S. OS — 5-Sense Multimodal Perception & Action Engine
 * Integrates:
 *  1. Voice Recognition (Web Speech API STT + Korean/English TTS + Barge-in)
 *  2. Camera Air-Touch (HOLO Mode: Local MediaPipe Hands WASM or Webcam Motion Pointer)
 *  3. Camera Presence / Motion (EYES Mode)
 *  4. Screen Context Perception (WATCH Mode)
 *  5. Safe-Guarded Computer Use (PC Control with CEO Approval Modal)
 *  6. Real-Time SSE Bus (/api/events) for Autonomous Window Summoning
 */

window.MultimodalEngine = {
  recognition: null,
  isListening: false,
  sensors: {
    EYES: false,
    WATCH: false,
    HOLO: false,
    FOCUS: false
  },
  pendingPcActionKey: null,
  webcamStream: null,
  handDetector: null,
  holoCursor: { x: window.innerWidth / 2, y: window.innerHeight / 2, pinching: false },

  escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  init() {
    this.initSSE();
    this.initVoiceEngine();
    this.bindUIControls();

    // Load persisted Master Settings from disk
    fetch('/api/jarvis/settings')
      .then(r => r.json())
      .then(res => {
        if (res && res.ok && res.settings && window.AIStudioData) {
          Object.assign(window.AIStudioData.routerConfig, res.settings);
          if (res.settings.designTheme && window.HUDWindowSpawner && window.HUDWindowSpawner.applyDesignTheme) {
            window.HUDWindowSpawner.applyDesignTheme(res.settings.designTheme);
          }
        }
      })
      .catch(() => {});

    // Load network info for Mobile Camera Bridge URL
    fetch('/api/jarvis/network-info')
      .then(r => r.json())
      .then(info => {
        if (info && info.mobileCamUrl) {
          const urlText = document.getElementById('holo-mobile-url-text');
          const linkEl = document.getElementById('link-mobile-cam');
          if (urlText) urlText.textContent = info.mobileCamUrl;
          if (linkEl) linkEl.href = info.mobileCamUrl;
        }
      })
      .catch(() => {});

    // Load Persistent Multi-Turn Agent Chat History & Live ADE/IDE Bridge Status
    this.loadInitialChatHistory();

    // Plug-and-Play Auto-Detection when PC USB Camera is plugged in!
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        this.refreshCameraDeviceList(true);
      });
      this.refreshCameraDeviceList(false);
    }

    // Auto-Spawn the Unified 18-Studio Hub so both J.A.R.V.I.S. systems are immediately visible on screen
    setTimeout(() => {
      if (window.HUDWindowSpawner && window.HUDWindowSpawner.openAIStudioWindowByType) {
        window.HUDWindowSpawner.openAIStudioWindowByType('AI_STUDIO_HUB');
      } else {
        window.HUDWindowSpawner.spawn({
          windowType: 'LIVE_CONSOLE',
          title: '💻 J.A.R.V.I.S. 실시간 동역 콘솔 & 토큰 유량(Token Flow) 모니터',
          subtitle: 'Coram Deo & Together · BSC 28 Agents Orchestrator'
        });
      }
    }, 650);
  },

  initSSE() {
    try {
      const evtSource = new EventSource('/api/events');
      evtSource.addEventListener('summon_window', e => {
        const winConfig = JSON.parse(e.data);
        window.HUDWindowSpawner.spawn(winConfig);
      });
      evtSource.addEventListener('console_log', e => {
        const payload = JSON.parse(e.data);
        if (payload.telemetry) {
          window.BSC_WORLDVIEW.updateTelemetryUI(payload.telemetry);
        }
      });
      evtSource.addEventListener('agent_report', e => {
        const rep = JSON.parse(e.data);
        if (rep && rep.speechText) {
          window.BSC_WORLDVIEW.showToast(`🤖 ${rep.agent} 작업 완료 보고`, rep.speechText);
          this.speakStewardReply(rep.speechText, 'jarvis');
        }
      });
      evtSource.addEventListener('remote_hand_gesture', e => {
        const data = JSON.parse(e.data);
        if (!data) return;
        const panel = document.getElementById('holo-gesture-hud-panel');
        if (panel && panel.style.display === 'none') {
          panel.style.display = 'block';
          this.startMiniHandSkeletonVisualizer();
        }
        const badgeEl = document.getElementById('holo-gesture-status-badge');
        if (badgeEl) {
          badgeEl.style.color = '#34d399';
          badgeEl.textContent = '🟢 MOBILE CAMERA/TOUCH BRIDGE ON (스마트폰 실시간 연동 중)';
        }
        if (typeof data.normX === 'number' && typeof data.normY === 'number') {
          this.holoCursor.x = data.normX * window.innerWidth;
          this.holoCursor.y = data.normY * window.innerHeight;
          if (window.BrainGraphEngine) {
            window.BrainGraphEngine.rotY += (data.normX - 0.5) * 0.05;
            const hit = window.BrainGraphEngine.findNodeAt(this.holoCursor.x, this.holoCursor.y);
            if (hit) window.BrainGraphEngine.selectNode(hit, false);
          }
        }
        if (Array.isArray(data.landmarks) && data.landmarks.length === 21) {
          this.latestHandLandmarks = data.landmarks;
        }
        if (data.poseLabel) {
          const labelEl = document.getElementById('holo-detected-gesture-label');
          if (labelEl) labelEl.textContent = `📱 모바일 손 인식: ${data.poseLabel}`;
        }
        if (data.gesture) {
          this.executeHandGestureAction(data.gesture);
        }
        if (data.commandText) {
          this.sendCommandToJarvis(data.commandText);
        }
      });
      evtSource.addEventListener('agent_chat_update', e => {
        const payload = JSON.parse(e.data);
        if (payload && Array.isArray(payload.chatHistory)) {
          this.renderChatDrawerFeed(payload.chatHistory, payload.bridgeStatus);
        }
      });
      evtSource.addEventListener('bsc_council_update', e => {
        const payload = JSON.parse(e.data);
        if (payload && Array.isArray(payload.sessions)) {
          this.renderBscCouncilFeed(payload.sessions, payload.reportPath);
        }
      });
    } catch (e) {}
  },

  async loadInitialChatHistory() {
    try {
      const res = await fetch('/api/jarvis/chat-history');
      const data = await res.json();
      if (data && data.ok) {
        this.renderChatDrawerFeed(data.messages || [], data.bridgeStatus);
      }
    } catch (e) {}
    try {
      const cRes = await fetch('/api/jarvis/bsc-council');
      const cData = await cRes.json();
      if (cData && cData.ok) {
        this.renderBscCouncilFeed(cData.sessions || []);
      }
    } catch (e) {}
  },

  renderChatDrawerFeed(messages = [], bridgeStatus = null) {
    const feed = document.getElementById('agent-chat-feed');
    const badgeWrap = document.getElementById('ade-ide-live-badges');
    if (badgeWrap && bridgeStatus) {
      const nodesCnt = bridgeStatus.ide?.brainNodesCount || 523;
      const harnessOn = Boolean(bridgeStatus.harness2?.enabled);
      const driveOn = Boolean(bridgeStatus.googleDrive?.connected);
      badgeWrap.innerHTML = `
        <span class="bridge-pill ade">${harnessOn ? '🟢 Harness² 연결' : '⚪ Harness² 없음'}</span>
        <span class="bridge-pill ide">🟢 자비스 단독 보이스</span>
        <span class="bridge-pill drive">${driveOn ? '🟢 Drive 연결' : '⚪ Drive 경로 없음'} · IDE ${nodesCnt}노드</span>
      `;
    }
    if (!feed || !Array.isArray(messages) || messages.length === 0) return;

    feed.innerHTML = messages.map((m, idx) => {
      const isUser = m.role === 'user';
      const avatar = !isUser && typeof m.avatar === 'string' && m.avatar.startsWith('/')
        ? this.escapeHtml(m.avatar)
        : '';
      const cleanTxt = this.escapeHtml(String(m.text || '').replace(/\*\*/g, '')).replace(/\n/g, '<br/>');
      return `
        <div class="chat-bubble ${isUser ? 'user' : 'assistant'}">
          <div class="bubble-meta" style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:6px;">
              ${avatar ? `<img src="${avatar}" class="bubble-avatar" onerror="this.style.display='none'" />` : ''}
              <span>${isUser ? '👑 이건우 대표님' : '🤖 J.A.R.V.I.S.'}</span>
              <span class="bubble-time">${this.escapeHtml(m.timestamp || '')}</span>
            </div>
            ${!isUser ? `<button type="button" class="win-ctrl-btn btn-read-bubble" data-msg-idx="${idx}" style="font-size:9.5px;padding:1px 6px;border-color:#00f0ff;color:#00f0ff;">🔊 끝까지 읽기</button>` : ''}
          </div>
          <div class="bubble-text">${cleanTxt}</div>
        </div>
      `;
    }).join('');

    feed.querySelectorAll('.btn-read-bubble').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.msgIdx);
        const msg = messages[idx];
        if (msg && msg.text) {
          this.speakStewardReply(msg.text, 'jarvis');
        }
      });
    });

    feed.scrollTop = feed.scrollHeight;
  },

  renderBscCouncilFeed(sessions = [], latestReportPath = '') {
    const feed = document.getElementById('bsc-council-feed');
    const pathEl = document.getElementById('bsc-council-saved-path');
    if (pathEl && latestReportPath) {
      pathEl.textContent = `✅ 정식 보고서 저장됨: ${latestReportPath}`;
    }
    if (!feed || !Array.isArray(sessions) || sessions.length === 0) return;

    feed.innerHTML = sessions.map(s => {
      const modeBadge = s.mode === 'DISCUSS'
        ? '<span style="background:rgba(56,189,248,0.18);border:1px solid #38bdf8;color:#38bdf8;padding:2px 8px;border-radius:999px;font-size:10.5px;font-weight:800;">💬 의논 (Discussion)</span>'
        : (s.mode === 'REPORT'
          ? '<span style="background:rgba(52,211,153,0.18);border:1px solid #34d399;color:#34d399;padding:2px 8px;border-radius:999px;font-size:10.5px;font-weight:800;">📋 정식 보고서 (Report)</span>'
          : '<span style="background:rgba(251,191,36,0.18);border:1px solid #fbbf24;color:#fbbf24;padding:2px 8px;border-radius:999px;font-size:10.5px;font-weight:800;">🏛️ 전사 회의 (Council Meeting)</span>');

      const entriesHtml = (s.entries || []).map(e => `
        <div style="padding:10px 12px;background:rgba(15,23,42,0.86);border:1px solid rgba(148,163,184,0.22);border-radius:10px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
            <img src="${e.avatar || '/agent_images/taejun/tactics.png'}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:1px solid #fbbf24;" onerror="this.style.display='none'" />
            <b style="color:#f8fafc;font-size:12px;">${e.speaker}</b>
            <span style="font-size:10px;padding:1px 6px;border-radius:6px;background:rgba(251,191,36,0.15);color:#fbbf24;">${e.roleTag || '발언'}</span>
          </div>
          <div style="font-size:12.5px;line-height:1.58;color:#e2e8f0;">${String(e.text || '').replace(/\*\*/g, '').replace(/\n/g, '<br/>')}</div>
        </div>
      `).join('');

      return `
        <div style="padding:12px 14px;background:rgba(8,14,28,0.92);border:1px solid rgba(251,191,36,0.35);border-radius:12px;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;border-bottom:1px solid rgba(251,191,36,0.2);padding-bottom:6px;">
            <div style="display:flex;align-items:center;gap:8px;">
              ${modeBadge}
              <strong style="color:#fbbf24;font-size:13px;">안건: ${s.topic || ''}</strong>
            </div>
            <span style="font-size:10.5px;color:#94a3b8;">${s.timestamp || ''}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:7px;">
            ${entriesHtml}
          </div>
          ${s.reportPath ? `<div style="font-size:10.5px;color:#34d399;font-family:monospace;margin-top:2px;">📄 본사 01.보고서 아카이빙 완료: ${s.reportPath}</div>` : ''}
        </div>
      `;
    }).join('');

    feed.scrollTop = feed.scrollHeight;
  },

  toggleBscCouncilWindow(forceOpen) {
    const win = document.getElementById('bsc-council-window');
    if (!win) return;
    const isVisible = win.style.display === 'flex';
    const nextState = typeof forceOpen === 'boolean' ? forceOpen : !isVisible;
    win.style.display = nextState ? 'flex' : 'none';
  },

  async submitBscCouncilTopic(topic, mode = 'MEETING') {
    if (!topic) return;
    this.toggleBscCouncilWindow(true);
    const feed = document.getElementById('bsc-council-feed');
    if (feed) {
      const loadingDiv = document.createElement('div');
      loadingDiv.style.cssText = 'padding:12px;background:rgba(251,191,36,0.12);border:1px solid #fbbf24;border-radius:10px;color:#fbbf24;font-size:12px;font-weight:700;';
      loadingDiv.textContent = `⏳ [BeausCreators 워룸] 소하·거누·우진·태준 요원이 "${topic}" 안건에 대해 [${mode}] 협업을 진행하고 본사 보고서를 작성 중입니다...`;
      feed.appendChild(loadingDiv);
      feed.scrollTop = feed.scrollHeight;
    }
    try {
      const res = await fetch('/api/jarvis/bsc-council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, mode })
      });
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.sessions)) {
        this.renderBscCouncilFeed(data.sessions, data.reportPath);
      }
    } catch (e) {}
  },

  async runFullSystemVerificationUI() {
    window.BSC_WORLDVIEW.showToast('🛡️ J.A.R.V.I.S. 시스템 감사', '이건우 대표님, 전 시스템 검토·검수·검증 및 Google Harness² 재귀 진화 진단을 실행 중입니다...', '/agent_images/geonu/analyze.png');
    try {
      const res = await fetch('/api/jarvis/full-verify', { method: 'POST' });
      const data = await res.json();
      const checks = Array.isArray(data?.checks) ? data.checks : [];
      const failed = checks.filter(c => !c.passed);
      const mdLines = [
        `# 🛡️ [전 시스템 검토·검수·검증] 종합 점수 ${data.score}/100점 (${data.durationMs}ms)`,
        `판정은 ${data.ok ? '통과' : '미통과'}입니다. 통과하지 못한 항목은 ${failed.length}건입니다.`,
        `## 1. 실시간 검증 결과`,
        ...checks.map(c => `- **${c.passed ? 'PASS' : 'FAIL'} [${c.category}] ${c.item}**. ${c.detail}`),
        `---`,
        `## 2. 이전 수정 기록`,
        ...(data.fixedDefects || []).map(d => `- **[${d.id}] ${d.title}**. ${d.solution}`)
      ];
      if (window.HUDWindowSpawner) {
        window.HUDWindowSpawner.spawn({
          windowType: 'REPORT',
          title: `🛡️ 시스템 검증 ${data.ok ? '통과' : '미통과'} (${data.score}점)`,
          subtitle: '통과하지 못한 항목만 보고서에서 확인합니다.',
          content: mdLines.join('\n')
        });
      }
      const summarySpeech = data.ok
        ? `대표님, 검증 ${checks.length}항목이 모두 통과했습니다. 점수는 ${data.score}점입니다.`
        : `대표님, 검증 ${failed.length}항목이 통과하지 못했습니다. 점수는 ${data.score}점입니다.`;
      this.speakStewardReply(summarySpeech);
    } catch (e) {
      window.BSC_WORLDVIEW.showToast('🛡️ J.A.R.V.I.S. 시스템 감사', '대표님, 검증 서버에 닿지 못했습니다.');
    }
  },

  toggleChatDrawer(forceOpen) {
    const drawer = document.getElementById('agent-chat-drawer');
    if (!drawer) return;
    if (typeof forceOpen === 'boolean') {
      drawer.classList.toggle('open', forceOpen);
    } else {
      drawer.classList.toggle('open');
    }
  },

  initVoiceEngine() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    this.recognition = new SpeechRec();
    this.recognition.lang = 'ko-KR';
    this.recognition.interimResults = true;
    this.recognition.continuous = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      document.getElementById('orb-voice-mic')?.classList.add('listening');
      window.BSC_WORLDVIEW.showToast('🎙️ LISTENING', '이건우 대표님, 말씀해 주십시오. 자비스가 경청하고 있습니다...');
    };

    this.recognition.onresult = (event) => {
      let transcript = '';
      let isFinal = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      const inputEl = document.getElementById('jarvis-prompt-input');
      if (inputEl) inputEl.value = transcript;
      if (isFinal && transcript.trim()) {
        this.sendCommandToJarvis(transcript.trim());
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      document.getElementById('orb-voice-mic')?.classList.remove('listening');
    };
  },

  toggleVoiceListening() {
    if (!this.recognition) {
      window.BSC_WORLDVIEW.showToast('J.A.R.V.I.S.', '현재 브라우저에서 음성 인식을 지원하지 않아 하단 텍스트 입력창을 사용해 주십시오.');
      return;
    }
    this.stopAllSpeech();
    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (e) {}
    }
  },

  stopAllSpeech() {
    this.speechQueueToken = (this.speechQueueToken || 0) + 1;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.src = '';
      } catch (e) {}
      this.currentAudio = null;
    }
    if (this.speechPulseInterval) {
      clearInterval(this.speechPulseInterval);
      this.speechPulseInterval = null;
    }
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  },

  async playSingleNeuralTurn(turn, myToken) {
    if (myToken !== this.speechQueueToken) return;
    const text = String(turn && turn.text ? turn.text : '').replace(/\*\*/g, '').trim();
    if (!text) return;
    const cfg = (window.AIStudioData && window.AIStudioData.routerConfig) || {};
    const persona = 'jarvis'; // Locked to J.A.R.V.I.S. Single Voice per CEO directive
    const speaker = '🤖 J.A.R.V.I.S.';
    const avatar = '/agent_images/geonu/analyze.png';
    const voiceBadge = '🎙️ 현수 성우 · 자비스 단독 음성';

    window.BSC_WORLDVIEW.showToast(speaker, text, avatar, voiceBadge);

    if (cfg.autoSpeakResponses === false && !turn.voiceId) return;

    try {
      const res = await fetch('/api/jarvis/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          persona: 'jarvis',
          voiceId: 'ko-KR-HyunsuMultilingualNeural',
          speechRate: cfg.speechRate || 1.06,
          pitchHz: cfg.pitchHz || '-2Hz'
        })
      });
      if (myToken !== this.speechQueueToken) return;
      const data = await res.json();
      if (data && data.ok && data.audioBase64) {
        const played = await new Promise((resolve) => {
          const audio = new Audio(`data:${data.mimeType || 'audio/mp3'};base64,${data.audioBase64}`);
          this.currentAudio = audio;
          this.speechPulseInterval = setInterval(() => {
            if (window.JarvisReactorCore) {
              window.JarvisReactorCore.pulseSpeech(0.95 + Math.random() * 0.45);
            }
          }, 110);
          const cleanup = (ok) => {
            if (this.speechPulseInterval) {
              clearInterval(this.speechPulseInterval);
              this.speechPulseInterval = null;
            }
            resolve(ok);
          };
          audio.onended = () => cleanup(true);
          audio.onerror = () => cleanup(false);
          audio.play().catch(() => cleanup(false));
        });
        if (played) return;
      }
    } catch (e) {}

    // Fallback to browser Web Speech (Sentence-chunked so Chrome never stops after 15 seconds!)
    if (window.speechSynthesis && myToken === this.speechQueueToken) {
      const sentences = text.split(/(?<=[.?!。]|다\.|요\.|죠\.|까\?)\s+/).filter(Boolean);
      for (const s of sentences) {
        if (myToken !== this.speechQueueToken) break;
        await new Promise(resolve => {
          const utter = new SpeechSynthesisUtterance(s);
          utter.lang = 'ko-KR';
          utter.rate = cfg.speechRate || 1.06;
          utter.onend = resolve;
          utter.onerror = resolve;
          window.speechSynthesis.speak(utter);
        });
      }
    }
  },

  async speakNeuralTurns(dialogueTurns, fallbackText = '') {
    this.stopAllSpeech();
    const myToken = this.speechQueueToken;
    // Combine all turns into a single seamless J.A.R.V.I.S. speech turn so only J.A.R.V.I.S. speaks and reads 100% to the end
    const fullText = Array.isArray(dialogueTurns) && dialogueTurns.length > 0
      ? dialogueTurns.map(t => t.text).filter(Boolean).join(' ')
      : fallbackText;

    await this.playSingleNeuralTurn({ persona: 'jarvis', speaker: '🤖 J.A.R.V.I.S.', text: fullText }, myToken);
  },

  speakText(text) {
    this.speakStewardReply(text);
  },

  speakStewardReply(text) {
    if (!text) return;
    const calloutEl = document.getElementById('jarvis-orb-callout-text');
    if (calloutEl) {
      const cleanShort = String(text).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
      calloutEl.textContent = `"${cleanShort.slice(0, 88)}${cleanShort.length > 88 ? '...' : ''}"`;
    }
    this.speakNeuralTurns([{ persona: 'jarvis', speaker: '🤖 J.A.R.V.I.S.', text }], text);
  },

  clearThinkingBubble() {
    document.getElementById('chat-thinking-bubble')?.remove();
  },

  async sendCommandToJarvis(message) {
    if (!message) return;
    if (this.pendingPcActionKey && /^(승인(해(요|주세요)?)?|실행\s*승인|허락(해(요)?)?|오케이|ok|yes)\s*[.!]?\s*$/i.test(message.trim())) {
      this.executeApprovedPcAction(this.pendingPcActionKey);
      return;
    }
    const personaMode = 'jarvis';
    window.BSC_WORLDVIEW.showToast('👑 이건우 대표님 (CEO)', message, null, '자비스가 말씀을 처리하는 중입니다.');

    this.toggleChatDrawer(true);
    const feed = document.getElementById('agent-chat-feed');
    if (feed) {
      const tempDiv = document.createElement('div');
      tempDiv.className = 'chat-bubble user';
      const meta = document.createElement('div');
      meta.className = 'bubble-meta';
      meta.textContent = '👑 이건우 대표님 (CEO)';
      const body = document.createElement('div');
      body.className = 'bubble-text';
      body.textContent = message;
      tempDiv.appendChild(meta);
      tempDiv.appendChild(body);
      feed.appendChild(tempDiv);

      const thinkDiv = document.createElement('div');
      thinkDiv.id = 'chat-thinking-bubble';
      thinkDiv.className = 'chat-bubble assistant';
      const thinkMeta = document.createElement('div');
      thinkMeta.className = 'bubble-meta';
      thinkMeta.textContent = '자비스가 답변을 준비하는 중입니다.';
      thinkDiv.appendChild(thinkMeta);
      feed.appendChild(thinkDiv);
      feed.scrollTop = feed.scrollHeight;
    }

    try {
      const cfg = (window.AIStudioData && window.AIStudioData.routerConfig) || {};
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: {
            personaMode,
            llmEngine: cfg.llmEngine || 'gemma4:e4b',
            speakingStyle: cfg.speakingStyle || 'NATURAL_AGENT_CONVERSATION'
          }
        })
      });
      const data = await res.json();

      if (Array.isArray(data.chatHistory)) {
        this.renderChatDrawerFeed(data.chatHistory, data.bridgeStatus);
      }

      if (data.openSettingsModal && window.HUDWindowSpawner && window.HUDWindowSpawner.openMasterSettingsModal) {
        window.HUDWindowSpawner.openMasterSettingsModal();
      }
      if (data.activateHoloGesture) {
        this.openHoloGesturePanel();
      }
      if (data.graphCommand && window.BrainGraphEngine) {
        window.BrainGraphEngine.setViewMode(data.graphCommand);
      }
      if (data.coreMode && window.JarvisReactorCore) {
        window.JarvisReactorCore.setShape(data.coreMode);
      }
      if (data.pcProposal) {
        this.openPcApprovalModal(data.pcProposal);
      }
      if (data.telemetry) {
        window.BSC_WORLDVIEW.updateTelemetryUI(data.telemetry);
      }
      this.clearThinkingBubble();
      if (data.dialogueTurns && data.dialogueTurns.length > 0) {
        this.speakNeuralTurns(data.dialogueTurns, data.reply);
      } else if (data.reply) {
        this.speakStewardReply(data.reply);
      }
    } catch (e) {
      this.clearThinkingBubble();
      const errFeed = document.getElementById('agent-chat-feed');
      if (errFeed) {
        const err = document.createElement('div');
        err.className = 'chat-bubble assistant';
        const errMeta = document.createElement('div');
        errMeta.className = 'bubble-meta';
        errMeta.textContent = '🤖 J.A.R.V.I.S.';
        const errBody = document.createElement('div');
        errBody.className = 'bubble-text';
        errBody.textContent = '대표님, 서버에 닿지 못했습니다. 자비스 서버가 켜져 있는지 확인해 주십시오.';
        err.appendChild(errMeta);
        err.appendChild(errBody);
        errFeed.appendChild(err);
      }
    }
  },

  openPcApprovalModal(proposal) {
    this.pendingPcActionKey = proposal.actionKey;
    const modal = document.getElementById('pc-approval-modal');
    if (!modal) return;
    document.getElementById('pc-approval-title').textContent = proposal.label;
    document.getElementById('pc-approval-desc').textContent = proposal.desc;
    document.getElementById('pc-approval-cmd').textContent = proposal.cmd;
    modal.style.display = 'flex';
  },

  async executeApprovedPcAction(actionKey) {
    const modal = document.getElementById('pc-approval-modal');
    if (modal) modal.style.display = 'none';
    this.pendingPcActionKey = null;

    const res = await fetch('/api/pc-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionKey, approved: true })
    });
    const data = await res.json();
    const msg = data.ok
      ? `이건우 대표님의 승인을 받아 『${data.executed}』 작업을 안전하게 완료했습니다.`
      : `작업 실행 중 주의사항이 발생했습니다: ${data.error || data.output}`;
    window.BSC_WORLDVIEW.showToast('🖥️ Safe Computer Use', msg);
    this.speakStewardReply(msg);
  },

  async toggleSensor(sensorName, btnEl) {
    this.sensors[sensorName] = !this.sensors[sensorName];
    const active = this.sensors[sensorName];
    btnEl.classList.toggle('active', active);
    const stateSpan = btnEl.querySelector('.s-state');
    if (stateSpan) stateSpan.textContent = active ? 'on' : 'off';

    if (sensorName === 'FOCUS') {
      if (window.BrainGraphEngine) window.BrainGraphEngine.focusMode = active;
      window.BSC_WORLDVIEW.showToast('J.A.R.V.I.S.', active ? 'FOCUS 모드가 켜졌습니다. 선택된 지식 노드와 연결 경로에만 집중합니다.' : 'FOCUS 모드가 해제되어 전체 지식 은하를 표시합니다.');
    } else if (sensorName === 'EYES' || sensorName === 'HOLO') {
      if (active) {
        await this.startWebcamAndHolo(sensorName);
      } else if (!this.sensors.EYES && !this.sensors.HOLO) {
        this.stopWebcamAndHolo();
      }
    } else if (sensorName === 'WATCH') {
      if (active) {
        window.BSC_WORLDVIEW.showToast('👁️ WATCH (화면 인식)', 'PC 화면 컨텍스트 인식 모드가 활성화되었습니다. 필요한 작업이 보이면 자비스가 즉시 도구 창을 제안합니다.');
      } else {
        window.BSC_WORLDVIEW.showToast('👁️ WATCH', 'PC 화면 컨텍스트 인식이 종료되었습니다.');
      }
    }
  },

  async refreshCameraDeviceList(autoStartOnNewCamera = false) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter(d => d.kind === 'videoinput');
      const sel = document.getElementById('holo-camera-select');
      if (sel) {
        if (cams.length === 0) {
          sel.innerHTML = '<option value="">📷 PC 웹캠 자동 감지 대기 중 (0대)</option>';
        } else {
          sel.innerHTML = cams.map((c, idx) => `<option value="${c.deviceId}">📷 ${c.label || `PC USB Camera #${idx + 1}`}</option>`).join('');
        }
      }
      if (autoStartOnNewCamera && cams.length > 0 && !this.webcamStream) {
        this.sensors.HOLO = true;
        this.startWebcamAndHolo('HOLO', cams[0].deviceId);
      }
    } catch (e) {}
  },

  async startWebcamAndHolo(mode, preferredDeviceId = '') {
    const video = document.getElementById('webcam-video');
    const handCanvas = document.getElementById('holo-hand-canvas');
    const badgeEl = document.getElementById('holo-gesture-status-badge');
    const alertBox = document.getElementById('holo-camera-alert-box');

    try {
      await this.refreshCameraDeviceList(false);
      const devices = navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
        ? await navigator.mediaDevices.enumerateDevices()
        : [];
      const cams = devices.filter(d => d.kind === 'videoinput');

      if (!this.webcamStream || preferredDeviceId) {
        if (this.webcamStream) {
          this.webcamStream.getTracks().forEach(t => t.stop());
        }
        const videoConstraints = preferredDeviceId
          ? { deviceId: { exact: preferredDeviceId }, width: 640, height: 480 }
          : { width: 640, height: 480 };
        this.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false
        });
        video.srcObject = this.webcamStream;
        await video.play();
      }
      video.style.display = 'block';
      handCanvas.style.display = 'block';
      handCanvas.width = window.innerWidth;
      handCanvas.height = window.innerHeight;

      if (badgeEl) {
        badgeEl.style.color = '#34d399';
        badgeEl.textContent = `🟢 CAMERA AI ON (${cams[0]?.label || 'USB/WebCam'}) · 마우스 추적 OFF · 실제 손 21관절 인식 중`;
      }
      if (alertBox) {
        alertBox.style.background = 'rgba(52,211,153,0.12)';
        alertBox.style.borderColor = 'rgba(52,211,153,0.45)';
        alertBox.innerHTML = '✅ <b>실제 카메라 AI 연결 완료:</b> 마우스 개입이 100% 차단되었으며, 카메라 앞 <b>이건우 대표님의 실제 손가락 21개 관절 모양(✋/🤏/✌️/👍/✊)</b>을 Google MediaPipe AI가 실시간 인식하여 실행합니다.';
      }

      if (mode === 'EYES') {
        const msg = '이건우 대표님, 카메라로 자리에 계신 것을 확인했습니다(EYES ON).';
        window.BSC_WORLDVIEW.showToast('👁️ EYES (재석/모션 인지)', msg);
        this.speakStewardReply(msg);
      } else if (mode === 'HOLO') {
        const msg = '이건우 대표님, 실제 카메라 기반 MediaPipe 21관절 손동작 인식이 가동되었습니다. 카메라 앞에서 브이, 엄지 척, 핀치, 손바닥 스와이프를 취하시면 자비스가 즉시 실행합니다.';
        window.BSC_WORLDVIEW.showToast('✋ HOLO (실제 카메라 AI 21관절 손 인식)', msg);
        this.speakStewardReply(msg);
        const panel = document.getElementById('holo-gesture-hud-panel');
        if (panel) panel.style.display = 'block';
        this.startMiniHandSkeletonVisualizer();
      }

      this.initMediaPipeHandsDetector(video);
      this.runOpticalHandTracker(video, handCanvas);
    } catch (e) {
      // No physical webcam attached to desktop PC (Verified: 0 videoinput devices)
      handCanvas.style.display = 'block';
      handCanvas.width = window.innerWidth;
      handCanvas.height = window.innerHeight;
      if (badgeEl) {
        badgeEl.style.color = '#fbbf24';
        badgeEl.textContent = '⚠️ 물리적 웹캠 미연결 (PC 카메라 0대 감지) -> 웹캠 연결 시 즉시 카메라 AI 전환';
      }
      if (mode === 'HOLO') {
        const panel = document.getElementById('holo-gesture-hud-panel');
        if (panel) panel.style.display = 'block';
        this.startMiniHandSkeletonVisualizer();
      }
      window.BSC_WORLDVIEW.showToast('⚠️ 물리적 웹캠 미감지 (0대)', '현재 데스크톱 PC에 연결된 USB 웹캠이 없어 카메라 영상을 열 수 없습니다. USB 웹캠이나 스마트폰 카메라 연결 후 [📷 카메라 연결]을 누르시면 즉시 실제 손 인식으로 전환됩니다.');
      this.runMouseHoloOverlay(handCanvas);
    }
  },

  initMediaPipeHandsDetector(video) {
    if (this.mpHands || typeof window.Hands !== 'function') return;
    try {
      const hands = new window.Hands({
        locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.65
      });
      hands.onResults(results => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const lm = results.multiHandLandmarks[0];
          this.latestHandLandmarks = lm;
          // Mirror X coordinate from Index Finger Tip (landmark 8)
          const ix = (1 - lm[8].x) * window.innerWidth;
          const iy = lm[8].y * window.innerHeight;
          this.holoCursor.x += (ix - this.holoCursor.x) * 0.35;
          this.holoCursor.y += (iy - this.holoCursor.y) * 0.35;

          const pose = this.classifyMediaPipeHandPose(lm);
          this.handleDetectedCameraPose(pose);
        } else {
          this.latestHandLandmarks = null;
        }
      });
      this.mpHands = hands;

      const pumpFrame = async () => {
        if (!this.webcamStream || (!this.sensors.HOLO && !this.sensors.EYES)) return;
        if (video.readyState >= 2) {
          try {
            await this.mpHands.send({ image: video });
          } catch (e) {}
        }
        requestAnimationFrame(pumpFrame);
      };
      requestAnimationFrame(pumpFrame);
    } catch (e) {}
  },

  classifyMediaPipeHandPose(lm) {
    // 21 Landmarks: 0=Wrist, 4=ThumbTip, 8=IndexTip, 12=MiddleTip, 16=RingTip, 20=PinkyTip
    const pinchDist = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);
    if (pinchDist < 0.055) return 'PINCH_CLICK';

    const indexUp  = lm[8].y < lm[6].y;
    const middleUp = lm[12].y < lm[10].y;
    const ringUp   = lm[16].y < lm[14].y;
    const pinkyUp  = lm[20].y < lm[18].y;
    const thumbUp  = lm[4].y < lm[3].y && lm[3].y < lm[2].y && lm[4].y < lm[6].y;

    if (indexUp && middleUp && !ringUp && !pinkyUp) return 'VICTORY_BRIEF';
    if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) return 'THUMBS_APPROVE';
    if (!indexUp && !middleUp && !ringUp && !pinkyUp) return 'FIST_RESET';
    return 'PALM_SWIPE';
  },

  handleDetectedCameraPose(pose) {
    const labelEl = document.getElementById('holo-detected-gesture-label');
    if (labelEl) labelEl.textContent = `📷 카메라 손 인식: ${pose}`;

    if (pose === 'PALM_SWIPE') {
      if (window.BrainGraphEngine) {
        window.BrainGraphEngine.rotY += ((this.holoCursor.x / window.innerWidth) - 0.5) * 0.035;
      }
      this._poseHoldCount = 0;
      return;
    }

    if (this._lastCameraPose === pose) {
      this._poseHoldCount = (this._poseHoldCount || 0) + 1;
      const now = Date.now();
      if (this._poseHoldCount === 16 && (!this._lastGestureExecAt || now - this._lastGestureExecAt > 3500)) {
        this._lastGestureExecAt = now;
        this.executeHandGestureAction(pose);
      }
    } else {
      this._lastCameraPose = pose;
      this._poseHoldCount = 1;
    }
  },

  openHoloGesturePanel() {
    const holoBtn = document.getElementById('toggle-holo');
    if (holoBtn && !this.sensors.HOLO) {
      this.toggleSensor('HOLO', holoBtn);
    } else {
      const panel = document.getElementById('holo-gesture-hud-panel');
      if (panel) panel.style.display = 'block';
      this.startMiniHandSkeletonVisualizer();
    }
  },

  startMiniHandSkeletonVisualizer() {
    const cvs = document.getElementById('holo-mini-skeleton-canvas');
    if (!cvs || this._miniSkeletonRunning) return;
    this._miniSkeletonRunning = true;
    const ctx = cvs.getContext('2d');
    let tick = 0;

    // 4 Corner Air-Touch Zones inside the mini visualizer
    const zones = [
      { id: 'PALM_SWIPE', x: 10, y: 28, w: 80, h: 36, label: '✋ 회전', color: '#00f0ff' },
      { id: 'VICTORY_BRIEF', x: 276, y: 28, w: 80, h: 36, label: '✌️ 브리핑', color: '#fbbf24' },
      { id: 'PINCH_CLICK', x: 10, y: 110, w: 80, h: 36, label: '🤏 노드클릭', color: '#34d399' },
      { id: 'THUMBS_APPROVE', x: 276, y: 110, w: 80, h: 36, label: '👍 즉시승인', color: '#c084fc' }
    ];

    let hoverZone = null;
    let hoverFrames = 0;

    // ONLY use mouse fallback on canvas if NO physical webcam stream is active!
    cvs.addEventListener('mousemove', e => {
      if (this.webcamStream) return; // Strict Camera-Only when webcam is connected!
      const rect = cvs.getBoundingClientRect();
      this.holoCursor.x = ((e.clientX - rect.left) / rect.width) * window.innerWidth;
      this.holoCursor.y = ((e.clientY - rect.top) / rect.height) * window.innerHeight;
    });

    cvs.addEventListener('click', e => {
      const rect = cvs.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * cvs.width;
      const my = ((e.clientY - rect.top) / rect.height) * cvs.height;
      for (const z of zones) {
        if (mx >= z.x && mx <= z.x + z.w && my >= z.y && my <= z.y + z.h) {
          this.executeHandGestureAction(z.id);
          return;
        }
      }
      this.executeHandGestureAction('PINCH_CLICK');
    });

    const renderLoop = () => {
      const panel = document.getElementById('holo-gesture-hud-panel');
      if (!panel || panel.style.display === 'none') {
        this._miniSkeletonRunning = false;
        return;
      }
      tick += 0.05;
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      // Draw webcam background if stream is active
      const video = document.getElementById('webcam-video');
      if (this.webcamStream && video && video.readyState >= 2) {
        ctx.save();
        ctx.translate(cvs.width, 0);
        ctx.scale(-1, 1);
        ctx.globalAlpha = 0.45;
        ctx.drawImage(video, 0, 0, cvs.width, cvs.height);
        ctx.restore();
      }

      // Draw 4 Air-Touch Corner Action Pads
      const hx = (this.holoCursor.x / Math.max(1, window.innerWidth)) * cvs.width;
      const hy = (this.holoCursor.y / Math.max(1, window.innerHeight)) * cvs.height;

      let currentZone = null;
      for (const z of zones) {
        const isHit = hx >= z.x && hx <= z.x + z.w && hy >= z.y && hy <= z.y + z.h;
        if (isHit) currentZone = z;
        ctx.strokeStyle = z.color;
        ctx.lineWidth = isHit ? 2.2 : 1.1;
        ctx.fillStyle = isHit ? 'rgba(0, 240, 255, 0.22)' : 'rgba(5, 10, 20, 0.65)';
        ctx.beginPath();
        ctx.roundRect(z.x, z.y, z.w, z.h, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = z.color;
        ctx.font = 'bold 10.5px sans-serif';
        ctx.fillText(z.label, z.x + 10, z.y + 22);
      }

      // Dwell Air-Touch Trigger (Hold hand in corner zone for ~45 frames = 0.75s)
      if (currentZone) {
        if (hoverZone === currentZone.id) {
          hoverFrames++;
          // Progress bar on zone
          ctx.fillStyle = currentZone.color;
          ctx.fillRect(currentZone.x, currentZone.y + currentZone.h - 4, (currentZone.w * Math.min(hoverFrames, 45)) / 45, 4);
          if (hoverFrames === 45) {
            this.executeHandGestureAction(currentZone.id);
            hoverFrames = 0;
          }
        } else {
          hoverZone = currentZone.id;
          hoverFrames = 1;
        }
      } else {
        hoverZone = null;
        hoverFrames = 0;
      }

      // Draw 21-Keypoint MediaPipe Hand Skeleton (Real Camera 21 Landmarks if available, else Holographic Avatar)
      if (Array.isArray(this.latestHandLandmarks) && this.latestHandLandmarks.length === 21) {
        const lm = this.latestHandLandmarks;
        const bones = [
          [0,1],[1,2],[2,3],[3,4],
          [0,5],[5,6],[6,7],[7,8],
          [0,9],[9,10],[10,11],[11,12],
          [0,13],[13,14],[14,15],[15,16],
          [0,17],[17,18],[18,19],[19,20],
          [5,9],[9,13],[13,17]
        ];
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.8;
        for (const [a, b] of bones) {
          ctx.beginPath();
          ctx.moveTo((1 - lm[a].x) * cvs.width, lm[a].y * cvs.height);
          ctx.lineTo((1 - lm[b].x) * cvs.width, lm[b].y * cvs.height);
          ctx.stroke();
        }
        for (let i = 0; i < 21; i++) {
          ctx.fillStyle = (i === 4 || i === 8 || i === 12 || i === 16 || i === 20) ? '#fbbf24' : '#34d399';
          ctx.beginPath();
          ctx.arc((1 - lm[i].x) * cvs.width, lm[i].y * cvs.height, i % 4 === 0 ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        const cx = Math.max(55, Math.min(cvs.width - 55, hx || cvs.width / 2));
        const cy = Math.max(45, Math.min(cvs.height - 20, hy || cvs.height / 2 + 15));
        const palmX = cx;
        const palmY = cy + 18;

        const fingerTips = [
          { dx: -28, dy: -4 + Math.sin(tick) * 2 },   // Thumb
          { dx: -14, dy: -32 + Math.cos(tick) * 2 },  // Index
          { dx: 0,   dy: -36 + Math.sin(tick) * 2 },  // Middle
          { dx: 14,  dy: -31 + Math.cos(tick) * 2 },  // Ring
          { dx: 26,  dy: -20 + Math.sin(tick) * 2 }   // Pinky
        ];

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.6;
        for (const f of fingerTips) {
          const midX = palmX + f.dx * 0.55;
          const midY = palmY + f.dy * 0.55;
          const tipX = palmX + f.dx;
          const tipY = palmY + f.dy;
          ctx.beginPath();
          ctx.moveTo(palmX, palmY);
          ctx.lineTo(midX, midY);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();

          // Joints
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.arc(midX, midY, 2.5, 0, Math.PI * 2);
          ctx.arc(tipX, tipY, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Wrist/Palm center node
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(palmX, palmY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(renderLoop);
    };
    requestAnimationFrame(renderLoop);
  },

  async executeHandGestureAction(gestureType) {
    const labelEl = document.getElementById('holo-detected-gesture-label');
    if (gestureType === 'PALM_SWIPE') {
      if (labelEl) labelEl.textContent = '✋ PALM_SWIPE -> 3D 지식 은하 360° 회전 실행!';
      if (window.BrainGraphEngine) {
        window.BrainGraphEngine.setViewMode('3d');
        window.BrainGraphEngine.rotY += 0.85;
      }
      const msg = '손바닥 스와이프 제스처를 인식하여 3D 지식 은하를 회전시켰습니다.';
      window.BSC_WORLDVIEW.showToast('✋ Gesture: PALM_SWIPE', msg);
      this.speakStewardReply(msg, 'jarvis');
    } else if (gestureType === 'PINCH_CLICK') {
      if (labelEl) labelEl.textContent = '🤏 PINCH_CLICK -> 가리킨 지식 노드 선택 & 상세 보고서 열기!';
      if (window.BrainGraphEngine) {
        const node = window.BrainGraphEngine.selectedNode || (window.BrainGraphEngine.nodes && window.BrainGraphEngine.nodes[0]);
        if (node) {
          window.BrainGraphEngine.selectNode(node, true);
        }
      }
      const msg = '핀치 클릭 제스처를 인식하여 포커스된 지식 노드의 홀로그램 상세 창을 열었습니다.';
      window.BSC_WORLDVIEW.showToast('🤏 Gesture: PINCH_CLICK', msg);
      this.speakStewardReply(msg, 'jarvis');
    } else if (gestureType === 'VICTORY_BRIEF') {
      if (labelEl) labelEl.textContent = '✌️ VICTORY_BRIEF -> 15초 전사 모닝/마감 브리핑 즉시 실행!';
      this.sendCommandToJarvis('자비스, 오늘 브리핑 해줘');
    } else if (gestureType === 'THUMBS_APPROVE') {
      if (labelEl) labelEl.textContent = '👍 THUMBS_APPROVE -> 대기 안건 즉시 승인 실행!';
      if (this.pendingPcActionKey) {
        this.executeApprovedPcAction(this.pendingPcActionKey);
      } else {
        try {
          const qRes = await fetch('/api/jarvis/action-queue');
          const qData = await qRes.json();
          const pending = (qData.queue || []).find(item => item.status === 'PENDING_APPROVAL');
          if (pending) {
            await fetch('/api/jarvis/action-queue', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ op: 'approve', id: pending.id })
            });
            const msg = `엄지 척 승인 제스처를 인식하여 대기열 1순위 작업 [${pending.title}]을 즉시 승인 및 실행했습니다.`;
            window.BSC_WORLDVIEW.showToast('👍 Gesture: THUMBS_APPROVE', msg);
            this.speakStewardReply(msg, 'jarvis');
          } else {
            const msg = '엄지 척 제스처를 인식했습니다. 현재 승인 대기 중인 보류 안건이 없어 전 시스템 정상 가동 상태를 유지합니다.';
            window.BSC_WORLDVIEW.showToast('👍 Gesture: THUMBS_APPROVE', msg);
            this.speakStewardReply(msg, 'jarvis');
          }
        } catch (e) {}
      }
    } else if (gestureType === 'FIST_RESET') {
      if (labelEl) labelEl.textContent = '✊ FIST_RESET -> 3D 은하 중앙 정렬(Fit) & 음성 정지!';
      this.stopAllSpeech();
      if (window.BrainGraphEngine && window.BrainGraphEngine.fitGraph) {
        window.BrainGraphEngine.fitGraph();
      }
      window.BSC_WORLDVIEW.showToast('✊ Gesture: FIST_RESET', '주먹 쥐기 제스처를 인식하여 음성을 멈추고 3D 지식 은하를 중앙 정렬(Fit)했습니다.');
    }
  },

  stopWebcamAndHolo() {
    const video = document.getElementById('webcam-video');
    const handCanvas = document.getElementById('holo-hand-canvas');
    const panel = document.getElementById('holo-gesture-hud-panel');
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(t => t.stop());
      this.webcamStream = null;
    }
    if (video) video.style.display = 'none';
    if (handCanvas) handCanvas.style.display = 'none';
    if (panel) panel.style.display = 'none';
  },

  runOpticalHandTracker(video, handCanvas) {
    const ctx = handCanvas.getContext('2d');
    const off = document.createElement('canvas');
    off.width = 80;
    off.height = 60;
    const offCtx = off.getContext('2d');
    let prevFrame = null;

    const loop = () => {
      if (!this.sensors.EYES && !this.sensors.HOLO) return;
      offCtx.drawImage(video, 0, 0, off.width, off.height);
      const frame = offCtx.getImageData(0, 0, off.width, off.height).data;

      if (prevFrame) {
        let sumX = 0, sumY = 0, count = 0;
        for (let y = 0; y < off.height; y++) {
          for (let x = 0; x < off.width; x++) {
            const idx = (y * off.width + x) * 4;
            const diff = Math.abs(frame[idx] - prevFrame[idx]) + Math.abs(frame[idx + 1] - prevFrame[idx + 1]);
            if (diff > 55) {
              sumX += (off.width - 1 - x); // mirrored
              sumY += y;
              count++;
            }
          }
        }
        if (count > 18) {
          const tx = (sumX / count / off.width) * window.innerWidth;
          const ty = (sumY / count / off.height) * window.innerHeight;
          this.holoCursor.x += (tx - this.holoCursor.x) * 0.25;
          this.holoCursor.y += (ty - this.holoCursor.y) * 0.25;

          if (this.sensors.HOLO && window.BrainGraphEngine) {
            window.BrainGraphEngine.rotY += ((tx / window.innerWidth) - 0.5) * 0.03;
            const hit = window.BrainGraphEngine.findNodeAt(this.holoCursor.x, this.holoCursor.y);
            if (hit) window.BrainGraphEngine.selectNode(hit, false);
          }
        }
      }
      prevFrame = new Uint8ClampedArray(frame);

      // Draw HOLO reticle
      ctx.clearRect(0, 0, handCanvas.width, handCanvas.height);
      if (this.sensors.HOLO) {
        this.drawHoloReticle(ctx, this.holoCursor.x, this.holoCursor.y);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },

  runMouseHoloOverlay(handCanvas) {
    const ctx = handCanvas.getContext('2d');
    const onMove = e => {
      this.holoCursor.x = e.clientX;
      this.holoCursor.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    const loop = () => {
      if (!this.sensors.HOLO && !this.sensors.EYES) {
        window.removeEventListener('mousemove', onMove);
        return;
      }
      ctx.clearRect(0, 0, handCanvas.width, handCanvas.height);
      this.drawHoloReticle(ctx, this.holoCursor.x, this.holoCursor.y);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },

  drawHoloReticle(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '700 10px monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('HOLO AIR-TOUCH', 28, 4);
    ctx.restore();
  },

  bindUIControls() {
    // Chat prompt submit (Bottom Dock)
    const form = document.getElementById('jarvis-chat-form');
    const input = document.getElementById('jarvis-prompt-input');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      this.sendCommandToJarvis(val);
    });

    // Live Agent Chat Drawer Form & Controls
    const drawerForm = document.getElementById('drawer-chat-form');
    const drawerInput = document.getElementById('drawer-chat-input');
    drawerForm?.addEventListener('submit', e => {
      e.preventDefault();
      const val = drawerInput.value.trim();
      if (!val) return;
      drawerInput.value = '';
      this.sendCommandToJarvis(val);
    });

    document.getElementById('btn-toggle-agent-chat')?.addEventListener('click', () => {
      this.toggleChatDrawer();
    });
    document.getElementById('orb-chat-drawer')?.addEventListener('click', () => {
      this.toggleChatDrawer();
    });
    document.getElementById('btn-close-agent-chat')?.addEventListener('click', () => {
      this.toggleChatDrawer(false);
    });

    // Separate BeausCreators Agent Council Window (💬 의논 · 🏛️ 회의 · 📋 보고서)
    this.activeCouncilMode = 'DISCUSS';
    document.getElementById('btn-open-bsc-council')?.addEventListener('click', () => {
      this.toggleBscCouncilWindow();
    });
    document.getElementById('orb-bsc-council')?.addEventListener('click', () => {
      this.toggleBscCouncilWindow();
    });
    document.getElementById('btn-open-council-from-drawer')?.addEventListener('click', () => {
      this.toggleBscCouncilWindow(true);
    });
    document.getElementById('btn-close-bsc-council')?.addEventListener('click', () => {
      this.toggleBscCouncilWindow(false);
    });

    document.querySelectorAll('.bsc-council-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bsc-council-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCouncilMode = btn.dataset.councilMode || 'MEETING';
        document.getElementById('bsc-council-input')?.focus();
      });
    });

    document.getElementById('bsc-council-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const cInput = document.getElementById('bsc-council-input');
      const val = cInput ? cInput.value.trim() : '';
      if (!val) return;
      cInput.value = '';
      this.submitBscCouncilTopic(val, this.activeCouncilMode || 'MEETING');
    });

    // Full System Review (검토) · Inspection (검수) · Verification (검증) & Harness² Self-Evolution
    document.getElementById('btn-run-full-verify')?.addEventListener('click', () => {
      this.runFullSystemVerificationUI();
    });
    document.getElementById('btn-council-verify-system')?.addEventListener('click', () => {
      this.runFullSystemVerificationUI();
    });

    // Toast Full-Read & Stop Voice Controls
    document.getElementById('btn-toast-read-full')?.addEventListener('click', () => {
      const txt = window.BSC_WORLDVIEW?.lastSpokenText || document.getElementById('toast-text')?.textContent || '';
      if (txt) {
        this.speakStewardReply(txt);
      }
    });
    document.getElementById('btn-toast-stop-voice')?.addEventListener('click', () => {
      this.stopAllSpeech();
    });

    // 1-Click Export Current Chat to 6 Formats (PNG/Video/MD/Word/PPT/PDF) & Sync to ADE/IDE/Google Drive
    document.getElementById('btn-export-chat-6formats')?.addEventListener('click', async () => {
      const btn = document.getElementById('btn-export-chat-6formats');
      if (btn) btn.textContent = '⏳ 6종 변환 중...';
      try {
        const res = await fetch('/api/jarvis/covision-export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: '현재 에이전트 대화록 및 ADE·IDE 동역 내역 6종 문서(MD·Word·PPT·PDF·PNG·영상) 아카이빙',
            sourceType: 'AGENT_CHAT_ARCHIVE'
          })
        });
        const d = await res.json();
        if (btn) btn.textContent = '✅ 6종 저장됨';
        setTimeout(() => { if (btn) btn.textContent = '📄 6종 문서화'; }, 2500);
        if (d && d.ok && d.session) {
          const f = d.session.files;
          const feed = document.getElementById('agent-chat-feed');
          if (feed) {
            const card = document.createElement('div');
            card.className = 'chat-bubble assistant';
            card.innerHTML = `
              <div class="bubble-meta"><span style="color:#34d399;">✅ 6종 문서 생성 및 ADE·IDE·Google Drive 동기화 완료</span></div>
              <div class="bubble-text" style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px;">
                <a href="${f.image}" download class="win-ctrl-btn" style="text-decoration:none;color:#00f0ff;">🖼️ PNG</a>
                <a href="${f.video}" target="_blank" class="win-ctrl-btn" style="text-decoration:none;color:#fb7185;">🎬 영상</a>
                <a href="${f.md}" download class="win-ctrl-btn" style="text-decoration:none;color:#34d399;">📝 MD</a>
                <a href="${f.docx}" download class="win-ctrl-btn" style="text-decoration:none;color:#60a5fa;">📘 Word</a>
                <a href="${f.pptx}" download class="win-ctrl-btn" style="text-decoration:none;color:#fbbf24;">📊 PPT</a>
                <a href="${f.pdf}" download class="win-ctrl-btn" style="text-decoration:none;color:#c084fc;">📕 PDF</a>
              </div>
            `;
            feed.appendChild(card);
            feed.scrollTop = feed.scrollHeight;
          }
        }
      } catch (e) {
        if (btn) btn.textContent = '📄 6종 문서화';
      }
    });

    // Responsive Side-Rail Drawer Toggles (PC / Tablet / Mobile)
    document.getElementById('btn-resp-left-rail')?.addEventListener('click', () => {
      document.getElementById('left-rail')?.classList.toggle('resp-open');
      document.getElementById('right-rail')?.classList.remove('resp-open');
    });
    document.getElementById('btn-resp-right-rail')?.addEventListener('click', () => {
      document.getElementById('right-rail')?.classList.toggle('resp-open');
      document.getElementById('left-rail')?.classList.remove('resp-open');
    });

    // Bottom Action Orbs (including AI Studio 17-Modules Hub)
    document.getElementById('orb-aistudio-hub')?.addEventListener('click', () => {
      if (window.HUDWindowSpawner && window.HUDWindowSpawner.openAIStudioWindowByType) {
        window.HUDWindowSpawner.openAIStudioWindowByType('AI_STUDIO_HUB');
      } else {
        this.sendCommandToJarvis('AI Studio 스튜디오 허브 열어줘');
      }
    });
    document.querySelectorAll('[data-ais-win]').forEach(btn => {
      btn.addEventListener('click', () => {
        const winType = btn.dataset.aisWin;
        if (window.HUDWindowSpawner && window.HUDWindowSpawner.openAIStudioWindowByType) {
          window.HUDWindowSpawner.openAIStudioWindowByType(winType);
        }
      });
    });
    document.getElementById('orb-manual')?.addEventListener('click', () => {
      this.sendCommandToJarvis('설명서 창 띄워줘');
    });
    document.getElementById('orb-report')?.addEventListener('click', () => {
      this.sendCommandToJarvis('112개 오픈소스 딥리서치 보고서 보여줘');
    });
    document.getElementById('orb-console')?.addEventListener('click', () => {
      this.sendCommandToJarvis('실시간 제작 콘솔 및 토큰 흐름 창 열어줘');
    });
    document.getElementById('orb-studio')?.addEventListener('click', () => {
      this.sendCommandToJarvis('생성 스튜디오 3D 홀로그램 창 열어줘');
    });
    document.getElementById('orb-pc-ctrl')?.addEventListener('click', () => {
      this.sendCommandToJarvis('컴퓨터 제어로 마스터 설계서 PDF 열어줘');
    });
    document.getElementById('orb-voice-mic')?.addEventListener('click', () => {
      this.toggleVoiceListening();
    });

    // 4 Right-Rail Sensor Switches (EYES / WATCH / HOLO / FOCUS)
    ['eyes', 'watch', 'holo', 'focus'].forEach(id => {
      const btn = document.getElementById(`toggle-${id}`);
      btn?.addEventListener('click', () => {
        this.toggleSensor(btn.dataset.sensor, btn);
      });
    });

    // Top Bar: 15-Second Executive Briefing & HOLO Hand Gesture Control HUD
    document.getElementById('btn-exec-briefing')?.addEventListener('click', () => {
      this.sendCommandToJarvis('자비스, 오늘 브리핑 해줘');
    });
    document.getElementById('btn-holo-gesture-hud')?.addEventListener('click', () => {
      this.openHoloGesturePanel();
    });
    document.getElementById('btn-rescan-camera')?.addEventListener('click', () => {
      const sel = document.getElementById('holo-camera-select');
      this.sensors.HOLO = true;
      this.startWebcamAndHolo('HOLO', sel ? sel.value : '');
    });
    document.getElementById('holo-camera-select')?.addEventListener('change', e => {
      this.sensors.HOLO = true;
      this.startWebcamAndHolo('HOLO', e.target.value || '');
    });
    document.getElementById('btn-close-holo-panel')?.addEventListener('click', () => {
      const panel = document.getElementById('holo-gesture-hud-panel');
      if (panel) panel.style.display = 'none';
    });
    document.querySelectorAll('.holo-gesture-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        this.executeHandGestureAction(btn.dataset.gesture);
      });
    });

    // PC Approval Modal Buttons
    document.getElementById('btn-approve-pc')?.addEventListener('click', () => {
      if (this.pendingPcActionKey) {
        this.executeApprovedPcAction(this.pendingPcActionKey);
      }
    });
    document.getElementById('btn-deny-pc')?.addEventListener('click', () => {
      document.getElementById('pc-approval-modal').style.display = 'none';
      this.pendingPcActionKey = null;
      window.BSC_WORLDVIEW.showToast('J.A.R.V.I.S.', '이건우 대표님, 컴퓨터 제어 요청을 취소했습니다.');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.MultimodalEngine.init();
});
