---
name: evidence_first
description: verifying deliverables and preventing hallucinated paths before task completion
---
# Evidence-First Deliverable Verification Skill (c6: on-demand skill)
1. 모든 파일 생성·수정 직후 `scripts/verify_deliverable.js` 또는 `Verify-Code.ps1`로 파일 존재 및 0-Byte 여부를 검증한다.
2. 산출물의 형식(Shape, 컬럼명, 파일 포맷)은 대표님의 원래 요청을 100% 보존하며 임의로 구조를 변형하지 않는다.