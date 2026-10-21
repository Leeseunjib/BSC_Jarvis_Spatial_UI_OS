

---
## [2026-10-21 Phase 4 Final Goal] Google AI Studio × BSC_Javis_OS 100% 완전체 병합 · 11대 통합 설정 페이지 · 오픈소스 TTS(Chatterbox/Qwen3) · 영화 속 자비스 간결 화법 완성
1. **Google AI Studio (`C:\Users\USER\antigravity\Jarvis-Open-AI-Assistant`) 22개 전체 컴포넌트 & 18대 스튜디오 100% 통합**:
   - 상단 통합 워크스페이스 바(`#unified-workspace-bar`) 및 부팅 시 `AI_STUDIO_HUB` 자동 소환으로 두 시스템이 한 화면에서 즉시 작동하도록 완성.
   - `MAPS_REA_STUDIO`에 `WIKI`(`JarvisKnowledgeWikiStudio.tsx`) 및 `OS_LAB`(`OpenSourceLabView.tsx` + `jarvis_local_bridge.py` 생성기) 탭 추가, `CREATIVE_BLENDER`에 `Barehands 3D`(`ThreejsBarehandsStage.tsx`) 연동, `RL_BENCHMARK`에 `TelemetryAndDataPanel.tsx` 연동.
2. **11대 마스터 설정 페이지 (`#jarvis-master-settings-modal`) & 실행 승인 큐 서랍 (`#os-action-queue-drawer`)**:
   - 언어(한/영), 화법 스타일(영화 속 자비스 간결 모드 등), 4대 디자인 테마(Cyber HUD Dark / Emerald Light / Aurora / Slate), 5대 상황별 프리셋, STT 3종 / LLM 9종 / 오픈소스 TTS 6종 / 7대 성우 선택, 발화 속도·음정·감정 억양(Exaggeration)·CFG 밀착도 슬라이더, 안전 승인 게이트, 로컬 폴더 바인딩, 외부 IDE 레지스트리, API 키 금고, 음성 매크로 관리까지 전 항목 영구 저장(`public/data/jarvis-settings.json`).
3. **오픈소스 TTS 벤치마크 1위 엔진 통합 (`https://www.youtube.com/watch?v=pnQUKnmPkFg&t=484s`)**:
   - 15종 오픈소스 TTS 벤치마크 1위인 **Chatterbox Multilingual (`resemble-ai/chatterbox`, MIT 라이선스, 음색 유사도 0.75 vs ElevenLabs 0.67, 23개국어 원어민 억양 9/10)** 로컬 데몬(`scripts/local-open-tts-server.py`) 및 `Qwen3-TTS`, `CosyVoice 3`, `VoxCPM2`와 무지연 24kHz `Edge Neural HD` 7대 성우 하이브리드 연동.
4. **영화 속 자비스(Movie J.A.R.V.I.S.) 초간결 집사 화법 적용**:
   - 군더더기 인사와 질문 복창을 제거하고 1~2문장 이내로 핵심 결론과 조치 결과만 정중하고 간결하게 보고하는 영화 속 자비스 화법으로 전면 개편.

---
## [2026-10-21 Phase 5] 답변 정직성 수리

완성 보고서는 18개 항목 통과로 적혀 있으나, 실제 대화 경로는 실패를 성공처럼 말했다. 이번 단계의 목표는 그 거짓 완료를 없애고, 이미 정해진 명령은 로컬 두뇌를 기다리지 않게 하는 것이다.

1. 로컬 두뇌가 비면 끝낸 일처럼 답하지 않고, 응답하지 않았다고만 말한다.
2. 설정 열기, 스튜디오 소환, 그래프 전환, PC 승인 요청은 확정 문장으로 즉시 응답한다.
3. 설정에서 고른 모델을 우선하고, 없으면 `gemma4:e4b`, `gemma4:e2b`, `gemma4:31b` 순으로 설치된 모델을 고른다.
4. 검증기 `ok`는 검사 전부가 통과할 때만 참이다. 음성은 점수만 읽고, 고정 성공 대사를 읽지 않는다.
5. 긴 음성은 800자 문장 단위로 합성하고, 두 번째 MP3부터 ID3 헤더를 뗀 뒤 이어 붙인다.
6. 비전 얼굴 교감 스튜디오는 `열어`와 함께 말하면 열린다.

다음 단계로 남긴 것. STT는 아직 고정 문장을 돌려주고, 화면 비전 좌표와 토큰 절감률 88.5%는 실측이 아니다. 쓰지 않는 `queryLocalOllamaGemma`는 여전히 소하 대사를 요구한다. 이 세 가지는 이번 수리에서 동작 경로를 바꾸지 않았다.

---
## [2026-10-21 Phase 6] 턴 성능과 자비스 재귀

Harness^2 엔진과 그 표면 파일은 수정하지 않는다. 대화 한 턴의 재귀는 `scripts/jarvis-recursion.js`가 맡는다.

1. 초안이 통과하면 추가 모델 호출은 없다.
2. 별표와 다섯 문장 이상은 로컬에서 자른다.
3. 기계적 문장, 질문 반복, REA 오독만 8초 안의 짧은 수리 호출을 한다.
4. 대표님 지적은 `vault/jarvis-recursion/lessons.json`에만 남기고, 다음 턴에 겹치는 교훈 두 줄만 넣는다.
5. 모델 목록은 60초, 브릿지 상태는 8초 동안 재사용한다. 대화 기록은 한 번에 저장하고, 본사 일지 복사는 응답 뒤로 미룬다.
6. 벤더 정적 파일은 하루 동안 캐시한다.
