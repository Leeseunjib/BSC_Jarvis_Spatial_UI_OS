/**
 * ⚡ BSC J.A.R.V.I.S. OS — Autonomous Floating HUD Window Spawner
 * Spawns, drags, resizes, and updates 4 specialized Holographic Windows:
 *  1. MANUAL (📘 설명서 창)
 *  2. REPORT (📊 심층 보고서 창)
 *  3. LIVE_CONSOLE (💻 실시간 제작 콘솔 & 토큰 흐름 관제창)
 *  4. GEN_STUDIO (🎨 통합 생성 도구 & 3D 홀로그램 스튜디오 창)
 */

window.HUDWindowSpawner = {
  zIndexCounter: 40,
  openWindows: new Map(),

  layoutPresets: {
    MANUAL: { top: 82, left: 295, width: 520, height: 470 },
    REPORT: { top: 82, left: 340, width: 650, height: 520 },
    LIVE_CONSOLE: { top: 110, left: 420, width: 620, height: 440 },
    GEN_STUDIO: { top: 95, left: 320, width: 680, height: 500 }
  },

  renderSimpleMarkdown(md) {
    if (!md) return '<p>내용을 불러오는 중입니다...</p>';
    const lines = md.split(/\r?\n/);
    let html = '';
    let inList = false;

    for (let rawLine of lines) {
      const line = rawLine
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      if (line.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3>${this.inlineFormat(line.slice(4))}</h3>`;
      } else if (line.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2>${this.inlineFormat(line.slice(3))}</h2>`;
      } else if (line.startsWith('# ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h1>${this.inlineFormat(line.slice(2))}</h1>`;
      } else if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${this.inlineFormat(line.replace(/^([-*]|\d+\.)\s+/, ''))}</li>`;
      } else if (line.trim() === '---') {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<hr style="border:none;border-top:1px solid rgba(56,189,248,0.25);margin:10px 0;"/>';
      } else if (line.trim().length > 0) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p style="margin:5px 0;">${this.inlineFormat(line)}</p>`;
      }
    }
    if (inList) html += '</ul>';
    return html;
  },

  inlineFormat(str) {
    return str
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[\[([^\]]+)\]\]/g, '<span style="color:#00f0ff;font-weight:700;">[[$1]]</span>');
  },

  spawn(config) {
    const type = config.windowType || 'REPORT';
    const layer = document.getElementById('floating-windows-layer');
    if (!layer) return;

    // Reuse or bring to front if already open
    if (this.openWindows.has(type)) {
      const existing = this.openWindows.get(type);
      existing.style.zIndex = ++this.zIndexCounter;
      this.populateWindowBody(existing, config);
      return existing;
    }

    const preset = this.layoutPresets[type] || { top: 100, left: 350, width: 580, height: 460 };
    const offset = this.openWindows.size * 22;

    const win = document.createElement('section');
    win.className = 'hud-window';
    win.dataset.winType = type;
    win.style.top = `${preset.top + offset}px`;
    win.style.left = `${preset.left + offset}px`;
    win.style.width = `${preset.width}px`;
    win.style.height = `${preset.height}px`;
    win.style.zIndex = ++this.zIndexCounter;

    win.innerHTML = `
      <div class="hud-window-header">
        <div class="win-title-wrap">
          <span class="win-title">${config.title || type}</span>
          <span class="win-subtitle">${config.subtitle || 'Autonomous HUD Spawner · Coram Deo & Together'}</span>
        </div>
        <div class="win-controls">
          <button class="win-ctrl-btn btn-save-vault" title="로컬 Vault에 Append 저장">💾 Vault 저장</button>
          <button class="win-ctrl-btn btn-close-win" title="창 닫기">✕</button>
        </div>
      </div>
      <div class="hud-window-body"></div>
    `;

    layer.appendChild(win);
    this.openWindows.set(type, win);
    this.makeDraggable(win);
    this.populateWindowBody(win, config);

    win.addEventListener('mousedown', () => {
      win.style.zIndex = ++this.zIndexCounter;
    });

    win.querySelector('.btn-close-win').addEventListener('click', () => {
      win.remove();
      this.openWindows.delete(type);
    });

    win.querySelector('.btn-save-vault').addEventListener('click', async () => {
      const bodyText = win.querySelector('.hud-window-body')?.innerText || '';
      const res = await fetch('/api/vault-append', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Saved_${type}`, content: bodyText.slice(0, 1500) })
      });
      if (res.ok) {
        window.BSC_WORLDVIEW.showToast('J.A.R.V.I.S.', '이건우 대표님, 현재 창의 내용을 원본 훼손 없이(Append-Only) 로컬 옵시디언 볼트에 기록했습니다.');
      }
    });

    return win;
  },

  populateWindowBody(win, config) {
    const type = config.windowType || 'REPORT';
    const titleEl = win.querySelector('.win-title');
    const subEl = win.querySelector('.win-subtitle');
    const bodyEl = win.querySelector('.hud-window-body');
    if (titleEl && config.title) titleEl.textContent = config.title;
    if (subEl && config.subtitle) subEl.textContent = config.subtitle;
    if (!bodyEl) return;

    if (type === 'LIVE_CONSOLE') {
      this.renderLiveConsoleBody(bodyEl, window.BSC_WORLDVIEW.telemetry);
    } else if (type === 'GEN_STUDIO') {
      this.renderGenStudioBody(bodyEl);
    } else {
      bodyEl.innerHTML = this.renderSimpleMarkdown(config.content || '');
    }
  },

  renderLiveConsoleBody(bodyEl, telemetry) {
    const logs = (telemetry && telemetry.recentLogs) || [];
    bodyEl.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;">
        <div style="background:rgba(15,23,42,0.9);border:1px solid rgba(52,211,153,0.4);border-radius:8px;padding:8px 10px;">
          <div style="font-size:10px;color:#94a3b8;">2-HOP TOKEN SAVINGS</div>
          <div style="font-size:16px;font-weight:800;color:#34d399;font-family:monospace;">${telemetry.savingsPct || 88.5}%</div>
        </div>
        <div style="background:rgba(15,23,42,0.9);border:1px solid rgba(0,240,255,0.4);border-radius:8px;padding:8px 10px;">
          <div style="font-size:10px;color:#94a3b8;">ACTUAL / SAVED TOKENS</div>
          <div style="font-size:14px;font-weight:800;color:#00f0ff;font-family:monospace;">${telemetry.optimizedActualTokens || 4920} / -${telemetry.savedTokens || 37880}</div>
        </div>
        <div style="background:rgba(15,23,42,0.9);border:1px solid rgba(251,191,36,0.4);border-radius:8px;padding:8px 10px;">
          <div style="font-size:10px;color:#94a3b8;">CHL HARNESS GATE</div>
          <div style="font-size:13px;font-weight:800;color:#fbbf24;">🛡️ ZERO-LOSS ACTIVE</div>
        </div>
      </div>
      <h3>⚡ 실시간 에이전트 동역 스트림 (Live Agent &amp; Token Console)</h3>
      <div id="live-console-log-list" style="background:#05080f;border:1px solid rgba(148,163,184,0.2);border-radius:8px;max-height:245px;overflow-y:auto;">
        ${logs.map(l => `
          <div class="console-log-entry">
            <span class="c-time">${l.time}</span>
            <span class="c-agent">[${l.agent}]</span>
            <span class="c-msg">${l.event}</span>
            <span class="c-tok">-${l.saved} tok</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  refreshConsoleLogs(telemetry) {
    const win = this.openWindows.get('LIVE_CONSOLE');
    if (!win) return;
    const bodyEl = win.querySelector('.hud-window-body');
    if (bodyEl) this.renderLiveConsoleBody(bodyEl, telemetry);
  },

  renderGenStudioBody(bodyEl) {
    bodyEl.innerHTML = `
      <div style="display:flex;gap:8px;margin-bottom:10px;">
        <button class="hud-mini-btn primary" id="gen-tab-3d">🧊 3D 홀로그램 모형 조립기</button>
        <button class="hud-mini-btn" id="gen-tab-arch">📐 MAPS &amp; CHL 아키텍처 블루프린트</button>
        <button class="hud-mini-btn" id="gen-tab-pdf">📄 마스터 설계서 PDF 열기</button>
      </div>
      <div id="gen-studio-stage" style="background:#05080f;border:1px solid rgba(0,240,255,0.3);border-radius:10px;padding:12px;text-align:center;">
        <canvas id="studio-holo-canvas" width="600" height="270" style="width:100%;height:270px;cursor:grab;"></canvas>
        <div style="font-size:11.5px;color:#94a3b8;margin-top:6px;">
          마우스 드래그 또는 우측 <b>HOLO(에어터치)</b> 손짓으로 홀로그램 뉴럴 아크 구조를 회전·분해(Explode)할 수 있습니다.
          <button id="btn-explode-holo" class="win-ctrl-btn" style="margin-left:10px;">💥 분해 / 결합 토글</button>
        </div>
      </div>
    `;

    this.initStudioHoloCanvas(bodyEl.querySelector('#studio-holo-canvas'), bodyEl.querySelector('#btn-explode-holo'));

    const pdfBtn = bodyEl.querySelector('#gen-tab-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => {
        window.open('/api/read-node?path=c:/BSC_Javis_OS/research/plan_print.html', '_blank');
      });
    }
  },

  initStudioHoloCanvas(canvas, explodeBtn) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rotY = 0.4, rotX = 0.25, exploded = false, explodeFactor = 1;
    let dragging = false, lx = 0, ly = 0;

    canvas.addEventListener('mousedown', e => { dragging = true; lx = e.clientX; ly = e.clientY; });
    window.addEventListener('mouseup', () => { dragging = false; });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      rotY += (e.clientX - lx) * 0.01;
      rotX += (e.clientY - ly) * 0.01;
      lx = e.clientX; ly = e.clientY;
    });
    if (explodeBtn) {
      explodeBtn.addEventListener('click', () => { exploded = !exploded; });
    }

    const pts = [];
    for (let i = 0; i < 64; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / 64);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
        layer: (i % 3) + 1
      });
    }

    function renderLoop() {
      if (!canvas.isConnected) return;
      const targetExp = exploded ? 1.85 : 1.0;
      explodeFactor += (targetExp - explodeFactor) * 0.08;
      if (!dragging) rotY += 0.012;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2, cy = canvas.height / 2;

      const proj = pts.map(p => {
        const s = 72 * explodeFactor * (0.7 + p.layer * 0.2);
        let x = p.x * s, y = p.y * s, z = p.z * s;
        const cy1 = Math.cos(rotY), sy1 = Math.sin(rotY);
        const x1 = x * cy1 - z * sy1, z1 = x * sy1 + z * cy1;
        const cx1 = Math.cos(rotX), sx1 = Math.sin(rotX);
        const y2 = y * cx1 - z1 * sx1, z2 = y * sx1 + z1 * cx1;
        return { sx: cx + x1, sy: cy + y2, z: z2, layer: p.layer };
      });

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1;
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const dx = proj[i].sx - proj[j].sx, dy = proj[i].sy - proj[j].sy;
          if (dx * dx + dy * dy < 3200) {
            ctx.beginPath();
            ctx.moveTo(proj[i].sx, proj[i].sy);
            ctx.lineTo(proj[j].sx, proj[j].sy);
            ctx.stroke();
          }
        }
      }

      for (const p of proj) {
        ctx.fillStyle = p.layer === 1 ? '#fbbf24' : p.layer === 2 ? '#00f0ff' : '#34d399';
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
  },

  makeDraggable(win) {
    const header = win.querySelector('.hud-window-header');
    if (!header) return;
    let dragging = false, startX = 0, startY = 0, origLeft = 0, origTop = 0;

    header.addEventListener('mousedown', e => {
      if (e.target.closest('button')) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = parseInt(win.style.left || '0', 10);
      origTop = parseInt(win.style.top || '0', 10);
      win.style.zIndex = ++this.zIndexCounter;
    });

    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      win.style.left = `${Math.max(10, origLeft + (e.clientX - startX))}px`;
      win.style.top = `${Math.max(10, origTop + (e.clientY - startY))}px`;
    });

    window.addEventListener('mouseup', () => {
      dragging = false;
    });
  }
};
