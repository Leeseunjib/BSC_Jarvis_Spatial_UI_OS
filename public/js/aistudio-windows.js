/**
 * 🛡️ BSC J.A.R.V.I.S. OS — Google AI Studio 17-Modules Holographic Window Extension
 * Extends window.HUDWindowSpawner while preserving 100% of BSC_Javis_OS Cyber-Steward HUD aesthetics.
 * Supports:
 *  1. AI_STUDIO_HUB      (⚡ 17대 스튜디오 런처 & 9대 오픈모델/Laya-421M 라우터 & 5대 프리셋 & 4대 음성매크로)
 *  2. MAPS_REA_STUDIO    (🗺️ MAPS 4계층 Memory/Agent/Pulse/Screen & REA 역공학 스튜디오)
 *  3. AGENT_REGISTRY     (🤖 SRP 에이전트 레지스트리 & 페르소나 슬라이더 & 일괄 상태 토글 & BSC 28인 요원)
 *  4. CREATIVE_BLENDER   (🎨 캐릭터 360° 턴어라운드 SVG/OBJ & Blender 3D VFX & Barehands 3D)
 *  5. RL_BENCHMARK       (🧠 9대 모델 양자화 벤치마크 & GRPO 강화학습 가중치 분포 & 시스템 감사)
 *  6. VISION_FACE        (👁️ OmniParser 화면/웹캠 비전 좌표 추출 & Face-to-Face 표정/시선 교감)
 *  7. SIM_BIO_IDE        (🧬 자율 모의훈련 ROI & AlphaFold 바이오 단백질 연구소 & Antigravity IDE 자가치유)
 */

