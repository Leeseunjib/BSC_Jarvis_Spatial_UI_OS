/**
 * 🌌 BSC J.A.R.V.I.S. OS — 6-Mode Interactive Obsidian & BSC_HQ Knowledge Galaxy Engine
 * Implements:
 *  - Zubair Trabzada's AI WORKSHOP OS visual galaxy & Top Hubs filtering
 *  - Pav (Automation Orbit) MAPS Card 5: 6 views of the SAME brain.json nodes:
 *    1) 3d (3D Galaxy Orbit)
 *    2) 2d (2D Force Layout)
 *    3) rings (Concentric Rings by Layer)
 *    4) areas (Domain Cluster Hubs)
 *    5) timeline (Modification Timeline)
 *    6) brain (Anatomical Dual-Hemisphere Brain Mesh)
 */

window.BrainGraphEngine = {
  canvas: null,
  ctx: null,
  nodes: [],
  links: [],
  neighbors: new Map(),
  viewMode: '3d',
  focusMode: false,
  selectedNode: null,
  hoveredNode: null,
  activeAreaFilter: null,
  activeKindFilter: 'all',
  searchQuery: '',

  // Camera & 3D rotation state
  camX: 0,
  camY: 0,
  zoom: 1.0,
  rotY: 0.3,
  rotX: 0.18,
  autoRotate: true,
  repelStrength: 110,
  linkDistance: 75,
  replayProgress: 1.0,

  async init() {
    this.canvas = document.getElementById('brain-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    await this.loadBrainData();
    this.bindEvents();
    requestAnimationFrame(() => this.animate());
  },

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  async loadBrainData() {
    try {
      const res = await fetch('/api/brain');
      const data = await res.json();
      this.nodes = (data.nodes || []).map((n, idx) => ({
        ...n,
        idx,
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 600,
        tx: 0,
        ty: 0,
        tz: 0,
        r: Math.max(3.5, Math.min(16, 3.2 + Math.sqrt(n.degree || 1) * 1.65))
      }));

      const idToIdx = new Map();
      this.nodes.forEach((n, i) => idToIdx.set(n.id, i));

      this.links = [];
      this.neighbors.clear();
      for (const l of (data.links || [])) {
        const si = idToIdx.get(l.s);
        const ti = idToIdx.get(l.t);
        if (si !== undefined && ti !== undefined) {
          this.links.push({ s: si, t: ti, type: l.type });
          if (!this.neighbors.has(si)) this.neighbors.set(si, new Set());
          if (!this.neighbors.has(ti)) this.neighbors.set(ti, new Set());
          this.neighbors.get(si).add(ti);
          this.neighbors.get(ti).add(si);
        }
      }

      document.getElementById('stat-nodes').textContent = `${this.nodes.length} notes`;
      document.getElementById('stat-links').textContent = `${this.links.length} connections`;
      document.getElementById('cnt-all').textContent = this.nodes.length;

      this.populateTopHubs(data.stats?.areaBreakdown || {});
      this.computeLayoutTargets();
    } catch (e) {
      console.error('Failed to load brain.json:', e);
    }
  },

  populateTopHubs(areaBreakdown) {
    const listEl = document.getElementById('top-hubs-list');
    if (!listEl) return;
    const areaColors = {
      'Worldview & Soul': '#fbbf24',
      '00.Guidelines (HQ)': '#38bdf8',
      '02.Agents (28 Roster)': '#34d399',
      '06.Knowledge_Index': '#a855f7',
      '07.Jarvis Deep Research': '#f97316',
      '01.Documents (HQ)': '#ec4899'
    };

    let html = `
      <div class="hub-item ${!this.activeAreaFilter ? 'active' : ''}" data-area="">
        <span class="dot" style="background:#00f0ff"></span>
        <span class="name">All BSC &amp; Jarvis Hubs</span>
        <span class="cnt">${this.nodes.length}</span>
      </div>
    `;

    for (const [area, cnt] of Object.entries(areaBreakdown)) {
      const col = areaColors[area] || '#38bdf8';
      html += `
        <div class="hub-item" data-area="${area}">
          <span class="dot" style="background:${col}"></span>
          <span class="name">${area}</span>
          <span class="cnt">${cnt}</span>
        </div>
      `;
    }
    listEl.innerHTML = html;

    listEl.querySelectorAll('.hub-item').forEach(el => {
      el.addEventListener('click', () => {
        listEl.querySelectorAll('.hub-item').forEach(x => x.classList.remove('active'));
        el.classList.add('active');
        this.activeAreaFilter = el.dataset.area || null;
      });
    });
  },

  computeLayoutTargets() {
    const N = this.nodes.length;
    if (!N) return;

    const areas = [...new Set(this.nodes.map(n => n.area))];
    const layers = ['core', 'memory', 'skills', 'apps', 'runs'];
    const spread = this.repelStrength / 110;

    this.nodes.forEach((n, i) => {
      const aIdx = Math.max(0, areas.indexOf(n.area));
      const lIdx = Math.max(0, layers.indexOf(n.layer));
      const angle = (i / N) * Math.PI * 2 * 7 + aIdx * 1.1;

      if (this.viewMode === '3d' || this.viewMode === '2d') {
        // Clustered Galaxy Layout around Hub Centers
        const hubAngle = (aIdx / Math.max(1, areas.length)) * Math.PI * 2;
        const hubRadius = n.kind === 'root' ? 0 : (n.kind === 'area' ? 140 : 250) * spread;
        const localR = n.kind === 'root' ? 0 : (n.kind === 'area' ? 10 : (35 + (i % 19) * 8.5) * spread);
        const subA = i * 2.39996; // Golden angle

        n.tx = Math.cos(hubAngle) * hubRadius + Math.cos(subA) * localR;
        n.ty = Math.sin(hubAngle) * hubRadius + Math.sin(subA) * localR;
        n.tz = this.viewMode === '2d' ? 0 : Math.sin(i * 0.73) * 165 * spread;
      } else if (this.viewMode === 'rings') {
        // MAPS Concentric Rings by Layer
        const ringR = n.kind === 'root' ? 0 : (75 + lIdx * 75) * spread;
        const ringAngle = (i / N) * Math.PI * 2 * 3 + lIdx * 0.5;
        n.tx = Math.cos(ringAngle) * ringR;
        n.ty = Math.sin(ringAngle) * ringR;
        n.tz = 0;
      } else if (this.viewMode === 'areas') {
        // Distinct Area Islands
        const islandAngle = (aIdx / Math.max(1, areas.length)) * Math.PI * 2;
        const islandDist = n.kind === 'root' ? 0 : 240 * spread;
        const localA = i * 2.4;
        const localD = Math.sqrt(i % 45) * 16 * spread;
        n.tx = Math.cos(islandAngle) * islandDist + Math.cos(localA) * localD;
        n.ty = Math.sin(islandAngle) * islandDist + Math.sin(localA) * localD;
        n.tz = (aIdx - 2.5) * 35;
      } else if (this.viewMode === 'timeline') {
        // Timeline Wave
        const xSpan = 760 * spread;
        n.tx = ((i / Math.max(1, N - 1)) - 0.5) * xSpan;
        n.ty = ((aIdx - (areas.length - 1) / 2) * 68) + Math.sin(i * 0.4) * 22;
        n.tz = 0;
      } else if (this.viewMode === 'brain') {
        // Anatomical Left/Right Brain Hemisphere Ellipsoid
        const hemi = i % 2 === 0 ? -1 : 1;
        const u = ((i * 0.6180339) % 1) * Math.PI;
        const v = (i / N) * Math.PI * 2;
        const rx = 145 * spread, ry = 195 * spread, rz = 135 * spread;
        n.tx = hemi * (32 + Math.abs(Math.sin(u) * Math.cos(v)) * rx);
        n.ty = Math.sin(u) * Math.sin(v) * ry * 0.82;
        n.tz = Math.cos(u) * rz;
      }
    });
  },

  setViewMode(mode) {
    this.viewMode = mode;
    document.querySelectorAll('#top-view-bar .view-pill[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === mode);
    });
    this.computeLayoutTargets();
  },

  isNodeVisible(n) {
    if (n.idx / Math.max(1, this.nodes.length) > this.replayProgress) return false;
    if (this.activeAreaFilter && n.area !== this.activeAreaFilter && n.kind !== 'root') return false;
    if (this.activeKindFilter !== 'all' && n.kind !== this.activeKindFilter) return false;
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
    if (this.viewMode === '3d' || this.viewMode === 'brain' || this.viewMode === 'areas') {
      const cy = Math.cos(this.rotY), sy = Math.sin(this.rotY);
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const cx = Math.cos(this.rotX), sx = Math.sin(this.rotX);
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const fov = 900;
      const scale = (fov / Math.max(180, fov + z2)) * this.zoom;
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

  animate() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const ctx = this.ctx;

    if (this.autoRotate && (this.viewMode === '3d' || this.viewMode === 'brain')) {
      this.rotY += 0.0022;
    }

    if (this.replayProgress < 1.0) {
      this.replayProgress = Math.min(1.0, this.replayProgress + 0.012);
    }

    // Smoothly interpolate node positions toward target coordinates
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

    ctx.fillStyle = '#05080e';
    ctx.fillRect(0, 0, W, H);

    const focusTarget = this.selectedNode || this.hoveredNode;
    let focusSet = null;
    if (focusTarget) {
      focusSet = new Set([focusTarget.idx]);
      const nbrs = this.neighbors.get(focusTarget.idx);
      if (nbrs) nbrs.forEach(idx => focusSet.add(idx));
    }

    // Draw Links
    ctx.lineWidth = 0.85;
    for (const l of this.links) {
      const a = this.nodes[l.s];
      const b = this.nodes[l.t];
      if (!this.isNodeVisible(a) || !this.isNodeVisible(b)) continue;

      const isHighlighted = focusSet && focusSet.has(a.idx) && focusSet.has(b.idx);
      if (focusSet && !isHighlighted && this.focusMode) continue;

      ctx.strokeStyle = isHighlighted
        ? 'rgba(0, 240, 255, 0.72)'
        : focusSet
          ? 'rgba(100, 116, 139, 0.06)'
          : 'rgba(148, 163, 184, 0.16)';
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    // Draw Nodes sorted back-to-front
    const sorted = [...this.nodes].sort((a, b) => b.depth - a.depth);
    for (const n of sorted) {
      if (!this.isNodeVisible(n)) continue;
      const inFocus = !focusSet || focusSet.has(n.idx);
      if (!inFocus && this.focusMode) continue;

      const radius = Math.max(2.2, n.r * n.scale);
      ctx.globalAlpha = inFocus ? 0.95 : 0.16;

      // Outer glow for root / hub / selected nodes
      if (n.kind === 'root' || n.kind === 'area' || n === focusTarget) {
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, radius * 2.1, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '33';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.sx, n.sy, radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color || '#38bdf8';
      ctx.fill();

      // Label for hubs, root, or focused nodes
      if (n.kind === 'root' || n.kind === 'area' || n.kind === 'project' || (focusSet && inFocus)) {
        ctx.font = `${n.kind === 'area' || n.kind === 'root' ? '700 11.5px' : '500 10.2px'} Pretendard, sans-serif`;
        ctx.fillStyle = n === focusTarget ? '#ffffff' : '#cbd5e1';
        ctx.fillText(n.label.slice(0, 26), n.sx + radius + 5, n.sy + 3.5);
      }
    }
    ctx.globalAlpha = 1.0;

    requestAnimationFrame(() => this.animate());
  },

  findNodeAt(x, y) {
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (!this.isNodeVisible(n)) continue;
      const r = Math.max(6, n.r * (n.scale || 1) + 4);
      const dx = n.sx - x;
      const dy = n.sy - y;
      if (dx * dx + dy * dy <= r * r) return n;
    }
    return null;
  },

  selectNode(node, openWindow = false) {
    this.selectedNode = node;
    const inspEl = document.getElementById('inspector-content');
    const actEl = document.getElementById('inspector-actions');

    if (!node) {
      if (inspEl) {
        inspEl.innerHTML = 'Click a node to focus it — only that node and its connections light up, and you can read its note here.';
      }
      if (actEl) actEl.style.display = 'none';
      return;
    }

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

    if (openWindow && node.path) {
      this.openNodeInReportWindow(node);
    }
  },

  async openNodeInReportWindow(node) {
    if (!node || !node.path) return;
    try {
      const res = await fetch(`/api/read-node?path=${encodeURIComponent(node.path)}`);
      const data = await res.json();
      window.HUDWindowSpawner.spawn({
        windowType: 'REPORT',
        title: `📊 ${node.label}`,
        subtitle: `${node.area} · ${node.path}`,
        content: data.ok ? data.content : `# ${node.label}\n\n${node.note}`
      });
    } catch (e) {}
  },

  flyToNode(node) {
    if (!node) return;
    this.camX = -node.x * 0.4;
    this.camY = -node.y * 0.4;
    this.zoom = 1.45;
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
        this.rotY += dx * 0.0055;
        this.rotX = Math.max(-1.2, Math.min(1.2, this.rotX + dy * 0.0055));
      } else {
        this.camX += dx;
        this.camY += dy;
      }
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener('mouseup', e => {
      if (dragging && !moved) {
        const hit = this.findNodeAt(e.clientX, e.clientY);
        this.selectNode(hit, false);
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
      this.zoom = Math.max(0.35, Math.min(3.5, this.zoom * factor));
    }, { passive: false });

    // Top View Switcher Buttons
    document.querySelectorAll('#top-view-bar .view-pill[data-view]').forEach(btn => {
      btn.addEventListener('click', () => this.setViewMode(btn.dataset.view));
    });

    document.getElementById('btn-toggle-2d3d')?.addEventListener('click', () => {
      this.setViewMode(this.viewMode === '2d' ? '3d' : '2d');
    });

    document.getElementById('btn-fit-graph')?.addEventListener('click', () => {
      this.camX = 0;
      this.camY = 0;
      this.zoom = 1.0;
      this.rotX = 0.18;
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

    // Search Input
    const searchInput = document.getElementById('brain-search');
    searchInput?.addEventListener('input', e => {
      this.searchQuery = e.target.value.trim();
    });
    searchInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && this.searchQuery) {
        const match = this.nodes.find(n => this.isNodeVisible(n));
        if (match) {
          this.selectNode(match, false);
          this.flyToNode(match);
        }
      }
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
