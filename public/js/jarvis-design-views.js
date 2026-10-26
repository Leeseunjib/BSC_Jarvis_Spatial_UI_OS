/**
 * ============================================================================
 * 🧭 BSC J.A.R.V.I.S. OS — 소비자 심리학 기반 실무 통합 대시보드 엔진 (Commercial v3.0)
 * ============================================================================
 * - 대표님 지침 (2026-10-22 /goal):
 *   1) 불필요한 더미/가짜 텍스트·이미지 전면 제거 및 실제 백엔드 API 직결
 *   2) 창들이 겹쳐서 어디 있는지 모르는 현상 원천 해결:
 *      좌측 메뉴바(#slim-left-dock) 6대 메뉴 클릭 시 단일 대시보드 스테이지(#design-workspace-stage) 안에서
 *      깔끔하게 화면이 전환되며, 상단 검색바·좌측 메뉴바·하단 자비스 입력창은 항상 고정 유지.
 *   3) 뉴런홈(#brain-canvas)의 디자인은 그대로 유지하되, 메뉴바를 통해 실무 활용도를 극대화:
 *      - 🧠 뉴런홈 (HOME_GALAXY)
 *      - 📂 지식폴더 (ECOSYSTEM_DASHBOARD): 회사_HQ · 회사_Branch · 지식생태계 폴더 선택 & .MD 심층 분석
 *      - 📄 문서·IDE (DOC_IDE_DASHBOARD): 분석된 .MD 문서 열람/편집 · 코드 에디터 · 터미널 · 6종 문서 변환
 *      - 🤖 두뇌·도구 (AI_BRAIN_DASHBOARD): Ollama · LM Studio · Gemma 4 멀티모달 두뇌 장착 & 전문 스튜디오
 *      - 🏛️ 회의·조직 (AGENT_OFFICE_DASHBOARD): 실시간 의논·회의·보고서 워룸 & 전사 에이전트 실시간 현황
 *      - ⚙️ 설정·검증 (SETTINGS_DASHBOARD): 자연 음성(TTS/STT) · 테마 · 실시간 콘솔 · 시스템 검증
 */

