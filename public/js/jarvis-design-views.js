/**
 * 🎨 BSC J.A.R.V.I.S. OS — Master Design Workspace & SD Character Tycoon Office Engine
 * Implements 100% of CEO Lee Geon-woo's 9 Approved Design Mockups:
 *  1. Top-Left Floating Node Preview Card (#node-preview-card)
 *  2. DOC_WORKSPACE: "BSC 자비스 기획안 v1.0" 3-Column Editor + "문서 라이브러리" Companion Card
 *  3. SETTINGS_WORKSPACE: "⚙️ 자비스 설정" 3-Tab Modal + "웹 자료 조사" Companion Card
 *  4. BSC_OS_WORKSPACE: "BeausCreators BSC_OS" White Dashboard + "💡 에이전트 결과 검토" Companion Card
 *  5. TYCOON_OFFICE_WORKSPACE: "BSC AI OFFICE" SD Character Tycoon Office (4 Scenes):
 *     - Scene 1 (🏠 사무실): Main SD Tycoon Office + "📄 업무 보고 — 서윤 (프로젝트 매니저)"
 *     - Scene 2 (📋 업무 보드 / 리서치): SD Research & Editorial Zone + "🌐 브라우저 · 뉴스레터"
 *     - Scene 3 (👑 대표실 · 최종 보고): SD CEO Executive Room + "📖 대표실 · 최종 보고 (김태오)"
 *     - Scene 4 (👥 회의실): SD Meeting Room ("신규 지역 : 달빛 숲") + "👥 협업 회의 (6인 + 실시간 의논·회의·보고서)"
 */

