/**
 * ✝️ BSC J.A.R.V.I.S. OS — Worldview (Coram Deo & Together) & Token Flow Steward
 * Manages Presbyterian Stewardship verses, BSC 28 Agents Roster status, and Token Flow telemetry.
 */

window.BSC_WORLDVIEW = {
  ceoName: '이건우 대표님',
  coreKeyword: '함께 (Together)',
  stewardshipVerses: [
    '"이건우 대표님, 오늘도 주신 지혜로 함께(Together) 만들어 갑시다." — 전도서 4:9 (두 사람이 한 사람보다 나음은 그들이 수고함으로 좋은 상을 얻을 것임이라)',
    '"맡은 자들에게 구할 것은 충성이니라" (고전 4:2) — 자비스는 대표님의 시간과 토큰을 가장 정직하게 아끼는 청지기입니다.',
    '"사람이 마음으로 자기의 길을 계획할지라도 그의 걸음을 인도하시는 이는 여호와시니라" (잠 16:9) — 대표님의 비전을 함께 실행합니다.',
    '"무슨 일을 하든지 마음을 다하여 주께 하듯 하고" (골 3:23) — 코람 데오(Coram Deo) 정신으로 무결점 아키텍처를 수호합니다.'
  ],
  verseIndex: 0,
  telemetry: {
    rawBaselineTokens: 42800,
    optimizedActualTokens: 4920,
    savedTokens: 37880,
    savingsPct: 88.5,
    recentLogs: []
  },

  init() {
    const bannerEl = document.getElementById('daily-steward-message');
    if (bannerEl) {
      setInterval(() => {
        this.verseIndex = (this.verseIndex + 1) % this.stewardshipVerses.length;
        bannerEl.textContent = this.stewardshipVerses[this.verseIndex];
      }, 14000);
    }
    this.fetchTelemetry();
  },

  async fetchTelemetry() {
    try {
      const res = await fetch('/api/token-flow');
      if (res.ok) {
        const data = await res.json();
        this.updateTelemetryUI(data);
      }
    } catch (e) {}
  },

  updateTelemetryUI(data) {
    if (!data) return;
    this.telemetry = data;
    const pctEl = document.getElementById('tf-savings-pct');
    const barEl = document.getElementById('tf-bar-fill');
    const actEl = document.getElementById('tf-actual');
    const rawEl = document.getElementById('tf-raw');

    if (pctEl) pctEl.textContent = `${data.savingsPct}% SAVED`;
    if (barEl) barEl.style.width = `${Math.min(100, data.savingsPct)}%`;
    if (actEl) actEl.textContent = `${(data.optimizedActualTokens / 1000).toFixed(1)}k`;
    if (rawEl) rawEl.textContent = `${(data.rawBaselineTokens / 1000).toFixed(1)}k`;

    if (window.HUDWindowSpawner) {
      window.HUDWindowSpawner.refreshConsoleLogs(data);
    }
  },

  showToast(speaker, text, avatarUrl = null, voiceBadge = null) {
    const spEl = document.getElementById('toast-speaker');
    const txEl = document.getElementById('toast-text');
    const avEl = document.getElementById('toast-avatar');
    const vbEl = document.getElementById('toast-voice-badge');
    if (spEl) spEl.textContent = speaker;
    if (txEl) txEl.textContent = text;
    if (avEl && avatarUrl) {
      avEl.style.display = 'block';
      avEl.src = avatarUrl;
    }
    if (vbEl && voiceBadge) {
      vbEl.textContent = voiceBadge;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.BSC_WORLDVIEW.init();
});