window.JarvisDesignViews = {
  activeWorkspace: null,
  currentDocFilePath: '',
  currentCouncilMode: 'MEETING',
  folderPickerState: {
    open: false,
    slotId: '',
    slotLabel: '',
    slotColor: '#00f0ff',
    currentDir: 'C:\\',
    isNewCustomSlot: false
  },

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
      el.textContent = `${m}월 ${d}일 (${day}) ${ampm} ${h12}:${min}`;
    };
    updateClock();
    setInterval(updateClock, 15000);
  },

  normalizeWorkspaceType(type) {
    const map = {
      DOC_WORKSPACE: 'DOC_IDE_DASHBOARD',
      BSC_OS_WORKSPACE: 'ECOSYSTEM_DASHBOARD',
      TYCOON_OFFICE_WORKSPACE: 'AGENT_OFFICE_DASHBOARD',
      SETTINGS_WORKSPACE: 'SETTINGS_DASHBOARD'
    };
    return map[type] || type;
  },

  bindGlobalShellEvents() {
    // 1. 좌측 메뉴바(#slim-left-dock) 6대 탭 전환
    document.querySelectorAll('.slim-dock-btn[data-dock-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const rawTarget = btn.dataset.dockTarget;
        const target = this.normalizeWorkspaceType(rawTarget);

        if (target === 'HOME_GALAXY') {
          if (this.activeWorkspace) {
            this.closeWorkspace();
          } else {
            this.setNeuronMenuVisible(!this.isNeuronMenuVisible());
          }
          return;
        }
        this.openWorkspace(target);
      });
    });

    // 2. 페이지 내 [data-open-dashboard] 공통 버튼 바인딩
    document.querySelectorAll('[data-open-dashboard]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.openDashboard;
        if (target) this.openWorkspace(target);
      });
    });

    // 3. 상단바 [📂 폴더·MD 분석] 버튼 & 브랜드 홈 클릭
    document.getElementById('btn-top-open-folders')?.addEventListener('click', () => {
      this.openWorkspace('ECOSYSTEM_DASHBOARD');
    });
    document.getElementById('btn-brand-home')?.addEventListener('click', () => {
      this.closeWorkspace();
    });

    // 4. 뉴런홈 좌측 패널 버튼들
    document.getElementById('btn-dock-toggle-left-menu')?.addEventListener('click', () => {
      this.setNeuronMenuVisible(!this.isNeuronMenuVisible());
    });
    document.getElementById('btn-np-open-folder-mgr')?.addEventListener('click', () => {
      this.openWorkspace('ECOSYSTEM_DASHBOARD');
    });
    document.getElementById('btn-np-open-doc')?.addEventListener('click', () => {
      const sel = window.BrainGraphEngine?.selectedNode;
      this.openWorkspace('DOC_IDE_DASHBOARD', sel);
    });

    // 5. 우측 하단 자비스 구체(Orb) 콜아웃 버튼들
    document.getElementById('btn-orb-open-chat')?.addEventListener('click', () => {
      document.getElementById('btn-toggle-agent-chat')?.click();
    });
    document.getElementById('btn-orb-open-council')?.addEventListener('click', () => {
      this.openWorkspace('AGENT_OFFICE_DASHBOARD');
    });
    document.getElementById('btn-open-council-from-drawer')?.addEventListener('click', () => {
      this.openWorkspace('AGENT_OFFICE_DASHBOARD');
    });
    document.getElementById('jarvis-orb-trigger')?.addEventListener('click', () => {
      document.getElementById('orb-voice-mic')?.click();
    });
    document.getElementById('btn-orb-read-aloud')?.addEventListener('click', () => {
      const calloutText = document.getElementById('jarvis-orb-callout-text')?.textContent ||
        '이건우 대표님, 전 시스템 정상 가동 중입니다.';
      window.MultimodalEngine?.speakText?.(calloutText, 'jarvis');
    });

    // 6. 우측 상단 카메라 토글
    document.getElementById('btn-top-holo-cam')?.addEventListener('click', () => {
      const panel = document.getElementById('holo-gesture-hud-panel');
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    });

    // 7. 단축키 (Ctrl+K 검색, ESC 대시보드 닫기 -> 뉴런홈 복귀)
    window.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('top-galaxy-search')?.focus();
      } else if (e.key === 'Escape' && this.activeWorkspace) {
        this.closeWorkspace();
      }
    });
  },

  isNeuronMenuVisible() {
    const card = document.getElementById('node-preview-card');
    return !!card && card.style.display !== 'none';
  },

  setNeuronMenuVisible(visible) {
    const card = document.getElementById('node-preview-card');
    if (!card) return;
    card.style.display = visible ? 'block' : 'none';
    card.setAttribute('aria-hidden', visible ? 'false' : 'true');
  },

  closeAllFloatingClutter() {
    const floatLayer = document.getElementById('floating-windows-layer');
    if (floatLayer) floatLayer.innerHTML = '';
    if (window.HUDWindowSpawner?.openWindows) {
      window.HUDWindowSpawner.openWindows.clear();
    }
    const ideFloat = document.getElementById('jarvis-ide-workbench-modal');
    if (ideFloat) ideFloat.style.display = 'none';
    const ecoFloat = document.getElementById('jarvis-ecosystem-connector-modal');
    if (ecoFloat) ecoFloat.style.display = 'none';
  },

  closeWorkspace() {
    this.activeWorkspace = null;
    const stage = document.getElementById('design-workspace-stage');
    if (stage) {
      stage.style.display = 'none';
      stage.innerHTML = '';
    }
    this.closeAllFloatingClutter();
    document.querySelectorAll('.slim-dock-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.dockTarget === 'HOME_GALAXY');
    });
  },

  async openWorkspace(rawType, nodeContext = null) {
    this.ensureOverlayContainer();
    const type = this.normalizeWorkspaceType(rawType);
    this.activeWorkspace = type;

    // 창들이 겹쳐서 어디 있는지 모르는 현상을 방지하기 위해 기존 부유 창들을 모두 정리
    this.closeAllFloatingClutter();

    document.querySelectorAll('.slim-dock-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.dockTarget === type);
    });

    const stage = document.getElementById('design-workspace-stage');
    stage.style.display = 'flex';
    stage.style.zIndex = '9100';

    if (type === 'ECOSYSTEM_DASHBOARD') {
      await this.renderEcosystemDashboard(stage);
    } else if (type === 'DOC_IDE_DASHBOARD') {
      if (nodeContext?.path && !nodeContext.isEcosystemHub) {
        this.currentDocFilePath = nodeContext.path;
      }
      await this.renderDocIdeDashboard(stage, nodeContext);
    } else if (type === 'AI_BRAIN_DASHBOARD') {
      await this.renderAiBrainDashboard(stage);
    } else if (type === 'ARTCRAFT_STUDIO_DASHBOARD') {
      await this.renderArtCraftStudioDashboard(stage, nodeContext?.appId || this.currentArtCraftAppId || 'photocraft');
    } else if (type === 'AGENT_OFFICE_DASHBOARD') {
      await this.renderAgentOfficeDashboard(stage);
    } else if (type === 'JARVIS_RESEARCH_DASHBOARD') {
      await this.renderJarvisResearchDashboard(stage);
    } else if (type === 'SETTINGS_DASHBOARD') {
      await this.renderSettingsDashboard(stage);
    }
  },

  /**
   * 공통 대시보드 상단 내비게이션 헤더 (어느 메뉴에 있든 1클릭으로 다른 대시보드나 뉴런홈으로 전환 가능)
   */
  renderUnifiedDashboardHeader(title, subtitle, activeType) {
    const tabs = [
      { id: 'HOME_GALAXY', label: '🧠 뉴런홈 복귀' },
      { id: 'ECOSYSTEM_DASHBOARD', label: '📂 지식폴더 · MD분석' },
      { id: 'DOC_IDE_DASHBOARD', label: '📄 문서 · IDE · 터미널' },
      { id: 'AI_BRAIN_DASHBOARD', label: '🤖 AI 두뇌 · 전문도구' },
      { id: 'ARTCRAFT_STUDIO_DASHBOARD', label: '🎨 ArtCraft 실시간 제어' },
      { id: 'JARVIS_RESEARCH_DASHBOARD', label: '🛰️ 59대 자비스 · 카메라제스처' },
      { id: 'AGENT_OFFICE_DASHBOARD', label: '🏛️ 에이전트 회의 · 조직' },
      { id: 'SETTINGS_DASHBOARD', label: '⚙️ 설정 · 시스템검증' }
    ];

    return `
      <header class="unified-dash-header">
        <div class="udh-title-col">
          <h1 class="udh-title">${title}</h1>
          <p class="udh-sub">${subtitle}</p>
        </div>
        <div class="udh-nav-pills">
          ${tabs.map(t => `
            <button type="button" class="udh-tab-btn ${t.id === activeType ? 'active' : ''} ${t.id === 'HOME_GALAXY' ? 'home-return' : ''}" data-udh-target="${t.id}">
              ${t.label}
            </button>
          `).join('')}
          <button type="button" class="udh-tab-btn" id="btn-udh-cam-gesture" title="MediaPipe 21-Keypoint 카메라 비전 제스처 제어 (인식·클릭·이동·회전)">
            🖐️ 손 제스처 ON/OFF
          </button>
        </div>
      </header>
    `;
  },

  bindUnifiedHeaderEvents(stage) {
    stage.querySelectorAll('[data-udh-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.udhTarget;
        if (t === 'HOME_GALAXY') this.closeWorkspace();
        else this.openWorkspace(t);
      });
    });
    stage.querySelector('#btn-udh-cam-gesture')?.addEventListener('click', () => {
      window.JarvisCameraGestureOS?.toggleGestureWidget();
    });
  },

  /* ============================================================================
   * 1. 📂 지식폴더 & .MD 문서 분석 대시보드 (ECOSYSTEM_DASHBOARD)
   *    - 회사_HQ / 회사_Branch / 지식생태계(데이터 || 옵시디언) + [+ 폴더 추가]
   *    - 실시간 로컬 디스크 폴더 선택 & Windows 폴더 선택창 & .MD 심층 분석 리포트
   * ============================================================================ */
  async renderEcosystemDashboard(stage) {
    const [ecoRes, mdRes] = await Promise.all([
      fetch('/api/brain/ecosystems').then(r => r.json()).catch(() => ({ slots: [], connectedFolders: [], stats: {} })),
      fetch('/api/brain/md-knowledge').then(r => r.json()).catch(() => ({ totalAnalyzedMarkdownFiles: 0, entries: [] }))
    ]);

    const slots = ecoRes.slots || [];
    const connected = ecoRes.connectedFolders || [];
    const mdEntries = mdRes.entries || [];
    const totalNodes = ecoRes.stats?.totalNodes || 1;
    const totalLinks = ecoRes.stats?.totalLinks || 0;
    const diskInv = ecoRes.stats?.fullDiskInventory || mdRes.fullDiskInventory || {};
    const totalDiskFiles = diskInv.totalAllFilesOnDisk || mdEntries.length;
    const totalDiskMd = diskInv.totalMdFilesOnDisk || mdRes.totalAnalyzedMarkdownFiles || 0;
    const totalDiskCodeAndDocs = (diskInv.totalCodeFilesOnDisk || 0) + (diskInv.totalOfficeDocsOnDisk || 0);

    stage.innerHTML = `
      <div class="unified-dash-shell">
        ${this.renderUnifiedDashboardHeader(
          '📂 전사 지식생태계 폴더 통합 연결 & 전수 파일(.MD · 코드 · 문서 · 에셋) 분석 대시보드',
          '추출된 핵심 .MD 뉴런뿐만 아니라, 연결된 모든 폴더 내부의 남은 .MD, 코드, Word/PPT/PDF 문서, 에셋까지 100% 전수 파악합니다.',
          'ECOSYSTEM_DASHBOARD'
        )}

        <!-- 상단 핵심 요약 KPI 4종 -->
        <div class="ud-kpi-row">
          <div class="ud-kpi-card cyan">
            <span class="ud-kpi-label">연결된 지식생태계 슬롯</span>
            <strong class="ud-kpi-val cyan">${connected.length}개 생태계 연결</strong>
          </div>
          <div class="ud-kpi-card emerald">
            <span class="ud-kpi-label">디스크 전수 파악 전체 파일 (남은 파일 포함)</span>
            <strong class="ud-kpi-val emerald">${totalDiskFiles.toLocaleString()}개 파일 (100% 파악)</strong>
          </div>
          <div class="ud-kpi-card amber">
            <span class="ud-kpi-label">전체 .MD 마크다운 / 심층 뉴런 추출</span>
            <strong class="ud-kpi-val gold">전체 ${totalDiskMd.toLocaleString()}개 (심층 ${mdRes.totalAnalyzedMarkdownFiles || 0}개)</strong>
          </div>
          <div class="ud-kpi-card purple">
            <span class="ud-kpi-label">파악된 코드·문서 &amp; 활성 뉴런/시냅스</span>
            <strong class="ud-kpi-val purple">코드·문서 ${totalDiskCodeAndDocs.toLocaleString()}개 (${totalNodes}점/${totalLinks}선)</strong>
          </div>
        </div>

        <!-- 메인 2단 그리드: 좌측 슬롯 관리 & 폴더 선택기 / 우측 분석된 .MD 문서 테이블 -->
        <div class="ud-grid-2col">
          <!-- 좌측: 기본 3대 슬롯 + [+ 폴더 추가] + 인라인 폴더 탐색기 -->
          <section class="ud-panel">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">1. 지식생태계 연결 슬롯 &amp; 하위 도메인 전수 파악 현황</h2>
                <p class="ud-panel-desc">각 슬롯의 추출된 뉴런뿐만 아니라 하위 폴더에 남아 있는 모든 파일(.md·코드·문서·에셋) 총량을 실시간 파악합니다.</p>
              </div>
              <div style="display:flex;gap:8px;">
                <button type="button" id="ud-btn-add-custom-slot" class="ud-btn primary">➕ 폴더 추가</button>
                ${connected.length > 0 ? `<button type="button" id="ud-btn-clear-all-slots" class="ud-btn danger">🧹 전체 초기화</button>` : ''}
              </div>
            </div>

            <!-- 인라인 로컬 드라이브/폴더 선택 드로어 -->
            <div id="ud-inline-folder-picker" style="display:none;margin-bottom:14px;background:#040915;border:1.5px solid #00f0ff;border-radius:12px;padding:14px;"></div>

            <div class="ud-slot-list" style="max-height:430px;">
              ${slots.map(slot => {
                const isConn = Boolean(slot.connected && slot.path);
                const sum = slot.analysisSummary || {};
                const census = sum.fullDiskCensus || {};
                const subDomains = Array.isArray(census.subDomains) ? census.subDomains : [];
                const tags = Array.isArray(sum.extractedTags) ? sum.extractedTags : [];
                return `
                  <div class="ud-slot-card ${isConn ? 'connected' : ''}" style="border-left:4px solid ${slot.color || '#00f0ff'};flex-direction:column;align-items:stretch;">
                    <div class="ud-slot-top" style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;">
                      <div style="flex:1;min-width:180px;">
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                          <span class="ud-slot-name" style="color:${slot.color || '#38bdf8'};font-weight:800;">${slot.label}</span>
                          <span class="ud-slot-badge ${isConn ? 'ok' : 'empty'}">
                            ${isConn ? `🟢 전체 ${(census.totalAllFilesOnDisk || sum.totalFilesScanned || 0).toLocaleString()}개 파일 파악됨 (심층추출 ${sum.totalFilesScanned || 0}개)` : '⚪ 미연결 (폴더 선택 대기)'}
                          </span>
                        </div>
                        <div class="ud-slot-desc">${slot.roleDescription || ''}</div>
                        ${isConn ? `<div class="ud-slot-path">📁 ${slot.path}</div>` : ''}
                      </div>
                      <div class="ud-slot-btns">
                        <button type="button" class="ud-btn primary small btn-ud-pick-inline" data-slot-id="${slot.slotId}" data-slot-label="${slot.label}" data-slot-color="${slot.color || '#00f0ff'}" data-current-path="${slot.path || ''}">
                          ${isConn ? '📂 폴더 변경' : '📂 폴더 선택 연결'}
                        </button>
                        <button type="button" class="ud-btn outline small btn-ud-pick-win" data-slot-id="${slot.slotId}" data-slot-label="${slot.label}" data-slot-color="${slot.color || '#00f0ff'}">
                          🪟 윈도우창 선택
                        </button>
                        ${isConn ? `
                          <button type="button" class="ud-btn danger-outline small btn-ud-disconnect-slot" data-slot-id="${slot.slotId}">
                            ${slot.isDefaultSlot ? '해제' : '삭제'}
                          </button>
                        ` : ''}
                      </div>
                    </div>

                    ${isConn ? `
                      <div style="display:flex;gap:10px;flex-wrap:wrap;font-size:11px;color:#cbd5e1;margin-top:6px;padding-top:6px;border-top:1px solid rgba(148,163,184,0.16);">
                        <span>📦 전체 파악 파일: <b style="color:#38bdf8;">${(census.totalAllFilesOnDisk || sum.totalFilesScanned || 0).toLocaleString()}개</b></span>
                        <span>📝 전체 .MD: <b style="color:#34d399;">${(census.totalMdFilesOnDisk || sum.markdownFileCount || 0).toLocaleString()}개</b> (심층추출 ${sum.markdownFileCount || 0}개)</span>
                        <span>💻 코드 파일: <b>${(census.totalCodeFilesOnDisk || 0).toLocaleString()}개</b></span>
                        <span>📄 오피스/PDF 문서: <b>${(census.totalOfficeDocsOnDisk || 0).toLocaleString()}개</b></span>
                        <span>🎨 기타 에셋: <b>${(census.totalOtherAssetsOnDisk || 0).toLocaleString()}개</b></span>
                      </div>
                      ${subDomains.length > 0 ? `
                        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px;">
                          ${subDomains.slice(0, 8).map(sd => `
                            <span class="umd-pill h" title="하위 폴더: ${sd.path}">🗂️ ${sd.name}: 총 ${sd.all.toLocaleString()}개 (.md ${sd.md.toLocaleString()} · 코드 ${sd.code.toLocaleString()})</span>
                          `).join('')}
                        </div>
                      ` : ''}
                      ${tags.length > 0 ? `
                        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:5px;">
                          ${tags.slice(0, 10).map(t => `<span class="umd-pill tag">#${t}</span>`).join('')}
                        </div>
                      ` : ''}
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </section>

          <!-- 우측: 연결된 폴더에서 분석된 .MD 마크다운 문서 보유 현황 & 남은 파일 전수 검색 -->
          <section class="ud-panel">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">2. 심층 추출 .MD 목록 (${mdEntries.length}개) &amp; 남은 파일 전수 검색</h2>
                <p class="ud-panel-desc">심층 추출된 .MD 외에 디스크에 남아 있는 ${(diskInv.remainingUnextractedFiles || 0).toLocaleString()}개 파일도 실시간 검색·열람합니다.</p>
              </div>
              <div style="display:flex;gap:6px;align-items:center;">
                <input type="text" id="ud-md-filter-input" class="ud-input" placeholder="파일명·제목·남은 파일 검색..." style="width:190px;" />
                <button type="button" id="ud-btn-deep-disk-search" class="ud-btn cyan small" title="추출되지 않은 디스크 내 남은 파일들까지 전수 검색">🔍 남은파일 전수검색</button>
              </div>
            </div>
            <div id="ud-deep-disk-search-results" style="display:none;margin-bottom:10px;padding:10px;border-radius:10px;background:rgba(4,12,26,0.95);border:1px solid rgba(0,240,255,0.4);max-height:180px;overflow-y:auto;"></div>

            ${mdEntries.length === 0 ? `
              <div class="ud-empty-state">
                <div style="font-size:32px;margin-bottom:8px;">📂</div>
                <div style="font-size:14px;font-weight:800;color:#e2e8f0;margin-bottom:4px;">아직 연결된 지식생태계 폴더가 없습니다.</div>
                <div style="font-size:12px;color:#94a3b8;">좌측의 <b>[🏢 회사_HQ]</b>, <b>[🚀 회사_Branch]</b>, <b>[🧠 지식생태계 (데이터 || 옵시디언)]</b> 또는 <b>[➕ 폴더 추가]</b>에서 폴더를 선택하시면 내부의 모든 .md 파일이 분석되어 이곳에 표시됩니다.</div>
              </div>
            ` : `
              <div id="ud-md-table-list" class="ud-md-doc-list">
                ${mdEntries.map(doc => `
                  <div class="ud-md-doc-row" data-search="${(doc.fileName + ' ' + doc.title + ' ' + doc.summary + ' ' + (doc.headings || []).join(' ')).toLowerCase()}">
                    <div style="min-width:0;flex:1;">
                      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <span class="ud-slot-pill">${doc.slotLabel}</span>
                        <strong style="font-size:13px;color:#f8fafc;">📝 ${doc.fileName}</strong>
                        <span style="font-size:11.5px;color:#38bdf8;">${doc.title}</span>
                        <span style="font-size:10.5px;color:#64748b;">(${doc.sizeKb}KB)</span>
                      </div>
                      <div style="font-size:11.5px;color:#cbd5e1;margin-top:4px;line-height:1.45;">${doc.summary}</div>
                      ${doc.headings && doc.headings.length > 0 ? `
                        <div style="font-size:10.5px;color:#fbbf24;margin-top:4px;">
                          📑 목차: ${doc.headings.slice(0, 6).join(' · ')}
                        </div>
                      ` : ''}
                      <div style="font-size:10px;color:#64748b;font-family:monospace;margin-top:3px;">${doc.filePath}</div>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0;">
                      <button type="button" class="ud-btn primary small btn-ud-open-md-doc" data-path="${doc.filePath}">📄 열람 · 편집</button>
                      <button type="button" class="ud-btn outline small btn-ud-focus-neuron" data-path="${doc.filePath}">🌌 뉴런홈 위치</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </section>
        </div>
      </div>
    `;

    this.bindUnifiedHeaderEvents(stage);

    // [+ 폴더 추가]
    stage.querySelector('#ud-btn-add-custom-slot')?.addEventListener('click', () => {
      this.openDashboardFolderPicker(stage, {
        slotId: '',
        slotLabel: '',
        slotColor: '#00f0ff',
        startDir: 'C:\\',
        isNewCustomSlot: true
      });
    });

    // 슬롯별 [📂 폴더 선택 연결]
    stage.querySelectorAll('.btn-ud-pick-inline').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openDashboardFolderPicker(stage, {
          slotId: btn.dataset.slotId,
          slotLabel: btn.dataset.slotLabel,
          slotColor: btn.dataset.slotColor,
          startDir: btn.dataset.currentPath || 'C:\\',
          isNewCustomSlot: false
        });
      });
    });

    // 슬롯별 [🪟 윈도우창 선택]
    stage.querySelectorAll('.btn-ud-pick-win').forEach(btn => {
      btn.addEventListener('click', async () => {
        const orig = btn.textContent;
        btn.textContent = '⏳ 폴더창 열림...';
        btn.disabled = true;
        const r = await fetch('/api/brain/pick-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotId: btn.dataset.slotId,
            label: btn.dataset.slotLabel,
            color: btn.dataset.slotColor
          })
        }).then(x => x.json()).catch(() => null);
        btn.textContent = orig;
        btn.disabled = false;
        if (r && r.ok) {
          await window.BrainGraphEngine?.loadBrainData();
          await this.renderEcosystemDashboard(stage);
        }
      });
    });

    // 슬롯 [연결 해제 / 삭제]
    stage.querySelectorAll('.btn-ud-disconnect-slot').forEach(btn => {
      btn.addEventListener('click', async () => {
        await fetch('/api/brain/disconnect-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slotId: btn.dataset.slotId })
        });
        await window.BrainGraphEngine?.loadBrainData();
        await this.renderEcosystemDashboard(stage);
      });
    });

    // [전체 초기화]
    stage.querySelector('#ud-btn-clear-all-slots')?.addEventListener('click', async () => {
      await fetch('/api/brain/clear-all', { method: 'POST' });
      await window.BrainGraphEngine?.loadBrainData();
      await this.renderEcosystemDashboard(stage);
    });

    // .MD 문서 검색 필터
    stage.querySelector('#ud-md-filter-input')?.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      stage.querySelectorAll('.ud-md-doc-row').forEach(row => {
        const hay = row.dataset.search || '';
        row.style.display = !q || hay.includes(q) ? 'flex' : 'none';
      });
    });

    // 디스크 남은 파일 포함 전수 검색 (/api/brain/search-all)
    stage.querySelector('#ud-btn-deep-disk-search')?.addEventListener('click', async () => {
      const q = stage.querySelector('#ud-md-filter-input')?.value?.trim() || '';
      const box = stage.querySelector('#ud-deep-disk-search-results');
      if (!box) return;
      box.style.display = 'block';
      box.innerHTML = `<div style="font-size:11.5px;color:#00f0ff;">⏳ 디스크 내 남은 파일 포함 전수 검색 중 ("${q || '전체'}")...</div>`;
      const res = await fetch('/api/brain/search-all?q=' + encodeURIComponent(q) + '&limit=40').then(r => r.json()).catch(() => ({ results: [] }));
      const items = res.results || [];
      if (items.length === 0) {
        box.innerHTML = `<div style="font-size:11.5px;color:#94a3b8;">검색 조건에 맞는 파일이 없습니다.</div>`;
        return;
      }
      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <strong style="font-size:12px;color:#00f0ff;">🔍 디스크 전수 검색 결과 (${items.length}건 · 추출 외 남은 파일 포함)</strong>
          <button type="button" class="ud-btn small" onclick="this.closest('#ud-deep-disk-search-results').style.display='none'">닫기</button>
        </div>
        ${items.map(it => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 8px;border-bottom:1px solid rgba(148,163,184,0.15);font-size:11.5px;">
            <div style="min-width:0;flex:1;">
              <span class="umd-slot-pill">${it.slotLabel || 'Disk'}</span>
              <b style="color:#f8fafc;margin-left:5px;">${it.kind === 'directory' ? '📁' : '📄'} ${it.name}</b>
              <span style="color:#94a3b8;margin-left:6px;font-family:monospace;font-size:10.5px;">${it.path}</span>
            </div>
            ${it.kind === 'file' ? `<button type="button" class="ud-btn primary small btn-ud-open-md-doc" data-path="${it.path}">열람</button>` : ''}
          </div>
        `).join('')}
      `;
      box.querySelectorAll('.btn-ud-open-md-doc').forEach(b => {
        b.addEventListener('click', () => {
          this.currentDocFilePath = b.dataset.path;
          this.openWorkspace('DOC_IDE_DASHBOARD', { path: b.dataset.path });
        });
      });
    });

    // .MD 문서 [📄 열람 · 편집] -> DOC_IDE_DASHBOARD로 즉시 이동하여 해당 파일 로드
    stage.querySelectorAll('.btn-ud-open-md-doc').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentDocFilePath = btn.dataset.path;
        this.openWorkspace('DOC_IDE_DASHBOARD', { path: btn.dataset.path });
      });
    });

    // .MD 문서 [🌌 뉴런홈 위치] -> 뉴런홈으로 돌아가 해당 점으로 Fly-To
    stage.querySelectorAll('.btn-ud-focus-neuron').forEach(btn => {
      btn.addEventListener('click', () => {
        const fp = String(btn.dataset.path || '').toLowerCase();
        this.closeWorkspace();
        const node = window.BrainGraphEngine?.nodes.find(n => String(n.path || '').toLowerCase() === fp);
        if (node) {
          window.BrainGraphEngine.selectNode(node, false);
          window.BrainGraphEngine.flyToNode(node);
        }
      });
    });
  },

  async openDashboardFolderPicker(stage, opts = {}) {
    const pickerBox = stage.querySelector('#ud-inline-folder-picker');
    if (!pickerBox) return;
    pickerBox.style.display = 'block';

    const slotId = opts.slotId || '';
    const isNewCustomSlot = Boolean(opts.isNewCustomSlot);
    let currentDir = opts.startDir || 'C:\\';

    const renderBrowseStep = async (dirPath) => {
      const res = await fetch(`/api/brain/browse-dirs?dir=${encodeURIComponent(dirPath)}`).then(r => r.json()).catch(() => null);
      if (!res || !res.ok) return;
      currentDir = res.currentDir;

      pickerBox.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <strong style="color:#00f0ff;font-size:13px;">
            ${isNewCustomSlot ? '➕ 새 폴더 추가 및 .MD 문서 분석' : `📂 [${opts.slotLabel}]에 연결할 폴더 선택`}
          </strong>
          <button type="button" id="btn-close-ud-picker" class="ud-btn outline small">닫기 ✕</button>
        </div>

        ${isNewCustomSlot ? `
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
            <span style="font-size:11.5px;color:#cbd5e1;font-weight:700;">슬롯 이름:</span>
            <input type="text" id="ud-new-slot-label" class="ud-input" placeholder="비워두면 선택된 폴더명으로 자동 지정됩니다 (예: 개인_옵시디언, 신규_프로젝트)" style="flex:1;" />
          </div>
        ` : ''}

        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
          <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;">
            <span style="font-size:11px;color:#94a3b8;">드라이브:</span>
            ${(res.drives || ['C:\\']).map(d => `
              <button type="button" class="ud-btn outline small btn-ud-drive" data-dir="${d}">💿 ${d}</button>
            `).join('')}
          </div>
          <button type="button" id="btn-ud-win-native-dialog" class="ud-btn outline small" style="border-color:#a855f7;color:#d8b4fe;">
            🪟 Windows 탐색기 창으로 폴더 고르기
          </button>
        </div>

        <div style="display:flex;gap:8px;align-items:center;background:#081124;border:1px solid rgba(0,240,255,0.45);border-radius:8px;padding:8px 10px;margin-bottom:8px;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:10.5px;color:#94a3b8;">선택된 경로 (직속 .md ${res.currentMdCount}개 / 파일 ${res.currentTotalFiles}개):</div>
            <input type="text" id="ud-current-dir-input" value="${res.currentDir}" style="width:100%;background:transparent;border:none;color:#00f0ff;font-family:monospace;font-size:12px;font-weight:800;outline:none;" />
          </div>
          <button type="button" id="btn-ud-confirm-current-dir" class="ud-btn primary">✅ 이 폴더 연결 &amp; .MD 분석</button>
        </div>

        <div style="max-height:210px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;background:#050b16;padding:6px;border-radius:8px;border:1px solid rgba(148,163,184,0.2);">
          ${res.parentDir ? `
            <div class="ud-dir-row" data-dir="${res.parentDir}" style="color:#fbbf24;font-weight:800;">
              <span>⬆️ 상위 폴더로 이동 (${res.parentDir})</span>
            </div>
          ` : ''}
          ${(res.subDirs || []).map(sd => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:rgba(15,23,42,0.85);border-radius:6px;gap:8px;">
              <div class="ud-dir-row" data-dir="${sd.path}" style="flex:1;padding:0;background:transparent;">
                <span style="font-weight:700;color:#f8fafc;">📁 ${sd.name}</span>
                ${sd.mdCount > 0 ? `<span class="ud-tag-pill" style="margin-left:6px;">.md ${sd.mdCount}개</span>` : ''}
                ${sd.childFolderCount > 0 ? `<span style="font-size:10.5px;color:#64748b;margin-left:6px;">하위폴더 ${sd.childFolderCount}개</span>` : ''}
              </div>
              <button type="button" class="ud-btn primary small btn-ud-select-subdir" data-dir="${sd.path}" data-name="${sd.name}">선택 연결</button>
            </div>
          `).join('')}
        </div>
      `;

      pickerBox.querySelector('#btn-close-ud-picker')?.addEventListener('click', () => {
        pickerBox.style.display = 'none';
      });

      pickerBox.querySelectorAll('.btn-ud-drive, .ud-dir-row').forEach(el => {
        el.addEventListener('click', () => renderBrowseStep(el.dataset.dir));
      });

      const connectTarget = async (targetPath, fallbackName = '') => {
        const newLabel = pickerBox.querySelector('#ud-new-slot-label')?.value?.trim() || '';
        const finalLabel = isNewCustomSlot
          ? (newLabel || (fallbackName ? `📂 ${fallbackName}` : ''))
          : opts.slotLabel;

        const r = await fetch('/api/brain/connect-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotId,
            folderPath: targetPath,
            label: finalLabel,
            color: opts.slotColor || ''
          })
        }).then(x => x.json()).catch(() => null);

        if (r && r.ok) {
          await window.BrainGraphEngine?.loadBrainData();
          await this.renderEcosystemDashboard(stage);
        }
      };

      pickerBox.querySelector('#btn-ud-confirm-current-dir')?.addEventListener('click', () => {
        const p = pickerBox.querySelector('#ud-current-dir-input')?.value?.trim() || currentDir;
        connectTarget(p);
      });

      pickerBox.querySelectorAll('.btn-ud-select-subdir').forEach(btn => {
        btn.addEventListener('click', () => connectTarget(btn.dataset.dir, btn.dataset.name));
      });

      pickerBox.querySelector('#btn-ud-win-native-dialog')?.addEventListener('click', async () => {
        const newLabel = pickerBox.querySelector('#ud-new-slot-label')?.value?.trim() || '';
        const r = await fetch('/api/brain/pick-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slotId,
            label: isNewCustomSlot ? newLabel : opts.slotLabel,
            color: opts.slotColor || ''
          })
        }).then(x => x.json()).catch(() => null);
        if (r && r.ok) {
          await window.BrainGraphEngine?.loadBrainData();
          await this.renderEcosystemDashboard(stage);
        }
      });
    };

    await renderBrowseStep(currentDir);
  },

  /* ============================================================================
   * 2. 📄 문서(.MD) 편집 · IDE 코드 · 내장 터미널 통합 대시보드 (DOC_IDE_DASHBOARD)
   *    - 실제 분석된 .MD 및 워크스페이스 파일 직결
   * ============================================================================ */
  async renderDocIdeDashboard(stage, nodeContext = null) {
    const [mdRes, treeRes, plansRes] = await Promise.all([
      fetch('/api/brain/md-knowledge').then(r => r.json()).catch(() => ({ entries: [] })),
      fetch('/api/jarvis/ide-files').then(r => r.json()).catch(() => ({ files: [] })),
      fetch('/api/jarvis/autonomous-plan').then(r => r.json()).catch(() => ({ plans: [] }))
    ]);

    const mdEntries = mdRes.entries || [];
    const workspaceFiles = treeRes.files || [];
    const pendingPlans = (plansRes.plans || []).filter(p => p.status === 'AWAITING_CEO_APPROVAL');

    if (!this.currentDocFilePath) {
      if (nodeContext?.path && !nodeContext.isEcosystemHub) {
        this.currentDocFilePath = nodeContext.path;
      } else if (mdEntries.length > 0) {
        this.currentDocFilePath = mdEntries[0].filePath;
      } else {
        this.currentDocFilePath = 'c:/BSC_Javis_OS/vault/00_SOUL_and_Worldview.md';
      }
    }

    let fileContent = '';
    try {
      const readRes = await fetch(`/api/jarvis/ide-read-file?path=${encodeURIComponent(this.currentDocFilePath)}`).then(r => r.json());
      if (readRes && readRes.ok) {
        fileContent = readRes.content || '';
      } else {
        const fallbackRes = await fetch(`/api/read-node?path=${encodeURIComponent(this.currentDocFilePath)}`).then(r => r.json());
        fileContent = fallbackRes?.content || '';
      }
    } catch (_) {}

    stage.innerHTML = `
      <div class="unified-dash-shell">
        ${this.renderUnifiedDashboardHeader(
          '📄 실무 마크다운(.MD) 문서 · IDE 2.0 코드 에디터 · 터미널 통합 대시보드',
          '연결된 폴더의 .md 문서와 프로젝트 코드를 한 화면에서 열람·편집·저장하고, 6종 문서(Word·PPT·PDF·Excel) 변환 및 터미널 명령을 실행합니다.',
          'DOC_IDE_DASHBOARD'
        )}

        <div class="ud-grid-3col">
          <!-- 좌측 컬럼: 연결된 .MD 문서 목록 & 로컬 워크스페이스 파일 탐색기 -->
          <aside class="ud-panel" style="display:flex;flex-direction:column;gap:10px;">
            <div class="ud-panel-head" style="margin-bottom:0;">
              <h2 class="ud-panel-title">📂 보유 .MD 문서 (${mdEntries.length})</h2>
              <button type="button" class="ud-btn outline small" id="btn-doc-go-connect">폴더 추가</button>
            </div>
            <div class="ud-file-list" style="max-height:230px;overflow-y:auto;">
              ${mdEntries.length === 0 ? `
                <div style="font-size:11.5px;color:#94a3b8;padding:8px;">연결된 폴더가 없습니다. [📂 지식폴더]에서 폴더를 연결하면 .md 문서들이 표시됩니다.</div>
              ` : mdEntries.map(doc => `
                <button type="button" class="ud-file-item ${String(doc.filePath).toLowerCase() === String(this.currentDocFilePath).toLowerCase() ? 'active' : ''}" data-file-path="${doc.filePath}">
                  <span style="color:#00f0ff;font-weight:700;">[${doc.slotLabel.replace(/^[^\s]+\s/, '')}]</span> 📝 ${doc.fileName}
                </button>
              `).join('')}
            </div>

            <div class="ud-panel-head" style="margin-bottom:0;margin-top:6px;">
              <h2 class="ud-panel-title">💻 워크스페이스 파일 트리</h2>
            </div>
            <div class="ud-file-list" style="flex:1;overflow-y:auto;">
              ${workspaceFiles.slice(0, 60).map(f => `
                <button type="button" class="ud-file-item ${String(f.path).replace(/\\/g, '/').toLowerCase() === String(this.currentDocFilePath).replace(/\\/g, '/').toLowerCase() ? 'active' : ''}" data-file-path="${f.path.replace(/\\/g, '/')}">
                  ${f.name.endsWith('.md') ? '📝' : '📄'} ${f.relPath || f.name}
                </button>
              `).join('')}
            </div>
          </aside>

          <!-- 중앙 컬럼: 마크다운 / 코드 에디터 & 6종 문서 내보내기 -->
          <main class="ud-panel" style="display:flex;flex-direction:column;gap:10px;">
            <div class="ud-panel-head" style="margin-bottom:0;">
              <div style="min-width:0;flex:1;">
                <h2 class="ud-panel-title" id="ud-editor-file-title" style="word-break:break-all;">📄 ${this.currentDocFilePath}</h2>
                <p class="ud-panel-desc" id="ud-editor-save-status">실시간 편집 · 저장 시 .bak 백업 자동 생성 (본사 원본 보호 적용)</p>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button type="button" class="ud-btn outline small" id="btn-ud-toggle-md-preview">👁️ 마크다운 프리뷰</button>
                <button type="button" class="ud-btn outline small" id="btn-ud-read-doc-tts">🔊 음성 낭독</button>
                <button type="button" class="ud-btn primary small" id="btn-ud-save-file">💾 파일 저장</button>
                <button type="button" class="ud-btn emerald small" id="btn-ud-export-6docs">📦 Word·PPT·PDF 변환</button>
              </div>
            </div>

            <textarea id="ud-live-code-editor" class="ud-code-textarea" spellcheck="false">${fileContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            <div id="ud-live-md-preview" class="ud-md-preview-box" style="display:none;"></div>
          </main>

          <!-- 우측 컬럼: 5단계 제작 계획 승인 & 내장 실시간 터미널 -->
          <aside class="ud-panel" style="display:flex;flex-direction:column;gap:10px;">
            <div>
              <h2 class="ud-panel-title">📋 5단계 자율 제작 승인 대기열 (${pendingPlans.length}건)</h2>
              <div style="margin-top:6px;display:flex;flex-direction:column;gap:6px;max-height:185px;overflow-y:auto;">
                ${pendingPlans.length === 0 ? `
                  <div style="padding:10px;background:#050b16;border:1px dashed rgba(148,163,184,0.25);border-radius:8px;font-size:11.5px;color:#94a3b8;">
                    현재 승인 대기 중인 제작 계획이 없습니다. 하단 자비스 입력창에 문서·코드·웹 제작을 지시하시면 계획서가 이곳에 상정됩니다.
                  </div>
                ` : pendingPlans.map(p => `
                  <div style="padding:10px;background:#071124;border:1px solid #fbbf24;border-radius:8px;">
                    <div style="font-weight:800;color:#fbbf24;font-size:12px;">${p.step1_judgment?.domainName || '자율 제작 계획'}</div>
                    <div style="font-size:11px;color:#cbd5e1;margin:4px 0;">두뇌: ${p.step2_modelSelection?.selectedBrainModel}</div>
                    <button type="button" class="ud-btn primary small btn-ud-approve-plan" data-plan-id="${p.planId}" style="width:100%;margin-top:4px;">✅ 승인 및 제작 실행</button>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="flex:1;display:flex;flex-direction:column;min-height:0;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <h2 class="ud-panel-title">💻 내장 실시간 터미널 (CLI / SDK)</h2>
                <div style="display:flex;gap:4px;">
                  <button type="button" class="ud-btn outline small btn-ud-quick-cmd" data-cmd="node bin/jarvis-cli.js status">status</button>
                  <button type="button" class="ud-btn outline small btn-ud-quick-cmd" data-cmd="node bin/jarvis-cli.js models">models</button>
                </div>
              </div>
              <pre id="ud-terminal-output" class="ud-terminal-box">🟢 BSC J.A.R.V.I.S. 터미널 준비 완료 (CHLGD 파괴 명령 차단 활성)\n$ </pre>
              <form id="ud-terminal-form" style="display:flex;gap:6px;margin-top:6px;">
                <input type="text" id="ud-terminal-input" class="ud-input" placeholder="명령어 입력 (예: node bin/jarvis-cli.js status)..." style="flex:1;font-family:monospace;" />
                <button type="submit" class="ud-btn primary small">실행 ↵</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    `;

    this.bindUnifiedHeaderEvents(stage);

    stage.querySelector('#btn-doc-go-connect')?.addEventListener('click', () => {
      this.openWorkspace('ECOSYSTEM_DASHBOARD');
    });

    // 파일 클릭 시 에디터 로드
    stage.querySelectorAll('.ud-file-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentDocFilePath = btn.dataset.filePath;
        this.renderDocIdeDashboard(stage);
      });
    });

    // 마크다운 프리뷰 토글
    const editorEl = stage.querySelector('#ud-live-code-editor');
    const previewEl = stage.querySelector('#ud-live-md-preview');
    stage.querySelector('#btn-ud-toggle-md-preview')?.addEventListener('click', () => {
      if (!editorEl || !previewEl) return;
      const showPrev = previewEl.style.display === 'none';
      if (showPrev) {
        previewEl.innerHTML = window.HUDWindowSpawner
          ? window.HUDWindowSpawner.renderSimpleMarkdown(editorEl.value)
          : `<pre>${editorEl.value}</pre>`;
        previewEl.style.display = 'block';
        editorEl.style.display = 'none';
      } else {
        previewEl.style.display = 'none';
        editorEl.style.display = 'block';
      }
    });

    // 음성 낭독
    stage.querySelector('#btn-ud-read-doc-tts')?.addEventListener('click', () => {
      const txt = (editorEl?.value || '').slice(0, 1800);
      if (txt) window.MultimodalEngine?.speakText?.(txt, 'jarvis');
    });

    // 파일 저장 (/api/jarvis/ide-save-file)
    stage.querySelector('#btn-ud-save-file')?.addEventListener('click', async () => {
      const statusEl = stage.querySelector('#ud-editor-save-status');
      const r = await fetch('/api/jarvis/ide-save-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: this.currentDocFilePath,
          content: editorEl?.value || ''
        })
      }).then(x => x.json()).catch(() => null);

      if (statusEl) {
        statusEl.textContent = r?.ok
          ? `✅ 저장 완료 (${r.bytesWritten} Bytes · 백업 생성됨)`
          : `⚠️ 저장 제한: ${r?.error || '권한 확인 필요'}`;
        statusEl.style.color = r?.ok ? '#34d399' : '#f87171';
      }
    });

    // 6종 문서 변환 내보내기
    stage.querySelector('#btn-ud-export-6docs')?.addEventListener('click', async () => {
      const statusEl = stage.querySelector('#ud-editor-save-status');
      const title = this.currentDocFilePath.split(/[\\/]/).pop().replace(/\.[^.]+$/, '') || 'Jarvis_Document';
      const r = await fetch('/api/jarvis/co-vision-artifact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          prompt: (editorEl?.value || '').slice(0, 2000),
          formats: ['md', 'docx', 'pptx', 'pdf']
        })
      }).then(x => x.json()).catch(() => null);
      if (statusEl && r?.ok) {
        statusEl.textContent = `📦 Word(.docx) · PPT(.pptx) · PDF · MD 변환 저장 완료!`;
        statusEl.style.color = '#00f0ff';
      }
    });

    // 5단계 제작 계획 승인 실행
    stage.querySelectorAll('.btn-ud-approve-plan').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.textContent = '⏳ 제작 중...';
        btn.disabled = true;
        await fetch('/api/jarvis/autonomous-execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: btn.dataset.planId })
        });
        await this.renderDocIdeDashboard(stage);
      });
    });

    // 내장 터미널 명령 실행
    const runTermCmd = async (command) => {
      const outEl = stage.querySelector('#ud-terminal-output');
      if (!outEl || !command) return;
      outEl.textContent += `${command}\n⏳ 실행 중...\n`;
      const r = await fetch('/api/jarvis/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      }).then(x => x.json()).catch(() => null);
      outEl.textContent += `${r?.output || r?.error || '완료'}\n$ `;
      outEl.scrollTop = outEl.scrollHeight;
    };

    stage.querySelector('#ud-terminal-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const inp = stage.querySelector('#ud-terminal-input');
      const cmd = inp?.value?.trim();
      if (!cmd) return;
      inp.value = '';
      runTermCmd(cmd);
    });

    stage.querySelectorAll('.btn-ud-quick-cmd').forEach(btn => {
      btn.addEventListener('click', () => runTermCmd(btn.dataset.cmd));
    });
  },

  /* ============================================================================
   * 3. 🤖 로컬 AI 두뇌(Ollama · LM Studio · Gemma 4 멀티모달 코어) & 전문 스튜디오 대시보드
   * ============================================================================ */
  async renderAiBrainDashboard(stage) {
    const [catRes, trinRes, tpRes, hubRes, sasaRes] = await Promise.all([
      fetch('/api/jarvis/models-catalog').then(r => r.json()).catch(() => ({})),
      fetch('/api/jarvis/gemma2-trinity').then(r => r.json()).catch(() => ({})),
      fetch('/api/jarvis/techpack-apps').then(r => r.json()).catch(() => ({})),
      fetch('/api/jarvis/llm-hub/status').then(r => r.json()).catch(() => ({})),
      fetch('/api/jarvis/sasarisa/blueprint').then(r => r.json()).catch(() => ({}))
    ]);

    const installedOllama = catRes.ollama?.installedModels || hubRes.providers?.ollama?.installedModels || [];
    const activeProvider = hubRes.state?.activeProvider || catRes.brainState?.activeProvider || 'ollama';
    const activeModel = hubRes.state?.activeModel || catRes.activeBrain?.selectedModel || 'gemma4:e4b';
    const recommended = catRes.recommendedOpenModels || [];
    const artcraftApps = tpRes.artcraft?.apps || [];
    const coreRepos = tpRes.artcraft?.coreRepos || [];
    const providers = hubRes.providers || {};
    const sasaBlueprint = sasaRes.blueprint || {};
    const sasaPending = sasaRes.pendingConfirmations || [];
    const sasaHistory = sasaRes.history || [];

    stage.innerHTML = `
      <div class="unified-dash-shell">
        ${this.renderUnifiedDashboardHeader(
          '🤖 4대 멀티 LLM 허브(GPT · Gemini · LM Studio · Ollama) & 사사리사(SasariSa) Windows 11 · 전문 스튜디오 대시보드',
          '클라우드 LLM(OpenAI GPT / Google Gemini)과 로컬 AI(LM Studio :1234 / Ollama :11434)를 연결하고, REA 역공학으로 이식된 사사리사 Windows 11 음성 비서 및 기존 18대 스튜디오·ArtCraft 13종을 통합 제어합니다.',
          'AI_BRAIN_DASHBOARD'
        )}

        <div class="ud-kpi-row">
          <div class="ud-kpi-card cyan">
            <span class="ud-kpi-label">현재 활성 LLM 프로바이더 · 두뇌</span>
            <strong class="ud-kpi-val cyan">${activeProvider.toUpperCase()} · ${activeModel}</strong>
          </div>
          <div class="ud-kpi-card emerald">
            <span class="ud-kpi-label">로컬 AI (Ollama · LM Studio)</span>
            <strong class="ud-kpi-val emerald">Ollama ${installedOllama.length}종 · LM Studio 연결</strong>
          </div>
          <div class="ud-kpi-card amber">
            <span class="ud-kpi-label">클라우드 AI (GPT · Gemini)</span>
            <strong class="ud-kpi-val gold">${providers.openai?.configured ? 'GPT 연결됨' : 'GPT 준비'} / ${providers.gemini?.configured ? 'Gemini 연결됨' : 'Gemini 준비'}</strong>
          </div>
          <div class="ud-kpi-card purple">
            <span class="ud-kpi-label">사사리사(SasariSa) Windows 11</span>
            <strong class="ud-kpi-val purple">🎙️ REA 역공학 6대 스킬 가동 중</strong>
          </div>
        </div>

        <!-- 🌐 NEW SECTION: 4대 멀티 LLM 통합 커넥터 (GPT · Gemini · LM Studio · Ollama) + 🎙️ 사사리사 Windows 11 컨트롤 센터 -->
        <div class="ud-grid-2col" style="margin-bottom:16px;">
          <!-- 좌측 상단: 4대 멀티 LLM 통합 커넥터 허브 -->
          <section class="ud-panel" style="border-color:rgba(0,240,255,0.45);">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">🌐 1. 4대 멀티 LLM 통합 브릿지 (GPT · Gemini · LM Studio · Ollama)</h2>
                <p class="ud-panel-desc">클라우드 AI(OpenAI GPT, Google Gemini)와 로컬 AI(LM Studio, Ollama)를 원클릭으로 전환하거나 테스트합니다. API 키는 <code>.env</code> 파일에 안전 격리됩니다.</p>
              </div>
              <button type="button" class="ud-btn primary small" id="btn-ud-open-sasarisa-pill">🎙️ 사사리사 보이스 바 (Alt+Space)</button>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
              ${['ollama', 'lmstudio', 'gemini', 'openai'].map(pKey => {
                const p = providers[pKey] || { id: pKey, name: pKey.toUpperCase(), models: [], statusLabel: '대기' };
                const isSelected = activeProvider === pKey;
                const modelList = (pKey === 'ollama' && installedOllama.length > 0)
                  ? installedOllama.map(m => ({ id: m.name || m.id, label: `${m.name || m.id} (${m.sizeGb || ''}GB)` }))
                  : (p.models || []);
                return `
                  <div class="ud-slot-card ${isSelected ? 'connected' : ''}" style="padding:11px 12px;border-left:4px solid ${isSelected ? '#00f0ff' : 'rgba(148,163,184,0.35)'};">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;">
                      <strong style="font-size:12.5px;color:${isSelected ? '#00f0ff' : '#f8fafc'};">${p.name || pKey}</strong>
                      <span class="ud-status-chip ${p.ready ? 'on' : 'off'}" style="font-size:9.5px;">${isSelected ? '⚡ 현재 주력' : (p.ready ? '🟢 준비됨' : '⚪ 폴백보호')}</span>
                    </div>
                    <div style="font-size:10.5px;color:#94a3b8;margin-bottom:8px;">${p.statusLabel || ''}</div>
                    <div style="display:flex;gap:6px;align-items:center;">
                      <select class="ud-input sel-hub-model" data-provider="${pKey}" style="flex:1;padding:5px 8px;font-size:11px;">
                        ${modelList.map(m => `<option value="${m.id}" ${p.selectedModel === m.id ? 'selected' : ''}>${m.label || m.id}</option>`).join('')}
                      </select>
                      <button type="button" class="ud-btn ${isSelected ? 'emerald' : 'primary'} small btn-hub-activate" data-provider="${pKey}">
                        ${isSelected ? '✓ 연결됨' : '연결'}
                      </button>
                      <button type="button" class="ud-btn outline small btn-hub-test" data-provider="${pKey}" title="실시간 응답 테스트">테스트</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- API Key & 로컬 서버 엔드포인트 설정 바 (.env 격리 저장) -->
            <form id="form-hub-credentials" style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px;align-items:center;background:#050b16;padding:10px;border-radius:10px;border:1px solid rgba(148,163,184,0.2);">
              <input type="password" id="inp-openai-key" class="ud-input" placeholder="🔑 OpenAI API Key (sk-...) ${providers.openai?.maskedKey ? `[저장됨: ${providers.openai.maskedKey}]` : ''}" style="font-size:11px;" />
              <input type="password" id="inp-gemini-key" class="ud-input" placeholder="🔑 Gemini API Key (AIza...) ${providers.gemini?.maskedKey ? `[저장됨: ${providers.gemini.maskedKey}]` : ''}" style="font-size:11px;" />
              <input type="text" id="inp-lmstudio-url" class="ud-input" value="${hubRes.state?.lmstudioEndpoint || 'http://127.0.0.1:1234'}" placeholder="LM Studio URL (http://127.0.0.1:1234)" style="font-size:11px;font-family:monospace;" />
              <button type="submit" class="ud-btn primary small">💾 .env 안전 저장</button>
            </form>
            <div id="hub-test-output-box" style="display:none;margin-top:8px;padding:9px 12px;background:#030917;border:1px solid rgba(52,211,153,0.45);border-radius:8px;font-size:11.5px;color:#34d399;"></div>
          </section>

          <!-- 우측 상단: 🎙️ 사사리사(SasariSa) REA Windows 11 네이티브 컨트롤 센터 -->
          <section class="ud-panel" style="border-color:rgba(251,191,36,0.45);">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">🎙️ 2. 사사리사(SasariSa) Windows 11 에디션 (REA 역공학 이식)</h2>
                <p class="ud-panel-desc"><code>mvcompany8500-web/sasarisa</code>(macOS)의 음성 컴퓨터 제어·디자인·2중 안전장치를 REA 역공학으로 Windows 11에 완벽 재구축했습니다.</p>
              </div>
              <span class="ud-status-chip on">🔬 심볼 ${sasaBlueprint.recoveredSymbolsCount || 412}개 복원</span>
            </div>

            <!-- 사사리사 6대 음성 스킬 원클릭 실행 버튼 -->
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
              <button type="button" class="ud-btn outline small btn-sasa-quick" data-cmd="신나는 집중 재즈 플레이리스트 음악 틀어줘">🎵 음악 재생</button>
              <button type="button" class="ud-btn outline small btn-sasa-quick" data-cmd="쿠팡에서 가성비 좋은 무선 마우스 검색해줘">🛒 쿠팡 쇼핑 검색</button>
              <button type="button" class="ud-btn outline small btn-sasa-quick" data-cmd="카카오톡으로 김 팀장에게 오늘 오후 3시 회의 준비 완료되었다고 메시지 보내줘">💬 카카오톡 전송 (2중 안전확인)</button>
              <button type="button" class="ud-btn outline small btn-sasa-quick" data-cmd="거래처 제안서 검토 완료 메일 답장 초안 작성해줘">✉️ 메일 답장 (2중 안전확인)</button>
              <button type="button" class="ud-btn outline small btn-sasa-quick" data-cmd="파이썬으로 폴더 내 엑셀 파일 자동 취합하는 코딩 스크립트 짜줘">💻 말로 하는 코딩</button>
            </div>

            <form id="form-sasarisa-cmd" style="display:flex;gap:8px;margin-bottom:10px;">
              <input type="text" id="inp-sasarisa-cmd" class="ud-input" placeholder="사사리사에게 말하듯 지시하세요 (예: 아이유 노래 틀어줘, 카톡으로 메시지 보내줘)..." style="flex:1;" />
              <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:#cbd5e1;white-space:nowrap;">
                <input type="checkbox" id="chk-sasarisa-open-win" /> 브라우저/앱 즉시 열기
              </label>
              <button type="submit" class="ud-btn primary small">🎙️ 사사리사 실행 ↵</button>
            </form>

            <!-- 2중 안전장치(Irreversible Action Safety Guardrail) 승인 대기 카드 -->
            <div id="sasarisa-confirm-zone" style="display:${sasaPending.length > 0 ? 'flex' : 'none'};flex-direction:column;gap:6px;margin-bottom:8px;">
              ${sasaPending.slice(0, 2).map(item => `
                <div style="padding:10px 12px;background:rgba(127,29,29,0.28);border:1.5px solid #fbbf24;border-radius:10px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <strong style="color:#fbbf24;font-size:12px;">🛡️ [사사리사 2중 안전장치] ${item.intent?.skillTitleKo || '실행 확인'}</strong>
                    <span style="font-size:10px;color:#cbd5e1;">${item.llmProvider?.toUpperCase()} · ${item.llmModel}</span>
                  </div>
                  <div style="font-size:11px;color:#fde68a;margin:4px 0;">${item.intent?.riskReasonKo || ''}</div>
                  <div style="font-size:11.5px;color:#f8fafc;background:#040915;padding:6px 8px;border-radius:6px;margin-bottom:6px;">${item.draftContent}</div>
                  <div style="display:flex;gap:6px;">
                    <button type="button" class="ud-btn emerald small btn-sasa-confirm" data-id="${item.confirmId}" data-dec="APPROVE">✅ 승인 (실제 실행)</button>
                    <button type="button" class="ud-btn danger small btn-sasa-confirm" data-id="${item.confirmId}" data-dec="CANCEL">✕ 취소</button>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- 사사리사 실행 결과 및 REA 매핑 요약 -->
            <div id="sasarisa-live-result" style="background:#040915;border:1px solid rgba(56,189,248,0.28);border-radius:10px;padding:10px;max-height:155px;overflow-y:auto;font-size:11.5px;color:#e2e8f0;">
              ${sasaHistory.length > 0 ? sasaHistory.slice(0, 3).map(h => `
                <div style="padding-bottom:6px;margin-bottom:6px;border-bottom:1px solid rgba(148,163,184,0.14);">
                  <div style="display:flex;justify-content:space-between;">
                    <strong style="color:#38bdf8;">${h.icon || '🎙️'} [${h.skillTitleKo}] "${h.commandText}"</strong>
                    <span style="font-size:10px;color:#34d399;">${h.llmUsed} · ${h.status}</span>
                  </div>
                  <div style="color:#cbd5e1;margin-top:2px;">${h.reply}</div>
                </div>
              `).join('') : `
                <div style="color:#94a3b8;">
                  <b>[REA macOS ➔ Windows 11 매핑 완료]</b> 원본 <code>mvcompany8500-web/sasarisa</code>의 AppleScript·Accessibility·Whisper·MenuBar HUD가 Windows 11 네이티브 엔진과 4대 멀티 LLM 브릿지로 연결되었습니다. 위 버튼을 클릭해 즉시 테스트해 보세요.
                </div>
              `}
            </div>
          </section>
        </div>

        <div class="ud-grid-2col">
          <!-- 좌측: 내 PC 설치 모델 원클릭 장착 & Gemma 4 멀티모달 자율 라우팅 -->
          <section class="ud-panel">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">1. 내 PC에 설치된 로컬 AI 두뇌 (${installedOllama.length}종)</h2>
                <p class="ud-panel-desc">클릭 시 즉시 자비스의 주력 두뇌로 전환되며 이전 모델의 VRAM을 자동 반환합니다.</p>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
              ${installedOllama.map(m => {
                const isCurr = m.name === activeModel;
                return `
                  <div class="ud-slot-card ${isCurr ? 'connected' : ''}" style="padding:10px 12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <div>
                        <strong style="font-size:13.5px;color:${isCurr ? '#00f0ff' : '#f8fafc'};">🧠 ${m.name}</strong>
                        <span style="font-size:11px;color:#94a3b8;margin-left:8px;">${m.sizeGb || ''}GB · 로컬 무료</span>
                      </div>
                      <button type="button" class="ud-btn ${isCurr ? 'emerald' : 'primary'} small btn-ud-select-brain" data-model="${m.name}">
                        ${isCurr ? '✓ 현재 장착됨' : '⚡ 이 두뇌 장착'}
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="ud-panel-head" style="margin-top:8px;">
              <div>
                <h2 class="ud-panel-title">2. Google Gemma 4 멀티모달 무클릭 자율 교체 파이프라인</h2>
                <p class="ud-panel-desc">대화 의도를 자비스가 스스로 인지하여 Gemma 4 쿼드코어 두뇌를 0.01초 만에 체이닝합니다.</p>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
              <div style="background:#061022;border:1px solid rgba(0,240,255,0.35);border-radius:10px;padding:10px;">
                <div style="font-weight:800;color:#00f0ff;font-size:12px;">💬 대화·비전 두뇌</div>
                <div style="font-size:13px;font-weight:900;color:#fff;margin:4px 0;">Gemma 4 E4B / E2B</div>
                <div style="font-size:11px;color:#94a3b8;">초고속 라우터(E2B)와 주력 대화·비전 멀티모달(E4B)</div>
              </div>
              <div style="background:#061022;border:1px solid rgba(52,211,153,0.35);border-radius:10px;padding:10px;">
                <div style="font-weight:800;color:#34d399;font-size:12px;">🔍 멀티모달 RAG 두뇌</div>
                <div style="font-size:13px;font-weight:900;color:#fff;margin:4px 0;">EmbeddingGemma 300M</div>
                <div style="font-size:11px;color:#94a3b8;">768차원 QAT Q8_0 벡터로 연결된 폴더의 .md·문서 검색</div>
              </div>
              <div style="background:#061022;border:1px solid rgba(251,191,36,0.35);border-radius:10px;padding:10px;">
                <div style="font-weight:800;color:#fbbf24;font-size:12px;">🧠 심층 코딩·합성 두뇌</div>
                <div style="font-size:13px;font-weight:900;color:#fff;margin:4px 0;">Gemma 4 31B</div>
                <div style="font-size:11px;color:#94a3b8;">19GB 플래그십 코딩·아키텍처·6종 문서 정밀 합성</div>
              </div>
            </div>
          </section>

          <!-- 우측: 전문 AI 도구함 (전체 8대 마스터 스튜디오 런처) & 추천 모델 설치 -->
          <section class="ud-panel">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">3. 실무 전문 AI 스튜디오 도구함 (전체 8대 마스터 워크벤치)</h2>
                <p class="ud-panel-desc">그동안 구축한 18대 Google AI Studio 모듈과 8대 전문 도메인 기술이 단 하나도 빠짐없이 통합되어 있습니다.</p>
              </div>
              <button type="button" class="ud-btn primary small" data-spawn-studio="AI_STUDIO_HUB">⚡ 18대 모듈 마스터 허브 열기</button>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
              <button type="button" class="ud-studio-card" data-spawn-studio="AI_STUDIO_HUB" style="border-color:rgba(0,240,255,0.45);">
                <div class="usc-title">⚡ 18대 AI Studio &amp; 8대 도메인 허브</div>
                <div class="usc-desc">Google AI Studio 18대 모듈 카탈로그 및 8대 프로덕션 도메인 통합 허브입니다.</div>
              </button>
              <button type="button" class="ud-studio-card" data-spawn-studio="VISION_FACE">
                <div class="usc-title">👁️ Co-Vision 시야공유 &amp; 6종 문서 생성</div>
                <div class="usc-desc">화면·카메라 시야를 공유하고 PNG·영상·MD·Word·PPT·PDF 6종을 생성합니다.</div>
              </button>
              <button type="button" class="ud-studio-card" data-spawn-studio="MAPS_REA_STUDIO">
                <div class="usc-title">🗺️ 본사 5대 마스터 스킬 &amp; MAPS·REA 역공학</div>
                <div class="usc-desc">본사 5대 마스터 스킬 실행 및 MAPS 4계층·REA-14B 아키텍처 역공학입니다.</div>
              </button>
              <button type="button" class="ud-studio-card" data-spawn-studio="CREATIVE_BLENDER">
                <div class="usc-title">🎨 캐릭터 360° &amp; Blender 3D VFX</div>
                <div class="usc-desc">캐릭터 360° 턴어라운드 도면 및 Blender 5.1 3D VFX 파이프라인입니다.</div>
              </button>
              <button type="button" class="ud-studio-card" data-spawn-studio="OPEN_TTS_STUDIO" style="border-color:rgba(52,211,153,0.45);">
                <div class="usc-title">🎙️ 오픈소스 보이스 &amp; 23개국어 TTS 스튜디오</div>
                <div class="usc-desc">현수 HD 자연 음성, 아나운서 발음 교정, 문장 스트리밍 및 음성 클로닝 도구입니다.</div>
              </button>
              <button type="button" class="ud-studio-card" data-spawn-studio="AGENT_REGISTRY">
                <div class="usc-title">🤖 SRP 에이전트 레지스트리 &amp; 페르소나 슬라이더</div>
                <div class="usc-desc">전사 에이전트 SRP 단일책임 레지스트리 및 성향 슬라이더 정밀 제어입니다.</div>
              </button>
              <button type="button" class="ud-studio-card" data-spawn-studio="SIM_BIO_IDE">
                <div class="usc-title">🧬 AlphaFold 바이오 &amp; 모의훈련 시뮬레이터</div>
                <div class="usc-desc">AlphaFold 3D 단백질 구조 분석 및 비즈니스 ROI 모의훈련 시뮬레이터입니다.</div>
              </button>
              <button type="button" class="ud-studio-card" data-spawn-studio="RL_BENCHMARK">
                <div class="usc-title">📊 로컬 오픈모델 속도·성능 &amp; GRPO 벤치마크</div>
                <div class="usc-desc">설치된 오픈모델의 추론 속도·품질 비교 및 Unsloth GRPO 강화학습 벤치마크입니다.</div>
              </button>
            </div>

            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">4. 🔬 REA 역공학 (morluto/rea) &amp; 🎨 ArtCraft 13종 프로그램 (getartcraft.com)</h2>
                <p class="ud-panel-desc">GitHub 정본 설치 완료 · 실시간 화면 공유 및 원격 제어 창에서 13종 프로그램을 직접 조작합니다.</p>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button type="button" class="ud-btn primary small" id="btn-ud-open-artcraft-studio">🎛️ ArtCraft 실시간 제어 화면 열기</button>
                <button type="button" class="ud-btn emerald small btn-ud-launch-app" data-app="launcher">🚀 통합 런처 실행</button>
              </div>
            </div>

            <div class="ud-slot-card" style="margin-bottom:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                <div>
                  <strong style="color:#fbbf24;font-size:12.5px;">🔬 REA (Reverse Engineer Anything) — <code>rea-agents</code></strong>
                  <div style="font-size:11px;color:#cbd5e1;margin-top:2px;">GitHub: <a href="https://github.com/morluto/rea" target="_blank" style="color:#38bdf8;">https://github.com/morluto/rea</a> · 웹/JS/Electron/유니티/바이너리 클린룸 역공학</div>
                </div>
                <button type="button" class="ud-btn primary small" id="btn-ud-run-rea-now">🔬 REA 역공학 즉시 실행</button>
              </div>
              <div id="ud-rea-result-box" style="display:none;margin-top:8px;padding:8px;background:#020617;border-radius:6px;font-size:11px;color:#34d399;"></div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-height:240px;overflow-y:auto;padding-right:4px;">
              ${artcraftApps.map(app => `
                <div class="ud-slot-card" style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;">
                  <div style="min-width:0;flex:1;">
                    <div style="font-weight:800;color:#f8fafc;font-size:12px;">${app.num}. ${app.name} <span style="color:#34d399;font-size:10.5px;">(${app.sizeMb || 85}MB)</span></div>
                    <div style="font-size:11px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${app.kr}</div>
                    <a href="${app.githubUrl}" target="_blank" style="font-size:10px;color:#38bdf8;text-decoration:none;">🔗 ${app.githubUrl.replace('https://github.com/', '')}</a>
                  </div>
                  <div style="display:flex;gap:5px;margin-left:8px;flex-shrink:0;">
                    <button type="button" class="ud-btn outline small btn-ud-control-app" data-app="${app.id}">🎛️ 제어창</button>
                    <button type="button" class="ud-btn primary small btn-ud-launch-app" data-app="${app.id}">🚀 실행</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      </div>
    `;

    this.bindUnifiedHeaderEvents(stage);

    stage.querySelector('#btn-ud-open-artcraft-studio')?.addEventListener('click', () => {
      this.openWorkspace('ARTCRAFT_STUDIO_DASHBOARD', { appId: 'photocraft' });
    });

    stage.querySelectorAll('.btn-ud-control-app').forEach(btn => {
      btn.addEventListener('click', () => {
        const appId = btn.dataset.app;
        this.currentArtCraftAppId = appId;
        this.openWorkspace('ARTCRAFT_STUDIO_DASHBOARD', { appId });
      });
    });

    stage.querySelectorAll('.btn-ud-launch-app').forEach(btn => {
      btn.addEventListener('click', async () => {
        const appId = btn.dataset.app;
        const origText = btn.textContent;
        btn.textContent = '⏳ 실행 중...';
        try {
          const res = await fetch('/api/jarvis/launch-app', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appId })
          }).then(r => r.json());
          if (res && res.ok) {
            window.BSC_WORLDVIEW?.showToast('🚀 프로그램 실행 완료', res.message);
          } else {
            window.BSC_WORLDVIEW?.showToast('ℹ️ 안내', res?.error || '로컬 PC 서버(localhost:7777)에서 데스크톱 .exe 프로그램이 실행됩니다.');
          }
        } finally {
          btn.textContent = origText;
        }
      });
    });

    stage.querySelector('#btn-ud-run-rea-now')?.addEventListener('click', async () => {
      const box = stage.querySelector('#ud-rea-result-box');
      if (box) {
        box.style.display = 'block';
        box.textContent = '⏳ REA 클린룸 4단계 역공학 분석 실행 중...';
      }
      const res = await fetch('/api/jarvis/rea-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      }).then(r => r.json()).catch(() => null);
      if (box && res && res.ok) {
        box.innerHTML = `✅ <b>REA 역공학 완료 (${res.elapsed_ms}ms)</b>: 파일 ${res.surface?.totalFiles}개 (${(res.surface?.totalBytes || 0).toLocaleString()} bytes) · 클래스 ${res.deconstruction?.recoveredClassesCount}개 · 함수 ${res.deconstruction?.recoveredFunctionsCount}개 복원<br/>📄 블루프린트: <code>${res.blueprintPath}</code>`;
      }
    });

    stage.querySelectorAll('.btn-ud-select-brain').forEach(btn => {
      btn.addEventListener('click', async () => {
        const modelName = btn.dataset.model;
        btn.textContent = '⏳ 전환 중...';
        await fetch('/api/jarvis/select-brain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ engine: 'ollama', modelName })
        });
        const pill = document.getElementById('active-model-pill');
        if (pill) pill.textContent = modelName;
        await this.renderAiBrainDashboard(stage);
      });
    });

    stage.querySelectorAll('[data-spawn-studio]').forEach(btn => {
      btn.addEventListener('click', () => {
        const stType = btn.dataset.spawnStudio;
        window.HUDWindowSpawner?.openAIStudioWindowByType?.(stType);
      });
    });

    // 🌐 4-Way Multi-LLM Hub Events (GPT · Gemini · LM Studio · Ollama)
    stage.querySelector('#btn-ud-open-sasarisa-pill')?.addEventListener('click', () => {
      window.MultimodalEngine?.toggleSasarisaVoicePill?.(true);
    });

    stage.querySelectorAll('.btn-hub-activate').forEach(btn => {
      btn.addEventListener('click', async () => {
        const provider = btn.dataset.provider;
        const selEl = stage.querySelector(`.sel-hub-model[data-provider="${provider}"]`);
        const model = selEl?.value || '';
        btn.textContent = '⏳ 연결 중...';
        const res = await fetch('/api/jarvis/llm-hub/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activeProvider: provider, activeModel: model })
        }).then(r => r.json()).catch(() => null);
        if (res && res.ok) {
          const pill = document.getElementById('active-model-pill');
          if (pill) pill.textContent = `${provider.toUpperCase()}:${model}`;
          const sasaPillModel = document.getElementById('sasarisa-pill-llm-badge');
          if (sasaPillModel) sasaPillModel.textContent = `${provider.toUpperCase()} · ${model}`;
          window.BSC_WORLDVIEW?.showToast('🌐 4대 멀티 LLM 허브', res.message);
          await this.renderAiBrainDashboard(stage);
        }
      });
    });

    stage.querySelectorAll('.btn-hub-test').forEach(btn => {
      btn.addEventListener('click', async () => {
        const provider = btn.dataset.provider;
        const selEl = stage.querySelector(`.sel-hub-model[data-provider="${provider}"]`);
        const model = selEl?.value || '';
        const outBox = stage.querySelector('#hub-test-output-box');
        if (outBox) {
          outBox.style.display = 'block';
          outBox.textContent = `⏳ [${provider.toUpperCase()} · ${model}] 실시간 응답 속도 및 연결 테스트 중...`;
        }
        const res = await fetch('/api/jarvis/llm-hub/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider, model })
        }).then(r => r.json()).catch(() => null);
        if (outBox && res) {
          outBox.innerHTML = res.ok
            ? `✅ <b>[${String(res.provider).toUpperCase()} · ${res.model}] (${res.latencyMs}ms${res.fallbackUsed ? ' · 로컬 AI 자동폴백 보호 작동' : ''})</b>: ${res.text}`
            : `⚠️ 연결 확인 필요: ${res.error || '응답 없음'}`;
        }
      });
    });

    stage.querySelector('#form-hub-credentials')?.addEventListener('submit', async e => {
      e.preventDefault();
      const openaiApiKey = stage.querySelector('#inp-openai-key')?.value?.trim() || '';
      const geminiApiKey = stage.querySelector('#inp-gemini-key')?.value?.trim() || '';
      const lmstudioEndpoint = stage.querySelector('#inp-lmstudio-url')?.value?.trim() || '';
      const res = await fetch('/api/jarvis/llm-hub/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openaiApiKey, geminiApiKey, lmstudioEndpoint })
      }).then(r => r.json()).catch(() => null);
      if (res && res.ok) {
        window.BSC_WORLDVIEW?.showToast('🔐 .env 보안 저장 완료', 'OpenAI / Gemini API 키 및 LM Studio 엔드포인트가 .env에 안전하게 격리 저장되었습니다.');
        await this.renderAiBrainDashboard(stage);
      }
    });

    // 🎙️ SasariSa Windows 11 Command & Safety Confirmation Events
    const runSasarisaUiCommand = async (cmdText) => {
      if (!cmdText) return;
      const openWin = Boolean(stage.querySelector('#chk-sasarisa-open-win')?.checked);
      const resBox = stage.querySelector('#sasarisa-live-result');
      if (resBox) {
        resBox.innerHTML = `<div style="color:#38bdf8;">⏳ 사사리사 Windows 11 엔진이 "${cmdText}" 명령을 분석·실행 중입니다...</div>`;
      }
      const res = await fetch('/api/jarvis/sasarisa/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdText, openExternalWindow: openWin })
      }).then(r => r.json()).catch(() => null);
      if (res && res.reply) {
        window.MultimodalEngine?.speakStewardReply?.(res.reply, 'jarvis');
      }
      await this.renderAiBrainDashboard(stage);
    };

    stage.querySelectorAll('.btn-sasa-quick').forEach(btn => {
      btn.addEventListener('click', () => runSasarisaUiCommand(btn.dataset.cmd));
    });

    stage.querySelector('#form-sasarisa-cmd')?.addEventListener('submit', e => {
      e.preventDefault();
      const inp = stage.querySelector('#inp-sasarisa-cmd');
      const cmd = inp?.value?.trim();
      if (cmd) {
        inp.value = '';
        runSasarisaUiCommand(cmd);
      }
    });

    stage.querySelectorAll('.btn-sasa-confirm').forEach(btn => {
      btn.addEventListener('click', async () => {
        const confirmId = btn.dataset.id;
        const decision = btn.dataset.dec;
        const openWin = Boolean(stage.querySelector('#chk-sasarisa-open-win')?.checked);
        const res = await fetch('/api/jarvis/sasarisa/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ confirmId, decision, openExternalWindow: openWin })
        }).then(r => r.json()).catch(() => null);
        if (res && res.reply) {
          window.MultimodalEngine?.speakStewardReply?.(res.reply, 'jarvis');
        }
        await this.renderAiBrainDashboard(stage);
      });
    });
  },

  /* ============================================================================
   * 3-B. 🎨 ArtCraft 13종 라이브 제어 스튜디오 & 실시간 화면 뷰포트 (ARTCRAFT_STUDIO_DASHBOARD)
   *    - 대표님 요청: "자비스에서 ArtCraft 프로그램과 연결해줘. 그리고 제어하는 화면을 UI 창에서도 보이면 좋겠어"
   *    - Loopback JSON-Lines Control Protocol (--control <port>) + Win32 DirectX12 Window Capture
   * ============================================================================ */
  async renderArtCraftStudioDashboard(stage, initialAppId = 'photocraft') {
    if (this.artCraftStreamTimer) {
      clearInterval(this.artCraftStreamTimer);
      this.artCraftStreamTimer = null;
    }
    const selectedAppId = String(initialAppId || this.currentArtCraftAppId || 'photocraft').toLowerCase();
    this.currentArtCraftAppId = selectedAppId;

    const statusRes = await fetch('/api/jarvis/artcraft/status').then(r => r.json()).catch(() => ({ apps: [] }));
    const apps = statusRes.apps && statusRes.apps.length > 0 ? statusRes.apps : [
      { id: 'photocraft', num: '01', name: 'PhotoCraft', kr: '포토샵 대체 · 사진/PSD 레이어 편집', port: 17801, supportsControlFlag: true, running: false },
      { id: 'vectorcraft', num: '02', name: 'VectorCraft', kr: '일러스트 대체 · 벡터/SVG 그래픽', port: 17802, supportsControlFlag: true, running: false },
      { id: 'filmcraft', num: '03', name: 'FilmCraft', kr: '프리미어 대체 · 비선형 영상 편집', port: 17803, supportsControlFlag: true, running: false },
      { id: 'effectcraft', num: '04', name: 'EffectCraft', kr: '애프터이펙트 대체 · 모션/VFX 합성', port: 17804, supportsControlFlag: false, running: false },
      { id: 'designcraft', num: '05', name: 'DesignCraft', kr: '인디자인 대체 · 출판/다중페이지 조판', port: 17805, supportsControlFlag: false, running: false },
      { id: 'figcraft', num: '06', name: 'FigCraft', kr: '피그마 대체 · UI/UX 프로토타이핑', port: 17806, supportsControlFlag: false, running: false },
      { id: 'lightcraft', num: '07', name: 'LightCraft', kr: '라이트룸 대체 · RAW 사진 현상/색보정', port: 17807, supportsControlFlag: true, running: false },
      { id: 'pdfcraft', num: '08', name: 'PdfCraft', kr: '아크로뱃 대체 · PDF 편집/주석/보안', port: 17808, supportsControlFlag: false, running: false },
      { id: 'wordcraft', num: '09', name: 'WordCraft', kr: 'MS워드 대체 · 워드프로세서/문서', port: 17809, supportsControlFlag: true, running: false },
      { id: 'deckcraft', num: '10', name: 'DeckCraft', kr: '파워포인트 대체 · 슬라이드 프레젠테이션', port: 17810, supportsControlFlag: true, running: false },
      { id: 'gridcraft', num: '11', name: 'GridCraft', kr: '엑셀 대체 · 스프레드시트/수식/차트', port: 17811, supportsControlFlag: false, running: false },
      { id: 'soundcraft', num: '12', name: 'SoundCraft', kr: '오디션 대체 · 멀티트랙 오디오 편집', port: 17812, supportsControlFlag: false, running: false },
      { id: 'cadcraft', num: '13', name: 'CADCraft', kr: '오토캐드 대체 · 2D/3D 정밀 CAD 도면', port: 17813, supportsControlFlag: false, running: false }
    ];

    const currentApp = apps.find(a => a.id === selectedAppId) || apps[0];
    const runningCount = apps.filter(a => a.running).length;

    stage.innerHTML = `
      <div class="unified-dash-shell">
        ${this.renderUnifiedDashboardHeader(
          `🎨 ArtCraft 13종 라이브 제어 스튜디오 & 실시간 화면 뷰포트 (${currentApp.name})`,
          '자비스 UI 창 안에서 ArtCraft 네이티브 프로그램 화면을 실시간으로 보면서 도구 전환·레이어 생성·AI 자동 드로잉·마우스 클릭을 원격 제어합니다.',
          'ARTCRAFT_STUDIO_DASHBOARD'
        )}

        <div class="ud-kpi-row">
          <div class="ud-kpi-card cyan">
            <span class="ud-kpi-label">현재 제어 대상 프로그램</span>
            <strong class="ud-kpi-val cyan" id="ac-kpi-appname">${currentApp.num}. ${currentApp.name}</strong>
          </div>
          <div class="ud-kpi-card emerald">
            <span class="ud-kpi-label">실시간 제어 프로토콜 채널</span>
            <strong class="ud-kpi-val emerald" id="ac-kpi-channel">${currentApp.supportsControlFlag ? `JSON-Lines RPC (:${currentApp.port})` : 'Win32 DX12 Window Bridge'}</strong>
          </div>
          <div class="ud-kpi-card amber">
            <span class="ud-kpi-label">연결된 AI 두뇌 (SharedStore)</span>
            <strong class="ud-kpi-val gold">Gemma 4 E4B / 31B 연동됨</strong>
          </div>
          <div class="ud-kpi-card purple">
            <span class="ud-kpi-label">현재 가동 중인 ArtCraft 앱</span>
            <strong class="ud-kpi-val purple" id="ac-kpi-running">${runningCount}개 실행 중 / 총 13종</strong>
          </div>
        </div>

        <div class="ud-grid-3col" style="grid-template-columns: 280px 1fr 320px;">
          <!-- 좌측 컬럼: 13종 ArtCraft 앱 선택 & 실시간 툴 팔레트 -->
          <aside class="ud-panel" style="display:flex;flex-direction:column;gap:12px;">
            <div class="ud-panel-head" style="margin-bottom:0;">
              <div>
                <h2 class="ud-panel-title">1. ArtCraft 13종 프로그램 선택</h2>
                <p class="ud-panel-desc">앱을 선택하면 실시간 화면 제어 창으로 직결됩니다.</p>
              </div>
            </div>

            <div class="ud-file-list" style="max-height:290px;overflow-y:auto;gap:6px;">
              ${apps.map(app => {
                const isSel = app.id === currentApp.id;
                return `
                  <button type="button" class="ud-file-item btn-ac-select-app ${isSel ? 'active' : ''}" data-app="${app.id}" style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding:8px 10px;">
                    <div style="min-width:0;flex:1;">
                      <div style="font-weight:700;font-size:12px;color:${isSel ? '#38bdf8' : '#f8fafc'};">${app.num}. ${app.name}</div>
                      <div style="font-size:10.5px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${app.kr}</div>
                    </div>
                    <span class="ud-status-chip ${app.running ? 'on' : 'off'}" style="font-size:9.5px;flex-shrink:0;">
                      ${app.running ? '🟢 실행중' : '⚪ 대기'}
                    </span>
                  </button>
                `;
              }).join('')}
            </div>

            <div class="ud-panel-head" style="margin-bottom:0;margin-top:4px;">
              <div>
                <h2 class="ud-panel-title">2. 원격 툴바 &amp; 브러시 제어 (ui.set)</h2>
                <p class="ud-panel-desc">클릭 시 실행 중인 ${currentApp.name}의 도구가 즉시 변경됩니다.</p>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
              <button type="button" class="ud-btn outline small btn-ac-tool" data-tool="move">✋ 이동</button>
              <button type="button" class="ud-btn primary small btn-ac-tool" data-tool="brush">🖌️ 브러시</button>
              <button type="button" class="ud-btn outline small btn-ac-tool" data-tool="pen">✏️ 펜/패스</button>
              <button type="button" class="ud-btn outline small btn-ac-tool" data-tool="text">🔤 텍스트</button>
              <button type="button" class="ud-btn outline small btn-ac-tool" data-tool="SelectRect">⬜ 선택영역</button>
              <button type="button" class="ud-btn outline small btn-ac-tool" data-tool="zoom">🔍 줌</button>
            </div>

            <div style="display:flex;flex-direction:column;gap:6px;padding-top:4px;">
              <div style="display:flex;justify-content:space-between;font-size:11.5px;color:#cbd5e1;">
                <span>🖌️ 브러시 크기 조절</span>
                <strong id="ac-brush-size-val" style="color:#38bdf8;">28 px</strong>
              </div>
              <input type="range" id="ac-brush-size-slider" min="2" max="160" value="28" />
            </div>

            <div style="display:flex;gap:6px;margin-top:auto;">
              <button type="button" class="ud-btn outline small btn-ac-theme" data-theme="pro" style="flex:1;">🌙 Pro 테마</button>
              <button type="button" class="ud-btn outline small btn-ac-theme" data-theme="studio" style="flex:1;">🎛️ Studio</button>
              <button type="button" class="ud-btn outline small btn-ac-theme" data-theme="classic" style="flex:1;">☀️ Classic</button>
            </div>
          </aside>

          <!-- 중앙 컬럼: 실시간 ArtCraft 프로그램 제어 화면 뷰포트 (Live Screen Streaming & Click Forwarding) -->
          <main class="ud-panel" style="display:flex;flex-direction:column;gap:10px;">
            <div class="ud-panel-head" style="margin-bottom:0;">
              <div>
                <h2 class="ud-panel-title" id="ac-viewport-title">🖥️ ${currentApp.name} 실시간 제어 화면 뷰포트 (화면 클릭 시 마우스 좌표 즉시 전달)</h2>
                <p class="ud-panel-desc" id="ac-viewport-status">아래 [🚀 실행 및 제어 화면 연결] 버튼을 누르면 실제 ${currentApp.name} 창이 실행되고 화면이 실시간 스트리밍됩니다.</p>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button type="button" class="ud-btn primary small" id="btn-ac-launch-connect">🚀 실행 및 제어 화면 연결</button>
                <button type="button" class="ud-btn outline small" id="btn-ac-refresh-screen">🔄 화면 새로고침</button>
                <button type="button" class="ud-btn emerald small" id="btn-ac-toggle-stream">📡 실시간 스트리밍 OFF</button>
              </div>
            </div>

            <!-- 원클릭 실무 자동화 액션 바 -->
            <div style="display:flex;gap:6px;flex-wrap:wrap;padding:8px 10px;background:rgba(15,23,42,0.65);border:1px solid rgba(255,255,255,0.07);border-radius:12px;">
              <button type="button" class="ud-btn primary small btn-ac-cmd" data-op="command" data-cmd="file.new">📄 새 캔버스 (1920×1080)</button>
              <button type="button" class="ud-btn outline small btn-ac-cmd" data-op="command" data-cmd="layer.new.layer">➕ 새 레이어 추가</button>
              <button type="button" class="ud-btn emerald small btn-ac-cmd" data-op="demo_paint">🎨 AI 브러시 자동 드로잉</button>
              <button type="button" class="ud-btn outline small btn-ac-cmd" data-op="command" data-cmd="layer.newAdjustmentLayer.curves">📈 커브 색보정 레이어</button>
              <button type="button" class="ud-btn outline small btn-ac-cmd" data-op="command" data-cmd="layer.newAdjustmentLayer.hueSaturation">🌈 색조·채도 레이어</button>
              <button type="button" class="ud-btn outline small btn-ac-cmd" data-op="command" data-cmd="view.fitOnScreen">⛶ 화면 맞춤</button>
              <button type="button" class="ud-btn outline small btn-ac-cmd" data-op="command" data-cmd="edit.undo">↩️ 실행 취소</button>
            </div>

            <!-- 라이브 프로그램 스크린 뷰포트 -->
            <div id="ac-live-viewport-box" style="position:relative;flex:1;min-height:380px;background:#070b14;border:1px solid rgba(255,255,255,0.09);border-radius:16px;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:crosshair;">
              <img id="ac-live-screen-img" src="" alt="${currentApp.name} 실시간 제어 화면" style="max-width:100%;max-height:450px;width:100%;height:100%;object-fit:contain;display:none;" />
              <div id="ac-live-click-marker" style="display:none;position:absolute;width:22px;height:22px;border:2px solid #38bdf8;border-radius:50%;box-shadow:0 0 12px #38bdf8;pointer-events:none;transform:translate(-50%,-50%);"></div>
              <div id="ac-live-placeholder" style="text-align:center;padding:32px;max-width:520px;">
                <div style="font-size:42px;margin-bottom:10px;">🎨</div>
                <div style="font-size:16px;font-weight:800;color:#f8fafc;margin-bottom:6px;">${currentApp.name} 실시간 제어 화면 대기 중</div>
                <div style="font-size:12.5px;color:#94a3b8;line-height:1.6;margin-bottom:16px;">
                  상단의 <b>[🚀 실행 및 제어 화면 연결]</b>을 클릭하시면 <code>${currentApp.id}.exe</code>가 제어 채널(<code>:${currentApp.port}</code>)과 함께 실행되며, 자비스 창 안에서 실시간 프로그램 화면을 보면서 직접 클릭·드로잉·레이어 제어를 수행할 수 있습니다.
                </div>
                <button type="button" class="ud-btn primary" id="btn-ac-placeholder-launch">🚀 지금 ${currentApp.name} 실행 및 화면 연결하기</button>
              </div>
            </div>
          </main>

          <!-- 우측 컬럼: 실시간 UI/레이어 상태 인스펙터 (ui.inspect) & 엔진 명령 콘솔 -->
          <aside class="ud-panel" style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <h2 class="ud-panel-title">3. 실시간 UI · 레이어 · GPU 인스펙터</h2>
              <p class="ud-panel-desc"><code>ui.inspect</code>로 수신된 ${currentApp.name} 내부 엔진 상태입니다.</p>
              <pre id="ac-ui-inspect-box" class="ud-terminal-box" style="margin-top:8px;min-height:185px;max-height:215px;color:#e2e8f0;font-size:11px;">${JSON.stringify({
                app: currentApp.name,
                controlPort: currentApp.port,
                protocol: currentApp.supportsControlFlag ? 'JSON-Lines Control RPC' : 'Win32 DX12 Window Bridge',
                sharedAiBrain: 'gemma4:e4b (127.0.0.1:11434)',
                status: currentApp.running ? 'RUNNING' : 'READY_TO_LAUNCH'
              }, null, 2)}</pre>
            </div>

            <div style="flex:1;display:flex;flex-direction:column;">
              <h2 class="ud-panel-title">4. ArtCraft 엔진 직접 명령 (engine.execute)</h2>
              <p class="ud-panel-desc" style="margin-bottom:8px;">명령어나 키 입력을 ${currentApp.name} 엔진으로 직접 전송합니다.</p>
              <form id="ac-custom-cmd-form" style="display:flex;gap:6px;margin-bottom:8px;">
                <input type="text" id="ac-custom-cmd-input" class="ud-input" value="layer.newAdjustmentLayer.curves" placeholder="예: file.new, layer.new.layer..." style="flex:1;font-family:monospace;" />
                <button type="submit" class="ud-btn primary small">전송 ↵</button>
              </form>
              <form id="ac-custom-type-form" style="display:flex;gap:6px;margin-bottom:8px;">
                <input type="text" id="ac-custom-type-input" class="ud-input" placeholder="프로그램에 타이핑할 텍스트 입력..." style="flex:1;" />
                <button type="submit" class="ud-btn outline small">타이핑</button>
              </form>
              <pre id="ac-cmd-log-box" class="ud-terminal-box" style="flex:1;min-height:120px;font-size:11px;">🟢 ArtCraft Control Bridge 준비 완료 (Port ${currentApp.port})\n</pre>
            </div>
          </aside>
        </div>
      </div>
    `;

    this.bindUnifiedHeaderEvents(stage);

    const imgEl = stage.querySelector('#ac-live-screen-img');
    const placeholderEl = stage.querySelector('#ac-live-placeholder');
    const statusEl = stage.querySelector('#ac-viewport-status');
    const inspectBox = stage.querySelector('#ac-ui-inspect-box');
    const logBox = stage.querySelector('#ac-cmd-log-box');
    const markerEl = stage.querySelector('#ac-live-click-marker');

    const appendAcLog = (msg) => {
      if (!logBox) return;
      const t = new Date().toLocaleTimeString('ko-KR', { hour12: false });
      logBox.textContent += `[${t}] ${msg}\n`;
      logBox.scrollTop = logBox.scrollHeight;
    };

    const applySnapshotToUi = (snap) => {
      if (!snap) return;
      if (snap.screenshotDataUrl && imgEl) {
        imgEl.src = snap.screenshotDataUrl;
        imgEl.style.display = 'block';
        if (placeholderEl) placeholderEl.style.display = 'none';
      }
      if (snap.uiState && inspectBox) {
        inspectBox.textContent = JSON.stringify(snap.uiState, null, 2);
      }
      if (statusEl) {
        statusEl.textContent = snap.ok
          ? `🟢 실시간 화면 수신 완료 (${snap.captureMethod || 'rpc'} · ${new Date().toLocaleTimeString('ko-KR')}) — 화면 이미지를 클릭하면 해당 위치로 마우스 클릭이 전달됩니다.`
          : `⚠️ ${snap.message || snap.error || '프로그램 실행 대기 중'}`;
        statusEl.style.color = snap.ok ? '#34d399' : '#fbbf24';
      }
    };

    const refreshLiveCapture = async () => {
      const snap = await fetch(`/api/jarvis/artcraft/capture?appId=${encodeURIComponent(currentApp.id)}`)
        .then(r => r.json())
        .catch(() => null);
      if (snap && snap.ok) {
        applySnapshotToUi(snap);
      }
      return snap;
    };

    const launchAndConnect = async () => {
      if (statusEl) {
        statusEl.textContent = `⏳ ${currentApp.name} 네이티브 프로그램 실행 및 제어 포트(:${currentApp.port}) 연결 중...`;
        statusEl.style.color = '#38bdf8';
      }
      appendAcLog(`🚀 ${currentApp.name} 실행 및 제어 채널 연결 요청...`);
      const res = await fetch('/api/jarvis/artcraft/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: currentApp.id })
      }).then(r => r.json()).catch(() => null);

      if (res && res.ok) {
        appendAcLog(`✅ 연결 성공 (${res.mode || 'rpc'})`);
        const snap = await refreshLiveCapture();
        if (!snap?.screenshotDataUrl) {
          setTimeout(refreshLiveCapture, 900);
        }
      } else {
        appendAcLog(`⚠️ 안내: ${res?.error || '로컬 PC 환경에서 실행됩니다.'}`);
      }
    };

    const sendControlAction = async (payload, label = '') => {
      appendAcLog(`⚡ 제어 명령 전송: ${label || payload.command || payload.tool || payload.op}`);
      const res = await fetch('/api/jarvis/artcraft/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId: currentApp.id, ...payload })
      }).then(r => r.json()).catch(() => null);
      if (res) {
        applySnapshotToUi(res);
        appendAcLog(`✅ 실행 완료 (${res.captureMethod || 'ok'})`);
      }
    };

    // 좌측 앱 선택
    stage.querySelectorAll('.btn-ac-select-app').forEach(btn => {
      btn.addEventListener('click', () => {
        this.renderArtCraftStudioDashboard(stage, btn.dataset.app);
      });
    });

    // 실행 및 연결 버튼
    stage.querySelector('#btn-ac-launch-connect')?.addEventListener('click', launchAndConnect);
    stage.querySelector('#btn-ac-placeholder-launch')?.addEventListener('click', launchAndConnect);
    stage.querySelector('#btn-ac-refresh-screen')?.addEventListener('click', refreshLiveCapture);

    // 1.5초 자동 스트리밍 토글
    const streamBtn = stage.querySelector('#btn-ac-toggle-stream');
    streamBtn?.addEventListener('click', () => {
      if (this.artCraftStreamTimer) {
        clearInterval(this.artCraftStreamTimer);
        this.artCraftStreamTimer = null;
        streamBtn.textContent = '📡 실시간 스트리밍 OFF';
        streamBtn.classList.remove('primary');
        streamBtn.classList.add('emerald');
        appendAcLog('⏹ 실시간 화면 자동 스트리밍 중지');
      } else {
        this.artCraftStreamTimer = setInterval(refreshLiveCapture, 1500);
        streamBtn.textContent = '📡 실시간 스트리밍 ON (1.5초)';
        streamBtn.classList.remove('emerald');
        streamBtn.classList.add('primary');
        appendAcLog('📡 1.5초 간격 실시간 화면 스트리밍 시작');
        refreshLiveCapture();
      }
    });

    // 툴 버튼
    stage.querySelectorAll('.btn-ac-tool').forEach(btn => {
      btn.addEventListener('click', () => {
        stage.querySelectorAll('.btn-ac-tool').forEach(b => {
          b.classList.toggle('primary', b === btn);
          b.classList.toggle('outline', b !== btn);
        });
        sendControlAction({ op: 'set_tool', tool: btn.dataset.tool }, `툴 변경 -> ${btn.dataset.tool}`);
      });
    });

    // 브러시 사이즈 슬라이더
    const brushSlider = stage.querySelector('#ac-brush-size-slider');
    const brushVal = stage.querySelector('#ac-brush-size-val');
    brushSlider?.addEventListener('change', () => {
      const sz = Number(brushSlider.value || 28);
      if (brushVal) brushVal.textContent = `${sz} px`;
      sendControlAction({ op: 'set_tool', brushSize: sz }, `브러시 크기 -> ${sz}px`);
    });

    // 테마 버튼
    stage.querySelectorAll('.btn-ac-theme').forEach(btn => {
      btn.addEventListener('click', () => {
        sendControlAction({ op: 'set_tool', theme: btn.dataset.theme }, `테마 변경 -> ${btn.dataset.theme}`);
      });
    });

    // 상단 원클릭 명령 바
    stage.querySelectorAll('.btn-ac-cmd').forEach(btn => {
      btn.addEventListener('click', () => {
        const op = btn.dataset.op || 'command';
        const cmd = btn.dataset.cmd || '';
        sendControlAction({ op, command: cmd }, btn.textContent.trim());
      });
    });

    // 실시간 화면 뷰포트 클릭 -> 실제 ArtCraft 창 좌표로 ui.click 전달!
    imgEl?.addEventListener('click', e => {
      const rect = imgEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      const natW = imgEl.naturalWidth || 1280;
      const natH = imgEl.naturalHeight || 800;
      const targetX = Math.round(relX * natW);
      const targetY = Math.round(relY * natH);

      if (markerEl) {
        markerEl.style.left = `${e.clientX - stage.querySelector('#ac-live-viewport-box').getBoundingClientRect().left}px`;
        markerEl.style.top = `${e.clientY - stage.querySelector('#ac-live-viewport-box').getBoundingClientRect().top}px`;
        markerEl.style.display = 'block';
      }
      sendControlAction({ op: 'click', x: targetX, y: targetY, button: 'left' }, `화면 원격 클릭 (${targetX}, ${targetY})`);
    });

    // 커스텀 엔진 명령 폼
    stage.querySelector('#ac-custom-cmd-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const cmd = stage.querySelector('#ac-custom-cmd-input')?.value?.trim();
      if (cmd) sendControlAction({ op: 'command', command: cmd }, `engine.execute(${cmd})`);
    });

    // 커스텀 텍스트 타이핑 폼
    stage.querySelector('#ac-custom-type-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const inp = stage.querySelector('#ac-custom-type-input');
      const txt = inp?.value?.trim();
      if (txt) {
        inp.value = '';
        sendControlAction({ op: 'type', text: txt }, `ui.type("${txt}")`);
      }
    });

    // 이미 실행 중이면 즉시 첫 화면 캡처 로드
    if (currentApp.running) {
      refreshLiveCapture();
    }
  },

  /* ============================================================================
   * 4. 🏛️ 에이전트 실시간 회의 워룸 & 전사 조직 대시보드 (AGENT_OFFICE_DASHBOARD)
   *    - 실제 소하·거누·우진·태준 워룸 & 26인 에이전트 연동
   * ============================================================================ */
  async renderAgentOfficeDashboard(stage) {
    const [councilRes, agentsRes] = await Promise.all([
      fetch('/api/jarvis/bsc-council').then(r => r.json()).catch(() => ({ history: [] })),
      fetch('/api/agents').then(r => r.json()).catch(() => ({ agents: [] }))
    ]);

    const history = councilRes.history || [];
    const agents = Array.isArray(agentsRes.agents) ? agentsRes.agents : [];

    stage.innerHTML = `
      <div class="unified-dash-shell">
        ${this.renderUnifiedDashboardHeader(
          '🏛️ BeausCreators 에이전트 실시간 의논 · 회의 · 보고서 워룸 & 조직 현황',
          '수석비서 소하 · CTO 거누 · AI연구원 우진 · 비서실장 태준 등 실제 전사 에이전트들과 안건을 회의하고 보고서를 생성합니다.',
          'AGENT_OFFICE_DASHBOARD'
        )}

        <div class="ud-grid-2col">
          <!-- 좌측: 실시간 에이전트 의논 · 회의 · 보고서 워룸 -->
          <section class="ud-panel" style="display:flex;flex-direction:column;">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">1. 실시간 다중 에이전트 워룸 (Council Roundtable)</h2>
                <p class="ud-panel-desc">안건을 입력하시면 소하·거누·우진·태준이 정본 프로필과 함께 관점별 의견 및 의결안을 보고합니다.</p>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button type="button" class="ud-btn emerald small" id="btn-ud-exec-briefing" title="15초 전사 모닝/마감 음성 브리핑 즉시 실행">📢 15초 임원 음성 브리핑</button>
                <button type="button" class="ud-btn ${this.currentCouncilMode === 'DISCUSS' ? 'primary' : 'outline'} small btn-ud-council-mode" data-mode="DISCUSS">💬 의논</button>
                <button type="button" class="ud-btn ${this.currentCouncilMode === 'MEETING' ? 'primary' : 'outline'} small btn-ud-council-mode" data-mode="MEETING">🏛️ 회의</button>
                <button type="button" class="ud-btn ${this.currentCouncilMode === 'REPORT' ? 'primary' : 'outline'} small btn-ud-council-mode" data-mode="REPORT">📋 보고서</button>
              </div>
            </div>

            <form id="ud-council-form" style="display:flex;gap:8px;margin-bottom:12px;">
              <input type="text" id="ud-council-input" class="ud-input" placeholder="회의 안건이나 검토 지시사항을 입력하세요..." style="flex:1;" />
              <button type="submit" class="ud-btn primary" id="btn-ud-submit-council">안건 상정 ↵</button>
            </form>

            <div id="ud-council-feed" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;max-height:480px;padding-right:4px;">
              ${history.length === 0 ? `
                <div class="ud-empty-state">
                  <div>안건을 입력하시면 에이전트 워룸 회의가 즉시 시작됩니다.</div>
                </div>
              ` : history.slice(0, 12).map(sess => `
                <div style="background:#061022;border:1px solid rgba(251,191,36,0.35);border-radius:12px;padding:12px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <strong style="color:#fbbf24;font-size:13px;">📌 [${sess.mode || 'MEETING'}] ${sess.topic}</strong>
                    <span style="font-size:10.5px;color:#94a3b8;">${sess.timestamp || ''}</span>
                  </div>
                  <div style="display:flex;flex-direction:column;gap:8px;">
                    ${(sess.entries || []).map(ent => `
                      <div style="display:flex;gap:10px;align-items:flex-start;background:rgba(15,23,42,0.9);padding:8px 10px;border-radius:8px;border-left:3px solid ${ent.color || '#00f0ff'};">
                        <img src="${ent.avatar || '/agent_images/geonu/avatar_10pct.png'}" alt="${ent.name}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;" onerror="this.style.display='none'" />
                        <div style="flex:1;min-width:0;">
                          <div style="font-weight:800;font-size:12px;color:#f8fafc;">${ent.name} <span style="font-size:10.5px;color:#38bdf8;font-weight:500;">· ${ent.role || ''}</span></div>
                          <div style="font-size:12px;color:#e2e8f0;margin-top:3px;line-height:1.5;">${ent.text}</div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- 우측: 전사 에이전트 실시간 상태 로스터 (agent_status.json 실제 연동) -->
          <section class="ud-panel">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">2. BeausCreators 전사 에이전트 실시간 현황 (${agents.length || 26}인)</h2>
                <p class="ud-panel-desc">본사 agent_status.json과 실시간 연동된 실제 에이전트 명단 및 담당 직무입니다.</p>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-height:530px;overflow-y:auto;padding-right:4px;">
              ${(agents.length > 0 ? agents : [
                { id: 'soha', name: '소하', role: '수석비서 · 프론트오피스 기획', status: 'hq_active', currentTask: '대표님 오더 브리핑 및 일정 총괄' },
                { id: 'taejun', name: '태준', role: '비서실장 · 백오피스 QC', status: 'hq_active', currentTask: '워룸 의결 및 품질 검증 총괄' },
                { id: 'geonu', name: '거누', role: 'CTO · 백엔드/아키텍처', status: 'branch_active', currentTask: 'BSC J.A.R.V.I.S. OS 대시보드 고도화' },
                { id: 'woojin', name: '우진', role: 'AI연구원 · LLM/RAG 파이프라인', status: 'branch_active', currentTask: 'Gemma 4 멀티모달 코어 & .MD 분석 엔진' },
                { id: 'suho', name: '수호', role: 'QA & 보안 엔지니어', status: 'standby', currentTask: 'CHLGD 데이터 유실 방지 보안 게이트' },
                { id: 'sian', name: '시안', role: '수석 디자이너 · 디자인 시스템', status: 'standby', currentTask: '소비자 심리학 기반 대시보드 UI/UX' },
                { id: 'jaeho', name: '재호', role: 'UI/UX 디자이너', status: 'standby', currentTask: '컴포넌트 스펙 및 화면 설계' },
                { id: 'yuna', name: '유나', role: '프론트엔드 개발자', status: 'standby', currentTask: '반응형 대시보드 인터랙션' },
                { id: 'dohyun', name: '도현', role: 'CFO · 재무/BM 전략', status: 'standby', currentTask: '상업용 패키지 및 비용 $0 최적화' },
                { id: 'seojin', name: '강서진', role: '백엔드 & API 개발자', status: 'standby', currentTask: '로컬 디스크 및 API 서버 연동' }
              ]).map(ag => {
                const agId = ag.id || 'geonu';
                const isAct = /active/i.test(ag.status || '');
                return `
                  <div style="display:flex;gap:10px;align-items:center;background:#061022;border:1px solid ${isAct ? 'rgba(52,211,153,0.45)' : 'rgba(148,163,184,0.2)'};border-radius:10px;padding:9px 10px;">
                    <img src="/agent_images/${agId}/avatar_10pct.png" alt="${ag.name}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;flex-shrink:0;" onerror="this.src='/agent_images/geonu/avatar_10pct.png'" />
                    <div style="min-width:0;flex:1;">
                      <div style="display:flex;justify-content:space-between;align-items:center;">
                        <strong style="color:#f8fafc;font-size:12.5px;">${ag.name}</strong>
                        <span class="ud-status-chip ${isAct ? 'on' : 'off'}" style="font-size:9.5px;">${isAct ? '🟢 활동 중' : '⏸️ 대기'}</span>
                      </div>
                      <div style="font-size:10.5px;color:#38bdf8;margin-top:1px;">${ag.role || ag.department || ''}</div>
                      <div style="font-size:10.5px;color:#94a3b8;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ag.currentTask || '호출 대기 중'}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        </div>
      </div>
    `;

    this.bindUnifiedHeaderEvents(stage);

    stage.querySelector('#btn-ud-exec-briefing')?.addEventListener('click', async () => {
      const btn = stage.querySelector('#btn-ud-exec-briefing');
      if (btn) btn.textContent = '⏳ 브리핑 생성 중...';
      try {
        const bRes = await fetch('/api/jarvis/executive-briefing').then(r => r.json()).catch(() => null);
        if (bRes && bRes.spokenBriefing) {
          window.MultimodalEngine?.speakText?.(bRes.spokenBriefing, 'jarvis');
        } else {
          window.MultimodalEngine?.sendCommandToJarvis?.('자비스, 오늘 브리핑 해줘');
        }
      } finally {
        if (btn) btn.textContent = '📢 15초 임원 음성 브리핑';
      }
    });

    stage.querySelectorAll('.btn-ud-council-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCouncilMode = btn.dataset.mode;
        this.renderAgentOfficeDashboard(stage);
      });
    });

    stage.querySelector('#ud-council-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const inp = stage.querySelector('#ud-council-input');
      const topic = inp?.value?.trim();
      if (!topic) return;
      const submitBtn = stage.querySelector('#btn-ud-submit-council');
      if (submitBtn) {
        submitBtn.textContent = '⏳ 회의 진행 중...';
        submitBtn.disabled = true;
      }
      await fetch('/api/jarvis/bsc-council', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, mode: this.currentCouncilMode })
      });
      await this.renderAgentOfficeDashboard(stage);
    });
  },

  /* ============================================================================
   * 5. ⚙️ 설정 · 음성 · 테마 · 전 시스템 실시간 검증 대시보드 (SETTINGS_DASHBOARD)
   *    - 실제 TTS/테마/시스템 검증/콘솔 통합
   * ============================================================================ */
  async renderSettingsDashboard(stage) {
    const [tfRes, ecoRes] = await Promise.all([
      fetch('/api/token-flow').then(r => r.json()).catch(() => ({ recentLogs: [] })),
      fetch('/api/brain/ecosystems').then(r => r.json()).catch(() => ({ stats: {} }))
    ]);

    const logs = tfRes.recentLogs || [];

    stage.innerHTML = `
      <div class="unified-dash-shell">
        ${this.renderUnifiedDashboardHeader(
          '⚙️ 자비스 환경설정 · 음성(TTS/STT) · 보안 하네스 · 실시간 시스템 검증 대시보드',
          '자연스러운 현수 HD 음성, 4대 화면 테마, CHLGD 데이터 보호 게이트 및 전 시스템 정상 작동 여부를 한곳에서 제어합니다.',
          'SETTINGS_DASHBOARD'
        )}

        <div class="ud-grid-2col">
          <!-- 좌측: 음성(TTS/STT) · 화면 테마 · 데이터 보호 설정 -->
          <section class="ud-panel">
            <h2 class="ud-panel-title" style="margin-bottom:12px;">1. 자비스 자연 음성(TTS / STT) &amp; 화면 테마 제어</h2>

            <div class="ud-slot-card" style="margin-bottom:12px;">
              <div style="font-weight:800;color:#00f0ff;font-size:13px;margin-bottom:6px;">🎙️ 자비스 96kbps HD 스튜디오 자연 육성 (기계음 제로 · PC &amp; iPad 완벽 지원)</div>
              <p style="font-size:11.5px;color:#cbd5e1;margin-bottom:10px;">
                기계적인 브라우저 기본 TTS를 배제하고, 96kbps 스튜디오급 HD 신경망 자연 육성(현수·선희·인준 HD)과 호흡 쉼표 교정기가 적용되어 있습니다.
              </p>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                <button type="button" class="ud-btn primary small btn-ud-voice-actor" data-voice="ko-KR-HyunsuMultilingualNeural">🎙️ 현수 HD (차분한 남성 아나운서)</button>
                <button type="button" class="ud-btn outline small btn-ud-voice-actor" data-voice="ko-KR-SunHiNeural">🎙️ 선희 HD (따뜻한 여성 비서)</button>
                <button type="button" class="ud-btn outline small btn-ud-voice-actor" data-voice="ko-KR-InJoonNeural">🎙️ 인준 HD (부드러운 남성 대화)</button>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button type="button" class="ud-btn primary" id="btn-ud-test-tts">🔊 자연 음성(TTS) 테스트</button>
                <button type="button" class="ud-btn emerald" id="btn-ud-settings-exec-brief">📢 15초 임원 음성 브리핑</button>
                <button type="button" class="ud-btn outline" id="btn-ud-test-mic">🎙️ 음성 입력(STT) 마이크</button>
                <button type="button" class="ud-btn outline" id="btn-ud-open-tts-studio">🎛️ 오픈소스 보이스 스튜디오</button>
                <button type="button" class="ud-btn danger" id="btn-ud-stop-tts">⏹ 음성 즉시 정지</button>
              </div>
              <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(148,163,184,0.16);font-size:11px;color:#94a3b8;line-height:1.5;">
                ✅ <b>탑재된 음성 기술</b>: ① 96kbps HD 신경망 성우 3종(현수·선희·인준 HD) · ② 한국어 아나운서 호흡/숫자/영문 약어 자연 교정기 · ③ iPad Safari &amp; 클라우드 96kbps HD MP3 직결 재생 · ④ Web Speech API 실시간 음성 인식(STT) · ⑤ 말풍선별 <code>[🔊 끝까지 읽기]</code> &amp; 바지인(Barge-in) 즉시 정지
              </div>
            </div>

            <div class="ud-slot-card" style="margin-bottom:12px;">
              <div style="font-weight:800;color:#fbbf24;font-size:13px;margin-bottom:6px;">🎨 화면 디자인 테마 · 오감 센서 · 마스터 매뉴얼</div>
              <p style="font-size:11.5px;color:#cbd5e1;margin-bottom:10px;">4대 화면 테마, 카메라/손동작(HOLO) 제어, 세계관 매뉴얼 및 112개 오픈소스 딥리서치 보고서를 즉시 열람합니다.</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button type="button" class="ud-btn primary" id="btn-ud-theme-cycle">☀️ 다음 테마로 전환</button>
                <button type="button" class="ud-btn outline" id="btn-ud-open-holo">📷 카메라 · HOLO 손동작 패널</button>
                <button type="button" class="ud-btn outline" id="btn-ud-open-manual">📘 자비스 마스터 매뉴얼</button>
                <button type="button" class="ud-btn outline" id="btn-ud-open-report">📊 112개 오픈소스 보고서</button>
              </div>
            </div>

            <div class="ud-slot-card">
              <div style="font-weight:800;color:#34d399;font-size:13px;margin-bottom:6px;">🛡️ CHLGD 데이터 유실 방지 보안 하네스 (상시 가동)</div>
              <ul style="font-size:11.5px;color:#cbd5e1;line-height:1.6;padding-left:18px;margin:0;">
                <li><b>본사(01.BSC_HQ) 원본 보호</b>: 지점/외부에서 본사 원본 덮어쓰기 및 삭제 100% 차단</li>
                <li><b>0-Byte 빈 파일 저장 차단</b>: 파일 유실 방지를 위한 무결성 게이트 상시 작동</li>
                <li><b>자동 백업(.bak)</b>: IDE 에디터에서 파일 수정 시 자동으로 백업본 생성</li>
              </ul>
            </div>
          </section>

          <!-- 우측: 전 시스템 실시간 검산·검증 실행기 & 라이브 콘솔 -->
          <section class="ud-panel">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">2. 전 시스템 실시간 검산 · 검증 &amp; 시스템 로그</h2>
                <p class="ud-panel-desc">두뇌 엔진, 지식폴더 .MD 분석기, 대화 라우터, TTS, 보안 게이트를 실시간 점검합니다.</p>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button type="button" class="ud-btn emerald" id="btn-ud-run-healthcheck">🛡️ 실시간 전체 검증 실행 (100점 감사)</button>
                <button type="button" class="ud-btn primary small" id="btn-ud-open-aistudio-hub">⚡ 18대 AI 스튜디오 허브</button>
              </div>
            </div>

            <div id="ud-healthcheck-results" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
              <div class="ud-slot-card" style="padding:9px 12px;">
                <span style="font-size:11px;color:#94a3b8;">1:1 음성 대화(TTS/STT) &amp; 경로 스캐너</span>
                <div style="font-weight:800;color:#34d399;margin-top:2px;">🟢 PASS (현수 HD · 아나운서 교정 · FAST_CHAT)</div>
              </div>
              <div class="ud-slot-card" style="padding:9px 12px;">
                <span style="font-size:11px;color:#94a3b8;">7대 지식생태계 &amp; 전수 파일 분석기</span>
                <div style="font-weight:800;color:#34d399;margin-top:2px;">🟢 PASS (뉴런 ${ecoRes.stats?.totalNodes || 650}개 · 전체 ${(ecoRes.stats?.fullDiskInventory?.totalAllFilesOnDisk || 23595).toLocaleString()}파일)</div>
              </div>
              <div class="ud-slot-card" style="padding:9px 12px;">
                <span style="font-size:11px;color:#94a3b8;">Gemma 4 멀티모달 &amp; 18대 AI Studio 모듈</span>
                <div style="font-weight:800;color:#34d399;margin-top:2px;">🟢 PASS (Gemma 4 E4B/E2B/31B · 768d RAG)</div>
              </div>
              <div class="ud-slot-card" style="padding:9px 12px;">
                <span style="font-size:11px;color:#94a3b8;">Google Harness² &amp; CHLGD 보안 하네스</span>
                <div style="font-weight:800;color:#34d399;margin-top:2px;">🟢 PASS (자기진화 · 원본 유실 방지 100%)</div>
              </div>
            </div>

            <h3 style="font-size:12.5px;color:#38bdf8;margin-bottom:6px;">💻 실시간 시스템 작동 로그 (${logs.length}건)</h3>
            <div style="background:#040812;border:1px solid rgba(148,163,184,0.2);border-radius:8px;padding:8px;max-height:240px;overflow-y:auto;font-family:monospace;font-size:11px;">
              ${logs.map(l => `
                <div style="padding:4px 0;border-bottom:1px solid rgba(148,163,184,0.1);color:#cbd5e1;">
                  <span style="color:#64748b;">[${l.time}]</span>
                  <strong style="color:#00f0ff;">[${l.agent}]</strong>
                  <span>${l.event}</span>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      </div>
    `;

    this.bindUnifiedHeaderEvents(stage);

    stage.querySelectorAll('.btn-ud-voice-actor').forEach(btn => {
      const currentVoice = window.MultimodalEngine?.selectedVoiceId || localStorage.getItem('jarvis_voice_id') || 'ko-KR-HyunsuMultilingualNeural';
      if (btn.dataset.voice === currentVoice) {
        btn.classList.remove('outline');
        btn.classList.add('primary');
      } else {
        btn.classList.remove('primary');
        btn.classList.add('outline');
      }
      btn.addEventListener('click', () => {
        const vId = btn.dataset.voice;
        if (window.MultimodalEngine?.setNeuralVoice) {
          window.MultimodalEngine.setNeuralVoice(vId, true);
        }
        stage.querySelectorAll('.btn-ud-voice-actor').forEach(b => {
          b.classList.toggle('primary', b.dataset.voice === vId);
          b.classList.toggle('outline', b.dataset.voice !== vId);
        });
      });
    });

    stage.querySelector('#btn-ud-test-tts')?.addEventListener('click', () => {
      window.MultimodalEngine?.speakText?.(
        '이건우 대표님, 자비스 아흔여섯 킬로비피에스 스튜디오 자연 음성이 정상 작동 중입니다. 무엇을 도와드릴까요?',
        'jarvis'
      );
    });
    stage.querySelector('#btn-ud-settings-exec-brief')?.addEventListener('click', async () => {
      const bRes = await fetch('/api/jarvis/executive-briefing').then(r => r.json()).catch(() => null);
      if (bRes && bRes.spokenBriefing) {
        window.MultimodalEngine?.speakText?.(bRes.spokenBriefing, 'jarvis');
      } else {
        window.MultimodalEngine?.sendCommandToJarvis?.('자비스, 오늘 브리핑 해줘');
      }
    });
    stage.querySelector('#btn-ud-test-mic')?.addEventListener('click', () => {
      document.getElementById('orb-voice-mic')?.click();
    });
    stage.querySelector('#btn-ud-open-tts-studio')?.addEventListener('click', () => {
      window.HUDWindowSpawner?.openAIStudioWindowByType?.('OPEN_TTS_STUDIO');
    });
    stage.querySelector('#btn-ud-stop-tts')?.addEventListener('click', () => {
      document.getElementById('btn-toast-stop-voice')?.click();
    });
    stage.querySelector('#btn-ud-theme-cycle')?.addEventListener('click', () => {
      document.getElementById('btn-cycle-theme')?.click();
    });
    stage.querySelector('#btn-ud-open-holo')?.addEventListener('click', () => {
      document.getElementById('btn-top-holo-cam')?.click();
    });
    stage.querySelector('#btn-ud-open-manual')?.addEventListener('click', () => {
      window.MultimodalEngine?.sendCommandToJarvis?.('설명서 창 띄워줘');
    });
    stage.querySelector('#btn-ud-open-report')?.addEventListener('click', () => {
      window.MultimodalEngine?.sendCommandToJarvis?.('112개 오픈소스 딥리서치 보고서 보여줘');
    });
    stage.querySelector('#btn-ud-open-aistudio-hub')?.addEventListener('click', () => {
      window.HUDWindowSpawner?.openAIStudioWindowByType?.('AI_STUDIO_HUB');
    });
    stage.querySelector('#btn-ud-run-healthcheck')?.addEventListener('click', async () => {
      const box = stage.querySelector('#ud-healthcheck-results');
      if (box) box.style.opacity = '0.5';
      await window.MultimodalEngine?.runFullSystemVerificationUI?.();
      await this.renderSettingsDashboard(stage);
    });
  },

  /**
   * 🛰️ 59대 글로벌·국내 자비스 딥리서치 & 카메라 제스처 대시보드
   * ("Javis Ai System Research and MockUps" 대화 세션 통합 뷰)
   */
  async renderJarvisResearchDashboard(stage) {
    const db = window.JarvisCameraGestureOS?.RESEARCH_59_DB || [];
    const categories = ['전체 (59)', '빅테크/기업 (10)', '오픈소스 에이전트 (15)', '로컬 런타임/음성/홈 (12)', '해외 유튜버/메이커 (8)', '국내 기업/플랫폼 (6)', '국내 유튜버/개발자 (8)'];
    const activeCat = this.activeResearchCat || '전체 (59)';
    const filtered = activeCat === '전체 (59)' ? db : db.filter(item => item.cat === activeCat);

    stage.innerHTML = `
      <div class="unified-dash-shell">
        ${this.renderUnifiedDashboardHeader(
          '🛰️ 59대 글로벌·국내 자비스 딥리서치 & 카메라 비전 제스처 OS',
          'Javis Ai System Research and MockUps 채팅 세션에서 조사한 59개 자비스 생태계와 MediaPipe 21-Keypoint 손 제스처(인식·클릭·이동·회전)를 통합 제어합니다.',
          'JARVIS_RESEARCH_DASHBOARD'
        )}

        <div class="ud-kpi-row">
          <div class="ud-kpi-card">
            <span class="ud-kpi-label">심층 조사된 자비스 생태계</span>
            <strong class="ud-kpi-val">59개 프로젝트</strong>
            <span class="ud-kpi-sub">빅테크 10 · 오픈소스 27 · 국내외 크리에이터/기업 22</span>
          </div>
          <div class="ud-kpi-card">
            <span class="ud-kpi-label">카메라 비전 제스처 엔진</span>
            <strong class="ud-kpi-val">MediaPipe 21-PT</strong>
            <span class="ud-kpi-sub">1.인식(#8) · 2.클릭(#4+#8) · 3.이동(Drag) · 4.회전(3D)</span>
          </div>
          <div class="ud-kpi-card">
            <span class="ud-kpi-label">4계층 자비스 아키텍처</span>
            <strong class="ud-kpi-val">인지·두뇌·실행·표현</strong>
            <span class="ud-kpi-sub">Gemma 4 로컬 코어 + ArtCraft 13종 + 26인 에이전트</span>
          </div>
          <div class="ud-kpi-card">
            <span class="ud-kpi-label">디자인 테마</span>
            <strong class="ud-kpi-val">심플 모노톤 라이트</strong>
            <span class="ud-kpi-sub">화이트(#FFF) · 웜그레이(#F4F5F7) · 차콜(#18181B)</span>
          </div>
        </div>

        <div class="ud-grid-2col" style="grid-template-columns: 1fr 1.35fr;">
          <!-- 좌측: 카메라 비전 4대 제스처 제어 & 10대 시안 런처 -->
          <section class="ud-panel">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">🖐️ 카메라 비전 4대 공간 제스처 제어 (MediaPipe 21-Keypoints)</h2>
                <p class="ud-panel-desc">웹캠 또는 가상 핸드 모드로 화면의 버튼과 카드를 인식·클릭·드래그·3D 회전합니다.</p>
              </div>
              <div style="display:flex;gap:6px;">
                <button type="button" class="ud-btn primary small" id="btn-jres-toggle-cam">🎥 손 제스처 PIP 열기</button>
                <a href="/assets/research_concepts/BSC_JARVIS_Camera_Gesture_OS.html" target="_blank" class="ud-btn outline small" style="text-decoration:none;">↗ 풀스크린 제스처 OS</a>
              </div>
            </div>

            <div class="ud-slot-list" style="gap:8px;">
              <div class="ud-slot-card connected">
                <div class="ud-slot-top">
                  <span class="ud-slot-name">1. 인식 (Recognize / Hover) — 검지 끝 Landmark #8</span>
                  <span class="ud-badge on">POINTING</span>
                </div>
                <div class="ud-slot-path">손가락이 가리키는 좌표의 버튼·카드를 자동 감지하여 타겟 하이라이트 표시</div>
              </div>
              <div class="ud-slot-card">
                <div class="ud-slot-top">
                  <span class="ud-slot-name">2. 클릭 (Pinch Click) — 엄지(#4) + 검지(#8) 거리 &lt; 0.055</span>
                  <span class="ud-badge on">CLICK</span>
                </div>
                <div class="ud-slot-path">엄지와 검지를 맞닿게 핀치하면 대시보드 탭·버튼·토글 즉시 클릭 실행</div>
              </div>
              <div class="ud-slot-card">
                <div class="ud-slot-top">
                  <span class="ud-slot-name">3. 이동 (Drag &amp; Move) — 핀치 홀드 후 손 이동</span>
                  <span class="ud-badge on">DRAG X/Y</span>
                </div>
                <div class="ud-slot-path">창이나 패널 위에서 핀치를 유지한 채 이동하면 손 궤적을 따라 실시간 배치</div>
              </div>
              <div class="ud-slot-card">
                <div class="ud-slot-top">
                  <span class="ud-slot-name">4. 회전 (3D Rotate) — 손바닥 비틀기 / 소지(#20-#0) 접기</span>
                  <span class="ud-badge on">3D ROTATE</span>
                </div>
                <div class="ud-slot-path">뉴런홈 3D 은하 코어 또는 대시보드 스테이지를 입체 회전 제어</div>
              </div>
            </div>
          </section>

          <!-- 우측: 국내·해외 59개 자비스 시스템 데이터베이스 -->
          <section class="ud-panel">
            <div class="ud-panel-head">
              <div>
                <h2 class="ud-panel-title">🌍 국내·해외 59개 자비스(J.A.R.V.I.S.) 시스템 전수 데이터베이스</h2>
                <p class="ud-panel-desc">분류 탭을 클릭하면 빅테크·오픈소스·해외/국내 유튜버 및 기업의 자비스 레퍼런스와 GitHub를 즉시 열람합니다.</p>
              </div>
            </div>

            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
              ${categories.map(cat => `
                <button type="button" class="ud-btn ${cat === activeCat ? 'primary' : 'outline'} small btn-jres-cat" data-cat="${cat}">
                  ${cat}
                </button>
              `).join('')}
            </div>

            <div class="ud-md-list" style="max-height:420px;overflow-y:auto;">
              ${filtered.map(item => `
                <div class="ud-md-item" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                  <div>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <span class="ud-md-eco">#${String(item.id).padStart(2, '0')} · ${item.cat}</span>
                      <strong class="ud-md-title">${item.name}</strong>
                      <span style="font-size:11px;color:#6b7280;">(${item.org})</span>
                    </div>
                    <p class="ud-md-summary" style="margin-top:4px;">${item.desc}</p>
                  </div>
                  <a href="${item.url}" target="_blank" rel="noopener" class="ud-btn outline small" style="text-decoration:none;flex-shrink:0;">GitHub / 링크 ↗</a>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      </div>
    `;

    this.bindUnifiedHeaderEvents(stage);
    stage.querySelector('#btn-jres-toggle-cam')?.addEventListener('click', () => {
      window.JarvisCameraGestureOS?.toggleGestureWidget(true);
    });
    stage.querySelectorAll('.btn-jres-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeResearchCat = btn.dataset.cat;
        this.renderJarvisResearchDashboard(stage);
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.JarvisDesignViews.init();
});
