/**
 * ⚛️ BSC J.A.R.V.I.S. OS — Right-Rail Holographic Arc Reactor Core
 * Supports 3 Core Shapes matching the AI Workshop OS screenshot:
 *  1. RING (Iron-Man Arc Reactor Concentric Rotating Rings)
 *  2. CUBE (Rotating 4D/3D Holographic Tesseract Cube)
 *  3. FACE (Neural Particle Mask that pulses when J.A.R.V.I.S. speaks)
 */

window.JarvisReactorCore = {
  canvas: null,
  ctx: null,
  shape: 'RING',
  speakingIntensity: 0,
  tick: 0,

  init() {
    this.canvas = document.getElementById('jarvis-core-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    document.querySelectorAll('.core-shape-tabs .core-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setShape(btn.dataset.shape || 'RING');
      });
    });

    requestAnimationFrame(() => this.render());
  },

  setShape(shape) {
    this.shape = shape.toUpperCase();
    document.querySelectorAll('.core-shape-tabs .core-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.shape === this.shape);
    });
  },

  pulseSpeech(energy = 1.0) {
    this.speakingIntensity = Math.min(1.5, Math.max(this.speakingIntensity, energy));
  },

  render() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    this.tick += 0.022;
    this.speakingIntensity *= 0.93;

    ctx.clearRect(0, 0, W, H);
    const pulse = 1 + this.speakingIntensity * 0.18 + Math.sin(this.tick * 2) * 0.03;

    if (this.shape === 'RING') {
      // Outer Cyan Tick Ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(pulse, pulse);

      for (let i = 0; i < 48; i++) {
        const ang = (i / 48) * Math.PI * 2 + this.tick * 0.35;
        const r1 = 84;
        const r2 = i % 4 === 0 ? 94 : 89;
        ctx.strokeStyle = i % 4 === 0 ? '#00f0ff' : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = i % 4 === 0 ? 2 : 1.2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
        ctx.lineTo(Math.cos(ang) * r2, Math.sin(ang) * r2);
        ctx.stroke();
      }

      // Counter-rotating Gold & Cyan Segmented Arcs
      ctx.lineWidth = 3.2;
      ctx.strokeStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(0, 0, 74, -this.tick * 0.8, -this.tick * 0.8 + 1.8);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 74, -this.tick * 0.8 + 3.1, -this.tick * 0.8 + 4.6);
      ctx.stroke();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, 0, 63, this.tick * 1.1, this.tick * 1.1 + 2.1);
      ctx.stroke();

      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, 52, -this.tick * 1.4, -this.tick * 1.4 + 4.2);
      ctx.stroke();

      ctx.restore();
    } else if (this.shape === 'CUBE') {
      // Rotating 3D Tesseract Dual Cube
      const verts = [
        [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
        [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
      ];
      const edges = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7]
      ];

      const drawCube = (scale, color, speed) => {
        const a = this.tick * speed;
        const b = this.tick * 0.7 * speed;
        const proj = verts.map(([x, y, z]) => {
          const x1 = x * Math.cos(a) - z * Math.sin(a);
          const z1 = x * Math.sin(a) + z * Math.cos(a);
          const y2 = y * Math.cos(b) - z1 * Math.sin(b);
          return [cx + x1 * scale * pulse, cy + y2 * scale * pulse];
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.8;
        for (const [i, j] of edges) {
          ctx.beginPath();
          ctx.moveTo(proj[i][0], proj[i][1]);
          ctx.lineTo(proj[j][0], proj[j][1]);
          ctx.stroke();
        }
      };

      drawCube(46, '#00f0ff', 1.0);
      drawCube(24, '#fbbf24', -1.4);
    } else if (this.shape === 'FACE') {
      // Neural Holographic Face / Waveform Mask
      ctx.save();
      ctx.translate(cx, cy);
      for (let ring = 1; ring <= 4; ring++) {
        const r = ring * 18 * pulse;
        ctx.strokeStyle = ring % 2 === 0 ? 'rgba(0, 240, 255, 0.55)' : 'rgba(52, 211, 153, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.15) {
          const wave = Math.sin(a * 6 + this.tick * 3) * (3 + this.speakingIntensity * 8);
          const px = Math.cos(a) * (r + wave * 0.75);
          const py = Math.sin(a) * (r * 1.12 + wave);
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    requestAnimationFrame(() => this.render());
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.JarvisReactorCore.init();
});
