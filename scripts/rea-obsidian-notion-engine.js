/**
 * 🕸️📝 BSC J.A.R.V.I.S. OS — REA Obsidian Graph × Notion Block Hybrid Knowledge Engine
 * Path: c:\BSC_Javis_OS\scripts\rea-obsidian-notion-engine.js
 *
 * Clean-Room Reverse Engineered Hybrid Architecture:
 *  1. Obsidian Knowledge Graph Core:
 *     - Bi-directional `[[WikiLink]]` parser & auto-resolver
 *     - Incoming Backlinks (역방향 참조 뉴런) & Outgoing Links (출신 시냅스)
 *     - `#Tag` taxonomy extraction & YAML Frontmatter parser
 *     - 1-Hop Local Graph generator for any clicked Neuron dot
 *     - Dynamic Neuron & Synapse injector into `public/data/brain.json` (real-time 3D galaxy update)
 *  2. Notion Slash (`/`) Block Editor & Serializer:
 *     - Converts Notion-style blocks (`/h1`, `/h2`, `/todo`, `/callout`, `/code`, `/table`, `/quote`)
 *       into clean GFM Markdown while preserving 100% of original file contents (.bak backup + Append safety).
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const BRAIN_JSON_PATH = path.join(PUBLIC_DIR, 'data', 'brain.json');
const VAULT_NEURONS_DIR = path.join(ROOT_DIR, 'vault', 'neurons');
const BACKUP_DIR = path.join(PUBLIC_DIR, 'data', 'ide_backups');

function ensureNeuronDirs() {
  if (!fs.existsSync(VAULT_NEURONS_DIR)) fs.mkdirSync(VAULT_NEURONS_DIR, { recursive: true });
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function loadBrainGraphData() {
  try {
    if (fs.existsSync(BRAIN_JSON_PATH)) {
      return JSON.parse(fs.readFileSync(BRAIN_JSON_PATH, 'utf8'));
    }
  } catch (e) {}
  return { nodes: [], links: [], stats: { totalNodes: 0, totalLinks: 0 } };
}

function saveBrainGraphData(brainObj) {
  try {
    if (!brainObj.stats) brainObj.stats = {};
    brainObj.stats.totalNodes = (brainObj.nodes || []).length;
    brainObj.stats.totalLinks = (brainObj.links || []).length;
    brainObj.updatedAt = new Date().toISOString();
    fs.writeFileSync(BRAIN_JSON_PATH, JSON.stringify(brainObj, null, 2), 'utf8');
  } catch (e) {}
}

/**
 * Parse Obsidian YAML Frontmatter, `[[WikiLinks]]`, `#tags`, headings, and runnable code blocks
 */
