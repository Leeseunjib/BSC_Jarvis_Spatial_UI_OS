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

        if (['projects', 'Games', 'Applications'].includes(entry.name)) {
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

  return [
    '[최상위 기준: 안티그래비티 2.0 (Antigravity 2.0) & IDE 실시간 대화·워크스페이스 동기화 팩트]',
    `- 현재 열려 있는 안티그래비티 2.0 / IDE 대화 세션(${snap.totalConversationsScanned}개) 및 최근 대표님 지시사항:`,
    convSummary || '  (실시간 연동 완료)',
    `- 현재 연동된 IDE 및 C:\\BeausCreators 전체 프로젝트(${snap.totalProjectsCount}개): ${branchProjects}`
  ].join('\n');
}

module.exports = {
  getLiveIdeAndProjectsSnapshot,
  buildLiveIdeAndProjectPromptContext
};
