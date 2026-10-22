#!/usr/bin/env node
/**
 * ⚡ BSC J.A.R.V.I.S. OS — Official CLI (`jarvis-cli.js`)
 * Usage:
 *   node bin/jarvis-cli.js status
 *   node bin/jarvis-cli.js models
 *   node bin/jarvis-cli.js select <ollama|lmstudio|auto> [modelId]
 *   node bin/jarvis-cli.js plan "<작업 지시>"
 *   node bin/jarvis-cli.js approve [planId]
 *   node bin/jarvis-cli.js verify
 */

const {
  scanLocalAiEngines,
  selectActiveBrainModel,
  createAutonomous5StepPlan,
  executeApprovedPlan
} = require('../scripts/jarvis-autonomous-router');
const { runFullSystemAuditAndVerification } = require('../scripts/jarvis-system-verifier');

async function main() {
  const args = process.argv.slice(2);
  const sub = (args[0] || 'status').toLowerCase();

  if (sub === 'status' || sub === '--help' || sub === 'help') {
    const engines = await scanLocalAiEngines();
    console.log('====================================================================');
    console.log('🛡️  BSC J.A.R.V.I.S. OS — CLI & Autonomous Brain Controller v2.0');
    console.log('====================================================================');
    console.log(`• 현재 두뇌 모드 : ${engines.brainState.selectionMode}`);
    console.log(`• 활성 인공지능  : [${engines.brainState.activeProvider.toUpperCase()}] ${engines.brainState.activeModel}`);
    console.log(`• Ollama 상태    : ${engines.ollama.online ? '🟢 ONLINE' : '⚪ OFFLINE'} (${engines.ollama.installedModels.length}개 모델 설치됨)`);
    console.log(`• LM Studio 상태 : ${engines.lmstudio.online ? '🟢 SERVER ON (:1234)' : '⚪ SERVER STANDBY'} (디스크 GGUF: ${engines.lmstudio.diskGgufModels.length}개)`);
    console.log(`• RunNow 모바일  : 🟢 15대 온디바이스 WebGPU 모델 레지스트리 준비 완료`);
    console.log('--------------------------------------------------------------------');
    console.log('사용 가능한 CLI 명령어:');
    console.log('  jarvis status                        현재 두뇌·엔진 상태 조회');
    console.log('  jarvis models                        Ollama / LM Studio / RunNow 15종 / 8대 도메인 모델 전체 목록');
    console.log('  jarvis select ollama gemma4:e4b      설치된 모델을 자비스 주력 지능으로 즉시 장착 (VRAM 자동 스왑)');
    console.log('  jarvis select auto                   자비스 스스로 최적 모델 선택 모드 활성화');
    console.log('  jarvis plan "<요청 내용>"            5단계 자율 판단 ➔ 모델 선택 ➔ 계획서(Plan) 수립');
    console.log('  jarvis approve [PLAN_ID]             계획서 승인 및 6종 문서/코드/에셋 즉시 제작');
    console.log('  jarvis verify                        전 시스템 100점 무결성 및 CHLGD 하네스 검증');
    console.log('====================================================================');
    return;
  }

  if (sub === 'models') {
    const engines = await scanLocalAiEngines();
    console.log('\n[1] 🟢 내 PC에 설치된 Ollama 모델 (localhost:11434)');
    if (engines.ollama.installedModels.length === 0) {
      console.log('  - 설치된 모델 없음 (ollama pull <model>로 설치 가능)');
    } else {
      for (const m of engines.ollama.installedModels) {
        console.log(`  ${m.isActiveBrain ? '👉 [현재 장착됨]' : '  '} ${m.id} (${m.sizeGb} GB · ${m.parameterSize || 'Local'})`);
      }
    }

    console.log('\n[2] 🟣 LM Studio 로드/디스크 모델 (localhost:1234)');
    for (const m of engines.lmstudio.loadedModels) {
      console.log(`  ${m.isActiveBrain ? '👉 [현재 장착됨]' : '  '} [Loaded] ${m.id}`);
    }
    for (const d of engines.lmstudio.diskGgufModels) {
      console.log(`     [Disk GGUF] ${d.fileName} (${d.sizeGb} GB)`);
    }

    console.log('\n[3] ⭐ LM Studio / Ollama 추천 오픈모델 TOP 6');
    for (const r of engines.recommendedCatalog) {
      console.log(`  • ${r.name} [${r.id}] — ${r.rank} (${r.quantization}) ${r.isInstalled ? '✅설치됨' : '⬇️미설치'}`);
    }

    console.log(`\n[4] 📱 RunNow 온디바이스 15대 오픈모델 (WebGPU): 총 ${engines.runnowOnDeviceModels.length}종 등록됨`);
    return;
  }

  if (sub === 'select') {
    const targetProvider = (args[1] || 'auto').toLowerCase();
    if (targetProvider === 'auto') {
      const res = await selectActiveBrainModel({ provider: 'ollama', modelId: 'gemma4:e4b', selectionMode: 'AUTO' });
      console.log(`✅ [AUTO 모드 활성화] ${res.message}`);
      return;
    }
    const modelId = args[2] || 'gemma4:e4b';
    const res = await selectActiveBrainModel({ provider: targetProvider, modelId, selectionMode: 'MANUAL' });
    console.log(`✅ ${res.message}`);
    return;
  }

  if (sub === 'plan' || sub === 'route') {
    const prompt = args.slice(1).join(' ').trim() || '소풍 피싱 홈페이지 하이엔드 웹 디자인 및 6종 기획 문서 제작';
    const plan = await createAutonomous5StepPlan(prompt, 'CLI');
    console.log('====================================================================');
    console.log(`📋 [자비스 5단계 자율 계획 보고서] ID: ${plan.planId}`);
    console.log('====================================================================');
    console.log(`1. 상황 판단 (도메인) : ${plan.step1_judgment.domainName}`);
    console.log(`2. 자율 선택 모델     : [${plan.step2_modelSelection.activeProvider.toUpperCase()}] ${plan.step2_modelSelection.selectedBrainModel}`);
    console.log(`   도메인 오픈모델    : ${plan.step2_modelSelection.domainOpenModels.join(', ')}`);
    console.log(`   연동 본사 스킬     : ${plan.step2_modelSelection.linkedBscSkills.join(', ')}`);
    console.log(`   선정 사유          : ${plan.step2_modelSelection.selectionReason}`);
    console.log(`3. 프로젝트 적용 계획 :`);
    plan.step3_projectPlan.steps.forEach(s => console.log(`   - ${s}`));
    console.log(`4. 승인 방법          : "jarvis approve ${plan.planId}" 실행 또는 UI에서 [✅ 승인] 클릭`);
    console.log('====================================================================');
    return;
  }

  if (sub === 'approve') {
    const planId = args[1] || '';
    const res = await executeApprovedPlan(planId);
    if (!res.ok) {
      console.error(`❌ 오류: ${res.error}`);
      process.exit(1);
    }
    console.log(`✅ [제작 완료] 계획(${res.plan.planId}) 승인이 처리되어 6종 문서 및 결과물이 생성되었습니다!`);
    console.log(`📂 저장 경로: ${res.plan.exportDir}`);
    return;
  }

  if (sub === 'verify') {
    const rep = await runFullSystemAuditAndVerification();
    console.log(`🛡️ [시스템 검증 완료] 총점: ${rep.score}/${rep.maxScore} (${rep.ok ? 'PASS' : 'FAIL'})`);
    return;
  }

  console.log(`알 수 없는 명령어입니다: ${sub}. "jarvis help"를 입력해 보세요.`);
}

main().catch(err => {
  console.error('CLI Error:', err.message);
  process.exit(1);
});