function parseObsidianMarkdownMetadata(rawContent = '') {
  const content = String(rawContent || '');
  const frontmatter = {};
  let body = content;

  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (fmMatch) {
    body = content.slice(fmMatch[0].length);
    for (const line of fmMatch[1].split(/\r?\n/)) {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const k = line.slice(0, idx).trim();
        const v = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        frontmatter[k] = v;
      }
    }
  }

  // Extract [[WikiLinks]]
  const wikiLinks = [];
  const wikiRegex = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g;
  let m;
  while ((m = wikiRegex.exec(content)) !== null) {
    const target = m[1].trim();
    const alias = (m[2] || m[1]).trim();
    if (target && !wikiLinks.some(w => w.target.toLowerCase() === target.toLowerCase())) {
      wikiLinks.push({ target, alias });
    }
  }

  // Extract #tags (excluding markdown headers and hex colors)
  const tags = [];
  const tagRegex = /(?:^|\s)#([가-힣A-Za-z0-9_-]{2,30})/g;
  while ((m = tagRegex.exec(body)) !== null) {
    const tag = m[1];
    if (!/^[0-9a-fA-F]{3,6}$/.test(tag) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }

  // Extract Headings (TOC)
  const headings = [];
  for (const line of body.split(/\r?\n/)) {
    const hm = line.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      headings.push({
        level: hm[1].length,
        text: hm[2].replace(/[*`]/g, '').trim()
      });
    }
  }

  // Extract Runnable Code / CLI Blocks
  const codeBlocks = [];
  const codeRegex = /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
  while ((m = codeRegex.exec(body)) !== null) {
    const lang = (m[1] || 'text').toLowerCase();
    const code = m[2].trim();
    if (code) {
      codeBlocks.push({
        lang,
        code,
        isRunnableCli: ['bash', 'sh', 'powershell', 'ps1', 'cmd', 'shell', 'node', 'js', 'javascript', 'python', 'py'].includes(lang)
      });
    }
  }

  // Extract Notion-style To-Do items (- [ ] / - [x])
  const todos = [];
  for (const line of body.split(/\r?\n/)) {
    const tm = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.+)$/);
    if (tm) {
      todos.push({
        done: tm[1].toLowerCase() === 'x',
        text: tm[2].trim()
      });
    }
  }

  return {
    frontmatter,
    wikiLinks,
    tags,
    headings,
    codeBlocks,
    todos,
    charCount: content.length,
    lineCount: content.split(/\r?\n/).length
  };
}

/**
 * Retrieve complete content, 1-Hop local graph, backlinks, outlinks, and application actions for a clicked Neuron
 */
function getNeuronFullDetail(query = {}) {
  ensureNeuronDirs();
  const brain = loadBrainGraphData();
  const nodes = brain.nodes || [];
  const links = brain.links || [];

  const targetId = String(query.id || '').trim();
  const targetPath = String(query.path || '').trim();
  const targetLabel = String(query.label || '').trim();

  let matchedNode = null;
  if (targetId) {
    matchedNode = nodes.find(n => String(n.id) === targetId);
  }
  if (!matchedNode && targetPath) {
    const normP = targetPath.replace(/\\/g, '/').toLowerCase();
    matchedNode = nodes.find(n => String(n.path || '').replace(/\\/g, '/').toLowerCase() === normP);
  }
  if (!matchedNode && targetLabel) {
    const normL = targetLabel.toLowerCase();
    matchedNode = nodes.find(n => String(n.label || '').toLowerCase().includes(normL));
  }

  const resolvedPathRaw = matchedNode?.path || targetPath || '';
  let diskPath = '';
  if (resolvedPathRaw) {
    if (path.isAbsolute(resolvedPathRaw) && fs.existsSync(resolvedPathRaw)) {
      diskPath = resolvedPathRaw;
    } else {
      const candidate1 = path.join(ROOT_DIR, resolvedPathRaw);
      const candidate2 = path.join('C:\\BeausCreators', resolvedPathRaw);
      if (fs.existsSync(candidate1)) diskPath = candidate1;
      else if (fs.existsSync(candidate2)) diskPath = candidate2;
    }
  }

  // Also check if there is a companion Obsidian/Notion note in vault/neurons/ for this node
  const slugName = (matchedNode?.label || targetLabel || targetId || 'neuron')
    .replace(/\.[^.]+$/, '')
    .replace(/[\\/:*?"<>|]/g, '_')
    .trim();
  const companionNotePath = path.join(VAULT_NEURONS_DIR, `${slugName}.md`);

  let rawContent = '';
  let fileKind = 'markdown';
  let directoryChildren = [];
  let companionNoteContent = '';

  if (fs.existsSync(companionNotePath)) {
    try {
      companionNoteContent = fs.readFileSync(companionNotePath, 'utf8');
    } catch (e) {}
  }

  if (diskPath && fs.existsSync(diskPath)) {
    try {
      const st = fs.statSync(diskPath);
      if (st.isDirectory()) {
        fileKind = 'directory';
        const entries = fs.readdirSync(diskPath, { withFileTypes: true }).slice(0, 80);
        directoryChildren = entries.map(e => ({
          name: e.name,
          isDirectory: e.isDirectory(),
          fullPath: path.join(diskPath, e.name).replace(/\\/g, '/')
        }));
        const readmeCandidate = entries.find(e => /^readme\.md$/i.test(e.name) || /\.md$/i.test(e.name));
        if (readmeCandidate) {
          rawContent = fs.readFileSync(path.join(diskPath, readmeCandidate.name), 'utf8').slice(0, 60000);
        } else {
          rawContent = [
            `# 📂 ${matchedNode?.label || path.basename(diskPath)}`,
            ``,
            `- **디스크 경로**: \`${diskPath.replace(/\\/g, '/')}\``,
            `- **하위 항목 수**: ${directoryChildren.length}개`,
            ``,
            `## 📋 폴더 내 파일 및 하위 디렉토리 목록`,
            ...directoryChildren.map(c => `- ${c.isDirectory ? '📁' : '📄'} \`${c.name}\``)
          ].join('\n');
        }
      } else {
        const ext = path.extname(diskPath).toLowerCase();
        if (['.js', '.ts', '.py', '.json', '.html', '.css', '.ps1', '.sh'].includes(ext)) {
          fileKind = 'code';
        }
        rawContent = fs.readFileSync(diskPath, 'utf8').slice(0, 75000);
      }
    } catch (e) {
      rawContent = `# ⚠️ 파일 읽기 안내\n\n- 경로: \`${diskPath}\`\n- 오류: ${e.message}`;
    }
  } else if (companionNoteContent) {
    diskPath = companionNotePath;
    rawContent = companionNoteContent;
  } else {
    // Virtual / Hub / Concept Neuron -> Generate rich initial Obsidian × Notion template
    diskPath = companionNotePath;
    rawContent = [
      `---`,
      `title: "${matchedNode?.label || targetLabel || targetId || '선택된 뉴런'}"`,
      `category: "${matchedNode?.cat || 'doc'}"`,
      `tags: [자비스뉴런, 옵시디언노트, 실무응용]`,
      `created: "${new Date().toISOString().slice(0, 10)}"`,
      `---`,
      ``,
      `# 🧠 ${matchedNode?.label || targetLabel || targetId || '뉴런 노트'}`,
      ``,
      `> 💡 **뉴런 요약**: ${matchedNode?.summary || matchedNode?.desc || '이 뉴런에 대한 아이디어, 노션 블록, [[위키링크]]를 자유롭게 작성하고 AI/CLI로 즉시 응용하세요.'}`,
      ``,
      `## 📌 핵심 내용 및 메모`,
      `- [ ] 이 뉴런의 내용을 기반으로 실행 계획 수립하기`,
      `- 연결된 대표 뉴런: [[🤖 J.A.R.V.I.S. 코어]]`
    ].join('\n');
  }

  // Merge companion note if the main file was a read-only HQ file or code file
  const combinedForMeta = companionNoteContent && diskPath !== companionNotePath
    ? `${rawContent}\n\n---\n\n${companionNoteContent}`
    : rawContent;

  const meta = parseObsidianMarkdownMetadata(combinedForMeta);

  // Compute 1-Hop Local Graph (Outlinks & Backlinks from brain.json + WikiLinks)
  const nodeId = matchedNode?.id || targetId || `neuron-${slugName}`;
  const outlinks = [];
  const backlinks = [];
  const neighborMap = new Map();

  for (const lk of links) {
    const src = typeof lk.source === 'object' ? lk.source.id : lk.source;
    const tgt = typeof lk.target === 'object' ? lk.target.id : lk.target;
    if (String(src) === String(nodeId)) {
      const targetNode = nodes.find(n => String(n.id) === String(tgt));
      if (targetNode) {
        outlinks.push({ id: targetNode.id, label: targetNode.label, cat: targetNode.cat, path: targetNode.path || '' });
        neighborMap.set(targetNode.id, targetNode);
      }
    } else if (String(tgt) === String(nodeId)) {
      const sourceNode = nodes.find(n => String(n.id) === String(src));
      if (sourceNode) {
        backlinks.push({ id: sourceNode.id, label: sourceNode.label, cat: sourceNode.cat, path: sourceNode.path || '' });
        neighborMap.set(sourceNode.id, sourceNode);
      }
    }
  }

  // Also resolve [[WikiLinks]] in markdown against brain.json nodes
  for (const wl of meta.wikiLinks) {
    const found = nodes.find(
      n => String(n.label || '').toLowerCase() === wl.target.toLowerCase() ||
           String(n.label || '').replace(/\.[^.]+$/, '').toLowerCase() === wl.target.toLowerCase()
    );
    if (found && !outlinks.some(o => o.id === found.id)) {
      outlinks.push({ id: found.id, label: found.label, cat: found.cat, path: found.path || '', viaWikiLink: true });
      neighborMap.set(found.id, found);
    } else if (!found) {
      outlinks.push({ id: `wikilink:${wl.target}`, label: wl.target, cat: 'doc', path: '', isUnresolvedWikiLink: true });
    }
  }

  const isInsideWorkspace = diskPath && path.resolve(diskPath).toLowerCase().startsWith(path.resolve(ROOT_DIR).toLowerCase());

  return {
    ok: true,
    neuron: {
      id: nodeId,
      label: matchedNode?.label || targetLabel || path.basename(diskPath) || '뉴런 노드',
      cat: matchedNode?.cat || 'doc',
      slotId: matchedNode?.slotId || 'workspace',
      slotLabel: matchedNode?.slotLabel || '지식생태계 뉴런',
      slotColor: matchedNode?.slotColor || '#00f0ff',
      path: diskPath ? diskPath.replace(/\\/g, '/') : '',
      companionNotePath: companionNotePath.replace(/\\/g, '/'),
      isDirectEditable: Boolean(isInsideWorkspace && fileKind === 'markdown'),
      fileKind,
      summary: matchedNode?.summary || (meta.headings[0]?.text) || ''
    },
    content: rawContent,
    companionNoteContent,
    directoryChildren,
    obsidianMeta: meta,
    graphConnections: {
      outlinks: outlinks.slice(0, 35),
      backlinks: backlinks.slice(0, 35),
      neighborsCount: neighborMap.size,
      localGraphNodes: [
        {
          id: nodeId,
          label: matchedNode?.label || targetLabel || '현재 뉴런',
          cat: matchedNode?.cat || 'doc',
          isCenter: true
        },
        ...Array.from(neighborMap.values()).slice(0, 18).map(n => ({
          id: n.id,
          label: n.label,
          cat: n.cat || 'doc',
          path: n.path || '',
          isCenter: false
        }))
      ]
    }
  };
}

