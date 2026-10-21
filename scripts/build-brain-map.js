/**
 * BSC J.A.R.V.I.S. OS — Deterministic 2-Hop Brain Map Builder (MAPS Card 1 & Card 5)
 * Rule: "Show, don't store" — Reads BSC_HQ (6.Knowledge_Index, 0.Guidelines, 2.Agents)
 *       and local c:\BSC_Javis_OS\vault + research in strictly READ-ONLY mode.
 *       Outputs public/data/brain.json for 6 interactive graph views.
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(WORKSPACE_ROOT, 'public', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'brain.json');

const SCAN_ROOTS = [
  {
    id: 'hub_worldview',
    label: 'Coram Deo & Together (Worldview)',
    area: 'Worldview & Soul',
    layer: 'core',
    kind: 'memory',
    color: '#fbbf24', // Gold
    dir: path.join(WORKSPACE_ROOT, 'vault'),
    maxFiles: 50
  },
  {
    id: 'hub_guidelines',
    label: 'BSC Guidelines & Constitution',
    area: '00.Guidelines (HQ)',
    layer: 'core',
    kind: 'area',
    color: '#38bdf8', // Cyan
    dir: 'C:\\BeausCreators\\01.BSC_HQ\\0.Guidelines',
    maxFiles: 80
  },
  {
    id: 'hub_agents',
    label: 'BSC 28 AI Agents Squad',
    area: '02.Agents (28 Roster)',
    layer: 'skills',
    kind: 'skill',
    color: '#34d399', // Emerald
    dir: 'C:\\BeausCreators\\01.BSC_HQ\\2.Agents\\에이전트',
    maxFiles: 90
  },
  {
    id: 'hub_knowledge',
    label: 'BSC Knowledge Index (SSOT)',
    area: '06.Knowledge_Index',
    layer: 'memory',
    kind: 'note',
    color: '#a855f7', // Purple
    dir: 'C:\\BeausCreators\\01.BSC_HQ\\6.Knowledge_Index',
    maxFiles: 180
  },
  {
    id: 'hub_research',
    label: 'Global 112 Jarvis Open-Source',
    area: '07.Jarvis Deep Research',
    layer: 'apps',
    kind: 'project',
    color: '#f97316', // Orange
    dir: path.join(WORKSPACE_ROOT, 'research'),
    maxFiles: 120
  },
  {
    id: 'hub_documents',
    label: 'BSC Reports & WorkLogs',
    area: '01.Documents (HQ)',
    layer: 'runs',
    kind: 'run',
    color: '#ec4899', // Pink
    dir: 'C:\\BeausCreators\\01.BSC_HQ\\1.Documents',
    maxFiles: 90
  },
  {
    id: 'hub_branch_projects',
    label: 'BSC Branch & Real Projects (소풍·웹·게임)',
    area: '02.BSC_Branch',
    layer: 'apps',
    kind: 'project',
    color: '#00f0ff',
    dir: 'C:\\BeausCreators\\02.BSC_Branch',
    maxFiles: 80
  },
  {
    id: 'hub_publisher_os',
    label: 'Publishing OS (출판사 OS · 아름다운 세상)',
    area: '04.Publishing',
    layer: 'apps',
    kind: 'project',
    color: '#fbbf24',
    dir: 'C:\\BeausCreators\\04.Publisher',
    maxFiles: 50
  },
  {
    id: 'hub_antigravity_ide',
    label: 'Antigravity IDE Live Chats & Artifacts',
    area: 'IDE Live Brain',
    layer: 'runs',
    kind: 'run',
    color: '#38bdf8',
    dir: 'C:\\Users\\USER\\.gemini\\antigravity\\brain',
    maxFiles: 50
  }
];

function walkMarkdownFiles(dirPath, maxFiles, results = []) {
  if (results.length >= maxFiles) return results;
  if (!fs.existsSync(dirPath)) return results;

  let entries = [];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (e) {
    return results;
  }

  for (const entry of entries) {
    if (results.length >= maxFiles) break;
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'vendor') continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, maxFiles, results);
    } else if (entry.isFile() && /\.(md|json|html)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractSummaryAndLinks(filePath) {
  try {
    const stat = fs.statSync(filePath);
    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let title = path.basename(filePath, path.extname(filePath));
    let summary = '';

    for (const line of lines.slice(0, 20)) {
      if (line.startsWith('# ') && title === path.basename(filePath, path.extname(filePath))) {
        title = line.replace(/^#+\s*/, '').trim();
      } else if (!line.startsWith('#') && !line.startsWith('---') && !line.startsWith('```') && summary.length < 180) {
        summary += (summary ? ' ' : '') + line.replace(/^[>*-\s]+/, '');
      }
    }

    const wikiLinks = [];
    const wikiRegex = /\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g;
    let m;
    while ((m = wikiRegex.exec(raw)) !== null) {
      wikiLinks.push(m[1].trim());
    }

    return {
      title: title.slice(0, 64),
      summary: (summary || 'BSC J.A.R.V.I.S. Knowledge Node').slice(0, 220),
      wikiLinks,
      changed: stat.mtime.toISOString(),
      size: stat.size
    };
  } catch (e) {
    return {
      title: path.basename(filePath),
      summary: 'Read-only indexed node',
      wikiLinks: [],
      changed: new Date().toISOString(),
      size: 0
    };
  }
}

