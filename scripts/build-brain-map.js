/**
 * ============================================================================
 * 🌐 BSC J.A.R.V.I.S. OS — 상업용 슬롯 기반 지식생태계 폴더 선택 & .MD 심층 분석 빌더
 * ============================================================================
 * - 대표님 지침 (2026-10-22):
 *   1) 하드코딩된 특정 회사/프로젝트 경로 프리셋 전면 제거
 *   2) 기본 연결 슬롯 3종 제공 (초기에는 미연결 상태):
 *      - 회사_HQ
 *      - 회사_Branch
 *      - 지식생태계 (데이터 || 옵시디언)
 *   3) 각 기본 슬롯의 [연결] 버튼 또는 [+ 폴더 추가] 버튼 클릭 시:
 *      사용자가 직접 폴더를 선택하고, 선택된 폴더 내부의 마크다운(.md) 문서들과
 *      하위 구조를 심층 분석(제목, H1~H3 목차, #태그, [[옵시디언 링크]], 핵심 요약문 추출)하여
 *      지식 인덱스로 보유함과 동시에 뉴런 홈에 점(Node)과 시냅스(Link)를 생성.
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(WORKSPACE_ROOT, 'public', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'brain.json');
const ECOSYSTEMS_FILE = path.join(OUTPUT_DIR, 'connected-ecosystems.json');
const MD_KNOWLEDGE_INDEX_FILE = path.join(OUTPUT_DIR, 'analyzed-md-knowledge.json');

const PALETTE = [
  '#fbbf24', // Amber (회사_HQ)
  '#34d399', // Emerald (회사_Branch)
  '#a855f7', // Purple (지식생태계 데이터 || 옵시디언)
  '#00f0ff', // Cyan
  '#38bdf8', // Sky Blue
  '#f472b6', // Pink
  '#f97316', // Orange
  '#818cf8'  // Indigo
];

// 상업용 기본 연결 슬롯 3종 (하드코딩된 경로 없이 이름과 역할만 존재하며, 사용자가 [연결] 클릭 시 폴더를 직접 선택)
const DEFAULT_COMMERCIAL_SLOTS = [
  {
    slotId: 'slot_company_hq',
    label: '🏢 회사_HQ',
    roleDescription: '본사 헌장 · 가이드라인 · 보고서 · 핵심 의사결정 마크다운(.md) 폴더',
    color: '#fbbf24',
    isDefaultSlot: true,
    connected: false,
    path: '',
    connectedAt: null,
    analysisSummary: null
  },
  {
    slotId: 'slot_company_branch',
    label: '🚀 회사_Branch',
    roleDescription: '지점 실무 프로젝트 · 서비스 기획서(.md) · 프로덕트 워크스페이스 폴더',
    color: '#34d399',
    isDefaultSlot: true,
    connected: false,
    path: '',
    connectedAt: null,
    analysisSummary: null
  },
  {
    slotId: 'slot_knowledge_ecosystem',
    label: '🧠 지식생태계 (데이터 || 옵시디언)',
    roleDescription: '옵시디언 볼트(Obsidian Vault) · 마크다운(.md) 지식창고 · 데이터 아카이브 폴더',
    color: '#a855f7',
    isDefaultSlot: true,
    connected: false,
    path: '',
    connectedAt: null,
    analysisSummary: null
  }
];

function createInitialSlots() {
  return DEFAULT_COMMERCIAL_SLOTS.map(s => ({ ...s }));
}

function loadConnectedEcosystems() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(ECOSYSTEMS_FILE)) {
    const initial = {
      updatedAt: new Date().toISOString(),
      commercialMode: true,
      slots: createInitialSlots(),
      connectedFolders: []
    };
    fs.writeFileSync(ECOSYSTEMS_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(ECOSYSTEMS_FILE, 'utf8'));
    if (!Array.isArray(parsed.slots) || parsed.slots.length === 0) {
      parsed.slots = createInitialSlots();
    } else {
      // 기본 3대 슬롯이 누락되지 않도록 보장
      for (const def of DEFAULT_COMMERCIAL_SLOTS) {
        if (!parsed.slots.some(s => s.slotId === def.slotId)) {
          parsed.slots.push({ ...def });
        }
      }
    }
    parsed.connectedFolders = parsed.slots.filter(s => s.connected && s.path && fs.existsSync(s.path));
    return parsed;
  } catch (e) {
    return {
      updatedAt: new Date().toISOString(),
      commercialMode: true,
      slots: createInitialSlots(),
      connectedFolders: []
    };
  }
}

function saveConnectedEcosystems(state) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  state.updatedAt = new Date().toISOString();
  state.connectedFolders = (state.slots || []).filter(s => s.connected && s.path && fs.existsSync(s.path));
  fs.writeFileSync(ECOSYSTEMS_FILE, JSON.stringify(state, null, 2), 'utf8');
  return state;
}

/**
 * 마크다운(.md) 파일 심층 구문 분석기
 * - YAML Frontmatter / #태그 / H1~H3 목차 헤딩 / [[옵시디언 위키링크]] / [마크다운 링크]() / 핵심 요약문 추출
 */
