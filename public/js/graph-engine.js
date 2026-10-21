/**
 * 🌌 BSC J.A.R.V.I.S. OS — Star-Cluster Nebula Knowledge Galaxy Engine
 * Implements CEO Lee Geon-woo's Master Design Mockup #1:
 *  - Cosmic deep-space nebula backdrop + shimmering starfield dust
 *  - 8 Featured Korean Starburst Hub Constellations:
 *    (소풍 홈페이지, BSC HQ, 한 제1장, 출판사 OS, AI 오피스, 연구 자료, 음악 사업, 스킬)
 *  - Real 523+ node / 567+ link BSC Brain Vault integration
 *  - Top-Left Floating Node Preview Card (#node-preview-card) synchronization
 */

window.BrainGraphEngine = {
  canvas: null,
  ctx: null,
  nodes: [],
  links: [],
  neighbors: new Map(),
  starDust: [],
  viewMode: '3d', // '3d' | '2d' | 'rings' | 'areas' | 'timeline' | 'brain'
  activeAreaFilter: null,
  activeKindFilter: 'all',
  searchQuery: '',
  selectedNode: null,
  hoveredNode: null,
  focusMode: false,

  // Camera & Physics parameters
  rotX: 0.14,
  rotY: -0.18,
  autoRotate: true,
  zoom: 1.0,
  camX: 0,
  camY: 0,
  repelStrength: 155,
  linkDistance: 75,
  replayProgress: 1.0,
  tick: 0,

  // 8 Featured Starburst Constellations from CEO Master Mockup #1
  featuredConstellations: [
    {
      id: 'hub-sopoong',
      label: '소풍 홈페이지',
      subtitle: '바다를 더 가까이, 소풍 FISHING',
      area: '02.BSC_Branch',
      kind: 'project',
      category: 'project',
      color: '#00f0ff',
      glowColor: 'rgba(0, 240, 255, 0.55)',
      hx: -305, hy: -105, hz: 45,
      previewImg: '/props/sopoong-boat.jpg',
      workspaceTarget: 'BSC_OS_WORKSPACE',
      note: '소풍 피싱(Sopoong Fishing) 공식 브랜드 홈페이지 및 선박 예약·운항 일정 통합 웹 프로젝트 (진행률 60%)',
      children: [
        { label: '주요 페이지', category: 'doc', note: '메인 히어로, 선박 소개, 예약 현황, 오시는 길 구성' },
        { label: '선박 소개', category: 'doc', note: '소풍호 제원 및 안전 장비·편의시설 안내' },
        { label: '예약 안내', category: 'topic', note: '실시간 출조 예약 및 물때표 연동 시스템' },
        { label: '운항 일정', category: 'topic', note: '시즌별 어종 및 출항 스케줄 캘린더' },
        { label: '포트폴리오', category: 'idea', note: '출조 조황 갤러리 및 생생 후기 아카이브' },
        { label: '디자인 시안', category: 'doc', note: '김태오 BX 디자이너 노을 컨셉 1차 시안' },
        { label: '바다 낚시 투어', category: 'idea', note: '초보자 및 가족 체험형 선상 낚시 프로그램' },
        { label: '오시는 길', category: 'ext', note: '항구 집결지 지도 및 주차 안내' }
      ]
    },
    {
      id: 'hub-bsc-hq',
      label: 'BSC HQ',
      subtitle: 'BeausCreators 중앙 본사 컨트롤 타워',
      area: '01.BSC_HQ',
      kind: 'area',
      category: 'project',
      color: '#38bdf8',
      glowColor: 'rgba(56, 189, 248, 0.50)',
      hx: -95, hy: -185, hz: -30,
      previewImg: '/props/preview-beaus-sunset.jpg',
      workspaceTarget: 'BSC_OS_WORKSPACE',
      note: 'BeausCreators 본사(01.BSC_HQ) 전사 가이드라인, 보고서, 작업일지, 재무·인사 통합 허브',
      children: [
        { label: '비전 & 미션', category: 'doc', note: 'Coram Deo & Together 청지기 경영 헌장' },
        { label: '전략 기획실', category: 'person', note: '수석비서 소하 · 비서실장 태준 총괄' },
        { label: '재무·ERP', category: 'topic', note: 'CFO 도현 · BI 다인 손익 및 예산 관제' },
        { label: '보고서 보관함', category: 'doc', note: '01.보고서 및 02.작업일지 실시간 동기화' },
        { label: '지식 인덱스', category: 'topic', note: '6.Knowledge_Index 전사 아키텍처 인사이트' },
        { label: '보안 거버넌스', category: 'ext', note: 'Core-Lock-Guard 무결성 및 데이터 보호' }
      ]
    },
    {
      id: 'hub-han-ch1',
      label: '한 제1장',
      subtitle: '서사 세계관 & 오리지널 스토리 아카이브',
      area: '04.Publishing',
      kind: 'note',
      category: 'doc',
      color: '#c084fc',
      glowColor: 'rgba(192, 132, 252, 0.50)',
      hx: 85, hy: -205, hz: 35,
      previewImg: '/props/preview-moonlit-forest.jpg',
      workspaceTarget: 'DOC_WORKSPACE',
      note: '오리지널 IP [한(恨) 제1장] 스토리라인, 인물 관계도, 배경 설정 및 집필 원고 허브',
      children: [
        { label: '원고 초안', category: 'doc', note: '제1장 도입부 및 주요 장면 집필 원고' },
        { label: '세계관 설정', category: 'idea', note: '시대 배경 및 핵심 갈등 구조 설계' },
        { label: '인물 관계도', category: 'person', note: '주요 등장인물 캐릭터 시트 및 서사 아크' },
        { label: '참고 문헌', category: 'ext', note: '역사·문화 고증 레퍼런스 자료집' },
        { label: '퇴고 노트', category: 'doc', note: '서아 에디터 교정·교열 피드백 기록' }
      ]
    },
    {
      id: 'hub-publisher-os',
      label: '출판사 OS',
      subtitle: '도서출판 아름다운 세상 자동화 파이프라인',
      area: '04.Publishing',
      kind: 'project',
      category: 'project',
      color: '#fbbf24',
      glowColor: 'rgba(251, 191, 36, 0.55)',
      hx: 300, hy: -120, hz: -20,
      previewImg: '/props/preview-brand-beyond.jpg',
      workspaceTarget: 'DOC_WORKSPACE',
      note: '원고 교정·교열(Doc-Proofreader-Pro)부터 EPUB 3.0 전자책 원클릭 빌드 및 유통까지 총괄하는 출판 OS',
      children: [
        { label: '원고 투고', category: 'doc', note: '신규 출간 기획안 및 투고 원고 접수' },
        { label: '교정·교열', category: 'topic', note: '국립국어원 표준 3단 대조표 자동 생성' },
        { label: '표지 디자인', category: 'idea', note: '북커버 시안 및 인디자인 조판 가이드' },
        { label: 'EPUB 3.0 빌드', category: 'topic', note: 'Zero-Cost 정규 전자책 패키징 파이프라인' },
        { label: '인쇄·유통', category: 'ext', note: '교보문고·예스24·알라딘 유통 메타데이터' },
        { label: '출간 일정', category: 'doc', note: '월간 출판 스케줄 및 마케팅 캘린더' },
        { label: 'ISBN 관리', category: 'ext', note: '국립중앙도서관 납본 및 서지 정보 관리' }
      ]
    },
    {
      id: 'hub-ai-office',
      label: 'AI 오피스',
      subtitle: 'BSC AI OFFICE — SD 캐릭터 타이쿤 에이전트 사옥',
      area: '01.BSC_HQ',
      kind: 'root',
      category: 'person',
      color: '#38bdf8',
      glowColor: 'rgba(0, 240, 255, 0.72)',
      hx: 10, hy: -15, hz: 75,
      previewImg: '/props/tycoon-scene-1-office.jpg',
      workspaceTarget: 'TYCOON_OFFICE_WORKSPACE',
      note: 'SD 캐릭터 에이전트들이 게임 스튜디오, 회의실, 콘텐츠 제작, 시장 리서치, 대표실에서 실시간 협업하는 타이쿤 오피스',
      children: [
        { label: '자비스 코어', category: 'person', note: 'J.A.R.V.I.S. 단독 보이스 및 전사 지식 오케스트레이터' },
        { label: '서윤 (PM)', category: 'person', note: '프로젝트 매니저 — 홈페이지 시안 검토 및 일정 관리' },
        { label: '김태오 (BX)', category: 'person', note: 'BX 디자이너 — 외주 홈페이지 1차 시안 대표실 보고' },
        { label: '리서치 에이전트', category: 'person', note: '글로벌 AI 동향 수집 · 원고 작성 · 팩트체크 검수' },
        { label: '협업 회의실', category: 'topic', note: '신규 지역: 달빛 숲 레벨·밸런스·사운드 6인 회의' },
        { label: '게임 스튜디오', category: 'project', note: '유니티/블렌더 3D 에셋 및 타이쿤 레벨 제작 존' },
        { label: '대표실 보고', category: 'doc', note: '이건우 대표님 최종 결재 및 피드백 승인 게이트' }
      ]
    },
    {
      id: 'hub-research',
      label: '연구 자료',
      subtitle: 'Google Harness² · 논문 · 기술 벤치마크 리서치',
      area: '03.Research',
      kind: 'note',
      category: 'ext',
      color: '#34d399',
      glowColor: 'rgba(52, 211, 153, 0.52)',
      hx: 235, hy: 45, hz: 40,
      previewImg: '/props/tycoon-scene-2-research.jpg',
      workspaceTarget: 'DOC_WORKSPACE',
      note: 'Google Research Harness², arXiv 최신 AI 논문, 시장 조사 및 경쟁사 기술 역공학(REA) 데이터베이스',
      children: [
        { label: 'Harness² 논문', category: 'ext', note: '인지 다이어트 및 실행 하네스 루프 아키텍처' },
        { label: '이번 주 AI 동향', category: 'doc', note: '글로벌 멀티모달 에이전트 및 로컬 SLM 트렌드' },
        { label: '시장 리서치', category: 'topic', note: '타겟 산업군 시장 규모 및 경쟁사 벤치마크' },
        { label: '단백질 구조 분석', category: 'ext', note: 'AlphaFold 3D 생체분자 구조 분석 리포트' },
        { label: '특허·법률 스캔', category: 'doc', note: '저작권·상표권 및 오픈소스 라이선스 검증' }
      ]
    },
    {
      id: 'hub-music',
      label: '음악 사업',
      subtitle: 'BSC Music AI — 음원 프로듀싱 & 비주얼 앨범',
      area: '02.BSC_Branch',
      kind: 'project',
      category: 'idea',
      color: '#f472b6',
      glowColor: 'rgba(244, 114, 182, 0.55)',
      hx: -245, hy: 135, hz: -15,
      previewImg: '/props/preview-beaus-sunset.jpg',
      workspaceTarget: 'TYCOON_OFFICE_WORKSPACE',
      note: '프로듀서 제이(Jay), 작사가 은우, 비주얼 로아, 마케터 리나가 협업하는 AI 음원 기획·제작·유통 파이프라인',
      children: [
        { label: '앨범 컨셉 시트', category: 'idea', note: '제이(Jay) 무드·템포·장르 디렉팅 시트' },
        { label: '가사·메타태그', category: 'doc', note: '은우 곡 구조 기반 킬링파트 가사집' },
        { label: '앨범 커버 아트', category: 'idea', note: '로아(Roa) 시네마틱 아트워크 및 썸네일' },
        { label: '숏폼 바이럴', category: 'topic', note: '리나(Lina) 릴스·틱톡·유튜브 프로모션' },
        { label: '음원 스트리밍', category: 'ext', note: '글로벌 음원 플랫폼 유통 및 정산 지표' }
      ]
    },
    {
      id: 'hub-skills',
      label: '스킬',
      subtitle: '05.BSC_Skill_Warehouse — 전사 AI 스킬 창고',
      area: '05.BSC_Skill_Warehouse',
      kind: 'skill',
      category: 'topic',
      color: '#818cf8',
      glowColor: 'rgba(129, 140, 248, 0.55)',
      hx: 145, hy: 165, hz: -35,
      previewImg: '/props/tycoon-scene-4-meeting.jpg',
      workspaceTarget: 'SETTINGS_WORKSPACE',
      note: '웹 자료 조사, 문서 생성, 코드 품질 게이트, 온디바이스 음성 합성, HOLO 비전 등 90+개 모듈형 스킬 허브',
      children: [
        { label: '웹 자료 조사', category: 'topic', note: '실시간 출처 수집·요약·문서 초안 변환 스킬' },
        { label: '6종 문서 생성', category: 'doc', note: 'MD, Word, PPT, PDF, 이미지, 영상 자동 변환' },
        { label: '코드 품질 게이트', category: 'topic', note: '린트·타입·보안 취약점 0.1초 전수 검사' },
        { label: '자비스 음성 합성', category: 'topic', note: '현수 멀티링구얼 HD 무중단 문장 스트리밍' },
        { label: 'HOLO 손동작 제어', category: 'idea', note: 'MediaPipe 21관절 웹캠 에어터치 인터페이스' },
        { label: '시맨틱 지식 검색', category: 'ext', note: '로컬 임베딩 + BM25 하이브리드 초고속 검색' }
      ]
    }
  ],

  async init() {
    this.canvas = document.getElementById('brain-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.initStarDust();
    await this.loadBrainData();
    this.bindEvents();
    this.animate();
  },

  resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  initStarDust() {
    this.starDust = [];
    const palette = ['#ffffff', '#38bdf8', '#c084fc', '#fbbf24', '#34d399', '#f472b6'];
    for (let i = 0; i < 240; i++) {
      this.starDust.push({
        x: (Math.random() - 0.5) * 1800,
        y: (Math.random() - 0.5) * 1100,
        z: (Math.random() - 0.5) * 900,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.55 + 0.15,
        color: palette[i % palette.length],
        phase: Math.random() * Math.PI * 2
      });
    }
  },

  async loadBrainData() {
    try {
      const res = await fetch('/api/brain');
      const data = await res.json();
      const rawNodes = data.nodes || [];
      const rawLinks = data.links || [];

      this.buildStarClusterGalaxy(rawNodes, rawLinks);

      // Update Vault Stats
      const statNodes = document.getElementById('stat-nodes');
      const statLinks = document.getElementById('stat-links');
      const cntAll = document.getElementById('cnt-all');
      if (statNodes) statNodes.textContent = `${this.nodes.length} notes`;
      if (statLinks) statLinks.textContent = `${this.links.length} connections`;
      if (cntAll) cntAll.textContent = this.nodes.length;

      if (data.tokenFlow) {
        const pctEl = document.getElementById('tf-savings-pct');
        const fillEl = document.getElementById('tf-bar-fill');
        const actEl = document.getElementById('tf-actual');
        const rawEl = document.getElementById('tf-raw');
        if (pctEl) pctEl.textContent = `${data.tokenFlow.savingsPercent}% SAVED`;
        if (fillEl) fillEl.style.width = `${data.tokenFlow.savingsPercent}%`;
        if (actEl) actEl.textContent = `${(data.tokenFlow.actualTokens / 1000).toFixed(1)}k`;
        if (rawEl) rawEl.textContent = `${(data.tokenFlow.rawTokens / 1000).toFixed(1)}k`;
      }

      this.renderTopHubs(data.stats?.areaBreakdown || {});
      this.computeLayoutTargets();

      // Default select '소풍 홈페이지' so Top-Left Preview Card matches Mockup #1 immediately
      const defaultHub = this.nodes.find(n => n.id === 'hub-sopoong') || this.nodes[0];
      if (defaultHub) {
        this.selectedNode = defaultHub;
        this.syncNodePreviewCard(defaultHub);
      }
    } catch (e) {
      console.error('Failed to load brain.json:', e);
    }
  },

  buildStarClusterGalaxy(rawNodes, rawLinks) {
    const categoryColorMap = {
      project: '#00f0ff', // 프로젝트 (Cyan)
      doc: '#38bdf8',     // 문서 (Sky Blue)
      person: '#fbbf24',  // 사람 (Amber)
      topic: '#c084fc',   // 주제 (Purple)
      idea: '#34d399',    // 아이디어 (Emerald)
      ext: '#f472b6'      // 외부 자료 (Pink/Rose)
    };

    this.nodes = [];
    this.links = [];
    const idToIdx = new Map();

    // 1. Add the 8 Featured Starburst Constellations & their radial children first
    this.featuredConstellations.forEach((hub, hOrder) => {
      const hubIdx = this.nodes.length;
      const hubNode = {
        idx: hubIdx,
        id: hub.id,
        label: hub.label,
        subtitle: hub.subtitle,
        area: hub.area,
        kind: hub.kind,
        category: hub.category,
        isFeaturedHub: true,
        hubOrder: hOrder,
        color: hub.color,
        glowColor: hub.glowColor,
        r: hub.id === 'hub-sopoong' || hub.id === 'hub-ai-office' ? 11.5 : 9.8,
        hx: hub.hx,
        hy: hub.hy,
        hz: hub.hz,
        x: hub.hx + (Math.random() - 0.5) * 20,
        y: hub.hy + (Math.random() - 0.5) * 20,
        z: hub.hz,
        tx: hub.hx,
        ty: hub.hy,
        tz: hub.hz,
        previewImg: hub.previewImg,
        workspaceTarget: hub.workspaceTarget,
        note: hub.note,
        path: `C:\\BeausCreators\\${hub.area}`
      };
      this.nodes.push(hubNode);
      idToIdx.set(hubNode.id, hubIdx);

      const childCount = hub.children.length;
      hub.children.forEach((ch, cIdx) => {
        const angle = (cIdx / childCount) * Math.PI * 2 + (hOrder * 0.45);
        const radius = 58 + (cIdx % 3) * 20;
        const cx = hub.hx + Math.cos(angle) * radius;
        const cy = hub.hy + Math.sin(angle) * radius * 0.85;
        const cz = hub.hz + Math.sin(angle * 2) * 28;
        const nodeIdx = this.nodes.length;
        const cId = `${hub.id}-child-${cIdx}`;

        this.nodes.push({
          idx: nodeIdx,
          id: cId,
          label: ch.label,
          subtitle: `${hub.label} · ${ch.label}`,
          area: hub.area,
          kind: 'note',
          category: ch.category || 'doc',
          isFeaturedChild: true,
          parentHubId: hub.id,
          parentHubIdx: hubIdx,
          color: categoryColorMap[ch.category] || hub.color,
          r: 4.3,
          hx: cx,
          hy: cy,
          hz: cz,
          x: cx,
          y: cy,
          z: cz,
          tx: cx,
          ty: cy,
          tz: cz,
          previewImg: hub.previewImg,
          workspaceTarget: hub.workspaceTarget,
          note: ch.note,
          path: `C:\\BeausCreators\\${hub.area}\\${ch.label}.md`
        });
        idToIdx.set(cId, nodeIdx);
        this.links.push({ s: hubIdx, t: nodeIdx, isConstellationRay: true, color: hub.color });
        if (cIdx > 0 && cIdx % 2 === 0) {
          this.links.push({ s: nodeIdx - 1, t: nodeIdx, isSecondaryRay: true, color: hub.color });
        }
      });
    });

    // Connect the 8 Featured Hubs into a grand cosmic backbone web
    const backbonePairs = [
      [0, 1], [1, 2], [2, 3], [0, 4], [1, 4], [2, 4], [3, 4],
      [4, 5], [3, 5], [0, 6], [4, 6], [4, 7], [5, 7], [6, 7]
    ];
    backbonePairs.forEach(([a, b]) => {
      const idxA = idToIdx.get(this.featuredConstellations[a].id);
      const idxB = idToIdx.get(this.featuredConstellations[b].id);
      if (idxA !== undefined && idxB !== undefined) {
        this.links.push({ s: idxA, t: idxB, isBackbone: true });
      }
    });

    // 2. Append remaining background vault nodes around the 8 hubs so all 523+ notes remain searchable & interactive
    const hubCenters = this.featuredConstellations;
    rawNodes.forEach((rn, i) => {
      const assignedHub = hubCenters[i % hubCenters.length];
      const parentIdx = idToIdx.get(assignedHub.id);
      const angle = i * 2.39996;
      const dist = 42 + (i % 14) * 9.5;
      const bx = assignedHub.hx + Math.cos(angle) * dist;
      const by = assignedHub.hy + Math.sin(angle) * dist * 0.85;
      const bz = assignedHub.hz + Math.cos(i * 0.7) * 55;

      const cats = ['project', 'doc', 'person', 'topic', 'idea', 'ext'];
      const cat = rn.category || cats[i % cats.length];
      const nIdx = this.nodes.length;

      this.nodes.push({
        ...rn,
        idx: nIdx,
        category: cat,
        parentHubIdx: parentIdx,
        color: rn.color || assignedHub.color,
        r: Math.min(3.5, Math.max(1.8, (rn.r || 3) * 0.55)),
        hx: bx,
        hy: by,
        hz: bz,
        x: bx,
        y: by,
        z: bz,
        tx: bx,
        ty: by,
        tz: bz,
        previewImg: assignedHub.previewImg,
        workspaceTarget: assignedHub.workspaceTarget
      });
      idToIdx.set(rn.id, nIdx);

      if (parentIdx !== undefined && i % 3 === 0) {
        this.links.push({ s: parentIdx, t: nIdx, color: assignedHub.color });
      }
    });

    rawLinks.forEach(l => {
      const s = idToIdx.get(l.source);
      const t = idToIdx.get(l.target);
      if (s !== undefined && t !== undefined) {
        this.links.push({ s, t, kind: l.kind });
      }
    });

    // Build adjacency map
    this.neighbors.clear();
    this.nodes.forEach(n => this.neighbors.set(n.idx, new Set()));
    this.links.forEach(l => {
      this.neighbors.get(l.s)?.add(l.t);
      this.neighbors.get(l.t)?.add(l.s);
    });
  },

  renderTopHubs(areaBreakdown) {
    const listEl = document.getElementById('top-hubs-list');
    if (!listEl) return;

    let html = `
      <div class="hub-item ${!this.activeAreaFilter ? 'active' : ''}" data-area="">
        <span class="dot" style="background:#00f0ff"></span>
        <span class="name">전체 은하 (All Hubs)</span>
        <span class="cnt">${this.nodes.length}</span>
      </div>
    `;

    this.featuredConstellations.forEach(hub => {
      html += `
        <div class="hub-item" data-hub-id="${hub.id}">
          <span class="dot" style="background:${hub.color}"></span>
          <span class="name">${hub.label}</span>
          <span class="cnt">${hub.children.length + 1}</span>
        </div>
      `;
    });
    listEl.innerHTML = html;

    listEl.querySelectorAll('.hub-item').forEach(el => {
      el.addEventListener('click', () => {
        listEl.querySelectorAll('.hub-item').forEach(x => x.classList.remove('active'));
        el.classList.add('active');
        const hubId = el.dataset.hubId;
        if (hubId) {
          const target = this.nodes.find(n => n.id === hubId);
          if (target) {
            this.selectNode(target, false);
            this.flyToNode(target);
          }
        } else {
          this.activeAreaFilter = null;
          this.selectedNode = null;
        }
      });
    });
  },

  computeLayoutTargets() {
    const N = this.nodes.length;
    if (!N) return;
    const spread = this.repelStrength / 155;

    this.nodes.forEach((n, i) => {
      if (this.viewMode === '3d' || this.viewMode === '2d') {
        n.tx = (n.hx || 0) * spread;
        n.ty = (n.hy || 0) * spread;
        n.tz = this.viewMode === '2d' ? 0 : (n.hz || 0) * spread;
      } else if (this.viewMode === 'rings') {
        const ringIdx = n.isFeaturedHub ? 1 : n.isFeaturedChild ? 2 : 3;
        const ringR = ringIdx * 115 * spread;
        const ang = (i / N) * Math.PI * 2 * 3;
        n.tx = Math.cos(ang) * ringR;
        n.ty = Math.sin(ang) * ringR;
        n.tz = 0;
      } else if (this.viewMode === 'areas') {
        n.tx = (n.hx || 0) * 1.15 * spread;
        n.ty = (n.hy || 0) * 1.15 * spread;
        n.tz = 0;
      } else if (this.viewMode === 'timeline') {
        const xSpan = 820 * spread;
        n.tx = ((i / Math.max(1, N - 1)) - 0.5) * xSpan;
        n.ty = Math.sin(i * 0.35) * 140;
        n.tz = 0;
      } else if (this.viewMode === 'brain') {
        const hemi = i % 2 === 0 ? -1 : 1;
        const u = ((i * 0.6180339) % 1) * Math.PI;
        const v = (i / N) * Math.PI * 2;
        const rx = 165 * spread, ry = 205 * spread, rz = 140 * spread;
        n.tx = hemi * (34 + Math.abs(Math.sin(u) * Math.cos(v)) * rx);
        n.ty = Math.sin(u) * Math.sin(v) * ry * 0.82;
        n.tz = Math.cos(u) * rz;
      }
    });
  },

  setViewMode(mode) {
    this.viewMode = mode;
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === mode);
    });
    const toggle2d3d = document.getElementById('btn-bottom-2d3d');
    if (toggle2d3d) {
      toggle2d3d.textContent = mode === '2d' ? '2D' : '3D';
    }
    this.computeLayoutTargets();
  },

  isNodeVisible(n) {
    if (n.idx / Math.max(1, this.nodes.length) > this.replayProgress) return false;
    if (this.activeAreaFilter && n.area !== this.activeAreaFilter && !n.isFeaturedHub) return false;
    if (this.activeKindFilter !== 'all' && n.category !== this.activeKindFilter && n.kind !== this.activeKindFilter) {
      return false;
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      if (!n.label.toLowerCase().includes(q) && !(n.note || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  },

  project(n, W, H) {
    let x = n.x, y = n.y, z = n.z;
    if (this.viewMode === '3d' || this.viewMode === 'brain') {
      const cy = Math.cos(this.rotY), sy = Math.sin(this.rotY);
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const cx = Math.cos(this.rotX), sx = Math.sin(this.rotX);
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const fov = 980;
      const scale = (fov / Math.max(220, fov + z2)) * this.zoom;
      return {
        sx: W / 2 + this.camX + x1 * scale,
        sy: H / 2 + this.camY + y2 * scale,
        scale,
        z: z2
      };
    } else {
      return {
        sx: W / 2 + this.camX + x * this.zoom,
        sy: H / 2 + this.camY + y * this.zoom,
        scale: this.zoom,
        z: 0
      };
    }
  },

  drawCosmicNebulaBackdrop(ctx, W, H) {
    // Deep space radial background matching Mockup #1
    const bgGrad = ctx.createRadialGradient(W * 0.52, H * 0.48, 40, W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
    bgGrad.addColorStop(0, '#0b1528');
    bgGrad.addColorStop(0.45, '#070d1b');
    bgGrad.addColorStop(1, '#03060d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle Nebula Clouds behind each of the 8 Featured Hubs
    for (const n of this.nodes) {
      if (!n.isFeaturedHub || !n.sx) continue;
      const nebR = (n.id === 'hub-ai-office' || n.id === 'hub-sopoong' ? 165 : 130) * (n.scale || 1);
      const g = ctx.createRadialGradient(n.sx, n.sy, 4, n.sx, n.sy, nebR);
      g.addColorStop(0, (n.color || '#00f0ff') + '26');
      g.addColorStop(0.45, (n.color || '#00f0ff') + '0c');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, nebR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Twinkling Starfield Dust
    for (const s of this.starDust) {
      const p = this.project(s, W, H);
      if (p.sx < 0 || p.sx > W || p.sy < 0 || p.sy > H) continue;
      const tw = s.alpha * (0.65 + 0.35 * Math.sin(this.tick * 1.8 + s.phase));
      ctx.globalAlpha = tw;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, s.r * Math.min(1.4, p.scale), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  },

  drawStarburstFlare(ctx, x, y, radius, color, isSelected) {
    // Outer soft halo
    const haloR = radius * (isSelected ? 4.2 : 3.2);
    const g = ctx.createRadialGradient(x, y, radius * 0.2, x, y, haloR);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.25, color);
    g.addColorStop(0.6, color + '44');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, haloR, 0, Math.PI * 2);
    ctx.fill();

    // 4-Point Cross Starburst Rays (Matches Mockup #1 glowing star hubs)
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = isSelected ? 1.8 : 1.2;
    const spikeLen = radius * (isSelected ? 3.1 : 2.3);
    ctx.beginPath();
    ctx.moveTo(-spikeLen, 0);
    ctx.lineTo(spikeLen, 0);
    ctx.moveTo(0, -spikeLen);
    ctx.lineTo(0, spikeLen);
    ctx.stroke();

    // Bright white-hot core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  animate() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const ctx = this.ctx;
    this.tick += 0.016;

    if (this.autoRotate && (this.viewMode === '3d' || this.viewMode === 'brain')) {
      this.rotY += 0.00095;
    }

    if (this.replayProgress < 1.0) {
      this.replayProgress = Math.min(1.0, this.replayProgress + 0.015);
    }

    for (const n of this.nodes) {
      n.x += (n.tx - n.x) * 0.085;
      n.y += (n.ty - n.y) * 0.085;
      n.z += (n.tz - n.z) * 0.085;
      const p = this.project(n, W, H);
      n.sx = p.sx;
      n.sy = p.sy;
      n.scale = p.scale;
      n.depth = p.z;
    }

    this.drawCosmicNebulaBackdrop(ctx, W, H);

    const focusTarget = this.hoveredNode || this.selectedNode;
    let focusSet = null;
    if (focusTarget) {
      focusSet = new Set([focusTarget.idx]);
      const nbrs = this.neighbors.get(focusTarget.idx);
      if (nbrs) nbrs.forEach(idx => focusSet.add(idx));
    }

    // Draw Constellation Rays & Links
    for (const l of this.links) {
      const a = this.nodes[l.s];
      const b = this.nodes[l.t];
      if (!a || !b || !this.isNodeVisible(a) || !this.isNodeVisible(b)) continue;

      const isHighlighted = focusSet && focusSet.has(a.idx) && focusSet.has(b.idx);
      if (focusSet && !isHighlighted && this.focusMode) continue;

      if (l.isConstellationRay) {
        ctx.lineWidth = isHighlighted ? 1.5 : 1.0;
        ctx.strokeStyle = isHighlighted ? (l.color || '#00f0ff') + 'cc' : (l.color || '#38bdf8') + '4d';
      } else if (l.isBackbone) {
        ctx.lineWidth = 0.9;
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.18)';
      } else {
        ctx.lineWidth = 0.65;
        ctx.strokeStyle = isHighlighted ? 'rgba(0, 240, 255, 0.55)' : 'rgba(148, 163, 184, 0.10)';
      }

      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    // Draw Nodes sorted back-to-front
    this._placedLabelBoxes = [];
    const sorted = [...this.nodes].sort((a, b) => b.depth - a.depth);
    for (const n of sorted) {
      if (!this.isNodeVisible(n)) continue;
      const inFocus = !focusSet || focusSet.has(n.idx);
      if (!inFocus && this.focusMode) continue;

      const radius = Math.max(1.8, n.r * n.scale);
      const isDirectTarget = n === this.selectedNode || n === this.hoveredNode;

      if (n.isFeaturedHub) {
        ctx.globalAlpha = 1.0;
        this.drawStarburstFlare(ctx, n.sx, n.sy, radius, n.color, isDirectTarget);
      } else if (n.isFeaturedChild) {
        ctx.globalAlpha = inFocus ? 0.96 : 0.55;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius * 2.1, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '33';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      } else {
        ctx.globalAlpha = inFocus ? 0.65 : 0.22;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color || '#38bdf8';
        ctx.fill();
      }

      // Label rendering: Always show 8 Featured Hubs & their featured children cleanly
      const shouldShowLabel = n.isFeaturedHub || n.isFeaturedChild || isDirectTarget || (this.zoom > 1.55 && inFocus);
      if (shouldShowLabel) {
        const labelText = n.label.slice(0, 24);
        const isHub = n.isFeaturedHub;
        const fontSize = isHub ? 14 : isDirectTarget ? 12 : 11;
        ctx.font = `${isHub || isDirectTarget ? '700' : '500'} ${fontSize}px Pretendard, -apple-system, sans-serif`;
        const estW = ctx.measureText(labelText).width + 10;
        const estH = fontSize + 6;
        const lx = isHub ? n.sx - estW / 2 : n.sx + radius + 6;
        const ly = isHub ? n.sy + radius * 2.2 + 4 : n.sy - fontSize / 2;

        let overlaps = false;
        if (!isHub && !isDirectTarget) {
          for (const box of this._placedLabelBoxes) {
            if (lx < box.x + box.w && lx + estW > box.x && ly < box.y + box.h && ly + estH > box.y) {
              overlaps = true;
              break;
            }
          }
        }

        if (!overlaps) {
          this._placedLabelBoxes.push({ x: lx, y: ly, w: estW, h: estH });
          ctx.globalAlpha = isHub || isDirectTarget ? 1.0 : 0.88;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.92)';
          ctx.shadowBlur = 6;
          ctx.fillStyle = isHub ? '#ffffff' : isDirectTarget ? '#00f0ff' : '#dbeafe';
          ctx.fillText(labelText, isHub ? n.sx - (estW - 10) / 2 : n.sx + radius + 6, isHub ? n.sy + radius * 2.2 + fontSize : n.sy + 4);
          ctx.shadowBlur = 0;
        }
      }
    }
    ctx.globalAlpha = 1.0;

    requestAnimationFrame(() => this.animate());
  },

  findNodeAt(x, y) {
    // Check featured hubs & featured children first for responsive click UX
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (!this.isNodeVisible(n)) continue;
      const hitPad = n.isFeaturedHub ? 18 : n.isFeaturedChild ? 10 : 5;
      const r = Math.max(8, n.r * (n.scale || 1) + hitPad);
      const dx = n.sx - x;
      const dy = n.sy - y;
      if (dx * dx + dy * dy <= r * r) return n;
    }
    return null;
  },

  syncNodePreviewCard(node) {
    if (!node) return;
    const card = document.getElementById('node-preview-card');
    if (card) card.style.display = 'block';

    const titleEl = document.getElementById('np-card-title');
    const subEl = document.getElementById('np-card-sub');
    const imgEl = document.getElementById('np-card-img');
    const badgeEl = document.getElementById('np-card-badge');

    if (titleEl) titleEl.textContent = node.label;
    if (subEl) subEl.textContent = node.subtitle || node.note || 'BSC J.A.R.V.I.S. 지식 은하 노드';
    if (imgEl && node.previewImg) imgEl.src = node.previewImg;
    if (badgeEl) {
      badgeEl.textContent = node.area || 'BSC GALAXY';
      badgeEl.style.color = node.color || '#00f0ff';
    }
  },

  selectNode(node, openWindow = false) {
    this.selectedNode = node;
    const inspEl = document.getElementById('inspector-content');
    const actEl = document.getElementById('inspector-actions');

    if (!node) {
      return;
    }

    this.syncNodePreviewCard(node);

    const nbrCount = (this.neighbors.get(node.idx) || new Set()).size;
    if (inspEl) {
      inspEl.innerHTML = `
        <div style="color:${node.color};font-weight:800;font-size:13px;margin-bottom:4px;">${node.label}</div>
        <div style="font-size:10.5px;color:#38bdf8;font-family:monospace;margin-bottom:6px;">[${node.area}] · ${nbrCount} connections</div>
        <div style="color:#e2e8f0;margin-bottom:6px;">${node.note || ''}</div>
        <div style="font-size:10px;color:#64748b;word-break:break-all;">${node.path || ''}</div>
      `;
    }
    if (actEl) actEl.style.display = 'flex';

    if (openWindow) {
      if (window.JarvisDesignViews && node.workspaceTarget) {
        window.JarvisDesignViews.openWorkspace(node.workspaceTarget, node);
      } else if (node.path) {
        this.openNodeInReportWindow(node);
      }
    }
  },

  async openNodeInReportWindow(node) {
    if (!node) return;
    if (window.JarvisDesignViews && node.workspaceTarget) {
      window.JarvisDesignViews.openWorkspace(node.workspaceTarget, node);
      return;
    }
    try {
      const res = await fetch(`/api/read-node?path=${encodeURIComponent(node.path || '')}`);
      const data = await res.json();
      window.HUDWindowSpawner?.spawn({
        windowType: 'REPORT',
        title: `📊 ${node.label}`,
        subtitle: `${node.area} · ${node.path || ''}`,
        content: data.ok ? data.content : `# ${node.label}\n\n${node.note || ''}`
      });
    } catch (e) {}
  },

  flyToNode(node) {
    if (!node) return;
    this.camX = -node.x * 0.55;
    this.camY = -node.y * 0.55;
    this.zoom = 1.32;
  },

  bindEvents() {
    let dragging = false, startX = 0, startY = 0, moved = false;

    this.canvas.addEventListener('mousedown', e => {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      this.autoRotate = false;
    });

    window.addEventListener('mousemove', e => {
      if (!dragging) {
        this.hoveredNode = this.findNodeAt(e.clientX, e.clientY);
        this.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'grab';
        return;
      }
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;

      if (this.viewMode === '3d' || this.viewMode === 'brain') {
        this.rotY += dx * 0.0045;
        this.rotX = Math.max(-1.1, Math.min(1.1, this.rotX + dy * 0.0045));
      } else {
        this.camX += dx;
        this.camY += dy;
      }
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener('mouseup', e => {
      if (dragging && !moved && e.target === this.canvas) {
        const hit = this.findNodeAt(e.clientX, e.clientY);
        if (hit) this.selectNode(hit, false);
      }
      dragging = false;
    });

    this.canvas.addEventListener('dblclick', e => {
      const hit = this.findNodeAt(e.clientX, e.clientY);
      if (hit) this.selectNode(hit, true);
    });

    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom = Math.max(0.4, Math.min(3.2, this.zoom * factor));
    }, { passive: false });

    // View Switcher & Bottom Zoom Controls
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.setViewMode(btn.dataset.view));
    });

    document.getElementById('btn-toggle-2d3d')?.addEventListener('click', () => {
      this.setViewMode(this.viewMode === '2d' ? '3d' : '2d');
    });

    document.getElementById('btn-bottom-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(3.2, this.zoom * 1.18);
    });
    document.getElementById('btn-bottom-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.4, this.zoom * 0.84);
    });
    document.getElementById('btn-bottom-fit')?.addEventListener('click', () => {
      this.camX = 0;
      this.camY = 0;
      this.zoom = 1.0;
      this.rotX = 0.14;
      this.rotY = -0.18;
      this.autoRotate = true;
    });

    document.getElementById('btn-fit-graph')?.addEventListener('click', () => {
      this.camX = 0;
      this.camY = 0;
      this.zoom = 1.0;
      this.rotX = 0.14;
      this.rotY = -0.18;
      this.autoRotate = true;
    });

    document.getElementById('btn-replay-growth')?.addEventListener('click', () => {
      this.replayProgress = 0.02;
    });

    // Inspector Buttons
    document.getElementById('btn-open-node-report')?.addEventListener('click', () => {
      if (this.selectedNode) this.openNodeInReportWindow(this.selectedNode);
    });
    document.getElementById('btn-fly-node')?.addEventListener('click', () => {
      if (this.selectedNode) this.flyToNode(this.selectedNode);
    });

    // Global Search Input (#top-galaxy-search & #brain-search)
    const bindSearch = (inputEl) => {
      if (!inputEl) return;
      inputEl.addEventListener('input', e => {
        this.searchQuery = e.target.value.trim();
      });
      inputEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' && this.searchQuery) {
          const match = this.nodes.find(n => this.isNodeVisible(n));
          if (match) {
            this.selectNode(match, false);
            this.flyToNode(match);
          }
        }
      });
    };
    bindSearch(document.getElementById('brain-search'));
    bindSearch(document.getElementById('top-galaxy-search'));

    // Bottom Legend Category Filter Pills
    document.querySelectorAll('.legend-filter-item[data-cat]').forEach(item => {
      item.addEventListener('click', () => {
        const cat = item.dataset.cat;
        if (this.activeKindFilter === cat) {
          this.activeKindFilter = 'all';
          document.querySelectorAll('.legend-filter-item').forEach(x => x.classList.remove('active'));
        } else {
          this.activeKindFilter = cat;
          document.querySelectorAll('.legend-filter-item').forEach(x => x.classList.toggle('active', x.dataset.cat === cat));
        }
      });
    });

    // Sliders
    document.getElementById('slider-repel')?.addEventListener('input', e => {
      this.repelStrength = Number(e.target.value);
      this.computeLayoutTargets();
    });
    document.getElementById('slider-link-len')?.addEventListener('input', e => {
      this.linkDistance = Number(e.target.value);
      this.computeLayoutTargets();
    });

    // Right Rail Kind Filter
    document.querySelectorAll('#kind-filter-list .hub-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('#kind-filter-list .hub-item').forEach(x => x.classList.remove('active'));
        item.classList.add('active');
        this.activeKindFilter = item.dataset.kind || 'all';
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.BrainGraphEngine.init();
});
