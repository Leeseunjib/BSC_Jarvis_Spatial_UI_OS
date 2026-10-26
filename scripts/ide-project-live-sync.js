/**
 * 🔗🧠 BSC J.A.R.V.I.S. OS — Antigravity 2.0 & IDE Live Conversations + All-Projects Master Sync Engine
 * Path: c:\BSC_Javis_OS\scripts\ide-project-live-sync.js
 *
 * Ground-Truth Standard (Per CEO 이건우 대표님 Directive):
 *  - Uses Antigravity 2.0 (`C:\Users\USER\.gemini\antigravity\brain\*` + `presence\*.lock`)
 *    and IDE workspaces (`c:\BSC_Javis_OS`, `C:\BeausCreators\*`) as the primary source of truth.
 *  - Parses every active Antigravity 2.0 conversation's:
 *    1) Live Presence Status (`presence/<id>.lock`)
 *    2) IDE Workspace Path (`Active Workspaces` / `Command Working Directory`)
 *    3) Conversation Title & Artifacts (`implementation_plan.md`, `task.md`, `walkthrough.md`)
 *    4) Full recent `<USER_REQUEST>` and agent responses from `transcript.jsonl`
 */

const fs = require('fs');
const path = require('path');

const ANTIGRAVITY_ROOT = 'C:\\Users\\USER\\.gemini\\antigravity';
const ANTIGRAVITY_BRAIN_ROOT = path.join(ANTIGRAVITY_ROOT, 'brain');
const ANTIGRAVITY_PRESENCE_ROOT = path.join(ANTIGRAVITY_ROOT, 'presence');
const BEAUS_ROOT = 'C:\\BeausCreators';
const HQ_WORKLOGS_DIR = 'C:\\BeausCreators\\01.BSC_HQ\\1.Documents\\02.작업일지';

let liveSyncCache = { at: 0, data: null };

function extractCleanUserRequest(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') return '';
  const match = rawContent.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/i);
  const text = match ? match[1] : rawContent;
  if (text.includes('<SYSTEM_MESSAGE>') || text.includes('<CONTEXT_SUMMARY>')) return '';
  return text.replace(/\s+/g, ' ').trim();
}

function extractWorkspaceFromTranscript(rawTranscript) {
  if (!rawTranscript) return 'C:\\BeausCreators';
  const wsMatch = rawTranscript.match(/Command Working Directory:\s*([A-Za-z]:\\[^\r\n"\\<>]+(?:\\[^\r\n"\\<>]+)*)/i) ||
                  rawTranscript.match(/Active Workspaces:\s*-\s*([A-Za-z]:\\[^\r\n"\\<>]+(?:\\[^\r\n"\\<>]+)*)/i);
  if (wsMatch && wsMatch[1]) return wsMatch[1].trim();
  return 'C:\\BeausCreators';
}

