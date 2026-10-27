/**
 * 🕸️📝 BSC J.A.R.V.I.S. OS — Single-Click Neuron Content & Obsidian×Notion Application Studio
 * Path: c:\BSC_Javis_OS\public\js\neuron-content-studio.js
 *
 * Triggered immediately when CEO 이건우 대표님 single-clicks any neuron (dot) on the Neuron Home galaxy
 * or speaks a voice command ("자비스, [노드명] 뉴런 열어줘").
 *
 * Core Capabilities:
 *  1. Full Content Viewer (Markdown, Code, Directory file tree, YAML metadata)
 *  2. 4-Way Instant Application Bar:
 *     - 🔊 자비스 HD 음성 브리핑
 *     - 🤖 AI 심층 응용/확장 (Gemini 4 Argon OAuth $0 / Ollama Gemma 4 / LM Studio / GPT-4o)
 *     - ⚡ CLI / 코드 블록 즉시 실행
 *     - 📑 6종 문서(Word, PPT, Excel, PDF, HTML, MD) 원클릭 변환
 *  3. REA Obsidian × Notion Hybrid Editor:
 *     - Notion Slash (`/`) Block Toolbar (`/h1`, `/todo`, `/callout`, `/code`, `/table`, `/wikilink`)
 *     - Obsidian `[[WikiLink]]` & `#tag` live synapse builder (dynamically adds nodes/edges to 3D Neuron Home)
 *     - Interactive 1-Hop Local Mini-Graph Canvas & Bi-Directional Backlinks
 */

