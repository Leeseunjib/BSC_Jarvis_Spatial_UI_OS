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
    } catch (e) {}
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
    // Barge-in: stop ongoing Neural TTS or browser speech immediately
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
    const text = (turn && turn.text ? turn.text : '').trim();
    if (!text) return;
    const cfg = (window.AIStudioData && window.AIStudioData.routerConfig) || {};
    const persona = turn.persona || 'jarvis';
    const speaker = turn.speaker || '🤖 J.A.R.V.I.S.';
    const avatar = turn.avatar || (persona === 'soha' ? '/agent_images/soha/explain.png' : '/agent_images/geonu/analyze.png');
    const customVoiceId = turn.voiceId || (persona === 'jarvis' ? cfg.voiceId : undefined);
    const voiceBadge = persona === 'soha'
      ? '🎙️ 선희 신경망 성우 (SunHiNeural · 수석비서 소하)'
      : (persona === 'taejun' || persona === 'geonu'
        ? '🎙️ 인준 신경망 성우 (InJoonNeural · BSC 리더)'
        : `🎙️ ${cfg.ttsEngine === 'LOCAL_CHATTERBOX_MULTILINGUAL' ? 'Chatterbox Multilingual (MIT)' : '현수 신경망 성우 (HyunsuNeural · 영화 자비스 톤)'}`);

    window.BSC_WORLDVIEW.showToast(speaker, text, avatar, voiceBadge);

    if (cfg.autoSpeakResponses === false && !turn.voiceId) return;

    try {
      const res = await fetch('/api/jarvis/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          persona,
          voiceId: customVoiceId,
          speechRate: cfg.speechRate || 1.05,
          pitchHz: cfg.pitchHz || '-2Hz',
          ttsEngine: cfg.ttsEngine || 'LOCAL_CHATTERBOX_MULTILINGUAL',
          exaggeration: cfg.ttsExaggeration || 0.45,
          cfgWeight: cfg.ttsCfgWeight || 0.5,
          localTtsUrl: cfg.localTtsServerUrl || 'http://127.0.0.1:7860/tts'
        })
      });
      if (myToken !== this.speechQueueToken) return;
      const data = await res.json();
      if (data && data.ok && data.audioBase64) {
        await new Promise((resolve) => {
          const audio = new Audio(`data:${data.mimeType || 'audio/mp3'};base64,${data.audioBase64}`);
          this.currentAudio = audio;
          this.speechPulseInterval = setInterval(() => {
            if (window.JarvisReactorCore) {
              window.JarvisReactorCore.pulseSpeech(0.95 + Math.random() * 0.45);
            }
          }, 110);
          const cleanup = () => {
            if (this.speechPulseInterval) {
              clearInterval(this.speechPulseInterval);
              this.speechPulseInterval = null;
            }
            resolve();
          };
          audio.onended = cleanup;
          audio.onerror = cleanup;
          audio.play().catch(cleanup);
        });
        return;
      }
    } catch (e) {}

    // Fallback to browser Web Speech only if network/offline
    if (window.speechSynthesis && myToken === this.speechQueueToken) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ko-KR';
      utter.rate = cfg.speechRate || 1.05;
      window.speechSynthesis.speak(utter);
    }
  },

  async speakNeuralTurns(dialogueTurns, fallbackText = '') {
    this.stopAllSpeech();
    const myToken = this.speechQueueToken;
    const turns = Array.isArray(dialogueTurns) && dialogueTurns.length > 0
      ? dialogueTurns
      : [{ persona: 'jarvis', speaker: '🤖 J.A.R.V.I.S.', avatar: '/agent_images/geonu/analyze.png', text: fallbackText }];

    for (const turn of turns) {
      if (myToken !== this.speechQueueToken) break;
      await this.playSingleNeuralTurn(turn, myToken);
    }
  },

  speakStewardReply(text, persona = 'jarvis') {
    if (!text) return;
    const speaker = persona === 'soha' ? '👩‍💼 수석비서 소하' : '🤖 J.A.R.V.I.S.';
    const avatar = persona === 'soha' ? '/agent_images/soha/explain.png' : '/agent_images/geonu/analyze.png';
    this.speakNeuralTurns([{ persona, speaker, avatar, text }], text);
  },

  async sendCommandToJarvis(message) {
    if (!message) return;
    const personaSelect = document.getElementById('jarvis-persona-select');
    const personaMode = personaSelect ? personaSelect.value : 'cowork';
    window.BSC_WORLDVIEW.showToast('👑 이건우 대표님 (CEO)', message, null, '⚡ 로컬 Gemma 4 추론 및 신경망 성우 합성 중...');

    // Check if user said "승인해" for a pending PC action
    if (this.pendingPcActionKey && /승인|실행해|허락|오케이|ok|yes/i.test(message)) {
      this.executeApprovedPcAction(this.pendingPcActionKey);
      return;
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
            speakingStyle: cfg.speakingStyle || 'MOVIE_JARVIS_CONCISE'
          }
        })
      });
      const data = await res.json();

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
      if (data.dialogueTurns && data.dialogueTurns.length > 0) {
        this.speakNeuralTurns(data.dialogueTurns, data.reply);
      } else if (data.reply) {
        this.speakStewardReply(data.reply);
      }
    } catch (e) {
      console.error(e);
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

  async startWebcamAndHolo(mode) {
    const video = document.getElementById('webcam-video');
    const handCanvas = document.getElementById('holo-hand-canvas');
    try {
      if (!this.webcamStream) {
        this.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });
        video.srcObject = this.webcamStream;
        await video.play();
      }
      video.style.display = 'block';
      handCanvas.style.display = 'block';
      handCanvas.width = window.innerWidth;
      handCanvas.height = window.innerHeight;

      if (mode === 'EYES') {
        const msg = '이건우 대표님, 자리에 계신 것을 확인했습니다(EYES ON). 오늘도 대표님과 함께 사명을 감당하게 되어 기쁩니다.';
        window.BSC_WORLDVIEW.showToast('👁️ EYES (재석/모션 인지)', msg);
        this.speakStewardReply(msg);
      } else if (mode === 'HOLO') {
        const msg = '이건우 대표님, HOLO 손동작 제어 HUD가 켜졌습니다. 웹캠 앞 손동작이나 5대 제스처 패드로 3D 은하 회전, 15초 브리핑, 승인 실행을 제어하실 수 있습니다.';
        window.BSC_WORLDVIEW.showToast('✋ HOLO (21관절 손동작 & 에어터치)', msg);
        this.speakStewardReply(msg);
        const panel = document.getElementById('holo-gesture-hud-panel');
        if (panel) panel.style.display = 'block';
        this.startMiniHandSkeletonVisualizer();
      }

      this.runOpticalHandTracker(video, handCanvas);
    } catch (e) {
      // Fallback Synthetic HOLO Hand Simulator if no physical webcam is attached
      handCanvas.style.display = 'block';
      handCanvas.width = window.innerWidth;
      handCanvas.height = window.innerHeight;
      if (mode === 'HOLO') {
        const panel = document.getElementById('holo-gesture-hud-panel');
        if (panel) panel.style.display = 'block';
        this.startMiniHandSkeletonVisualizer();
      }
      window.BSC_WORLDVIEW.showToast('✋ HOLO (손동작 & 에어터치 HUD)', '카메라 또는 마우스 연동 21관절 HOLO 손동작 제어기를 가동합니다. 우측 하단 5대 제스처 패드로 즉시 실행이 가능합니다.');
      this.runMouseHoloOverlay(handCanvas);
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

    cvs.addEventListener('mousemove', e => {
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

      // Draw 21-Keypoint MediaPipe-style Holographic Hand Skeleton at (hx, hy)
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
    // Chat prompt submit
    const form = document.getElementById('jarvis-chat-form');
    const input = document.getElementById('jarvis-prompt-input');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      this.sendCommandToJarvis(val);
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