function analyzeMarkdownFile(filePath) {
  const baseName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();
  try {
    const stat = fs.statSync(filePath);
    const sizeKb = Math.max(1, Math.round(stat.size / 1024));
    const isMd = ext === '.md' || ext === '.markdown';

    if (!isMd && !/\.(txt|js|ts|py|html|json)$/i.test(ext)) {
      return {
        fileName: baseName,
        filePath: filePath.replace(/\\/g, '/'),
        isMarkdown: false,
        title: baseName,
        headings: [],
        tags: [],
        wikiLinks: [],
        summary: `${baseName} (${sizeKb}KB)`,
        lineCount: 0,
        wordCount: 0,
        sizeKb,
        changed: stat.mtime.toISOString()
      };
    }

    if (stat.size > 1024 * 1024) {
      return {
        fileName: baseName,
        filePath: filePath.replace(/\\/g, '/'),
        isMarkdown: isMd,
        title: baseName,
        headings: [],
        tags: [],
        wikiLinks: [],
        summary: `대용량 파일 (${sizeKb}KB)`,
        lineCount: 0,
        wordCount: 0,
        sizeKb,
        changed: stat.mtime.toISOString()
      };
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split(/\r?\n/);
    const headings = [];
    const tags = new Set();
    const wikiLinks = new Set();
    let title = baseName.replace(/\.md$/i, '');
    const summarySentences = [];

    // 1. YAML Frontmatter 태그 추출
    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fmMatch) {
      const fmBlock = fmMatch[1];
      const titleMatch = fmBlock.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      if (titleMatch && titleMatch[1]) title = titleMatch[1].trim();
      const tagLineMatch = fmBlock.match(/^tags:\s*\[([^\]]+)\]/m);
      if (tagLineMatch) {
        tagLineMatch[1].split(',').map(t => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean).forEach(t => tags.add(t));
      }
    }

    // 2. 헤딩(H1~H3), 본문 해시태그(#태그), 핵심 요약 문장 추출
    let inCodeBlock = false;
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock || !line || line === '---') continue;

      const hMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (hMatch) {
        const level = hMatch[1].length;
        const hText = hMatch[2].replace(/[*_`]/g, '').trim();
        if (level === 1 && title === baseName.replace(/\.md$/i, '')) {
          title = hText.slice(0, 60);
        }
        if (headings.length < 12) {
          headings.push({ level, text: hText.slice(0, 70) });
        }
        continue;
      }

      // 본문 내 #태그 추출 (숫자만 있는 것 제외)
      if (isMd) {
        const hashMatches = line.match(/(?:^|\s)#([a-zA-Z가-힣][a-zA-Z0-9가-힣_-]{1,24})/g);
        if (hashMatches) {
          hashMatches.forEach(hm => tags.add(hm.trim().slice(1)));
        }
      }

      // 요약 문장 수집
      if (summarySentences.length < 3 && !line.startsWith('|') && !line.startsWith('![')) {
        const clean = line.replace(/^[>*+-]\s*/, '').replace(/[*_`]/g, '').trim();
        if (clean.length >= 8) {
          summarySentences.push(clean.slice(0, 120));
        }
      }
    }

    // 3. 옵시디언 [[WikiLink]] 및 마크다운 [Link](file.md) 추출
    const wikiRegex = /\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g;
    let m;
    while ((m = wikiRegex.exec(raw)) !== null) {
      const target = m[1].trim();
      if (target) wikiLinks.add(target);
    }
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+\.md)\)/gi;
    while ((m = mdLinkRegex.exec(raw)) !== null) {
      const targetFile = path.basename(m[2], '.md').trim();
      if (targetFile) wikiLinks.add(targetFile);
    }

    // 코드 파일이면 require/import 관계도 추출
    if (/\.(js|ts|tsx|py)$/i.test(ext)) {
      const importRegex = /(?:require\(['"]\.\/([^'"]+)['"]\)|from\s+['"]\.\/([^'"]+)['"])/g;
      while ((m = importRegex.exec(raw)) !== null) {
        const imp = path.basename(m[1] || m[2] || '');
        if (imp) wikiLinks.add(imp);
      }
    }

    const wordCount = raw.split(/\s+/).filter(Boolean).length;
    const summaryText = summarySentences.length > 0
      ? summarySentences.join(' · ').slice(0, 240)
      : `${title} (${sizeKb}KB, ${lines.length}줄)`;

    return {
      fileName: baseName,
      filePath: filePath.replace(/\\/g, '/'),
      isMarkdown: isMd,
      title,
      headings,
      tags: Array.from(tags).slice(0, 12),
      wikiLinks: Array.from(wikiLinks).slice(0, 20),
      summary: summaryText,
      lineCount: lines.length,
      wordCount,
      sizeKb,
      changed: stat.mtime.toISOString()
    };
  } catch (e) {
    return {
      fileName: baseName,
      filePath: filePath.replace(/\\/g, '/'),
      isMarkdown: ext === '.md',
      title: baseName,
      headings: [],
      tags: [],
      wikiLinks: [],
      summary: baseName,
      lineCount: 0,
      wordCount: 0,
      sizeKb: 1,
      changed: new Date().toISOString()
    };
  }
}

