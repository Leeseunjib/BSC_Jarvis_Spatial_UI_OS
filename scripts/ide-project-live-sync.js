/**
 * 🔗🧠 BSC J.A.R.V.I.S. OS — Antigravity IDE Live Chat & All-Projects Real-Time Sync Engine
 * Path: c:\BSC_Javis_OS\scripts\ide-project-live-sync.js
 *
 * Connects:
 *  1. Antigravity IDE Live Conversation Transcripts:
 *     `C:\Users\USER\.gemini\antigravity\brain\<conversation-id>\.system_generated\logs\transcript.jsonl`
 *     + Conversation Artifacts (`implementation_plan.md`, `walkthrough.md`, `task.md`)
 *  2. All BeausCreators Projects & Workspaces:
 *     - `C:\BeausCreators\01.BSC_HQ` (01.보고서, 02.작업일지, 2.Agents, 6.Knowledge_Index)
 *     - `C:\BeausCreators\02.BSC_Branch` (00.소풍, Applications, Games, projects, UXUI_Web_OS, Jarvis_Engine)
 *     - `C:\BeausCreators\03.Research` (Jarvis_Reference, Laya_Unity_Integration, notes)
 *     - `C:\BeausCreators\04.Publisher` (PublishingOS, Imprints, vault)
 *     - `C:\BeausCreators\05.BSC_Skill_Warehouse`
 *     - `c:\BSC_Javis_OS`
 */

const fs = require('fs');
const path = require('path');

const ANTIGRAVITY_BRAIN_ROOT = 'C:\\Users\\USER\\.gemini\\antigravity\\brain';
const BEAUS_ROOT = 'C:\\BeausCreators';
const HQ_REPORTS_DIR = 'C:\\BeausCreators\\01.BSC_HQ\\1.Documents\\01.보고서';
const HQ_WORKLOGS_DIR = 'C:\\BeausCreators\\01.BSC_HQ\\1.Documents\\02.작업일지';

let liveSyncCache = { at: 0, data: null };

/**
 * Extracts clean <USER_REQUEST> text or plain user text from a transcript step content
 */
function extractCleanUserRequest(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') return '';
  const match = rawContent.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/i);
  const text = match ? match[1] : rawContent;
  if (text.includes('<SYSTEM_MESSAGE>') || text.includes('<CONTEXT_SUMMARY>')) return '';
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Reads recent Antigravity IDE conversations & user messages from transcript.jsonl
 */
