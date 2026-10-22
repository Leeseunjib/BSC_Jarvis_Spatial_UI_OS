/**
 * 💻🧠🪟 BSC J.A.R.V.I.S. OS — Antigravity IDE 2.0 Workbench, Ollama & LM Studio Brain Hub,
 * 5-Step Autonomous Pipeline UI (Judge -> Select Model -> Report Plan -> Approve -> Produce),
 * Integrated Streaming Web Terminal (CLI/SDK) & Universal Window Manager (Drag + 8-Way Resize)
 */

window.UniversalWindowManager = {
  topZ: 9660,

  init() {
    this.makeStaticPanelsMovableAndResizable();
    // Observe dynamically spawned floating windows in #floating-windows-layer
    const layer = document.getElementById('floating-windows-layer');
    if (layer && typeof MutationObserver !== 'undefined') {
      const obs = new MutationObserver(() => {
        layer.querySelectorAll('.hud-window:not([data-uwm-bound])').forEach(win => {
          this.enhanceWindow(win, win.querySelector('.hud-window-header'));
        });
      });
      obs.observe(layer, { childList: true });
    }
    // Enhance any already-existing .hud-window
    document.querySelectorAll('.hud-window:not([data-uwm-bound])').forEach(win => {
      this.enhanceWindow(win, win.querySelector('.hud-window-header'));
    });
  },

  makeStaticPanelsMovableAndResizable() {
    // 1. BeausCreators Council Window (#bsc-council-window)
    const councilWin = document.getElementById('bsc-council-window');
    if (councilWin) {
      councilWin.style.transform = 'none';
      councilWin.style.left = `${Math.max(380, Math.round((window.innerWidth - 820) / 2))}px`;
      councilWin.style.top = '72px';
      this.enhanceWindow(councilWin, councilWin.firstElementChild);
    }

    // 2. 1:1 J.A.R.V.I.S. Chat Drawer (#agent-chat-drawer)
    const chatDrawer = document.getElementById('agent-chat-drawer');
    if (chatDrawer) {
      this.enhanceWindow(chatDrawer, chatDrawer.querySelector('.chat-drawer-header'));
    }

    // 3. HOLO Camera Gesture Panel (#holo-gesture-hud-panel)
    const holoPanel = document.getElementById('holo-gesture-hud-panel');
    if (holoPanel) {
      this.enhanceWindow(holoPanel, holoPanel.firstElementChild);
    }
  },

  enhanceWindow(winEl, headerEl) {
    if (!winEl || winEl.dataset.uwmBound === '1') return;
    // Never touch the left menu (#slim-left-dock, #node-preview-card) or top/bottom bars
    if (winEl.id === 'slim-left-dock' || winEl.id === 'node-preview-card' || winEl.id === 'minimal-top-bar' || winEl.id === 'clean-bottom-bar') {
      return;
    }
    winEl.dataset.uwmBound = '1';
    winEl.classList.add('uwm-managed-window');

    // Bring to front on click anywhere inside the window
    winEl.addEventListener('mousedown', () => {
      this.topZ += 1;
      winEl.style.zIndex = String(this.topZ);
    });

    // Inject Minimize (—) & Maximize/Restore (□) buttons into header if not already present
    if (headerEl && !headerEl.querySelector('.uwm-minmax-bar')) {
      headerEl.style.cursor = 'move';
      headerEl.style.userSelect = 'none';
      const ctrlWrap = document.createElement('span');
      ctrlWrap.className = 'uwm-minmax-bar';
      ctrlWrap.style.cssText = 'display:inline-flex;gap:4px;margin-right:4px;align-items:center;';
      ctrlWrap.innerHTML = `
        <button type="button" class="win-ctrl-btn uwm-btn-min" title="창 최소화/펼치기" style="padding:2px 7px;font-size:10px;">—</button>
        <button type="button" class="win-ctrl-btn uwm-btn-max" title="창 크기 최대화/원래대로" style="padding:2px 7px;font-size:10px;">□</button>
      `;
      const existingRightGroup = headerEl.querySelector('.win-controls') || headerEl.lastElementChild;
      if (existingRightGroup && existingRightGroup !== headerEl.firstElementChild) {
        existingRightGroup.insertBefore(ctrlWrap, existingRightGroup.firstChild);
      } else {
        headerEl.appendChild(ctrlWrap);
      }

      ctrlWrap.querySelector('.uwm-btn-min')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMin = winEl.dataset.uwmMinimized === '1';
        if (!isMin) {
          winEl.dataset.prevHeight = winEl.style.height || `${winEl.offsetHeight}px`;
          winEl.style.height = '46px';
          winEl.style.minHeight = '46px';
          winEl.style.overflow = 'hidden';
          winEl.dataset.uwmMinimized = '1';
        } else {
          winEl.style.height = winEl.dataset.prevHeight || '520px';
          winEl.style.minHeight = '200px';
          winEl.dataset.uwmMinimized = '0';
        }
      });

      ctrlWrap.querySelector('.uwm-btn-max')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMax = winEl.dataset.uwmMaximized === '1';
        if (!isMax) {
          const rect = winEl.getBoundingClientRect();
          winEl.dataset.prevRect = JSON.stringify({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
          winEl.style.left = '376px';
          winEl.style.top = '62px';
          winEl.style.right = 'auto';
          winEl.style.bottom = 'auto';
          winEl.style.transform = 'none';
          winEl.style.width = `${Math.max(520, window.innerWidth - 392)}px`;
          winEl.style.height = `${Math.max(380, window.innerHeight - 132)}px`;
          winEl.dataset.uwmMaximized = '1';
        } else {
          try {
            const p = JSON.parse(winEl.dataset.prevRect || '{}');
            if (p.width) {
              winEl.style.left = `${p.left}px`;
              winEl.style.top = `${p.top}px`;
              winEl.style.width = `${p.width}px`;
              winEl.style.height = `${p.height}px`;
            }
          } catch (err) {}
          winEl.dataset.uwmMaximized = '0';
        }
      });
    }

    // Bind Header Dragging
    if (headerEl) {
      let dragging = false;
      let startX = 0, startY = 0, startLeft = 0, startTop = 0;

      headerEl.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, input, select, a')) return;
        dragging = true;
        const rect = winEl.getBoundingClientRect();
        winEl.style.left = `${rect.left}px`;
        winEl.style.top = `${rect.top}px`;
        winEl.style.right = 'auto';
        winEl.style.bottom = 'auto';
        winEl.style.transform = 'none';
        startX = e.clientX;
        startY = e.clientY;
        startLeft = rect.left;
        startTop = rect.top;
        this.topZ += 1;
        winEl.style.zIndex = String(this.topZ);
      });

      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const nx = Math.max(68, Math.min(window.innerWidth - 120, startLeft + (e.clientX - startX)));
        const ny = Math.max(54, Math.min(window.innerHeight - 60, startTop + (e.clientY - startY)));
        winEl.style.left = `${nx}px`;
        winEl.style.top = `${ny}px`;
      });

      window.addEventListener('mouseup', () => {
        dragging = false;
      });
    }

    // Inject Right, Bottom, Left, and Corner Resize Handles (늘리기/줄이기)
    const dirs = ['e', 's', 'w', 'se', 'sw'];
    dirs.forEach(dir => {
      const handle = document.createElement('div');
      handle.className = `uwm-resize-handle uwm-resize-${dir}`;
      if (dir === 'se') {
        handle.title = '드래그하여 창 크기 늘리기 / 줄이기';
        handle.textContent = '◢';
      }
      winEl.appendChild(handle);

      let resizing = false;
      let sx = 0, sy = 0, sLeft = 0, sTop = 0, sWidth = 0, sHeight = 0;

      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resizing = true;
        const rect = winEl.getBoundingClientRect();
        winEl.style.left = `${rect.left}px`;
        winEl.style.top = `${rect.top}px`;
        winEl.style.right = 'auto';
        winEl.style.bottom = 'auto';
        winEl.style.transform = 'none';
        winEl.style.maxHeight = 'none';
        sx = e.clientX;
        sy = e.clientY;
        sLeft = rect.left;
        sTop = rect.top;
        sWidth = rect.width;
        sHeight = rect.height;
        this.topZ += 1;
        winEl.style.zIndex = String(this.topZ);
      });

      window.addEventListener('mousemove', (e) => {
        if (!resizing) return;
        const dx = e.clientX - sx;
        const dy = e.clientY - sy;
        if (dir.includes('e')) {
          winEl.style.width = `${Math.max(300, sWidth + dx)}px`;
        }
        if (dir.includes('s')) {
          winEl.style.height = `${Math.max(220, sHeight + dy)}px`;
        }
        if (dir.includes('w')) {
          const newW = Math.max(300, sWidth - dx);
          if (newW > 300) {
            winEl.style.left = `${sLeft + dx}px`;
            winEl.style.width = `${newW}px`;
          }
        }
      });

      window.addEventListener('mouseup', () => {
        resizing = false;
      });
    });
  }
};