const SKIP_DIRS = new Set([
  'node_modules', 'vendor', 'dist', 'build', '__pycache__', '.git',
  'venv', '.venv', 'env', 'Library', 'Temp', 'Obj', 'Logs', '.trash'
]);

/**
 * 폴더 내 전체 파일 전수 센서스 (추출된 파일뿐만 아니라 남은 모든 .md / 코드 / 문서 / 에셋 100% 파악)
 */
function scanFullFolderCensus(rootDir, maxDepth = 5) {
  const census = {
    totalDirs: 0,
    totalAllFiles: 0,
    totalMdFiles: 0,
    totalCodeFiles: 0,
    totalOfficeDocs: 0,
    totalOtherAssets: 0,
    subDomains: []
  };
  if (!fs.existsSync(rootDir)) return census;

  function countRecursive(dir, depth, bucket) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (_) {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
      if (e.isDirectory()) {
        bucket.dirs++;
        if (depth < maxDepth) {
          countRecursive(path.join(dir, e.name), depth + 1, bucket);
        }
      } else if (e.isFile()) {
        bucket.all++;
        const ext = path.extname(e.name).toLowerCase();
        if (ext === '.md' || ext === '.markdown') bucket.md++;
        else if (['.js', '.ts', '.tsx', '.jsx', '.py', '.ps1', '.sh', '.html', '.css', '.json', '.cs', '.sql'].includes(ext)) bucket.code++;
        else if (['.docx', '.pptx', '.pdf', '.xlsx', '.xls', '.txt', '.csv', '.epub', '.hwp'].includes(ext)) bucket.docs++;
        else bucket.other++;
      }
    }
  }

  let topEntries = [];
  try {
    topEntries = fs.readdirSync(rootDir, { withFileTypes: true });
  } catch (_) {}

  for (const entry of topEntries) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
    const fullP = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      const subBucket = { name: entry.name, path: fullP.replace(/\\/g, '/'), dirs: 1, all: 0, md: 0, code: 0, docs: 0, other: 0 };
      countRecursive(fullP, 1, subBucket);
      census.totalDirs += subBucket.dirs;
      census.totalAllFiles += subBucket.all;
      census.totalMdFiles += subBucket.md;
      census.totalCodeFiles += subBucket.code;
      census.totalOfficeDocs += subBucket.docs;
      census.totalOtherAssets += subBucket.other;
      census.subDomains.push(subBucket);
    } else if (entry.isFile()) {
      census.totalAllFiles++;
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === '.md' || ext === '.markdown') census.totalMdFiles++;
      else if (['.js', '.ts', '.tsx', '.jsx', '.py', '.ps1', '.sh', '.html', '.css', '.json', '.cs', '.sql'].includes(ext)) census.totalCodeFiles++;
      else if (['.docx', '.pptx', '.pdf', '.xlsx', '.xls', '.txt', '.csv', '.epub', '.hwp'].includes(ext)) census.totalOfficeDocs++;
      else census.totalOtherAssets++;
    }
  }

  census.subDomains.sort((a, b) => (b.md + b.code + b.docs) - (a.md + a.code + a.docs));
  return census;
}