window.JarvisDesignViews = {
  activeWorkspace: null,
  activeTycoonScene: 'OFFICE_MAIN', // 'OFFICE_MAIN' | 'RESEARCH_NEWS' | 'CEO_EXEC' | 'MEETING_ROOM'
  activeSettingsTab: 'MODEL_VOICE', // 'SKILL_CONN' | 'MODEL_VOICE' | 'AUTH_COST'
  activeResearchTab: 'COLLECT',     // 'COLLECT' | 'DRAFT' | 'REVIEW'

  init() {
    this.ensureOverlayContainer();
    this.bindGlobalShellEvents();
    this.startTopClock();
  },

  ensureOverlayContainer() {
    if (!document.getElementById('design-workspace-stage')) {
      const stage = document.createElement('div');
      stage.id = 'design-workspace-stage';
      stage.style.display = 'none';
      document.body.appendChild(stage);
    }
  },

  startTopClock() {
    const updateClock = () => {
      const el = document.getElementById('top-bar-datetime');
      if (!el) return;
      const now = new Date();
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const m = now.getMonth() + 1;
      const d = now.getDate();
      const day = days[now.getDay()];
      const hrs = now.getHours();
      const ampm = hrs >= 12 ? '오후' : '오전';
      const h12 = hrs % 12 || 12;
      const min = String(now.getMinutes()).padStart(2, '0');
      el.textContent = `${m}월 ${d}일 (${day})  ${ampm} ${h12}:${min}`;
    };
    updateClock();
    setInterval(updateClock, 15000);
  },

  bindGlobalShellEvents() {
    // Left Slim Dock Navigation (5 Icons from Mockup #1)
    document.querySelectorAll('.slim-dock-btn[data-dock-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.dockTarget;
        document.querySelectorAll('.slim-dock-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (target === 'HOME_GALAXY') {
          this.closeWorkspace();
        } else {
          this.openWorkspace(target);
        }
      });
    });

    // Top-Left Node Preview Card Buttons
    document.getElementById('btn-np-open-doc')?.addEventListener('click', () => {
      this.openWorkspace('DOC_WORKSPACE', window.BrainGraphEngine?.selectedNode);
    });
    document.getElementById('btn-np-start-research')?.addEventListener('click', () => {
      this.activeTycoonScene = 'RESEARCH_NEWS';
      this.openWorkspace('TYCOON_OFFICE_WORKSPACE', window.BrainGraphEngine?.selectedNode);
    });
    document.getElementById('btn-np-open-workspace')?.addEventListener('click', () => {
      const sel = window.BrainGraphEngine?.selectedNode;
      const target = sel?.workspaceTarget || 'BSC_OS_WORKSPACE';
      this.openWorkspace(target, sel);
    });

    // Top-Left Brand Home Button
    document.getElementById('btn-brand-home')?.addEventListener('click', () => {
      this.closeWorkspace();
    });

    // Bottom-Right J.A.R.V.I.S. Orb Callout & "업무 현황 열기 →" Button
    document.getElementById('btn-open-work-status')?.addEventListener('click', () => {
      this.openWorkspace('TYCOON_OFFICE_WORKSPACE');
    });
    document.getElementById('btn-orb-open-chat')?.addEventListener('click', () => {
      document.getElementById('btn-toggle-agent-chat')?.click();
    });
    document.getElementById('jarvis-orb-trigger')?.addEventListener('click', () => {
      document.getElementById('orb-voice-mic')?.click();
    });
    document.getElementById('btn-orb-read-aloud')?.addEventListener('click', () => {
      const calloutText = document.getElementById('jarvis-orb-callout-text')?.textContent ||
        '이건우 대표님, 전 시스템 정상 가동 중입니다. 어떤 작업을 시작할까요?';
      if (window.MultimodalEngine?.speakText) {
        window.MultimodalEngine.speakText(calloutText, 'jarvis');
      }
    });

    // Top Bar Utility Buttons
    document.getElementById('btn-top-theme')?.addEventListener('click', () => {
      document.getElementById('btn-cycle-theme')?.click();
    });
    document.getElementById('btn-top-studio-drawer')?.addEventListener('click', () => {
      const bar = document.getElementById('unified-workspace-bar');
      if (bar) {
        bar.classList.toggle('expanded-drawer');
      }
    });
    document.getElementById('btn-top-holo-cam')?.addEventListener('click', () => {
      document.getElementById('btn-holo-gesture-hud')?.click();
    });

    // Cmd+K / Ctrl+K shortcut for Top Search Bar
    window.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('top-galaxy-search')?.focus();
      } else if (e.key === 'Escape' && this.activeWorkspace) {
        this.closeWorkspace();
      }
    });
  },

  closeWorkspace() {
    this.activeWorkspace = null;
    const stage = document.getElementById('design-workspace-stage');
    if (stage) {
      stage.style.display = 'none';
      stage.innerHTML = '';
    }
    document.querySelectorAll('.slim-dock-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.dockTarget === 'HOME_GALAXY');
    });
  },

  openWorkspace(type, nodeContext = null) {
    this.ensureOverlayContainer();
    this.activeWorkspace = type;

    document.querySelectorAll('.slim-dock-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.dockTarget === type);
    });

    const stage = document.getElementById('design-workspace-stage');
    stage.style.display = 'flex';

    if (type === 'DOC_WORKSPACE') {
      stage.innerHTML = this.renderDocWorkspaceHTML(nodeContext);
      this.bindDocWorkspaceEvents();
    } else if (type === 'SETTINGS_WORKSPACE') {
      stage.innerHTML = this.renderSettingsWorkspaceHTML();
      this.bindSettingsWorkspaceEvents();
    } else if (type === 'BSC_OS_WORKSPACE') {
      stage.innerHTML = this.renderBscOsWorkspaceHTML(nodeContext);
      this.bindBscOsWorkspaceEvents();
    } else if (type === 'TYCOON_OFFICE_WORKSPACE') {
      stage.innerHTML = this.renderTycoonOfficeHTML();
      this.bindTycoonOfficeEvents();
    }
  },

  /* ============================================================================
   * 1. DOCUMENT WORKSPACE (Mockup #2: BSC 자비스 기획안 v1.0 + 문서 라이브러리)
   * ============================================================================ */
  renderDocWorkspaceHTML(node) {
    const docTitle = node?.label && node.label !== '소풍 홈페이지' ? `${node.label} 기획안 v1.0` : 'BSC 자비스 기획안 v1.0';
    return `
      <div class="dw-backdrop" id="dw-backdrop-close"></div>
      <div class="dw-layout-row">
        <!-- Main 3-Column Mac Window -->
        <section class="mac-window doc-workspace-win">
          <header class="mac-titlebar">
            <div class="mac-lights">
              <button class="mac-dot red" id="btn-close-dw" title="닫기"></button>
              <button class="mac-dot yellow" title="최소화"></button>
              <button class="mac-dot green" title="최대화"></button>
            </div>
            <div class="mac-win-title">${docTitle}</div>
            <div class="mac-win-actions">
              <button class="mac-pill-btn" id="btn-doc-read-aloud">🔊 자비스 낭독</button>
              <button class="mac-pill-btn">편집</button>
              <button class="mac-pill-btn">공유</button>
              <button class="mac-pill-btn primary" id="btn-doc-save-hq">저장</button>
            </div>
          </header>

          <div class="doc-3col-body">
            <!-- Left Column: 문서 목차 -->
            <aside class="doc-left-toc">
              <div class="toc-heading">문서 목차</div>
              <ul class="toc-list">
                <li class="active"><span class="toc-num">1</span> 목적</li>
                <li><span class="toc-num">2</span> 핵심 기능</li>
                <li><span class="toc-num">3</span> 연결된 프로젝트</li>
                <li><span class="toc-num">4</span> 마일스톤</li>
                <li><span class="toc-num">5</span> 참고 자료</li>
              </ul>

              <div class="toc-divider"></div>
              <div class="toc-heading">최근 열어본 노트</div>
              <div class="toc-recent-item">📄 소풍 홈페이지 기획안</div>
              <div class="toc-recent-item">📄 출판사 OS 워크플로우</div>
              <div class="toc-recent-item">📄 Harness² 아키텍처 요약</div>
            </aside>

            <!-- Center Column: White Paper Document Content -->
            <article class="doc-center-paper" id="doc-paper-content">
              <div class="paper-sheet">
                <h1 class="paper-h1">BSC 자비스 기획안</h1>
                <p class="paper-meta">최종 수정: 오늘 오후 3:20 · 작성: 자비스 &amp; 김건우</p>

                <h2 class="paper-h2">1. 목적</h2>
                <p class="paper-p">
                  흩어진 문서, 아이디어, 프로젝트를 하나의 지식 공간으로 통합하고 자비스(J.A.R.V.I.S.)와 함께
                  탐색·정리·실행하는 개인 맞춤형 지능형 운영 시스템(OS)을 구축합니다.
                </p>

                <h2 class="paper-h2">2. 핵심 기능</h2>
                <table class="paper-table">
                  <thead>
                    <tr>
                      <th>구분</th>
                      <th>주요 내용</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><b>지식 은하</b></td>
                      <td>노드 기반 문서·프로젝트 시각화 및 성단 탐색</td>
                      <td><span class="status-tag done">진행 중</span></td>
                    </tr>
                    <tr>
                      <td><b>음성 대화</b></td>
                      <td>자비스 단독 보이스(현수 HD) 1:1 자연어 티키타카 및 끝까지 완독</td>
                      <td><span class="status-tag done">진행 중</span></td>
                    </tr>
                    <tr>
                      <td><b>작업 공간</b></td>
                      <td>문서 작성, 자료 조사, 요약·비교 및 6종 문서(MD/Word/PPT/PDF) 생성</td>
                      <td><span class="status-tag plan">기획 완료</span></td>
                    </tr>
                  </tbody>
                </table>

                <h2 class="paper-h2">3. 연결된 프로젝트</h2>
                <div class="paper-mindmap-box">
                  <div class="mm-node left">소풍 홈페이지</div>
                  <div class="mm-line"></div>
                  <div class="mm-node center">BSC 자비스</div>
                  <div class="mm-line"></div>
                  <div class="mm-node right">출판사 OS</div>
                  <div class="mm-sub-branch">
                    <div class="mm-vert-line"></div>
                    <div class="mm-node bottom">AI 오피스</div>
                  </div>
                </div>
              </div>
            </article>

            <!-- Right Column: 출처 / 연결 / 버전 -->
            <aside class="doc-right-meta">
              <div class="meta-tabs">
                <button class="meta-tab active">출처 (3)</button>
                <button class="meta-tab">연결 (5)</button>
                <button class="meta-tab">버전</button>
              </div>

              <div class="source-cards-list">
                <div class="source-card">
                  <div class="sc-title">📄 사업 계획서 초안.pdf</div>
                  <div class="sc-sub">2페이지 인용됨</div>
                </div>
                <div class="source-card">
                  <div class="sc-title">📝 기능 정의 메모.md</div>
                  <div class="sc-sub">전체 요약 반영</div>
                </div>
                <div class="source-card">
                  <div class="sc-title">🎙️ 회의록 2026-04-15</div>
                  <div class="sc-sub">음성 전사 기록</div>
                </div>
              </div>

              <div class="meta-bottom-actions">
                <button class="meta-action-btn">+ 새 문서 연결</button>
                <button class="meta-action-btn cyan" id="btn-doc-append-summary">대화에서 요약 추가</button>
              </div>
            </aside>
          </div>
        </section>

        <!-- Right Companion Floating Card: 문서 라이브러리 -->
        <aside class="companion-card">
          <div class="cc-header">
            <span class="cc-title">문서 라이브러리</span>
            <span class="cc-dots">•••</span>
          </div>
          <div class="cc-sub">최근 문서 및 폴더 (24)</div>
          <div class="cc-folder-list">
            <div class="cc-folder-item"><span>📁 기획안</span><b>4</b></div>
            <div class="cc-folder-item"><span>📁 회의록</span><b>5</b></div>
            <div class="cc-folder-item"><span>📁 조사 보고서</span><b>3</b></div>
            <div class="cc-folder-item"><span>📁 참고 자료</span><b>8</b></div>
          </div>
          <button class="cc-primary-btn" id="btn-cc-open-bsc-os">열기</button>
        </aside>
      </div>
    `;
  },

  bindDocWorkspaceEvents() {
    document.getElementById('btn-close-dw')?.addEventListener('click', () => this.closeWorkspace());
    document.getElementById('dw-backdrop-close')?.addEventListener('click', () => this.closeWorkspace());
    document.getElementById('btn-cc-open-bsc-os')?.addEventListener('click', () => this.openWorkspace('BSC_OS_WORKSPACE'));
    document.getElementById('btn-doc-read-aloud')?.addEventListener('click', () => {
      const text = 'BSC 자비스 기획안 버전 1.0 입니다. 제1장 목적: 흩어진 문서, 아이디어, 프로젝트를 하나의 지식 공간으로 통합하고 자비스와 함께 탐색, 정리, 실행하는 지능형 운영 시스템을 구축합니다.';
      window.MultimodalEngine?.speakText(text, 'jarvis');
    });
    document.getElementById('btn-doc-save-hq')?.addEventListener('click', async () => {
      try {
        await fetch('/api/jarvis/co-vision-artifact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'BSC_자비스_기획안_v1.0',
            prompt: 'BSC 자비스 기획안 v1.0 정식 저장',
            formats: ['md', 'docx', 'pdf']
          })
        });
        alert('이건우 대표님, BSC 자비스 기획안 v1.0이 본사 보고서 및 ADE/IDE 보관함에 정식 저장되었습니다.');
      } catch (e) {}
    });
  },

  /* ============================================================================
   * 2. SETTINGS WORKSPACE (Mockup #3: ⚙️ 자비스 설정 + 웹 자료 조사)
   * ============================================================================ */
  renderSettingsWorkspaceHTML() {
    return `
      <div class="dw-backdrop" id="dw-backdrop-close"></div>
      <div class="dw-layout-row">
        <section class="mac-window settings-workspace-win">
          <header class="mac-titlebar">
            <div class="mac-lights">
              <button class="mac-dot red" id="btn-close-dw" title="닫기"></button>
              <button class="mac-dot yellow"></button>
              <button class="mac-dot green"></button>
            </div>
            <div class="mac-win-title">⚙️ 자비스 설정</div>
            <div class="mac-win-actions">
              <button class="mac-pill-btn" id="btn-open-legacy-11settings">고급 11대 설정 열기</button>
            </div>
          </header>

          <!-- 3 Top Tabs matching Mockup #3 -->
          <div class="settings-top-tabs">
            <button class="st-tab ${this.activeSettingsTab === 'SKILL_CONN' ? 'active' : ''}" data-st-tab="SKILL_CONN">스킬 · 연결</button>
            <button class="st-tab ${this.activeSettingsTab === 'MODEL_VOICE' ? 'active' : ''}" data-st-tab="MODEL_VOICE">모델 · 음성</button>
            <button class="st-tab ${this.activeSettingsTab === 'AUTH_COST' ? 'active' : ''}" data-st-tab="AUTH_COST">권한 · 비용</button>
          </div>

          <div class="settings-2col-body">
            <!-- Left Column: 기본 두뇌 모델 & 연결된 도구 -->
            <div class="settings-col">
              <div class="st-section-title">기본 두뇌 모델</div>
              <label class="st-radio-card active">
                <input type="radio" name="jarvis_brain_mode" value="cloud" checked />
                <div>
                  <div class="st-rc-title">클라우드 고성능 모델 <span class="st-badge">추천</span></div>
                  <div class="st-rc-sub">복잡한 추론, 긴 문서 분석, 정교한 작성</div>
                </div>
              </label>

              <label class="st-radio-card">
                <input type="radio" name="jarvis_brain_mode" value="local" />
                <div>
                  <div class="st-rc-title">로컬 모델 — 내 컴퓨터 (RTX 5070 Ti · gemma4:e4b)</div>
                  <div class="st-rc-sub">빠른 응답, 오프라인 작동, 개인정보 보호</div>
                </div>
              </label>

              <div class="st-toggle-row">
                <div>
                  <div class="st-rc-title">작업별 자동 전환</div>
                  <div class="st-rc-sub">간단한 질문은 로컬, 심층 분석은 클라우드 사용</div>
                </div>
                <input type="checkbox" class="st-switch" checked />
              </div>

              <div class="st-section-title" style="margin-top:16px;">연결된 도구</div>
              <div class="st-tools-grid">
                <div class="st-tool-item">
                  <span>🐙 GitHub</span>
                  <b class="emerald">● 연결됨</b>
                </div>
                <div class="st-tool-item">
                  <span>🌐 브라우저 조사</span>
                  <b class="emerald">● 사용 가능</b>
                </div>
                <div class="st-tool-item">
                  <span>📁 로컬 파일</span>
                  <b class="emerald">● 읽기 허용</b>
                </div>
              </div>

              <div class="st-quota-box">
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
                  <span>월 사용 한도 (클라우드 + 로컬 하이브리드)</span>
                  <b style="color:#38bdf8;">42%</b>
                </div>
                <div class="st-progress-track">
                  <div class="st-progress-fill" style="width:42%;"></div>
                </div>
              </div>
            </div>

            <!-- Right Column: 음성 입력 (STT) & 음성 출력 (TTS) -->
            <div class="settings-col">
              <div class="st-section-title">음성 입력 (STT)</div>
              <div class="st-card-box">
                <div class="st-row-between">
                  <span>입력 언어</span>
                  <select class="st-select">
                    <option selected>한국어 (기본)</option>
                    <option>English (US)</option>
                  </select>
                </div>
                <div class="st-row-between" style="margin-top:10px;">
                  <span>마이크 상태</span>
                  <button class="mac-pill-btn" id="btn-st-mic-test">🎙️ 마이크 테스트</button>
                </div>
              </div>

              <div class="st-section-title" style="margin-top:16px;">음성 출력 (TTS — 자비스 단독 음성)</div>
              <div class="st-card-box">
                <div class="st-row-between">
                  <span>목소리 선택</span>
                  <select class="st-select" id="st-voice-select">
                    <option value="jarvis" selected>차분한 남성 (기본 · 현수 HD)</option>
                  </select>
                </div>
                <div class="st-row-between" style="margin-top:12px;">
                  <span>말하기 속도</span>
                  <input type="range" min="0.8" max="1.4" step="0.05" value="1.0" style="width:130px;" />
                  <span style="font-size:12px;color:#38bdf8;">1.0x</span>
                </div>
                <div style="margin-top:12px;text-align:right;">
                  <button class="mac-pill-btn primary" id="btn-st-tts-preview">🔊 미리 듣기 (끝까지 완독 테스트)</button>
                </div>
              </div>

              <div class="st-toggle-row" style="margin-top:14px;">
                <div>
                  <div class="st-rc-title">호출어 설정 ("자비스")</div>
                  <div class="st-rc-sub">음성으로 언제든 자비스를 깨웁니다</div>
                </div>
                <input type="checkbox" class="st-switch" checked />
              </div>

              <div class="st-footer-btns">
                <button class="mac-pill-btn" id="btn-st-reset">기본값 복원</button>
                <button class="mac-pill-btn primary" id="btn-st-save">저장</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Right Companion Card: 웹 자료 조사 -->
        <aside class="companion-card">
          <div class="cc-header">
            <span class="cc-title">웹 자료 조사</span>
            <span class="cc-dots">•••</span>
          </div>
          <div class="cc-sub">최신 AI 에이전트 인터페이스 동향</div>
          <div class="cc-step-list">
            <div class="cc-step done">✓ 12개 출처 수집 완료</div>
            <div class="cc-step done">✓ 핵심 내용 요약</div>
            <div class="cc-step active">● 문서 초안으로 정리 중...</div>
          </div>
          <div style="display:flex;gap:8px;margin-top:14px;">
            <button class="cc-secondary-btn" id="btn-cc-stop-research">중단</button>
            <button class="cc-primary-btn" id="btn-cc-save-research-doc" style="margin-top:0;flex:1;">문서로 저장</button>
          </div>
        </aside>
      </div>
    `;
  },

  bindSettingsWorkspaceEvents() {
    document.getElementById('btn-close-dw')?.addEventListener('click', () => this.closeWorkspace());
    document.getElementById('dw-backdrop-close')?.addEventListener('click', () => this.closeWorkspace());
    document.getElementById('btn-open-legacy-11settings')?.addEventListener('click', () => {
      this.closeWorkspace();
      document.querySelector('.btn-open-master-settings')?.click();
    });
    document.getElementById('btn-st-tts-preview')?.addEventListener('click', () => {
      window.MultimodalEngine?.speakText(
        '이건우 대표님, 자비스 기본 음성 출력 테스트입니다. 이제 긴 문장이나 보고서도 중간에 끊기지 않고 마지막 마침표까지 완벽하게 읽어드립니다.',
        'jarvis'
      );
    });
    document.getElementById('btn-st-mic-test')?.addEventListener('click', () => {
      document.getElementById('orb-voice-mic')?.click();
    });
    document.getElementById('btn-st-save')?.addEventListener('click', () => {
      this.closeWorkspace();
    });
    document.getElementById('btn-cc-save-research-doc')?.addEventListener('click', () => {
      this.openWorkspace('DOC_WORKSPACE');
    });
  },

  /* ============================================================================
   * 3. COMPANY OS DASHBOARD (Mockup #4: BeausCreators BSC_OS + 에이전트 결과 검토)
   * ============================================================================ */
  renderBscOsWorkspaceHTML(node) {
    const projName = node?.label || '소풍 홈페이지';
    return `
      <div class="dw-backdrop" id="dw-backdrop-close"></div>
      <div class="dw-layout-row">
        <section class="mac-window bsc-os-win">
          <header class="mac-titlebar">
            <div class="mac-lights">
              <button class="mac-dot red" id="btn-close-dw" title="닫기"></button>
              <button class="mac-dot yellow"></button>
              <button class="mac-dot green"></button>
            </div>
            <div class="mac-win-title">BeausCreators BSC_OS</div>
            <div class="mac-win-actions">
              <button class="mac-pill-btn cyan-glow" id="btn-switch-to-agent-os">에이전트_OS에서 보기 →</button>
            </div>
          </header>

          <div class="bsc-os-body">
            <!-- Left Menu -->
            <aside class="bsc-os-sidebar">
              <div class="bos-nav-item active"><span>📁 프로젝트</span><b>4</b></div>
              <div class="bos-nav-item"><span>✅ 업무</span><b>7</b></div>
              <div class="bos-nav-item" id="bos-nav-doc"><span>📄 문서</span><b>18</b></div>
              <div class="bos-nav-item"><span>📅 일정</span><b>3</b></div>
              <div class="bos-nav-item" id="bos-nav-approve"><span>🛡️ 승인</span><b class="amber">2</b></div>
              <div class="bos-nav-item"><span>📊 ERP · 재무</span></div>

              <div class="toc-divider"></div>
              <div class="toc-heading">진행 중인 프로젝트</div>
              <div class="bos-proj-pill active">● 소풍 홈페이지 (60%)</div>
              <div class="bos-proj-pill">● 출판사 OS (85%)</div>
              <div class="bos-proj-pill">● BSC 자비스 v2.0 (95%)</div>
              <div class="bos-proj-pill">● 달빛 숲 신규 지역 (45%)</div>
            </aside>

            <!-- Center Clean White Dashboard -->
            <main class="bsc-os-main-white">
              <div class="bos-header-row">
                <div>
                  <div class="bos-title-row">
                    <h2>${projName}</h2>
                    <span class="bos-status-pill">진행 중 60%</span>
                  </div>
                  <p class="bos-sub">바다 낚시 예약 · 선박 소개 · 운항 일정 안내 웹사이트 구축 프로젝트</p>
                </div>
                <button class="bos-btn-outline" id="btn-bos-open-doc">기획안 열기</button>
              </div>

              <!-- 4 Summary KPI Cards -->
              <div class="bos-kpi-grid">
                <div class="bos-kpi-card">
                  <div class="k-label">진행 업무</div>
                  <div class="k-val">4건</div>
                </div>
                <div class="bos-kpi-card">
                  <div class="k-label">검토 대기</div>
                  <div class="k-val amber">2건</div>
                </div>
                <div class="bos-kpi-card">
                  <div class="k-label">연결 문서</div>
                  <div class="k-val">8개</div>
                </div>
                <div class="bos-kpi-card">
                  <div class="k-label">다음 일정</div>
                  <div class="k-val blue">내일 14:00</div>
                </div>
              </div>

              <div class="bos-mid-grid">
                <!-- Left: 업무 목록 -->
                <div class="bos-panel-card">
                  <div class="bos-panel-title">업무 목록</div>
                  <div class="bos-task-row">
                    <span class="t-check done">✓</span>
                    <span class="t-name">메인 히어로 배너 &amp; 선박 소개 구성</span>
                    <span class="t-badge done">완료</span>
                  </div>
                  <div class="bos-task-row">
                    <span class="t-check review">●</span>
                    <span class="t-name">1차 디자인 시안 검토 (김태오 · 서윤)</span>
                    <span class="t-badge review">검토 요청</span>
                  </div>
                  <div class="bos-task-row">
                    <span class="t-check prog">○</span>
                    <span class="t-name">실시간 예약 &amp; 물때표 위젯 연동</span>
                    <span class="t-badge prog">진행 중</span>
                  </div>
                </div>

                <!-- Right: 연결 문서 -->
                <div class="bos-panel-card">
                  <div class="bos-panel-title">연결 문서</div>
                  <div class="bos-doc-item" id="bos-doc-1">📄 소풍 홈페이지 기획안 v1.2</div>
                  <div class="bos-doc-item" id="bos-doc-2">🎨 메인 시안 (노을 컨셉)</div>
                  <div class="bos-doc-item" id="bos-doc-3">📋 메뉴 구조도 및 예약 플로우</div>
                </div>
              </div>

              <!-- Bottom: 일정 타임라인 -->
              <div class="bos-panel-card" style="margin-top:14px;">
                <div class="bos-panel-title">일정 타임라인</div>
                <div class="bos-timeline-bar">
                  <div class="tl-step done"><b>4/10</b> 기획 완료</div>
                  <div class="tl-line done"></div>
                  <div class="tl-step active"><b>4/18</b> 디자인 시안</div>
                  <div class="tl-line"></div>
                  <div class="tl-step"><b>4/25</b> 개발 및 연동</div>
                  <div class="tl-line"></div>
                  <div class="tl-step"><b>5/02</b> 정식 오픈</div>
                </div>
              </div>
            </main>
          </div>
        </section>

        <!-- Right Companion Card: 💡 에이전트 결과 검토 -->
        <aside class="companion-card">
          <div class="cc-header">
            <span class="cc-title">💡 에이전트 결과 검토</span>
          </div>
          <div class="cc-sub">소풍 홈페이지 1차 디자인 시안이 도착했습니다.</div>
          <img src="/props/sopoong-boat.jpg" alt="소풍 홈페이지 시안" class="cc-preview-img" />
          <div style="display:flex;gap:8px;margin-top:12px;">
            <button class="cc-secondary-btn" id="btn-cc-view-draft" style="flex:1;">시안 보기</button>
            <button class="cc-primary-btn" id="btn-cc-approve-draft" style="margin-top:0;flex:1;">승인</button>
          </div>
        </aside>
      </div>
    `;
  },

  bindBscOsWorkspaceEvents() {
    document.getElementById('btn-close-dw')?.addEventListener('click', () => this.closeWorkspace());
    document.getElementById('dw-backdrop-close')?.addEventListener('click', () => this.closeWorkspace());
    document.getElementById('btn-switch-to-agent-os')?.addEventListener('click', () => {
      this.activeTycoonScene = 'OFFICE_MAIN';
      this.openWorkspace('TYCOON_OFFICE_WORKSPACE');
    });
    document.getElementById('btn-bos-open-doc')?.addEventListener('click', () => {
      this.openWorkspace('DOC_WORKSPACE');
    });
    document.getElementById('bos-nav-doc')?.addEventListener('click', () => {
      this.openWorkspace('DOC_WORKSPACE');
    });
    document.getElementById('bos-nav-approve')?.addEventListener('click', () => {
      this.activeTycoonScene = 'CEO_EXEC';
      this.openWorkspace('TYCOON_OFFICE_WORKSPACE');
    });
    document.getElementById('btn-cc-view-draft')?.addEventListener('click', () => {
      this.activeTycoonScene = 'CEO_EXEC';
      this.openWorkspace('TYCOON_OFFICE_WORKSPACE');
    });
    document.getElementById('btn-cc-approve-draft')?.addEventListener('click', () => {
      window.MultimodalEngine?.speakText('이건우 대표님, 소풍 홈페이지 1차 디자인 시안이 승인 처리되었습니다.', 'jarvis');
      this.activeTycoonScene = 'OFFICE_MAIN';
      this.openWorkspace('TYCOON_OFFICE_WORKSPACE');
    });
  },

  /* ============================================================================
   * 4. SD CHARACTER TYCOON OFFICE ("BSC AI OFFICE" — 4 Final Mockup Scenes)
   * ============================================================================ */
  renderTycoonOfficeHTML() {
    const scene = this.activeTycoonScene;
    const sceneImageMap = {
      OFFICE_MAIN: '/props/tycoon-scene-1-office.jpg',
      RESEARCH_NEWS: '/props/tycoon-scene-2-research.jpg',
      CEO_EXEC: '/props/tycoon-scene-3-ceo.jpg',
      MEETING_ROOM: '/props/tycoon-scene-4-meeting.jpg'
    };

    const currentImg = sceneImageMap[scene] || sceneImageMap.OFFICE_MAIN;

    return `
      <div class="dw-backdrop" id="dw-backdrop-close"></div>
      <section class="mac-window tycoon-office-win">
        <!-- Top Dark Tycoon Header Bar matching Mockups #6~#9 -->
        <header class="tycoon-topbar">
          <div class="tycoon-brand-left">
            <div class="mac-lights">
              <button class="mac-dot red" id="btn-close-dw" title="닫기"></button>
              <button class="mac-dot yellow"></button>
              <button class="mac-dot green"></button>
            </div>
            <span class="tycoon-logo-title">BSC AI OFFICE</span>
          </div>

          <nav class="tycoon-center-tabs">
            <button class="tycoon-tab ${scene === 'OFFICE_MAIN' ? 'active' : ''}" data-tycoon-scene="OFFICE_MAIN">
              🏠 사무실
            </button>
            <button class="tycoon-tab ${scene === 'RESEARCH_NEWS' ? 'active' : ''}" data-tycoon-scene="RESEARCH_NEWS">
              📋 업무 보드 · 리서치
            </button>
            <button class="tycoon-tab ${scene === 'MEETING_ROOM' ? 'active' : ''}" data-tycoon-scene="MEETING_ROOM">
              👥 회의실
            </button>
            <button class="tycoon-tab ${scene === 'CEO_EXEC' ? 'active' : ''}" data-tycoon-scene="CEO_EXEC">
              📊 대표실 · 최종 보고
            </button>
          </nav>

          <div class="tycoon-status-right">
            <span class="tycoon-live-dot"></span>
            <span>에이전트 12명 활동 중</span>
            <button class="mac-pill-btn" id="btn-tycoon-back-galaxy" style="margin-left:8px;">🌌 지식 은하로</button>
          </div>
        </header>

        <!-- Main Split Body: Left 62% SD Character Tycoon Isometric Viewport + Right 38% Context Panel -->
        <div class="tycoon-split-body">
          <!-- Left: Interactive SD Character Tycoon Office Viewport -->
          <div class="tycoon-iso-stage">
            <img src="${currentImg}" alt="BSC AI OFFICE SD Tycoon View" class="tycoon-scene-img" />

            <!-- Interactive Quick-Jump Room Hotspots Overlaid on the Tycoon Office -->
            <div class="tycoon-QuickJump-bar">
              <span class="tqj-label">🎯 타이쿤 구역 이동:</span>
              <button class="tqj-pill ${scene === 'OFFICE_MAIN' ? 'active' : ''}" data-tycoon-scene="OFFICE_MAIN">🏢 전체 사무실 (서윤 PM)</button>
              <button class="tqj-pill ${scene === 'RESEARCH_NEWS' ? 'active' : ''}" data-tycoon-scene="RESEARCH_NEWS">🔍 리서치 · 뉴스레터 존</button>
              <button class="tqj-pill ${scene === 'CEO_EXEC' ? 'active' : ''}" data-tycoon-scene="CEO_EXEC">👑 대표실 결재 (김태오)</button>
              <button class="tqj-pill ${scene === 'MEETING_ROOM' ? 'active' : ''}" data-tycoon-scene="MEETING_ROOM">👥 달빛 숲 회의실 (6인 협업)</button>
            </div>

            <!-- Bottom Tycoon Dock Bar (🌐 브라우저 | 📊 주식 | 📰 뉴스레터 | 🎮 스튜디오) -->
            <div class="tycoon-bottom-dock">
              <button class="tbd-btn ${scene === 'RESEARCH_NEWS' ? 'active' : ''}" data-tycoon-scene="RESEARCH_NEWS">🌐 브라우저</button>
              <button class="tbd-btn" id="btn-tycoon-stock-bi">📊 주식 · 재무</button>
              <button class="tbd-btn ${scene === 'RESEARCH_NEWS' ? 'active' : ''}" data-tycoon-scene="RESEARCH_NEWS">📰 뉴스레터</button>
              <button class="tbd-btn ${scene === 'MEETING_ROOM' ? 'active' : ''}" data-tycoon-scene="MEETING_ROOM">🎮 스튜디오</button>
              <button class="tbd-btn gold" id="btn-tycoon-open-full-council">🏛️ BeausCreators 의논·회의·보고서 창</button>
            </div>
          </div>

          <!-- Right 38% Context Panel (Changes dynamically per Tycoon Scene) -->
          <aside class="tycoon-right-panel ${scene === 'MEETING_ROOM' ? 'dark-mode' : 'light-mode'}">
            ${this.renderTycoonRightPanelHTML(scene)}
          </aside>
        </div>
      </section>
    `;
  },

  renderTycoonRightPanelHTML(scene) {
    if (scene === 'OFFICE_MAIN') {
      // Mockup #6: 업무 보고 — 서윤 (프로젝트 매니저)
      return `
        <div class="trp-header">
          <div class="trp-title">📄 업무 보고</div>
          <button class="trp-close" id="btn-close-dw">✕</button>
        </div>

        <div class="trp-agent-card">
          <img src="/props/sd-seoyoon.jpg" alt="서윤 PM" class="trp-agent-avatar" />
          <div class="trp-agent-info">
            <div class="trp-agent-name">서윤 <span class="trp-role">프로젝트 매니저</span></div>
            <div class="trp-speech-bubble">"대표님, 홈페이지 시안 정리 완료했습니다!"</div>
          </div>
        </div>

        <div class="trp-task-box">
          <div class="trp-task-head">
            <b>홈페이지 시안 검토</b>
            <span class="trp-badge amber">검토 대기</span>
          </div>
          <p class="trp-task-desc">메인 비주얼 2안, 서비스 소개 섹션 구성안 및 모바일 레이아웃 정리</p>

          <div class="trp-step-timeline">
            <div class="trp-step done"><span>✓</span> 레퍼런스 조사 완료</div>
            <div class="trp-step done"><span>✓</span> 와이어프레임 &amp; 카피 작성</div>
            <div class="trp-step active"><span>●</span> 대표님 최종 선택 요청</div>
          </div>
        </div>

        <div class="trp-section-label">결과 미리보기</div>
        <div class="trp-preview-card">
          <img src="/props/preview-beaus-sunset.jpg" alt="BeausCreators 시안" class="trp-preview-img" />
        </div>

        <div class="trp-bottom-actions">
          <button class="trp-btn outline" id="btn-trp-view-result">결과 보기</button>
          <button class="trp-btn primary" id="btn-trp-approve-seoyoon">✓ 승인</button>
        </div>
      `;
    }

    if (scene === 'RESEARCH_NEWS') {
      // Mockup #7: 🌐 브라우저 · 뉴스레터 (자료 수집 | 원고 작성 | 검수)
      return `
        <div class="trp-header">
          <div class="trp-title">🌐 브라우저 · 뉴스레터</div>
          <button class="trp-close" id="btn-close-dw">✕</button>
        </div>

        <div class="trp-subtabs">
          <button class="trp-subtab active">✓ 자료 수집</button>
          <button class="trp-subtab">● 원고 작성</button>
          <button class="trp-subtab">○ 검수</button>
        </div>

        <div class="trp-url-bar">🔍 https://research.bsc.ai/weekly-trends</div>

        <div class="trp-section-label">주요 출처 <span style="color:#2563eb;">6</span></div>
        <div class="trp-source-item">
          <span class="s-dot blue"></span>
          <div>
            <div class="s-title">글로벌 AI 에이전트 시장 보고서</div>
            <div class="s-meta">techinsight.io · 요약 완료</div>
          </div>
          <span class="s-check">✓</span>
        </div>
        <div class="trp-source-item">
          <span class="s-dot green"></span>
          <div>
            <div class="s-title">멀티모달 인터페이스 최신 사례</div>
            <div class="s-meta">designweekly.com · 인용 3곳</div>
          </div>
          <span class="s-check">✓</span>
        </div>

        <div class="trp-section-label" style="margin-top:12px;">뉴스레터 초안 <span class="trp-badge blue">작성 중 75%</span></div>
        <div class="trp-newsletter-card">
          <div class="nl-tag">WEEKLY BRIEFING · #42</div>
          <h4>이번 주 AI 동향: 스스로 일하는 에이전트 오피스</h4>
          <p>리서치부터 원고 작성, 검수까지 역할별로 분담하는 에이전트 협업 구조가 빠르게 확산되고 있습니다...</p>
          <div class="nl-pills">
            <span>#AI오피스</span>
            <span>#자동화</span>
            <span>#리서치</span>
          </div>
        </div>

        <div class="trp-bottom-actions">
          <button class="trp-btn outline" id="btn-trp-preview-nl">👁️ 미리보기</button>
          <button class="trp-btn primary" id="btn-trp-request-review">➤ 검수 요청</button>
        </div>
      `;
    }

    if (scene === 'CEO_EXEC') {
      // Mockup #8: 📖 대표실 · 최종 보고 (외주 홈페이지 1차 시안 — 김태오)
      return `
        <div class="trp-header">
          <div class="trp-title">📖 대표실 · 최종 보고</div>
          <button class="trp-close" id="btn-close-dw">✕</button>
        </div>

        <div class="trp-exec-banner">
          <span class="trp-badge amber">승인 대기</span>
          <h4>외주 홈페이지 1차 시안</h4>
          <p>담당: 김태오 · 제출 방금 전</p>
        </div>

        <div class="trp-preview-card">
          <img src="/props/preview-brand-beyond.jpg" alt="Brand Beyond Possibilities" class="trp-preview-img" />
        </div>

        <div class="trp-kpi-3col">
          <div class="k3-box"><span>완성도</span><b class="emerald">92%</b></div>
          <div class="k3-box"><span>반응형</span><b class="blue">PC · 모바일</b></div>
          <div class="k3-box"><span>일정</span><b>정상 진행</b></div>
        </div>

        <div class="trp-section-label">요청 사항</div>
        <div class="trp-feedback-box">
          <p style="font-size:12px;color:#334155;margin-bottom:8px;">
            메인 히어로 문구 톤앤매너 확인 및 하단 포트폴리오 배치 승인 요청드립니다.
          </p>
          <input type="text" id="trp-ceo-feedback-input" class="trp-input" placeholder="피드백 입력 (예: 메인 버튼 색상 더 밝게)" />
        </div>

        <div class="trp-section-label" style="margin-top:10px;">승인 이력 (3)</div>
        <div class="trp-history-list">
          <div class="th-row"><span>기획안 및 와이어프레임</span><b class="emerald">✓ 승인 완료</b></div>
          <div class="th-row"><span>브랜드 컬러 가이드</span><b class="bp-amber">✎ 수정 후 승인</b></div>
        </div>

        <div class="trp-bottom-actions">
          <button class="trp-btn success" id="btn-trp-exec-approve">✓ 승인</button>
          <button class="trp-btn warn" id="btn-trp-exec-revise">✎ 수정 요청</button>
          <button class="trp-btn outline" id="btn-trp-exec-hold">⏸ 보류</button>
        </div>
      `;
    }

    // Scene 4: MEETING_ROOM (Mockup #9: 👥 협업 회의 — 신규 지역 : 달빛 숲 + 실시간 의논·회의·보고서)
    return `
      <div class="trp-header dark">
        <div class="trp-title">👥 협업 회의 <span class="trp-badge purple">● 회의 중</span></div>
        <button class="trp-close dark" id="btn-close-dw">✕</button>
      </div>

      <div class="trp-meeting-topic-card">
        <div class="mt-tag">안건 · 게임 스튜디오 &amp; 전사 전략</div>
        <h4>신규 지역 : 달빛 숲 — 레벨 &amp; 밸런스 회의</h4>
        <img src="/props/sd-meeting-roster.jpg" alt="6인 SD 에이전트 회의 참가자" class="trp-roster-strip" />
      </div>

      <div class="trp-section-label dark">▾ 회의 주요 의견 (실시간 의논 · 회의 · 보고서 연동)</div>
      <div class="trp-meeting-feed" id="tycoon-meeting-feed">
        <div class="tm-msg">
          <div class="tm-head"><b style="color:#60a5fa;">유진</b> <span class="tm-role">기획</span> <span class="tm-time">방금 전</span></div>
          <div class="tm-body">도입부 갈림길을 2개로 줄이고, 중앙 제단으로 시선이 모이도록 동선을 단순화하는 게 좋겠습니다.</div>
        </div>
        <div class="tm-msg">
          <div class="tm-head"><b style="color:#f472b6;">세아</b> <span class="tm-role">아트</span> <span class="tm-time">1분 전</span></div>
          <div class="tm-body">푸른 안개 광원과 반딧불 파티클 시안 준비했습니다. 시야를 가리지 않게 채도를 낮췄어요.</div>
        </div>
        <div class="tm-msg">
          <div class="tm-head"><b style="color:#fbbf24;">준호</b> <span class="tm-role">밸런스</span> <span class="tm-time">2분 전</span></div>
          <div class="tm-body">초반 몬스터 체력을 12% 낮추는 대신, 보스 패턴 예고 이펙트를 더 명확히 주면 플레이 템포가 살아납니다.</div>
        </div>
      </div>

      <!-- Direct Live Council Input inside Tycoon Meeting Room -->
      <form id="tycoon-meeting-form" class="trp-meeting-input-row">
        <input type="text" id="tycoon-meeting-input" placeholder="이건우 대표님 지시사항 또는 회의 안건 입력..." autocomplete="off" />
        <button type="submit" class="trp-btn primary small">발언 ↵</button>
      </form>

      <div class="trp-section-label dark" style="margin-top:8px;">▸ 액션 아이템 (3)</div>
      <div class="trp-action-checks">
        <div class="tac-row"><span class="emerald">✓</span> 달빛 숲 라이팅 컬러 가이드 확정 (세아)</div>
        <div class="tac-row"><span class="blue">●</span> 1구간 몬스터 배치 수정 빌드 테스트 (준호 · 하나)</div>
      </div>

      <div class="trp-bottom-actions">
        <button class="trp-btn dark-outline" id="btn-trp-open-minutes">📄 회의록 보기</button>
        <button class="trp-btn primary" id="btn-trp-assign-tasks">📋 업무 배정</button>
      </div>
    `;
  },

  bindTycoonOfficeEvents() {
    document.getElementById('btn-close-dw')?.addEventListener('click', () => this.closeWorkspace());
    document.getElementById('dw-backdrop-close')?.addEventListener('click', () => this.closeWorkspace());
    document.getElementById('btn-tycoon-back-galaxy')?.addEventListener('click', () => this.closeWorkspace());

    // Scene switching buttons (Top tabs, Quick-jump pills, Bottom dock)
    document.querySelectorAll('[data-tycoon-scene]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTycoonScene = btn.dataset.tycoonScene;
        this.openWorkspace('TYCOON_OFFICE_WORKSPACE');
      });
    });

    document.getElementById('btn-tycoon-stock-bi')?.addEventListener('click', () => {
      this.openWorkspace('BSC_OS_WORKSPACE');
    });

    document.getElementById('btn-tycoon-open-full-council')?.addEventListener('click', () => {
      this.closeWorkspace();
      document.getElementById('btn-open-bsc-council')?.click();
    });

    // Right panel specific actions
    document.getElementById('btn-trp-view-result')?.addEventListener('click', () => {
      this.activeTycoonScene = 'CEO_EXEC';
      this.openWorkspace('TYCOON_OFFICE_WORKSPACE');
    });
    document.getElementById('btn-trp-approve-seoyoon')?.addEventListener('click', () => {
      window.MultimodalEngine?.speakText('이건우 대표님, 서윤 프로젝트 매니저가 보고한 홈페이지 시안이 승인 완료되었습니다.', 'jarvis');
    });
    document.getElementById('btn-trp-preview-nl')?.addEventListener('click', () => {
      this.openWorkspace('DOC_WORKSPACE');
    });
    document.getElementById('btn-trp-request-review')?.addEventListener('click', () => {
      this.activeTycoonScene = 'CEO_EXEC';
      this.openWorkspace('TYCOON_OFFICE_WORKSPACE');
    });
    document.getElementById('btn-trp-exec-approve')?.addEventListener('click', () => {
      const fb = document.getElementById('trp-ceo-feedback-input')?.value || '시안 승인';
      window.MultimodalEngine?.speakText(`이건우 대표님, 김태오 디자이너의 외주 홈페이지 1차 시안을 최종 승인하였습니다. 피드백: ${fb}`, 'jarvis');
    });
    document.getElementById('btn-trp-exec-revise')?.addEventListener('click', () => {
      const fb = document.getElementById('trp-ceo-feedback-input')?.value || '메인 버튼 색상 더 밝게 조정';
      window.MultimodalEngine?.speakText(`대표님 지시사항("${fb}")을 김태오 디자이너에게 수정 요청으로 전달하였습니다.`, 'jarvis');
    });

    // Live Meeting Room Form -> calls /api/jarvis/bsc-council and appends real agent responses!
    const meetingForm = document.getElementById('tycoon-meeting-form');
    meetingForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const input = document.getElementById('tycoon-meeting-input');
      const topic = input?.value?.trim();
      if (!topic) return;
      input.value = '';

      const feed = document.getElementById('tycoon-meeting-feed');
      if (feed) {
        feed.insertAdjacentHTML('afterbegin', `
          <div class="tm-msg" style="border-color:#00f0ff;">
            <div class="tm-head"><b style="color:#00f0ff;">👑 이건우 대표님</b> <span class="tm-role">CEO 지시</span> <span class="tm-time">방금 전</span></div>
            <div class="tm-body">${topic}</div>
          </div>
        `);
      }

      try {
        const res = await fetch('/api/jarvis/bsc-council', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, mode: 'MEETING' })
        });
        const data = await res.json();
        if (data.ok && Array.isArray(data.entries) && feed) {
          data.entries.forEach(ent => {
            feed.insertAdjacentHTML('afterbegin', `
              <div class="tm-msg">
                <div class="tm-head"><b style="color:#fbbf24;">${ent.name}</b> <span class="tm-role">${ent.role}</span> <span class="tm-time">실시간 발언</span></div>
                <div class="tm-body">${ent.text}</div>
              </div>
            `);
          });
        }
      } catch (err) {}
    });

    document.getElementById('btn-trp-open-minutes')?.addEventListener('click', () => {
      this.closeWorkspace();
      document.getElementById('btn-open-bsc-council')?.click();
    });
    document.getElementById('btn-trp-assign-tasks')?.addEventListener('click', () => {
      this.openWorkspace('BSC_OS_WORKSPACE');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.JarvisDesignViews.init();
});
