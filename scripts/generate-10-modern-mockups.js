/**
 * ============================================================================
 * ☀️ BSC J.A.R.V.I.S. OS — 10 Simple, Monotone, Bright Minimal Dashboard Mockups
 * ============================================================================
 * 대표님 지침: "너무 파랑색 같은 디자인이고 너무 보기 불편한 것 같아.
 *              더 단순하고 단조롭고 밝은 느낌의 디자인이 있으면 좋겠어."
 * - Palette: Pure White (#FFFFFF), Soft Warm Alabaster (#F5F6F8),
 *            Hairline Gray (#E5E7EB), Matte Charcoal (#18181B), Neutral Gray (#6B7280)
 * - No blue/neon clutter; ultra-clean Notion / Apple Light / Toss / Linear Light aesthetic.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const WORKSPACE_DIR = path.resolve(__dirname, '..');
const PUBLIC_MOCKUP_DIR = path.join(WORKSPACE_DIR, 'public', 'data', 'design_mockups');
const ARTIFACT_DIR = 'C:/Users/USER/.gemini/antigravity/brain/7c26bd17-dac9-4f38-b441-ab8f0a5bbf8c';

fs.mkdirSync(PUBLIC_MOCKUP_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];
const EDGE_EXE = EDGE_CANDIDATES.find(p => fs.existsSync(p));

function buildLightMinimalFrame({ screenNum, badge, navActive, title, subtitle, kpis, bodyHtml, rightDrawerHtml = '', floatingModalHtml = '' }) {
  const dockItems = [
    { id: 'HOME', icon: '🧠', label: '뉴런홈' },
    { id: 'ECO', icon: '📂', label: '지식폴더' },
    { id: 'IDE', icon: '📄', label: '문서·IDE' },
    { id: 'BRAIN', icon: '🤖', label: '두뇌·도구' },
    { id: 'ARTCRAFT', icon: '🎨', label: 'ArtCraft' },
    { id: 'OFFICE', icon: '🏛️', label: '회의·조직' },
    { id: 'SETTINGS', icon: '⚙️', label: '설정·검증' }
  ];

  const topTabs = [
    { id: 'HOME', label: '🧠 뉴런홈 복귀' },
    { id: 'ECO', label: '📂 지식폴더' },
    { id: 'IDE', label: '📄 문서 · IDE' },
    { id: 'BRAIN', label: '🤖 AI 두뇌 · 도구' },
    { id: 'ARTCRAFT', label: '🎨 ArtCraft 제어' },
    { id: 'OFFICE', label: '🏛️ 회의 · 조직' },
    { id: 'SETTINGS', label: '⚙️ 설정 · 검증' }
  ];

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background: #f4f5f7;
    color: #18181b;
    font-family: 'Pretendard', 'Malgun Gothic', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
  }
  /* Top Global Header Bar (Bright Minimal White) */
  .top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 56px;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    z-index: 10;
  }
  .brand-row { display: flex; align-items: center; gap: 10px; }
  .logo-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #18181b;
  }
  .brand-title { font-weight: 800; font-size: 14.5px; letter-spacing: -0.01em; color: #111827; }
  .design-pill {
    font-size: 11px; font-weight: 600; color: #4b5563;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    padding: 3px 10px; border-radius: 999px;
  }
  .search-capsule {
    width: 500px; height: 36px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 14px; font-size: 12px; color: #6b7280;
  }
  .top-right { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #374151; }
  .top-chip {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    padding: 5px 11px; border-radius: 8px; font-size: 11.5px; font-weight: 600; color: #374151;
  }
  /* Left Slim Dock (Clean White Card) */
  .left-dock {
    position: absolute;
    top: 72px; left: 16px; bottom: 72px;
    width: 68px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    display: flex; flex-direction: column; align-items: center;
    padding: 12px 6px; gap: 6px;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  }
  .dock-btn {
    width: 54px; height: 54px;
    border-radius: 12px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 4px; color: #6b7280; font-size: 10px; font-weight: 600;
  }
  .dock-btn .ico { font-size: 17px; }
  .dock-btn.active {
    background: #18181b;
    color: #ffffff; font-weight: 700;
  }
  /* Main Dashboard Stage */
  .bento-stage {
    position: absolute;
    top: 72px; left: 98px; right: 20px; bottom: 72px;
    background: #f8f9fa;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    padding: 22px 26px;
    display: flex; flex-direction: column; gap: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    z-index: 5;
    overflow: hidden;
  }
  .stage-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
  }
  .sh-badge {
    display: inline-block;
    font-size: 10.5px; font-weight: 700; color: #4b5563;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    padding: 3px 9px; border-radius: 6px; margin-bottom: 5px;
  }
  .sh-title { font-size: 19px; font-weight: 800; color: #111827; letter-spacing: -0.02em; }
  .sh-sub { font-size: 12.5px; color: #6b7280; margin-top: 3px; }
  .sh-tabs {
    display: flex; gap: 4px;
    background: #f3f4f6;
    padding: 4px; border-radius: 11px;
    border: 1px solid #e5e7eb;
  }
  .sh-tab {
    padding: 7px 13px; border-radius: 8px;
    font-size: 12px; font-weight: 600; color: #4b5563;
  }
  .sh-tab.home {
    background: #ffffff;
    border: 1px solid #d1d5db;
    color: #111827; font-weight: 700;
  }
  .sh-tab.active {
    background: #18181b;
    color: #ffffff; font-weight: 700;
  }
  /* Minimal Monotone KPI Row */
  .kpi-row {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
  }
  .kpi-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .kpi-top { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6b7280; font-weight: 600; }
  .kpi-val { font-size: 19px; font-weight: 800; color: #111827; letter-spacing: -0.02em; }
  .kpi-sub { font-size: 11.5px; color: #6b7280; }
  .badge-delta {
    font-size: 10.5px; font-weight: 600; padding: 2px 8px; border-radius: 999px;
    background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb;
  }
  /* Bento Panels */
  .bento-grid-2 { display: grid; grid-template-columns: 1fr 1.15fr; gap: 16px; flex: 1; min-height: 0; }
  .bento-grid-3 { display: grid; grid-template-columns: 270px 1fr 330px; gap: 16px; flex: 1; min-height: 0; }
  .bento-panel {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px 22px;
    display: flex; flex-direction: column; gap: 12px;
    min-height: 0; overflow: hidden;
  }
  .panel-head {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding-bottom: 12px; border-bottom: 1px solid #f3f4f6;
  }
  .panel-title { font-size: 15px; font-weight: 800; color: #111827; }
  .panel-desc { font-size: 12px; color: #6b7280; margin-top: 3px; }
  .btn {
    padding: 6px 12px; border-radius: 8px; font-size: 11.5px; font-weight: 600;
    background: #ffffff; border: 1px solid #d1d5db; color: #374151;
    display: inline-flex; align-items: center; justify-content: center; gap: 5px;
    white-space: nowrap; flex-shrink: 0;
  }
  .btn.primary { background: #18181b; border-color: #18181b; color: #ffffff; font-weight: 700; }
  .btn.soft { background: #f3f4f6; border-color: #e5e7eb; color: #111827; font-weight: 600; }
  .item-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 13px 16px;
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
  }
  .item-card.active {
    background: #ffffff;
    border: 1.5px solid #18181b;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  .chip {
    font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 6px;
    background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb;
    white-space: nowrap; flex-shrink: 0;
  }
  .chip.dark { background: #18181b; color: #ffffff; border-color: #18181b; }
  .chip.green { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }
  /* Bottom Bar */
  .bottom-bar {
    position: absolute; left: 20px; right: 20px; bottom: 14px; height: 46px;
    display: flex; align-items: center; justify-content: space-between; z-index: 10;
  }
  .bb-pill {
    background: #ffffff; border: 1px solid #e5e7eb;
    border-radius: 999px; padding: 8px 16px; font-size: 12px; color: #374151;
    display: flex; align-items: center; gap: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  }
  .bb-prompt {
    width: 560px; height: 42px; border-radius: 999px;
    background: #ffffff; border: 1px solid #d1d5db;
    display: flex; align-items: center; justify-content: space-between; padding: 0 8px 0 16px;
    font-size: 12.5px; color: #6b7280;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
</style>
</head>
<body>
  <header class="top-bar">
    <div class="brand-row">
      <span class="logo-dot"></span>
      <span class="brand-title">BSC J.A.R.V.I.S. OS</span>
      <span class="design-pill">심플 모노톤 라이트 대시보드 · 시안 #${screenNum} (${badge})</span>
    </div>
    <div class="search-capsule">
      <span>🔍 폴더, 마크다운(.md) 문서, 코드, 프로그램 검색...</span>
      <kbd style="background:#f3f4f6;border:1px solid #e5e7eb;padding:2px 6px;border-radius:5px;font-size:10.5px;color:#4b5563;">⌘K</kbd>
    </div>
    <div class="top-right">
      <span class="top-chip">● Gemma 4 로컬 코어 ($0)</span>
      <span class="top-chip">🎙️ 현수 HD 자연 음성</span>
      <span class="top-chip">10월 23일 (금) 오후 3:20</span>
    </div>
  </header>

  <nav class="left-dock">
    ${dockItems.map(d => `
      <div class="dock-btn ${d.id === navActive ? 'active' : ''}">
        <span class="ico">${d.icon}</span>
        <span>${d.label}</span>
      </div>
    `).join('')}
  </nav>

  <main class="bento-stage">
    <div class="stage-header">
      <div>
        <span class="sh-badge">MINIMAL LIGHT DESIGN #${screenNum} · ${badge}</span>
        <div class="sh-title">${title}</div>
        <div class="sh-sub">${subtitle}</div>
      </div>
      <div class="sh-tabs">
        ${topTabs.map(t => `
          <div class="sh-tab ${t.id === 'HOME' ? 'home' : ''} ${t.id === navActive ? 'active' : ''}">${t.label}</div>
        `).join('')}
      </div>
    </div>

    <div class="kpi-row">
      ${kpis.map(k => `
        <div class="kpi-card">
          <div class="kpi-top">
            <span>${k.label}</span>
            <span class="badge-delta">${k.badge}</span>
          </div>
          <div class="kpi-val">${k.value}</div>
          <div class="kpi-sub">${k.sub}</div>
        </div>
      `).join('')}
    </div>

    ${bodyHtml}
  </main>

  ${rightDrawerHtml}
  ${floatingModalHtml}

  <footer class="bottom-bar">
    <div class="bb-pill">
      <span>🧠 뉴런홈 은하 코어 유지</span>
      <span>● 650 뉴런</span>
      <span>● 23,595 파일 동기화</span>
    </div>
    <div class="bb-prompt">
      <span>🎙️ 자비스에게 질문하거나 업무를 지시하세요...</span>
      <span style="background:#18181b;color:#fff;width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:12px;">➤</span>
    </div>
    <div class="bb-pill">
      <span>💬 1:1 대화창</span>
      <span>📂 지식폴더</span>
      <span>📄 문서·IDE</span>
      <span style="font-weight:700;color:#111827;">🎨 ArtCraft 제어</span>
      <span style="font-weight:700;color:#111827;">🤖 두뇌·도구</span>
    </div>
  </footer>
</body>
</html>`;
}

async function run() {
  // Clean Light Studio Canvas Preview for ArtCraft Viewport
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="600" viewBox="0 0 1100 600">
    <rect width="1100" height="600" fill="#f3f4f6"/>
    <rect x="0" y="0" width="1100" height="38" fill="#ffffff"/>
    <line x1="0" y1="38" x2="1100" y2="38" stroke="#e5e7eb" stroke-width="1"/>
    <circle cx="20" cy="19" r="5.5" fill="#ef4444"/><circle cx="38" cy="19" r="5.5" fill="#f59e0b"/><circle cx="56" cy="19" r="5.5" fill="#10b981"/>
    <text x="80" y="24" fill="#111827" font-family="sans-serif" font-size="13" font-weight="bold">PhotoCraft 0.5.1 — Untitled-1.psd @ 100% (Live Control :17801 Connected)</text>
    <rect x="0" y="39" width="54" height="561" fill="#ffffff"/>
    <line x1="54" y1="39" x2="54" y2="600" stroke="#e5e7eb" stroke-width="1"/>
    <rect x="11" y="54" width="32" height="32" rx="7" fill="#18181b"/>
    <rect x="11" y="96" width="32" height="32" rx="7" fill="#f3f4f6"/>
    <rect x="11" y="138" width="32" height="32" rx="7" fill="#f3f4f6"/>
    <rect x="11" y="180" width="32" height="32" rx="7" fill="#f3f4f6"/>
    <rect x="90" y="68" width="710" height="500" rx="10" fill="#ffffff" stroke="#d1d5db" stroke-width="1.5"/>
    <path d="M 160 400 Q 340 160, 500 350 T 720 240" fill="none" stroke="#18181b" stroke-width="8" stroke-linecap="round"/>
    <path d="M 190 450 Q 380 260, 540 420 T 730 330" fill="none" stroke="#71717a" stroke-width="5" stroke-linecap="round"/>
    <circle cx="500" cy="350" r="14" fill="none" stroke="#18181b" stroke-width="2"/>
    <text x="125" y="110" fill="#111827" font-family="sans-serif" font-size="15" font-weight="bold">ArtCraft Live Canvas (1920 × 1080 · 60FPS 실시간 화면 공유)</text>
    <text x="125" y="132" fill="#6b7280" font-family="sans-serif" font-size="12">이 화면 위를 클릭하면 마우스 좌표가 실행 중인 PhotoCraft로 즉시 전달됩니다.</text>
    <rect x="836" y="39" width="264" height="561" fill="#ffffff"/>
    <line x1="836" y1="39" x2="836" y2="600" stroke="#e5e7eb" stroke-width="1"/>
    <text x="854" y="72" fill="#111827" font-family="sans-serif" font-size="13" font-weight="bold">레이어 &amp; 색보정 (Layers)</text>
    <rect x="852" y="88" width="232" height="42" rx="8" fill="#f9fafb" stroke="#18181b" stroke-width="1.5"/>
    <text x="866" y="114" fill="#111827" font-family="sans-serif" font-size="12" font-weight="bold">🖌️ AI 브러시 드로잉 레이어</text>
    <rect x="852" y="138" width="232" height="42" rx="8" fill="#f9fafb" stroke="#e5e7eb"/>
    <text x="866" y="164" fill="#374151" font-family="sans-serif" font-size="12">📈 커브(Curves) 보정 레이어</text>
    <rect x="852" y="188" width="232" height="42" rx="8" fill="#f9fafb" stroke="#e5e7eb"/>
    <text x="866" y="214" fill="#6b7280" font-family="sans-serif" font-size="12">🖼️ 배경 캔버스 (1920×1080)</text>
  </svg>`;
  const liveArtCraftDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

  const screens = [
    // 01: 지식폴더 미니멀 대시보드
    {
      file: 'mockup_01_ecosystem_bento.png',
      screenNum: '01',
      badge: '지식폴더 & 문서 인벤토리 대시보드',
      navActive: 'ECO',
      title: '📂 지식생태계 폴더 연결 & 문서(.MD) 분석 대시보드',
      subtitle: '복잡한 색상을 배제하고 깔끔한 화이트 & 그레이 톤으로 연결된 폴더와 마크다운 문서 현황을 한눈에 보여줍니다.',
      kpis: [
        { label: '연결된 지식생태계 폴더', value: '7개 폴더 연결됨', badge: '실시간 동기화', sub: '회사_HQ · Branch · 연구소 · 스킬창고' },
        { label: '디스크 전체 파악 파일', value: '23,595개 파일', badge: '전수 파악', sub: '하위 폴더 내 모든 문서·코드·에셋 포함' },
        { label: '보유 마크다운(.MD) 문서', value: '1,420개 문서', badge: '심층 650개 추출', sub: '목차·요약·태그 자동 정리 완료' },
        { label: '파악된 코드 & 오피스 문서', value: '14,820개 파일', badge: '누락 0건', sub: 'Word · PPT · PDF · 소스코드 통합' }
      ],
      bodyHtml: `
        <div class="bento-grid-2">
          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">1. 연결된 폴더 슬롯 목록</div>
                <div class="panel-desc">폴더를 선택해 연결하면 내부 문서들이 자동으로 분류됩니다.</div>
              </div>
              <div style="display:flex;gap:8px;">
                <span class="btn primary">+ 폴더 추가</span>
                <span class="btn">윈도우 탐색기 열기</span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${[
                { name: '🏢 회사_HQ (본사)', path: 'C:/BeausCreators/01.BSC_HQ', files: '8,420개', md: '612개', code: '3,190개', pct: 85 },
                { name: '🚀 회사_Branch (지점)', path: 'C:/BeausCreators/02.BSC_Branch', files: '6,840개', md: '340개', code: '4,920개', pct: 72 },
                { name: '🔬 연구소_Research', path: 'C:/BeausCreators/03.Research', files: '3,910개', md: '218개', code: '2,410개', pct: 58 },
                { name: '🧰 스킬창고_Warehouse', path: 'C:/BeausCreators/05.BSC_Skill_Warehouse', files: '4,425개', md: '250개', code: '2,890개', pct: 66 }
              ].map((s, idx) => `
                <div class="item-card ${idx === 0 ? 'active' : ''}" style="flex-direction:column;align-items:stretch;gap:8px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div>
                      <strong style="font-size:13.5px;color:#111827;">${s.name}</strong>
                      <span style="font-family:monospace;font-size:11.5px;color:#6b7280;margin-left:8px;">${s.path}</span>
                    </div>
                    <div style="display:flex;gap:6px;">
                      <span class="chip green">● ${s.files} 파악됨</span>
                      <span class="btn">폴더 변경</span>
                    </div>
                  </div>
                  <div style="height:5px;background:#e5e7eb;border-radius:999px;overflow:hidden;">
                    <div style="width:${s.pct}%;height:100%;background:#18181b;border-radius:999px;"></div>
                  </div>
                  <div style="display:flex;gap:16px;font-size:11.5px;color:#6b7280;">
                    <span>마크다운: <b style="color:#111827;">${s.md}</b></span>
                    <span>코드 파일: <b style="color:#111827;">${s.code}</b></span>
                    <span>오피스/PDF 포함</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">2. 분석된 마크다운(.MD) 문서 목록</div>
                <div class="panel-desc">클릭 시 문서를 바로 열람·편집하거나 뉴런홈 위치로 이동합니다.</div>
              </div>
              <div style="display:flex;gap:8px;">
                <span class="btn">🔍 문서 검색...</span>
                <span class="btn primary">전체 파일 검색</span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${[
                { slot: '회사_HQ', file: 'AGENTS.md', title: 'BeausCreators 전사 에이전트 운영 헌장', sum: 'CHLGD 워크플로우, 데이터 유실 방지 원칙 및 26인 에이전트 운영 표준 정의' },
                { slot: '스킬창고', file: 'control-protocol.md', title: 'ArtCraft 실시간 제어 프로토콜 명세서', sum: 'Loopback JSON-Lines 포트를 통한 화면 캡처(ui.screenshot) 및 도구 제어 명세' },
                { slot: '회사_HQ', file: 'Minimal_Design_Guide.md', title: '심플 모노톤 라이트 대시보드 디자인 가이드', sum: '눈의 피로를 줄이는 화이트·웜그레이·차콜 모노톤 레이아웃 및 타이포그래피 규격' },
                { slot: '연구소', file: 'REA_2026-10-23_artcraft.md', title: 'REA ArtCraft 13종 역공학 블루프린트', sum: '4단계 클린룸 역공학으로 추출한 Rust 크리에이티브 코어 및 AI 연동 구조' }
              ].map((d, idx) => `
                <div class="item-card ${idx === 0 ? 'active' : ''}">
                  <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                      <span class="chip">${d.slot}</span>
                      <strong style="font-size:13.5px;color:#111827;">${d.file}</strong>
                      <span style="font-size:12px;color:#6b7280;">— ${d.title}</span>
                    </div>
                    <div style="font-size:12px;color:#4b5563;line-height:1.45;">${d.sum}</div>
                  </div>
                  <div style="display:flex;gap:6px;">
                    <span class="btn primary">열람·편집</span>
                    <span class="btn">뉴런 위치</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      `
    },

    // 02: 문서 · IDE · 터미널 워크벤치
    {
      file: 'mockup_02_doc_ide_workbench.png',
      screenNum: '02',
      badge: '문서 편집 · 코드 에디터 · 터미널',
      navActive: 'IDE',
      title: '📄 마크다운(.MD) 문서 편집 · 코드 에디터 · 터미널',
      subtitle: '노션(Notion)처럼 밝고 깨끗한 지면 위에서 문서를 작성·편집하고, 원클릭으로 Word·PPT·PDF 파일로 변환합니다.',
      kpis: [
        { label: '현재 열린 문서', value: 'AGENTS.md', badge: '자동 백업 켜짐', sub: 'C:/BeausCreators/01.BSC_HQ/2.Agents/AGENTS.md' },
        { label: '문서 보호 상태', value: '원본 유실 방지 활성', badge: '안전', sub: '덮어쓰기 방지 및 .bak 백업 자동 생성' },
        { label: '오피스 포맷 변환', value: 'Word · PPT · PDF', badge: '원클릭 변환', sub: '현재 문서를 상용 오피스 양식으로 즉시 저장' },
        { label: '내장 터미널 상태', value: '정상 대기 중', badge: '보안 적용', sub: '파일 삭제 명령 원천 차단 완료' }
      ],
      bodyHtml: `
        <div class="bento-grid-3">
          <aside class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">문서 &amp; 파일 목록</div>
                <div class="panel-desc">클릭하여 바로 열기</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <div class="item-card active" style="padding:10px 12px;"><span style="font-size:12.5px;font-weight:700;">📝 AGENTS.md</span></div>
              <div class="item-card" style="padding:10px 12px;"><span style="font-size:12.5px;">📝 00_SOUL_and_Worldview.md</span></div>
              <div class="item-card" style="padding:10px 12px;"><span style="font-size:12.5px;">📝 control-protocol.md</span></div>
              <div class="item-card" style="padding:10px 12px;"><span style="font-size:12.5px;">📄 scripts/artcraft-live-controller.js</span></div>
              <div class="item-card" style="padding:10px 12px;"><span style="font-size:12.5px;">📄 public/js/jarvis-design-views.js</span></div>
              <div class="item-card" style="padding:10px 12px;"><span style="font-size:12.5px;">📄 server.js</span></div>
            </div>
          </aside>

          <main class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">📝 AGENTS.md — 문서 편집기</div>
                <div class="panel-desc">깨끗한 화이트 에디터 · 수정 후 저장 시 자동 백업됩니다.</div>
              </div>
              <div style="display:flex;gap:6px;">
                <span class="btn">미리보기</span>
                <span class="btn">음성 낭독</span>
                <span class="btn primary">저장하기</span>
                <span class="btn soft">Word·PPT·PDF 변환</span>
              </div>
            </div>
            <div style="flex:1;background:#fafafa;border:1px solid #e5e7eb;border-radius:12px;padding:20px;font-size:13.5px;line-height:1.75;color:#18181b;">
              <h3 style="font-size:17px;margin-bottom:8px;"># BeausCreators 전사 에이전트 운영 헌장 (SSOT)</h3>
              <p style="color:#4b5563;margin-bottom:12px;">본 문서는 모든 AI 에이전트가 준수해야 하는 핵심 운영 원칙과 데이터 보호 규정을 정의합니다.</p>
              <div style="padding:12px 14px;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:10px;">
                <b>1. 데이터 유실 방지 (Zero Data Loss)</b><br/>
                <span style="color:#4b5563;font-size:12.5px;">사전 승인 없는 파일 삭제 및 원본 통째 덮어쓰기를 엄격히 금지하며, 항상 기존 내용을 보존합니다.</span>
              </div>
              <div style="padding:12px 14px;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;">
                <b>2. 심플 모노톤 UI &amp; 직관적 실무 환경</b><br/>
                <span style="color:#4b5563;font-size:12.5px;">뉴런홈을 제외한 모든 실무 대시보드는 눈이 편안한 화이트 &amp; 모노톤 레이아웃을 표준으로 합니다.</span>
              </div>
            </div>
          </main>

          <aside class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">승인 대기열 &amp; 터미널</div>
                <div class="panel-desc">간결한 실행 상태 확인</div>
              </div>
            </div>
            <div class="item-card" style="flex-direction:column;align-items:flex-start;gap:4px;">
              <strong style="font-size:12.5px;">승인 대기 중인 작업 없음</strong>
              <span style="font-size:11.5px;color:#6b7280;">모든 제작 작업이 정상 완료되었습니다.</span>
            </div>
            <div style="flex:1;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:14px;font-family:monospace;font-size:12px;color:#18181b;line-height:1.65;">
              $ node bin/jarvis-cli.js status<br/>
              ● Server: http://localhost:7777 (정상)<br/>
              ● AI Brain: gemma4:e4b ($0 무료)<br/>
              ● ArtCraft 13종: 연결 준비 완료<br/>
              $ _
            </div>
          </aside>
        </div>
      `
    },

    // 03: AI 두뇌 & 도구 대시보드
    {
      file: 'mockup_03_ai_brain_dashboard.png',
      screenNum: '03',
      badge: '로컬 AI 두뇌 & 실무 도구함',
      navActive: 'BRAIN',
      title: '🤖 로컬 AI 두뇌 선택 & 실무 도구함 대시보드',
      subtitle: '내 PC에 설치된 무료 Gemma 4 모델을 원클릭으로 선택하고, 자주 쓰는 실무 도구와 ArtCraft 프로그램을 깔끔하게 실행합니다.',
      kpis: [
        { label: '현재 장착된 AI 두뇌', value: 'gemma4:e4b', badge: '무료 온디바이스', sub: '주력 한국어 대화 및 이미지 비전 모델' },
        { label: '설치된 로컬 모델 수', value: '4종 준비 완료', badge: '자동 메모리 관리', sub: 'e2b · e4b · 31b · embeddinggemma' },
        { label: '외부 프로그램 연동', value: 'ArtCraft 13종 + REA', badge: '연결됨', sub: '자비스 두뇌와 13종 크리에이티브 앱 직결' },
        { label: 'API 과금 비용', value: '0원 ($0.00)', badge: '100% 로컬 구동', sub: '외부 유료 클라우드 과금 없음' }
      ],
      bodyHtml: `
        <div class="bento-grid-2">
          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">1. 내 PC 로컬 AI 두뇌 (Gemma 4 쿼드코어)</div>
                <div class="panel-desc">원하는 모델을 클릭하면 즉시 자비스의 주력 두뇌로 전환됩니다.</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${[
                { name: 'gemma4:e4b (기본 권장)', role: '빠르고 정확한 한국어 대화 및 화면·이미지 인식', size: '3.1 GB', active: true },
                { name: 'gemma4:e2b', role: '초고속 일상 응답 및 경량 작업 처리', size: '1.8 GB', active: false },
                { name: 'gemma4:31b', role: '고난도 코딩·아키텍처 설계 및 심층 보고서 작성', size: '18.4 GB', active: false },
                { name: 'embeddinggemma:300m-qat-q8_0', role: '연결된 폴더의 마크다운(.MD) 문서 정밀 검색 엔진', size: '0.6 GB', active: false }
              ].map(m => `
                <div class="item-card ${m.active ? 'active' : ''}">
                  <div>
                    <strong style="font-size:13.5px;color:#111827;">${m.name}</strong>
                    <span class="chip" style="margin-left:8px;">${m.size}</span>
                    <div style="font-size:12px;color:#6b7280;margin-top:3px;">${m.role}</div>
                  </div>
                  <span class="btn ${m.active ? 'primary' : ''}">${m.active ? '✓ 현재 사용 중' : '선택하기'}</span>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">2. 실무 전문 스튜디오 &amp; ArtCraft 바로가기</div>
                <div class="panel-desc">복잡한 메뉴 없이 필요한 작업 도구를 카드로 깔끔하게 실행합니다.</div>
              </div>
              <span class="btn primary">🎨 ArtCraft 제어 화면 열기</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              ${[
                { t: '🎨 ArtCraft 13종 실시간 제어', d: 'PhotoCraft·VectorCraft 화면을 창 안에서 보며 직접 제어' },
                { t: '👁️ 화면 시야공유 & 6종 문서 생성', d: '보고 있는 화면을 분석해 Word·PPT·PDF로 즉시 변환' },
                { t: '🔬 REA 코드 역공학 분석기', d: '외부 프로그램·코드를 분석해 설계 블루프린트 추출' },
                { t: '🎙️ 96kbps 자연 음성 스튜디오', d: '현수·선희·인준 HD 아나운서 목소리 설정 및 낭독' },
                { t: '🧊 3D 캐릭터 & Blender 도구', d: '360° 캐릭터 시트 및 Blender 3D 작업 연동' },
                { t: '⚡ 전체 18개 스튜디오 카탈로그', d: '구축된 모든 스튜디오 도구를 한눈에 열람' }
              ].map((s, idx) => `
                <div class="item-card ${idx === 0 ? 'active' : ''}" style="flex-direction:column;align-items:flex-start;gap:5px;">
                  <strong style="font-size:13.5px;color:#111827;">${s.t}</strong>
                  <div style="font-size:12px;color:#6b7280;line-height:1.45;">${s.d}</div>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      `
    },

    // 04: ArtCraft 13종 실시간 제어 화면 (밝고 심플한 모노톤 스튜디오!)
    {
      file: 'mockup_04_artcraft_live_control_studio.png',
      screenNum: '04',
      badge: 'ArtCraft 13종 실시간 화면 공유 & 원격 제어 창',
      navActive: 'ARTCRAFT',
      title: '🎨 ArtCraft 13종 실시간 제어 스튜디오 (PhotoCraft 화면 직결)',
      subtitle: '자비스 UI 창 안에서 실행 중인 ArtCraft 화면을 깔끔하게 보면서 마우스 클릭·도구 변경·새 레이어·AI 드로잉을 바로 제어합니다.',
      kpis: [
        { label: '현재 제어 중인 앱', value: '01. PhotoCraft', badge: '실행 및 연결됨', sub: '포토샵 대체 · 사진 및 PSD 레이어 편집' },
        { label: '실시간 화면 연결 채널', value: '로컬 제어 포트 :17801', badge: '실시간 스트리밍', sub: 'ui.screenshot & ui.click 양방향 직결' },
        { label: '연결된 AI 두뇌', value: 'Gemma 4 E4B 연동', badge: 'SharedStore', sub: '13종 모든 앱에 로컬 AI 자동 연결 완료' },
        { label: '설치된 ArtCraft 앱', value: '13종 전체 설치됨', badge: '정상 작동', sub: 'Photo · Vector · Film · Fig · Light · Deck 등' }
      ],
      bodyHtml: `
        <div class="bento-grid-3" style="grid-template-columns:260px 1fr 310px;">
          <aside class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">1. ArtCraft 13종 앱 선택</div>
                <div class="panel-desc">클릭 시 해당 앱 제어 화면으로 전환</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${[
                { n: '01. PhotoCraft', k: '포토샵 대체 · 사진 편집', on: true },
                { n: '02. VectorCraft', k: '일러스트 대체 · 벡터 그래픽', on: false },
                { n: '03. FilmCraft', k: '프리미어 대체 · 영상 편집', on: false },
                { n: '06. FigCraft', k: '피그마 대체 · UI/UX 디자인', on: false },
                { n: '07. LightCraft', k: '라이트룸 대체 · 사진 색보정', on: false },
                { n: '10. DeckCraft', k: '파워포인트 대체 · 슬라이드', on: false }
              ].map(a => `
                <div class="item-card ${a.on ? 'active' : ''}" style="padding:8px 12px;">
                  <div>
                    <div style="font-size:12.5px;font-weight:700;color:#111827;">${a.n}</div>
                    <div style="font-size:11px;color:#6b7280;">${a.k}</div>
                  </div>
                  <span class="chip ${a.on ? 'dark' : ''}">${a.on ? '제어 중' : '대기'}</span>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
              <span class="btn">✋ 이동</span>
              <span class="btn primary">🖌️ 브러시</span>
              <span class="btn">✏️ 펜</span>
              <span class="btn">🔤 텍스트</span>
              <span class="btn">⬜ 선택</span>
              <span class="btn">🔍 줌</span>
            </div>
          </aside>

          <main class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">🖥️ PhotoCraft 실시간 제어 화면 (화면 위를 클릭하면 마우스 좌표가 바로 전달됩니다)</div>
                <div class="panel-desc">실제 프로그램 창 화면을 실시간으로 공유하며, 상단 버튼으로 캔버스와 레이어를 즉시 조작합니다.</div>
              </div>
              <div style="display:flex;gap:6px;">
                <span class="btn soft">📡 실시간 스트리밍 ON</span>
                <span class="btn primary">🎨 AI 브러시 자동 드로잉</span>
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <span class="btn primary">📄 새 캔버스 (1920×1080)</span>
              <span class="btn">+ 새 레이어 추가</span>
              <span class="btn">📈 커브 색보정</span>
              <span class="btn">🌈 색조·채도 보정</span>
              <span class="btn">⛶ 화면 맞춤</span>
              <span class="btn">↩️ 실행 취소</span>
            </div>
            <div style="flex:1;background:#f3f4f6;border:1px solid #d1d5db;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
              <img src="${liveArtCraftDataUrl}" style="width:100%;height:100%;object-fit:contain;" />
            </div>
          </main>

          <aside class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">2. 현재 레이어 &amp; 상태 정보</div>
                <div class="panel-desc">PhotoCraft 실시간 내부 상태</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div class="item-card active" style="padding:10px 12px;"><div><strong style="font-size:12.5px;">🖌️ AI 브러시 드로잉 레이어</strong><div style="font-size:11px;color:#6b7280;">불투명도 100% · 표준(Normal)</div></div></div>
              <div class="item-card" style="padding:10px 12px;"><div><strong style="font-size:12.5px;">📈 커브(Curves) 조정 레이어</strong><div style="font-size:11px;color:#6b7280;">비파괴 색보정 필터 활성</div></div></div>
              <div class="item-card" style="padding:10px 12px;"><div><strong style="font-size:12.5px;">🖼️ 배경 캔버스 (1920×1080)</strong><div style="font-size:11px;color:#6b7280;">RGB / 16-bit · DirectX 12 가속</div></div></div>
            </div>
            <div style="flex:1;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px;font-family:monospace;font-size:11.5px;color:#374151;line-height:1.6;">
              [15:20:01] PhotoCraft (:17801) 연결됨<br/>
              [15:20:03] 새 캔버스 1920x1080 생성<br/>
              [15:20:05] AI 브러시 드로잉 완료<br/>
              [15:20:06] 실시간 화면 캡처 수신 완료
            </div>
          </aside>
        </div>
      `
    },

    // 05: 에이전트 회의 & 26인 조직 로스터
    {
      file: 'mockup_05_agent_warroom_office.png',
      screenNum: '05',
      badge: '에이전트 회의실 & 26인 조직 현황',
      navActive: 'OFFICE',
      title: '🏛️ 에이전트 실시간 회의실 & 전사 26인 조직 현황 대시보드',
      subtitle: '소하·거누·시안·태준의 회의 내용과 전사 에이전트들의 현재 업무 상태를 깔끔한 화이트 카드로 확인합니다.',
      kpis: [
        { label: '전사 에이전트 인원', value: '26명 등록됨', badge: '본사 연동', sub: '기획 · 개발 · 디자인 · 마케팅 · 출판 · 음악' },
        { label: '현재 활동 중인 요원', value: '8명 업무 수행 중', badge: '실시간', sub: '소하 · 태준 · 거누 · 우진 · 시안 외' },
        { label: '오늘 작성된 회의록', value: '14건 자동 저장', badge: '보고서 보관', sub: '01.BSC_HQ/1.Documents/01.보고서 동기화' },
        { label: '15초 요약 음성 브리핑', value: '즉시 낭독 가능', badge: '현수 HD', sub: '전사 핵심 진행상황을 15초 내 음성 보고' }
      ],
      bodyHtml: `
        <div class="bento-grid-2">
          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">1. 실시간 에이전트 회의 피드</div>
                <div class="panel-desc">안건을 입력하면 담당 에이전트들이 핵심만 간결하게 보고합니다.</div>
              </div>
              <div style="display:flex;gap:6px;">
                <span class="btn soft">📢 15초 음성 브리핑</span>
                <span class="btn primary">안건 상정하기</span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${[
                { name: '소하 (수석비서)', text: '이건우 대표님, 눈이 피로한 파란색·어두운 배경을 모두 걷어내고, 단순하고 밝은 화이트 & 모노톤 대시보드로 전면 개편했습니다.' },
                { name: '시안 (수석 디자이너)', text: '노션(Notion)과 토스(Toss) 라이트 모드의 여백·명도 대비 기준을 적용해 글자가 한눈에 들어오도록 10대 화면을 정돈했습니다.' },
                { name: '거누 (CTO)', text: 'ArtCraft 13종 실시간 제어 화면도 밝고 깔끔한 스튜디오 프레임 안에서 끊김 없이 실시간 스트리밍 및 클릭 제어가 작동합니다.' },
                { name: '태준 (비서실장)', text: '로컬(localhost:7777)과 클라우드(bsc-javis-dev.web.app) 양쪽 모두 라이트 모노톤 디자인과 10대 시안 반영을 완료했습니다.' }
              ].map((m, idx) => `
                <div class="item-card ${idx === 0 ? 'active' : ''}" style="align-items:flex-start;">
                  <div>
                    <strong style="font-size:13px;color:#111827;">● ${m.name}</strong>
                    <div style="font-size:12.5px;color:#374151;margin-top:4px;line-height:1.5;">"${m.text}"</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">2. 전사 에이전트 현황 (26인)</div>
                <div class="panel-desc">각 요원의 담당 직무와 현재 진행 중인 작업입니다.</div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              ${[
                { n: '소하', r: '수석비서 · 일정/오더 총괄', t: '대표님 지시사항 브리핑' },
                { n: '태준', r: '비서실장 · 품질 검수', t: '전 시스템 무결성 점검' },
                { n: '거누', r: 'CTO · 시스템 아키텍처', t: 'ArtCraft 실시간 제어 연동' },
                { n: '우진', r: 'AI연구원 · Gemma 4 모델', t: '온디바이스 추론 최적화' },
                { n: '시안', r: '수석 디자이너 · UI/UX', t: '심플 라이트 모노톤 리디자인' },
                { n: '재호', r: 'UI/UX 디자이너', t: '대시보드 카드 여백 표준화' },
                { n: '유나', r: '프론트엔드 개발', t: '라이트 테마 반응형 적용' },
                { n: '수호', r: 'QA & 보안 엔지니어', t: '본사 원본 파일 보호 감시' }
              ].map(a => `
                <div class="item-card" style="padding:11px 14px;">
                  <div>
                    <strong style="font-size:13px;color:#111827;">${a.n}</strong>
                    <span style="font-size:11.5px;color:#6b7280;margin-left:6px;">${a.r}</span>
                    <div style="font-size:11.5px;color:#4b5563;margin-top:3px;">${a.t}</div>
                  </div>
                  <span class="chip green">활동 중</span>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      `
    },

    // 06: 환경설정 · 음성 · 시스템 검증
    {
      file: 'mockup_06_settings_voice_verification.png',
      screenNum: '06',
      badge: '환경설정 · 자연 음성 · 시스템 점검',
      navActive: 'SETTINGS',
      title: '⚙️ 환경설정 · 자연 음성(TTS) 성우 선택 · 시스템 점검',
      subtitle: '복잡한 설정 없이 목소리 선택, 화면 테마 전환, 데이터 보호 상태 및 시스템 정상 작동 여부를 간단히 제어합니다.',
      kpis: [
        { label: '현재 선택된 성우 목소리', value: '현수 HD (남성 아나운서)', badge: '96kbps 고음질', sub: '기계음 없는 자연스러운 스튜디오 육성' },
        { label: '아이패드 & PC 호환성', value: '100% 정상 재생', badge: '검증 완료', sub: '사파리·크롬·엣지 모든 기기 음성 지원' },
        { label: '시스템 종합 점검 점수', value: '100점 (정상)', badge: '오류 0건', sub: '모든 모듈 구문 및 연결 상태 이상 없음' },
        { label: '데이터 유실 방지 보호', value: '상시 켜짐', badge: '안전', sub: '승인 없는 삭제 및 원본 훼손 차단' }
      ],
      bodyHtml: `
        <div class="bento-grid-2">
          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">1. 자비스 목소리(성우) 및 오디오 제어</div>
                <div class="panel-desc">원하시는 성우 목소리를 클릭하면 대화와 브리핑에 즉시 적용됩니다.</div>
              </div>
            </div>
            <div class="item-card active" style="flex-direction:column;align-items:stretch;gap:12px;">
              <strong style="font-size:13.5px;color:#111827;">🎙️ 스튜디오 HD 자연 음성 성우 선택</strong>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                <span class="btn primary">✓ 현수 HD (차분한 남성)</span>
                <span class="btn">선희 HD (따뜻한 여성)</span>
                <span class="btn">인준 HD (부드러운 남성)</span>
              </div>
              <div style="display:flex;gap:8px;">
                <span class="btn primary">🔊 목소리 테스트 듣기</span>
                <span class="btn soft">📢 15초 브리핑 듣기</span>
                <span class="btn">⏹ 음성 즉시 정지</span>
              </div>
            </div>
            <div class="item-card" style="flex-direction:column;align-items:stretch;gap:10px;">
              <strong style="font-size:13.5px;color:#111827;">☀️ 화면 스타일 &amp; 부가 도구</strong>
              <div style="display:flex;gap:8px;">
                <span class="btn primary">✓ 심플 라이트 모노톤 (기본)</span>
                <span class="btn">📷 카메라·손동작 패널 열기</span>
                <span class="btn">📘 사용 설명서 보기</span>
              </div>
            </div>
          </section>

          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">2. 시스템 정상 작동 점검 &amp; 최근 기록</div>
                <div class="panel-desc">핵심 기능 4가지의 연결 상태와 최근 실행 로그입니다.</div>
              </div>
              <span class="btn primary">전체 다시 점검</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div class="item-card"><div><div style="font-size:11.5px;color:#6b7280;">음성 대화 &amp; 성우 엔진</div><strong style="font-size:13px;color:#111827;">● 정상 작동 중</strong></div></div>
              <div class="item-card"><div><div style="font-size:11.5px;color:#6b7280;">폴더 연결 &amp; 문서 분석기</div><strong style="font-size:13px;color:#111827;">● 정상 (23,595 파일)</strong></div></div>
              <div class="item-card"><div><div style="font-size:11.5px;color:#6b7280;">Gemma 4 로컬 AI 두뇌</div><strong style="font-size:13px;color:#111827;">● 정상 (무료 구동)</strong></div></div>
              <div class="item-card"><div><div style="font-size:11.5px;color:#6b7280;">ArtCraft 13종 제어 연결</div><strong style="font-size:13px;color:#111827;">● 정상 (:17801~17813)</strong></div></div>
            </div>
            <div style="flex:1;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px;font-family:monospace;font-size:12px;color:#374151;line-height:1.65;">
              [15:20:10] 로컬 AI 두뇌(gemma4:e4b) 상태 확인 완료<br/>
              [15:20:12] ArtCraft 13종 AI 연동 설정 동기화 완료<br/>
              [15:20:15] 현수 HD 96kbps 자연 음성 출력 준비 완료<br/>
              [15:20:18] 전 시스템 무결성 점검: 이상 없음 (PASS)
            </div>
          </section>
        </div>
      `
    },

    // 07: 자비스 1:1 대화 드로어 (심플 화이트 채팅창)
    {
      file: 'mockup_07_copilot_chat_drawer.png',
      screenNum: '07',
      badge: '자비스 1:1 대화창 (우측 슬라이드 패널)',
      navActive: 'BRAIN',
      title: '💬 자비스 1:1 실무 대화창 (우측 슬라이드 화이트 패널)',
      subtitle: '어느 화면에서든 우측에 깔끔한 화이트 대화창을 열어 자비스와 자연스럽게 대화하고 업무를 지시합니다.',
      kpis: [
        { label: '대화 응답 속도', value: '0.4초 즉시 응답', badge: '빠른 대화', sub: '불필요한 지연 없이 핵심만 명확히 답변' },
        { label: '이전 대화 기억', value: '자동 유지됨', badge: '연속 대화', sub: '앞서 나눈 지시사항과 문맥을 그대로 기억' },
        { label: '목소리 읽어주기', value: '말풍선별 낭독 지원', badge: '현수·선희·인준', sub: '원하는 답변만 골라서 다시 듣기 가능' },
        { label: '프로그램 제어 연동', value: '채팅으로 즉시 실행', badge: '원클릭', sub: '"포토크래프트 열어줘" 입력 시 즉시 실행' }
      ],
      bodyHtml: `
        <div class="bento-grid-2" style="padding-right:440px;">
          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">화면 가림 없는 깔끔한 우측 슬라이드 대화 구조</div>
                <div class="panel-desc">좌측에서는 문서나 대시보드를 보면서, 우측 대화창으로 자비스에게 바로 지시할 수 있습니다.</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              <div class="item-card active"><div><strong style="font-size:13.5px;">1. 눈이 편안한 화이트 &amp; 차콜 말풍선 디자인</strong><div style="font-size:12px;color:#6b7280;margin-top:4px;">읽기 힘든 어두운 네온 배경을 없애고, 카카오톡이나 챗GPT 라이트 모드처럼 또렷한 가독성을 제공합니다.</div></div></div>
              <div class="item-card"><div><strong style="font-size:13.5px;">2. 상단에서 성우 목소리 즉시 전환</strong><div style="font-size:12px;color:#6b7280;margin-top:4px;">대화창 상단에서 현수 HD, 선희 HD, 인준 HD 성우를 언제든 바꿀 수 있습니다.</div></div></div>
              <div class="item-card"><div><strong style="font-size:13.5px;">3. 말풍선마다 [🔊 끝까지 읽기] 버튼 제공</strong><div style="font-size:12px;color:#6b7280;margin-top:4px;">긴 보고서나 요약 내용도 버튼 하나로 아나운서 목소리로 편하게 들으실 수 있습니다.</div></div></div>
            </div>
          </section>
          <div></div>
        </div>
      `,
      rightDrawerHtml: `
        <aside style="position:absolute;top:56px;right:0;bottom:0;width:430px;background:#ffffff;border-left:1px solid #e5e7eb;z-index:30;display:flex;flex-direction:column;box-shadow:-12px 0 36px rgba(0,0,0,0.08);">
          <div style="padding:16px 20px;background:#f9fafb;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:15px;font-weight:800;color:#111827;">🤖 자비스 1:1 실무 대화창</div>
              <div style="font-size:11.5px;color:#6b7280;margin-top:2px;">● 로컬 폴더 연동됨 · gemma4:e4b</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
              <span class="btn" style="padding:4px 9px;font-size:11px;">🎙️ 현수 HD ▾</span>
              <span class="btn" style="padding:4px 9px;">✕</span>
            </div>
          </div>
          <div style="flex:1;padding:20px;display:flex;flex-direction:column;gap:14px;background:#ffffff;">
            <div style="align-self:flex-end;max-width:84%;background:#18181b;padding:12px 15px;border-radius:14px 14px 4px 14px;font-size:12.5px;color:#ffffff;line-height:1.55;">
              자비스, PhotoCraft 프로그램 연결해서 제어 화면 보여주고 새 캔버스 만들어줘.
            </div>
            <div style="align-self:flex-start;max-width:90%;background:#f5f6f8;border:1px solid #e5e7eb;padding:14px 16px;border-radius:14px 14px 14px 4px;font-size:12.5px;color:#18181b;line-height:1.6;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <strong style="color:#111827;font-size:12px;">🤖 J.A.R.V.I.S.</strong>
                <span class="chip" style="font-size:10px;background:#fff;">🔊 끝까지 읽기</span>
              </div>
              이건우 대표님, <b>PhotoCraft</b> 제어 채널을 연결하고 1920×1080 새 캔버스를 생성했습니다.<br/><br/>
              좌측 <b>[🎨 ArtCraft]</b> 메뉴에서 실시간 화면을 보시면서 바로 클릭해 작업하실 수 있습니다.
            </div>
          </div>
          <div style="padding:14px 18px;border-top:1px solid #e5e7eb;display:flex;gap:8px;background:#f9fafb;">
            <div style="flex:1;background:#ffffff;border:1px solid #d1d5db;border-radius:10px;padding:10px 14px;font-size:12px;color:#6b7280;">질문이나 지시사항을 입력하세요...</div>
            <span class="btn primary" style="padding:0 16px;border-radius:10px;">전송</span>
          </div>
        </aside>
      `
    },

    // 08: Co-Vision 화면 공유 & 6종 오피스 문서 변환 창
    {
      file: 'mockup_08_covision_6doc_studio.png',
      screenNum: '08',
      badge: '화면 공유 분석 & 6종 오피스 문서 자동 생성',
      navActive: 'BRAIN',
      title: '👁️ 화면·카메라 시야 공유 & 6종 오피스 문서(Word·PPT·PDF) 자동 생성',
      subtitle: '현재 보고 계신 PC 화면이나 이미지를 분석하여 깔끔하게 정리된 Word, PPT, PDF, 마크다운 문서로 즉시 변환합니다.',
      kpis: [
        { label: '입력 화면 소스', value: 'PC 화면 · 웹캠 · 이미지', badge: '즉시 캡처', sub: '원클릭으로 현재 작업 화면을 자비스와 공유' },
        { label: '시각 분석 모델', value: 'Gemma 4 Vision', badge: '무료 로컬 분석', sub: '화면 속 텍스트·표·레이아웃 자동 인식' },
        { label: '자동 생성 파일 포맷', value: '6종 동시 생성', badge: 'Word·PPT·PDF', sub: '보고서 양식에 맞춰 즉시 다운로드 가능' },
        { label: '문서 보관 위치', value: '로컬 폴더 자동 저장', badge: '백업 완료', sub: '내 PC와 본사 보고서 폴더에 안전하게 보관' }
      ],
      bodyHtml: `
        <div class="bento-grid-2">
          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">1. 현재 공유된 화면 미리보기</div>
                <div class="panel-desc">캡처된 화면을 기반으로 핵심 내용을 추출합니다.</div>
              </div>
              <div style="display:flex;gap:6px;">
                <span class="btn primary">🖥️ 내 화면 캡처하기</span>
                <span class="btn">📷 카메라 연결</span>
              </div>
            </div>
            <div style="flex:1;background:#f3f4f6;border:1px solid #d1d5db;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
              <img src="${liveArtCraftDataUrl}" style="width:100%;height:100%;object-fit:contain;" />
            </div>
          </section>

          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">2. 생성된 6종 오피스 문서 다운로드</div>
                <div class="panel-desc">원하시는 파일 형식을 클릭하여 바로 열거나 다운로드합니다.</div>
              </div>
              <span class="btn primary">6종 문서 일괄 생성</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              ${[
                { icon: '📘', fmt: 'MS Word 보고서 (.docx)', file: '2026-10-23_Report.docx', size: '표·제목 스타일 자동 적용' },
                { icon: '📊', fmt: 'PowerPoint 발표자료 (.pptx)', file: '2026-10-23_Deck.pptx', size: '핵심 요약 슬라이드 조판' },
                { icon: '📕', fmt: '결재·인쇄용 PDF (.pdf)', file: '2026-10-23_Brief.pdf', size: 'A4 규격 레이아웃 최적화' },
                { icon: '📝', fmt: '마크다운 문서 (.md)', file: '2026-10-23_Note.md', size: '옵시디언 & IDE 호환' },
                { icon: '🖼️', fmt: '원본 화면 스냅샷 (.png)', file: '2026-10-23_Capture.png', size: '1920×1080 고해상도 이미지' },
                { icon: '🎬', fmt: '음성 설명 브리핑 (.webm)', file: '2026-10-23_Briefing.webm', size: '현수 HD 음성 해설 포함' }
              ].map((f, idx) => `
                <div class="item-card ${idx === 0 ? 'active' : ''}" style="flex-direction:column;align-items:flex-start;gap:6px;">
                  <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
                    <strong style="font-size:13px;color:#111827;">${f.icon} ${f.fmt}</strong>
                    <span class="chip green">완료</span>
                  </div>
                  <div style="font-family:monospace;font-size:11.5px;color:#374151;">${f.file}</div>
                  <div style="font-size:11.5px;color:#6b7280;">${f.size}</div>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      `
    },

    // 09: REA 역공학 & 본사 5대 마스터 스킬
    {
      file: 'mockup_09_rea_reverse_engineering_studio.png',
      screenNum: '09',
      badge: 'REA 코드 역공학 & 본사 5대 핵심 스킬',
      navActive: 'BRAIN',
      title: '🔬 REA 역공학 블루프린트 분석기 & 본사 5대 핵심 스킬',
      subtitle: '복잡한 코드나 외부 프로그램의 구조를 4단계로 깔끔하게 요약하고, 본사 5대 자동화 스킬을 원클릭으로 실행합니다.',
      kpis: [
        { label: 'REA 역공학 엔진', value: 'rea-agents 설치됨', badge: '정상 작동', sub: 'github.com/morluto/rea 정본 연동' },
        { label: '분석된 파일 수', value: '148개 소스 파일', badge: '0.04초 소요', sub: 'ArtCraft 코어 및 AI 연동 구조 분석' },
        { label: '추출된 핵심 기능', value: '클래스 24 · 함수 86', badge: '설계도 복원', sub: '제어 프로토콜 및 데이터 구조 자동 정리' },
        { label: '본사 5대 핵심 스킬', value: '5종 모두 정상', badge: '즉시 실행', sub: '지식 검색 · 원본 보호 · 코드 품질 검사' }
      ],
      bodyHtml: `
        <div class="bento-grid-2">
          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">1. REA 4단계 역공학 요약 리포트</div>
                <div class="panel-desc">외부 프로그램의 내부 구조를 읽기 쉬운 문서로 자동 정리합니다.</div>
              </div>
              <span class="btn primary">역공학 분석 실행</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
              ${[
                { s: '1단계 · 구조 파악', v: '148개 파일', d: '언어·폴더 구성 확인' },
                { s: '2단계 · 기능 분해', v: '86개 함수', d: '핵심 제어 명령어 추출' },
                { s: '3단계 · 패턴 분류', v: 'Rust 코어', d: '실시간 통신 규격 파악' },
                { s: '4단계 · 문서 생성', v: '설계도 완성', d: '마크다운 보고서 저장' }
              ].map(st => `
                <div class="item-card" style="flex-direction:column;align-items:flex-start;gap:4px;">
                  <span style="font-size:11px;color:#6b7280;font-weight:700;">${st.s}</span>
                  <strong style="font-size:14px;color:#111827;">${st.v}</strong>
                  <span style="font-size:11px;color:#6b7280;">${st.d}</span>
                </div>
              `).join('')}
            </div>
            <div style="flex:1;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;font-family:monospace;font-size:12px;color:#18181b;line-height:1.7;">
              # REA 역공학 분석 요약 보고서 (ArtCraft 13종)<br/>
              - 분석 경로: C:/BeausCreators/05.BSC_Skill_Warehouse/.../artcraft-suite<br/>
              - 발견된 제어 방식: 로컬 포트(--control 17801~17813) 실시간 화면 캡처 및 마우스 제어<br/>
              - 발견된 AI 공유 방식: %LOCALAPPDATA%/ArtCraft/ai/connections.json<br/>
              - 결론: 자비스 UI 창 내부에 실시간 제어 화면 뷰포트로 완벽 통합 완료
            </div>
          </section>

          <section class="bento-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">2. 본사 5대 핵심 스킬 실행</div>
                <div class="panel-desc">필요한 관리 기능을 버튼 하나로 실행합니다.</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:9px;">
              ${[
                { name: '⚡ 핵심 팩트 핀셋 검색 (Micro-Knowledge)', desc: '전사 문서에서 필요한 3~5줄 핵심 내용만 0.1초 만에 추출' },
                { name: '🔍 문맥 기반 지식 검색 (Semantic Search)', desc: '단어가 정확히 일치하지 않아도 의미 기반으로 관련 문서 검색' },
                { name: '🛡️ 본사 원본 보호 잠금 (Core-Lock Guard)', desc: '본사 중요 문서의 무단 수정 및 파일 유실 100% 차단' },
                { name: '✅ 코드 품질 & 보안 검사 (Quality Gate)', desc: '오류 여부와 시크릿 키 노출 여부를 즉시 점검' },
                { name: '🔄 본사·지점 무손실 동기화 (Fast Data Sync)', desc: '작업일지와 보고서를 누락 없이 양방향 동기화' }
              ].map((sk, idx) => `
                <div class="item-card ${idx === 0 ? 'active' : ''}">
                  <div>
                    <strong style="font-size:13px;color:#111827;">${sk.name}</strong>
                    <div style="font-size:11.5px;color:#6b7280;margin-top:2px;">${sk.desc}</div>
                  </div>
                  <span class="btn">실행</span>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
      `
    },

    // 10: 전체 도구 허브 & 대표님 승인 모달
    {
      file: 'mockup_10_aistudio_master_hub.png',
      screenNum: '10',
      badge: '전체 실무 도구 허브 & 실행 승인 알림창',
      navActive: 'BRAIN',
      title: '⚡ 자비스 전체 실무 도구 카탈로그 & 컴퓨터 제어 승인 알림창',
      subtitle: '그동안 구축한 모든 기능들을 복잡한 장식 없이 깔끔한 화이트 카드로 정리하고, 중요 작업 시 대표님 승인 알림창을 띄웁니다.',
      kpis: [
        { label: '탑재된 전체 도구 모듈', value: '18개 모듈 완비', badge: '누락 없음', sub: '음성 · 문서 · 디자인 · 역공학 · 3D · 바이오' },
        { label: '연결된 크리에이티브 앱', value: 'ArtCraft 13종 전체', badge: '즉시 실행', sub: '포토샵·일러스트·프리미어·피그마·오피스 대체' },
        { label: '컴퓨터 제어 안전장치', value: '사전 승인 후 실행', badge: '안전 보호', sub: '중요 명령은 반드시 대표님 확인 후 작동' },
        { label: '접속 주소', value: 'bsc-javis-dev.web.app', badge: '온라인', sub: 'PC와 아이패드 어디서나 동일한 화면 제공' }
      ],
      bodyHtml: `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;flex:1;">
          ${[
            { c: '크리에이티브 제어', t: '🎨 ArtCraft 13종 실시간 제어', d: 'PhotoCraft·VectorCraft 화면을 창 안에서 보며 마우스·레이어 직접 제어' },
            { c: '음성 및 대화', t: '🎙️ 96kbps 자연 음성 스튜디오', d: '기계음 없는 현수·선희·인준 HD 아나운서 목소리 설정 및 낭독' },
            { c: '문서 자동화', t: '👁️ 화면 공유 & 6종 오피스 변환', d: '현재 화면과 내용을 Word·PPT·PDF·MD 파일로 원클릭 저장' },
            { c: '3D 및 그래픽', t: '🧊 360° 캐릭터 & Blender 연동', d: '3D 캐릭터 뷰어 및 블렌더 씬 제어 파이프라인' },
            { c: '코드 역공학', t: '🔬 REA 역공학 블루프린트', d: '외부 오픈소스와 프로그램 구조를 분석해 설계 문서로 변환' },
            { c: '바이오 및 시뮬레이션', t: '🧬 3D 단백질 구조 & 모의훈련', d: 'AlphaFold 분자 구조 뷰어 및 비즈니스 성과 시뮬레이터' },
            { c: '성능 벤치마크', t: '📊 로컬 AI 모델 속도 비교', d: '설치된 Gemma 4 모델들의 응답 속도와 메모리 사용량 확인' },
            { c: '에이전트 관리', t: '🏛️ 26인 에이전트 회의 & 조직도', d: '부서별 전문 에이전트 호출 및 회의록 자동 작성' },
            { c: '보안 및 검증', t: '🛡️ 원본 보호 & 100점 시스템 점검', d: '본사 데이터 유실 방지 잠금 및 전체 기능 정상 작동 검산' }
          ].map((card, idx) => `
            <div class="bento-panel" style="padding:16px 18px;justify-content:space-between;${idx === 0 ? 'border:1.5px solid #18181b;' : ''}">
              <div>
                <span class="chip">${card.c}</span>
                <div style="font-size:14.5px;font-weight:800;color:#111827;margin-top:8px;">${card.t}</div>
                <div style="font-size:12px;color:#6b7280;margin-top:5px;line-height:1.45;">${card.d}</div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #f3f4f6;">
                <span style="font-size:11.5px;color:#047857;font-weight:600;">● 정상 작동</span>
                <span class="btn ${idx === 0 ? 'primary' : ''}">열기 →</span>
              </div>
            </div>
          `).join('')}
        </div>
      `,
      floatingModalHtml: `
        <div style="position:absolute;right:44px;bottom:84px;width:440px;background:#ffffff;border:1.5px solid #18181b;border-radius:16px;padding:20px;z-index:40;box-shadow:0 20px 50px rgba(0,0,0,0.16);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="chip dark">🛡️ 컴퓨터 제어 실행 확인</span>
            <span style="font-size:11px;color:#6b7280;">대표님 승인 필요</span>
          </div>
          <div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:4px;">PhotoCraft 실행 및 실시간 제어 연결</div>
          <div style="font-size:12.5px;color:#4b5563;margin-bottom:10px;">로컬 포트(:17801)를 통해 PhotoCraft 프로그램을 실행하고 화면을 공유합니다.</div>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-family:monospace;font-size:11.5px;color:#18181b;margin-bottom:12px;">
            photocraft.exe --control 17801
          </div>
          <div style="display:flex;gap:8px;justify-content:flex-end;">
            <span class="btn">취소</span>
            <span class="btn primary">✓ 승인 및 실행</span>
          </div>
        </div>
      `
    }
  ];

  console.log('[1/2] Rendering 10 Simple, Monotone, Bright Minimal 1920x1080 PNG Mockups...');
  for (const sc of screens) {
    const htmlPath = path.join(PUBLIC_MOCKUP_DIR, sc.file.replace(/\.png$/, '.html'));
    const pngPublicPath = path.join(PUBLIC_MOCKUP_DIR, sc.file);
    const pngArtifactPath = path.join(ARTIFACT_DIR, sc.file);

    const htmlContent = buildLightMinimalFrame(sc);
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');

    if (EDGE_EXE) {
      const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
      execFileSync(EDGE_EXE, [
        '--headless',
        '--disable-gpu',
        '--hide-scrollbars',
        '--window-size=1920,1080',
        `--screenshot=${pngPublicPath}`,
        fileUrl
      ], { stdio: 'ignore', timeout: 25000 });

      if (fs.existsSync(pngPublicPath)) {
        fs.copyFileSync(pngPublicPath, pngArtifactPath);
        const stat = fs.statSync(pngPublicPath);
        console.log(`  -> Captured ${sc.file} (${(stat.size / 1024).toFixed(1)} KB)`);
      }
    }
  }

  // Update interactive gallery page in bright minimal style
  const galleryHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>BSC J.A.R.V.I.S. OS — 심플 모노톤 라이트 대시보드 10대 시안 갤러리</title>
  <style>
    body { background: #f4f5f7; color: #18181b; font-family: 'Pretendard', sans-serif; margin: 0; padding: 36px; }
    h1 { font-size: 26px; font-weight: 800; color: #111827; margin-bottom: 6px; }
    p.sub { color: #6b7280; font-size: 14px; margin-bottom: 28px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
    .card-head { padding: 14px 18px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
    .card-head strong { font-size: 15px; color: #111827; }
    .card-head span { font-size: 12px; color: #4b5563; background: #f3f4f6; padding: 3px 9px; border-radius: 6px; font-weight: 600; }
    .card img { width: 100%; display: block; }
  </style>
</head>
<body>
  <h1>☀️ BSC J.A.R.V.I.S. OS — 단순하고 밝은 심플 모노톤 대시보드 10대 시안 (1920×1080)</h1>
  <p class="sub">파란색·네온색과 어두운 배경을 제거하고, 눈이 편안한 화이트(#FFFFFF) · 소프트 그레이(#F4F5F7) · 차콜 블랙(#18181B) 모노톤으로 설계한 10대 화면 시안입니다.</p>
  <div class="grid">
    ${screens.map(s => `
      <div class="card">
        <div class="card-head">
          <strong>시안 #${s.screenNum}. ${s.badge}</strong>
          <span>심플 라이트 모노톤 · 1920×1080</span>
        </div>
        <img src="/data/design_mockups/${s.file}" alt="${s.badge}" />
      </div>
    `).join('')}
  </div>
</body>
</html>`;
  fs.writeFileSync(path.join(WORKSPACE_DIR, 'public', 'modern-design-mockups.html'), galleryHtml, 'utf8');
  console.log('[2/2] Completed all 10 bright minimal monotone mockups!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