function extractConversationTitle(convDir, userRequests) {
  for (const mdName of ['implementation_plan.md', 'task.md', 'walkthrough.md']) {
    const mdPath = path.join(convDir, mdName);
    if (fs.existsSync(mdPath)) {
      try {
        const raw = fs.readFileSync(mdPath, 'utf8');
        const heading = raw.split(/\r?\n/).find(l => l.trim().startsWith('# '));
        if (heading) {
          return heading.replace(/^#+\s*/, '').trim().slice(0, 70);
        }
      } catch (e) {}
    }
  }
  if (userRequests.length > 0) {
    return userRequests[userRequests.length - 1].text.slice(0, 60);
  }
  return 'Antigravity 2.0 IDE 작업 세션';
}

/**
 * Reads all recent Antigravity 2.0 conversations & IDE workspaces
 */
function readLiveAntigravityIdeChats(maxConversations = 10, maxTurnsPerConv = 15) {
  if (!fs.existsSync(ANTIGRAVITY_BRAIN_ROOT)) return [];

  const presenceLocks = new Set();
  if (fs.existsSync(ANTIGRAVITY_PRESENCE_ROOT)) {
    try {
      for (const f of fs.readdirSync(ANTIGRAVITY_PRESENCE_ROOT)) {
        if (f.endsWith('.lock')) {
          presenceLocks.add(f.replace(/\.lock$/i, ''));
        }
      }
    } catch (e) {}
  }

  let convDirs = [];
  try {
    convDirs = fs.readdirSync(ANTIGRAVITY_BRAIN_ROOT, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'tempmediaStorage')
      .map(d => {
        const fullPath = path.join(ANTIGRAVITY_BRAIN_ROOT, d.name);
        const transcriptPath = path.join(fullPath, '.system_generated', 'logs', 'transcript.jsonl');
        let mtime = 0;
        try {
          if (fs.existsSync(transcriptPath)) {
            mtime = fs.statSync(transcriptPath).mtimeMs;
          } else {
            mtime = fs.statSync(fullPath).mtimeMs;
          }
        } catch (e) {}
        return {
          id: d.name,
          fullPath,
          transcriptPath,
          mtime,
          isActivePresence: presenceLocks.has(d.name)
        };
      })
      .filter(d => d.mtime > 0)
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, maxConversations);
  } catch (e) {
    return [];
  }

  const conversations = [];

  for (const conv of convDirs) {
    const userRequests = [];
    const assistantReplies = [];
    let artifacts = [];
    let workspacePath = 'C:\\BeausCreators';

    try {
      const files = fs.readdirSync(conv.fullPath);
      artifacts = files.filter(f => f.endsWith('.md')).map(f => ({
        name: f,
        path: path.join(conv.fullPath, f)
      }));
    } catch (e) {}

    if (fs.existsSync(conv.transcriptPath)) {
      try {
        const raw = fs.readFileSync(conv.transcriptPath, 'utf8');
        workspacePath = extractWorkspaceFromTranscript(raw);
        const lines = raw.split(/\r?\n/).filter(Boolean);
        for (const line of lines.slice(-160)) {
          try {
            const step = JSON.parse(line);
            if (step.type === 'USER_INPUT' && step.content) {
              const cleanReq = extractCleanUserRequest(step.content);
              if (cleanReq && cleanReq.length > 1) {
                userRequests.push({
                  createdAt: step.created_at || new Date(conv.mtime).toISOString(),
                  text: cleanReq.slice(0, 300),
                  conversationId: conv.id,
                  workspacePath
                });
              }
            } else if (step.type === 'PLANNER_RESPONSE' && step.content && typeof step.content === 'string') {
              const cleanAns = step.content
                .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
                .replace(/#+\s*/g, '')
                .replace(/\*\*/g, '')
                .replace(/\s+/g, ' ')
                .trim();
              if (cleanAns.length > 10) {
                assistantReplies.push({
                  createdAt: step.created_at || new Date(conv.mtime).toISOString(),
                  text: cleanAns.slice(0, 260)
                });
              }
            }
          } catch (e) {}
        }
      } catch (e) {}
    }

    const title = extractConversationTitle(conv.fullPath, userRequests);

    conversations.push({
      conversationId: conv.id,
      title,
      workspacePath,
      isActivePresence: conv.isActivePresence,
      updatedAt: new Date(conv.mtime).toISOString(),
      artifacts,
      recentUserRequests: userRequests.slice(-maxTurnsPerConv),
      recentAssistantReplies: assistantReplies.slice(-5)
    });
  }

  return conversations;
}

/**
 * Scans all IDE workspaces & BeausCreators project folders
 */
function scanAllBscProjects(ideConversations = []) {
  const projectRoots = [
    { division: '01.BSC_HQ (중앙 본사)', dir: path.join(BEAUS_ROOT, '01.BSC_HQ') },
    { division: '02.BSC_Branch (지점·실무 프로젝트)', dir: path.join(BEAUS_ROOT, '02.BSC_Branch') },
    { division: '03.Research (R&D·논문·엔진 연구)', dir: path.join(BEAUS_ROOT, '03.Research') },
    { division: '04.Publisher (출판사 OS·아름다운 세상)', dir: path.join(BEAUS_ROOT, '04.Publisher') },
    { division: '05.BSC_Skill_Warehouse (전사 스킬 창고)', dir: path.join(BEAUS_ROOT, '05.BSC_Skill_Warehouse') },
    { division: '06.BSC_DataCenter (데이터센터·드라이브)', dir: path.join(BEAUS_ROOT, '06.BSC_DataCenter') }
  ];

  const seenPaths = new Set();
  const projects = [];

  const addProject = (name, division, pPath, updatedAt) => {
    const norm = path.resolve(pPath).toLowerCase();
    if (seenPaths.has(norm)) return;
    seenPaths.add(norm);
    projects.push({ name, division, path: pPath, updatedAt });
  };

  addProject('BSC_Javis_OS (자비스 성운 은하 & SD 타이쿤 오피스)', 'Antigravity 2.0 & IDE Core Workspace', 'c:\\BSC_Javis_OS', new Date().toISOString());

  // Add workspaces discovered directly from active Antigravity 2.0 IDE conversations
  for (const conv of ideConversations) {
    if (conv.workspacePath && fs.existsSync(conv.workspacePath)) {
      addProject(
        `${path.basename(conv.workspacePath)} (${conv.title.slice(0, 28)})`,
        'Antigravity 2.0 활성 IDE 워크스페이스',
        conv.workspacePath,
        conv.updatedAt
      );
    }
  }

  for (const root of projectRoots) {
    if (!fs.existsSync(root.dir)) continue;
    try {
      const entries = fs.readdirSync(root.dir, { withFileTypes: true })
        .filter(e => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules');

      for (const entry of entries) {
        const subPath = path.join(root.dir, entry.name);
        let mtime = Date.now();
        try {
          mtime = fs.statSync(subPath).mtimeMs;
        } catch (e) {}

        if (['projects', 'sandbox', 'Games', 'Applications', 'Classes'].includes(entry.name)) {
          try {
            const subProjects = fs.readdirSync(subPath, { withFileTypes: true })
              .filter(s => s.isDirectory() && !s.name.startsWith('.'));
            for (const sp of subProjects) {
              const spPath = path.join(subPath, sp.name);
              addProject(`${entry.name}/${sp.name}`, root.division, spPath, new Date(fs.statSync(spPath).mtimeMs).toISOString());
            }
          } catch (e) {}
        }

        addProject(entry.name, root.division, subPath, new Date(mtime).toISOString());
      }
    } catch (e) {}
  }

  const recentWorklogs = [];
  if (fs.existsSync(HQ_WORKLOGS_DIR)) {
    try {
      const files = fs.readdirSync(HQ_WORKLOGS_DIR)
        .filter(f => f.endsWith('.md'))
        .map(f => {
          const fp = path.join(HQ_WORKLOGS_DIR, f);
          return { name: f, path: fp, mtime: fs.statSync(fp).mtimeMs };
        })
        .sort((a, b) => b.mtime - a.mtime)
        .slice(0, 8);

      for (const f of files) {
        let tailSnippet = '';
        try {
          const content = fs.readFileSync(f.path, 'utf8');
          const cleanLines = content.split(/\r?\n/).filter(l => l.trim() && !l.startsWith('---'));
          tailSnippet = cleanLines.slice(-6).join(' | ').slice(0, 260);
        } catch (e) {}
        recentWorklogs.push({
          file: f.name,
          path: f.path,
          updatedAt: new Date(f.mtime).toISOString(),
          tailSnippet
        });
      }
    } catch (e) {}
  }

  return { projects, recentWorklogs };
}

/**
 * Returns unified snapshot of Live Antigravity 2.0 Chats + All IDE Workspaces & Projects
 */
function getLiveIdeAndProjectsSnapshot(forceRefresh = false) {
  if (!forceRefresh && liveSyncCache.data && Date.now() - liveSyncCache.at < 3500) {
    return liveSyncCache.data;
  }

  const ideConversations = readLiveAntigravityIdeChats(10, 12);
  const { projects, recentWorklogs } = scanAllBscProjects(ideConversations);

  const activeConv = ideConversations[0] || null;
  // Gather latest user chats across top active Antigravity 2.0 windows
  const allRecentUserChats = [];
  for (const conv of ideConversations.slice(0, 4)) {
    for (const u of (conv.recentUserRequests || []).slice(-4)) {
      allRecentUserChats.push({
        ...u,
        convTitle: conv.title,
        conversationId: conv.conversationId
      });
    }
  }
  allRecentUserChats.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));

  const snapshot = {
    ok: true,
    syncedAt: new Date().toISOString(),
    activeConversationId: activeConv ? activeConv.conversationId : null,
    activeWorkspacePath: activeConv ? activeConv.workspacePath : 'c:\\BSC_Javis_OS',
    totalConversationsScanned: ideConversations.length,
    activePresenceCount: ideConversations.filter(c => c.isActivePresence).length,
    totalProjectsCount: projects.length,
    latestUserChats: allRecentUserChats.slice(-10),
    ideConversations,
    projects: projects.slice(0, 60),
    recentWorklogs
  };

  liveSyncCache = { at: Date.now(), data: snapshot };
  return snapshot;
}

