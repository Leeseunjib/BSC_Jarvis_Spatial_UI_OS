# 🛡️ BSC J.A.R.V.I.S. OS — Project Context Notes (`context-notes.md`)

> **최종 갱신**: 2026-10-20 16:23 (KST)
> **최고 의사결정권자(CEO)**: 이건우 대표님
> **총괄 아키텍트**: CTO 거누 (Geonu) & AI 연구원 우진 (Woojin)

## 1. 프로젝트 목표 및 배경 (Context)
- 해외 유튜버(Zubair Trabzada의 `AI Workshop OS / Zubair OS / H.O.L.O. Hands`, Pav/Automation Orbit의 `MAPS Framework` 등) 및 글로벌 오픈소스 112개 프로젝트를 딥리서치하고 10대 핵심 레포지토리를 `c:\BSC_Javis_OS\research\opensource_sources\`에 로컬 클론 완료.
- 대표님께서 승인하신 [implementation_plan.md](file:///C:/Users/USER/.gemini/antigravity/brain/7c26bd17-dac9-4f38-b441-ab8f0a5bbf8c/implementation_plan.md) 설계서에 따라 `c:\BSC_Javis_OS`에 풀스택 자율 에이전트 운영체제 **『BSC J.A.R.V.I.S. OS』**를 구축한다.

## 2. 대표님 확정 3대 의사결정 (Approved Specifications)
1. **페르소나 & 세계관 (`Together / 함께` & 개혁주의 장로교 청지기 세계관)**:
   - 대표님을 **"이건우 대표님"**으로 호칭하며 정중하고 지혜로운 청지기 파트너 톤(*"이건우 대표님, 오늘도 주신 지혜로 함께 만들어 갑시다"*)을 유지.
   - 창조 질서와 청지기 정신(Stewardship), 진리와 정직(Zero-Hallucination), 코이노니아(`함께 / Together`), 절제(Token Flow 최적화)를 헌장으로 내재화.
2. **중앙 3D 옵시디언 지식 그래프 (`Show, Don't Store`)**:
   - BSC 본사(`C:\BeausCreators\01.BSC_HQ\6.Knowledge_Index`, `0.Guidelines`, `2.Agents`) 및 로컬 볼트(`c:\BSC_Javis_OS\vault`)를 읽기 전용으로 연결하여 6대 뷰(`3D Galaxy`, `2D Force`, `Concentric Rings`, `Areas`, `Timeline`, `Brain Shape`)로 실시간 시각화.
3. **자율 스폰 HUD 창 (`Autonomous Window Spawner`) & 5대 멀티모달**:
   - 대화 문맥에 따라 자비스가 스스로 **① 📘 설명서(Manual) 창, ② 📊 심층 보고서(Report) 창, ③ 💻 실시간 제작/에이전트 콘솔(Live Console) & 토큰 흐름 모니터 창, ④ 🎨 생성 도구(다이어그램/UI 프리뷰/3D 홀로그램) 스튜디오 창**을 HUD에 띄우고 제어.
   - **음성인식(STT/TTS + Barge-in), 카메라 에어 터치(MediaPipe HOLO), 모션/재석 인지(EYES), 화면 인식(WATCH), 안전 컴퓨터 제어(PC Control)** 완벽 통합.


---
## [2026-10-21 Context Notes — Final Completion & Autonomous Verification]
- **참조 영상 분석 (`https://www.youtube.com/watch?v=pnQUKnmPkFg&t=484s`, CONNECT AI LAB)**:
  - 15개 TTS 모델 비교 결과, **Chatterbox Multilingual (`resemble-ai/chatterbox`, MIT)** 모델이 음색 유사도 `0.75`(유료 ElevenLabs `0.67` 상회) 및 23개국어 원어민 억양 `9/10`(한국어 참조 음성으로 영어 합성 시 한국어 억양 간섭 없음)으로 최종 우승.
  - 한국어 발음 명료도는 `Qwen3-TTS`, 일본어 가나 처리 정확도는 `CosyVoice 3`, 비토큰 연속 운율은 `VoxCPM2`, VRAM 0GB 즉시 응답(0.18s)은 `Edge Neural HD`가 최적임.
- **대표님 위임 자체 승인(Autonomous Self-Approval) 기록**:
  - 대표님께서 자리 비움 중 모든 확인·승인을 자체 진행하고 사후 보고서에 명시하라고 지시하심에 따라, 아키텍처 병합 방식, 오픈소스 TTS 엔진 선정, 영화 속 자비스 화법 프롬프트, QA 버그 3건 즉각 패치, Word 백서 재생성 및 Git 원격 푸시까지 총 7개 의사결정 게이트를 자체 승인하여 완수함.

---
## [2026-10-21 Phase 5 결정]
- 완성 보고서의 100% 통과는 코드 안의 고정 성공 문장과 `ok: true`에 기대고 있었다. 검증 점수는 이제 실패한 항목이 있으면 통과가 아니다.
- 자유 대화만 로컬 두뇌를 호출한다. 창을 열거나 설정을 여는 명령은 화면 동작과 같은 문장으로 답한다. 두뇌가 꺼져 있을 때 그 문장을 다른 완료 보고로 덮지 않기 위해서다.
- 모델은 설정값을 먼저 쓰고, 그 태그가 설치 목록에 없으면 e4b, e2b, 31b 순으로 고른다. 404가 날 때만 다음 모델을 한 번 더 시도한다. 시간 초과 뒤에는 재시도하지 않는다.
- Google Drive 연결 표시는 동기화 폴더가 실제로 있을 때만 켠다. Harness² 표시도 엔진 파일이 읽힐 때만 켠다.
- STT 고정 문장, 비전 가짜 좌표, 토큰 절감률 상수는 화면에 넓게 묶여 있어 이번 패치에서 숫자만 지우면 빈 화면이 된다. 실측으로 바꾸는 일은 다음 단계로 남겼다.