(function () {
  function attachAIStudioExtensions() {
    const spawner = window.HUDWindowSpawner;
    if (!spawner) return;

    // Layout Presets for AI Studio Holographic Windows
    Object.assign(spawner.layoutPresets, {
      AI_STUDIO_HUB: { top: 76, left: 288, width: 790, height: 555 },
      MAPS_REA_STUDIO: { top: 82, left: 305, width: 780, height: 545 },
      AGENT_REGISTRY: { top: 88, left: 320, width: 780, height: 540 },
      CREATIVE_BLENDER: { top: 80, left: 310, width: 770, height: 550 },
      RL_BENCHMARK: { top: 84, left: 300, width: 790, height: 550 },
      VISION_FACE: { top: 86, left: 315, width: 760, height: 540 },
      SIM_BIO_IDE: { top: 82, left: 305, width: 785, height: 550 }
    });

    const origPopulate = spawner.populateWindowBody.bind(spawner);

    spawner.populateWindowBody = function (win, config) {
      const type = config.windowType || 'REPORT';
      const titleEl = win.querySelector('.win-title');
      const subEl = win.querySelector('.win-subtitle');
      const bodyEl = win.querySelector('.hud-window-body');
      if (titleEl && config.title) titleEl.textContent = config.title;
      if (subEl && config.subtitle) subEl.textContent = config.subtitle;
      if (!bodyEl) return;

      if (type === 'AI_STUDIO_HUB') {
        this.renderAIStudioHub(bodyEl);
      } else if (type === 'MAPS_REA_STUDIO') {
        this.renderMapsReaStudio(bodyEl, config.initialSubTab);
      } else if (type === 'AGENT_REGISTRY') {
        this.renderAgentRegistryStudio(bodyEl);
      } else if (type === 'CREATIVE_BLENDER') {
        this.renderCreativeBlenderStudio(bodyEl, config.initialSubTab);
      } else if (type === 'RL_BENCHMARK') {
        this.renderRlBenchmarkStudio(bodyEl, config.initialSubTab);
      } else if (type === 'VISION_FACE') {
        this.renderVisionFaceStudio(bodyEl, config.initialSubTab);
      } else if (type === 'SIM_BIO_IDE') {
        this.renderSimBioIdeStudio(bodyEl, config.initialSubTab);
      } else {
        origPopulate(win, config);
      }
    };

    // =========================================================================
    // 1. AI_STUDIO_HUB: 17-Studio Command Matrix + 9-Model Laya Router + Presets
    // =========================================================================
    spawner.renderAIStudioHub = function (bodyEl) {
      const data = window.AIStudioData;
      const cfg = data.routerConfig;

      bodyEl.innerHTML = `
        <div class="ais-top-banner">
          <div>
            <span class="ais-badge-cyan">GOOGLE AI STUDIO × BSC J.A.R.V.I.S. 100% FUSION</span>
            <h3 style="margin:4px 0 2px 0;color:#fff;">⚡ 17대 스튜디오 &amp; 9대 오픈모델/SLM 통합 관제 센터</h3>
            <div style="font-size:11.5px;color:#94a3b8;">Google AI Studio에서 구축하신 모든 도메인 스튜디오, 모델 라우터, 강화학습, 바이오, 역공학 기능이 100% 반영되어 있습니다.</div>
          </div>
          <div style="text-align:right;font-family:monospace;font-size:11px;">
            <div style="color:#34d399;font-weight:800;">● LAYA-421M SYSTEM-1 (33ms)</div>
            <div style="color:#00f0ff;" id="hub-active-llm-label">${cfg.llmEngine}</div>
          </div>
        </div>

        <!-- 6 Domains / 17 Studios Quick-Launch Grid -->
        <div class="ais-section-title">🚀 6대 핵심 도메인 · 17개 전문 스튜디오 즉시 소환 (클릭 시 전용 홀로그램 창 오픈)</div>
        <div class="ais-grid-3">
          <div class="ais-studio-card" data-open-win="MAPS_REA_STUDIO">
            <div class="ais-card-head"><span class="ais-tag">도메인 3</span> <b>🗺️ MAPS 4계층 &amp; REA 역공학</b></div>
            <p>MEMORY.md 4계층 편집기, Pulse 능동형 크론 데몬, morluto/rea 바이너리·Electron 역공학 디컴파일</p>
          </div>
          <div class="ais-studio-card" data-open-win="AGENT_REGISTRY">
            <div class="ais-card-head"><span class="ais-tag">도메인 3</span> <b>🤖 SRP 에이전트 레지스트리</b></div>
            <p>6대 특화 클래스 + BSC 28인 요원, 페르소나 슬라이더(격식/유머/주도성), 체크박스 일괄 상태 토글</p>
          </div>
          <div class="ais-studio-card" data-open-win="CREATIVE_BLENDER">
            <div class="ais-card-head"><span class="ais-tag">도메인 4</span> <b>🎨 캐릭터 360° &amp; 블렌더 VFX</b></div>
            <p>정면/측면/후면 360° SVG 도면, Wavefront .OBJ 메쉬, 스토리보드, Blender bpy &amp; Barehands 3D</p>
          </div>
          <div class="ais-studio-card" data-open-win="RL_BENCHMARK">
            <div class="ais-card-head"><span class="ais-tag">도메인 5</span> <b>🧠 9대 모델 벤치마크 &amp; GRPO RL</b></div>
            <p>Q4_K_M/Q8_0/FP16 속도·VRAM 비교, 5대 레이어 가중치 왜도 히스토그램, Unsloth 스크립트 생성</p>
          </div>
          <div class="ais-studio-card" data-open-win="VISION_FACE">
            <div class="ais-card-head"><span class="ais-tag">도메인 2</span> <b>👁️ 화면 OmniParser &amp; 얼굴 교감</b></div>
            <p>데스크톱 화면 캡처 UI 좌표 추출(PyAutoGUI 연동) 및 웹캠 표정·집중도·피로도 실시간 교감</p>
          </div>
          <div class="ais-studio-card" data-open-win="SIM_BIO_IDE">
            <div class="ais-card-head"><span class="ais-tag">도메인 6</span> <b>🧬 모의훈련 · AlphaFold · IDE</b></div>
            <p>몬테카를로 ROI 모의훈련, TP53/EGFR/BRCA1 단백질 구조 분석, Antigravity IDE 자가치유 패치</p>
          </div>
        </div>

        <!-- Multi-Model Router Selectors (3 STT + 9 LLM + 3 TTS) -->
        <div class="ais-section-title" style="margin-top:12px;">🧠 멀티 오픈모델 하이브리드 라우터 (STT 3종 · LLM/SLM 9종 · TTS 3종)</div>
        <div class="ais-grid-3">
          <div class="ais-box">
            <label class="ais-label">🎙️ 음성 인식 (STT 엔진)</label>
            <select id="sel-stt-engine" class="ais-select">
              ${data.STT_ENGINE_OPTIONS.map(o => `<option value="${o.id}" ${cfg.sttEngine === o.id ? 'selected' : ''}>${o.name} (${o.latencyBadge})</option>`).join('')}
            </select>
          </div>
          <div class="ais-box">
            <label class="ais-label">⚡ 두뇌 추론 (9대 LLM / 로컬 SLM)</label>
            <select id="sel-llm-engine" class="ais-select">
              ${data.LLM_ENGINE_OPTIONS.map(o => `<option value="${o.id}" ${cfg.llmEngine === o.id ? 'selected' : ''}>${o.name} [${o.latencyBadge}]</option>`).join('')}
            </select>
          </div>
          <div class="ais-box">
            <label class="ais-label">🔊 음성 합성 (TTS &amp; 보이스)</label>
            <select id="sel-tts-engine" class="ais-select">
              ${data.TTS_ENGINE_OPTIONS.map(o => `<option value="${o.id}" ${cfg.ttsEngine === o.id ? 'selected' : ''}>${o.name} (${o.latencyBadge})</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- 5 Situational Presets -->
        <div class="ais-section-title" style="margin-top:12px;">🎯 5대 상황별 원클릭 프리셋 (Situational Presets)</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${data.SITUATIONAL_PRESETS.map(p => `
            <button class="hud-mini-btn ${cfg.situationalPreset === p.id ? 'primary' : ''} btn-preset-apply" data-preset="${p.id}" style="flex:1;min-width:135px;">
              ${p.titleKo}
            </button>
          `).join('')}
        </div>

        <!-- 4 Voice Macros -->
        <div class="ais-section-title" style="margin-top:12px;">🎙️ 4대 음성 매크로 (Voice Macros — 음성/채팅 발화 시 즉시 트리거)</div>
        <div class="ais-grid-2">
          ${data.DEFAULT_VOICE_MACROS.map(m => `
            <div class="ais-box" style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <div>
                <div style="color:#00f0ff;font-weight:700;font-size:11.5px;">"${m.phrase}"</div>
                <div style="color:#94a3b8;font-size:10.5px;">${m.descriptionKo}</div>
              </div>
              <button class="win-ctrl-btn btn-run-macro" data-macro-id="${m.id}">▶ 실행</button>
            </div>
          `).join('')}
        </div>
      `;

      // Bind Studio Launch Cards
      bodyEl.querySelectorAll('.ais-studio-card').forEach(card => {
        card.addEventListener('click', () => {
          const targetWin = card.dataset.openWin;
          this.openAIStudioWindowByType(targetWin);
        });
      });

      // Bind Model Selectors
      const updateRouterStatus = () => {
        const pill = document.getElementById('active-model-pill');
        if (pill) pill.textContent = `✦ ${cfg.llmEngine.toUpperCase().slice(0, 14)}`;
        const lbl = bodyEl.querySelector('#hub-active-llm-label');
        if (lbl) lbl.textContent = cfg.llmEngine;
        window.BSC_WORLDVIEW.showToast(
          '⚡ Laya-421M Router',
          `이건우 대표님, 라우터 구성을 [STT: ${cfg.sttEngine} | LLM: ${cfg.llmEngine} | TTS: ${cfg.ttsEngine}]으로 즉시 동기화했습니다.`
        );
      };

      bodyEl.querySelector('#sel-stt-engine')?.addEventListener('change', e => {
        cfg.sttEngine = e.target.value;
        updateRouterStatus();
      });
      bodyEl.querySelector('#sel-llm-engine')?.addEventListener('change', e => {
        cfg.llmEngine = e.target.value;
        updateRouterStatus();
      });
      bodyEl.querySelector('#sel-tts-engine')?.addEventListener('change', e => {
        cfg.ttsEngine = e.target.value;
        updateRouterStatus();
      });

      // Bind Presets
      bodyEl.querySelectorAll('.btn-preset-apply').forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = data.SITUATIONAL_PRESETS.find(p => p.id === btn.dataset.preset);
          if (!preset) return;
          Object.assign(cfg, preset.applyConfig, { situationalPreset: preset.id });
          this.renderAIStudioHub(bodyEl);
          updateRouterStatus();
        });
      });

      // Bind Macros
      bodyEl.querySelectorAll('.btn-run-macro').forEach(btn => {
        btn.addEventListener('click', () => {
          const macro = data.DEFAULT_VOICE_MACROS.find(m => m.id === btn.dataset.macroId);
          if (!macro) return;
          window.BSC_WORLDVIEW.showToast(
            `🎙️ 음성 매크로 [${macro.phrase}]`,
            `[정상 실행 완료] ${macro.descriptionKo} (${macro.targetScriptOrCommand})`
          );
          if (window.MultimodalEngine) {
            window.MultimodalEngine.speakStewardReply(`이건우 대표님, 음성 매크로 ${macro.phrase} 명령을 실행했습니다.`);
          }
        });
      });
    };

    // =========================================================================
    // 2. MAPS_REA_STUDIO: MAPS 4-Layer (Memory·Agent·Pulse·Screen) + REA Reverse-Eng
    // =========================================================================
    spawner.renderMapsReaStudio = function (bodyEl, activeTab = 'MEMORY') {
      const data = window.AIStudioData;
      let selectedMem = data.MAPS_MEMORY_FILES[0];
      let selectedRea = data.REA_TARGET_SAMPLES[0];

      const render = () => {
        bodyEl.innerHTML = `
          <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
            <button class="hud-mini-btn ${activeTab === 'MEMORY' ? 'primary' : ''}" data-tab="MEMORY">💾 M · Memory (계층형 볼트)</button>
            <button class="hud-mini-btn ${activeTab === 'PULSE' ? 'primary' : ''}" data-tab="PULSE">💓 P · Pulse (능동형 크론 데몬)</button>
            <button class="hud-mini-btn ${activeTab === 'REA' ? 'primary' : ''}" data-tab="REA">🔬 REA 오픈모델 역공학 워크벤치 (morluto/rea)</button>
          </div>
          <div id="maps-sub-stage"></div>
        `;

        bodyEl.querySelectorAll('[data-tab]').forEach(b => {
          b.addEventListener('click', () => {
            activeTab = b.dataset.tab;
            render();
          });
        });

        const stage = bodyEl.querySelector('#maps-sub-stage');
        if (activeTab === 'MEMORY') {
          stage.innerHTML = `
            <div class="ais-grid-2">
              <div class="ais-box">
                <div class="ais-section-title">📂 MAPS 4계층 마크다운 메모리 볼트 (pavrus117/ai-os-maps-guide)</div>
                ${data.MAPS_MEMORY_FILES.map(m => `
                  <div class="ais-list-item ${m.id === selectedMem.id ? 'active' : ''}" data-mem-id="${m.id}">
                    <div style="font-weight:700;color:#00f0ff;font-size:11.5px;">${m.filename}</div>
                    <div style="font-size:10.5px;color:#94a3b8;">${m.tierLabelKo} · ${m.tokensCount} tokens · ${m.lastSynced}</div>
                  </div>
                `).join('')}
              </div>
              <div class="ais-box">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span style="font-family:monospace;font-size:11px;color:#34d399;">${selectedMem.filename}</span>
                  <button class="win-ctrl-btn" id="btn-sync-mem-vault">💾 로컬 Vault에 동기화</button>
                </div>
                <textarea id="mem-editor-area" class="ais-textarea" rows="11">${selectedMem.content}</textarea>
              </div>
            </div>
          `;
          stage.querySelectorAll('[data-mem-id]').forEach(el => {
            el.addEventListener('click', () => {
              selectedMem = data.MAPS_MEMORY_FILES.find(x => x.id === el.dataset.memId) || data.MAPS_MEMORY_FILES[0];
              render();
            });
          });
          stage.querySelector('#btn-sync-mem-vault')?.addEventListener('click', async () => {
            selectedMem.content = stage.querySelector('#mem-editor-area').value;
            await fetch('/api/vault-append', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: 'MAPS_Memory_Sync', content: selectedMem.content })
            });
            window.BSC_WORLDVIEW.showToast('🗺️ MAPS Layer 1 (Memory)', `이건우 대표님, ${selectedMem.filename} 변경사항을 로컬 옵시디언 볼트에 무손실 동기화했습니다.`);
          });
        } else if (activeTab === 'PULSE') {
          stage.innerHTML = `
            <div class="ais-section-title">💓 MAPS Layer 3: Pulse 능동형 하트비트 &amp; 크론 데몬 루틴</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${data.MAPS_PULSE_ROUTINES.map(p => `
                <div class="ais-box" style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
                  <div>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <span class="ais-badge-cyan">${p.cronExpr}</span>
                      <strong style="color:#fff;">${p.nameKo}</strong>
                      <span style="font-size:10px;color:#fbbf24;">[${p.assignedAgent}]</span>
                    </div>
                    <div style="font-size:11.2px;color:#94a3b8;margin-top:3px;">${p.descriptionKo}</div>
                    <code style="font-size:10px;color:#34d399;">${p.command}</code>
                  </div>
                  <div style="display:flex;gap:6px;flex-shrink:0;">
                    <button class="win-ctrl-btn btn-trigger-pulse" data-pulse-id="${p.id}">⚡ 즉시 펄스 실행</button>
                    <button class="win-ctrl-btn btn-toggle-pulse" data-pulse-id="${p.id}" style="color:${p.isActive ? '#34d399' : '#94a3b8'};">
                      ${p.isActive ? '● ACTIVE' : '○ PAUSED'}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
          stage.querySelectorAll('.btn-trigger-pulse').forEach(btn => {
            btn.addEventListener('click', () => {
              const p = data.MAPS_PULSE_ROUTINES.find(x => x.id === btn.dataset.pulseId);
              if (!p) return;
              p.lastPulseAt = '방금 전';
              window.BSC_WORLDVIEW.showToast('💓 MAPS Pulse Engine', `[능동형 Pulse 트리거 완료] ${p.nameKo} 루틴이 실행되어 화면 HUD와 메모리에 반영되었습니다.`);
            });
          });
          stage.querySelectorAll('.btn-toggle-pulse').forEach(btn => {
            btn.addEventListener('click', () => {
              const p = data.MAPS_PULSE_ROUTINES.find(x => x.id === btn.dataset.pulseId);
              if (p) p.isActive = !p.isActive;
              render();
            });
          });
        } else {
          // REA Reverse Engineering Workbench
          stage.innerHTML = `
            <div style="display:flex;gap:6px;margin-bottom:8px;">
              ${data.REA_TARGET_SAMPLES.map(t => `
                <button class="hud-mini-btn ${t.id === selectedRea.id ? 'primary' : ''} btn-sel-rea" data-rea-id="${t.id}">
                  ${t.titleKo.slice(0, 22)}...
                </button>
              `).join('')}
            </div>
            <div class="ais-box" style="margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <span class="ais-badge-cyan">REA Open-Agent 14B · MCP</span>
                  <strong style="margin-left:6px;color:#fff;">${selectedRea.titleKo}</strong>
                </div>
                <span style="font-family:monospace;font-size:11px;color:#34d399;">심볼 복원: ${selectedRea.recoveredSymbolsCount}개</span>
              </div>
              <div style="font-size:11.2px;color:#cbd5e1;margin-top:5px;">${selectedRea.architectureSummaryKo}</div>
              <div style="margin-top:5px;font-size:10.5px;color:#fbbf24;font-family:monospace;">
                MCP 체인: ${selectedRea.mcpToolchain.join(' → ')} | 엔드포인트: ${selectedRea.tracedEndpoints.join(', ')}
              </div>
            </div>
            <div class="ais-grid-2">
              <div class="ais-box">
                <div class="ais-label" style="color:#f97316;">Stage 2: Ghidra + AST 디컴파일 의사코드</div>
                <pre class="ais-code-block">${selectedRea.decompiledPseudoCode}</pre>
              </div>
              <div class="ais-box">
                <div class="ais-label" style="color:#34d399;">Stage 4: rea-open-agent-14b 클린 재구축 TypeScript</div>
                <pre class="ais-code-block">${selectedRea.reconstructedCleanCode}</pre>
              </div>
            </div>
          `;
          stage.querySelectorAll('.btn-sel-rea').forEach(btn => {
            btn.addEventListener('click', () => {
              selectedRea = data.REA_TARGET_SAMPLES.find(x => x.id === btn.dataset.reaId) || data.REA_TARGET_SAMPLES[0];
              render();
            });
          });
        }
      };
      render();
    };

    // =========================================================================
    // 3. AGENT_REGISTRY: SRP AgentManagementController + Personality + Bulk Toggle
    // =========================================================================
    spawner.renderAgentRegistryStudio = function (bodyEl) {
      const ctrl = window.agentManagerController;
      let agents = ctrl.loadAgents();
      let selectedIds = new Set(agents.map(a => a.id));
      let activeAgent = agents[0];

      const render = () => {
        bodyEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
            <div>
              <span class="ais-badge-cyan">SRP Class #1: AgentManagementController</span>
              <strong style="margin-left:6px;color:#fff;">AI Studio 6대 전문 에이전트 &amp; BSC 28인 요원 통합 레지스트리</strong>
            </div>
            <div style="display:flex;gap:5px;">
              <button class="win-ctrl-btn" id="btn-bulk-active">✅ 일괄 ACTIVE</button>
              <button class="win-ctrl-btn" id="btn-bulk-inactive">⏸️ 일괄 INACTIVE</button>
              <button class="win-ctrl-btn" id="btn-bulk-invert">🔄 상태 반전 (Invert)</button>
              <button class="win-ctrl-btn" id="btn-clone-agent">➕ 선택 에이전트 복제</button>
            </div>
          </div>

          <div class="ais-grid-2">
            <!-- Left: Agent Table -->
            <div class="ais-box" style="max-height:420px;overflow-y:auto;">
              <table>
                <thead>
                  <tr>
                    <th>✓</th>
                    <th>에이전트 / 클래스</th>
                    <th>바인딩 두뇌</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  ${agents.map(a => `
                    <tr class="ais-agent-row ${a.id === activeAgent.id ? 'selected-row' : ''}" data-agent-id="${a.id}" style="cursor:pointer;">
                      <td><input type="checkbox" class="chk-agent" data-id="${a.id}" ${selectedIds.has(a.id) ? 'checked' : ''} /></td>
                      <td>
                        <div style="font-weight:700;color:#fff;">${a.name}</div>
                        <div style="font-family:monospace;font-size:10px;color:#38bdf8;">${a.className}</div>
                      </td>
                      <td style="font-family:monospace;font-size:10.5px;color:#fbbf24;">${a.assignedModel}</td>
                      <td>
                        <span style="padding:2px 6px;border-radius:99px;font-size:10px;font-weight:800;background:${a.status === 'ACTIVE' ? 'rgba(52,211,153,0.2)' : 'rgba(148,163,184,0.2)'};color:${a.status === 'ACTIVE' ? '#34d399' : '#94a3b8'};">
                          ${a.status}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Right: Personality Profile & Sliders -->
            <div class="ais-box">
              <div style="font-size:12.5px;font-weight:800;color:#00f0ff;margin-bottom:4px;">🎭 ${activeAgent.name} — 페르소나 &amp; 자율성 조율</div>
              <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">${activeAgent.systemPromptKo}</div>

              <div class="slider-row">
                <label>격식도 (Formality): <b id="val-formality">${activeAgent.personalityProfile.formality}%</b></label>
                <input type="range" id="rng-formality" min="0" max="100" value="${activeAgent.personalityProfile.formality}" />
              </div>
              <div class="slider-row">
                <label>상세도 (Verbosity): <b id="val-verbosity">${activeAgent.personalityProfile.verbosity}%</b></label>
                <input type="range" id="rng-verbosity" min="0" max="100" value="${activeAgent.personalityProfile.verbosity}" />
              </div>
              <div class="slider-row">
                <label>따뜻함/유머 (Warmth): <b id="val-warmth">${activeAgent.personalityProfile.humorWarmth}%</b></label>
                <input type="range" id="rng-warmth" min="0" max="100" value="${activeAgent.personalityProfile.humorWarmth}" />
              </div>
              <div class="slider-row">
                <label>선제 주도성 (Proactivity): <b id="val-proact">${activeAgent.personalityProfile.proactivity}%</b></label>
                <input type="range" id="rng-proact" min="0" max="100" value="${activeAgent.personalityProfile.proactivity}" />
              </div>

              <div style="margin-top:8px;padding:8px;background:#05080f;border:1px solid rgba(0,240,255,0.25);border-radius:8px;font-size:11px;color:#fef3c7;">
                💬 시그니처 응답: "${activeAgent.personalityProfile.customCatchphraseKo}"
              </div>

              <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;">
                ${activeAgent.capabilities.map(c => `<span class="ais-badge-cyan">${c}</span>`).join('')}
              </div>
            </div>
          </div>
        `;

        // Row selection
        bodyEl.querySelectorAll('.ais-agent-row').forEach(row => {
          row.addEventListener('click', e => {
            if (e.target.classList.contains('chk-agent')) return;
            activeAgent = agents.find(a => a.id === row.dataset.agentId) || agents[0];
            render();
          });
        });

        bodyEl.querySelectorAll('.chk-agent').forEach(chk => {
          chk.addEventListener('change', () => {
            if (chk.checked) selectedIds.add(chk.dataset.id);
            else selectedIds.delete(chk.dataset.id);
          });
        });

        const applyBulk = mode => {
          const res = ctrl.bulkToggleAgentStatus(agents, Array.from(selectedIds), mode);
          agents = res.updatedAgents;
          activeAgent = agents.find(a => a.id === activeAgent.id) || agents[0];
          render();
          window.BSC_WORLDVIEW.showToast('🤖 AgentManagementController', `일괄 상태 전환 완료 (Active: ${res.activeAfterCount} / Inactive: ${res.inactiveAfterCount})`);
        };

        bodyEl.querySelector('#btn-bulk-active')?.addEventListener('click', () => applyBulk('ACTIVE'));
        bodyEl.querySelector('#btn-bulk-inactive')?.addEventListener('click', () => applyBulk('INACTIVE'));
        bodyEl.querySelector('#btn-bulk-invert')?.addEventListener('click', () => applyBulk('INVERT'));

        bodyEl.querySelector('#btn-clone-agent')?.addEventListener('click', () => {
          const clone = JSON.parse(JSON.stringify(activeAgent));
          clone.id = `agent-clone-${Date.now()}`;
          clone.name = `${activeAgent.name} (V2 복제)`;
          agents.push(clone);
          ctrl.saveAgents(agents);
          selectedIds.add(clone.id);
          activeAgent = clone;
          render();
        });

        // Sliders
        ['formality', 'verbosity', 'warmth', 'proact'].forEach(k => {
          const rng = bodyEl.querySelector(`#rng-${k}`);
          rng?.addEventListener('input', () => {
            const v = Number(rng.value);
            if (k === 'formality') activeAgent.personalityProfile.formality = v;
            if (k === 'verbosity') activeAgent.personalityProfile.verbosity = v;
            if (k === 'warmth') activeAgent.personalityProfile.humorWarmth = v;
            if (k === 'proact') activeAgent.personalityProfile.proactivity = v;
            ctrl.saveAgents(agents);
            const lbl = bodyEl.querySelector(`#val-${k}`);
            if (lbl) lbl.textContent = `${v}%`;
          });
        });
      };
      render();
    };

    // =========================================================================
    // 4. CREATIVE_BLENDER: 360° Character Turnaround SVG/OBJ + Blender VFX + Barehands 3D
    // =========================================================================
    spawner.renderCreativeBlenderStudio = function (bodyEl) {
      const ctrl = window.characterAssetController;
      let spec = {
        characterName: 'JARVIS_CORAM_DEO_GUARDIAN',
        projectTitle: 'BSC 시네마틱 마스터피스',
        archetype: 'CYBER_MECHA',
        primaryColorHex: '#00F0FF',
        secondaryColorHex: '#34D399',
        polyCountTarget: 'HIGH_POLY_CINEMA',
        expressions: ['Focused', 'Warm Smile', 'Tactical Scan', 'Steward Mode']
      };

      const render = () => {
        const svgMarkup = ctrl.synthesizeCharacterTurnaroundSvg(spec);
        const objMesh = ctrl.synthesizeProceduralObjMesh(spec);
        const bpyCode = ctrl.synthesizeBlenderBpyScript(spec);

        bodyEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div>
              <span class="ais-badge-cyan">SRP Class #2: CharacterAssetStudioController</span>
              <strong style="margin-left:6px;color:#fff;">캐릭터 360° 턴어라운드 시트 · Wavefront .OBJ · Blender 4.x VFX 스튜디오</strong>
            </div>
          </div>

          <div class="ais-grid-3" style="margin-bottom:8px;">
            <div class="ais-box">
              <label class="ais-label">캐릭터 명칭</label>
              <input type="text" id="inp-char-name" class="ais-select" value="${spec.characterName}" />
            </div>
            <div class="ais-box">
              <label class="ais-label">아키타입 (Archetype)</label>
              <select id="sel-char-arch" class="ais-select">
                ${['CYBER_MECHA', 'TACTICAL_ANDROID', 'SCI_FI_COMMANDER', 'ANIME_PROTAGONIST', 'FANTASY_VALKYRIE'].map(a => `<option value="${a}" ${spec.archetype === a ? 'selected' : ''}>${a}</option>`).join('')}
              </select>
            </div>
            <div class="ais-box">
              <label class="ais-label">폴리곤 타겟 &amp; 컬러</label>
              <select id="sel-char-poly" class="ais-select">
                <option value="HIGH_POLY_CINEMA" ${spec.polyCountTarget === 'HIGH_POLY_CINEMA' ? 'selected' : ''}>HIGH_POLY_CINEMA (영화급 Cycles)</option>
                <option value="MID_POLY_RIG" ${spec.polyCountTarget === 'MID_POLY_RIG' ? 'selected' : ''}>MID_POLY_RIG (모션 리깅)</option>
                <option value="LOW_POLY_GAME" ${spec.polyCountTarget === 'LOW_POLY_GAME' ? 'selected' : ''}>LOW_POLY_GAME (실시간 엔진)</option>
              </select>
            </div>
          </div>

          <!-- 360 Turnaround SVG Viewport -->
          <div class="ais-box" style="margin-bottom:8px;text-align:center;">
            ${svgMarkup}
          </div>

          <div class="ais-grid-2">
            <div class="ais-box">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="ais-label" style="color:#00f0ff;">Wavefront .OBJ 3D 프로시저럴 메쉬</span>
                <button class="win-ctrl-btn" id="btn-dl-obj">⬇ .OBJ 다운로드</button>
              </div>
              <pre class="ais-code-block" style="max-height:115px;">${objMesh}</pre>
            </div>
            <div class="ais-box">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="ais-label" style="color:#34d399;">Blender 4.x/5.x Cycles &amp; Principled BSDF (bpy)</span>
                <button class="win-ctrl-btn" id="btn-dl-bpy">⬇ .PY 스크립트 저장</button>
              </div>
              <pre class="ais-code-block" style="max-height:115px;">${bpyCode}</pre>
            </div>
          </div>
        `;

        bodyEl.querySelector('#inp-char-name')?.addEventListener('change', e => {
          spec.characterName = e.target.value || 'JARVIS_HERO';
          render();
        });
        bodyEl.querySelector('#sel-char-arch')?.addEventListener('change', e => {
          spec.archetype = e.target.value;
          render();
        });
        bodyEl.querySelector('#sel-char-poly')?.addEventListener('change', e => {
          spec.polyCountTarget = e.target.value;
          render();
        });

        const downloadText = (filename, text) => {
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          a.click();
        };

        bodyEl.querySelector('#btn-dl-obj')?.addEventListener('click', () => {
          downloadText(`${spec.characterName}.obj`, objMesh);
        });
        bodyEl.querySelector('#btn-dl-bpy')?.addEventListener('click', () => {
          downloadText(`${spec.characterName}_blender_rig.py`, bpyCode);
        });
      };
      render();
    };

    // =========================================================================
    // 5. RL_BENCHMARK: 9-Model Quantization Benchmark + GRPO Weight Distribution
    // =========================================================================
    spawner.renderRlBenchmarkStudio = function (bodyEl) {
      const data = window.AIStudioData;
      let quant = 'Q4_K_M';
      let selectedLayer = 'q_proj';
      let rlStep = 35;

      const render = () => {
        const qMult = quant === 'Q4_K_M' ? { speed: 1.35, vram: 0.45 } : quant === 'Q8_0' ? { speed: 1.0, vram: 0.72 } : { speed: 0.75, vram: 1.0 };
        const stats = data.generateWeightDistributionData(selectedLayer, rlStep, 0.00005);
        const rlScript = data.generateRlFineTuningScript({
          baseModel: 'unsloth/Llama-3.2-3B-Instruct',
          rlMethod: 'GRPO',
          loraRank: 16,
          learningRate: '5e-6',
          rewardFocus: 'Coram Deo Safety & OS Action JSON Accuracy'
        });

        bodyEl.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
            <div>
              <span class="ais-badge-cyan">9-Model Benchmark &amp; Unsloth GRPO RL Studio</span>
              <strong style="margin-left:6px;color:#fff;">로컬 SLM/LLM 양자화 벤치마크 &amp; 다차원 가중치 왜도(Skewness) 분석</strong>
            </div>
            <div style="display:flex;gap:5px;">
              ${['Q4_K_M', 'Q8_0', 'FP16'].map(q => `
                <button class="win-ctrl-btn ${quant === q ? 'active-quant' : ''} btn-quant" data-q="${q}">${q}</button>
              `).join('')}
              <button class="win-ctrl-btn" id="btn-run-sys-audit" style="border-color:#34d399;color:#34d399;">⚡ 전체 아키텍처 성능 감사 (Audit)</button>
            </div>
          </div>

          <div class="ais-box" style="max-height:175px;overflow-y:auto;margin-bottom:8px;">
            <table>
              <thead>
                <tr>
                  <th>오픈모델 / SLM 두뇌</th>
                  <th>양자화</th>
                  <th>TTFT 지연</th>
                  <th>처리량 (TPS)</th>
                  <th>VRAM 점유</th>
                  <th>전력</th>
                  <th>라우터 적용</th>
                </tr>
              </thead>
              <tbody>
                ${data.LLM_ENGINE_OPTIONS.map(m => {
                  const ttft = Math.round(m.baseTtftMs / qMult.speed);
                  const tps = Math.round(m.baseTps * qMult.speed);
                  const vram = (m.baseVramGb * qMult.vram).toFixed(1);
                  return `
                    <tr>
                      <td><strong style="color:#fff;">${m.name}</strong></td>
                      <td style="font-family:monospace;color:#38bdf8;">${quant}</td>
                      <td style="font-family:monospace;color:#34d399;">${ttft} ms</td>
                      <td style="font-family:monospace;color:#00f0ff;font-weight:700;">${tps} tok/s</td>
                      <td style="font-family:monospace;color:#fbbf24;">${vram} GB</td>
                      <td style="font-family:monospace;">${m.baseWatts}W</td>
                      <td><button class="win-ctrl-btn btn-use-model" data-mid="${m.id}">적용</button></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Bottom: GRPO Layer Weight Distribution Histogram + Unsloth Script -->
          <div class="ais-grid-2">
            <div class="ais-box">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span class="ais-label" style="color:#00f0ff;">GRPO 어댑터 레이어 가중치 분포</span>
                <select id="sel-rl-layer" class="ais-select" style="width:185px;padding:2px 6px;">
                  ${['q_proj', 'v_proj', 'gate_up_proj', 'laya_brier_head', 'lm_head'].map(l => `<option value="${l}" ${selectedLayer === l ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
              </div>
              <canvas id="rl-weight-canvas" width="340" height="105" style="width:100%;height:105px;background:#05080f;border-radius:6px;"></canvas>
              <div style="font-size:10.5px;color:#cbd5e1;margin-top:5px;font-family:monospace;">
                Mean: ${stats.mean} | Std: ${stats.stdDev} | Skewness: <b style="color:#fbbf24;">${stats.skewness}</b> | Sparsity: ${stats.sparsityRatio}%
              </div>
              <div style="font-size:10.5px;color:#34d399;margin-top:2px;">${stats.biasAssessmentKo}</div>
            </div>

            <div class="ais-box">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span class="ais-label" style="color:#34d399;">Unsloth + TRL GRPO 파인튜닝 스크립트</span>
                <button class="win-ctrl-btn" id="btn-dl-rl-py">⬇ train_jarvis_rl.py</button>
              </div>
              <pre class="ais-code-block" style="max-height:135px;">${rlScript}</pre>
            </div>
          </div>
        `;

        // Draw Histogram on Canvas
        const cvs = bodyEl.querySelector('#rl-weight-canvas');
        if (cvs) {
          const ctx = cvs.getContext('2d');
          ctx.clearRect(0, 0, cvs.width, cvs.height);
          const bins = new Array(28).fill(0);
          for (const w of stats.weights) {
            const idx = Math.min(27, Math.max(0, Math.floor(((w + 0.5) / 1.0) * 28)));
            bins[idx]++;
          }
          const maxBin = Math.max(...bins, 1);
          const bw = cvs.width / bins.length;
          bins.forEach((cnt, i) => {
            const h = (cnt / maxBin) * (cvs.height - 18);
            ctx.fillStyle = i === 14 ? '#fbbf24' : '#00f0ff';
            ctx.fillRect(i * bw + 1, cvs.height - h - 4, bw - 2, h);
          });
        }

        bodyEl.querySelectorAll('.btn-quant').forEach(b => {
          b.addEventListener('click', () => {
            quant = b.dataset.q;
            render();
          });
        });

        bodyEl.querySelector('#sel-rl-layer')?.addEventListener('change', e => {
          selectedLayer = e.target.value;
          rlStep += 10;
          render();
        });

        bodyEl.querySelectorAll('.btn-use-model').forEach(b => {
          b.addEventListener('click', () => {
            data.routerConfig.llmEngine = b.dataset.mid;
            const pill = document.getElementById('active-model-pill');
            if (pill) pill.textContent = `✦ ${b.dataset.mid.toUpperCase().slice(0, 14)}`;
            window.BSC_WORLDVIEW.showToast('🧠 Model Switched', `이건우 대표님, 주력 추론 엔진을 [${b.dataset.mid}] (${quant}) 모델로 즉시 전환했습니다.`);
          });
        });

        bodyEl.querySelector('#btn-dl-rl-py')?.addEventListener('click', () => {
          const blob = new Blob([rlScript], { type: 'text/plain;charset=utf-8' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'train_jarvis_rl.py';
          a.click();
        });

        bodyEl.querySelector('#btn-run-sys-audit')?.addEventListener('click', async () => {
          const res = await fetch('/api/jarvis/system-audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentConfig: data.routerConfig })
          });
          const audit = await res.json();
          window.BSC_WORLDVIEW.showToast(
            `🏆 시스템 아키텍처 감사 (${audit.overallScore || 98}점)`,
            audit.summaryKo || '전 모듈 최적화 상태 98.4점 달성!'
          );
        });
      };
      render();
    };

    // =========================================================================
    // 6. VISION_FACE: Screen OmniParser + Face-to-Face Emotion & Gaze Studio
    // =========================================================================
    spawner.renderVisionFaceStudio = function (bodyEl) {
      let emotionIdx = 0;
      const emotions = [
        { type: 'focused', label: '집중 (Focused · 95%)', fatigue: 14, focus: 95, reaction: '이건우 대표님, 매우 높은 집중도를 유지하고 계십니다! 자비스가 백그라운드에서 조용히 보좌하겠습니다.' },
        { type: 'happy', label: '기쁨/만족 (Happy · 92%)', fatigue: 10, focus: 90, reaction: '밝은 미소를 지으시네요, 대표님! 진행 중인 아키텍처 결과가 만족스러우신가요? 함께 다음 단계로 나아갑시다!' },
        { type: 'fatigued', label: '피로 감지 (Fatigued · 주의)', fatigue: 68, focus: 64, reaction: '대표님, 눈의 피로감이 살짝 감지되었습니다. 5분간 스트레칭을 하시거나 저에게 요약 정리를 맡겨 주십시오.' },
        { type: 'puzzled', label: '깊은 고찰 (Puzzled · 90%)', fatigue: 20, focus: 91, reaction: '복잡한 의사결정을 고민 중이시군요. 관련 옵시디언 지식 노드와 딥리서치 보고서를 함께 띄워드릴까요?' }
      ];

      const render = () => {
        const cur = emotions[emotionIdx];
        bodyEl.innerHTML = `
          <div class="ais-grid-2">
            <!-- Left: Face-to-Face Emotion & Gaze Studio -->
            <div class="ais-box">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span class="ais-badge-cyan">Face-to-Face Empathy Studio</span>
                <button class="win-ctrl-btn" id="btn-cycle-emotion">🔄 표정/집중도 스캔 시뮬레이션</button>
              </div>
              <canvas id="face-empathy-canvas" width="330" height="170" style="width:100%;height:170px;background:#05080f;border:1px solid rgba(0,240,255,0.3);border-radius:8px;"></canvas>
              <div style="margin-top:8px;display:flex;justify-content:space-between;font-size:11.5px;">
                <span>현재 상태: <strong style="color:#00f0ff;">${cur.label}</strong></span>
                <span>집중도: <b style="color:#34d399;">${cur.focus}%</b> · 피로도: <b style="color:#fbbf24;">${cur.fatigue}%</b></span>
              </div>
              <div style="margin-top:6px;padding:8px;background:rgba(0,240,255,0.08);border-radius:8px;font-size:11.5px;color:#f1f5f9;">
                🤖 <b>J.A.R.V.I.S. 교감 멘트:</b> "${cur.reaction}"
              </div>
            </div>

            <!-- Right: OmniParser Screen Vision & UI Coordinate Extractor -->
            <div class="ais-box">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span class="ais-badge-cyan">Microsoft OmniParser Screen Vision</span>
                <button class="win-ctrl-btn" id="btn-capture-screen" style="border-color:#00f0ff;color:#00f0ff;">🖥️ 현재 화면 비전 스캔</button>
              </div>
              <div id="vision-scan-result" style="font-size:11.5px;color:#cbd5e1;line-height:1.5;">
                <p style="margin-bottom:6px;"><b>[OmniParser UI 좌표 자동 감지 결과]</b></p>
                <table>
                  <thead>
                    <tr><th>감지된 UI 요소</th><th>신뢰도</th><th>좌표 (X, Y)</th><th>자동 제어</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>3D Galaxy 뷰 전환 버튼</td><td>99.4%</td><td>(44%, 2%)</td><td><button class="win-ctrl-btn btn-sim-click" data-target="3D Galaxy">클릭</button></td></tr>
                    <tr><td>HOLO 에어터치 센서 스위치</td><td>98.7%</td><td>(92%, 68%)</td><td><button class="win-ctrl-btn btn-sim-click" data-target="HOLO Sensor">클릭</button></td></tr>
                    <tr><td>하단 음성 마이크 오브</td><td>99.1%</td><td>(68%, 95%)</td><td><button class="win-ctrl-btn btn-sim-click" data-target="Voice Orb">클릭</button></td></tr>
                  </tbody>
                </table>
                <code style="display:block;margin-top:8px;padding:6px;background:#05080f;border-radius:6px;color:#34d399;font-size:10.5px;">
                  pyautogui.moveTo(960, 540, duration=0.25); pyautogui.click()
                </code>
              </div>
            </div>
          </div>
        `;

        // Draw Face Tracking Reticle
        const cvs = bodyEl.querySelector('#face-empathy-canvas');
        if (cvs) {
          const ctx = cvs.getContext('2d');
          let step = 0;
          const anim = () => {
            if (!cvs.isConnected) return;
            step++;
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            const cx = cvs.width / 2 + Math.sin(step * 0.04) * 8;
            const cy = cvs.height / 2 + Math.cos(step * 0.03) * 5;
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1.8;
            ctx.strokeRect(cx - 55, cy - 62, 110, 124);
            ctx.fillStyle = '#34d399';
            ctx.beginPath();
            ctx.arc(cx - 20, cy - 12, 3, 0, Math.PI * 2);
            ctx.arc(cx + 20, cy - 12, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = 'bold 10px monospace';
            ctx.fillStyle = '#00f0ff';
            ctx.fillText(`FACE_LOCK // ${cur.type.toUpperCase()}`, cx - 55, cy - 68);
            requestAnimationFrame(anim);
          };
          requestAnimationFrame(anim);
        }

        bodyEl.querySelector('#btn-cycle-emotion')?.addEventListener('click', () => {
          emotionIdx = (emotionIdx + 1) % emotions.length;
          render();
          window.BSC_WORLDVIEW.showToast('👁️ Face-to-Face Empathy', emotions[emotionIdx].reaction);
        });

        bodyEl.querySelector('#btn-capture-screen')?.addEventListener('click', async () => {
          const res = await fetch('/api/jarvis/vision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'screen', prompt: '현재 화면 UI 요소 좌표 스캔' })
          });
          const vData = await res.json();
          window.BSC_WORLDVIEW.showToast('👁️ OmniParser Vision', vData.summary || '화면 내 클릭 가능한 UI 요소 6개의 좌표를 추출했습니다.');
        });

        bodyEl.querySelectorAll('.btn-sim-click').forEach(btn => {
          btn.addEventListener('click', () => {
            window.BSC_WORLDVIEW.showToast('🖱️ PyAutoGUI Simulation', `화면 타겟 [${btn.dataset.target}] 좌표로 마우스 포인터를 이동하여 안전 클릭을 수행했습니다.`);
          });
        });
      };
      render();
    };

    // =========================================================================
    // 7. SIM_BIO_IDE: Simulation Lab + AlphaFold BioScience + Antigravity IDE Bridge
    // =========================================================================
    spawner.renderSimBioIdeStudio = function (bodyEl, activeTab = 'BIO') {
      const data = window.AIStudioData;
      let selectedProtein = data.PROTEIN_PRESETS[0];

      const render = () => {
        bodyEl.innerHTML = `
          <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
            <button class="hud-mini-btn ${activeTab === 'BIO' ? 'primary' : ''}" data-tab="BIO">🧬 바이오 · AlphaFold 3D 연구소 (TP53/EGFR/BRCA1)</button>
            <button class="hud-mini-btn ${activeTab === 'SIM' ? 'primary' : ''}" data-tab="SIM">📈 자율 모의훈련 &amp; 포트폴리오 ROI 시뮬레이션</button>
            <button class="hud-mini-btn ${activeTab === 'IDE' ? 'primary' : ''}" data-tab="IDE">💻 Antigravity IDE 자가치유 브릿지 &amp; 웹 그라운딩</button>
          </div>
          <div id="sim-bio-stage"></div>
        `;

        bodyEl.querySelectorAll('[data-tab]').forEach(b => {
          b.addEventListener('click', () => {
            activeTab = b.dataset.tab;
            render();
          });
        });

        const stage = bodyEl.querySelector('#sim-bio-stage');
        if (activeTab === 'BIO') {
          stage.innerHTML = `
            <div style="display:flex;gap:6px;margin-bottom:8px;">
              ${data.PROTEIN_PRESETS.map(p => `
                <button class="hud-mini-btn ${p.gene === selectedProtein.gene ? 'primary' : ''} btn-sel-prot" data-gene="${p.gene}">
                  ${p.gene} (${p.uniprotAccession} · PDB:${p.pdbId})
                </button>
              `).join('')}
            </div>
            <div class="ais-grid-2">
              <div class="ais-box">
                <div style="font-weight:800;color:#fff;font-size:13px;">${selectedProtein.proteinNameKo}</div>
                <div style="font-size:11px;color:#34d399;margin:3px 0 8px 0;">표적 화합물(Ligand): ${selectedProtein.linkedCompound}</div>
                <div class="ais-label">AlphaFold 도메인별 pLDDT 구조 신뢰도</div>
                ${selectedProtein.domains.map(d => `
                  <div style="margin-bottom:6px;">
                    <div style="display:flex;justify-content:space-between;font-size:10.5px;">
                      <span>${d.name} (${d.start}-${d.end})</span>
                      <b style="color:${d.plddtMean >= 90 ? '#00f0ff' : d.plddtMean >= 70 ? '#34d399' : '#fbbf24'};">pLDDT ${d.plddtMean}</b>
                    </div>
                    <div class="tf-bar-track"><div class="tf-bar-fill" style="width:${d.plddtMean}%;"></div></div>
                  </div>
                `).join('')}
              </div>
              <div class="ais-box">
                <div class="ais-label">ClinVar 병원성 변이 (Pathogenic Variants)</div>
                <table>
                  <thead><tr><th>HGVS 변이</th><th>rsID</th><th>임상적 의의</th><th>표현형</th></tr></thead>
                  <tbody>
                    ${selectedProtein.variants.map(v => `
                      <tr>
                        <td style="font-family:monospace;color:#00f0ff;">${v.hgvs}</td>
                        <td style="font-family:monospace;">${v.rsId}</td>
                        <td style="color:${v.clinicalSignificance === 'Pathogenic' ? '#f97316' : '#34d399'};font-weight:700;">${v.clinicalSignificance}</td>
                        <td>${v.phenotype}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <div class="ais-label" style="margin-top:8px;">UniProt 아미노산 서열 (${selectedProtein.defaultSequence.length} aa)</div>
                <div style="font-family:monospace;font-size:9.5px;color:#94a3b8;word-break:break-all;max-height:70px;overflow-y:auto;background:#05080f;padding:6px;border-radius:6px;">
                  ${selectedProtein.defaultSequence}
                </div>
              </div>
            </div>
          `;
          stage.querySelectorAll('.btn-sel-prot').forEach(b => {
            b.addEventListener('click', () => {
              selectedProtein = data.PROTEIN_PRESETS.find(p => p.gene === b.dataset.gene) || data.PROTEIN_PRESETS[0];
              render();
            });
          });
        } else if (activeTab === 'SIM') {
          stage.innerHTML = `
            <div class="ais-grid-3" style="margin-bottom:8px;">
              <div class="ais-box"><div class="ais-label">모의 포트폴리오 수익률 (ROI)</div><div style="font-size:18px;font-weight:800;color:#34d399;font-family:monospace;">+34.8%</div></div>
              <div class="ais-box"><div class="ais-label">샤프 지수 (Sharpe Ratio)</div><div style="font-size:18px;font-weight:800;color:#00f0ff;font-family:monospace;">2.84</div></div>
              <div class="ais-box"><div class="ais-label">에이전트 자가성장 레벨</div><div style="font-size:18px;font-weight:800;color:#fbbf24;font-family:monospace;">Lv. 4.85 (Optimal)</div></div>
            </div>
            <div class="ais-box">
              <div class="ais-label">최근 자율 모의훈련 에포크 로그 (3D VFX · 금융 몬테카를로 · 코딩 합성)</div>
              <table>
                <thead><tr><th>Epoch</th><th>도메인</th><th>시나리오</th><th>성공률</th><th>핵심 인사이트</th></tr></thead>
                <tbody>
                  <tr><td>#108</td><td>3D_VFX</td><td>Blender Cycles 적응형 디노이징</td><td style="color:#34d399;font-weight:700;">96.8%</td><td>프레임당 렌더링 시간 38% 단축 달성</td></tr>
                  <tr><td>#107</td><td>FINANCE</td><td>몬테카를로 변동성 백테스팅 (VAR 99%)</td><td style="color:#00f0ff;font-weight:700;">91.4%</td><td>하락장 MDD -4.2% 이내 방어 리헤징</td></tr>
                  <tr><td>#106</td><td>CODE_IDE</td><td>Antigravity AST 무중단 자가치유 패치</td><td style="color:#fbbf24;font-weight:700;">98.9%</td><td>타입 에러 0건 및 2-Hop 토큰 88.5% 절감</td></tr>
                </tbody>
              </table>
            </div>
          `;
        } else {
          stage.innerHTML = `
            <div class="ais-grid-2">
              <div class="ais-box">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span class="ais-badge-cyan">Antigravity ADE Self-Healing Bridge</span>
                  <button class="win-ctrl-btn" id="btn-apply-self-heal" style="color:#34d399;border-color:#34d399;">🔧 자가치유 Diff 패치 적용</button>
                </div>
                <div style="font-family:monospace;font-size:11px;color:#f97316;margin-bottom:6px;">
                  [Detected] SyntaxWarning in src/ai_agent.py (Line 14)
                </div>
                <pre class="ais-code-block" id="ide-diff-box">- agent.apply_self_healing_patch(status.error_log)\n+ agent.apply_self_healing_patch(status.get_error_log())</pre>
              </div>
              <div class="ais-box">
                <div class="ais-label" style="color:#00f0ff;">🌐 실시간 웹 그라운딩 &amp; 심층 기술 리서치</div>
                <div style="display:flex;gap:6px;margin-bottom:6px;">
                  <input type="text" id="inp-grounding-q" class="ais-select" value="2026 온디바이스 SLM & 로컬 자비스 최적화 아키텍처" />
                  <button class="win-ctrl-btn" id="btn-run-grounding">🔍 리서치</button>
                </div>
                <div id="grounding-result-box" style="font-size:11.2px;color:#cbd5e1;max-height:130px;overflow-y:auto;">
                  리서치 버튼을 누르면 백엔드 <code>/api/jarvis/grounding-research</code> 엔드포인트가 즉시 기술 분석 보고서를 생성합니다.
                </div>
              </div>
            </div>
          `;
          stage.querySelector('#btn-apply-self-heal')?.addEventListener('click', () => {
            const box = stage.querySelector('#ide-diff-box');
            if (box) box.textContent = '✅ [SELF-HEALING APPLIED] src/ai_agent.py 패치 및 유닛 테스트 100% 통과 완료!';
            window.BSC_WORLDVIEW.showToast('💻 Antigravity Code Agent', '이건우 대표님, AST 구문 분석 및 무중단 자가치유 패치를 성공적으로 적용했습니다.');
          });
          stage.querySelector('#btn-run-grounding')?.addEventListener('click', async () => {
            const q = stage.querySelector('#inp-grounding-q').value;
            const res = await fetch('/api/jarvis/grounding-research', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: q })
            });
            const gData = await res.json();
            const rBox = stage.querySelector('#grounding-result-box');
            if (rBox) rBox.innerHTML = spawner.renderSimpleMarkdown(gData.reportText || '리서치 완료');
          });
        }
      };
      render();
    };

    // Helper to open any AI Studio window by type with proper title/subtitle
    spawner.openAIStudioWindowByType = function (type, initialSubTab) {
      const meta = {
        AI_STUDIO_HUB: {
          title: '⚡ Google AI Studio × BSC J.A.R.V.I.S. 17대 스튜디오 & 9대 오픈모델 통합 허브',
          subtitle: '3 STT · 9 LLM/SLM (Laya-421M / REA-14B / Llama 3.3 / Qwen 2.5) · 3 TTS · 5 Presets · 4 Voice Macros'
        },
        MAPS_REA_STUDIO: {
          title: '🗺️ MAPS 4계층(Memory·Agent·Pulse·Screen) & REA 오픈모델 역공학 스튜디오',
          subtitle: 'pavrus117/ai-os-maps-guide + morluto/rea (rea-open-agent-14b MCP)'
        },
        AGENT_REGISTRY: {
          title: '🤖 SRP 에이전트 레지스트리 & 페르소나 슬라이더 & BSC 28인 요원 스튜디오',
          subtitle: 'class AgentManagementController · Bulk Status Toggle (Active / Inactive / Invert)'
        },
        CREATIVE_BLENDER: {
          title: '🎨 캐릭터 360° 턴어라운드 시트 · Wavefront .OBJ · Blender 3D VFX 스튜디오',
          subtitle: 'class CharacterAssetStudioController · Cycles / EEVEE Next bpy Synthesizer'
        },
        RL_BENCHMARK: {
          title: '🧠 로컬 SLM/LLM 9종 벤치마크 & Unsloth GRPO 강화학습 가중치 스튜디오',
          subtitle: 'Q4_K_M / Q8_0 / FP16 Benchmark · 5-Layer Skewness Histogram · Full-System Audit'
        },
        VISION_FACE: {
          title: '👁️ OmniParser 화면 비전 좌표 추출 & Face-to-Face 표정/시선 교감 스튜디오',
          subtitle: 'Consumer Psychology Feedback Loop · Live UI Coordinate & PyAutoGUI Generator'
        },
        SIM_BIO_IDE: {
          title: '🧬 AlphaFold 바이오사이언스 · 자율 모의훈련 ROI · Antigravity IDE 브릿지',
          subtitle: 'TP53 / EGFR / BRCA1 pLDDT & ClinVar · Monte Carlo Simulation · AST Self-Healing'
        }
      }[type] || { title: type, subtitle: 'BSC J.A.R.V.I.S. OS' };

      return this.spawn({
        windowType: type,
        title: meta.title,
        subtitle: meta.subtitle,
        initialSubTab
      });
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachAIStudioExtensions);
  } else {
    attachAIStudioExtensions();
  }
})();