/**
 * Formats a concise, high-density context block for J.A.R.V.I.S. LLM prompt injection
 */
function buildLiveIdeAndProjectPromptContext() {
  const snap = getLiveIdeAndProjectsSnapshot();
  const convSummary = (snap.ideConversations || [])
    .slice(0, 5)
    .map((c, i) => {
      const lastChat = c.recentUserRequests && c.recentUserRequests.length
        ? c.recentUserRequests[c.recentUserRequests.length - 1].text
        : '작업 진행 중';
      return `  ${i + 1}. [IDE창 ${c.conversationId.slice(0, 8)} | 워크스페이스: ${c.workspacePath} | 주제: ${c.title}] 최근 대표님 말씀: "${lastChat}"`;
    })
    .join('\n');

  const branchProjects = (snap.projects || [])
    .slice(0, 20)
    .map(p => p.name)
    .join(', ');

  // 연결된 상업용 슬롯(회사_HQ, 회사_Branch, 지식생태계 등), .md 분석 인덱스 및 남은 전체 파일 전수 센서스 실시간 주입
  let connectedMdBlock = '';
  try {
    const ecoFile = path.join(__dirname, '..', 'public', 'data', 'connected-ecosystems.json');
    const mdIdxFile = path.join(__dirname, '..', 'public', 'data', 'analyzed-md-knowledge.json');
    if (fs.existsSync(ecoFile)) {
      const eco = JSON.parse(fs.readFileSync(ecoFile, 'utf8'));
      const activeSlots = (eco.slots || []).filter(s => s.connected && s.path);
      if (activeSlots.length > 0) {
        const slotDesc = activeSlots.map(s => {
          const c = s.analysisSummary?.fullDiskCensus || {};
          return `${s.label}(${s.path}: 디스크 전체 ${(c.totalAllFilesOnDisk || 0).toLocaleString()}개 파일 [.md ${(c.totalMdFilesOnDisk || 0).toLocaleString()}개, 코드 ${(c.totalCodeFilesOnDisk || 0).toLocaleString()}개, 문서 ${(c.totalOfficeDocsOnDisk || 0).toLocaleString()}개, 기타 ${(c.totalOtherAssetsOnDisk || 0).toLocaleString()}개] 전수 파악 완료 / 핵심 뉴런 ${s.analysisSummary?.totalFilesScanned || 0}개 심층 추출)`;
        }).join('\n  • ');
        connectedMdBlock += `\n- 현재 뉴런 홈에 연결된 지식생태계 슬롯(${activeSlots.length}개) 및 전수 파일 센서스(추출된 파일 + 남은 파일 100% 파악):\n  • ${slotDesc}`;
      }
    }
    if (fs.existsSync(mdIdxFile)) {
      const mdIdx = JSON.parse(fs.readFileSync(mdIdxFile, 'utf8'));
      if (Array.isArray(mdIdx.entries) && mdIdx.entries.length > 0) {
        const topMd = mdIdx.entries.slice(0, 8).map(e => `[${e.slotLabel}] ${e.fileName}(${e.title}): ${e.summary.slice(0, 80)}`).join('\n  • ');
        connectedMdBlock += `\n- 연결된 폴더에서 실시간 심층 추출된 핵심 .md 문서(${mdIdx.totalAnalyzedMarkdownFiles}개 중 상위):\n  • ${topMd}`;
      }
    }
  } catch (_) {}

  return [
    '[최상위 기준: 안티그래비티 2.0 (Antigravity 2.0) & IDE 실시간 대화·워크스페이스 동기화 팩트]',
    `- 현재 열려 있는 안티그래비티 2.0 / IDE 대화 세션(${snap.totalConversationsScanned}개) 및 최근 대표님 지시사항:`,
    convSummary || '  (실시간 연동 완료)',
    `- 현재 연동된 IDE 및 C:\\BeausCreators 전체 프로젝트(${snap.totalProjectsCount}개): ${branchProjects}${connectedMdBlock}`
  ].join('\n');
}

