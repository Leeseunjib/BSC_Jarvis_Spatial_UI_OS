// 자비스 한 턴의 재귀. 초안을 로컬에서 검사하고, 고칠 수 있는 것만 고친다. Harness^2 엔진은 호출하지 않는다.
const fs = require('fs');
const path = require('path');

const LESSONS_FILE = path.join(__dirname, '..', 'vault', 'jarvis-recursion', 'lessons.json');
const MAX_LESSONS = 24;

function splitSentences(text) {
  return String(text || '')
    .split(/(?<=[.?!。]|다\.|요\.|죠\.|까\?|네\.)\s+/)
    .map(sentence => sentence.trim())
    .filter(Boolean);
}

function probeDraft(userMessage, draft) {
  const text = String(draft || '').trim();
  const issues = [];
  if (!text) issues.push('empty');
  if (/\*\*|^\s*#{1,6}\s/m.test(text)) issues.push('markup');
  if (splitSentences(text).length > 4) issues.push('long');
  if (/분석\s*완료했습니다|소환했습니다|523개\s*지식\s*노드|쉽게\s*말씀드리면|결론적으로|양방향\s*동기화\s*중/.test(text)) {
    issues.push('robotic');
  }
  if (/\brea\b|역공학|유니티|unity/i.test(userMessage) && /real-time environment|reversing engineering/i.test(text)) {
    issues.push('rea-misread');
  }
  const question = String(userMessage || '').replace(/\s+/g, '');
  const answer = text.replace(/\s+/g, '');
  if (question.length > 12 && answer.includes(question)) issues.push('echo');
  return { pass: issues.length === 0, issues };
}

function composeLocally(draft, probe) {
  let text = String(draft || '')
    .replace(/\*\*/g, '')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (probe && probe.issues && probe.issues.includes('long')) {
    text = splitSentences(text).slice(0, 4).join(' ');
  }
  return text;
}

function needsModelRepair(probe) {
  if (!probe || probe.pass) return false;
  return probe.issues.some(issue => issue === 'robotic' || issue === 'rea-misread' || issue === 'echo' || issue === 'empty');
}

function buildRepairPrompt(userMessage, draft, issues) {
  const lines = [
    '초안을 2~3문장의 구어체로 고치세요. 별표와 제목 기호는 쓰지 마세요.',
    `고칠 문제: ${(issues || []).join(', ')}`,
    `대표님 말씀: ${userMessage}`,
    `초안: ${draft}`
  ];
  if ((issues || []).includes('rea-misread')) {
    lines.push('REA는 Reverse Engineer Anything이다. Mono는 Managed/Assembly-CSharp.dll, IL2CPP는 GameAssembly.dll과 global-metadata.dat이다.');
  }
  return lines.join('\n');
}

function loadLessons() {
  try {
    if (!fs.existsSync(LESSONS_FILE)) return [];
    const data = JSON.parse(fs.readFileSync(LESSONS_FILE, 'utf8'));
    return Array.isArray(data.lessons) ? data.lessons : [];
  } catch (e) {
    return [];
  }
}

function recordLesson(cue, lesson) {
  const lessons = loadLessons();
  lessons.push({
    id: `les-${Date.now()}`,
    at: new Date().toISOString(),
    cue: String(cue || '').slice(0, 120),
    lesson: String(lesson || '').slice(0, 240)
  });
  const kept = lessons.slice(-MAX_LESSONS);
  fs.mkdirSync(path.dirname(LESSONS_FILE), { recursive: true });
  fs.writeFileSync(LESSONS_FILE, JSON.stringify({ updatedAt: new Date().toISOString(), lessons: kept }, null, 2), 'utf8');
  return kept[kept.length - 1];
}

function selectLessons(userMessage, limit = 2) {
  const hay = String(userMessage || '').toLowerCase();
  const tokens = hay.split(/[^\p{L}\p{N}]+/u).filter(token => token.length >= 2);
  if (tokens.length === 0) return [];
  return loadLessons()
    .map(item => {
      const blob = `${item.cue || ''} ${item.lesson || ''}`.toLowerCase();
      const score = tokens.reduce((sum, token) => sum + (blob.includes(token) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(row => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(row => row.item);
}

module.exports = {
  probeDraft,
  composeLocally,
  needsModelRepair,
  buildRepairPrompt,
  loadLessons,
  recordLesson,
  selectLessons
};
