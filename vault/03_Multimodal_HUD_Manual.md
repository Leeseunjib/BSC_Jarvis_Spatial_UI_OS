# 🎛️ 03. Multimodal HUD & Autonomous Windows Manual (자비스 통합 사용 설명서)

> 본 문서는 자비스가 대화 중 대표님께 즉시 띄워 드리는 **『📘 표준 설명서(Manual)』** 정본입니다.

## 1. 화면 구성 (`AI WORKSHOP OS — BSC EDITION`)
- **좌측 레일 (Inspector & Brain Controls)**:
  - **6대 뷰 전환 버튼**: `3D Galaxy` (입체 은하), `2D Force` (평면 물리 그래프), `Rings` (MAPS 계층별 동심원), `Areas` (도메인 클러스터), `Timeline` (시간순 분포), `Brain` (뇌 구조 형상).
  - **TOP HUBS**: 클릭 시 해당 도메인(세계관, BSC 본사 가이드라인, 28인 에이전트, 지식창고, 해외 112개 오픈소스 등)만 즉시 하이라이트.
  - **FORCES & TOKEN FLOW**: 노드 간 반발력(`Repel`), 링크 길이(`Link Length`) 조절 및 실시간 토큰 절감률/일일 예산 게이지 표시.
- **중앙 캔버스 (Interactive Knowledge Galaxy)**:
  - 마우스 드래그(회전/이동), 휠(줌), 노드 클릭(연결 경로 추적 및 상세 내용 열람), 더블클릭(보고서 창으로 즉시 열기).
- **우측 코어 (J.A.R.V.I.S. Reactor & 4 Sensors)**:
  - **코어 형태**: `RING` (아크 리액터) / `CUBE` (테서랙트 큐브) / `FACE` (홀로그램 뉴럴 페이스).
  - **센서 토글**:
    - `EYES`: 웹캠 기반 대표님 재석/모션 감지.
    - `WATCH`: 현재 PC 화면 캡처 및 시각 컨텍스트 인식.
    - `HOLO`: 웹캠 MediaPipe 손가락 제스처(Pinch 집기, 두 손 Stretch 확대/축소, ✌ Peace 초기화) 에어 터치 활성화.
    - `FOCUS`: 선택된 노드와 활성 창에만 집중하도록 배경 감광.

## 2. 자율 스폰 윈도우 (`Autonomous Floating HUD Windows`)
자비스는 대표님과의 대화 맥락을 분석해 아래 4가지 창을 스스로 띄우거나 하단 독(Dock)에서 즉시 호출할 수 있습니다:
1. **📘 설명서 창 (`Manual Window`)**: 시스템 사용법, 단축키, MAPS & CHL 아키텍처 가이드.
2. **📊 심층 보고서 창 (`Report Window`)**: 112개 오픈소스 분석 리포트, 모닝 코람데오 브리핑, 프로젝트 기획서 마크다운 뷰어 및 본사 저장.
3. **💻 실시간 제작 콘솔 창 (`Live Console Window`)**: 에이전트 실시간 작업 스트림, 터미널 로그, 토큰 유량(Token Flow), Harness 보안 게이트 검증 현황.
4. **🎨 생성 스튜디오 창 (`Gen Studio Window`)**: 실시간 아키텍처 다이어그램, UI 프로토타입 프리뷰, 인터랙티브 3D 홀로그램 오브젝트 조작기.

## 3. 음성 및 단축키 명령어 예시
- `"자비스, 설명서 창 띄워줘"` / `"보고서 보여줘"` / `"제작 콘솔 열어줘"` / `"생성 스튜디오 열어줘"`
- `"자비스, 오늘 함께 할 일 브리핑해줘"`
- `"자비스, 3D 뇌 모양으로 그래프 바꿔줘"` / `"동심원 뷰로 보여줘"`
- `"자비스, 컴퓨터 제어로 메모장(또는 탐색기/PDF) 열어줘"`

## 연결 노드
- [[00_SOUL_and_Worldview]]
- [[01_MEMORY_MAP]]
- [[04_Token_Flow_Optimization]]