function readLiveAntigravityIdeChats(maxConversations = 5, maxTurnsPerConv = 12) {
  if (!fs.existsSync(ANTIGRAVITY_BRAIN_ROOT)) return [];

  let convDirs = [];
  try {
    convDirs = fs.readdirSync(ANTIGRAVITY_BRAIN_ROOT, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
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
        return { id: d.name, fullPath, transcriptPath, mtime };
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

    try {
      const files = fs.readdirSync(conv.fullPath);
      artifacts = files.filter(f => f.endsWith('.md'));
    } catch (e) {}

    if (fs.existsSync(conv.transcriptPath)) {
      try {
        const raw = fs.readFileSync(conv.transcriptPath, 'utf8');
        const lines = raw.split(/\r?\n/).filter(Boolean);
        // Parse from recent lines
        for (const line of lines.slice(-120)) {
          try {
            const step = JSON.parse(line);
            if (step.type === 'USER_INPUT' && step.content) {
              const cleanReq = extractCleanUserRequest(step.content);
              if (cleanReq && cleanReq.length > 1) {
                userRequests.push({
                  createdAt: step.created_at || '',
                  text: cleanReq.slice(0, 260)
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
                  createdAt: step.created_at || '',
                  text: cleanAns.slice(0, 240)
                });
              }
            }
          } catch (e) {}
        }
      } catch (e) {}
    }

    conversations.push({
      conversationId: conv.id,
      updatedAt: new Date(conv.mtime).toISOString(),
      artifacts,
      recentUserRequests: userRequests.slice(-maxTurnsPerConv),
      recentAssistantReplies: assistantReplies.slice(-4)
    });
  }

  return conversations;
}

/**
 * Scans all real project directories across C:\BeausCreators & c:\BSC_Javis_OS
 */
function scanAllBscProjects() {
  const projectRoots = [
    { division: '01.BSC_HQ (중앙 본사)', dir: path.join(BEAUS_ROOT, '01.BSC_HQ') },
    { division: '02.BSC_Branch (지점·실무 프로젝트)', dir: path.join(BEAUS_ROOT, '02.BSC_Branch') },
    { division: '03.Research (R&D·논문·엔진 연구)', dir: path.join(BEAUS_ROOT, '03.Research') },
    { division: '04.Publisher (출판사 OS·아름다운 세상)', dir: path.join(BEAUS_ROOT, '04.Publisher') },
    { division: '05.BSC_Skill_Warehouse (전사 스킬 창고)', dir: path.join(BEAUS_ROOT, '05.BSC_Skill_Warehouse') },
    { division: '06.BSC_DataCenter (데이터센터·드라이브)', dir: path.join(BEAUS_ROOT, '06.BSC_DataCenter') }
  ];

  const projects = [
    {
      name: 'BSC_Javis_OS (자비스 지식 은하 & SD 타이쿤 오피스)',
      division: 'Core OS (c:\\BSC_Javis_OS)',
      path: 'c:\\BSC_Javis_OS',
      updatedAt: new Date().toISOString()
    }
  ];

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

        // Also check 1 level deeper for 02.BSC_Branch\projects, Games, Applications
        if (['projects', 'Games', 'Applications'].includes(entry.name)) {
          try {
            const subProjects = fs.readdirSync(subPath, { withFileTypes: true })
              .filter(s => s.isDirectory() && !s.name.startsWith('.'));
            for (const sp of subProjects) {
              const spPath = path.join(subPath, sp.name);
              projects.push({
                name: `${entry.name}/${sp.name}`,
                division: root.division,
                path: spPath,
                updatedAt: new Date(fs.statSync(spPath).mtimeMs).toISOString()
              });
            }
          } catch (e) {}
        }

        projects.push({
          name: entry.name,
          division: root.division,
          path: subPath,
          updatedAt: new Date(mtime).toISOString()
        });
      }
    } catch (e) {}
  }

  // Read latest WorkLogs from 01.BSC_HQ\1.Documents\02.작업일지
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
          updatedAt: new Date(f.mtime).toISOString(),
          tailSnippet
        });
      }
    } catch (e) {}
  }

  return { projects, recentWorklogs };
}

/**
 * Returns unified snapshot of Live Antigravity IDE Chats + All BeausCreators Projects & Worklogs
 */
function getLiveIdeAndProjectsSnapshot(forceRefresh = false) {
  if (!forceRefresh && liveSyncCache.data && Date.now() - liveSyncCache.at < 4000) {
    return liveSyncCache.data;
  }

  const ideConversations = readLiveAntigravityIdeChats(5, 10);
  const { projects, recentWorklogs } = scanAllBscProjects();

  const activeConv = ideConversations[0] || null;
  const latestUserChats = activeConv ? activeConv.recentUserRequests.slice(-6) : [];

  const snapshot = {
    ok: true,
    syncedAt: new Date().toISOString(),
    activeConversationId: activeConv ? activeConv.conversationId : null,
    totalConversationsScanned: ideConversations.length,
    totalProjectsCount: projects.length,
    latestUserChats,
    ideConversations,
    projects: projects.slice(0, 45),
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
  const recentChatsText = (snap.latestUserChats || [])
    .slice(-5)
    .map((c, idx) => `  ${idx + 1}. "${c.text}"`)
    .join('\n');

  const branchProjects = (snap.projects || [])
    .filter(p => p.division.includes('02.BSC_Branch') || p.division.includes('03.Research') || p.division.includes('04.Publisher') || p.division.includes('Core OS'))
    .map(p => p.name)
    .slice(0, 18)
    .join(', ');

  const worklogNames = (snap.recentWorklogs || [])
    .slice(0, 5)
    .map(w => w.file)
    .join(', ');

  return [
    '[실시간 Antigravity IDE 채팅 & 전사 프로젝트 동기화 컨텍스트 (Live Sync)]',
    `- 현재 활성 IDE 대화방 ID: ${snap.activeConversationId || '연결됨'}`,
    `- 대표님이 방금 IDE 채팅창에서 말씀하신 최근 대화 내역:`,
    recentChatsText || '  (최근 채팅 내역 동기화 완료)',
    `- 현재 C:\\BeausCreators 및 c:\\BSC_Javis_OS 전체 활성 프로젝트(${snap.totalProjectsCount}개): ${branchProjects}`,
    `- 최신 본사 작업일지(02.작업일지): ${worklogNames}`
  ].join('\n');
}

module.exports = {
  getLiveIdeAndProjectsSnapshot,
  buildLiveIdeAndProjectPromptContext
};
