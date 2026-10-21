/**
 * ⚛️ BSC J.A.R.V.I.S. OS — Bottom-Right Glowing Cyan Voice Equalizer Waveform Orb
 * Implements CEO Lee Geon-woo's Master Design Mockup #1:
 *  - Concentric glowing cyan holographic rings + dark cosmic inner sphere
 *  - Vertical glowing cyan audio equalizer bars (`| ||| ||||| ||| |`) inside the orb
 *  - Also supports RING / CUBE / FACE modes for backward compatibility
 */

window.JarvisReactorCore = {
  canvas: null,
  ctx: null,
  shape: 'WAVE',
  speakingIntensity: 0,
  tick: 0,

  init() {
    this.canvas = document.getElementById('jarvis-core-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    document.querySelectorAll('.core-shape-tabs .core-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setShape(btn.dataset.shape || 'WAVE');
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
    this.speakingIntensity = Math.min(1.6, Math.max(this.speakingIntensity, energy));
  },

  render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    this.tick += 0.032;
    this.speakingIntensity *= 0.94;

    ctx.clearRect(0, 0, W, H);
    const pulse = 1 + this.speakingIntensity * 0.14 + Math.sin(this.tick * 1.6) * 0.025;

    if (this.shape === 'WAVE' || this.shape === 'RING') {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(pulse, pulse);

      // 1. Outer ambient cyan radial aura
      const outerR = Math.min(cx, cy) * 0.94;
      const aura = ctx.createRadialGradient(0, 0, outerR * 0.25, 0, 0, outerR);
      aura.addColorStop(0, 'rgba(0, 240, 255, 0.28)');
      aura.addColorStop(0.55, 'rgba(14, 165, 233, 0.14)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.fill();

      // 2. Dark glass sphere core
      const sphereR = outerR * 0.62;
      const coreGrad = ctx.createRadialGradient(-sphereR * 0.2, -sphereR * 0.25, 4, 0, 0, sphereR);
      coreGrad.addColorStop(0, 'rgba(12, 34, 64, 0.92)');
      coreGrad.addColorStop(0.7, 'rgba(5, 14, 30, 0.96)');
      coreGrad.addColorStop(1, 'rgba(0, 210, 255, 0.32)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, sphereR, 0, Math.PI * 2);
      ctx.fill();

      // 3. Concentric Glowing Cyan Rings (Mockup #1 style)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, sphereR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.42)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, sphereR * 1.16, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating segmented outer arc
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, sphereR * 1.08, this.tick * 0.45, this.tick * 0.45 + 1.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, sphereR * 1.08, this.tick * 0.45 + Math.PI, this.tick * 0.45 + Math.PI + 1.9);
      ctx.stroke();

      // 4. Center Vertical Audio Equalizer Waveform Bars (Exact Mockup #1 look)
      const barCount = 15;
      const barSpacing = (sphereR * 1.26) / barCount;
      const startX = -((barCount - 1) * barSpacing) / 2;

      for (let i = 0; i < barCount; i++) {
        const centerDist = 1 - Math.abs(i - (barCount - 1) / 2) / ((barCount - 1) / 2);
        const idleWave = Math.sin(this.tick * 3.4 + i * 0.65) * 0.35 + 0.65;
        const speechBoost = 1 + this.speakingIntensity * 1.35 * Math.abs(Math.sin(this.tick * 7 + i));
        const halfH = Math.max(3, sphereR * 0.56 * Math.pow(centerDist, 1.15) * idleWave * speechBoost);
        const bx = startX + i * barSpacing;

        const barGrad = ctx.createLinearGradient(bx, -halfH, bx, halfH);
        barGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
        barGrad.addColorStop(0.5, '#ffffff');
        barGrad.addColorStop(1, 'rgba(56, 189, 248, 0.25)');

        ctx.strokeStyle = barGrad;
        ctx.lineWidth = i === Math.floor(barCount / 2) ? 2.8 : 2.1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bx, -halfH);
        ctx.lineTo(bx, halfH);
        ctx.stroke();
      }

      // Horizontal glowing equator line
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(-sphereR * 0.78, 0);
      ctx.lineTo(sphereR * 0.78, 0);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();
    } else if (this.shape === 'CUBE') {
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

      drawCube(38, '#00f0ff', 1.0);
      drawCube(20, '#fbbf24', -1.4);
    } else if (this.shape === 'FACE') {
      ctx.save();
      ctx.translate(cx, cy);
      for (let ring = 1; ring <= 4; ring++) {
        const r = ring * 15 * pulse;
        ctx.strokeStyle = ring % 2 === 0 ? 'rgba(0, 240, 255, 0.65)' : 'rgba(52, 211, 153, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.15) {
          const wave = Math.sin(a * 6 + this.tick * 3) * (2.5 + this.speakingIntensity * 7);
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
