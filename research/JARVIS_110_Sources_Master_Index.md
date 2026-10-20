# 🌍 해외 J.A.R.V.I.S. & AI Operating System 오픈소스 110+ 딥리서치 종합 아카이브

> **작성일**: 2026-10-20
> **작성자**: CTO 거누 (Geonu) & AI 연구원 우진 (Woojin)
> **목적**: 이건우 대표님 지시에 따라 해외 유튜버(Zubair Trabzada, Pav/Automation Orbit, Jay E 등) 및 글로벌 오픈소스 생태계의 J.A.R.V.I.S. / AI OS 프로젝트 **112개 링크 전수 조사** 및 **핵심 10대 레포지토리 로컬 클론(`c:\BSC_Javis_OS\research\opensource_sources\`)** 완료 보고서.

---

## 1. 핵심 아키텍처 계보 (Top 5 Flagship Blueprints)

### ① Zubair Trabzada (`AI Workshop OS` / `Zubair OS` / `H.O.L.O. Hands` / `Brain Map`)
- **대표님 업로드 스크린샷 원본**: `AI WORKSHOP OS` (좌측 `INSPECTOR`, `TOP HUBS`, `FORCES`, 중앙 3D/2D Obsidian Knowledge Graph, 우측 `FILTER` + `J.A.R.V.I.S.` 아크 리액터 링 & `RING / CUBE / FACE` 모드, `EYES / WATCH / HOLO / FOCUS` 토글, 하단 OpenRouter/Claude Code 프롬프트 바 및 6대 멀티모달 아이콘)
- **로컬 클론 완료 경로**:
  - `c:\BSC_Javis_OS\research\opensource_sources\zubair-trabzada_holo-gestures`
  - `c:\BSC_Javis_OS\research\opensource_sources\zubair-trabzada_brain-map`
- **핵심 기술 해부**:
  - `holo.html` + `server.py`: 외부 클라우드 없이 로컬에 내장된 Google MediaPipe(`hand_landmarker.task` + WASM)와 Three.js를 결합해 웹캠 위에서 손가락 Pinch(집기), Two-hand Stretch(늘려서 읽기 / 구겨서 AI 음성 요약 듣기), Peace Sign(초기화), `J` 키(JARVIS 골드 HUD 및 로컬 음성 내레이션)를 60fps로 구현.
  - `brain-map`: 마크다운 폴더(Obsidian 볼트)를 의존성 제로(Zero-dep)의 D3 Force Graph로 변환하고 노드 생성 시간순 리플레이(`Replay`), 그룹별 클러스터링, 실시간 검색/하이라이트 제공.

### ② Pav (`Automation Orbit` — `pavrus117/ai-os-maps-guide` & YouTube `Zs3faMCDYNs`)
- **참고 링크**:
  - YouTube: `https://www.youtube.com/watch?v=Zs3faMCDYNs` (*Turn Claude Code Into Your AI Operating System - 4 Layers*)
  - GitHub: `https://github.com/pavrus117/ai-os-maps-guide`
- **로컬 클론 완료 경로**:
  - `c:\BSC_Javis_OS\research\opensource_sources\pavrus117_ai-os-maps-guide` (README.md, `ai-os-maps-guide.pdf`, `dashboard-current-views.gif` 포함)
- **MAPS 4계층 프레임워크**:
  1. **M (Memory — Signpost 2-Hop Map)**: 루트 인덱스(40~60줄) -> 영역별 Signpost 파일(80줄 이내: `Projects, State, Skills, Memory, Routines, Not here`) -> 실제 문서로 이어지는 **2-Hop 탐색 구조**. 일반 폴더 탐색 대비 **토큰 소모량 40% 절감(27.7k → 16.8k), 응답 속도 2배 향상** 실증. 매일 밤 깨진 경로를 검사하는 Nightly Checker 가동.
  2. **A (Agent — Dual Machine + Restricted Profile)**: 로컬 PC와 24시간 깨어 있는 서버가 Git으로 5분마다 동기화하되, 무인 실행 프로필에서는 삭제/전송/외부공유 도구를 원천 차단(초안 작성만 허용).
  3. **P (Pulse — Unattended Routines & Quota Caps)**: 5분 주기 스케줄러가 레지스트리를 읽어 백그라운드 루틴(모닝 브리핑 등)을 실행하며, 일일 실행 상한(Daily Cap)과 롤링 윈도우 상한으로 토큰 폭주 방지.
  4. **S (Screen — "Show, Don't Store" & 6 Brain Views)**: 대시보드는 데이터를 직접 소유/저장하지 않고 오직 파일 시스템의 JSON/Markdown을 읽기만 함(버튼 클릭 시에도 `queue/` 폴더에 작은 요청 파일만 생성). 중앙 Brain 패널은 단일 `data/brain.json`을 기반으로 **6가지 뷰(`Rings`, `Circle`, `Areas`, `Links`, `Timeline`, `3D Orbit`)**를 실시간 전환.
- **7대 절대 원칙 (BSC 헌장과 100% 부합)**:
  1. AI는 스스로 작업을 Done 처리하지 않고 오직 사람(대표님)만 완료 체크한다.
  2. 파일은 통째로 덮어쓰지 않고 오직 추가(Append)한다.
  3. LLM 호출 전에 결정론적 코드(Deterministic Code)가 먼저 실행된다.
  4. 대시보드는 보여줄 뿐 저장하지 않는다(Show, don't store).
  5. 파일이 이동하면 같은 턴에 Signpost를 즉시 갱신한다.
  6. 어떠한 파일도 삭제하지 않는다(Archive/Park/Undo 유지).
  7. 계획과 스펙은 채팅창이 아니라 레포지토리 파일에 남긴다.

### ③ Agentic OS V2 (`ctskool/agentic-os-starter-v2`)
- **로컬 클론 완료 경로**: `c:\BSC_Javis_OS\research\opensource_sources\ctskool_agentic-os-starter-v2`
- **핵심 기술 해부**:
  - Next.js + Three.js(`GalaxyCore`, `EmberCore`, `GraphCore`, `OrbLab`) + Obsidian Cockpit 연동.
  - **자비스 자율 윈도우 스폰(Dynamic Overlay) 표준 구현체**:
    - `ReportOverlay.tsx`: 에이전트가 생성한 마크다운 보고서를 앱 전환 없이 HUD 중앙 모달로 즉시 렌더링 및 `obsidian://` 딥링크 연동.
    - `ArtifactOverlay.tsx`: 이미지, PDF, 코드, 문서를 HUD 위에 실시간 프리뷰.
    - `AgentWorkDrawer.tsx` & `TerminalTabs.tsx`: 백그라운드에서 실행 중인 에이전트들의 터미널 콘솔과 작업 상태를 탭 형태로 실시간 관제 및 중단(Stop) 제어.

### ④ Hermes J.A.R.V.I.S. (`eadmin2/jarvis_ai`)
- **로컬 클론 완료 경로**: `c:\BSC_Javis_OS\research\opensource_sources\eadmin2_jarvis_ai`
- **핵심 기술 해부**:
  - 16kHz WebSocket 양방향 음성 스트리밍(Faster-Whisper 실시간 부분 자막 + TTS 스트리밍 + 말 도중 끼어들기 Barge-in 인터럽트).
  - **`/api/summon` (`hud_display` 플러그인)**: 에이전트가 대화 중 필요하다고 판단하면 스스로 `hud_display(media, src, title, position)` 도구를 호출하여 HUD 화면에 홀로그램 미디어/문서/콘솔 패널을 즉시 소환(Summon)하고 `hud_dismiss`로 닫는 아키텍처.

### ⑤ Obsidian Jarvis UI (`Prompt-Surfer/obsidian-jarvis-ui`)
- **로컬 클론 완료 경로**: `c:\BSC_Javis_OS\research\opensource_sources\Prompt-Surfer_obsidian-jarvis-ui`
- **핵심 기술 해부**:
  - Three.js `InstancedMesh` + UnrealBloom + Web Worker D3-Force-3D로 10,000+ 노드를 60~120fps로 렌더링.
  - 6대 입체 형상 변환(**Brain 뇌 구조, Saturn 토성 링, Milky Way 은하 나선, Natural 포스 그래프, The Sun 3계층 태양, Trees 폴더별 프랙탈 나무**) 및 우측 Obsidian 마크다운 리더/CodeMirror 6 실시간 편집기 내장.

---

## 2. 로컬에 클론 완료된 10대 핵심 오픈소스 레포지토리 (`c:\BSC_Javis_OS\research\opensource_sources\`)

| 연번 | 로컬 폴더명 | 원본 GitHub URL | 핵심 역할 |
| :--- | :--- | :--- | :--- |
| 1 | `pavrus117_ai-os-maps-guide` | https://github.com/pavrus117/ai-os-maps-guide | MAPS 4계층(Memory, Agent, Pulse, Screen) 설계도 & 6종 Brain View 명세 |
| 2 | `zubair-trabzada_holo-gestures` | https://github.com/zubair-trabzada/holo-gestures | MediaPipe + Three.js 에어 터치(Pinch/Stretch/Throw) & 3D GLB 분해/조립 |
| 3 | `zubair-trabzada_brain-map` | https://github.com/zubair-trabzada/brain-map | 마크다운 폴더 -> D3 인터랙티브 지식 그래프 변환기 |
| 4 | `ctskool_agentic-os-starter-v2` | https://github.com/ctskool/agentic-os-starter-v2 | Jarvis V2 HUD + ReportOverlay + ArtifactOverlay + TerminalTabs 콘솔 |
| 5 | `Prompt-Surfer_obsidian-jarvis-ui` | https://github.com/Prompt-Surfer/obsidian-jarvis-ui | 3D WebGL Obsidian 볼트 그래프 (Brain/Saturn/MilkyWay/Trees) + 마크다운 리더 |
| 6 | `eadmin2_jarvis_ai` | https://github.com/eadmin2/jarvis_ai | 실시간 음성(Barge-in) + `/api/summon` 자율 홀로그램 창 소환 프로토콜 |
| 7 | `LeoSasion_Jarvis3D` | https://github.com/LeoSasion/Jarvis3D | Windows 10/11 전용 3D 뉴런/성운 JARVIS 데스크탑 쉘 디자인 |
| 8 | `matthewyuart_gesturewatcher` | https://github.com/matthewyuart/gesturewatcher | MediaPipe + React 인브라우저 카메라 제스처 노드 그래프 & Liquid Glass UI |
| 9 | `SanjayKumaran2805_JARVIS` | https://github.com/SanjayKumaran2805/JARVIS | Gemini Live + OpenRouter + 화면 인식 + PC 제어(20+ 액션 모듈) 통합 HUD |
| 10 | `AndrewKochulab_jarvis-dashboard` | https://github.com/AndrewKochulab/jarvis-dashboard | Obsidian 내 에이전트 세션/토큰/30일 애널리틱스 실시간 관제 대시보드 |

---

## 3. 분야별 해외 오픈소스 112개 레퍼런스 링크 인덱스

### A. AI Operating System & Obsidian 3D Second Brain (30개)
1. https://www.youtube.com/watch?v=Zs3faMCDYNs — Pav (Automation Orbit): *Turn Claude Code Into Your AI Operating System (4 Layers)*
2. https://github.com/pavrus117/ai-os-maps-guide — MAPS Framework (Memory, Agent, Pulse, Screen) 공식 가이드 & 프롬프트 팩
3. https://github.com/zubair-trabzada/brain-map — Zubair Trabzada: Markdown Folder to Interactive Knowledge Graph
4. https://github.com/ctskool/agentic-os-starter-v2 — Agentic OS V2 Starter: Obsidian Cockpit + Jarvis HUD + Voice
5. https://github.com/ctskool/agentic-os-starter — Agentic OS V1 Starter
6. https://github.com/Prompt-Surfer/obsidian-jarvis-ui — 3D WebGL Vault Graph for Obsidian with Iron Man/Jarvis Aesthetic
7. https://github.com/AndrewKochulab/jarvis-dashboard — Modular DataviewJS Dashboard for Obsidian & Claude Code Fleet Monitoring
8. https://github.com/kravetech/kos-starter-kit — Portable AI-assisted Knowledge OS Starter Kit for Obsidian & Claude Code
9. https://github.com/danielarif26/agentic-os-starter — Agentic OS for Claude Code (7 Loop-wired Skills, Karpathy Memory Vault)
10. https://github.com/erikschlegel/jarvis-vault — Self-organizing AI Second Brain for Obsidian (Karpathy LLM Wiki Pattern)
11. https://github.com/Youngkwon-Lee/second-brain-ui — Local-first Web UI for Visualizing Obsidian Vault as a Living 3D Graph + RAG
12. https://github.com/Apoo711/obsidian-3d-graph — Rust + WebAssembly 50,000+ Node 60fps 3D Graph for Obsidian
13. https://github.com/CocoRoF/graphier — React + Three.js WebGL Graph Renderer (Web Worker 2D/3D Force Layout, InstancedMesh)
14. https://github.com/chntnm/akasha — Akasha: 3D WebGL Knowledge-Graph Explorer for Obsidian Vaults
15. https://github.com/c-miles/orrery — Render Obsidian Vault Link Graph as a Cinematic Auto-rotating 3D Orrery
16. https://github.com/chuong1224/ton618 — 3D Cockpit for Markdown Knowledge Vaults + Real-time AI-Agent Activity Replay
17. https://github.com/AJFUTURES/obsidian-3d-pinnable-graph — Glowing 3D Graph with Cluster Regions + JARVIS-style Vault HUD
18. https://github.com/elliott-json-park/obsidian-vault-orrery — 3D Graph View Where Folders Are Stars and Notes Orbit Them
19. https://github.com/HernanJr0/brain-graph — Visualize Obsidian Vault as a 2D/3D Graph Shaped Like a Brain (Three.js)
20. https://github.com/miumiuliaison-wq/Saturn-Graph — Directory-driven 3D Knowledge Cosmos for Obsidian
21. https://github.com/cardozodiegob/obsidian-solar-graph — Solar System 3D Graph View for Obsidian
22. https://github.com/CmdShiftExecute/antechamber — Cinematic Scroll-choreographed 3D Knowledge-Graph Portal for Obsidian
23. https://github.com/khoda81/obsidian-better-graph-3d — Live 3D Force-directed Vault Graph Rendered with Three.js
24. https://github.com/hungnv26/2d-3d-knowledge-graph — Obsidian-style 2D/3D Semantic Knowledge Graph Package
25. https://github.com/Lee-Kang-Jun0705/ontology-forge — Second Brain as a Graph of Nodes + Relations like Iron Man's JARVIS
26. https://github.com/Muliminty/jarvis-obsidian-claude — JARVIS Butler with Obsidian Knowledge Graph & Claude Code Core
27. https://github.com/sergeville/JARVIS-Interface — Always-on AI Chief of Staff with Browser HUD & Persistent Obsidian Vault
28. https://github.com/OzgurH/MaxAIMinToken — Universal Multi-Agent Local-RAG Knowledge OS Starter Kit (Token Minimization)
29. https://github.com/jiawu930301-cloud/obsidian-ai-workflow-os — Obsidian-based AI Workflow OS Starter Kit
30. https://github.com/Bimbi-Dev/bimbOS — Persona-agnostic Personal-OS Framework (Obsidian Vault + Claude Code Agents)

### B. Camera Touch / Hand Gesture / Motion Recognition (MediaPipe + Three.js) (28개)
31. https://github.com/zubair-trabzada/holo-gestures — H.O.L.O. Hands: Webcam Mid-air Hand Gesture Control for Markdown Notes & 3D Scans
32. https://github.com/matthewyuart/gesturewatcher — Camera Gesture Control for Layouts, Node Graphs, and Jarvis HUD (MediaPipe + React)
33. https://github.com/RmaNMetaverse/Jarvis-3D-GestureControl — MediaPipe JS + Three.js 3D Model Hand Gesture Control
34. https://github.com/BudhaTronix/JarvisFlow — Gesture-controlled Floating Mind-Map Nodes (React + MediaPipe + FastAPI)
35. https://github.com/collidingScopes/3D-editor — Three.js + MediaPipe Hand Gesture 3D Shape Editor
36. https://github.com/collidingScopes/threejs-handtracking-101 — Interactive 3D WebGL Hand Tracking Starter
37. https://github.com/alseambusher/jarvis — Hand Motion and Automata-based Gesture Recognition for HCI
38. https://github.com/priyanshusta/ZEHEN — Control Windows with Hand Gestures via Laptop Camera (Move, Click, Scroll, Air-Write)
39. https://github.com/anshumaaann/Gesture-Controller-Pro — Real-time Cursor, Scroll, Volume Control with JARVIS Interface (OpenCV + MediaPipe)
40. https://github.com/joehehe0426/jarvis-orb — J.A.R.V.I.S. Holographic Geodesic Orb with Constellation Network & MediaPipe Hand Controls
41. https://github.com/sheersh03/jarvis-reactor-system — Jarvis Neural Reactor: Speech + MediaPipe Hand-tracking + Particle Reactor Core
42. https://github.com/shekkawai/dsh-jarvis-hud — Hand-gesture + Voice Control for Coding Agent (Point to Aim, Hold to Click)
43. https://github.com/TalibIbrahim/JARVIS — Touchless Hand-gesture PC Control with Dynamic-Island Notch Overlay for Windows
44. https://github.com/alphoder/Jarvis1.0 — Browser-based 3D Physics Engine (Three.js + Cannon-ES) with Real-time Hand Gesture Control
45. https://github.com/DevByD/Jarvis-gesture-interface — J.A.R.V.I.S-style Gesture Interface using MediaPipe & Canvas Animations
46. https://github.com/itxayushshukla/jarvis-mark3 — Single HTML Voice + MediaPipe Hands Hologram Mode (Draw/Drag/Stop via Fingers)
47. https://github.com/SJbuilds04/ARC — Augmented Reality Command Center: Hand Gestures + Face-tracking VISOR HUD
48. https://github.com/rishitgupta01062010-arch/ULTRON-Orb — Three.js Orb + Wake-word + Hand Gestures + Streaming Brain
49. https://github.com/hunterprom/MEDO-AI-assistant — Local-first Voice + Gesture AI Desktop Assistant with Sci-Fi HUD
50. https://github.com/adhqulm/JARVIS — AI Companion with Face Recognition, Gesture Reaction, ElevenLabs & Claude
51. https://github.com/Adv20202/molecular_jarvis — Interactive 3D Structure Visualization Controlled by Hand Gestures (MediaPipe)
52. https://github.com/efexcodes/Mini-Jarvis — MediaPipe Hand Landmarks Mouse/Volume/Brightness PC Controller
53. https://github.com/kaid0x/gesture-control — Webcam Hand Gesture Control with Jarvis-style HUD
54. https://github.com/muhib360/hand-jarvis — Control Windows with Hand Gestures via Webcam (MediaPipe + Python)
55. https://github.com/sahajkhandelwal1/JARVIS — Gesture-controlled Drawing Interface using MediaPipe Hand Tracking
56. https://github.com/BotForgeX/holo-assist — Projector/Camera Interactive System with Hand Tracking
57. https://github.com/dharmaRaavi/HoloCube-Real-Time-3D-Hologram-Controlled-by-Hand-Gestures — Real-Time 3D Hologram Cube Controlled by Hand Gestures
58. https://github.com/HarshaVardhanbokara/HoloGest-Touchless-Computer-Interaction-Using-Gestures — Touchless Computer Interaction Using Gestures

### C. Voice Recognition, Holographic HUD & Dynamic Window Summoning (30개)
59. https://github.com/eadmin2/jarvis_ai — Iron-Man-style Voice Assistant + Holographic HUD + Agent-summoned Media Panels (`/api/summon`)
60. https://github.com/ethanplusai/jarvis — Voice Assistant for Claude Code (895 Stars)
61. https://github.com/adewaskar/jarvis — J.A.R.V.I.S for Automating Daily Tasks using Claude Code (525 Stars)
62. https://github.com/alpunlu12-commits/jarvis — JARVIS V4 Voice AI Assistant powered by Gemini Live (403 Stars)
63. https://github.com/IRISX-AI/IRIS-AI — Desktop AI Assistant with Voice, Automation, Memory, Vision & Workflow Tools (218 Stars)
64. https://github.com/Julian-Ivanov/jarvis-voice-assistant — Voice Control, Browser Automation, Screen Capture & Double-clap Launch (121 Stars)
65. https://github.com/addyosmani/jarvis — Addy Osmani's JARVIS built using the Gemini Live API (56 Stars)
66. https://github.com/6m1w/claude-sound-fx — JARVIS Sound Effects Theme for Claude Code / Terminal (48 Stars)
67. https://github.com/Hermes815/kid-mode-jarvis — Server-authoritative Safety-walled Gemini Live Voice Console (46 Stars)
68. https://github.com/mp-web3/jarvis-v3 — Local Voice Interface for Claude Code (Parakeet STT + Kokoro TTS + Dual VAD) (35 Stars)
69. https://github.com/sam3gp8/jarvis-aio — MCU-inspired Autonomous AI Butler with Voice, Vision, Memory & Full HUD Panel (29 Stars)
70. https://github.com/avijeett007/jarvis-live-api-gemini — JARVIS Live API Gemini Integration (26 Stars)
71. https://github.com/porokka/jarvis-os — Multi-model Ollama + Claude Code + Obsidian Operations System (25 Stars)
72. https://github.com/ehteshambuildagents/jarvis — Iron Man Holographic UI driven by Claude Code with Windows Loopback Bridge (23 Stars)
73. https://github.com/Dix01/JARVIS — Local-first Windows Assistant: Voice (Whisper+Piper), Webcam Vision, FLUX Gen, Image-to-3D, React+Three.js HUD (19 Stars)
74. https://github.com/JaimeParker/stable-jarvis — Personal Research System for Gemini-CLI, Codex, Claude Code (19 Stars)
75. https://github.com/jdrurka/jarvis-demo — Chrome STT -> Headless Agent -> Fish Audio TTS with Reactive Orb (16 Stars)
76. https://github.com/Itsme23476/jarvis-claude-code — Local Voice + Memory-Graph HUD driven by Claude Code (15 Stars)
77. https://github.com/LeoSasion/Jarvis3D — JARVIS 3D Neuron HUD Desktop Shell for Windows 10/11 (15 Stars)
78. https://github.com/MARCCHERGGI/jarvis-home — Cinematic AI Desktop UI Framework (Earth Zoom, Voice Briefing, Pluggable Brain) (9 Stars)
79. https://github.com/salahasfan02/Jarvis--private-local-AI-assistant — Private Local AI Assistant (Voice, Vision, Automation) (8 Stars)
80. https://github.com/PascalAI2024/JarvisNano — Voice-first Desk Companion with Gemini Live & Policy-gated MCP Tools (7 Stars)
81. https://github.com/Maher-Bhatt/KALKI — Tactical AI Desktop Assistant for Windows with Sci-Fi HUD & Firebase Sync (6 Stars)
82. https://github.com/Samin12/jarvis — Live Voice Assistant in a HUD with Calendar/Gmail & Agent Dispatch (6 Stars)
83. https://github.com/itsmorethancv/NeoCore-Vo2-Public — Tactical HUD AI for Desktop Command & PC Automation (5 Stars)
84. https://github.com/nandkishorrathodk-art/Aether-AI — 70+ Features: Voice, CV, AR, Gesture Recognition, Multi-provider LLM (5 Stars)
85. https://github.com/Raghava00001/Jarvis — AI Desktop Assistant with Gemini Live Voice, Iron Man Web HUD, 30+ Tools (4 Stars)
86. https://github.com/hackerskr76/Jarvis — Mark-LXXXV Low-latency Voice Assistant with Multimodal Live API & Local System Control (4 Stars)
87. https://github.com/bionorthtech/JarvisAI — Local AI Assistant & Coding Agent (ChromaDB + Tauri + Second Brain) (4 Stars)
88. https://github.com/jarvis-openclaw-assistant/stark-systems — Cinematic AI Command Interface inspired by Iron Man JARVIS HUD (3 Stars)

### D. Computer Use (OS/Browser Control), Multi-Agent & Generation Tools (24개)
89. https://github.com/BolisettySujith/J.A.R.V.I.S — Voice Assistant for Full PC Operations & Computer Interaction (388 Stars)
90. https://github.com/ReshefElisha/jarvis-onshape-mcp — Jarvis Onshape MCP: Vision-decomposition + Parametric 3D CAD Generation (174 Stars)
91. https://github.com/zubair-trabzada/geo-seo-claude — Zubair's Flagship Claude Skill Suite Architecture (11,117 Stars)
92. https://github.com/zubair-trabzada/ai-marketing-claude — Parallel Subagent Orchestration Pattern (2,773 Stars)
93. https://github.com/zubair-trabzada/ai-agency-claude — Unified 5-Team AI Agency Command Center Pattern (153 Stars)
94. https://github.com/zubair-trabzada/scroll-cinematic-claude — 3D Scroll Websites & Higgsfield MCP Generation Engine (74 Stars)
95. https://github.com/0pen-Sourcer/Hearth — Local-first AI Harness for Direct Computer Use (32 Stars)
96. https://github.com/DasunNethsara-04/JARVIS-PC-Assistant — JARVIS PC Operations Assistant (11 Stars)
97. https://github.com/Talha-Ali-5365/JARVIS — AI Computer Assistant (8 Stars)
98. https://github.com/Ninot1Quyi/jarvis — Active AI Agent for Computer Use (7 Stars)
99. https://github.com/ONEPUNCHMAN411/Jarvis — Windows 11 Voice Assistant with Full Computer-Use (Mouse/Keyboard/Playwright/50+ Plugins) (6 Stars)
100. https://github.com/SanjayKumaran2805/JARVIS — Tactical AI Assistant with Vision Screen Perception, OS Automation & Multi-Agent Execution (6 Stars)
101. https://github.com/nileshpatil6/Aura — Voice AI that Sees Your Screen and Drives It (Clicks, Types, Multi-step Tasks) (5 Stars)
102. https://github.com/AnaaySampat/jarvis-windows — Windows AI Voice Assistant: Tauri + React HUD + Browser/Desktop Autopilot (3 Stars)
103. https://github.com/dan-calin/miko — Windows AI Agent with Second-brain Memory, Deep Research, PC Control & Pair-programming (3 Stars)
104. https://github.com/Itsme23476/jarvis-os — Voice HUD with Live Telemetry & OS Connectors (3 Stars)
105. https://github.com/MarkyADHD/jarvis — Self-evolving Assistant with Voice, PC Control & Live Face HUD (3 Stars)
106. https://github.com/phillwarren/jarvis-hud — Tauri + React + Local AI Desktop HUD (3 Stars)
107. https://github.com/psycoks/Jarvis — Windows Local-first Voice Assistant with Desktop/Browser Automation & WebGL HUD (3 Stars)
108. https://github.com/roshandhiman/friday-desktop — Offline AI Desktop Assistant (Electron + React + FastAPI + System Control) (3 Stars)
109. https://github.com/momorzq-oss/JARVIS — Cinematic Windows AI Desktop Assistant with OpenRouter, Browser & Office Workflows (2 Stars)
110. https://github.com/MuhammadHamdan35/JARVIS-OS — Electron Desktop Assistant with Hardware Monitoring & Live Feeds (2 Stars)
111. https://github.com/soumik3312/Jarvis---Personal-Desktop-AI-Assistant — 3D HUD Interface, Wake-word, System Automation & Electron Integration (2 Stars)
112. https://github.com/Gmdrones/jarvis-multi-agent-ecosystem — Multi-agent Ecosystem with Obsidian Memory, MCP Remote Desktop Commander & Mission Control (1 Star)