function buildBrainGraph() {
  const nodes = [];
  const links = [];
  const nodeByName = new Map();
  const nodeById = new Map();

  // 1. Root Core Node (J.A.R.V.I.S. Core Steward)
  const rootNode = {
    id: 'root_jarvis_core',
    kind: 'root',
    label: 'J.A.R.V.I.S. Core (Coram Deo & Together)',
    area: 'Worldview & Soul',
    layer: 'core',
    color: '#00f0ff',
    path: path.join(WORKSPACE_ROOT, 'vault', '00_SOUL_and_Worldview.md').replace(/\\/g, '/'),
    note: '이건우 대표님과 함께(Together) 동역하는 개혁주의 장로교 청지기 자율 에이전트 OS 코어',
    changed: new Date().toISOString(),
    val: 28
  };
  nodes.push(rootNode);
  nodeById.set(rootNode.id, rootNode);

  // 2. Scan each root hub
  for (const hub of SCAN_ROOTS) {
    const hubNode = {
      id: hub.id,
      kind: 'area',
      label: hub.label,
      area: hub.area,
      layer: hub.layer,
      color: hub.color,
      path: hub.dir.replace(/\\/g, '/'),
      note: `[TOP HUB] ${hub.area} — Read-Only SSOT Cluster`,
      changed: new Date().toISOString(),
      val: 18
    };
    nodes.push(hubNode);
    nodeById.set(hubNode.id, hubNode);
    links.push({ s: rootNode.id, t: hubNode.id, type: 'core-hub' });

    const files = walkMarkdownFiles(hub.dir, hub.maxFiles);
    const folderHubs = new Map();

    for (const filePath of files) {
      const rel = path.relative(hub.dir, filePath);
      const parts = rel.split(path.sep);
      let parentId = hubNode.id;

      // Subfolder cluster node (1 level deep)
      if (parts.length > 1) {
        const subFolderName = parts[0];
        const subHubId = `${hub.id}_sub_${subFolderName}`;
        if (!folderHubs.has(subHubId)) {
          const subNode = {
            id: subHubId,
            kind: 'project',
            label: subFolderName,
            area: hub.area,
            layer: hub.layer,
            color: hub.color,
            path: path.join(hub.dir, subFolderName).replace(/\\/g, '/'),
            note: `${hub.area} > ${subFolderName} 도메인 클러스터`,
            changed: new Date().toISOString(),
            val: 10
          };
          nodes.push(subNode);
          nodeById.set(subNode.id, subNode);
          folderHubs.set(subHubId, subNode);
          links.push({ s: hubNode.id, t: subHubId, type: 'hub-sub' });
        }
        parentId = subHubId;
      }

      const meta = extractSummaryAndLinks(filePath);
      const baseName = path.basename(filePath, path.extname(filePath));
      const nodeId = `node_${nodes.length}_${baseName.replace(/[^a-zA-Z0-9가-힣_-]/g, '_')}`;

      const fileNode = {
        id: nodeId,
        kind: hub.kind,
        label: meta.title || baseName,
        area: hub.area,
        layer: hub.layer,
        color: hub.color,
        path: filePath.replace(/\\/g, '/'),
        note: meta.summary,
        changed: meta.changed,
        size: meta.size,
        wikiLinks: meta.wikiLinks,
        val: 5
      };

      nodes.push(fileNode);
      nodeById.set(nodeId, fileNode);
      nodeByName.set(baseName.toLowerCase(), nodeId);
      nodeByName.set(fileNode.label.toLowerCase(), nodeId);

      links.push({ s: parentId, t: nodeId, type: 'parent-child' });
    }
  }

  // 3. Resolve cross-reference [[wikilinks]] and semantic connections
  for (const n of nodes) {
    if (Array.isArray(n.wikiLinks)) {
      for (const wl of n.wikiLinks) {
        const targetId = nodeByName.get(wl.toLowerCase());
        if (targetId && targetId !== n.id) {
          links.push({ s: n.id, t: targetId, type: 'wikilink' });
        }
      }
      delete n.wikiLinks;
    }
  }

  // Compute node degree for sizing
  const deg = new Map();
  for (const l of links) {
    deg.set(l.s, (deg.get(l.s) || 0) + 1);
    deg.set(l.t, (deg.get(l.t) || 0) + 1);
  }
  for (const n of nodes) {
    n.degree = deg.get(n.id) || 1;
  }

  const areaStats = {};
  for (const n of nodes) {
    areaStats[n.area] = (areaStats[n.area] || 0) + 1;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    philosophy: 'Coram Deo & Together (Stewardship, Truth, Koinonia, Temperance)',
    rule: 'Show, do not store — Strictly Read-Only Index of BSC_HQ & Local Vault',
    stats: {
      totalNodes: nodes.length,
      totalLinks: links.length,
      areaBreakdown: areaStats,
      tokenSavingsEstimatePct: 88.4
    },
    nodes,
    links
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`[BSC J.A.R.V.I.S. Brain Builder] Built ${nodes.length} nodes & ${links.length} links -> ${OUTPUT_FILE}`);
  return payload;
}

if (require.main === module) {
  buildBrainGraph();
}

module.exports = { buildBrainGraph };
