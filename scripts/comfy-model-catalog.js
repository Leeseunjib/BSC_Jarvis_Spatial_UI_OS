// 이 PC에 설치된 ComfyUI 오픈 모델 폴더를 읽고, 이미지 편집과 영상 제작용으로 나눈다.
const fs = require('fs');
const path = require('path');

const MODEL_ROOTS = [
  'C:\\Users\\USER\\ComfyUI-Shared\\models',
  'H:\\comfyUI\\models'
];

const WEIGHT_EXT = new Set(['.safetensors', '.ckpt', '.gguf', '.pt', '.pth', '.bin']);

const ROLE_BY_FOLDER = {
  diffusion_models: 'video-or-image-diffusion',
  unet: 'image-diffusion',
  checkpoints: 'image-checkpoint',
  loras: 'lora',
  text_encoders: 'text-encoder',
  vae: 'vae',
  clip: 'text-encoder',
  animatediff_models: 'video-motion'
};

function classifyFile(folder, fileName) {
  const lower = fileName.toLowerCase();
  let family = 'unknown';
  let task = ROLE_BY_FOLDER[folder] || folder;
  let note = '';

  if (lower.includes('qwen_image_edit') || lower.includes('qwen-image-edit')) {
    family = 'Qwen-Image-Edit-2509';
    task = lower.includes('lightning') ? 'image-edit-lora' : 'image-edit-unet';
    note = '글만으로 새 그림을 그리는 체크포인트가 아니다. 원본 이미지가 있어야 고친다. Lightning LoRA는 4스텝용이다.';
  } else if (lower.includes('qwen_2.5_vl') || lower.includes('qwen_image_vae')) {
    family = 'Qwen-Image-Edit-2509';
    task = lower.includes('vae') ? 'image-vae' : 'image-text-encoder';
    note = 'Qwen Image Edit 묶음의 텍스트 인코더 또는 VAE다. 편집 UNet과 같이 쓴다.';
  } else if (lower.includes('minimax_h3') || lower.includes('minimax-h3')) {
    family = 'MiniMax-Hailuo-H3';
    if (lower.includes('turbo') || folder === 'loras') {
      task = 'video-turbo-lora';
      note = 'Hailuo H3 영상 디퓨전을 8스텝으로 줄이는 LoRA다.';
    } else if (lower.includes('audio_vae')) {
      task = 'video-audio-vae';
      note = '영상과 함께 쓰는 오디오 VAE다.';
    } else if (lower.includes('video_vae') || folder === 'vae') {
      task = 'video-vae';
      note = 'Hailuo H3 영상 VAE다.';
    } else if (folder === 'text_encoders' || lower.includes('qwen3vl')) {
      task = 'video-text-encoder';
      note = 'Hailuo H3용 Qwen3-VL 텍스트 인코더다. 32B NVFP4라 메모리를 많이 쓴다.';
    } else {
      task = 'video-diffusion';
      note = 'MiniMax Hailuo H3 영상 디퓨전 가중치다. 텍스트만으로 영상을 만드는 쪽에 쓴다. 일반 SD 체크포인트가 아니다.';
    }
  }

  return { family, task, note };
}

function scanComfyModels() {
  const models = [];
  const missingRoots = [];
  for (const root of MODEL_ROOTS) {
    if (!fs.existsSync(root)) {
      missingRoots.push(root);
      continue;
    }
    const folders = fs.readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory());
    for (const folder of folders) {
      const dir = path.join(root, folder.name);
      let files = [];
      try {
        files = fs.readdirSync(dir, { withFileTypes: true }).filter(entry => entry.isFile());
      } catch (e) {
        continue;
      }
      for (const file of files) {
        const ext = path.extname(file.name).toLowerCase();
        if (!WEIGHT_EXT.has(ext)) continue;
        const full = path.join(dir, file.name);
        const stat = fs.statSync(full);
        const role = classifyFile(folder.name, file.name);
        models.push({
          root,
          folder: folder.name,
          file: file.name,
          bytes: stat.size,
          family: role.family,
          task: role.task,
          note: role.note
        });
      }
    }
  }

  const families = {};
  for (const model of models) {
    if (!families[model.family]) families[model.family] = [];
    families[model.family].push(model.task);
  }

  return {
    scannedAt: new Date().toISOString(),
    comfyDesktop: 'C:\\Users\\USER\\AppData\\Local\\Programs\\ComfyUI\\Comfy Desktop\\Comfy Desktop.exe',
    api: 'http://127.0.0.1:8188',
    roots: MODEL_ROOTS,
    missingRoots,
    hasTextToImageCheckpoint: models.some(model => model.task === 'image-checkpoint'),
    imageEditReady: models.some(model => model.task === 'image-edit-unet')
      && models.some(model => model.task === 'image-vae')
      && models.some(model => model.task === 'image-text-encoder'),
    videoReady: models.some(model => model.task === 'video-diffusion')
      && models.some(model => model.task === 'video-vae')
      && models.some(model => model.task === 'video-text-encoder'),
    families,
    models
  };
}

module.exports = { scanComfyModels, MODEL_ROOTS };