/**
 * 🔍 실시간 로컬 디스크 경로 & 프로젝트 정밀 스캐너 (Real-Time Path & Project Inspector)
 * - 대표님께서 "C:\BeausCreators에 Runnow 프로그램이 있어. 확인가능해?" 처럼 특정 경로나 프로그램/프로젝트를 언급하시면
 *   즉시 실제 디스크(fs.readdirSync / fs.statSync / 핵심 파일 내용)를 스캔하여 100% 검증된 팩트를 반환합니다.
 */
function inspectLocalPathAndProject(userMessage = '') {
  const msg = String(userMessage || '').trim();
  if (!msg) return { matched: false, targets: [], promptBlock: '' };

  const snap = getLiveIdeAndProjectsSnapshot();
  const matchedDirs = new Map();

  // 1. 명시적 로컬 경로 추출 (예: C:\BeausCreators\..., C:\BSC_Javis_OS\...)
  const pathRegex = /[A-Za-z]:[\\/][^\s"'?<>|]+/g;
  const rawPaths = msg.match(pathRegex) || [];
  for (const rp of rawPaths) {
    const cleanP = rp.replace(/[.,;!?)]+$/, '').replace(/\//g, '\\');
    if (fs.existsSync(cleanP)) {
      try {
        const st = fs.statSync(cleanP);
        const dirP = st.isDirectory() ? cleanP : path.dirname(cleanP);
        // C:\BeausCreators 루트만 단독으로 언급된 경우 하위 핵심 매칭으로 넘김
        if (dirP.toLowerCase() !== 'c:\\beauscreators') {
          matchedDirs.set(dirP.toLowerCase(), { name: path.basename(dirP), path: dirP, reason: '명시적 경로 지정' });
        }
      } catch (e) {}
    }
  }

  // 2. 전체 프로젝트 목록(01.BSC_HQ ~ 06.BSC_DataCenter, projects/*, sandbox/*, Games/*, Applications/*) 키워드 매칭
  const msgLower = msg.toLowerCase();
  const aliasMap = [
    { regex: /runnow|런나우|런닝|러닝/i, paths: ['C:\\BeausCreators\\02.BSC_Branch\\projects\\Runnow', 'C:\\BeausCreators\\02.BSC_Branch\\sandbox\\Runnow_APP_V'] },
    { regex: /소풍|sopoong|낚시/i, paths: ['C:\\BeausCreators\\02.BSC_Branch\\00.소풍', 'C:\\BeausCreators\\02.BSC_Branch\\sandbox'] },
    { regex: /출판|아름다운\s*세상|publisher|epub/i, paths: ['C:\\BeausCreators\\04.Publisher'] },
    { regex: /스킬\s*창고|warehouse/i, paths: ['C:\\BeausCreators\\05.BSC_Skill_Warehouse'] },
    { regex: /laya|유니티|unity/i, paths: ['C:\\BeausCreators\\03.Research\\Laya_Unity_Integration', 'C:\\BeausCreators\\02.BSC_Branch\\Games'] },
    { regex: /bsc_javis_os|자비스\s*폴더|자비스\s*프로젝트|jarvis_engine/i, paths: ['c:\\BSC_Javis_OS', 'C:\\BeausCreators\\02.BSC_Branch\\Jarvis_Engine'] }
  ];

  for (const al of aliasMap) {
    if (al.regex.test(msg)) {
      for (const p of al.paths) {
        if (fs.existsSync(p)) {
          matchedDirs.set(p.toLowerCase(), { name: path.basename(p), path: p, reason: '프로젝트 별칭 매칭' });
        }
      }
    }
  }

  for (const proj of (snap.projects || [])) {
    const baseName = path.basename(proj.path).toLowerCase();
    if (baseName.length >= 3 && msgLower.includes(baseName) && fs.existsSync(proj.path)) {
      matchedDirs.set(proj.path.toLowerCase(), { name: proj.name, path: proj.path, reason: '워크스페이스 프로젝트 매칭' });
    }
  }

  // 2-B. 사용자가 뉴런 홈에 직접 연결한 슬롯(회사_HQ, 회사_Branch, 지식생태계 등) 폴더 매칭
  try {
    const ecoFile = path.join(__dirname, '..', 'public', 'data', 'connected-ecosystems.json');
    if (fs.existsSync(ecoFile)) {
      const eco = JSON.parse(fs.readFileSync(ecoFile, 'utf8'));
      for (const s of (eco.slots || [])) {
        if (!s.connected || !s.path || !fs.existsSync(s.path)) continue;
        const folderBase = path.basename(s.path).toLowerCase();
        const slotClean = String(s.label || '').replace(/[^\w가-힣]/g, '').toLowerCase();
        if (
          (folderBase.length >= 2 && msgLower.includes(folderBase)) ||
          (slotClean.length >= 2 && msgLower.replace(/\s+/g, '').includes(slotClean)) ||
          (/회사_?hq|본사/i.test(msg) && s.slotId === 'slot_company_hq') ||
          (/회사_?branch|지점/i.test(msg) && s.slotId === 'slot_company_branch') ||
          (/지식\s*생태계|옵시디언|obsidian/i.test(msg) && s.slotId === 'slot_knowledge_ecosystem')
        ) {
          matchedDirs.set(s.path.toLowerCase(), { name: `${s.label} (${path.basename(s.path)})`, path: s.path, reason: '연결된 지식생태계 슬롯 매칭' });
        }
      }
    }
  } catch (_) {}

  // 만약 "C:\BeausCreators"만 언급하고 특정 하위 프로젝트명이 없다면 C:\BeausCreators 루트 구조를 스캔
  if (matchedDirs.size === 0 && /beauscreators|뷰스크리에이터/i.test(msg) && fs.existsSync(BEAUS_ROOT)) {
    matchedDirs.set(BEAUS_ROOT.toLowerCase(), { name: 'BeausCreators (전사 루트)', path: BEAUS_ROOT, reason: '전사 루트 경로 조회' });
  }

  if (matchedDirs.size === 0) {
    return { matched: false, targets: [], promptBlock: '' };
  }

  const targets = [];
  for (const item of Array.from(matchedDirs.values()).slice(0, 3)) {
    try {
      const entries = fs.readdirSync(item.path, { withFileTypes: true });
      const subDirs = entries
        .filter(e => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules')
        .map(e => e.name);
      const files = entries
        .filter(e => e.isFile() && !e.name.startsWith('.'))
        .map(e => {
          let sizeKb = 0;
          try { sizeKb = Math.round(fs.statSync(path.join(item.path, e.name)).size / 1024); } catch (_) {}
          return { name: e.name, sizeKb };
        });

      const codeFiles = files.filter(f => /\.(js|ts|tsx|jsx|py|html|css|cjs|mjs|json)$/i.test(f.name));
      const docFiles = files.filter(f => /\.(md|docx|pptx|pdf|xlsx|xls|txt)$/i.test(f.name));

      // 핵심 설명/스펙 파일에서 실제 내용 요약 추출
      let specPreview = '';
      const priorityDoc = files.find(f => /^(README\.md|06_OnDevice.*|01_Stitch.*|package\.json|plan\.md|context-notes\.md)$/i.test(f.name)) || docFiles[0];
      if (priorityDoc && /\.(md|json|txt)$/i.test(priorityDoc.name)) {
        try {
          const rawTxt = fs.readFileSync(path.join(item.path, priorityDoc.name), 'utf8');
          specPreview = rawTxt
            .replace(/[#*`>-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 280);
        } catch (_) {}
      }

      targets.push({
        name: item.name,
        path: item.path,
        subDirs: subDirs.slice(0, 12),
        totalFilesCount: files.length,
        codeFiles: codeFiles.slice(0, 10).map(f => `${f.name}(${f.sizeKb}KB)`),
        docFiles: docFiles.slice(0, 8).map(f => `${f.name}(${f.sizeKb}KB)`),
        specPreview
      });
    } catch (e) {}
  }

  if (targets.length === 0) {
    return { matched: false, targets: [], promptBlock: '' };
  }

  const promptLines = [
    '[🔍 자비스 실시간 로컬 디스크 경로·프로그램 정밀 스캔 결과 (100% 실제 파일 검증 완료 — 절대 확인 불가라고 답하지 말 것!)]'
  ];
  for (const t of targets) {
    promptLines.push(`- 실제 확인된 경로: ${t.path}`);
    if (t.subDirs.length > 0) promptLines.push(`  • 하위 폴더(${t.subDirs.length}개): ${t.subDirs.join(', ')}`);
    if (t.codeFiles.length > 0) promptLines.push(`  • 핵심 프로그램/코드 파일: ${t.codeFiles.join(', ')}`);
    if (t.docFiles.length > 0) promptLines.push(`  • 핵심 기획·스펙·보고서 문서: ${t.docFiles.join(', ')}`);
    if (t.specPreview) promptLines.push(`  • 문서 핵심 요약: "${t.specPreview}"`);
  }

  return {
    matched: true,
    targets,
    promptBlock: promptLines.join('\n')
  };
}

module.exports = {
  getLiveIdeAndProjectsSnapshot,
  buildLiveIdeAndProjectPromptContext,
  inspectLocalPathAndProject
};
