// 창고·본사·안티그래비티에서 최근 문서만 골라 뉴런 홈에 넘긴다. 원본은 수정하지 않는다.
const fs = require('fs');
const path = require('path');

const FEED_FILE = path.join(__dirname, '..', 'public', 'data', 'live-neuron-feed.json');
const DIGEST_FILE = path.join(__dirname, '..', 'vault', 'Live_Neuron_Digest.md');
const ANTIGRAVITY_BRAIN = 'C:\\Users\\USER\\.gemini\\antigravity\\brain';
const ROOTS = [
  { source: 'Warehouse', dir: 'C:\\Warehouse' },
  { source: 'BeausCreators', dir: 'C:\\BeausCreators' }
];
const KEEP = 8;

function emptyFeed() {
  return {
    generatedAt: new Date().toISOString(),
    cursors: { Warehouse: 0, BeausCreators: 0 },
    sources: { Warehouse: [], BeausCreators: [], Antigravity: [] }
  };
}

function readLiveNeuronFeed() {
  try {
    if (fs.existsSync(FEED_FILE)) return JSON.parse(fs.readFileSync(FEED_FILE, 'utf8'));
  } catch (e) {}
  return emptyFeed();
}

function titleOf(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8').slice(0, 1500);
    const heading = raw.split(/\r?\n/).find(line => line.trim().startsWith('# '));
    if (heading) return heading.replace(/^#+\s*/, '').trim().slice(0, 64);
  } catch (e) {}
  return path.basename(filePath, path.extname(filePath)).slice(0, 64);
}

function listTopDirs(dirPath) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules')
      .map(entry => path.join(dirPath, entry.name));
  } catch (e) {
    return [];
  }
}

function newestMarkdown(dirPath, limit, budget) {
  const found = [];
  const stack = [dirPath];
  let seen = 0;
  while (stack.length && seen < budget) {
    const current = stack.pop();
    let entries = [];
    try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch (e) { continue; }
    for (const entry of entries) {
      if (seen >= budget) break;
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'vendor') continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (/\.md$/i.test(entry.name)) {
        seen += 1;
        try {
          const stat = fs.statSync(full);
          found.push({ path: full.replace(/\\/g, '/'), mtime: stat.mtimeMs, title: titleOf(full) });
        } catch (e) {}
      }
    }
  }
  found.sort((a, b) => b.mtime - a.mtime);
  return found.slice(0, limit);
}

function recentAntigravity(limit) {
  if (!fs.existsSync(ANTIGRAVITY_BRAIN)) return [];
  let dirs = [];
  try {
    dirs = fs.readdirSync(ANTIGRAVITY_BRAIN, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => {
        const full = path.join(ANTIGRAVITY_BRAIN, entry.name);
        let mtime = 0;
        try { mtime = fs.statSync(full).mtimeMs; } catch (e) {}
        return { full, mtime };
      })
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, limit);
  } catch (e) {
    return [];
  }
  return dirs.map(dir => {
    const plan = ['implementation_plan.md', 'task.md', 'walkthrough.md']
      .map(name => path.join(dir.full, name))
      .find(file => fs.existsSync(file));
    return {
      path: (plan || dir.full).replace(/\\/g, '/'),
      mtime: dir.mtime,
      title: plan ? titleOf(plan) : `안티그래비티 세션 ${path.basename(dir.full).slice(0, 8)}`
    };
  });
}

function mergeItems(previous, incoming) {
  const map = new Map();
  for (const item of [...incoming, ...(previous || [])]) {
    if (!item || !item.path) continue;
    const prev = map.get(item.path);
    if (!prev || item.mtime > prev.mtime) map.set(item.path, item);
  }
  return [...map.values()].sort((a, b) => b.mtime - a.mtime).slice(0, KEEP);
}

function appendDigest(feed) {
  const lines = ['Warehouse', 'BeausCreators', 'Antigravity'].map(key => {
    const titles = (feed.sources[key] || []).map(item => item.title).join(' · ');
    return `${key}: ${titles}`;
  });
  const signature = lines.join('\n');
  let prior = '';
  try { prior = fs.existsSync(DIGEST_FILE) ? fs.readFileSync(DIGEST_FILE, 'utf8') : ''; } catch (e) {}
  if (prior.endsWith(signature)) return;
  const block = `\n\n---\n### ${feed.generatedAt}\n${signature}\n`;
  fs.mkdirSync(path.dirname(DIGEST_FILE), { recursive: true });
  fs.appendFileSync(DIGEST_FILE, prior ? block : `# 뉴런 홈 실시간 요약\n원본 문서는 수정하지 않고, 최근 바뀐 제목만 적는다.\n${block}`, 'utf8');
}

function refreshLiveNeuronFeed() {
  const feed = readLiveNeuronFeed();
  feed.cursors = feed.cursors || { Warehouse: 0, BeausCreators: 0 };
  for (const root of ROOTS) {
    const dirs = listTopDirs(root.dir);
    if (!dirs.length) continue;
    const index = feed.cursors[root.source] || 0;
    const dir = dirs[index % dirs.length];
    feed.sources[root.source] = mergeItems(feed.sources[root.source], newestMarkdown(dir, KEEP, 350));
    feed.cursors[root.source] = index + 1;
  }
  feed.sources.Antigravity = recentAntigravity(KEEP);
  feed.generatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(FEED_FILE), { recursive: true });
  fs.writeFileSync(FEED_FILE, JSON.stringify(feed, null, 2), 'utf8');
  appendDigest(feed);
  return feed;
}

module.exports = { refreshLiveNeuronFeed, readLiveNeuronFeed };