// ============================================================================
// 💻🧠 Antigravity IDE 2.0 Workbench + Ollama & LM Studio Brain Hub + 5-Step Pipeline
// ============================================================================
window.JarvisIdeWorkbench = {
  catalogData: null,
  ideFiles: [],
  currentFilePath: 'c:/BSC_Javis_OS/docs/plan.md',
  currentFileContent: '',
  activeRightTab: 'PLAN_5STEP', // 'PLAN_5STEP' | 'DOC_PREVIEW' | 'MODELS_8DOMAIN' | 'SDK_GUIDE'
  pendingPlans: [],

  init() {
    window.UniversalWindowManager.init();
    this.bindSSEEvents();
    this.refreshCatalogAndPlans();
  },

  bindSSEEvents() {
    try {
      const evtSource = new EventSource('/api/events');
      evtSource.addEventListener('terminal_output', (e) => {
        const data = JSON.parse(e.data);
        this.appendTerminalLine(data.line, data.stream);
      });
      evtSource.addEventListener('brain_changed', (e) => {
        const data = JSON.parse(e.data);
        if (data && data.brainState) {
          this.updateTopBrainBadge(data.brainState);
          this.refreshCatalogAndPlans();
        }
      });
      evtSource.addEventListener('autonomous_plan_created', (e) => {
        const plan = JSON.parse(e.data);
        this.pendingPlans.unshift(plan);
        this.activeRightTab = 'PLAN_5STEP';
        this.renderRightViewerPane();
        this.renderChatApprovalBanner(plan);
      });
      evtSource.addEventListener('autonomous_plan_executed', (e) => {
        const res = JSON.parse(e.data);
        if (res && res.plan) {
          const idx = this.pendingPlans.findIndex(p => p.planId === res.plan.planId);
          if (idx >= 0) this.pendingPlans[idx] = res.plan;
          else this.pendingPlans.unshift(res.plan);
          this.activeRightTab = 'PLAN_5STEP';
          this.renderRightViewerPane();
        }
      });
    } catch (e) {}
  },

  async refreshCatalogAndPlans() {
    try {
      const [catRes, planRes, filesRes] = await Promise.all([
        fetch('/api/jarvis/models-catalog').then(r => r.json()),
        fetch('/api/jarvis/pending-plans').then(r => r.json()),
        fetch('/api/jarvis/ide-files').then(r => r.json())
      ]);
      if (catRes && catRes.ok) {
        this.catalogData = catRes;
        this.updateTopBrainBadge(catRes.brainState);
      }
      if (planRes && planRes.ok) {
        this.pendingPlans = planRes.plans || [];
      }
      if (filesRes && filesRes.ok) {
        this.ideFiles = filesRes.files || [];
      }
      this.renderExplorerAndModelsPane();
      this.renderRightViewerPane();
    } catch (e) {}
  },

  updateTopBrainBadge(brainState) {
    if (!brainState) return;
    const pill = document.getElementById('active-model-pill');
    if (pill) {
      const modePrefix = brainState.selectionMode === 'AUTO' ? '🤖자율·' : '📌고정·';
      pill.textContent = `${modePrefix}${brainState.activeProvider}:${brainState.activeModel}`;
    }
  },

  // Renders the 5-Step Approval Banner directly inside the 1:1 Chat Drawer whenever a Production Plan is created!
  renderChatApprovalBanner(plan) {
    const feed = document.getElementById('agent-chat-feed');
    if (!feed || !plan) return;
    const card = document.createElement('div');
    card.className = 'chat-bubble assistant';
    card.style.cssText = 'border:1px solid #fbbf24;background:rgba(15,23,42,0.96);padding:12px;';
    card.innerHTML = `
      <div style="font-size:11.5px;font-weight:800;color:#fbbf24;margin-bottom:6px;">
        📋 [자비스 5단계 자율 판단 ➔ 모델 선택 ➔ 계획 보고] (${plan.planId})
      </div>
      <div style="font-size:11.5px;color:#e2e8f0;line-height:1.55;margin-bottom:8px;">
        • <b>1단계 상황 판단</b>: ${plan.step1_judgment.domainName}<br/>
        • <b>2단계 자율 선택 모델</b>: <span style="color:#00f0ff;font-weight:800;">[${plan.step2_modelSelection.activeProvider.toUpperCase()}] ${plan.step2_modelSelection.selectedBrainModel}</span> + ${plan.step2_modelSelection.domainOpenModels.join(', ')}<br/>
        • <b>모바일/WebGPU 호환</b>: ${plan.step2_modelSelection.mobileWebGpuModel}<br/>
        • <b>연동 본사 스킬</b>: ${plan.step2_modelSelection.linkedBscSkills.join(', ')}<br/>
        • <b>3단계 적용 계획</b>: ${plan.step3_projectPlan.expectedDeliverables.join(' · ')} 생성
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button type="button" class="hud-mini-btn primary btn-chat-approve-plan" data-plan-id="${plan.planId}" style="background:#16a34a;border-color:#34d399;color:#fff;font-weight:800;padding:6px 12px;">
          ✅ 승인 및 제작 실행 (6종 문서·엑셀·코드 생성)
        </button>
        <button type="button" class="hud-mini-btn btn-chat-open-ide-plan" data-plan-id="${plan.planId}" style="padding:6px 10px;">
          💻 IDE 2.0 계획서 뷰에서 상세 보기
        </button>
      </div>
    `;
    feed.appendChild(card);
    feed.scrollTop = feed.scrollHeight;

    card.querySelector('.btn-chat-approve-plan')?.addEventListener('click', () => {
      this.approveAndRunPlan(plan.planId);
    });
    card.querySelector('.btn-chat-open-ide-plan')?.addEventListener('click', () => {
      this.openFloatingIdeWorkbench('PLAN_5STEP');
    });
  },

  async approveAndRunPlan(planId) {
    window.BSC_WORLDVIEW?.showToast('🚀 5단계 제작 실행 중', '이건우 대표님 승인 완료! 선택된 로컬 두뇌로 Word, PPT, MD, PDF, Excel 시트 및 인터랙티브 산출물을 생성하고 있습니다...');
    try {
      const res = await fetch('/api/jarvis/autonomous-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      }).then(r => r.json());

      if (res && res.ok) {
        const msg = `이건우 대표님, 승인하신 [${res.plan.step1_judgment.domainName}] 제작이 완료되었습니다. Word, PPT, PDF, 마크다운, 엑셀(.xls) 시트와 프리뷰가 생성되었습니다.`;
        window.MultimodalEngine?.speakStewardReply(msg);
        await this.refreshCatalogAndPlans();
        this.openFloatingIdeWorkbench('PLAN_5STEP');
      }
    } catch (e) {}
  },

  openFloatingIdeWorkbench(initialTab = 'PLAN_5STEP') {
    this.activeRightTab = initialTab;
    let win = document.getElementById('jarvis-ide-2-window');
    if (!win) {
      win = document.createElement('section');
      win.id = 'jarvis-ide-2-window';
      win.className = 'hud-window';
      win.style.cssText = `position:fixed;top:64px;left:378px;width:${Math.max(760, window.innerWidth - 400)}px;height:${Math.max(540, window.innerHeight - 138)}px;z-index:9680;display:flex;flex-direction:column;background:rgba(7,12,24,0.97);border:1px solid rgba(0,240,255,0.55);border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,0.85);backdrop-filter:blur(22px);overflow:hidden;`;
      win.innerHTML = this.buildWorkbenchHtml();
      document.body.appendChild(win);
      window.UniversalWindowManager.enhanceWindow(win, win.querySelector('.hud-window-header'));
      this.bindWorkbenchEvents(win);
    } else {
      win.style.display = 'flex';
      window.UniversalWindowManager.topZ += 1;
      win.style.zIndex = String(window.UniversalWindowManager.topZ);
    }
    this.refreshCatalogAndPlans();
    this.loadFileIntoEditor(this.currentFilePath);
  },

  buildWorkbenchHtml() {
    return `
      <div class="hud-window-header" style="padding:10px 16px;background:linear-gradient(90deg,rgba(0,240,255,0.16),rgba(15,23,42,0.95));border-bottom:1px solid rgba(56,189,248,0.3);">
        <div class="win-title-wrap">
          <span class="win-title" style="font-size:14px;">💻 Antigravity IDE 2.0 통합 워크벤치 · 🧠 Ollama &amp; LM Studio 두뇌 센터 · 📋 5단계 자율 제작 스튜디오</span>
          <span class="win-subtitle">코드 직접 작성 · 문서/계획서(Plan) 뷰어 · 내장 실시간 터미널(CLI/SDK) · RunNow 15 &amp; 8대 도메인 오픈모델</span>
        </div>
        <div class="win-controls">
          <button type="button" class="win-ctrl-btn" id="btn-ide-scan-models" style="border-color:#34d399;color:#34d399;">🔄 올라마·LM Studio 스캔</button>
          <button type="button" class="win-ctrl-btn" id="btn-ide-close" title="닫기">✕</button>
        </div>
      </div>

      <!-- 4-Pane Antigravity IDE 2.0 Body -->
      <div style="flex:1;display:grid;grid-template-columns:270px 1fr 1.05fr;grid-template-rows:1fr 195px;gap:8px;padding:8px;min-height:0;overflow:hidden;">
        
        <!-- PANE 1 (Left, spans 2 rows): Project Explorer + Ollama & LM Studio Brain Selector -->
        <aside id="ide-left-explorer-pane" style="grid-row:1 / span 2;background:rgba(10,16,30,0.92);border:1px solid rgba(148,163,184,0.22);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;">
          <div style="font-size:11px;color:#94a3b8;">로딩 중...</div>
        </aside>

        <!-- PANE 2 (Center-Top): Live Code & Markdown Editor -->
        <section style="background:rgba(10,16,30,0.95);border:1px solid rgba(56,189,248,0.28);border-radius:12px;display:flex;flex-direction:column;min-height:0;overflow:hidden;">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 12px;background:rgba(15,23,42,0.9);border-bottom:1px solid rgba(148,163,184,0.18);gap:6px;">
            <div style="display:flex;align-items:center;gap:6px;min-width:0;">
              <span style="font-size:11px;font-weight:800;color:#00f0ff;">📝 코드 / 문서 편집기</span>
              <code id="ide-editor-filepath" style="font-size:10.5px;color:#cbd5e1;background:rgba(30,41,59,0.8);padding:2px 7px;border-radius:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">docs/plan.md</code>
            </div>
            <div style="display:flex;gap:5px;flex-shrink:0;">
              <button type="button" class="win-ctrl-btn" id="btn-ide-save-file" style="border-color:#34d399;color:#34d399;font-weight:700;">💾 안전 저장 (.bak 보존)</button>
              <button type="button" class="win-ctrl-btn" id="btn-ide-read-editor" style="border-color:#00f0ff;color:#00f0ff;">🔊 음성 완독</button>
            </div>
          </div>
          <textarea id="ide-code-textarea" spellcheck="false" style="flex:1;width:100%;background:#040812;color:#e2e8f0;border:none;padding:12px;font-family:'JetBrains Mono','Consolas',monospace;font-size:12px;line-height:1.6;resize:none;outline:none;user-select:text;"></textarea>
        </section>

        <!-- PANE 3 (Right-Top): Content / Plan / 5-Step Autonomous Approval / 8-Domain Open Models Viewer -->
        <section style="background:rgba(10,16,30,0.95);border:1px solid rgba(251,191,36,0.32);border-radius:12px;display:flex;flex-direction:column;min-height:0;overflow:hidden;">
          <div style="display:flex;gap:5px;padding:7px 10px;background:rgba(15,23,42,0.9);border-bottom:1px solid rgba(148,163,184,0.18);flex-wrap:wrap;">
            <button type="button" class="win-ctrl-btn ide-rtab-btn active" data-rtab="PLAN_5STEP" style="border-color:#fbbf24;color:#fbbf24;font-weight:800;">📋 5단계 자율 계획·승인</button>
            <button type="button" class="win-ctrl-btn ide-rtab-btn" data-rtab="DOC_PREVIEW">📄 문서·계획서 뷰어</button>
            <button type="button" class="win-ctrl-btn ide-rtab-btn" data-rtab="MODELS_8DOMAIN">🧠 LM Studio·RunNow·8도메인</button>
            <button type="button" class="win-ctrl-btn ide-rtab-btn" data-rtab="SDK_GUIDE">🧩 CLI &amp; SDK 코드</button>
          </div>
          <div id="ide-right-viewer-body" style="flex:1;overflow-y:auto;padding:12px;font-size:12.5px;line-height:1.6;color:#e2e8f0;user-select:text;"></div>
        </section>

        <!-- PANE 4 (Bottom, spans 2 columns): Integrated Live Streaming Terminal (LLM Install, CLI, SDK, Agy) -->
        <section style="grid-column:2 / span 2;background:#03060e;border:1px solid rgba(52,211,153,0.35);border-radius:12px;display:flex;flex-direction:column;min-height:0;overflow:hidden;">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 10px;background:rgba(11,19,35,0.95);border-bottom:1px solid rgba(148,163,184,0.18);gap:6px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:11px;font-weight:800;color:#34d399;">💻 자비스 내장 실시간 터미널 (LLM 설치 · CLI · SDK · CHLGD 보안 게이트)</span>
            </div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              <button type="button" class="win-ctrl-btn ide-quick-cmd" data-cmd="jarvis status" style="font-size:10px;">⚡ jarvis status</button>
              <button type="button" class="win-ctrl-btn ide-quick-cmd" data-cmd="jarvis models" style="font-size:10px;">🧠 jarvis models</button>
              <button type="button" class="win-ctrl-btn ide-quick-cmd" data-cmd="ollama list" style="font-size:10px;">🟢 ollama list</button>
              <button type="button" class="win-ctrl-btn ide-quick-cmd" data-cmd="ollama pull qwen2.5-coder:14b" style="font-size:10px;border-color:#00f0ff;color:#00f0ff;">⬇️ Qwen2.5-Coder 설치</button>
              <button type="button" class="win-ctrl-btn ide-quick-cmd" data-cmd="ollama pull deepseek-r1:14b" style="font-size:10px;border-color:#fbbf24;color:#fbbf24;">⬇️ DeepSeek-R1 설치</button>
              <button type="button" class="win-ctrl-btn ide-quick-cmd" data-cmd="ollama pull llama3.2:3b" style="font-size:10px;">⬇️ Llama3.2-3B 설치</button>
              <button type="button" class="win-ctrl-btn" id="btn-ide-clear-term" style="font-size:10px;">🧹 지우기</button>
            </div>
          </div>
          <div id="ide-terminal-output" style="flex:1;overflow-y:auto;padding:8px 12px;font-family:'JetBrains Mono','Consolas',monospace;font-size:11.5px;line-height:1.5;color:#cbd5e1;user-select:text;">
            <div style="color:#34d399;">🛡️ [BSC J.A.R.V.I.S. Terminal v2.0] CHLGD 무손실 보안 하네스 활성화됨 (삭제·초기화 명령 원천 차단)</div>
            <div style="color:#94a3b8;">💡 팁: 상단 버튼으로 오픈모델을 원클릭 설치하거나 아래에 <code>jarvis status</code>, <code>ollama list</code>, <code>jarvis plan "요청내용"</code>을 입력하세요.</div>
          </div>
          <form id="ide-terminal-form" style="display:flex;border-top:1px solid rgba(148,163,184,0.2);background:#050914;">
            <span style="padding:6px 10px;color:#34d399;font-family:monospace;font-size:12px;font-weight:800;">PS c:\\BSC_Javis_OS&gt;</span>
            <input type="text" id="ide-terminal-input" placeholder="명령어 입력 (예: jarvis models, ollama pull qwen2.5-coder:14b, git status)..." autocomplete="off" style="flex:1;background:transparent;border:none;color:#f8fafc;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;padding:6px 8px;" />
            <button type="submit" class="win-ctrl-btn" style="margin:3px 6px;border-color:#34d399;color:#34d399;font-weight:800;">실행 ↵</button>
          </form>
        </section>
      </div>
    `;
  },

  bindWorkbenchEvents(win) {
    win.querySelector('#btn-ide-close')?.addEventListener('click', () => {
      win.style.display = 'none';
    });
    win.querySelector('#btn-ide-scan-models')?.addEventListener('click', () => {
      this.refreshCatalogAndPlans();
      window.BSC_WORLDVIEW?.showToast('🔄 로컬 두뇌 스캔 완료', 'Ollama(:11434) 및 LM Studio(:1234 / 디스크 GGUF) 모델 목록을 최신 상태로 갱신했습니다.');
    });
    win.querySelector('#btn-ide-save-file')?.addEventListener('click', async () => {
      const content = win.querySelector('#ide-code-textarea')?.value || '';
      const res = await fetch('/api/jarvis/ide-save-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: this.currentFilePath, content })
      }).then(r => r.json());
      if (res && res.ok) {
        window.BSC_WORLDVIEW?.showToast('💾 파일 안전 저장 완료', res.message);
        if (this.activeRightTab === 'DOC_PREVIEW') this.renderRightViewerPane();
      } else {
        window.BSC_WORLDVIEW?.showToast('🛡️ 저장 보호 안내', res?.error || '저장 실패');
      }
    });
    win.querySelector('#btn-ide-read-editor')?.addEventListener('click', () => {
      const content = win.querySelector('#ide-code-textarea')?.value || '';
      if (content) window.MultimodalEngine?.speakStewardReply(content);
    });

    win.querySelectorAll('.ide-rtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        win.querySelectorAll('.ide-rtab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.borderColor = 'rgba(148,163,184,0.3)';
          b.style.color = '#e2e8f0';
        });
        btn.classList.add('active');
        btn.style.borderColor = '#00f0ff';
        btn.style.color = '#00f0ff';
        this.activeRightTab = btn.dataset.rtab;
        this.renderRightViewerPane();
      });
    });

    win.querySelectorAll('.ide-quick-cmd').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.dataset.cmd;
        if (cmd) this.executeTerminalCommand(cmd);
      });
    });

    win.querySelector('#btn-ide-clear-term')?.addEventListener('click', () => {
      const out = document.getElementById('ide-terminal-output');
      if (out) out.innerHTML = '';
    });

    win.querySelector('#ide-terminal-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = win.querySelector('#ide-terminal-input');
      const cmd = (input?.value || '').trim();
      if (!cmd) return;
      input.value = '';
      this.executeTerminalCommand(cmd);
    });

    const textarea = win.querySelector('#ide-code-textarea');
    textarea?.addEventListener('input', () => {
      this.currentFileContent = textarea.value;
      if (this.activeRightTab === 'DOC_PREVIEW') {
        this.renderRightViewerPane();
      }
    });
  },

  async loadFileIntoEditor(filePath) {
    if (!filePath) return;
    this.currentFilePath = filePath;
    const pathBadge = document.getElementById('ide-editor-filepath');
    if (pathBadge) pathBadge.textContent = filePath.replace(/^c:\/BSC_Javis_OS\//i, '');
    try {
      const res = await fetch(`/api/read-node?path=${encodeURIComponent(filePath)}`).then(r => r.json());
      const content = res?.content || '';
      this.currentFileContent = content;
      const textarea = document.getElementById('ide-code-textarea');
      if (textarea) textarea.value = content;
      if (this.activeRightTab === 'DOC_PREVIEW') {
        this.renderRightViewerPane();
      }
    } catch (e) {}
  },

  async executeTerminalCommand(cmd) {
    await fetch('/api/jarvis/terminal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd })
    });
    if (/ollama\s+pull|lms\s+get/i.test(cmd)) {
      this.refreshCatalogAndPlans();
    }
  },

  appendTerminalLine(line, stream = 'stdout') {
    const out = document.getElementById('ide-terminal-output');
    if (!out) return;
    const div = document.createElement('div');
    div.style.color = stream === 'cmd' ? '#00f0ff' : (stream === 'stderr' ? '#fbbf24' : '#e2e8f0');
    if (stream === 'cmd') div.style.fontWeight = '800';
    div.textContent = line;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  },

  renderExplorerAndModelsPane() {
    const pane = document.getElementById('ide-left-explorer-pane');
    if (!pane) return;
    const cat = this.catalogData;
    const bs = cat?.brainState || { selectionMode: 'AUTO', activeProvider: 'ollama', activeModel: 'gemma4:e4b' };
    const ollamaModels = cat?.ollama?.installedModels || [];
    const lmsLoaded = cat?.lmstudio?.loadedModels || [];
    const lmsDisk = cat?.lmstudio?.diskGgufModels || [];

    pane.innerHTML = `
      <!-- 1. Active Brain Control Box -->
      <div style="background:rgba(15,23,42,0.95);border:1px solid rgba(0,240,255,0.4);border-radius:10px;padding:9px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
          <span style="font-size:11px;font-weight:800;color:#00f0ff;">🧠 자비스 현재 주력 두뇌</span>
          <span style="font-size:9.5px;background:rgba(52,211,153,0.18);color:#34d399;padding:1px 6px;border-radius:999px;font-weight:800;">VRAM 자동스왑 ON</span>
        </div>
        <div style="font-size:12px;font-weight:800;color:#fff;margin-bottom:6px;">
          [${bs.activeProvider.toUpperCase()}] ${bs.activeModel}
        </div>
        <button type="button" id="btn-brain-auto-mode" class="hud-mini-btn ${bs.selectionMode === 'AUTO' ? 'primary' : ''}" style="width:100%;font-size:10.5px;padding:5px;">
          🤖 ${bs.selectionMode === 'AUTO' ? '자비스 자율 모델 선택 모드 (작동중)' : '자비스 자율 모델 선택 모드로 전환'}
        </button>
      </div>

      <!-- 2. Installed Ollama Models (:11434) -->
      <div>
        <div style="font-size:10.5px;font-weight:800;color:#34d399;margin-bottom:5px;display:flex;justify-content:space-between;">
          <span>🟢 올라마(Ollama) 설치 모델</span>
          <span>${cat?.ollama?.online ? 'ONLINE' : 'OFFLINE'} (${ollamaModels.length})</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${ollamaModels.map(m => `
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(15,23,42,0.8);border:1px solid ${m.isActiveBrain ? '#00f0ff' : 'rgba(148,163,184,0.2)'};border-radius:8px;padding:5px 8px;font-size:11px;">
              <div style="min-width:0;">
                <div style="font-weight:700;color:${m.isActiveBrain ? '#00f0ff' : '#f1f5f9'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.id}</div>
                <div style="font-size:9.5px;color:#94a3b8;">${m.sizeGb} GB · ${m.parameterSize || 'Local'}</div>
              </div>
              <button type="button" class="win-ctrl-btn btn-select-brain-item" data-provider="ollama" data-model="${m.id}" style="font-size:10px;padding:3px 7px;border-color:${m.isActiveBrain ? '#00f0ff' : '#34d399'};color:${m.isActiveBrain ? '#00f0ff' : '#34d399'};">
                ${m.isActiveBrain ? '장착됨' : '지능 선택'}
              </button>
            </div>
          `).join('') || '<div style="font-size:10.5px;color:#64748b;">설치된 모델 없음</div>'}
        </div>
      </div>

      <!-- 3. LM Studio Models (:1234 + Disk GGUF) -->
      <div>
        <div style="font-size:10.5px;font-weight:800;color:#c084fc;margin-bottom:5px;display:flex;justify-content:space-between;">
          <span>🟣 LM Studio (:1234 / GGUF)</span>
          <span>${cat?.lmstudio?.online ? 'SERVER ON' : '대기중'} (${lmsLoaded.length + lmsDisk.length})</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${[...lmsLoaded, ...lmsDisk].map(m => `
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(15,23,42,0.8);border:1px solid rgba(192,132,252,0.3);border-radius:8px;padding:5px 8px;font-size:11px;">
              <div style="min-width:0;">
                <div style="font-weight:700;color:#e9d5ff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.id}</div>
                <div style="font-size:9.5px;color:#94a3b8;">${m.sizeGb ? `${m.sizeGb} GB GGUF` : 'LM Studio Server'}</div>
              </div>
              <button type="button" class="win-ctrl-btn btn-select-brain-item" data-provider="lmstudio" data-model="${m.id}" style="font-size:10px;padding:3px 7px;border-color:#c084fc;color:#c084fc;">
                지능 선택
              </button>
            </div>
          `).join('') || `
            <div style="background:rgba(15,23,42,0.65);border:1px dashed rgba(192,132,252,0.35);border-radius:8px;padding:7px;font-size:10.5px;color:#cbd5e1;">
              LM Studio 실행 후 <b>Local Server(:1234)</b>를 켜거나 우측 탭에서 추천 GGUF 모델을 원클릭 설치하세요.
            </div>
          `}
        </div>
      </div>

      <!-- 4. IDE 2.0 File & Plan Explorer -->
      <div>
        <div style="font-size:10.5px;font-weight:800;color:#38bdf8;margin-bottom:5px;">📁 프로젝트 코드 · 계획서 · 문서 트리</div>
        <div style="display:flex;flex-direction:column;gap:3px;">
          ${this.ideFiles.map(f => `
            <button type="button" class="btn-ide-open-file" data-path="${f.path}" style="text-align:left;background:${this.currentFilePath.toLowerCase() === f.path.toLowerCase() ? 'rgba(0,240,255,0.16)' : 'rgba(15,23,42,0.75)'};border:1px solid ${this.currentFilePath.toLowerCase() === f.path.toLowerCase() ? '#00f0ff' : 'rgba(148,163,184,0.18)'};color:#e2e8f0;padding:5px 8px;border-radius:7px;font-size:11px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
              ${f.type === 'markdown' ? '📄' : '💻'} ${f.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    pane.querySelector('#btn-brain-auto-mode')?.addEventListener('click', async () => {
      await fetch('/api/jarvis/select-brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: bs.activeProvider, modelId: bs.activeModel, selectionMode: 'AUTO' })
      });
      this.refreshCatalogAndPlans();
    });

    pane.querySelectorAll('.btn-select-brain-item').forEach(btn => {
      btn.addEventListener('click', async () => {
        const provider = btn.dataset.provider;
        const modelId = btn.dataset.model;
        const res = await fetch('/api/jarvis/select-brain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider, modelId, selectionMode: 'MANUAL' })
        }).then(r => r.json());
        if (res && res.ok) {
          window.BSC_WORLDVIEW?.showToast('🧠 자비스 주력 지능 전환 완료', res.message);
          window.MultimodalEngine?.speakStewardReply(res.message);
          this.refreshCatalogAndPlans();
        }
      });
    });

    pane.querySelectorAll('.btn-ide-open-file').forEach(btn => {
      btn.addEventListener('click', () => {
        this.loadFileIntoEditor(btn.dataset.path);
        this.renderExplorerAndModelsPane();
      });
    });
  },

  renderRightViewerPane() {
    const body = document.getElementById('ide-right-viewer-body');
    if (!body) return;

    if (this.activeRightTab === 'DOC_PREVIEW') {
      const rendered = window.HUDWindowSpawner?.renderSimpleMarkdown
        ? window.HUDWindowSpawner.renderSimpleMarkdown(this.currentFileContent || '')
        : `<pre>${this.currentFileContent}</pre>`;
      body.innerHTML = `
        <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(148,163,184,0.2);display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:11.5px;font-weight:800;color:#38bdf8;">📄 실시간 문서 / 계획서 렌더링 뷰 (${this.currentFilePath})</span>
        </div>
        <div class="doc-rendered-view">${rendered}</div>
      `;
      return;
    }

    if (this.activeRightTab === 'SDK_GUIDE') {
      const pyCode = window.JarvisSDK?.getAntigravityPythonSdkTemplate
        ? window.JarvisSDK.getAntigravityPythonSdkTemplate()
        : '';
      body.innerHTML = `
        <h3 style="color:#00f0ff;margin-top:0;">🧩 자비스 CLI (` + '`jarvis`' + `) &amp; Antigravity 2.0 SDK 연동 가이드</h3>
        <p style="font-size:12px;color:#cbd5e1;">하단 내장 터미널 또는 외부 터미널/스크립트에서 자비스의 모든 오픈모델과 5단계 파이프라인을 제어할 수 있습니다.</p>
        <div style="background:#040812;border:1px solid rgba(56,189,248,0.3);border-radius:10px;padding:10px;margin-bottom:10px;font-family:monospace;font-size:11.5px;">
          # 1. 자비스 CLI 명령어<br/>
          node bin/jarvis-cli.js status<br/>
          node bin/jarvis-cli.js models<br/>
          node bin/jarvis-cli.js select ollama gemma4:e4b<br/>
          node bin/jarvis-cli.js plan "소풍 홈페이지 웹디자인 및 엑셀·워드 6종 기획서 제작"<br/>
          node bin/jarvis-cli.js approve
        </div>
        <h4 style="color:#fbbf24;margin:8px 0 4px 0;">🐍 Antigravity Python SDK (` + '`google-antigravity`' + `) 연동 템플릿</h4>
        <pre style="background:#040812;border:1px solid rgba(251,191,36,0.3);border-radius:10px;padding:10px;font-family:monospace;font-size:11px;overflow-x:auto;color:#e2e8f0;">${pyCode}</pre>
      `;
      return;
    }

    if (this.activeRightTab === 'MODELS_8DOMAIN') {
      const cat = this.catalogData;
      const recs = cat?.recommendedCatalog || [];
      const runnow = cat?.runnowOnDeviceModels || [];
      const domains = cat?.productionDomains || [];

      body.innerHTML = `
        <h3 style="color:#00f0ff;margin-top:0;">⭐ 1. LM Studio &amp; Ollama 추천 다운로드 오픈모델 TOP 6</h3>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
          ${recs.map(r => `
            <div style="background:rgba(15,23,42,0.88);border:1px solid rgba(56,189,248,0.3);border-radius:10px;padding:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                <b style="color:#fff;font-size:12.5px;">${r.name}</b>
                <span style="font-size:10px;background:rgba(251,191,36,0.18);color:#fbbf24;padding:2px 8px;border-radius:999px;font-weight:800;">${r.rank} · ${r.quantization}</span>
              </div>
              <div style="font-size:11.5px;color:#cbd5e1;margin:5px 0;">${r.description}</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
                <button type="button" class="win-ctrl-btn btn-install-model-cmd" data-cmd="${r.ollamaPullCmd}" style="border-color:#34d399;color:#34d399;font-weight:700;">
                  ⬇️ Ollama로 즉시 설치 (${r.ollamaPullCmd})
                </button>
                <button type="button" class="win-ctrl-btn btn-install-model-cmd" data-cmd="${r.lmsGetCmd}" style="border-color:#c084fc;color:#c084fc;">
                  ⬇️ LM Studio CLI 다운로드 (${r.lmStudioId})
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <h3 style="color:#34d399;">🎨 2. 앞으로 제작할 8대 도메인별 자비스 자율 선택 오픈모델 매트릭스</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
          ${domains.map(d => `
            <div style="background:rgba(15,23,42,0.85);border:1px solid rgba(52,211,153,0.28);border-radius:10px;padding:9px;">
              <div style="font-weight:800;color:#34d399;font-size:12px;margin-bottom:4px;">${d.domainName}</div>
              <div style="font-size:11px;color:#e2e8f0;"><b>주력 오픈모델</b>: ${d.primaryOpenModels.join(', ')}</div>
              <div style="font-size:10.5px;color:#94a3b8;"><b>모바일(RunNow)</b>: ${d.mobileFallbackModel}</div>
              <div style="font-size:10.5px;color:#38bdf8;"><b>본사 스킬</b>: ${d.linkedBscSkills.join(', ')}</div>
            </div>
          `).join('')}
        </div>

        <h3 style="color:#fbbf24;">📱 3. RunNow 앱 온디바이스 15대 오픈모델 (모바일·브라우저 WebGPU 표준)</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          ${runnow.map(m => `
            <div style="background:rgba(15,23,42,0.78);border:1px solid rgba(251,191,36,0.25);border-radius:8px;padding:7px;font-size:11px;">
              <b style="color:#fef08a;">${m.name}</b> <span style="color:#94a3b8;">(${m.sizeMb}MB · ${m.category})</span>
              <div style="color:#cbd5e1;font-size:10.5px;margin-top:2px;">${m.role}</div>
            </div>
          `).join('')}
        </div>
      `;

      body.querySelectorAll('.btn-install-model-cmd').forEach(btn => {
        btn.addEventListener('click', () => {
          const cmd = btn.dataset.cmd;
          if (cmd) {
            window.BSC_WORLDVIEW?.showToast('⬇️ 오픈모델 설치 시작', `하단 내장 터미널에서 "${cmd}" 실행을 시작했습니다.`);
            this.executeTerminalCommand(cmd);
          }
        });
      });
      return;
    }

    // Default Tab: PLAN_5STEP (상황 판단 -> 모델 선택(스스로) -> 보고 후 계획 준비 -> 승인 -> 제작)
    body.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(0,240,255,0.12),rgba(251,191,36,0.12));border:1px solid rgba(251,191,36,0.45);border-radius:12px;padding:12px;margin-bottom:12px;">
        <div style="font-size:12.5px;font-weight:800;color:#fbbf24;margin-bottom:6px;">
          🚀 자비스 5단계 자율 제작 오케스트레이터 (상황 판단 ➔ 모델 선택 ➔ 계획 보고 ➔ 승인 ➔ 제작)
        </div>
        <form id="ide-new-5step-form" style="display:flex;gap:6px;">
          <input type="text" id="ide-new-5step-input" placeholder="제작할 작업 입력 (예: 소풍 홈페이지 웹디자인 및 워드·PPT·엑셀·PDF 6종 기획서 제작)..." style="flex:1;background:rgba(5,9,20,0.9);border:1px solid rgba(56,189,248,0.4);border-radius:8px;padding:8px 10px;color:#fff;font-size:12px;" />
          <button type="submit" class="hud-mini-btn primary" style="flex:0 0 auto;padding:8px 14px;font-weight:800;">🧠 1~3단계 계획 수립</button>
        </form>
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;">
        ${this.pendingPlans.map(p => `
          <div style="background:rgba(15,23,42,0.92);border:1px solid ${p.status === 'COMPLETED' ? '#34d399' : '#fbbf24'};border-radius:12px;padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:6px;">
              <span style="font-size:12px;font-weight:800;color:${p.status === 'COMPLETED' ? '#34d399' : '#fbbf24'};">
                ${p.status === 'COMPLETED' ? '✅ [5단계 제작 완료]' : '⏳ [4단계 대표님 승인 대기]'} ${p.userPrompt}
              </span>
              <span style="font-size:10px;color:#94a3b8;font-family:monospace;">${p.planId}</span>
            </div>
            <div style="font-size:11.5px;color:#e2e8f0;line-height:1.55;margin-bottom:8px;">
              • <b>1단계 [상황 판단]</b>: ${p.step1_judgment?.domainName} (${p.step1_judgment?.securityHarnessCheck})<br/>
              • <b>2단계 [자율 선택 모델]</b>: <span style="color:#00f0ff;font-weight:800;">[${p.step2_modelSelection?.activeProvider?.toUpperCase()}] ${p.step2_modelSelection?.selectedBrainModel}</span> + ${p.step2_modelSelection?.domainOpenModels?.join(', ')}<br/>
              • <b>선정 사유</b>: ${p.step2_modelSelection?.selectionReason}<br/>
              • <b>연동 본사 스킬</b>: ${p.step2_modelSelection?.linkedBscSkills?.join(', ')}<br/>
              • <b>3단계 [적용 계획 산출물]</b>: ${p.step3_projectPlan?.expectedDeliverables?.join(' · ')}
            </div>

            ${p.status !== 'COMPLETED' ? `
              <button type="button" class="hud-mini-btn primary btn-approve-plan-ide" data-plan-id="${p.planId}" style="background:#16a34a;border-color:#34d399;color:#fff;font-weight:800;padding:8px 16px;width:100%;">
                ✅ 4단계 대표님 승인 ➔ 5단계 즉시 제작 실행 (Word·PPT·MD·PDF·Excel·프리뷰 생성)
              </button>
            ` : `
              <div style="background:rgba(6,12,24,0.9);border:1px solid rgba(52,211,153,0.35);border-radius:9px;padding:9px;margin-top:6px;">
                <div style="font-size:11px;font-weight:800;color:#34d399;margin-bottom:6px;">📦 생성 완료된 6종 문서 &amp; 인터랙티브 결과물 (원클릭 열람/다운로드)</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  ${p.deliverables?.interactivePreview ? `<a href="${p.deliverables.interactivePreview}" target="_blank" class="win-ctrl-btn" style="border-color:#00f0ff;color:#00f0ff;text-decoration:none;font-weight:800;">🌐 인터랙티브 결과물 뷰어 ↗</a>` : ''}
                  ${p.deliverables?.excelXls ? `<a href="${p.deliverables.excelXls}" download class="win-ctrl-btn" style="border-color:#34d399;color:#34d399;text-decoration:none;font-weight:800;">📊 Excel (.xls) 다운로드</a>` : ''}
                  ${p.deliverables?.wordDocx ? `<a href="${p.deliverables.wordDocx}" download class="win-ctrl-btn" style="text-decoration:none;">📘 Word (.docx)</a>` : ''}
                  ${p.deliverables?.pptPptx ? `<a href="${p.deliverables.pptPptx}" download class="win-ctrl-btn" style="text-decoration:none;">📙 PPT (.pptx)</a>` : ''}
                  ${p.deliverables?.pdf ? `<a href="${p.deliverables.pdf}" target="_blank" class="win-ctrl-btn" style="text-decoration:none;">📕 PDF (.pdf)</a>` : ''}
                  ${p.deliverables?.markdown ? `<a href="${p.deliverables.markdown}" target="_blank" class="win-ctrl-btn" style="text-decoration:none;">📝 Markdown (.md)</a>` : ''}
                </div>
              </div>
            `}
          </div>
        `).join('') || '<div style="color:#94a3b8;font-size:12px;">위 입력창이나 하단 자비스 채팅창에 제작할 작업(웹디자인, 엑셀·워드·PPT 문서, 3D, 코드 등)을 입력하시면 자비스가 스스로 상황을 판단하고 최적 오픈모델을 골라 계획서를 보고합니다.</div>'}
      </div>
    `;

    body.querySelector('#ide-new-5step-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = body.querySelector('#ide-new-5step-input');
      const prompt = (input?.value || '').trim();
      if (!prompt) return;
      input.value = '';
      const res = await fetch('/api/jarvis/autonomous-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, clientEnv: 'IDE_2.0' })
      }).then(r => r.json());
      if (res && res.ok && res.plan) {
        window.MultimodalEngine?.speakStewardReply(
          `이건우 대표님, 지시하신 안건에 대해 ${res.plan.step1_judgment.domainName} 도메인으로 판단하고 ${res.plan.step2_modelSelection.selectedBrainModel} 모델을 선택하여 적용 계획서를 준비했습니다. 승인해 주시면 즉시 제작하겠습니다.`
        );
        this.refreshCatalogAndPlans();
      }
    });

    body.querySelectorAll('.btn-approve-plan-ide').forEach(btn => {
      btn.addEventListener('click', () => {
        this.approveAndRunPlan(btn.dataset.planId);
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.JarvisIdeWorkbench.init();
});
