const fs = require('fs');
const stagePath = 'c:/BSC_Javis_OS/public/stage.html';
let html = fs.readFileSync(stagePath, 'utf8');
if (!html.includes('jarvis-cloud-shim.js')) {
  html = html.replace('<title>barehands</title>', '<title>BSC J.A.R.V.I.S. — Barehands Full-Screen AR Camera Stage</title>\n<script src="/js/jarvis-cloud-shim.js"></script>');
}
if (!html.includes('jarvis-return-pill')) {
  const pill = '<a id="jarvis-return-pill" href="/" style="position:fixed;top:16px;right:18px;z-index:99999;background:rgba(255,255,255,0.92);color:#18181b;border:1px solid #d1d5db;border-radius:999px;padding:8px 16px;font-family:Pretendard,sans-serif;font-size:12px;font-weight:700;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,0.15);">← J.A.R.V.I.S. OS 메인 복귀</a>\n</body>';
  html = html.replace('</body>', pill);
}
fs.writeFileSync(stagePath, html, 'utf8');
console.log('Patched public/stage.html successfully!');
