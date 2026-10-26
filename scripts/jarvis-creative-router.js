// 말에서 이미지·영상·3D·문서 작업을 고르고, ComfyUI와 앱 실행은 승인 가능한 작업으로만 남긴다.
const fs = require('fs');
const path = require('path');
const { scanComfyModels } = require('./comfy-model-catalog');

const PUBLIC_DATA = path.join(__dirname, '..', 'public', 'data');
const CATALOG_FILE = path.join(PUBLIC_DATA, 'comfyui-open-models.json');
const JOB_FILE = path.join(PUBLIC_DATA, 'creative-jobs.jsonl');
const COMFY_API = 'http://127.0.0.1:8188';

function loadCatalog() {
  try {
    if (fs.existsSync(CATALOG_FILE)) return JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
  } catch (e) {}
  return scanComfyModels();
}

function saveCatalog(catalog) {
  fs.mkdirSync(PUBLIC_DATA, { recursive: true });
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2), 'utf8');
  return catalog;
}

function refreshCatalog() {
  return saveCatalog(scanComfyModels());
}

async function probeComfy() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    const res = await fetch(`${COMFY_API}/system_stats`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, system: data.system || null };
  } catch (e) {
    clearTimeout(timer);
    return { online: false };
  }
}

function appendJob(job) {
  fs.mkdirSync(PUBLIC_DATA, { recursive: true });
  fs.appendFileSync(JOB_FILE, `${JSON.stringify(job)}\n`, 'utf8');
  return job;
}

function catalogReport(catalog, comfy) {
  const lines = [
    '# ComfyUI 오픈 모델 준비 상태',
    '',
    `- API: ${comfy.online ? '8188 응답 중' : '꺼져 있음'}`,
    `- 글만으로 그리는 SD/FLUX 체크포인트: ${catalog.hasTextToImageCheckpoint ? '있음' : '없음'}`,
    `- Qwen Image Edit 2509 묶음: ${catalog.imageEditReady ? 'UNet, VAE, 텍스트 인코더가 있음' : '불완전'}`,
    `- MiniMax Hailuo H3 영상 묶음: ${catalog.videoReady ? '디퓨전, 영상 VAE, 텍스트 인코더가 있음' : '불완전'}`,
    '',
    '## 파일'
  ];
  for (const model of catalog.models || []) {
    lines.push(`- ${model.family} / ${model.task}: \`${model.file}\``);
    if (model.note) lines.push(`  - ${model.note}`);
  }
  lines.push('', '이미지 편집은 원본 이미지가 필요하다. 새 영상은 Hailuo H3로만 준비되어 있다. 앱을 켜는 일은 승인 뒤에 한다.');
  return lines.join('\n');
}

function routeCreativeRequest(message) {
  const q = String(message || '');
  const wantsImage = /이미지|그림|포토|일러스트|comfy|컴피/i.test(q) && /만들|생성|그려|편집|고쳐/.test(q);
  const wantsVideo = /영상|비디오|동영상|hailuo|하이뤄|미니맥스/i.test(q) && /만들|생성|찍어/.test(q);
  const wantsStatus = /컴피|comfy|모델/i.test(q) && /상태|뭐가|어떤|목록|모델/.test(q);
  const wantsBlender = /블렌더|blender|3d|3D/.test(q) && /만들|생성|열어|켜/.test(q);
  const wantsPhotoshop = /포토샵|photoshop/i.test(q) && /만들|편집|열어|켜|고쳐/.test(q);
  if (!wantsImage && !wantsVideo && !wantsStatus && !wantsBlender && !wantsPhotoshop) return null;

  const catalog = fs.existsSync(CATALOG_FILE) ? loadCatalog() : refreshCatalog();
  let kind = 'status';
  if (wantsVideo) kind = 'video';
  else if (wantsImage) kind = 'image-edit';
  else if (wantsBlender) kind = 'blender';
  else if (wantsPhotoshop) kind = 'photoshop';
  else if (!wantsStatus) return null;

  const job = appendJob({
    id: `job-${Date.now()}`,
    at: new Date().toISOString(),
    kind,
    prompt: q,
    comfyPrepared: kind === 'video' ? catalog.videoReady : catalog.imageEditReady,
    approval: '앱 실행과 에셋 생성은 대표님 승인 뒤에만 진행'
  });

  return { kind, catalog, job };
}

module.exports = {
  loadCatalog,
  refreshCatalog,
  probeComfy,
  catalogReport,
  routeCreativeRequest
};