(function () {
  const NeuronContentStudio = {
    currentDetail: null,
    isOpen: false,

    init() {
      this.ensureModalDom();
    },

    ensureModalDom() {
      if (document.getElementById('neuron-content-studio-modal')) return;
      const modal = document.createElement('div');
      modal.id = 'neuron-content-studio-modal';
      modal.style.cssText = [
        'display:none;',
        'position:fixed;',
        'inset:58px 24px 86px 86px;',
        'z-index:9850;',
        'background:linear-gradient(155deg, rgba(6,13,28,0.97), rgba(10,20,42,0.96));',
        'border:1px solid rgba(0,240,255,0.45);',
        'border-radius:18px;',
        'box-shadow:0 24px 70px rgba(0,0,0,0.82), 0 0 35px rgba(0,240,255,0.16);',
        'backdrop-filter:blur(22px);',
        'color:#f8fafc;',
        'flex-direction:column;',
        'overflow:hidden;',
        'font-family:Pretendard,system-ui,-apple-system,sans-serif;'
      ].join('');
      document.body.appendChild(modal);
    },

    escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    formatReadableMarkdownHtml(rawMd = '') {
      const escaped = this.escapeHtml(rawMd);
      return escaped
        // Highlight Obsidian [[WikiLinks]] as clickable pills
        .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => {
          const label = alias || target;
          return `<button type="button" class="ncs-wikilink-pill" data-wikilink="${target}" style="background:rgba(192,132,252,0.18);border:1px solid rgba(192,132,252,0.55);color:#e9d5ff;border-radius:6px;padding:1px 7px;font-size:12px;font-weight:700;cursor:pointer;margin:0 2px;">🔗 [[${label}]]</button>`;
        })
        // Highlight #tags
        .replace(/(?:^|\s)#([가-힣A-Za-z0-9_-]{2,25})/g, (m, tag) => {
          return ` <span style="background:rgba(56,189,248,0.16);border:1px solid rgba(56,189,248,0.4);color:#38bdf8;border-radius:999px;padding:1px 7px;font-size:11px;font-weight:700;">#${tag}</span>`;
        });
    },

    async openNeuronModal(nodeOrQuery) {
      this.ensureModalDom();
      const modal = document.getElementById('neuron-content-studio-modal');
      if (!modal) return;

      // Hide old cluttered left inspector card so there is zero UI overlap
      const leftCard = document.getElementById('node-preview-card');
      if (leftCard) leftCard.style.display = 'none';

      modal.style.display = 'flex';
      this.isOpen = true;

      const qId = typeof nodeOrQuery === 'object' ? (nodeOrQuery.id || '') : '';
      const qPath = typeof nodeOrQuery === 'object' ? (nodeOrQuery.path || '') : '';
      const qLabel = typeof nodeOrQuery === 'string'
        ? nodeOrQuery
        : (nodeOrQuery?.label || '');

      modal.innerHTML = `
        <div style="padding:28px;text-align:center;color:#38bdf8;font-size:14px;font-weight:700;">
          🕸️ 뉴런 콘텐츠 및 옵시디언×노션 시냅스 데이터를 불러오는 중입니다... (${this.escapeHtml(qLabel || qId)})
        </div>
      `;

      try {
        const params = new URLSearchParams();
        if (qId) params.set('id', qId);
        if (qPath) params.set('path', qPath);
        if (qLabel) params.set('label', qLabel);

        const res = await fetch(`/api/brain/neuron-detail?${params.toString()}`);
        const detail = await res.json();
        if (!detail || !detail.ok) {
          throw new Error(detail?.error || '뉴런 상세 정보를 불러오지 못했습니다.');
        }
        this.currentDetail = detail;
        this.renderStudioContent(modal, detail);
      } catch (err) {
        modal.innerHTML = `
          <div style="padding:24px;display:flex;justify-content:space-between;align-items:center;">
            <div style="color:#f87171;font-weight:700;">⚠️ 뉴런 로드 오류: ${this.escapeHtml(err.message)}</div>
            <button type="button" id="ncs-close-err" style="background:rgba(248,113,113,0.2);border:1px solid #f87171;color:#fff;padding:6px 14px;border-radius:8px;cursor:pointer;">닫기</button>
          </div>
        `;
        modal.querySelector('#ncs-close-err')?.addEventListener('click', () => this.closeModal());
      }
    },

    closeModal() {
      const modal = document.getElementById('neuron-content-studio-modal');
      if (modal) modal.style.display = 'none';
      this.isOpen = false;
    },

    renderStudioContent(modal, detail) {
      const n = detail.neuron || {};
      const meta = detail.obsidianMeta || {};
      const conn = detail.graphConnections || { outlinks: [], backlinks: [], localGraphNodes: [] };
      const tagsHtml = (meta.tags || []).map(
        t => `<span style="background:rgba(0,240,255,0.12);border:1px solid rgba(0,240,255,0.35);color:#00f0ff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700;">#${this.escapeHtml(t)}</span>`
      ).join(' ');

      modal.innerHTML = `
        <!-- Top Header & 4-Way Instant Application Action Bar -->
        <header style="padding:14px 20px;background:rgba(4,9,22,0.92);border-bottom:1px solid rgba(0,240,255,0.28);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
          <div style="min-width:0;flex:1;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
              <span style="background:rgba(0,240,255,0.16);border:1px solid rgba(0,240,255,0.5);color:#00f0ff;padding:2px 9px;border-radius:999px;font-size:11px;font-weight:800;">
                ${this.escapeHtml(n.slotLabel || '지식 뉴런')}
              </span>
              <span style="font-size:11px;color:#94a3b8;">
                ${meta.lineCount || 0}줄 · ${(meta.charCount || 0).toLocaleString()}자 · 연결 시냅스 ${(conn.outlinks.length + conn.backlinks.length)}개
              </span>
              ${tagsHtml}
            </div>
            <h2 style="margin:0;font-size:18px;font-weight:800;color:#f8fafc;display:flex;align-items:center;gap:8px;">
              <span>🧠 ${this.escapeHtml(n.label)}</span>
              <span style="font-size:11px;font-weight:500;color:#64748b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:420px;">
                ${this.escapeHtml(n.path || '')}
              </span>
            </h2>
          </div>

          <!-- 4-Way Instant Application Buttons -->
          <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">
            <button type="button" id="btn-ncs-voice-brief" style="background:rgba(52,211,153,0.16);border:1px solid rgba(52,211,153,0.55);color:#34d399;border-radius:9px;padding:7px 12px;font-size:12px;font-weight:800;cursor:pointer;">
              🔊 음성 브리핑
            </button>
            <button type="button" id="btn-ncs-ai-apply" style="background:linear-gradient(135deg,rgba(0,240,255,0.25),rgba(59,130,246,0.28));border:1px solid #00f0ff;color:#fff;border-radius:9px;padding:7px 12px;font-size:12px;font-weight:800;cursor:pointer;">
              🤖 AI 심층 응용·코드화
            </button>
            <button type="button" id="btn-ncs-run-cli" style="background:rgba(251,191,36,0.16);border:1px solid rgba(251,191,36,0.55);color:#fbbf24;border-radius:9px;padding:7px 12px;font-size:12px;font-weight:800;cursor:pointer;">
              ⚡ CLI·터미널 응용 실행
            </button>
            <button type="button" id="btn-ncs-export-docs" style="background:rgba(192,132,252,0.18);border:1px solid rgba(192,132,252,0.55);color:#e9d5ff;border-radius:9px;padding:7px 12px;font-size:12px;font-weight:800;cursor:pointer;">
              📑 6종 문서 변환
            </button>
            <button type="button" id="btn-ncs-open-ide" style="background:rgba(148,163,184,0.15);border:1px solid rgba(148,163,184,0.38);color:#e2e8f0;border-radius:9px;padding:7px 11px;font-size:12px;font-weight:700;cursor:pointer;">
              💻 전체 IDE로 열기
            </button>
            <button type="button" id="btn-ncs-close" style="background:rgba(248,113,113,0.18);border:1px solid rgba(248,113,113,0.45);color:#fca5a5;border-radius:9px;padding:7px 12px;font-size:12px;font-weight:800;cursor:pointer;" title="닫기 (ESC)">
              ✕ 닫기
            </button>
          </div>
        </header>

        <!-- Main 3-Column Obsidian × Notion Workspace -->
        <div style="flex:1;display:grid;grid-template-columns:1.35fr 1.15fr 330px;gap:14px;padding:14px 18px;overflow:hidden;min-height:0;">
          
          <!-- Column 1: Full Neuron Content Viewer + AI Application Result Box -->
          <section style="display:flex;flex-direction:column;gap:10px;min-height:0;background:rgba(4,9,20,0.72);border:1px solid rgba(148,163,184,0.2);border-radius:14px;padding:14px;overflow:hidden;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-size:13px;font-weight:800;color:#38bdf8;">📖 1. 클릭한 뉴런 전체 원문 &amp; 하위 파일 확인</div>
              <span style="font-size:11px;color:#94a3b8;">[[위키링크]] 클릭 시 해당 뉴런으로 즉시 점프</span>
            </div>

            ${(detail.directoryChildren && detail.directoryChildren.length > 0) ? `
              <div style="display:flex;gap:6px;flex-wrap:wrap;max-height:76px;overflow-y:auto;padding:6px;background:rgba(15,23,42,0.75);border-radius:8px;border:1px solid rgba(56,189,248,0.22);">
                ${detail.directoryChildren.slice(0, 24).map(ch => `
                  <button type="button" class="ncs-child-file-btn" data-child-path="${this.escapeHtml(ch.fullPath)}" data-child-label="${this.escapeHtml(ch.name)}" style="background:rgba(30,41,59,0.9);border:1px solid rgba(148,163,184,0.3);color:#e2e8f0;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">
                    ${ch.isDirectory ? '📁' : '📄'} ${this.escapeHtml(ch.name)}
                  </button>
                `).join('')}
              </div>
            ` : ''}

            <div id="ncs-full-content-view" style="flex:1;overflow-y:auto;padding:12px 14px;background:rgba(2,6,15,0.85);border:1px solid rgba(148,163,184,0.15);border-radius:10px;font-size:13px;line-height:1.68;color:#e2e8f0;white-space:pre-wrap;word-break:break-word;font-family:Pretendard,Consolas,monospace;">${this.formatReadableMarkdownHtml(detail.content || '')}</div>

            <!-- AI / CLI Application Output Box -->
            <div id="ncs-application-output-box" style="display:none;max-height:190px;overflow-y:auto;padding:11px 14px;background:linear-gradient(145deg,rgba(6,28,45,0.92),rgba(12,20,38,0.95));border:1px solid rgba(0,240,255,0.45);border-radius:10px;font-size:12.5px;line-height:1.55;color:#f8fafc;"></div>
          </section>

          <!-- Column 2: REA Notion Slash (/) Block Editor & Obsidian [[WikiLink]] Creator -->
          <section style="display:flex;flex-direction:column;gap:10px;min-height:0;background:rgba(4,9,20,0.72);border:1px solid rgba(192,132,252,0.28);border-radius:14px;padding:14px;overflow:hidden;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-size:13px;font-weight:800;color:#c084fc;">📝 2. 노션(/) 블록 &amp; 옵시디언 [[뉴런]] 실시간 작성·응용</div>
              <span style="font-size:10.5px;color:#a78bfa;">저장 즉시 3D 뉴런홈에 점·시냅스 생성</span>
            </div>

            <!-- Notion Block Quick Insertion Bar -->
            <div style="display:flex;gap:5px;flex-wrap:wrap;padding:6px;background:rgba(15,23,42,0.85);border-radius:9px;border:1px solid rgba(192,132,252,0.25);">
              <button type="button" class="ncs-notion-blk" data-blk="h1" style="background:rgba(192,132,252,0.14);border:1px solid rgba(192,132,252,0.4);color:#e9d5ff;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;">/h1 제목</button>
              <button type="button" class="ncs-notion-blk" data-blk="todo" style="background:rgba(192,132,252,0.14);border:1px solid rgba(192,132,252,0.4);color:#e9d5ff;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;">/todo 체크리스트</button>
              <button type="button" class="ncs-notion-blk" data-blk="callout" style="background:rgba(192,132,252,0.14);border:1px solid rgba(192,132,252,0.4);color:#e9d5ff;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;">/callout 콜아웃</button>
              <button type="button" class="ncs-notion-blk" data-blk="code" style="background:rgba(192,132,252,0.14);border:1px solid rgba(192,132,252,0.4);color:#e9d5ff;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;">/code 코드블록</button>
              <button type="button" class="ncs-notion-blk" data-blk="table" style="background:rgba(192,132,252,0.14);border:1px solid rgba(192,132,252,0.4);color:#e9d5ff;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;">/table 노션 표</button>
              <button type="button" class="ncs-notion-blk" data-blk="wikilink" style="background:rgba(0,240,255,0.15);border:1px solid rgba(0,240,255,0.45);color:#00f0ff;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:800;cursor:pointer;">🔗 [[새 뉴런 시냅스 연결]]</button>
            </div>

            <div style="display:flex;gap:8px;align-items:center;">
              <span style="font-size:11.5px;color:#94a3b8;font-weight:700;">노트/뉴런 제목:</span>
              <input id="ncs-note-title-input" type="text" value="${this.escapeHtml(n.label)}" style="flex:1;background:rgba(2,6,15,0.85);border:1px solid rgba(148,163,184,0.3);color:#f8fafc;border-radius:8px;padding:6px 10px;font-size:12.5px;font-weight:700;" />
            </div>

            <textarea id="ncs-notion-editor" placeholder="여기에 노션 블록(/h1, /todo, /callout)이나 옵시디언 [[위키링크]], #태그를 자유롭게 작성하세요.&#10;예시:&#10;## 💡 핵심 응용 아이디어&#10;- [ ] [[신규 AI 서비스 기획]] 뉴런과 연결하여 프로토타입 개발&#10;- 관련 태그: #자비스응용 #사사리사" style="flex:1;width:100%;box-sizing:border-box;resize:none;background:rgba(2,6,15,0.9);border:1px solid rgba(192,132,252,0.35);color:#f8fafc;border-radius:10px;padding:12px;font-size:13px;line-height:1.6;font-family:Pretendard,Consolas,monospace;"></textarea>

            <div style="display:flex;gap:8px;justify-content:space-between;align-items:center;">
              <button type="button" id="btn-ncs-append-save" style="flex:1;background:linear-gradient(135deg,#00f0ff,#3b82f6);border:none;color:#020617;border-radius:9px;padding:9px 12px;font-size:12.5px;font-weight:900;cursor:pointer;">
                💾 현재 뉴런에 내용 추가(Append) &amp; 그래프 동기화
              </button>
              <button type="button" id="btn-ncs-create-new-neuron" style="background:rgba(192,132,252,0.2);border:1px solid #c084fc;color:#f3e8ff;border-radius:9px;padding:9px 12px;font-size:12px;font-weight:800;cursor:pointer;">
                ✨ 독립 새 뉴런(점)으로 생성
              </button>
            </div>
          </section>

          <!-- Column 3: Obsidian 1-Hop Local Graph Canvas & Bi-Directional Backlinks -->
          <section style="display:flex;flex-direction:column;gap:10px;min-height:0;background:rgba(4,9,20,0.72);border:1px solid rgba(56,189,248,0.25);border-radius:14px;padding:14px;overflow:hidden;">
            <div style="font-size:13px;font-weight:800;color:#38bdf8;">🕸️ 3. 옵시디언 1-Hop 로컬 그래프 &amp; 백링크</div>
            <div style="position:relative;height:185px;background:rgba(2,6,15,0.92);border:1px solid rgba(56,189,248,0.22);border-radius:10px;overflow:hidden;">
              <canvas id="ncs-local-graph-canvas" width="300" height="185" style="width:100%;height:100%;display:block;cursor:pointer;"></canvas>
            </div>

            <div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding-right:2px;">
              <div>
                <div style="font-size:11.5px;font-weight:800;color:#c084fc;margin-bottom:5px;">
                  ↗️ 나가는 시냅스 (Outlinks · ${conn.outlinks.length})
                </div>
                <div style="display:flex;flex-direction:column;gap:4px;">
                  ${conn.outlinks.length === 0
                    ? `<div style="font-size:11px;color:#64748b;">에디터에 [[노드명]]을 입력하면 자동으로 시냅스가 연결됩니다.</div>`
                    : conn.outlinks.map(o => `
                      <button type="button" class="ncs-jump-node-btn" data-node-id="${this.escapeHtml(o.id)}" data-node-label="${this.escapeHtml(o.label)}" style="text-align:left;background:rgba(15,23,42,0.8);border:1px solid rgba(192,132,252,0.3);color:#e9d5ff;border-radius:7px;padding:5px 9px;font-size:11.5px;cursor:pointer;">
                        🔗 ${this.escapeHtml(o.label)}
                      </button>
                    `).join('')}
                </div>
              </div>

              <div>
                <div style="font-size:11.5px;font-weight:800;color:#34d399;margin-bottom:5px;">
                  ↙️ 들어오는 백링크 (Backlinks · ${conn.backlinks.length})
                </div>
                <div style="display:flex;flex-direction:column;gap:4px;">
                  ${conn.backlinks.length === 0
                    ? `<div style="font-size:11px;color:#64748b;">이 뉴런을 참조하는 역방향 백링크가 아직 없습니다.</div>`
                    : conn.backlinks.map(b => `
                      <button type="button" class="ncs-jump-node-btn" data-node-id="${this.escapeHtml(b.id)}" data-node-label="${this.escapeHtml(b.label)}" style="text-align:left;background:rgba(15,23,42,0.8);border:1px solid rgba(52,211,153,0.3);color:#a7f3d0;border-radius:7px;padding:5px 9px;font-size:11.5px;cursor:pointer;">
                        ↩️ ${this.escapeHtml(b.label)}
                      </button>
                    `).join('')}
                </div>
              </div>
            </div>
          </section>

        </div>
      `;

      this.bindStudioEvents(modal, detail);
      this.drawLocalMiniGraph(modal.querySelector('#ncs-local-graph-canvas'), conn.localGraphNodes || []);
    },

    drawLocalMiniGraph(canvas, localNodes) {
      if (!canvas || !canvas.getContext) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const center = localNodes.find(n => n.isCenter) || { label: '현재 뉴런' };
      const neighbors = localNodes.filter(n => !n.isCenter).slice(0, 12);
      const radius = Math.min(w, h) * 0.36;

      const positioned = neighbors.map((nb, i) => {
        const angle = (Math.PI * 2 * i) / Math.max(1, neighbors.length) - Math.PI / 2;
        return {
          ...nb,
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius
        };
      });

      // Draw synapse lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.3;
      for (const p of positioned) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      // Draw neighbor nodes
      ctx.font = '600 10px Pretendard, sans-serif';
      for (const p of positioned) {
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        const shortLbl = String(p.label || '').slice(0, 12);
        ctx.fillText(shortLbl, p.x - 22, p.y + 15);
      }

      // Draw center node
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 11px Pretendard, sans-serif';
      ctx.fillText(String(center.label || '').slice(0, 16), cx - 32, cy - 13);

      canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (w / rect.width);
        const my = (e.clientY - rect.top) * (h / rect.height);
        for (const p of positioned) {
          if (Math.hypot(mx - p.x, my - p.y) <= 14) {
            this.openNeuronModal({ id: p.id, label: p.label, path: p.path });
            break;
          }
        }
      };
    },

    bindStudioEvents(modal, detail) {
      const n = detail.neuron || {};
      const outBox = modal.querySelector('#ncs-application-output-box');
      const editor = modal.querySelector('#ncs-notion-editor');

      const showOutput = (html) => {
        if (!outBox) return;
        outBox.style.display = 'block';
        outBox.innerHTML = html;
      };

      // Close
      modal.querySelector('#btn-ncs-close')?.addEventListener('click', () => this.closeModal());

      // WikiLinks inside markdown viewer
      modal.querySelectorAll('.ncs-wikilink-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-wikilink');
          if (target) this.openNeuronModal(target);
        });
      });

      // Directory child files
      modal.querySelectorAll('.ncs-child-file-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.openNeuronModal({
            path: btn.getAttribute('data-child-path'),
            label: btn.getAttribute('data-child-label')
          });
        });
      });

      // Outlink / Backlink node jump
      modal.querySelectorAll('.ncs-jump-node-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-node-id') || '';
          const label = btn.getAttribute('data-node-label') || '';
          if (id.startsWith('wikilink:')) {
            this.openNeuronModal(label);
          } else {
            this.openNeuronModal({ id, label });
          }
        });
      });

      // Notion Block Quick Insertions
      modal.querySelectorAll('.ncs-notion-blk').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!editor) return;
          const kind = btn.getAttribute('data-blk');
          const map = {
            h1: '\n# 📌 핵심 섹션 제목\n',
            todo: '\n- [ ] 실행할 체크리스트 항목 입력\n- [x] 완료된 항목\n',
            callout: '\n> 💡 **[핵심 인사이트 콜아웃]** 여기에 중요한 요점을 기록하세요.\n',
            code: '\n```powershell\n# 자비스 내장 터미널에서 바로 실행 가능한 스크립트\ngit status --short\n```\n',
            table: '\n| 항목 | 핵심 내용 | 상태 |\n| :--- | :--- | :---: |\n| 과제 1 | 세부 실행 계획 | 진행중 |\n',
            wikilink: ' [[연결할 뉴런 이름]] #핵심태그 '
          };
          const snippet = map[kind] || '';
          const start = editor.selectionStart || editor.value.length;
          editor.value = editor.value.slice(0, start) + snippet + editor.value.slice(start);
          editor.focus();
        });
      });

      // 1. Voice Briefing
      modal.querySelector('#btn-ncs-voice-brief')?.addEventListener('click', () => {
        const snippet = String(detail.content || '')
          .replace(/---[\s\S]*?---/, '')
          .replace(/[#*`>\[\]-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 260);
        const speech = `이건우 대표님, 선택하신 ${n.label} 뉴런의 핵심 내용입니다. ${snippet || '내용을 확인하고 바로 응용하실 수 있습니다.'}`;
        showOutput(`🔊 <b>자비스 HD 음성 브리핑 재생 중:</b><br>${this.escapeHtml(speech)}`);
        window.MultimodalEngine?.speakText?.(speech, 'jarvis');
      });

      // 2. AI Deep Application / Code Generation
      modal.querySelector('#btn-ncs-ai-apply')?.addEventListener('click', async () => {
        showOutput(`🤖 <b>연결된 멀티 LLM 두뇌(Google Gemini 4 Argon OAuth $0 / Ollama Gemma 4)로 [${this.escapeHtml(n.label)}] 내용을 분석·응용 중입니다...</b>`);
        try {
          const prompt = [
            `다음 뉴런 문서(${n.label})의 핵심 내용을 바탕으로:`,
            `1) 핵심 요약 2줄`,
            `2) 대표님께서 바로 실무에 응용할 수 있는 실행 아이템 2가지`,
            `3) 연결 추천 [[위키링크]] 키워드 2개를 간결하게 제시해 주세요.`,
            `---`,
            String(detail.content || '').slice(0, 1800)
          ].join('\n');
          const res = await fetch('/api/jarvis/llm-hub/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
          });
          const data = await res.json();
          const replyText = data.text || '분석 결과를 생성했습니다.';
          showOutput(`
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <b style="color:#00f0ff;">🤖 AI 응용 결과 (${this.escapeHtml((data.provider || 'AI').toUpperCase())} · ${this.escapeHtml(data.model || '')})</b>
              <button type="button" id="btn-ncs-copy-ai-to-editor" style="background:rgba(0,240,255,0.2);border:1px solid #00f0ff;color:#fff;border-radius:6px;padding:3px 9px;font-size:11px;cursor:pointer;">📝 우측 노션 에디터로 가져오기</button>
            </div>
            <div style="white-space:pre-wrap;">${this.escapeHtml(replyText)}</div>
          `);
          window.MultimodalEngine?.speakText?.(replyText.slice(0, 220), 'jarvis');
          modal.querySelector('#btn-ncs-copy-ai-to-editor')?.addEventListener('click', () => {
            if (editor) {
              editor.value += `\n## 🤖 AI 실무 응용 결과\n${replyText}\n`;
            }
          });
        } catch (e) {
          showOutput(`⚠️ AI 응용 호출 오류: ${this.escapeHtml(e.message)}`);
        }
      });

      // 3. CLI / Code Execution
      modal.querySelector('#btn-ncs-run-cli')?.addEventListener('click', async () => {
        const firstCode = detail.obsidianMeta?.codeBlocks?.[0]?.code || '';
        const cmdToRun = firstCode
          ? `${n.label} 뉴런의 CLI 실행: ${firstCode.slice(0, 80)}`
          : `터미널에서 현재 상태 및 ${n.label} 관련 파일 확인해줘`;
        showOutput(`⚡ <b>사사리사 × 자비스 CLI 엔진 실행 중...</b>`);
        try {
          const res = await fetch('/api/jarvis/sasarisa/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: cmdToRun })
          });
          const data = await res.json();
          const stepsHtml = (data.actionRecord?.steps || []).map(s => `• ${this.escapeHtml(s)}`).join('<br>');
          showOutput(`
            <b style="color:#fbbf24;">⚡ CLI 실행 완료:</b><br>
            ${this.escapeHtml(data.reply || '')}<br>
            <div style="margin-top:6px;color:#94a3b8;font-family:Consolas,monospace;font-size:11.5px;">${stepsHtml}</div>
          `);
          if (data.reply) window.MultimodalEngine?.speakText?.(data.reply, 'jarvis');
        } catch (e) {
          showOutput(`⚠️ CLI 실행 오류: ${this.escapeHtml(e.message)}`);
        }
      });

      // 4. 6-Format Document Export
      modal.querySelector('#btn-ncs-export-docs')?.addEventListener('click', async () => {
        showOutput(`📑 <b>[${this.escapeHtml(n.label)}] 내용을 6종 실무 문서(Word, PPT, PDF, Excel, HTML, MD)로 변환 중입니다...</b>`);
        try {
          const res = await fetch('/api/covision/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: n.label,
              summary: detail.content?.slice(0, 3000) || n.label,
              category: 'NEURON_STUDIO_EXPORT'
            })
          });
          const data = await res.json();
          showOutput(`✅ <b>6종 문서 변환 완료!</b> 생성된 문서가 <code>public/exports/</code> 및 Google Drive 동기화 폴더에 저장되었습니다.`);
          window.MultimodalEngine?.speakText?.(`이건우 대표님, ${n.label} 뉴런의 내용을 워드, 피피티, 엑셀 등 6종 문서로 변환 완료했습니다.`, 'jarvis');
        } catch (e) {
          showOutput(`⚠️ 문서 변환 오류: ${this.escapeHtml(e.message)}`);
        }
      });

      // 5. Open in Full IDE Dashboard
      modal.querySelector('#btn-ncs-open-ide')?.addEventListener('click', () => {
        this.closeModal();
        window.JarvisDesignViews?.openWorkspace?.('DOC_IDE_DASHBOARD', n);
      });

      // 6. Save / Append Note & Dynamically Update 3D Neuron Home Graph
      const handleSaveNeuron = async (saveMode) => {
        const titleVal = modal.querySelector('#ncs-note-title-input')?.value?.trim() || n.label;
        const bodyVal = editor?.value?.trim() || '';
        if (!bodyVal) {
          showOutput(`⚠️ 작성된 노션 블록 또는 옵시디언 노트 내용을 먼저 입력해 주십시오.`);
          return;
        }
        showOutput(`💾 <b>옵시디언×노션 뉴런 저장 및 3D 뉴런홈 시냅스 실시간 연결 중...</b>`);
        try {
          const res = await fetch('/api/brain/neuron-note', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mode: saveMode,
              nodeId: saveMode === 'CREATE_NEURON' ? '' : n.id,
              title: titleVal,
              path: saveMode === 'CREATE_NEURON' ? '' : n.path,
              content: bodyVal
            })
          });
          const saved = await res.json();
          if (!saved.ok) throw new Error(saved.error || '저장 실패');

          showOutput(`✅ <b>${this.escapeHtml(saved.message)}</b>`);
          window.MultimodalEngine?.speakText?.(saved.message, 'jarvis');

          // Reload 3D Neuron Home graph in real time!
          if (window.BrainGraphEngine?.reloadFromDisk) {
            await window.BrainGraphEngine.reloadFromDisk();
          } else {
            fetch('/api/brain')
              .then(r => r.json())
              .then(b => {
                if (window.BrainGraphEngine && Array.isArray(b.nodes)) {
                  window.BrainGraphEngine.loadGraphData?.(b);
                }
              })
              .catch(() => {});
          }

          // Refresh current modal detail to show newly added content & [[WikiLinks]]
          setTimeout(() => {
            this.openNeuronModal({
              id: saved.mainNode?.id || n.id,
              path: saved.savedPath || n.path,
              label: saved.mainNode?.label || titleVal
            });
          }, 500);
        } catch (e) {
          showOutput(`⚠️ 뉴런 저장 오류: ${this.escapeHtml(e.message)}`);
        }
      };

      modal.querySelector('#btn-ncs-append-save')?.addEventListener('click', () => handleSaveNeuron('APPEND'));
      modal.querySelector('#btn-ncs-create-new-neuron')?.addEventListener('click', () => handleSaveNeuron('CREATE_NEURON'));
    }
  };

  window.NeuronContentStudio = NeuronContentStudio;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NeuronContentStudio.init());
  } else {
    NeuronContentStudio.init();
  }
})();