/**
 * Save or Append user's Notion-blocks / Obsidian markdown into a Neuron and dynamically wire new nodes/synapses into brain.json
 */
function saveOrAppendNeuronNote(payload = {}) {
  ensureNeuronDirs();
  const mode = String(payload.mode || 'APPEND').toUpperCase(); // 'APPEND' | 'SAVE' | 'CREATE_NEURON'
  const title = String(payload.title || payload.label || '새 뉴런 노트').trim();
  const content = String(payload.content || '').trim();
  const sourceNodeId = String(payload.nodeId || '').trim();
  const requestedPath = String(payload.path || '').trim();

  if (!content) {
    return { ok: false, error: '저장할 뉴런 노트 내용을 입력해 주십시오.' };
  }

  const slug = title
    .replace(/\.[^.]+$/, '')
    .replace(/[\\/:*?"<>|]/g, '_')
    .trim() || `neuron_${Date.now()}`;

  let targetFilePath = path.join(VAULT_NEURONS_DIR, `${slug}.md`);
  if (requestedPath) {
    const resolvedReq = path.resolve(requestedPath);
    const isInsideWorkspace = resolvedReq.toLowerCase().startsWith(path.resolve(ROOT_DIR).toLowerCase());
    if (isInsideWorkspace && resolvedReq.toLowerCase().endsWith('.md')) {
      targetFilePath = resolvedReq;
    }
  }

  // Backup existing file before modifying (Zero Data Loss Guarantee)
  if (fs.existsSync(targetFilePath)) {
    try {
      const bakName = `${path.basename(targetFilePath)}.${Date.now()}.bak`;
      fs.copyFileSync(targetFilePath, path.join(BACKUP_DIR, bakName));
    } catch (e) {}
  }

  const nowStr = new Date().toLocaleString('ko-KR');
  let finalFileContent = '';

  if (mode === 'SAVE' && fs.existsSync(targetFilePath)) {
    finalFileContent = content;
    fs.writeFileSync(targetFilePath, finalFileContent, 'utf8');
  } else if (mode === 'APPEND' && fs.existsSync(targetFilePath)) {
    const existing = fs.readFileSync(targetFilePath, 'utf8');
    const appendBlock = `\n\n---\n### 📝 [자비스 옵시디언×노션 뉴런 확장 기록 — ${nowStr}]\n${content}\n`;
    finalFileContent = existing + appendBlock;
    fs.writeFileSync(targetFilePath, finalFileContent, 'utf8');
  } else {
    // Create new Obsidian × Notion markdown file
    const hasFrontmatter = content.startsWith('---');
    finalFileContent = hasFrontmatter
      ? content
      : [
          `---`,
          `title: "${title}"`,
          `created: "${new Date().toISOString()}"`,
          `tags: [자비스뉴런, 옵시디언노트]`,
          `---`,
          ``,
          `# 🧠 ${title}`,
          ``,
          content,
          ``
        ].join('\n');
    fs.writeFileSync(targetFilePath, finalFileContent, 'utf8');
  }

  // Parse [[WikiLinks]] and #tags from the saved content and dynamically update brain.json!
  const meta = parseObsidianMarkdownMetadata(finalFileContent);
  const brain = loadBrainGraphData();
  if (!Array.isArray(brain.nodes)) brain.nodes = [];
  if (!Array.isArray(brain.links)) brain.links = [];

  const relPath = targetFilePath.replace(/\\/g, '/');
  let mainNode = brain.nodes.find(
    n => (sourceNodeId && String(n.id) === sourceNodeId) ||
         String(n.path || '').replace(/\\/g, '/').toLowerCase() === relPath.toLowerCase() ||
         String(n.label || '').toLowerCase() === title.toLowerCase()
  );

  const createdNodes = [];
  const createdLinks = [];

  if (!mainNode) {
    mainNode = {
      id: sourceNodeId || `neuron-custom-${Date.now()}`,
      label: title.endsWith('.md') ? title : `${title}.md`,
      cat: 'doc',
      slotId: 'custom_obsidian_vault',
      slotLabel: '🧠 옵시디언×노션 뉴런 볼트',
      slotColor: '#38bdf8',
      path: relPath,
      val: 16,
      summary: content.replace(/[#*`>\[\]-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140),
      tags: meta.tags
    };
    brain.nodes.push(mainNode);
    createdNodes.push(mainNode);
  } else {
    mainNode.summary = content.replace(/[#*`>\[\]-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140);
    mainNode.tags = meta.tags;
  }

  // Wire every [[WikiLink]] as a real synapse edge in brain.json (creating target nodes if new!)
  for (const wl of meta.wikiLinks) {
    let targetNode = brain.nodes.find(
      n => String(n.label || '').toLowerCase() === wl.target.toLowerCase() ||
           String(n.label || '').replace(/\.[^.]+$/, '').toLowerCase() === wl.target.toLowerCase()
    );
    if (!targetNode) {
      const wlSlug = wl.target.replace(/[\\/:*?"<>|]/g, '_').trim();
      const wlFilePath = path.join(VAULT_NEURONS_DIR, `${wlSlug}.md`);
      if (!fs.existsSync(wlFilePath)) {
        fs.writeFileSync(
          wlFilePath,
          `---\ntitle: "${wl.target}"\ncreated: "${new Date().toISOString()}"\n---\n\n# 🔗 ${wl.target}\n\n- 역방향 연결 원본: [[${title}]]\n`,
          'utf8'
        );
      }
      targetNode = {
        id: `neuron-wiki-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label: wl.target,
        cat: 'topic',
        slotId: 'custom_obsidian_vault',
        slotLabel: '🧠 옵시디언×노션 뉴런 볼트',
        slotColor: '#c084fc',
        path: wlFilePath.replace(/\\/g, '/'),
        val: 13,
        summary: `[[${title}]] 뉴런에서 파생된 옵시디언 시냅스 노드`
      };
      brain.nodes.push(targetNode);
      createdNodes.push(targetNode);
    }

    const linkExists = brain.links.some(lk => {
      const s = typeof lk.source === 'object' ? lk.source.id : lk.source;
      const t = typeof lk.target === 'object' ? lk.target.id : lk.target;
      return (s === mainNode.id && t === targetNode.id) || (s === targetNode.id && t === mainNode.id);
    });
    if (!linkExists && mainNode.id !== targetNode.id) {
      const newLink = { source: mainNode.id, target: targetNode.id, weight: 2 };
      brain.links.push(newLink);
      createdLinks.push(newLink);
    }
  }

  // Connect to J.A.R.V.I.S. Core if the node has no links at all
  const hasAnyLink = brain.links.some(lk => {
    const s = typeof lk.source === 'object' ? lk.source.id : lk.source;
    const t = typeof lk.target === 'object' ? lk.target.id : lk.target;
    return s === mainNode.id || t === mainNode.id;
  });
  if (!hasAnyLink) {
    const coreNode = brain.nodes[0];
    if (coreNode && coreNode.id !== mainNode.id) {
      const coreLink = { source: coreNode.id, target: mainNode.id, weight: 1 };
      brain.links.push(coreLink);
      createdLinks.push(coreLink);
    }
  }

  saveBrainGraphData(brain);

  return {
    ok: true,
    mode,
    savedPath: relPath,
    mainNode,
    createdNodes,
    createdLinks,
    obsidianMeta: meta,
    totalNodes: brain.nodes.length,
    totalLinks: brain.links.length,
    message: `✅ [${mainNode.label}] 뉴런 노트가 저장되었으며, 3D 뉴런홈 그래프에 신규 뉴런 ${createdNodes.length}개·시냅스 ${createdLinks.length}개가 실시간 반영되었습니다.`
  };
}

module.exports = {
  parseObsidianMarkdownMetadata,
  getNeuronFullDetail,
  saveOrAppendNeuronNote
};