function walkEcosystemFiles(dirPath, maxFiles, results = []) {
  if (results.length >= maxFiles) return results;
  if (!fs.existsSync(dirPath)) return results;

  let entries = [];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (e) {
    return results;
  }

  // 마크다운(.md) 파일을 최우선으로 수집하도록 정렬
  entries.sort((a, b) => {
    const aMd = a.isFile() && /\.md$/i.test(a.name) ? 0 : 1;
    const bMd = b.isFile() && /\.md$/i.test(b.name) ? 0 : 1;
    return aMd - bMd || a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    if (results.length >= maxFiles) break;
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkEcosystemFiles(fullPath, maxFiles, results);
    } else if (
      entry.isFile() &&
      /\.(md|markdown|txt|js|ts|tsx|py|html|css|json|docx|pptx|pdf|xlsx|xls|epub|cs)$/i.test(entry.name) &&
      !/package-lock\.json$/i.test(entry.name)
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * 하위 도메인 균등 추출기 (특정 1개 하위 폴더에서만 120개를 다 채우지 않고, 모든 하위 폴더에서 골고루 추출)
 */
function walkStratifiedEcosystemFiles(rootDir, maxFiles = 140) {
  if (!fs.existsSync(rootDir)) return [];
  const results = [];
  let topEntries = [];
  try {
    topEntries = fs.readdirSync(rootDir, { withFileTypes: true });
  } catch (_) {
    return results;
  }

  // 1. 루트 직속 파일 먼저 수집
  for (const entry of topEntries) {
    if (entry.isFile() && /\.(md|markdown|txt|js|ts|py|json|docx|pptx|pdf|xlsx)$/i.test(entry.name) && !/package-lock\.json$/i.test(entry.name)) {
      results.push(path.join(rootDir, entry.name));
      if (results.length >= Math.min(25, maxFiles)) break;
    }
  }

  // 2. 모든 하위 폴더별로 균등 할당하여 골고루 추출
  const subDirs = topEntries.filter(e => e.isDirectory() && !e.name.startsWith('.') && !SKIP_DIRS.has(e.name));
  if (subDirs.length > 0) {
    const remainingBudget = Math.max(20, maxFiles - results.length);
    const perSubDirQuota = Math.max(8, Math.ceil(remainingBudget / subDirs.length));
    for (const sd of subDirs) {
      if (results.length >= maxFiles) break;
      const subFiles = walkEcosystemFiles(path.join(rootDir, sd.name), perSubDirQuota, []);
      for (const sf of subFiles) {
        if (results.length >= maxFiles) break;
        results.push(sf);
      }
    }
  }
  return results;
}

/**
 * 추출된 뉴런 외에 디스크에 남아 있는 모든 파일(수만 개 .md, 코드, 문서, 에셋)을 실시간 검색하는 전수 탐색기
 */
function searchAllRemainingFilesOnDisk(query = '', limit = 50) {
  const q = String(query || '').trim().toLowerCase();
  const state = loadConnectedEcosystems();
  const connected = (state.slots || []).filter(s => s.connected && s.path && fs.existsSync(s.path));
  const matches = [];

  function searchDir(dir, slotLabel, depth = 0) {
    if (matches.length >= limit || depth > 5) return;
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (_) {
      return;
    }
    for (const e of entries) {
      if (matches.length >= limit) break;
      if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
      const fullP = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!q || e.name.toLowerCase().includes(q)) {
          matches.push({
            kind: 'directory',
            slotLabel,
            name: e.name,
            path: fullP.replace(/\\/g, '/')
          });
        }
        searchDir(fullP, slotLabel, depth + 1);
      } else if (e.isFile()) {
        if (!q || e.name.toLowerCase().includes(q) || fullP.toLowerCase().includes(q)) {
          const parsed = /\.md$/i.test(e.name) ? analyzeMarkdownFile(fullP) : null;
          matches.push({
            kind: 'file',
            slotLabel,
            name: e.name,
            path: fullP.replace(/\\/g, '/'),
            title: parsed ? parsed.title : e.name,
            summary: parsed ? parsed.summary : `${e.name} (${path.extname(e.name) || 'file'})`
          });
        }
      }
    }
  }

  for (const s of connected) {
    if (matches.length >= limit) break;
    searchDir(s.path, s.label, 0);
  }
  return matches;
}

/**
 * 폴더 전체 마크다운(.md) 및 지식생태계 분석 실행기 (균등 추출 + 남은 파일 100% 전수 센서스 포함)
 */
function analyzeFolderEcosystem(folderPath, maxFiles = 140) {
  const census = scanFullFolderCensus(folderPath, 5);
  const allFiles = walkStratifiedEcosystemFiles(folderPath, maxFiles);
  const analyzedDocs = allFiles.map(f => analyzeMarkdownFile(f));
  const mdDocs = analyzedDocs.filter(d => d.isMarkdown);

  const allTags = new Set();
  let totalHeadings = 0;
  let totalWikiLinks = 0;
  let totalWords = 0;

  for (const doc of analyzedDocs) {
    totalHeadings += (doc.headings || []).length;
    totalWikiLinks += (doc.wikiLinks || []).length;
    totalWords += doc.wordCount || 0;
    (doc.tags || []).forEach(t => allTags.add(t));
  }

  const remainingFilesCount = Math.max(0, census.totalAllFiles - analyzedDocs.length);
  const remainingMdCount = Math.max(0, census.totalMdFiles - mdDocs.length);

  return {
    analyzedAt: new Date().toISOString(),
    folderPath: folderPath.replace(/\\/g, '/'),
    totalFilesScanned: analyzedDocs.length,
    markdownFileCount: mdDocs.length,
    otherFileCount: analyzedDocs.length - mdDocs.length,
    // 전수 센서스 (추출된 것 + 남은 모든 파일 100% 파악 지표)
    fullDiskCensus: {
      totalDirsOnDisk: census.totalDirs,
      totalAllFilesOnDisk: census.totalAllFiles,
      totalMdFilesOnDisk: census.totalMdFiles,
      totalCodeFilesOnDisk: census.totalCodeFiles,
      totalOfficeDocsOnDisk: census.totalOfficeDocs,
      totalOtherAssetsOnDisk: census.totalOtherAssets,
      remainingUnextractedFiles: remainingFilesCount,
      remainingUnextractedMdFiles: remainingMdCount,
      subDomains: census.subDomains.slice(0, 20)
    },
    totalHeadingsCount: totalHeadings,
    totalWikiLinksCount: totalWikiLinks,
    totalWordCount: totalWords,
    extractedTags: Array.from(allTags).slice(0, 25),
    topMarkdownDocs: mdDocs.slice(0, 25).map(d => ({
      fileName: d.fileName,
      filePath: d.filePath,
      title: d.title,
      headings: d.headings.slice(0, 5).map(h => h.text),
      tags: d.tags,
      wikiLinks: d.wikiLinks,
      summary: d.summary,
      lineCount: d.lineCount,
      sizeKb: d.sizeKb
    })),
    allAnalyzedFiles: analyzedDocs
  };
}

/**
 * 슬롯 연결 또는 새 폴더 추가 연결
 * @param {string|object} folderPathOrOpts
 */
function connectKnowledgeFolder(folderPathOrOpts, customLabel = '', customColor = '', targetSlotId = '') {
  let folderPath = '';
  let label = customLabel;
  let color = customColor;
  let slotId = targetSlotId;

  if (typeof folderPathOrOpts === 'object' && folderPathOrOpts !== null) {
    folderPath = folderPathOrOpts.folderPath || folderPathOrOpts.path || '';
    label = folderPathOrOpts.label || '';
    color = folderPathOrOpts.color || '';
    slotId = folderPathOrOpts.slotId || '';
  } else {
    folderPath = String(folderPathOrOpts || '');
  }

  const cleanPath = String(folderPath || '').trim().replace(/\//g, '\\');
  if (!cleanPath || !fs.existsSync(cleanPath)) {
    return { ok: false, error: `선택하신 폴더 경로를 찾을 수 없습니다: ${cleanPath}` };
  }
  const stat = fs.statSync(cleanPath);
  const targetDir = stat.isDirectory() ? cleanPath : path.dirname(cleanPath);

  // 선택된 폴더 내 .md 파일 및 하위 생태계 즉시 분석 (균등 추출 + 전수 센서스)
  const analysis = analyzeFolderEcosystem(targetDir, 140);

  const state = loadConnectedEcosystems();
  let slot = null;

  if (slotId) {
    slot = state.slots.find(s => s.slotId === slotId);
  }
  if (!slot) {
    const normTarget = path.resolve(targetDir).toLowerCase();
    slot = state.slots.find(s => s.path && path.resolve(s.path).toLowerCase() === normTarget);
  }

  if (slot) {
    slot.path = targetDir;
    if (label) slot.label = label;
    if (color) slot.color = color;
    slot.connected = true;
    slot.connectedAt = new Date().toISOString();
    slot.analysisSummary = {
      analyzedAt: analysis.analyzedAt,
      totalFilesScanned: analysis.totalFilesScanned,
      markdownFileCount: analysis.markdownFileCount,
      otherFileCount: analysis.otherFileCount,
      fullDiskCensus: analysis.fullDiskCensus,
      totalHeadingsCount: analysis.totalHeadingsCount,
      totalWikiLinksCount: analysis.totalWikiLinksCount,
      totalWordCount: analysis.totalWordCount,
      extractedTags: analysis.extractedTags,
      topMarkdownDocs: analysis.topMarkdownDocs
    };
  } else {
    const newSlotId = `slot_custom_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
    slot = {
      slotId: newSlotId,
      label: label || `📂 ${path.basename(targetDir)}`,
      roleDescription: `사용자 추가 폴더 (${path.basename(targetDir)}) — .md 문서 및 지식 분석 슬롯`,
      color: color || PALETTE[state.slots.length % PALETTE.length],
      isDefaultSlot: false,
      connected: true,
      path: targetDir,
      connectedAt: new Date().toISOString(),
      analysisSummary: {
        analyzedAt: analysis.analyzedAt,
        totalFilesScanned: analysis.totalFilesScanned,
        markdownFileCount: analysis.markdownFileCount,
        otherFileCount: analysis.otherFileCount,
        fullDiskCensus: analysis.fullDiskCensus,
        totalHeadingsCount: analysis.totalHeadingsCount,
        totalWikiLinksCount: analysis.totalWikiLinksCount,
        totalWordCount: analysis.totalWordCount,
        extractedTags: analysis.extractedTags,
        topMarkdownDocs: analysis.topMarkdownDocs
      }
    };
    state.slots.push(slot);
  }

  saveConnectedEcosystems(state);
  const graph = buildBrainGraph();
  return {
    ok: true,
    connectedSlot: slot,
    connectedFolder: slot,
    slots: state.slots,
    connectedFolders: state.connectedFolders,
    analysisSummary: slot.analysisSummary,
    graphStats: graph.stats
  };
}

function disconnectKnowledgeFolder(slotIdOrPath) {
  const key = String(slotIdOrPath || '').trim().toLowerCase();
  const state = loadConnectedEcosystems();

  state.slots = state.slots.filter(slot => {
    const pNorm = slot.path ? path.resolve(slot.path).toLowerCase() : '';
    const isMatch =
      slot.slotId.toLowerCase() === key ||
      (pNorm && (pNorm === key || pNorm.endsWith(key)));

    if (!isMatch) return true;

    if (slot.isDefaultSlot) {
      // 기본 슬롯(회사_HQ, 회사_Branch, 지식생태계)은 슬롯 자체는 유지하고 미연결 상태로 초기화
      slot.connected = false;
      slot.path = '';
      slot.connectedAt = null;
      slot.analysisSummary = null;
      return true;
    }
    // 사용자가 추가한 커스텀 슬롯은 목록에서 제거
    return false;
  });

  saveConnectedEcosystems(state);
  const graph = buildBrainGraph();
  return {
    ok: true,
    slots: state.slots,
    connectedFolders: state.connectedFolders,
    graphStats: graph.stats
  };
}

function clearAllKnowledgeFolders() {
  const state = loadConnectedEcosystems();
  state.slots = createInitialSlots();
  saveConnectedEcosystems(state);
  const graph = buildBrainGraph();
  return {
    ok: true,
    slots: state.slots,
    connectedFolders: [],
    graphStats: graph.stats
  };
}

function buildBrainGraph() {
  const ecoState = loadConnectedEcosystems();
  const connectedSlots = (ecoState.slots || []).filter(s => s.connected && s.path && fs.existsSync(s.path));

  const nodes = [];
  const links = [];
  const nodeByName = new Map();
  const nodeById = new Map();
  const allMdIndexEntries = [];
  const globalDiskInventory = {
    totalDirsOnDisk: 0,
    totalAllFilesOnDisk: 0,
    totalMdFilesOnDisk: 0,
    totalCodeFilesOnDisk: 0,
    totalOfficeDocsOnDisk: 0,
    totalOtherAssetsOnDisk: 0,
    remainingUnextractedFiles: 0,
    remainingUnextractedMdFiles: 0
  };

  // 1. 중앙 코어 시드 노드 (항상 1개 존재)
  const rootNode = {
    id: 'root_jarvis_core',
    kind: 'root',
    category: 'person',
    label: '🤖 J.A.R.V.I.S. 코어',
    subtitle: connectedSlots.length > 0
      ? `연결된 지식생태계 ${connectedSlots.length}개 슬롯 활성 (.md 심층 추출 + 남은 전체 파일 전수 파악 완료)`
      : '상업용 클린 모드 — [🔗 지식생태계 폴더 연결]에서 폴더를 선택하면 .md 분석 후 뉴런이 생성됩니다',
    area: 'J.A.R.V.I.S. Core',
    layer: 'core',
    color: '#00f0ff',
    path: WORKSPACE_ROOT.replace(/\\/g, '/'),
    note: connectedSlots.length > 0
      ? `현재 ${connectedSlots.map(s => `${s.label}(${path.basename(s.path)})`).join(', ')} 폴더가 연결되어 뉴런 추출 문서와 남은 모든 하위 파일들을 100% 파악하고 있습니다.`
      : '아직 연결된 폴더가 없습니다. [회사_HQ], [회사_Branch], [지식생태계 (데이터 || 옵시디언)] 또는 [+ 폴더 추가] 버튼을 눌러 폴더를 선택해 주세요.',
    changed: new Date().toISOString(),
    val: 28
  };
  nodes.push(rootNode);
  nodeById.set(rootNode.id, rootNode);

  // 2. 연결된 슬롯 폴더들의 .md 및 파일들을 분석하여 뉴런 점(Node) & 시냅스(Link) 생성
  connectedSlots.forEach((slot, sIdx) => {
    const analysis = analyzeFolderEcosystem(slot.path, 140);
    const census = analysis.fullDiskCensus || {};
    globalDiskInventory.totalDirsOnDisk += census.totalDirsOnDisk || 0;
    globalDiskInventory.totalAllFilesOnDisk += census.totalAllFilesOnDisk || 0;
    globalDiskInventory.totalMdFilesOnDisk += census.totalMdFilesOnDisk || 0;
    globalDiskInventory.totalCodeFilesOnDisk += census.totalCodeFilesOnDisk || 0;
    globalDiskInventory.totalOfficeDocsOnDisk += census.totalOfficeDocsOnDisk || 0;
    globalDiskInventory.totalOtherAssetsOnDisk += census.totalOtherAssetsOnDisk || 0;
    globalDiskInventory.remainingUnextractedFiles += census.remainingUnextractedFiles || 0;
    globalDiskInventory.remainingUnextractedMdFiles += census.remainingUnextractedMdFiles || 0;

    slot.analysisSummary = {
      analyzedAt: analysis.analyzedAt,
      totalFilesScanned: analysis.totalFilesScanned,
      markdownFileCount: analysis.markdownFileCount,
      otherFileCount: analysis.otherFileCount,
      fullDiskCensus: census,
      totalHeadingsCount: analysis.totalHeadingsCount,
      totalWikiLinksCount: analysis.totalWikiLinksCount,
      totalWordCount: analysis.totalWordCount,
      extractedTags: analysis.extractedTags,
      topMarkdownDocs: analysis.topMarkdownDocs
    };

    const hubId = slot.slotId || `eco_hub_${sIdx}`;
    const hubColor = slot.color || PALETTE[sIdx % PALETTE.length];

    const hubNode = {
      id: hubId,
      kind: 'area',
      category: 'project',
      isEcosystemHub: true,
      ecosystemOrder: sIdx,
      label: `${slot.label} (${path.basename(slot.path)})`,
      subtitle: `전체 ${(census.totalAllFilesOnDisk || analysis.totalFilesScanned).toLocaleString()}개 파일 파악 (.md ${(census.totalMdFilesOnDisk || analysis.markdownFileCount).toLocaleString()}개 · 코드 ${(census.totalCodeFilesOnDisk || 0).toLocaleString()}개 · 문서 ${(census.totalOfficeDocsOnDisk || 0).toLocaleString()}개)`,
      area: slot.label,
      layer: 'apps',
      color: hubColor,
      path: slot.path.replace(/\\/g, '/'),
      note: `[${slot.label}] ${slot.path} — 디스크 전체 파일 ${(census.totalAllFilesOnDisk || 0).toLocaleString()}개(전체 .md ${(census.totalMdFilesOnDisk || 0).toLocaleString()}개, 코드 ${(census.totalCodeFilesOnDisk || 0).toLocaleString()}개, 문서 ${(census.totalOfficeDocsOnDisk || 0).toLocaleString()}개, 기타 에셋 ${(census.totalOtherAssetsOnDisk || 0).toLocaleString()}개)를 100% 파악했으며, 핵심 대표 문서 ${analysis.totalFilesScanned}개를 뉴런으로 심층 추출했습니다.`,
      changed: slot.connectedAt || new Date().toISOString(),
      val: 20
    };
    nodes.push(hubNode);
    nodeById.set(hubNode.id, hubNode);
    links.push({ s: rootNode.id, t: hubNode.id, type: 'core-hub', color: hubColor });

    const subFolderHubs = new Map();

    // 전수 조사된 모든 하위 도메인 폴더를 먼저 클러스터 허브로 생성 (남은 파일들도 100% 파악되도록!)
    (census.subDomains || []).forEach(sd => {
      const subHubId = `${hubId}_sub_${sd.name.replace(/[^a-zA-Z0-9가-힣_-]/g, '_')}`;
      if (!subFolderHubs.has(subHubId)) {
        const subNode = {
          id: subHubId,
          kind: 'project',
          category: 'topic',
          parentHubId: hubId,
          label: `🗂️ ${sd.name} (${sd.all.toLocaleString()}파일)`,
          subtitle: `.md ${sd.md.toLocaleString()}개 · 코드 ${sd.code.toLocaleString()}개 · 문서 ${sd.docs.toLocaleString()}개 · 기타 ${sd.other.toLocaleString()}개`,
          area: hubNode.area,
          layer: 'skills',
          color: hubColor,
          path: sd.path,
          note: `[전수 파악 클러스터] ${sd.path} — 하위 폴더 ${sd.dirs}개, 전체 파일 ${sd.all.toLocaleString()}개(.md ${sd.md.toLocaleString()}개, 코드 ${sd.code.toLocaleString()}개, 오피스/PDF 문서 ${sd.docs.toLocaleString()}개, 기타 에셋 ${sd.other.toLocaleString()}개) 파악됨`,
          changed: new Date().toISOString(),
          val: 12
        };
        nodes.push(subNode);
        nodeById.set(subNode.id, subNode);
        subFolderHubs.set(subHubId, subNode);
        links.push({ s: hubNode.id, t: subHubId, type: 'hub-sub', color: hubColor });
      }
    });

    analysis.allAnalyzedFiles.forEach((doc) => {
      const fullPath = doc.filePath.replace(/\//g, path.sep);
      const rel = path.relative(slot.path, fullPath);
      const parts = rel.split(path.sep);
      let parentId = hubNode.id;

      // 하위 폴더 클러스터 허브 연결
      if (parts.length > 1) {
        const subFolderName = parts[0];
        const subHubId = `${hubId}_sub_${subFolderName.replace(/[^a-zA-Z0-9가-힣_-]/g, '_')}`;
        if (!subFolderHubs.has(subHubId)) {
          const subNode = {
            id: subHubId,
            kind: 'project',
            category: 'topic',
            parentHubId: hubId,
            label: `🗂️ ${subFolderName}`,
            subtitle: `${slot.label} > ${subFolderName}`,
            area: hubNode.area,
            layer: 'skills',
            color: hubColor,
            path: path.join(slot.path, subFolderName).replace(/\\/g, '/'),
            note: `${slot.path}\\${subFolderName} 하위 폴더 클러스터`,
            changed: new Date().toISOString(),
            val: 11
          };
          nodes.push(subNode);
          nodeById.set(subNode.id, subNode);
          subFolderHubs.set(subHubId, subNode);
          links.push({ s: hubNode.id, t: subHubId, type: 'hub-sub', color: hubColor });
        }
        parentId = subHubId;
      }

      const baseNameNoExt = path.basename(doc.fileName, path.extname(doc.fileName));
      const nodeId = `neuron_${nodes.length}_${baseNameNoExt.replace(/[^a-zA-Z0-9가-힣_-]/g, '_').slice(0, 32)}`;

      let category = doc.isMarkdown ? 'doc' : 'project';
      let kind = doc.isMarkdown ? 'note' : 'code';
      if (/skill\.md$/i.test(doc.fileName)) {
        category = 'topic';
        kind = 'skill';
      }

      const headingsPreview = (doc.headings || []).slice(0, 4).map(h => `#${h.level} ${h.text}`).join(' | ');
      const richNote = doc.isMarkdown
        ? `[MD 분석] ${doc.title} — ${doc.summary}${headingsPreview ? ` (목차: ${headingsPreview})` : ''}`
        : doc.summary;

      const fileNode = {
        id: nodeId,
        kind,
        category,
        parentHubId: parentId,
        ecosystemHubId: hubId,
        label: doc.isMarkdown ? `📝 ${doc.fileName}` : doc.fileName,
        subtitle: doc.title,
        area: hubNode.area,
        layer: 'memory',
        color: hubColor,
        path: doc.filePath,
        note: richNote,
        headings: doc.headings,
        tags: doc.tags,
        changed: doc.changed,
        size: doc.sizeKb * 1024,
        wikiLinks: doc.wikiLinks,
        val: doc.isMarkdown ? 7.5 : 5.5
      };

      nodes.push(fileNode);
      nodeById.set(nodeId, fileNode);
      nodeByName.set(baseNameNoExt.toLowerCase(), nodeId);
      nodeByName.set(doc.fileName.toLowerCase(), nodeId);

      links.push({ s: parentId, t: nodeId, type: 'parent-child', color: hubColor });

      if (doc.isMarkdown) {
        allMdIndexEntries.push({
          slotId: slot.slotId,
          slotLabel: slot.label,
          fileName: doc.fileName,
          filePath: doc.filePath,
          title: doc.title,
          headings: (doc.headings || []).map(h => h.text),
          tags: doc.tags || [],
          wikiLinks: doc.wikiLinks || [],
          summary: doc.summary,
          sizeKb: doc.sizeKb
        });
      }
    });
  });

  // 3. .md 위키링크([[문서명]] / [링크](파일.md)) 및 코드 참조 시냅스 연결
  for (const n of nodes) {
    if (Array.isArray(n.wikiLinks)) {
      for (const wl of n.wikiLinks) {
        const targetId = nodeByName.get(wl.toLowerCase());
        if (targetId && targetId !== n.id) {
          links.push({ s: n.id, t: targetId, type: 'wikilink', color: n.color });
        }
      }
      delete n.wikiLinks;
    }
  }

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

  // 분석된 .md 지식 인덱스 파일 저장 (자비스 대화 및 RAG에서 즉시 활용)
  try {
    fs.writeFileSync(MD_KNOWLEDGE_INDEX_FILE, JSON.stringify({
      updatedAt: new Date().toISOString(),
      totalAnalyzedMarkdownFiles: allMdIndexEntries.length,
      fullDiskInventory: globalDiskInventory,
      entries: allMdIndexEntries
    }, null, 2), 'utf8');
  } catch (_) {}

  // 슬롯 분석 요약 상태도 저장
  try {
    fs.writeFileSync(ECOSYSTEMS_FILE, JSON.stringify(ecoState, null, 2), 'utf8');
  } catch (_) {}

  const payload = {
    generatedAt: new Date().toISOString(),
    commercialMode: true,
    slots: ecoState.slots,
    connectedFolders: connectedSlots,
    stats: {
      connectedEcosystemsCount: connectedSlots.length,
      totalAnalyzedMarkdownFiles: allMdIndexEntries.length,
      totalNodes: nodes.length,
      totalLinks: links.length,
      fullDiskInventory: globalDiskInventory,
      areaBreakdown: areaStats
    },
    nodes,
    links
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8');
  } catch (e) {
    payload.writeWarning = 'brain.json 저장이 잠시 잠겨 있어 이번 결과는 메모리로만 반환했습니다.';
  }
  return payload;
}

if (require.main === module) {
  buildBrainGraph();
}

module.exports = {
  DEFAULT_COMMERCIAL_SLOTS,
  loadConnectedEcosystems,
  scanFullFolderCensus,
  searchAllRemainingFilesOnDisk,
  analyzeMarkdownFile,
  analyzeFolderEcosystem,
  connectKnowledgeFolder,
  disconnectKnowledgeFolder,
  clearAllKnowledgeFolders,
  buildBrainGraph
};
