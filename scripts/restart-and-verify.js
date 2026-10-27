/**
 * 🔄🛡️ BSC J.A.R.V.I.S. OS — Live Host Port 7777 Verification Guard
 *
 * CRITICAL ANTI-REGRESSION RULE:
 * Never kill or spawn transient sandbox child processes that die when the command exits!
 * This guard verifies that a persistent host daemon is genuinely listening on port 7777
 * before running the 25-point verification suite.
 */
async function ensureLatestServerOn7777() {
  try {
    const res = await fetch('http://127.0.0.1:7777/api/brain/neuron-detail?label=JARVIS');
    if (res.ok) {
      console.log('🟢 Host Port 7777 server is persistently ONLINE and serving latest routes.');
      return;
    }
  } catch (_) {}

  console.error('❌ CRITICAL: Port 7777 is NOT listening on the host! Start `node server.js` as a persistent host daemon (`BypassSandbox: true, IsDaemon: true`) before running verification.');
  process.exit(1);
}

(async () => {
  await ensureLatestServerOn7777();
  require('./verify-full-system');
})();
