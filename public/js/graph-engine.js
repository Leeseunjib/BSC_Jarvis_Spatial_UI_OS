/**
 * 🧠🌌 BSC J.A.R.V.I.S. OS — Obsidian-Style Knowledge Neuron Graph Engine
 * Implements CEO Lee Geon-woo's Directive:
 *  - "옵시디언처럼 우리 프로젝트와 스킬, 이런 부분들이 가운데에 지식 뉴런처럼 보여야 하지 않을까."
 *  - Renders all 798+ real nodes (52 Projects, 90+ Skills, 28 Agents, 10 Antigravity 2.0 / IDE Live Sessions,
 *    HQ Knowledge Index, Reports & WorkLogs) as an organic, densely interconnected Obsidian Neural Synapse Web
 *    right in the center of the viewport.
 */

window.BrainGraphEngine = {
  canvas: null,
  ctx: null,
  nodes: [],
  links: [],
  neighbors: new Map(),
  starDust: [],
  synapsePulses: [],
  viewMode: '3d', // '3d' | '2d' | 'rings' | 'areas' | 'timeline' | 'brain'
  activeAreaFilter: null,
  activeKindFilter: 'all',
  searchQuery: '',
  selectedNode: null,
  hoveredNode: null,
  focusMode: false,

  // Camera & Physics parameters
  rotX: 0.12,
  rotY: -0.15,
  autoRotate: true,
  zoom: 1.04,
  camX: 40, // Slight right offset so center neuron web sits cleanly to the right of the left menu
  camY: 0,
  repelStrength: 155,
  linkDistance: 75,
  replayProgress: 1.0,
  tick: 0,

  // Core Neural Hub Clusters (Centered like Obsidian's Graph View)
  neuralClusters: [
    {
      id: 'hub-ai-office',
      label: 'AI 오피스 · 에이전트',
      subtitle: 'BSC 28인 AI 에이전트 & SD 타이쿤 오피스 코어',
      area: '02.Agents (28 Roster)',
      kind: 'root',
      category: 'person',
      color: '#00f0ff',
      hx: 0, hy: 0, hz: 40,
      previewImg: '/props/tycoon-scene-1-office.jpg',
      workspaceTarget: 'TYCOON_OFFICE_WORKSPACE',
      note: '중앙 코어 뉴런: 자비스(J.A.R.V.I.S.) 및 28인 전사 에이전트(소하, 태준, 거누, 우진, 수호, 시안, 재호, 유나 등) 협업 신경망',
      neurons: [
        { label: '🤖 J.A.R.V.I.S. 코어', category: 'person', showAtDefault: true, note: '전사 지식 뉴런 오케스트레이터 & 단독 음성 파트너' },
        { label: '👩‍💼 수석비서 소하', category: 'person', showAtDefault: true, note: '90 Order 프론트오피스 기획 및 안건 정리' },
        { label: '👔 비서실장 태준', category: 'person', showAtDefault: true, note: '91 칸반·워룸 지휘 및 최종 QC 의결' },
        { label: '💻 CTO 거누', category: 'person', showAtDefault: true, note: '백엔드·인프라·REA 역공학·아키텍처 총괄' },
        { label: '🧠 AI연구원 우진', category: 'person', showAtDefault: true, note: 'Google Harness² 재귀 진화 & LLM 파이프라인' },
        { label: '🛡️ QA 수호', category: 'person', showAtDefault: false, note: '보안 취약점 스캔 및 코드 품질 게이트 검증' },
        { label: '🎨 수석디자이너 시안', category: 'person', showAtDefault: false, note: '전사 디자인 시스템 및 브랜드 토큰 총괄' },
        { label: '📐 UI/UX 재호', category: 'person', showAtDefault: true, note: '반응형 화면 설계 및 소비자 심리학 UI/UX' },
        { label: '⚡ 프론트엔드 유나', category: 'person', showAtDefault: false, note: '웹·모바일 60FPS 인터랙션 구현' },
        { label: '📋 PM 지윤 · 서윤', category: 'person', showAtDefault: true, note: '프로젝트 일정 조율 및 홈페이지 시안 검토' },
        { label: '✨ BX 김태오', category: 'person', showAtDefault: true, note: '브랜드 비주얼 및 외주 홈페이지 시안 제작' },
        { label: '💰 CFO 도현 · 다인', category: 'person', showAtDefault: false, note: '재무·BM·ERP 손익 및 BI 데이터 분석' },
        { label: '🎮 게임개발 루카', category: 'person', showAtDefault: false, note: 'Unity C# 2D/3D 게임 로직 및 달빛 숲 개발' },
        { label: '📖 출판에디터 서아', category: 'person', showAtDefault: false, note: '도서 기획·원고 교정·인디자인·EPUB 유통' },
        { label: '🎵 프로듀서 제이·은우', category: 'person', showAtDefault: false, note: '음악 AI 앨범 프로듀싱 및 작사·비주얼' }
      ]
    },
    {
      id: 'hub-skills',
      label: '스킬 뉴런 (90+ Skills)',
      subtitle: '05.BSC_Skill_Warehouse & Antigravity 핵심 스킬망',
      area: '05.BSC_Skill_Warehouse',
      kind: 'skill',
      category: 'topic',
      color: '#818cf8',
      hx: 175, hy: 110, hz: -20,
      previewImg: '/props/tycoon-scene-4-meeting.jpg',
      workspaceTarget: 'SETTINGS_WORKSPACE',
      note: '옵시디언 스킬 뉴런 클러스터: 문서 교정, 전자책 빌드, 코드 품질 게이트, 시맨틱 검색, 블렌더 3D 등 90+개 실행 스킬',
      neurons: [
        { label: '⚡ bsc-skill-factory', category: 'topic', showAtDefault: true, note: '아이디어를 마스터 SKILL.md로 자동 제조하는 스킬 공장' },
        { label: '🔍 semantic-knowledge-search', category: 'topic', showAtDefault: true, note: '로컬 임베딩 + BM25 하이브리드 0.1초 초고속 지식 검색' },
        { label: '📌 micro-knowledge-query', category: 'topic', showAtDefault: true, note: '전사 문서 중 핵심 팩트 3~5줄 핀셋 추출 (토큰 99.8% 절감)' },
        { label: '🛡️ code-quality-gate', category: 'topic', showAtDefault: true, note: '린트·타입·빌드·보안 취약점 0.1초 전수 검사 게이트' },
        { label: '🔒 core-lock-guard', category: 'topic', showAtDefault: false, note: '본사 데이터 무단 수정 및 0-Byte 유실 100% 차단' },
        { label: '📝 doc-proofreader-pro', category: 'topic', showAtDefault: true, note: 'Word(.docx) 변경추적 및 국립국어원 3단 대조표 교정·교열' },
        { label: '📚 epub-zero-builder', category: 'topic', showAtDefault: true, note: '원고를 비용 0원으로 EPUB 3.0 전자책 원클릭 빌드·검증' },
        { label: '🎨 blender-artisan', category: 'topic', showAtDefault: false, note: '블렌더 4.x/5.x 절차적 모델링 & Cycles 시네마틱 렌더링' },
        { label: '🎬 cinematic-scroll', category: 'topic', showAtDefault: false, note: '3D 틸트·패럴랙스·스크롤텔링 하이엔드 웹 제작 스킬' },
        { label: '💎 premium-web-design', category: 'topic', showAtDefault: false, note: '1억 원급 하이엔드 대시보드 & 인지 마찰 제로 디자인' },
        { label: '🚀 fast-data-sync', category: 'topic', showAtDefault: false, note: 'Robocopy 32스레드 무손실 초고속 백업·증분 동기화' },
        { label: '✅ work-finalizer', category: 'topic', showAtDefault: false, note: '일일 작업일지 검수 · Git 커밋/푸시 · 자동 퇴근 패키징' },
        { label: '🌐 웹 자료 조사 스킬', category: 'topic', showAtDefault: true, note: '실시간 다중 출처 수집·요약·뉴스레터 초안 생성' },
        { label: '📄 6종 문서 자동 변환', category: 'doc', showAtDefault: true, note: 'MD, Word, PPT, PDF, PNG, 영상 즉시 생성' },
        { label: '✋ HOLO 21관절 에어터치', category: 'idea', showAtDefault: false, note: 'MediaPipe 웹캠 손동작 인식 및 제스처 제어' }
      ]
    },
    {
      id: 'hub-projects',
      label: '우리 프로젝트 (52 Projects)',
      subtitle: '02.BSC_Branch · 지점 및 실무 프로젝트 뉴런',
      area: '02.BSC_Branch',
      kind: 'project',
      category: 'project',
      color: '#00f0ff',
      hx: -185, hy: 95, hz: 25,
      previewImg: '/props/preview-brand-beyond.jpg',
      workspaceTarget: 'BSC_OS_WORKSPACE',
      note: '현재 C:\\BeausCreators 및 c:\\BSC_Javis_OS에서 가동 중인 52개 실무 프로젝트 클러스터',
      neurons: [
        { label: '🌌 BSC_Javis_OS', category: 'project', showAtDefault: true, note: '자비스 성운 은하 & SD 캐릭터 타이쿤 오피스 통합 OS' },
        { label: '🖥️ UXUI_Web_OS', category: 'project', showAtDefault: true, note: '차세대 웹 OS 인터페이스 및 반응형 디자인 시스템' },
        { label: '🎮 Games (달빛 숲)', category: 'project', showAtDefault: true, note: '유니티 2D/3D 게임 스튜디오 & 신규 지역 달빛 숲 프로젝트' },
        { label: '📱 Applications', category: 'project', showAtDefault: true, note: '모바일·데스크톱 실무 애플리케이션 제품군' },
        { label: '⚙️ Jarvis_Engine', category: 'project', showAtDefault: false, note: '자비스 코어 추론 및 멀티모달 브릿지 엔진' },
        { label: '🥗 NUTRI OS (영양사)', category: 'project', showAtDefault: false, note: 'Soft Nature 에디션 영양사 대시보드 프로그램' },
        { label: '🏃 FetchFit / RunNow', category: 'project', showAtDefault: false, note: '피트니스 & 러닝 트래커 모바일 앱 프로젝트' },
        { label: '🎓 Classes (IT 멘토링)', category: 'project', showAtDefault: false, note: 'AI·최신 논문 한국어 강의 및 실습 교재 파이프라인' },
        { label: '🧪 sandbox 실험실', category: 'idea', showAtDefault: false, note: '신규 프로토타입 검증 및 하네스 샌드박스' }
      ]
    },
    {
      id: 'hub-sopoong',
      label: '소풍 홈페이지',
      subtitle: '바다를 더 가까이, 소풍 FISHING (00.소풍)',
      area: '02.BSC_Branch',
      kind: 'project',
      category: 'project',
      color: '#38bdf8',
      hx: -230, hy: -90, hz: 35,
      previewImg: '/props/sopoong-boat.jpg',
      workspaceTarget: 'BSC_OS_WORKSPACE',
      note: '소풍 피싱(Sopoong Fishing) 브랜드 홈페이지 및 선단 ERP·예약·물때표 통합 프로젝트 (진행률 60%)',
      neurons: [
        { label: '⛵ 선박 소개 · 제원', category: 'doc', showAtDefault: true, note: '소풍호 안전 장비 및 편의시설 안내 페이지' },
        { label: '📅 실시간 예약 · 물때표', category: 'topic', showAtDefault: true, note: '해운 에이전트 조석표·기상 연동 출조 예약' },
        { label: '🎨 노을 컨셉 디자인 시안', category: 'doc', showAtDefault: true, note: '김태오 BX 디자이너 & 서윤 PM 1차 시안' },
        { label: '🐟 비정형 발주 파싱 (해리)', category: 'topic', showAtDefault: false, note: '카톡·문자 수기 발주를 정규 SKU로 자동 변환' },
        { label: '📦 규격·옵션 매트릭스 (정호)', category: 'topic', showAtDefault: false, note: '호수·무게·색상별 재고 균형 및 번들링' },
        { label: '💰 선단 여신·수금 (도진)', category: 'topic', showAtDefault: false, note: '미수금 리스크 방어 및 골든타임 알림' },
        { label: '📸 조황 갤러리 · 후기', category: 'idea', showAtDefault: false, note: '출조 포트폴리오 및 고객 리뷰 아카이브' }
      ]
    },
    {
      id: 'hub-antigravity-ide',
      label: '안티그래비티 2.0 · IDE',
      subtitle: '실시간 IDE 대화 세션(10개) & 아티팩트 뉴런',
      area: 'IDE Live Brain',
      kind: 'run',
      category: 'doc',
      color: '#22d3ee',
      hx: -75, hy: -165, hz: -15,
      previewImg: '/props/tycoon-scene-2-research.jpg',
      workspaceTarget: 'BSC_OS_WORKSPACE',
      note: '안티그래비티 2.0(Antigravity 2.0) 및 IDE에서 대표님이 대화하시는 모든 실시간 트랜스크립트와 프로젝트 컨텍스트',
      neurons: [
        { label: '💬 현재 IDE 실시간 대화', category: 'doc', showAtDefault: true, note: '7c26bd17 세션: 자비스 디자인 & 옵시디언 뉴런 개편' },
        { label: '🕹️ 타이쿤 시안 세션 (885af)', category: 'doc', showAtDefault: true, note: 'SD 캐릭터·배경·오브젝트 시안 및 B안 병합 구조 논의' },
        { label: '🎯 /goal 자율완성 세션 (e4c29)', category: 'doc', showAtDefault: true, note: '전체 기능 오류 검토 및 최종 보고서 자동 제출 세션' },
        { label: '📋 implementation_plan.md', category: 'doc', showAtDefault: false, note: '안티그래비티 2.0 아키텍처 설계 및 구현 계획서' },
        { label: '✅ walkthrough.md 검증록', category: 'doc', showAtDefault: false, note: '단계별 구현 결과 및 시각적 검증 리포트' },
        { label: '🔄 IDE ↔ 자비스 양방향 브릿지', category: 'topic', showAtDefault: true, note: 'transcript.jsonl 실시간 파싱 및 두뇌 컨텍스트 주입' }
      ]
    },
    {
      id: 'hub-bsc-hq',
      label: 'BSC HQ 본사 지식망',
      subtitle: '01.BSC_HQ · 가이드라인 · 지식창고 · 보고서 · 작업일지',
      area: '01.BSC_HQ',
      kind: 'area',
      category: 'doc',
      color: '#c084fc',
      hx: 80, hy: -160, hz: 20,
      previewImg: '/props/preview-beaus-sunset.jpg',
      workspaceTarget: 'DOC_WORKSPACE',
      note: 'BeausCreators 중앙 본사(01.BSC_HQ) 헌장, 6.Knowledge_Index, 01.보고서, 02.작업일지 SSOT 뉴런',
      neurons: [
        { label: '📜 AGENTS.md 전사 헌장', category: 'doc', showAtDefault: true, note: '데이터 유실 방지 및 CHL(Context·Harness·Loop) 원칙' },
        { label: '🧠 6.Knowledge_Index', category: 'doc', showAtDefault: true, note: '전사 아키텍처 인사이트 및 베스트 레퍼런스 금고' },
        { label: '📊 01.보고서 보관함', category: 'doc', showAtDefault: true, note: '날짜별 대표님 승인 보고서 및 회의록 아카이브' },
        { label: '📝 02.작업일지 (WorkLog)', category: 'doc', showAtDefault: true, note: '프로젝트별 분할 기록되는 일일 실시간 작업 일지' },
        { label: '✝️ Coram Deo & Together', category: 'idea', showAtDefault: false, note: '청지기 정신과 정직한 팩트 기반 동역 세계관' }
      ]
    },
    {
      id: 'hub-publisher-os',
      label: '출판사 OS · 한 제1장',
      subtitle: '04.Publisher · 도서출판 아름다운 세상 & 오리지널 IP',
      area: '04.Publishing',
      kind: 'project',
      category: 'project',
      color: '#fbbf24',
      hx: 235, hy: -80, hz: -10,
      previewImg: '/props/preview-moonlit-forest.jpg',
      workspaceTarget: 'DOC_WORKSPACE',
      note: '출판사 OS(PublishingOS) 자동 교정·전자책 빌드 파이프라인 및 오리지널 서사 IP [한 제1장]',
      neurons: [
        { label: '📖 한(恨) 제1장 원고', category: 'doc', showAtDefault: true, note: '오리지널 스토리 세계관 설정·인물 관계도·초안' },
        { label: '🏢 PublishingOS 코어', category: 'project', showAtDefault: true, note: '원고 접수부터 교정·조판·유통까지 출판 자동화 OS' },
        { label: '🔍 국립국어원 3단 교정표', category: 'doc', showAtDefault: true, note: '서식 100% 보존 Track Changes 및 Diff 리포트' },
        { label: '📱 EPUB 3.0 전자책 빌드', category: 'topic', showAtDefault: false, note: '유효성 자동 검증 및 유통 메타데이터 패키징' },
        { label: '📕 Imprints & 표지 시안', category: 'idea', showAtDefault: false, note: '임프린트 브랜드 관리 및 북커버 디자인' }
      ]
    },
    {
      id: 'hub-research',
      label: '연구 · Harness² · REA',
      subtitle: '03.Research · Google Harness² · 역공학 · 바이오',
      area: '03.Research',
      kind: 'note',
      category: 'ext',
      color: '#34d399',
      hx: -15, hy: 165, hz: -30,
      previewImg: '/props/tycoon-scene-3-ceo.jpg',
      workspaceTarget: 'DOC_WORKSPACE',
      note: 'Google Research Harness² 재귀 아키텍처, REA 유니티/바이너리 역공학, Laya 통합, AlphaFold 단백질 연구 클러스터',
      neurons: [
        { label: '🧬 Google Harness² 엔진', category: 'ext', showAtDefault: true, note: 'Propose-Probe-Compose & Experience Library R 재귀 진화' },
        { label: '🛠️ REA 유니티·바이너리 역공학', category: 'ext', showAtDefault: true, note: 'Ghidra·ILSpy·Il2CppDumper 기반 C#/네이티브 역공학' },
        { label: '⚡ Laya_Unity_Integration', category: 'project', showAtDefault: true, note: 'Laya-421M 초저지연 라우터 및 유니티 엔진 연동 연구' },
        { label: '🌐 해외 112개 자비스 레퍼런스', category: 'ext', showAtDefault: false, note: '글로벌 오픈소스 자비스 아키텍처 비교 분석' },
        { label: '🧪 AlphaFold 단백질 3D 구조', category: 'ext', showAtDefault: false, note: '생체분자 pLDDT 신뢰도 및 도메인 구조 분석' }
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
    const palette = ['#ffffff', '#38bdf8', '#c084fc', '#fbbf24', '#34d399', '#818cf8'];
    for (let i = 0; i < 200; i++) {
      this.starDust.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1000,
        z: (Math.random() - 0.5) * 800,
        r: Math.random() * 1.3 + 0.3,
        alpha: Math.random() * 0.45 + 0.12,
        color: palette[i % palette.length],
        phase: Math.random() * Math.PI * 2
      });
    }
  },

  async loadBrainData() {
    try {
      const [brainRes, syncRes] = await Promise.all([
        fetch('/api/brain'),
        fetch('/api/jarvis/ide-project-sync').catch(() => null)
      ]);
      const data = await brainRes.json();
      const syncData = syncRes ? await syncRes.json().catch(() => null) : null;

      const rawNodes = data.nodes || [];
      const rawLinks = data.links || [];

      this.buildObsidianNeuralGalaxy(rawNodes, rawLinks, syncData);

      // Update Vault Stats
      const statNodes = document.getElementById('stat-nodes');
      const statLinks = document.getElementById('stat-links');
      const cntAll = document.getElementById('cnt-all');
      if (statNodes) statNodes.textContent = `${this.nodes.length} neurons`;
      if (statLinks) statLinks.textContent = `${this.links.length} synapses`;
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

      this.renderTopHubs();
      this.computeLayoutTargets();

      // Default select '소풍 홈페이지' or 'AI 오피스'
      const defaultHub = this.nodes.find(n => n.id === 'hub-sopoong') || this.nodes[0];
      if (defaultHub) {
        this.selectedNode = defaultHub;
        this.syncNodePreviewCard(defaultHub);
      }
    } catch (e) {
      console.error('Failed to load brain graph:', e);
    }
  },

  buildObsidianNeuralGalaxy(rawNodes, rawLinks, syncData) {
    const categoryColorMap = {
      project: '#00f0ff', // 프로젝트 (Cyan)
      doc: '#38bdf8',     // 문서 (Sky Blue)
      person: '#fbbf24',  // 사람/에이전트 (Amber)
      topic: '#a855f7',   // 스킬/주제 (Purple)
      idea: '#34d399',    // 아이디어 (Emerald)
      ext: '#f472b6'      // 연구/외부 자료 (Pink)
    };

    this.nodes = [];
    this.links = [];
    const idToIdx = new Map();

    // 1. Create the 8 Core Neural Hubs & their Primary Named Neurons (Projects, Skills, Agents, IDE Sessions)
    this.neuralClusters.forEach((hub, hOrder) => {
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
        r: hub.id === 'hub-ai-office' ? 11.5 : 9.6,
        hx: hub.hx,
        hy: hub.hy,
        hz: hub.hz,
        x: hub.hx,
        y: hub.hy,
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

      const nCount = hub.neurons.length;
      hub.neurons.forEach((nr, cIdx) => {
        const ringLayer = cIdx < 6 ? 1 : 2;
        const angle = (cIdx / nCount) * Math.PI * 2 + hOrder * 0.52;
        const radius = ringLayer === 1 ? (52 + (cIdx % 3) * 14) : (84 + (cIdx % 4) * 14);
        const cx = hub.hx + Math.cos(angle) * radius;
        const cy = hub.hy + Math.sin(angle) * radius * 0.88;
        const cz = hub.hz + Math.sin(angle * 2.2) * 32;
        const nodeIdx = this.nodes.length;
        const cId = `${hub.id}-neuron-${cIdx}`;

        this.nodes.push({
          idx: nodeIdx,
          id: cId,
          label: nr.label,
          subtitle: `${hub.label} · ${nr.label}`,
          area: hub.area,
          kind: 'note',
          category: nr.category || hub.category,
          isFeaturedChild: true,
          showAtDefault: Boolean(nr.showAtDefault),
          parentHubId: hub.id,
          parentHubIdx: hubIdx,
          color: categoryColorMap[nr.category] || hub.color,
          r: nr.showAtDefault ? 4.8 : 3.8,
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
          note: nr.note,
          path: `C:\\BeausCreators`
        });
        idToIdx.set(cId, nodeIdx);

        // Primary dendrite link to Hub
        this.links.push({ s: hubIdx, t: nodeIdx, isConstellationRay: true, color: hub.color });
        // Lateral Obsidian web links between adjacent neurons in the same cluster
        if (cIdx > 0) {
          this.links.push({ s: nodeIdx - 1, t: nodeIdx, isLateralSynapse: true, color: hub.color });
        }
        if (cIdx >= 3) {
          this.links.push({ s: nodeIdx - 3, t: nodeIdx, isLateralSynapse: true, color: hub.color });
        }
      });
    });

    // 2. Inject Dynamic Live Antigravity 2.0 Conversations & Discovered Projects if available
    if (syncData && Array.isArray(syncData.ideConversations)) {
      const ideHubIdx = idToIdx.get('hub-antigravity-ide');
      const ideHub = this.nodes[ideHubIdx];
      syncData.ideConversations.slice(0, 6).forEach((conv, idx) => {
        const ang = (idx / 6) * Math.PI * 2 + 0.3;
        const rad = 68 + (idx % 2) * 20;
        const nx = ideHub.hx + Math.cos(ang) * rad;
        const ny = ideHub.hy + Math.sin(ang) * rad * 0.85;
        const nz = ideHub.hz + (idx - 3) * 14;
        const nIdx = this.nodes.length;
        const lastMsg = conv.recentUserRequests?.length
          ? conv.recentUserRequests[conv.recentUserRequests.length - 1].text
          : conv.title;

        this.nodes.push({
          idx: nIdx,
          id: `live-ide-${conv.conversationId}`,
          label: `💻 ${conv.title.slice(0, 18)}`,
          subtitle: `Antigravity 2.0 (${conv.workspacePath})`,
          area: 'IDE Live Brain',
          kind: 'run',
          category: 'doc',
          isFeaturedChild: true,
          showAtDefault: idx < 2,
          parentHubIdx: ideHubIdx,
          color: '#22d3ee',
          r: 4.4,
          hx: nx, hy: ny, hz: nz,
          x: nx, y: ny, z: nz,
          tx: nx, ty: ny, tz: nz,
          previewImg: '/props/tycoon-scene-2-research.jpg',
          workspaceTarget: 'BSC_OS_WORKSPACE',
          note: `[실시간 IDE 대화] "${lastMsg}"`,
          path: conv.workspacePath
        });
        this.links.push({ s: ideHubIdx, t: nIdx, isConstellationRay: true, color: '#22d3ee' });
      });
    }

    // 3. Connect the 8 Neural Hubs & Cross-Cluster Synapses (Creates the central Obsidian Neural Web!)
    const hubIds = this.neuralClusters.map(h => idToIdx.get(h.id));
    for (let i = 0; i < hubIds.length; i++) {
      for (let j = i + 1; j < hubIds.length; j++) {
        if (i === 0 || (i + j) % 2 === 0 || Math.abs(i - j) === 1) {
          this.links.push({ s: hubIds[i], t: hubIds[j], isBackbone: true, color: '#38bdf8' });
        }
      }
    }

    // Cross-cluster neural bridges between related project/skill/agent neurons
    const totalFeatured = this.nodes.length;
    for (let i = 1; i < totalFeatured; i += 4) {
      const targetIdx = (i * 7 + 13) % totalFeatured;
      if (targetIdx !== i) {
        this.links.push({
          s: i,
          t: targetIdx,
          isCrossSynapse: true,
          color: this.nodes[i].color
        });
      }
    }

    // 4. Populate the 700+ Vault Knowledge Nodes in organic Obsidian rings around their matching domain hubs
    const hubCenters = this.neuralClusters;
    rawNodes.forEach((rn, i) => {
      // Map raw node area to the closest neural cluster
      let hubOrder = i % hubCenters.length;
      const areaStr = String(rn.area || '');
      if (areaStr.includes('Agents') || areaStr.includes('Roster')) hubOrder = 0;
      else if (areaStr.includes('Skill')) hubOrder = 1;
      else if (areaStr.includes('Branch')) hubOrder = i % 2 === 0 ? 2 : 3;
      else if (areaStr.includes('IDE')) hubOrder = 4;
      else if (areaStr.includes('Guidelines') || areaStr.includes('Knowledge') || areaStr.includes('Documents')) hubOrder = 5;
      else if (areaStr.includes('Publishing')) hubOrder = 6;
      else if (areaStr.includes('Research')) hubOrder = 7;

      const assignedHub = hubCenters[hubOrder];
      const parentIdx = idToIdx.get(assignedHub.id);
      const angle = i * 2.39996; // Golden angle spiral (Obsidian force-cluster distribution)
      const dist = 34 + Math.sqrt(i % 65) * 14.5;
      const bx = assignedHub.hx + Math.cos(angle) * dist;
      const by = assignedHub.hy + Math.sin(angle) * dist * 0.88;
      const bz = assignedHub.hz + Math.cos(i * 0.65) * 58;

      const cats = ['project', 'doc', 'person', 'topic', 'idea', 'ext'];
      const cat = rn.category || cats[i % cats.length];
      const nIdx = this.nodes.length;

      this.nodes.push({
        ...rn,
        idx: nIdx,
        category: cat,
        parentHubIdx: parentIdx,
        color: categoryColorMap[cat] || assignedHub.color,
        r: Math.min(3.4, Math.max(2.0, (rn.r || 3) * 0.62)),
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

      // Connect every vault node into the Obsidian neural web so no nodes float disconnected
      if (parentIdx !== undefined) {
        if (i % 2 === 0) {
          this.links.push({ s: parentIdx, t: nIdx, color: assignedHub.color });
        } else if (nIdx > totalFeatured + 2) {
          this.links.push({ s: nIdx - 2, t: nIdx, color: assignedHub.color });
        }
      }
    });

    rawLinks.forEach(l => {
      const s = idToIdx.get(l.source || l.s);
      const t = idToIdx.get(l.target || l.t);
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

    // Initialize traveling neural action-potential pulses along primary links
    this.synapsePulses = [];
    const rayLinks = this.links.filter(l => l.isConstellationRay || l.isBackbone || l.isCrossSynapse);
    for (let i = 0; i < Math.min(45, rayLinks.length); i++) {
      this.synapsePulses.push({
        link: rayLinks[(i * 5) % rayLinks.length],
        t: Math.random(),
        speed: 0.004 + Math.random() * 0.006
      });
    }
  },

  renderTopHubs() {
    const listEl = document.getElementById('top-hubs-list');
    if (!listEl) return;

    let html = `
      <div class="hub-item ${!this.activeAreaFilter ? 'active' : ''}" data-area="">
        <span class="dot" style="background:#00f0ff"></span>
        <span class="name">전체 지식 뉴런 (${this.nodes.length})</span>
        <span class="cnt">${this.links.length}</span>
      </div>
    `;

    this.neuralClusters.forEach(hub => {
      html += `
        <div class="hub-item" data-hub-id="${hub.id}">
          <span class="dot" style="background:${hub.color}"></span>
          <span class="name">${hub.label}</span>
          <span class="cnt">${hub.neurons.length}</span>
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
        n.tx = (n.hx || 0) * 1.18 * spread;
        n.ty = (n.hy || 0) * 1.18 * spread;
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
    const bgGrad = ctx.createRadialGradient(W * 0.54, H * 0.48, 40, W * 0.52, H * 0.5, Math.max(W, H) * 0.78);
    bgGrad.addColorStop(0, '#0a1428');
    bgGrad.addColorStop(0.48, '#060c1a');
    bgGrad.addColorStop(1, '#03060d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle Nebula Glow around each Neural Cluster Hub
    for (const n of this.nodes) {
      if (!n.isFeaturedHub || !n.sx) continue;
      const nebR = (n.id === 'hub-ai-office' ? 185 : 140) * (n.scale || 1);
      const g = ctx.createRadialGradient(n.sx, n.sy, 4, n.sx, n.sy, nebR);
      g.addColorStop(0, (n.color || '#00f0ff') + '24');
      g.addColorStop(0.5, (n.color || '#00f0ff') + '0a');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, nebR, 0, Math.PI * 2);
      ctx.fill();
    }

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
    const haloR = radius * (isSelected ? 4.2 : 3.2);
    const g = ctx.createRadialGradient(x, y, radius * 0.2, x, y, haloR);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.28, color);
    g.addColorStop(0.65, color + '44');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, haloR, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = isSelected ? 1.8 : 1.25;
    const spikeLen = radius * (isSelected ? 3.0 : 2.2);
    ctx.beginPath();
    ctx.moveTo(-spikeLen, 0);
    ctx.lineTo(spikeLen, 0);
    ctx.moveTo(0, -spikeLen);
    ctx.lineTo(0, spikeLen);
    ctx.stroke();

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
      this.rotY += 0.00085;
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

    // 1. Draw Obsidian Neural Synapse Links
    for (const l of this.links) {
      const a = this.nodes[l.s];
      const b = this.nodes[l.t];
      if (!a || !b || !this.isNodeVisible(a) || !this.isNodeVisible(b)) continue;

      const isHighlighted = focusSet && focusSet.has(a.idx) && focusSet.has(b.idx);
      if (focusSet && !isHighlighted && this.focusMode) continue;

      if (l.isConstellationRay) {
        ctx.lineWidth = isHighlighted ? 1.6 : 1.05;
        ctx.strokeStyle = isHighlighted ? (l.color || '#00f0ff') + 'dd' : (l.color || '#38bdf8') + '58';
      } else if (l.isBackbone) {
        ctx.lineWidth = isHighlighted ? 1.5 : 1.0;
        ctx.strokeStyle = isHighlighted ? 'rgba(0, 240, 255, 0.75)' : 'rgba(125, 211, 252, 0.25)';
      } else if (l.isLateralSynapse || l.isCrossSynapse) {
        ctx.lineWidth = 0.85;
        ctx.strokeStyle = isHighlighted ? (l.color || '#00f0ff') + 'aa' : (l.color || '#60a5fa') + '2c';
      } else {
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = isHighlighted ? 'rgba(56, 189, 248, 0.65)' : 'rgba(148, 163, 184, 0.17)';
      }

      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    // 2. Draw Traveling Synapse Action-Potential Pulses
    for (const sp of this.synapsePulses) {
      sp.t = (sp.t + sp.speed) % 1.0;
      const a = this.nodes[sp.link.s];
      const b = this.nodes[sp.link.t];
      if (!a || !b || !this.isNodeVisible(a) || !this.isNodeVisible(b)) continue;
      const px = a.sx + (b.sx - a.sx) * sp.t;
      const py = a.sy + (b.sy - a.sy) * sp.t;
      ctx.fillStyle = sp.link.color || '#00f0ff';
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(px, py, 2.0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 3. Draw Neuron Nodes & Obsidian Smart Labels sorted back-to-front
    this._placedLabelBoxes = [];
    const sorted = [...this.nodes].sort((a, b) => b.depth - a.depth);
    for (const n of sorted) {
      if (!this.isNodeVisible(n)) continue;
      const inFocus = !focusSet || focusSet.has(n.idx);
      if (!inFocus && this.focusMode) continue;

      const radius = Math.max(2.0, n.r * n.scale);
      const isDirectTarget = n === this.selectedNode || n === this.hoveredNode;

      if (n.isFeaturedHub) {
        ctx.globalAlpha = 1.0;
        this.drawStarburstFlare(ctx, n.sx, n.sy, radius, n.color, isDirectTarget);
      } else if (n.isFeaturedChild) {
        ctx.globalAlpha = inFocus ? 0.96 : 0.62;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '38';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = isDirectTarget ? '#00f0ff' : '#ffffff';
        ctx.fill();
      } else {
        // Obsidian Vault Knowledge Neurons (clearly visible & interactive)
        ctx.globalAlpha = inFocus ? 0.78 : 0.36;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color || '#38bdf8';
        ctx.fill();
      }

      // Obsidian LOD Label Rendering:
      // Shows all 8 Hubs + default Featured Neurons + any hovered/focused neighbors + more neurons as you zoom in
      const shouldShowLabel =
        n.isFeaturedHub ||
        isDirectTarget ||
        (n.isFeaturedChild && (n.showAtDefault || inFocus || this.zoom > 1.15)) ||
        (focusSet && focusSet.has(n.idx)) ||
        (this.zoom > 1.38 && inFocus);

      if (shouldShowLabel) {
        const labelText = n.label.slice(0, 24);
        const isHub = n.isFeaturedHub;
        const fontSize = isHub ? 13.5 : isDirectTarget ? 12 : 10.8;
        ctx.font = `${isHub || isDirectTarget ? '700' : '500'} ${fontSize}px Pretendard, -apple-system, sans-serif`;
        const estW = ctx.measureText(labelText).width + 10;
        const estH = fontSize + 5;
        const lx = isHub ? n.sx - estW / 2 : n.sx + radius + 5;
        const ly = isHub ? n.sy + radius * 2.1 + 3 : n.sy - fontSize / 2;

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
          ctx.globalAlpha = isHub || isDirectTarget ? 1.0 : 0.90;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
          ctx.shadowBlur = 5;
          ctx.fillStyle = isHub ? '#ffffff' : isDirectTarget ? '#00f0ff' : '#e2e8f0';
          ctx.fillText(labelText, isHub ? n.sx - (estW - 10) / 2 : n.sx + radius + 5, isHub ? n.sy + radius * 2.1 + fontSize : n.sy + 3.5);
          ctx.shadowBlur = 0;
        }
      }
    }
    ctx.globalAlpha = 1.0;

    requestAnimationFrame(() => this.animate());
  },

  findNodeAt(x, y) {
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (!this.isNodeVisible(n)) continue;
      const hitPad = n.isFeaturedHub ? 18 : n.isFeaturedChild ? 9 : 5;
      const r = Math.max(7, n.r * (n.scale || 1) + hitPad);
      const dx = n.sx - x;
      const dy = n.sy - y;
      if (dx * dx + dy * dy <= r * r) return n;
    }
    return null;
  },

  syncNodePreviewCard(node) {
    if (!node) return;
    const titleEl = document.getElementById('np-card-title');
    const subEl = document.getElementById('np-card-sub');
    const imgEl = document.getElementById('np-card-img');
    const badgeEl = document.getElementById('np-card-badge');

    if (titleEl) titleEl.textContent = node.label;
    if (subEl) subEl.textContent = node.subtitle || node.note || 'BSC J.A.R.V.I.S. 지식 뉴런 노드';
    if (imgEl && node.previewImg) imgEl.src = node.previewImg;
    if (badgeEl) {
      badgeEl.textContent = node.area || 'OBSIDIAN NEURON';
      badgeEl.style.color = node.color || '#00f0ff';
    }
  },

  selectNode(node, openWindow = false) {
    this.selectedNode = node;
    const inspEl = document.getElementById('inspector-content');
    const actEl = document.getElementById('inspector-actions');

    if (!node) return;

    this.syncNodePreviewCard(node);

    const nbrCount = (this.neighbors.get(node.idx) || new Set()).size;
    if (inspEl) {
      inspEl.innerHTML = `
        <div style="color:${node.color};font-weight:800;font-size:13px;margin-bottom:4px;">${node.label}</div>
        <div style="font-size:10.5px;color:#38bdf8;font-family:monospace;margin-bottom:6px;">[${node.area}] · ${nbrCount} synapses</div>
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
    this.camX = 40 - node.x * 0.55;
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
      this.zoom = Math.max(0.4, Math.min(3.5, this.zoom * factor));
    }, { passive: false });

    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.setViewMode(btn.dataset.view));
    });

    document.getElementById('btn-toggle-2d3d')?.addEventListener('click', () => {
      this.setViewMode(this.viewMode === '2d' ? '3d' : '2d');
    });

    document.getElementById('btn-bottom-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(3.5, this.zoom * 1.18);
    });
    document.getElementById('btn-bottom-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.4, this.zoom * 0.84);
    });
    document.getElementById('btn-bottom-fit')?.addEventListener('click', () => {
      this.camX = 40;
      this.camY = 0;
      this.zoom = 1.04;
      this.rotX = 0.12;
      this.rotY = -0.15;
      this.autoRotate = true;
    });

    document.getElementById('btn-fit-graph')?.addEventListener('click', () => {
      this.camX = 40;
      this.camY = 0;
      this.zoom = 1.04;
      this.rotX = 0.12;
      this.rotY = -0.15;
      this.autoRotate = true;
    });

    document.getElementById('btn-replay-growth')?.addEventListener('click', () => {
      this.replayProgress = 0.02;
    });

    document.getElementById('btn-open-node-report')?.addEventListener('click', () => {
      if (this.selectedNode) this.openNodeInReportWindow(this.selectedNode);
    });
    document.getElementById('btn-fly-node')?.addEventListener('click', () => {
      if (this.selectedNode) this.flyToNode(this.selectedNode);
    });

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

    document.getElementById('slider-repel')?.addEventListener('input', e => {
      this.repelStrength = Number(e.target.value);
      this.computeLayoutTargets();
    });
    document.getElementById('slider-link-len')?.addEventListener('input', e => {
      this.linkDistance = Number(e.target.value);
      this.computeLayoutTargets();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.BrainGraphEngine.init();
});
