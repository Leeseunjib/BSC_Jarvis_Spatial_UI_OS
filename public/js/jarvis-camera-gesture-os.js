/**
 * ============================================================================
 * BSC J.A.R.V.I.S. OS — Spatial Camera Gesture Engine & 59-JARVIS Research Hub
 * Imported & Integrated from Conversation: d66ddba7-271c-45c7-986c-d1fb11c792a8
 * ("Javis Ai System Research and MockUps")
 *
 * 1. MediaPipe 21-Keypoints Real-Time Hand Gesture UI Control:
 *    - 1. 인식 (Recognize / Hover): Index Finger Tip (#8) Pointing & Target Lock
 *    - 2. 클릭 (Pinch Click): Thumb (#4) + Index (#8) distance < 0.055
 *    - 3. 이동 (Pinch Drag & Move): Hold Pinch on HUD Window / Panel to Drag X/Y
 *    - 4. 회전 (Palm Twist / 3D Rotate): Pinky (#20)-Wrist (#0) fold or Shift/Right-drag
 * 2. 59 Global & Domestic JARVIS Ecosystem Deep Research Database (6 Categories)
 * 3. Bright Minimal Monotone UI Integration
 * ============================================================================
 */

window.JarvisCameraGestureOS = {
  webcamActive: false,
  simHandActive: false,
  gestureEnabled: false,
  mpCamera: null,
  handsInstance: null,
  pointerX: window.innerWidth / 2,
  pointerY: window.innerHeight / 2,
  wasPinching: false,
  activeDragEl: null,
  dragOffsetX: 0,
  dragOffsetY: 0,
  lastHoveredEl: null,
  simTimer: null,
  simTick: 0,

  // 59 Global & Domestic JARVIS Ecosystem Database from d66ddba7-271c-45c7-986c-d1fb11c792a8
  RESEARCH_59_DB: [
    // Category 1: Global BigTech & Leading Enterprise (10)
    { id: 1, cat: '빅테크/기업 (10)', name: 'Microsoft JARVIS (HuggingGPT)', org: 'Microsoft Research', desc: 'LLM을 메인 컨트롤러로 삼아 수백 개 멀티모달 모델을 오케스트레이션', url: 'https://github.com/microsoft/JARVIS' },
    { id: 2, cat: '빅테크/기업 (10)', name: 'Microsoft UFO', org: 'Microsoft', desc: 'Windows OS 환경을 직접 조작하는 듀얼 에이전트(AppAgent + HostAgent)', url: 'https://github.com/microsoft/UFO' },
    { id: 3, cat: '빅테크/기업 (10)', name: 'Microsoft OmniParser', org: 'Microsoft', desc: '스크린 화면을 UI 요소 아이콘 및 바운딩 박스로 인식하는 비전 모듈', url: 'https://github.com/microsoft/OmniParser' },
    { id: 4, cat: '빅테크/기업 (10)', name: 'Anthropic Computer Use', org: 'Anthropic', desc: '화면 캡처 및 마우스 이동/클릭/타이핑을 직접 수행하는 OS 제어 자비스', url: 'https://docs.anthropic.com/en/docs/build-with-claude/computer-use' },
    { id: 5, cat: '빅테크/기업 (10)', name: 'OpenAI Whisper', org: 'OpenAI', desc: '초정밀 멀티링구얼 음성 인식(STT) 오픈소스 청각 신경망', url: 'https://github.com/openai/whisper' },
    { id: 6, cat: '빅테크/기업 (10)', name: "Mark Zuckerberg's Jarvis", org: 'Meta', desc: '모건 프리먼 음성 기반 스마트홈·안면인식 홈 오토메이션 자비스', url: 'https://about.meta.com/technologies/building-jarvis' },
    { id: 7, cat: '빅테크/기업 (10)', name: 'Hume AI Empathic Voice (EVI)', org: 'Hume AI', desc: '목소리 톤과 감정을 인식해 200ms 초저지연 공감 대화를 나누는 음성 AI', url: 'https://www.hume.ai' },
    { id: 8, cat: '빅테크/기업 (10)', name: 'ElevenLabs Conversational AI', org: 'ElevenLabs', desc: '사람 수준의 억양과 지연 없는 양방향 오디오 자비스 엔진', url: 'https://elevenlabs.io/conversational-ai' },
    { id: 9, cat: '빅테크/기업 (10)', name: 'Rabbit R1 (Large Action Model)', org: 'Rabbit Inc.', desc: '웹 및 앱 UI를 직접 작동시키는 LAM 기반 하드웨어 비서', url: 'https://www.rabbit.tech' },
    { id: 10, cat: '빅테크/기업 (10)', name: 'Tencent AppAgent', org: 'Tencent', desc: '스마트폰 GUI를 자율 탭·스크롤하며 앱 작업을 완수하는 모바일 자비스', url: 'https://github.com/mnotgod96/AppAgent' },

    // Category 2: Global Open-Source Autonomous Agents (15)
    { id: 11, cat: '오픈소스 에이전트 (15)', name: 'Open-Interpreter', org: 'open-interpreter', desc: '로컬 환경에서 터미널·브라우저·파이썬 코드를 직접 실행하는 오픈소스 자비스', url: 'https://github.com/open-interpreter/open-interpreter' },
    { id: 12, cat: '오픈소스 에이전트 (15)', name: 'AutoGPT', org: 'Significant-Gravitas', desc: '자율 목표 달성을 위해 계획·검색·파일 생성을 루프로 수행하는 에이전트', url: 'https://github.com/Significant-Gravitas/AutoGPT' },
    { id: 13, cat: '오픈소스 에이전트 (15)', name: 'Jarvis-AIO (HACS)', org: 'sam3gp8', desc: 'Home Assistant 전용 자비스 올인원 통합팩 (루틴 학습 + 로컬 Ollama 연동)', url: 'https://github.com/sam3gp8/jarvis-aio' },
    { id: 14, cat: '오픈소스 에이전트 (15)', name: 'OpenJarvis', org: 'open-jarvis', desc: '온디바이스 하드웨어 제어 및 프라이빗 데이터 보존 특화 로컬 AI 스택', url: 'https://github.com/open-jarvis/OpenJarvis' },
    { id: 15, cat: '오픈소스 에이전트 (15)', name: 'Jarvis Assistant for HASS', org: 'mattmaas', desc: 'Home Assistant와 OpenRGB 조명 제어·PC 명령을 결합한 파이썬 비서', url: 'https://github.com/mattmaas/Jarvis-Assistant-for-HASS' },
    { id: 16, cat: '오픈소스 에이전트 (15)', name: 'Jarvis Voice Satellite', org: 'Beast12', desc: 'ESP32-S3 터치 디스플레이 보드 기반 하드웨어 음성 위성 오픈소스', url: 'https://github.com/Beast12/jarvis-voice-assistant-freenove' },
    { id: 17, cat: '오픈소스 에이전트 (15)', name: 'Leon AI', org: 'leon-ai', desc: 'Node.js + Python 기반 100% 프라이빗 개인 서버 구동형 오픈소스 AI 비서', url: 'https://github.com/leon-ai/leon' },
    { id: 18, cat: '오픈소스 에이전트 (15)', name: 'Khoj', org: 'khoj-ai', desc: '개인 문서(Obsidian, PDF, GitHub)를 색인화해 로컬 두뇌처럼 질의응답하는 비서', url: 'https://github.com/khoj-ai/khoj' },
    { id: 19, cat: '오픈소스 에이전트 (15)', name: 'GPT Computer Assistant', org: 'onuratakan', desc: '윈도우/맥/리눅스 데스크톱 화면 인식 및 클릭·오디오 입출력 결합 PC 자비스', url: 'https://github.com/onuratakan/gpt-computer-assistant' },
    { id: 20, cat: '오픈소스 에이전트 (15)', name: 'OpenHands (OpenDevin)', org: 'All-Hands-AI', desc: '소프트웨어 개발 및 터미널 작업을 자율 수행하는 엔지니어링 특화 자비스', url: 'https://github.com/All-Hands-AI/OpenHands' },
    { id: 21, cat: '오픈소스 에이전트 (15)', name: 'BabyAGI', org: 'yoheinakajima', desc: '태스크 생성·우선순위 재정렬·연속 실행 루프를 정립한 경량 자율 에이전트', url: 'https://github.com/yoheinakajima/babyagi' },
    { id: 22, cat: '오픈소스 에이전트 (15)', name: 'CrewAI', org: 'crewAIInc', desc: '다중 AI 에이전트 간 역할 분담 및 협업 워크플로우 오케스트레이션', url: 'https://github.com/crewAIInc/crewAI' },
    { id: 23, cat: '오픈소스 에이전트 (15)', name: 'Microsoft AutoGen', org: 'microsoft', desc: '다중 에이전트 양방향 대화 및 툴 호출 조율 엔터프라이즈 런타임', url: 'https://github.com/microsoft/autogen' },
    { id: 24, cat: '오픈소스 에이전트 (15)', name: 'LangGraph', org: 'langchain-ai', desc: '순환 그래프 구조로 상태 유지 및 인간 개입(HITL)·오류 복구를 지원', url: 'https://github.com/langchain-ai/langgraph' },
    { id: 25, cat: '오픈소스 에이전트 (15)', name: 'Dify', org: 'langgenius', desc: '복합 에이전트 파이프라인·RAG·도구 통합을 시각적 노드로 설계하는 플랫폼', url: 'https://github.com/langgenius/dify' },

    // Category 3: Local Runtime, Voice & Smart Home Backbone (12)
    { id: 26, cat: '로컬 런타임/음성/홈 (12)', name: 'Home Assistant Core', org: 'home-assistant', desc: '3,000종 이상의 IoT 기기를 단일 API로 통합 제어하는 스마트홈 신경계', url: 'https://github.com/home-assistant/core' },
    { id: 27, cat: '로컬 런타임/음성/홈 (12)', name: 'Ollama', org: 'ollama', desc: '최신 로컬 LLM(Gemma 4, Qwen 2.5, DeepSeek)을 로컬 GPU에서 서빙하는 런타임', url: 'https://github.com/ollama/ollama' },
    { id: 28, cat: '로컬 런타임/음성/홈 (12)', name: 'LocalAI', org: 'mudler', desc: 'OpenAI API 호환 로컬 멀티모달(텍스트·오디오·비전) 올인원 서빙 플랫폼', url: 'https://github.com/mudler/LocalAI' },
    { id: 29, cat: '로컬 런타임/음성/홈 (12)', name: 'Jan (Desktop AI)', org: 'janhq', desc: '인터넷 없이 PC 내 100% 로컬 프라이빗 모델로 구동되는 데스크톱 AI 클라이언트', url: 'https://github.com/janhq/jan' },
    { id: 30, cat: '로컬 런타임/음성/홈 (12)', name: 'AnythingLLM', org: 'Mintplex-Labs', desc: '방대한 로컬 문서·벡터 DB·웹 리소스를 RAG 에이전트로 엮어주는 풀스택 툴킷', url: 'https://github.com/Mintplex-Labs/anything-llm' },
    { id: 31, cat: '로컬 런타임/음성/홈 (12)', name: 'Rhasspy', org: 'rhasspy', desc: '클라우드 전송 없이 100% 오프라인 Wake Word 및 의도 파악 음성 허브', url: 'https://github.com/rhasspy/rhasspy' },
    { id: 32, cat: '로컬 런타임/음성/홈 (12)', name: 'Piper TTS', org: 'rhasspy', desc: '온디바이스에서도 실시간 배속 이상 초저지연으로 구동되는 신경망 TTS', url: 'https://github.com/rhasspy/piper' },
    { id: 33, cat: '로컬 런타임/음성/홈 (12)', name: 'Kokoro-82M', org: 'hexgrad', desc: '82M 파라미터로 클라우드급 감정 표현과 초고속 합성을 제공하는 로컬 TTS', url: 'https://github.com/hexgrad/kokoro' },
    { id: 34, cat: '로컬 런타임/음성/홈 (12)', name: 'Frigate NVR', org: 'blakeblackshear', desc: '로컬 실시간 영상 처리 및 객체/안면 인식을 수행하는 비전 NVR', url: 'https://github.com/blakeblackshear/frigate' },
    { id: 35, cat: '로컬 런타임/음성/홈 (12)', name: 'Faster-Whisper', org: 'SYSTRAN', desc: 'CTranslate2 기반으로 원본 Whisper 대비 4배 빠른 STT 가속 엔진', url: 'https://github.com/SYSTRAN/faster-whisper' },
    { id: 36, cat: '로컬 런타임/음성/홈 (12)', name: 'ChatTTS', org: '2noise', desc: '대화형 어조, 웃음소리, 숨소리 등 생생한 사람 뉘앙스를 재현하는 대화 특화 TTS', url: 'https://github.com/2noise/ChatTTS' },
    { id: 37, cat: '로컬 런타임/음성/홈 (12)', name: 'Fish-Speech', org: 'fishaudio', desc: '제로샷 음성 복제(Voice Cloning) 지원 차세대 다국어 TTS', url: 'https://github.com/fishaudio/fish-speech' },

    // Category 4: Global Tech YouTubers & Indie Makers (8)
    { id: 38, cat: '해외 유튜버/메이커 (8)', name: 'Hacksmith Industries', org: 'YouTube Creator', desc: '실제 금속 아이언맨 헬멧 내부 HUD 디스플레이 + 열화상 비전 + 음성 제어 제작', url: 'https://www.youtube.com/@theHacksmith' },
    { id: 39, cat: '해외 유튜버/메이커 (8)', name: 'NetworkChuck', org: 'YouTube Creator', desc: 'Proxmox 홈랩 + Docker + Ollama + Whisper + Home Assistant 100% 오프라인 자비스', url: 'https://www.youtube.com/@NetworkChuck' },
    { id: 40, cat: '해외 유튜버/메이커 (8)', name: 'FatihMakes (Mark XL)', org: 'GitHub / Creator', desc: '오픈소스 데스크톱 HUD UI와 PC 하드웨어 제어 파이프라인 Mark XL 구축', url: 'https://github.com/fatih-makes' },
    { id: 41, cat: '해외 유튜버/메이커 (8)', name: 'Kevin McAleer', org: 'GitHub / Creator', desc: '3D 프린팅 로봇 헤드 + 라즈베리 파이 + 서보 시선 추적 + 로컬 LLM 물리 자비스', url: 'https://github.com/kevinmcaleer' },
    { id: 42, cat: '해외 유튜버/메이커 (8)', name: "Dave's Armoury", org: 'YouTube Creator', desc: '아두이노·서보 모터 개폐 마크 3 헬멧에 음성 인식 AI 연동 하드웨어 빌드', url: 'https://www.youtube.com/@DavesArmoury' },
    { id: 43, cat: '해외 유튜버/메이커 (8)', name: 'Matt Wolfe', org: 'YouTube Creator', desc: '자율 멀티에이전트 툴 비교 분석 및 실무 비서 오토메이션 구축 가이드', url: 'https://www.youtube.com/@mreflow' },
    { id: 44, cat: '해외 유튜버/메이커 (8)', name: 'Matthew Berman', org: 'YouTube Creator', desc: '로컬 LLM·펑션 콜링·홈 오토메이션 결합 $0 스마트홈 자비스 파이프라인', url: 'https://www.youtube.com/@MatthewBerman' },
    { id: 45, cat: '해외 유튜버/메이커 (8)', name: 'Fireship', org: 'YouTube Creator', desc: '최신 웹 기술 및 LLM 펑션 콜링 결합 웹 브라우저 조작 자비스 구현', url: 'https://www.youtube.com/@Fireship' },

    // Category 5: Domestic Enterprise JARVIS Systems (6)
    { id: 46, cat: '국내 기업/플랫폼 (6)', name: '삼성전자 갤럭시 AI & Bixby', org: 'Samsung Electronics', desc: '온디바이스 LLM 연동 및 SmartThings 가전 통합 기기 간 오케스트레이션', url: 'https://www.samsung.com/sec/galaxy-ai/' },
    { id: 47, cat: '국내 기업/플랫폼 (6)', name: 'LG전자 ThinQ ON', org: 'LG Electronics', desc: '생성형 AI가 탑재된 홈 허브로 일상 구어체를 이해해 공간 가전·조명 맥락 제어', url: 'https://www.lge.co.kr/thinq' },
    { id: 48, cat: '국내 기업/플랫폼 (6)', name: 'SK텔레콤 에이닷 (A.)', org: 'SK Telecom', desc: '실시간 통화 요약, 양방향 동시통역, 일정·루틴을 관장하는 개인 AI 비서', url: 'https://adot.ai/' },
    { id: 49, cat: '국내 기업/플랫폼 (6)', name: '네이버 클로바X (Clova X)', org: 'NAVER', desc: '하이퍼클로바 X 기반 한국어 생태계 연계 도구 호출 특화 대화형 AI', url: 'https://clova-x.naver.com/' },
    { id: 50, cat: '국내 기업/플랫폼 (6)', name: 'KT 믿:음 & AI 통화비서', org: 'KT', desc: '업무용 통화 자동 응대, 예약 및 주문 스케줄링 전담 B2B 통화 비서', url: 'https://enterprise.kt.com' },
    { id: 51, cat: '국내 기업/플랫폼 (6)', name: '카카오 카나나 (Kanana)', org: 'Kakao', desc: '1:1 개인 비서 및 그룹 단톡방 맥락을 기억해 일정을 조율하는 AI 메이트', url: 'https://www.kakaocorp.com' },

    // Category 6: Domestic Tech YouTubers & Developers (8)
    { id: 52, cat: '국내 유튜버/개발자 (8)', name: '조코딩 (JoCoding)', org: 'GitHub / Creator', desc: 'Function Calling, 파이썬 기반 컴퓨터 비서 및 자율 에이전트 파이프라인', url: 'https://github.com/jocoding' },
    { id: 53, cat: '국내 유튜버/개발자 (8)', name: '빵형의 개발도상국 (kairess)', org: 'GitHub / Creator', desc: '파이썬 음성인식 + 로컬 LLM(Ollama) + TTS 결합 PC 프로그램/웹 제어 비서', url: 'https://github.com/kairess' },
    { id: 54, cat: '국내 유튜버/개발자 (8)', name: '나도코딩', org: 'YouTube Creator', desc: '파이썬 업무 자동화(이메일·파일 정리·엑셀 취합·일정 브리핑) 비서 봇', url: 'https://www.youtube.com/@nadocoding' },
    { id: 55, cat: '국내 유튜버/개발자 (8)', name: '개발하는 정대리', org: 'YouTube Creator', desc: '음성 API와 웹 크롤러 연동 아침 브리핑 및 뉴스 음성 보고 파이프라인', url: 'https://www.youtube.com/@jungdaeri' },
    { id: 56, cat: '국내 유튜버/개발자 (8)', name: 'Toyzcool ( 한국어 자비스 )', org: 'GitHub / Creator', desc: 'ESP32-S3 마이크 + faster-whisper + Edge-TTS 결합 한국어 자비스 오픈소스', url: 'https://github.com/Toyzcool/Jarvis-AI-Voice-Assistant' },
    { id: 57, cat: '국내 유튜버/개발자 (8)', name: '안될공학', org: 'YouTube Creator', desc: '멀티모달 AI, Agentic Workflow, 로보틱스 결합형 자비스 기술 동향 분석', url: 'https://www.youtube.com/@Unrealengineering' },
    { id: 58, cat: '국내 유튜버/개발자 (8)', name: '잇섭 (ITSub) 자비스 하우스', org: 'YouTube Creator', desc: 'Aqara, 필립스 휴, SmartThings 결합 모션·음성 감지 스마트홈 오토메이션', url: 'https://www.youtube.com/@ITSub' },
    { id: 59, cat: '국내 유튜버/개발자 (8)', name: '주연 (Jooyeon) 홈킷 스튜디오', org: 'YouTube Creator', desc: 'Apple HomeKit 기반 스마트 블라인드·조명·조도 센서 연동 스튜디오', url: 'https://www.youtube.com/@jooyeon' }
  ],

  // Eye-Gaze + Hand-Finger Dual Spatial State
  gazeEnabled: true,
  dwellClickEnabled: true,
  gazeX: window.innerWidth / 2,
  gazeY: window.innerHeight / 2,
  rawGazeX: 0.5,
  rawGazeY: 0.5,
  neutralGazeX: 0.5,
  neutralGazeY: 0.5,
  gazeGainX: 3.4,
  gazeGainY: 3.0,
  gazeTargetEl: null,
  dwellStartTime: 0,
  dwellTargetEl: null,
  blinkStartTime: 0,
  faceMeshInstance: null,
  latestFaceLandmarks: null,
  latestHandLandmarks: null,
  currentHandPose: 'NONE',
  lastActionTime: 0,
  widgetMinimized: false,

  init() {
    this.injectGestureOverlayDOM();
    // Global keyboard shortcut: 'C' (when not typing in an input) calibrates eye gaze center!
    window.addEventListener('keydown', (e) => {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;
      if (e.key === 'c' || e.key === 'C') {
        if (this.gestureEnabled) {
          this.calibrateEyeGazeCenter();
        }
      }
    });
  },

  injectGestureOverlayDOM() {
    if (document.getElementById('jarvis-spatial-gesture-bar')) return;

    // 1. Cursor #1: 👁️ Eye-Gaze Reticle Cursor (눈동자 방향 추적 마우스 커서 + 응시 게이지)
    const gazeCursor = document.createElement('div');
    gazeCursor.id = 'jarvis-eye-gaze-cursor';
    gazeCursor.style.cssText = `
      position: fixed;
      left: 50%;
      top: 50%;
      width: 44px;
      height: 44px;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 99998;
      display: none;
      align-items: center;
      justify-content: center;
      transition: width 0.1s, height 0.1s;
    `;
    gazeCursor.innerHTML = `
      <svg width="44" height="44" viewBox="0 0 44 44" style="position:absolute;inset:0;transform:rotate(-90deg);">
        <circle cx="22" cy="22" r="18" fill="rgba(0, 240, 255, 0.08)" stroke="rgba(0, 240, 255, 0.75)" stroke-width="2" stroke-dasharray="4 3" />
        <circle id="jarvis-gaze-dwell-ring" cx="22" cy="22" r="18" fill="none" stroke="#34d399" stroke-width="3.2" stroke-dasharray="113.1" stroke-dashoffset="113.1" stroke-linecap="round" />
      </svg>
      <div style="width:8px;height:8px;border-radius:50%;background:#00f0ff;box-shadow:0 0 10px #00f0ff;"></div>
      <div id="jarvis-eye-gaze-label" style="
        position:absolute;top:46px;left:50%;transform:translateX(-50%);
        background:rgba(4, 12, 26, 0.92);border:1px solid rgba(0, 240, 255, 0.55);
        color:#67e8f9;font-size:10.5px;font-weight:800;
        padding:2px 8px;border-radius:999px;white-space:nowrap;
        box-shadow:0 4px 12px rgba(0,0,0,0.45);
      ">👁️ 눈동자 시선 커서</div>
    `;
    document.body.appendChild(gazeCursor);

    // 2. Cursor #2: ☝️ Finger & Hand Gesture Cursor (손가락·손동작 커서)
    const cursor = document.createElement('div');
    cursor.id = 'jarvis-spatial-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 36px;
      height: 36px;
      border: 2.5px solid #fbbf24;
      background: rgba(251, 191, 36, 0.16);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 18px rgba(251, 191, 36, 0.45);
      transition: width 0.1s, height 0.1s, background 0.1s, border-color 0.1s;
    `;
    cursor.innerHTML = `
      <div style="width:7px;height:7px;background:#fbbf24;border-radius:50%;"></div>
      <div id="jarvis-spatial-cursor-label" style="
        position:absolute;bottom:40px;left:50%;transform:translateX(-50%);
        background:rgba(15, 23, 42, 0.94);border:1px solid #fbbf24;color:#fde68a;font-size:10.5px;font-weight:800;
        padding:2px 8px;border-radius:999px;white-space:nowrap;
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
      ">☝️ 손가락 커서</div>
    `;
    document.body.appendChild(cursor);

    // 3. Compact Dark-Glass Camera Eye + Hand HUD Widget (Bottom-Right, Collapsible & Closable)
    const pip = document.createElement('div');
    pip.id = 'jarvis-spatial-gesture-bar';
    pip.style.cssText = `
      position: fixed;
      bottom: 58px;
      right: 16px;
      width: 286px;
      background: rgba(6, 12, 24, 0.94);
      border: 1.5px solid rgba(0, 240, 255, 0.45);
      border-radius: 16px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65);
      z-index: 9600;
      display: none;
      overflow: hidden;
      backdrop-filter: blur(18px);
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #f8fafc;
    `;
    pip.innerHTML = `
      <div style="padding:8px 12px;background:rgba(15,23,42,0.9);border-bottom:1px solid rgba(56,189,248,0.22);display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:11.5px;font-weight:800;color:#38bdf8;display:flex;align-items:center;gap:6px;">
          <span>👁️☝️ 눈동자·손가락 공간 커서</span>
          <span id="jcam-status-chip" style="font-size:9.5px;padding:1px 6px;border-radius:999px;background:rgba(16,185,129,0.2);border:1px solid #34d399;color:#6ee7b7;font-weight:800;">LIVE</span>
        </div>
        <div style="display:flex;gap:4px;">
          <button type="button" id="jcam-min-btn" title="카메라 창 작게 접기/펼치기" style="background:rgba(30,41,59,0.8);border:1px solid rgba(148,163,184,0.3);border-radius:6px;width:22px;height:22px;color:#e2e8f0;cursor:pointer;font-size:12px;font-weight:800;">−</button>
          <button type="button" id="jcam-close-btn" title="카메라·시선 커서 끄기" style="background:rgba(127,29,29,0.45);border:1px solid rgba(248,113,113,0.5);border-radius:6px;width:22px;height:22px;color:#fecdd3;cursor:pointer;font-size:12px;font-weight:800;">✕</button>
        </div>
      </div>

      <div id="jcam-body-wrap" style="padding:8px 10px;display:flex;flex-direction:column;gap:6px;">
        <!-- Live Camera Canvas with Eye Iris Rings + 21-Joint Hand Skeleton -->
        <div style="position:relative;width:100%;height:142px;background:#020617;border:1px solid rgba(56,189,248,0.28);border-radius:10px;overflow:hidden;">
          <video id="jcam-video" playsinline muted autoplay style="display:none;"></video>
          <canvas id="jcam-canvas" width="264" height="142" style="width:100%;height:142px;display:block;"></canvas>
          <div id="jcam-live-overlay-badge" style="position:absolute;left:6px;bottom:6px;right:6px;background:rgba(2,6,23,0.82);border:1px solid rgba(0,240,255,0.3);border-radius:6px;padding:3px 7px;font-size:10px;color:#e2e8f0;display:flex;justify-content:space-between;align-items:center;">
            <span id="jcam-pose-readout">👁️ 시선 추적 중 · 🤏 핀치=클릭</span>
            <span style="color:#34d399;font-weight:800;">✊주먹=창닫기</span>
          </div>
        </div>

        <!-- 4 Status Pills -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:10px;font-weight:700;">
          <div id="jpill-recognize" style="padding:4px 6px;border-radius:6px;border:1px solid #00f0ff;background:rgba(0,240,255,0.16);color:#67e8f9;">👁️ 1. 눈동자 시선조준</div>
          <div id="jpill-click" style="padding:4px 6px;border-radius:6px;border:1px solid rgba(148,163,184,0.22);background:rgba(15,23,42,0.6);color:#94a3b8;">🤏 2. 핀치/응시 클릭</div>
          <div id="jpill-drag" style="padding:4px 6px;border-radius:6px;border:1px solid rgba(148,163,184,0.22);background:rgba(15,23,42,0.6);color:#94a3b8;">✊ 3. 주먹/눈감기=창닫기</div>
          <div id="jpill-rotate" style="padding:4px 6px;border-radius:6px;border:1px solid rgba(148,163,184,0.22);background:rgba(15,23,42,0.6);color:#94a3b8;">✋ 4. 손바닥 3D회전</div>
        </div>

        <!-- Quick Controls: Calibrate Gaze Center / Dwell Toggle / Clean All Windows -->
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          <button type="button" id="jcam-btn-calibrate" title="화면 정중앙을 보면서 누르면 내 눈동자 위치가 정중앙으로 영점 조절됩니다 (단축키: C)" style="flex:1;padding:5px 6px;border-radius:7px;border:1px solid #00f0ff;background:rgba(0,240,255,0.15);color:#67e8f9;font-size:10.5px;font-weight:800;cursor:pointer;">🎯 시선 영점(C)</button>
          <button type="button" id="jcam-btn-dwell" title="눈동자로 버튼을 1.3초 바라보면 손 안 쓰고 자동 클릭" style="flex:1;padding:5px 6px;border-radius:7px;border:1px solid #34d399;background:rgba(16,185,129,0.18);color:#6ee7b7;font-size:10.5px;font-weight:800;cursor:pointer;">👁️ 응시클릭 ON</button>
          <button type="button" id="jcam-btn-clean-ui" title="열려 있는 모든 창 즉시 닫기" style="padding:5px 8px;border-radius:7px;border:1px solid #f87171;background:rgba(127,29,29,0.35);color:#fecdd3;font-size:10.5px;font-weight:800;cursor:pointer;">🧹 창닫기</button>
        </div>

        <div style="display:flex;gap:4px;">
          <button type="button" id="jcam-btn-webcam" style="flex:1;padding:5px 8px;border-radius:7px;border:1px solid #38bdf8;background:#0284c7;color:#ffffff;font-size:10.5px;font-weight:800;cursor:pointer;">🎥 실시간 웹캠 재연결</button>
          <button type="button" id="jcam-btn-sim" style="padding:5px 8px;border-radius:7px;border:1px solid rgba(148,163,184,0.3);background:rgba(30,41,59,0.7);color:#cbd5e1;font-size:10.5px;font-weight:700;cursor:pointer;">시뮬레이션</button>
        </div>
      </div>
    `;
    document.body.appendChild(pip);

    document.getElementById('jcam-close-btn')?.addEventListener('click', () => this.toggleGestureWidget(false));
    document.getElementById('jcam-min-btn')?.addEventListener('click', (e) => {
      const body = document.getElementById('jcam-body-wrap');
      if (!body) return;
      this.widgetMinimized = !this.widgetMinimized;
      body.style.display = this.widgetMinimized ? 'none' : 'flex';
      e.currentTarget.textContent = this.widgetMinimized ? '+' : '−';
    });
    document.getElementById('jcam-btn-calibrate')?.addEventListener('click', () => this.calibrateEyeGazeCenter());
    document.getElementById('jcam-btn-dwell')?.addEventListener('click', (e) => {
      this.dwellClickEnabled = !this.dwellClickEnabled;
      e.currentTarget.textContent = this.dwellClickEnabled ? '👁️ 응시클릭 ON' : '👁️ 응시클릭 OFF';
      e.currentTarget.style.borderColor = this.dwellClickEnabled ? '#34d399' : '#64748b';
      e.currentTarget.style.color = this.dwellClickEnabled ? '#6ee7b7' : '#94a3b8';
    });
    document.getElementById('jcam-btn-clean-ui')?.addEventListener('click', () => {
      window.BSC_CloseAllFloatingUI?.({ keepCameraWidget: true, stopSpeech: true });
    });
    document.getElementById('jcam-btn-webcam')?.addEventListener('click', () => this.toggleRealWebcam(true));
    document.getElementById('jcam-btn-sim')?.addEventListener('click', () => this.toggleSimulatedHand());
  },

  calibrateEyeGazeCenter() {
    this.neutralGazeX = this.rawGazeX || 0.5;
    this.neutralGazeY = this.rawGazeY || 0.5;
    this.gazeX = window.innerWidth / 2;
    this.gazeY = window.innerHeight / 2;
    const readout = document.getElementById('jcam-pose-readout');
    if (readout) {
      readout.textContent = '🎯 눈동자 시선 정중앙 영점 완료!';
    }
    if (window.SasariSaMainOS) {
      window.SasariSaMainOS.setHudCard(
        'lime',
        '🎯 눈동자 시선 커서 영점(Calibration) 완료',
        '시선 마우스 커서 영점 맞춤',
        '현재 대표님이 바라보시는 정면 위치를 화면 정중앙(0, 0) 기준으로 맞췄습니다. 눈으로 버튼을 보면서 손가락 핀치(🤏)나 1.3초 응시로 클릭하세요.'
      );
    }
  },

  toggleGestureWidget(forceState) {
    this.injectGestureOverlayDOM();
    const pip = document.getElementById('jarvis-spatial-gesture-bar');
    const cursor = document.getElementById('jarvis-spatial-cursor');
    const gazeCursor = document.getElementById('jarvis-eye-gaze-cursor');
    if (!pip) return;
    this.gestureEnabled = typeof forceState === 'boolean' ? forceState : pip.style.display === 'none';
    pip.style.display = this.gestureEnabled ? 'block' : 'none';
    if (cursor) cursor.style.display = this.gestureEnabled ? 'flex' : 'none';
    if (gazeCursor) gazeCursor.style.display = this.gestureEnabled ? 'flex' : 'none';

    // Hide duplicate legacy webcam overlays so only one clean camera widget is shown
    const legacyHoloPanel = document.getElementById('holo-gesture-hud-panel');
    if (legacyHoloPanel) legacyHoloPanel.style.display = 'none';
    const rawWebcam = document.getElementById('webcam-video');
    if (rawWebcam) rawWebcam.style.display = 'none';

    if (this.gestureEnabled) {
      this.toggleRealWebcam(true);
    } else {
      this.stopAllTracking();
    }
  },

  stopAllTracking() {
    this.webcamActive = false;
    this.simHandActive = false;
    if (this.mpCamera && this.mpCamera.stop) {
      try { this.mpCamera.stop(); } catch (_) {}
    }
    if (this.webcamStream) {
      const stageCam = document.getElementById('cam');
      if (!stageCam || stageCam.srcObject !== this.webcamStream) {
        try { this.webcamStream.getTracks().forEach(t => t.stop()); } catch (_) {}
      }
      this.webcamStream = null;
    }
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
    const cursor = document.getElementById('jarvis-spatial-cursor');
    const gazeCursor = document.getElementById('jarvis-eye-gaze-cursor');
    if (cursor) cursor.style.display = 'none';
    if (gazeCursor) gazeCursor.style.display = 'none';
    if (this.lastHoveredEl) {
      this.lastHoveredEl.style.outline = '';
      this.lastHoveredEl.style.boxShadow = '';
      this.lastHoveredEl = null;
    }
  },

  setActivePill(pillId) {
    ['jpill-recognize', 'jpill-click', 'jpill-drag', 'jpill-rotate'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === pillId) {
        el.style.background = 'rgba(0, 240, 255, 0.22)';
        el.style.color = '#67e8f9';
        el.style.borderColor = '#00f0ff';
      } else {
        el.style.background = 'rgba(15, 23, 42, 0.6)';
        el.style.color = '#94a3b8';
        el.style.borderColor = 'rgba(148, 163, 184, 0.22)';
      }
    });
  },

  /**
   * Find the nearest interactive UI button within `snapRadius` (Magnetic Snap for Eye Gaze!)
   */
  fireSpatialTap(targetEl) {
    if (!targetEl) return;
    const r = targetEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    try {
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx, clientY: cy, bubbles: true }));
      window.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, button: 0, bubbles: true }));
      setTimeout(() => {
        window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx, clientY: cy, button: 0, bubbles: true }));
      }, 55);
    } catch (_) {}
    try { targetEl.click(); } catch (_) {}
  },

  findNearestInteractiveElement(x, y, snapRadius = 54) {
    const direct = document.elementFromPoint(x, y);
    const selector = 'button, a, .card.orb, .card, .panel .bar, .brow, .slim-dock-btn, .win-ctrl-btn, .stm-action-btn, .hud-inline-pill, .cbb-orb-pill, .smg-scene-btn, .view-pill';
    if (direct) {
      const hit = direct.closest(selector);
      if (hit && hit.offsetParent !== null) return hit;
    }
    // Check magnetic snap radius around gaze point so eye jitter never misses a button
    const candidates = document.querySelectorAll(selector);
    let bestEl = null;
    let bestDist = snapRadius;
    for (const el of candidates) {
      if (el.offsetParent === null) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(cx - x, cy - y);
      if (d < bestDist) {
        bestDist = d;
        bestEl = el;
      }
    }
    return bestEl;
  },

  /**
   * Update 👁️ Eye-Gaze Cursor position, Magnetic Snap, and 1.3s Dwell Auto-Click
   */
  updateEyeGazePoint(targetX, targetY, eyesClosed = false) {
    const gazeCursor = document.getElementById('jarvis-eye-gaze-cursor');
    const gazeLabel = document.getElementById('jarvis-eye-gaze-label');
    const dwellRing = document.getElementById('jarvis-gaze-dwell-ring');
    if (!gazeCursor || !this.gestureEnabled) return;

    // Smooth eye movement (exponential low-pass filter to remove saccade jitter)
    this.gazeX += (targetX - this.gazeX) * 0.22;
    this.gazeY += (targetY - this.gazeY) * 0.22;
    this.gazeX = Math.max(16, Math.min(window.innerWidth - 16, this.gazeX));
    this.gazeY = Math.max(16, Math.min(window.innerHeight - 16, this.gazeY));

    // Check Long-Blink (0.65s both eyes closed) -> Clean/Close all floating UI windows!
    const now = Date.now();
    if (eyesClosed) {
      if (!this.blinkStartTime) {
        this.blinkStartTime = now;
      } else if (now - this.blinkStartTime > 650 && now - this.lastActionTime > 1800) {
        this.lastActionTime = now;
        this.blinkStartTime = 0;
        window.BSC_CloseAllFloatingUI?.({ keepCameraWidget: true, stopSpeech: true });
        if (gazeLabel) gazeLabel.textContent = '😌 눈감기 인식 -> 모든 창 닫기!';
        return;
      }
    } else {
      this.blinkStartTime = 0;
    }

    // Magnetic Snap to nearby button
    const snappedBtn = this.findNearestInteractiveElement(this.gazeX, this.gazeY, 52);
    let drawX = this.gazeX;
    let drawY = this.gazeY;

    if (this.lastHoveredEl && this.lastHoveredEl !== snappedBtn) {
      this.lastHoveredEl.style.outline = '';
      this.lastHoveredEl.style.boxShadow = '';
    }

    if (snappedBtn) {
      const rect = snappedBtn.getBoundingClientRect();
      drawX = this.gazeX * 0.35 + (rect.left + rect.width / 2) * 0.65;
      drawY = this.gazeY * 0.35 + (rect.top + rect.height / 2) * 0.65;
      snappedBtn.style.outline = '2px solid #00f0ff';
      snappedBtn.style.boxShadow = '0 0 16px rgba(0, 240, 255, 0.55)';
      this.lastHoveredEl = snappedBtn;
      this.gazeTargetEl = snappedBtn;

      const btnTitle = (snappedBtn.textContent || snappedBtn.title || '버튼').trim().slice(0, 14);
      if (gazeLabel) gazeLabel.textContent = `👁️ 시선조준 [${btnTitle}] (🤏핀치/응시)`;

      // Dwell Auto-Click (1.3s continuous gaze on the same button)
      if (this.dwellClickEnabled) {
        if (this.dwellTargetEl !== snappedBtn) {
          this.dwellTargetEl = snappedBtn;
          this.dwellStartTime = now;
        } else {
          const elapsed = now - this.dwellStartTime;
          const progress = Math.min(1, elapsed / 1300);
          if (dwellRing) {
            dwellRing.style.strokeDashoffset = String(113.1 * (1 - progress));
          }
          if (elapsed >= 1300 && now - this.lastActionTime > 1400) {
            this.lastActionTime = now;
            this.dwellStartTime = now + 800;
            if (dwellRing) dwellRing.style.strokeDashoffset = '113.1';
            this.setActivePill('jpill-click');
            if (gazeLabel) gazeLabel.textContent = `✓ 시선 응시 클릭! [${btnTitle}]`;
            snappedBtn.click();
          }
        }
      }
    } else {
      this.gazeTargetEl = null;
      this.dwellTargetEl = null;
      if (dwellRing) dwellRing.style.strokeDashoffset = '113.1';
      if (gazeLabel) gazeLabel.textContent = '👁️ 눈동자 시선 커서';
      // Also hover 3D Neuron node under eye gaze
      if (window.BrainGraphEngine && typeof window.BrainGraphEngine.findNodeAt === 'function') {
        const hitNode = window.BrainGraphEngine.findNodeAt(drawX, drawY);
        if (hitNode && gazeLabel) {
          gazeLabel.textContent = `👁️ 뉴런 [${String(hitNode.label || hitNode.id).slice(0, 14)}] (🤏핀치=열기)`;
          this.gazeTargetNode = hitNode;
        } else {
          this.gazeTargetNode = null;
        }
      }
    }

    gazeCursor.style.display = 'flex';
    gazeCursor.style.left = `${drawX}px`;
    gazeCursor.style.top = `${drawY}px`;
  },

  /**
   * Update ☝️ Hand/Finger Cursor + Execute Combined Eye-Gaze + Finger Actions!
   */
  updateSpatialPoint(x, y, pinching, rotating, handPose = 'POINT') {
    this.pointerX += (x - this.pointerX) * 0.35;
    this.pointerY += (y - this.pointerY) * 0.35;
    const fx = this.pointerX;
    const fy = this.pointerY;

    const cursor = document.getElementById('jarvis-spatial-cursor');
    const label = document.getElementById('jarvis-spatial-cursor-label');
    const readout = document.getElementById('jcam-pose-readout');

    if (cursor && this.gestureEnabled) {
      cursor.style.display = 'flex';
      cursor.style.left = `${fx}px`;
      cursor.style.top = `${fy}px`;
      cursor.style.width = pinching ? '24px' : '36px';
      cursor.style.height = pinching ? '24px' : '36px';
      cursor.style.borderColor = handPose === 'FIST' ? '#f87171' : (pinching ? '#34d399' : '#fbbf24');
    }

    const now = Date.now();

    // 1. ✊ FIST Gesture -> Close ALL Open Windows & Popups Immediately!
    if (handPose === 'FIST') {
      this.setActivePill('jpill-drag');
      if (label) label.textContent = '✊ 주먹 [모든 창 닫기]';
      if (readout) readout.textContent = '✊ 주먹 감지 -> 열린 창 모두 닫기!';
      if (now - this.lastActionTime > 1400) {
        this.lastActionTime = now;
        window.BSC_CloseAllFloatingUI?.({ keepCameraWidget: true, stopSpeech: true });
        if (window.SasariSaMainOS) {
          window.SasariSaMainOS.setHudCard('lime', '🧹 손동작(✊ 주먹)으로 모든 창 닫기 완료', '주먹 제스처 인식', '화면을 가리던 팝업과 서브 창을 모두 닫았습니다.');
        }
      }
      return;
    }

    // 2. 👍 THUMBS UP -> Approve Confirmation ([응]) Immediately!
    if (handPose === 'THUMBS_UP' && now - this.lastActionTime > 2000) {
      this.lastActionTime = now;
      if (label) label.textContent = '👍 엄지척 [즉시 승인]';
      const yesBtn = document.querySelector('.pillui-yes, #btn-approve-pc');
      if (yesBtn) yesBtn.click();
      return;
    }

    // 3. ✋ PALM 3D Rotate Mode
    if (rotating) {
      this.setActivePill('jpill-rotate');
      if (label) label.textContent = '✋ 손바닥 [3D 은하 회전]';
      if (readout) readout.textContent = '✋ 손바닥 이동 -> 3D 뉴런 은하 회전';
      if (window.BrainGraphEngine) {
        window.BrainGraphEngine.rotY += ((fx / window.innerWidth) - 0.5) * 0.04;
      }
      return;
    }

    // 4. 🤏 PINCH CLICK (Vision Pro Style: Clicks Eye-Gaze Target first, or Finger Target!)
    const fingerTarget = this.findNearestInteractiveElement(fx, fy, 42);
    const activeTarget = this.gazeTargetEl || fingerTarget;

    if (pinching && !this.wasPinching && now - this.lastActionTime > 450) {
      this.lastActionTime = now;
      this.setActivePill('jpill-click');
      if (label) label.textContent = '🤏 핀치 클릭!';
      if (readout) readout.textContent = '🤏 핀치 클릭 실행!';

      if (activeTarget) {
        this.fireSpatialTap(activeTarget);
      } else if (this.gazeTargetNode && window.BrainGraphEngine) {
        window.BrainGraphEngine.selectNode(this.gazeTargetNode, true);
      } else if (window.BrainGraphEngine && typeof window.BrainGraphEngine.findNodeAt === 'function') {
        const nodeAtFinger = window.BrainGraphEngine.findNodeAt(fx, fy);
        if (nodeAtFinger) window.BrainGraphEngine.selectNode(nodeAtFinger, true);
      }
    } else if (!pinching) {
      this.setActivePill('jpill-recognize');
      if (label) {
        const tName = activeTarget ? (activeTarget.textContent || activeTarget.title || '').trim().slice(0, 12) : '';
        label.textContent = tName ? `☝️ [${tName}] (🤏핀치)` : '☝️ 손가락 커서 (🤏핀치=클릭 / ✊주먹=닫기)';
      }
    }

    this.wasPinching = pinching;
  },

  drawHandSkeletonOnCanvas(normX, normY, pinch, rotate) {
    const canvas = document.getElementById('jcam-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < canvas.width; gx += 32) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
    }
    for (let gy = 0; gy < canvas.height; gy += 32) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
    }

    // Simulated Eye Gaze Reticle in top half
    const ex = normX * (canvas.width - 60) + 30;
    const ey = normY * (canvas.height - 50) + 25;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ex, ey, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Simulated Hand in bottom half
    const hx = normX * 180 + 40;
    const hy = normY * 70 + 45;
    ctx.strokeStyle = rotate ? '#fbbf24' : (pinch ? '#34d399' : '#38bdf8');
    ctx.lineWidth = 2.2;

    const fingers = [
      [hx - 20, hy - 8],
      [hx - 8, pinch ? hy - 10 : hy - 32],
      [hx + 4, hy - 36],
      [hx + 15, hy - 30],
      [hx + 24, rotate ? hy + 4 : hy - 20]
    ];

    fingers.forEach((f, idx) => {
      ctx.beginPath();
      ctx.moveTo(hx, hy + 20);
      ctx.lineTo(f[0], f[1]);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(f[0], f[1], idx <= 1 ? 4 : 3, 0, Math.PI * 2);
      ctx.fillStyle = idx <= 1 ? '#fbbf24' : '#38bdf8';
      ctx.fill();
    });
  },

  toggleSimulatedHand(forceOn) {
    this.simHandActive = typeof forceOn === 'boolean' ? forceOn : !this.simHandActive;
    const chip = document.getElementById('jcam-status-chip');
    if (chip) chip.textContent = this.simHandActive ? 'SIM MODE' : 'STANDBY';

    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }

    if (this.simHandActive) {
      this.simTick = 0;
      this.simTimer = setInterval(() => {
        if (!this.simHandActive) return;
        this.simTick += 0.03;
        const phase = Math.floor(this.simTick % 12);
        const nx = 0.5 + 0.28 * Math.sin(this.simTick);
        const ny = 0.45 + 0.22 * Math.cos(this.simTick * 0.85);
        const sx = nx * window.innerWidth;
        const sy = ny * window.innerHeight;
        const pinch = phase === 4;
        const rot = phase >= 9 && phase <= 10;

        this.drawHandSkeletonOnCanvas(nx, ny, pinch, rot);
        this.updateEyeGazePoint(sx, sy, false);
        this.updateSpatialPoint(sx, sy, pinch, rot, 'POINT');
      }, 40);
    }
  },

  /**
   * Real Webcam Dual Tracker:
   *  1) Eye-Gaze Iris + Head Pose Tracker (MediaPipe FaceMesh 478 Landmarks + Optical Eye ROI Fallback)
   *  2) Hand 21-Joint Finger & Gesture Tracker (MediaPipe Hands)
   */
  async toggleRealWebcam(forceStart = false) {
    if (this.webcamActive && !forceStart) {
      this.stopAllTracking();
      const chip = document.getElementById('jcam-status-chip');
      if (chip) chip.textContent = 'OFF';
      return;
    }

    const chip = document.getElementById('jcam-status-chip');
    const readout = document.getElementById('jcam-pose-readout');
    const videoEl = document.getElementById('jcam-video');
    const canvas = document.getElementById('jcam-canvas');
    if (!videoEl || !canvas) return;
    const ctx = canvas.getContext('2d');

    try {
      if (chip) chip.textContent = 'CAM INIT...';

      // Reuse existing stream from #webcam-video if already open, or request getUserMedia
      const existingVid = document.getElementById('cam') || document.getElementById('webcam-video');
      if (existingVid && existingVid.srcObject && existingVid.srcObject.active) {
        this.webcamStream = existingVid.srcObject;
        existingVid.style.display = 'none'; // Hide duplicate raw video element
      } else if (!this.webcamStream || !this.webcamStream.active) {
        this.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false
        });
      }

      videoEl.srcObject = this.webcamStream;
      await videoEl.play().catch(() => {});
      this.webcamActive = true;
      this.simHandActive = false;
      if (this.simTimer) clearInterval(this.simTimer);
      if (chip) chip.textContent = '👁️+☝️ LIVE';

      // 1. Initialize MediaPipe Hands (21 Joints)
      if (!this.handsInstance && typeof window.Hands === 'function') {
        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6
        });
        hands.onResults((results) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            this.latestHandLandmarks = results.multiHandLandmarks[0];
          } else {
            this.latestHandLandmarks = null;
          }
        });
        this.handsInstance = hands;
      }

      // 2. Initialize MediaPipe FaceMesh with Refined Iris Landmarks (#468..#477)
      if (!this.faceMeshInstance && typeof window.FaceMesh === 'function') {
        try {
          const fm = new window.FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
          });
          fm.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true, // Enables 10 Iris landmarks (468-477)
            minDetectionConfidence: 0.55,
            minTrackingConfidence: 0.55
          });
          fm.onResults((results) => {
            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
              this.latestFaceLandmarks = results.multiFaceLandmarks[0];
            } else {
              this.latestFaceLandmarks = null;
            }
          });
          this.faceMeshInstance = fm;
        } catch (_) {}
      }

      // 3. Offscreen optical canvas for instant zero-lag pupil/head fallback tracking
      const optCvs = document.createElement('canvas');
      optCvs.width = 64;
      optCvs.height = 48;
      const optCtx = optCvs.getContext('2d', { willReadFrequently: true });
      let frameToggle = 0;
      let busySending = false;

      const processLoop = async () => {
        if (!this.webcamActive || !this.gestureEnabled) return;

        if (videoEl.readyState >= 2) {
          // Draw mirrored camera feed into mini HUD canvas
          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Alternate sending frames to FaceMesh and Hands so both run smoothly at high FPS
          if (!busySending) {
            busySending = true;
            frameToggle = (frameToggle + 1) % 2;
            try {
              if (frameToggle === 0 && this.faceMeshInstance) {
                await this.faceMeshInstance.send({ image: videoEl });
              } else if (this.handsInstance) {
                await this.handsInstance.send({ image: videoEl });
              }
            } catch (_) {}
            busySending = false;
          }

          // --- A. Process 👁️ Eye-Gaze Iris Landmarks (or Optical Pupil/Face ROI Fallback) ---
          if (this.latestFaceLandmarks && this.latestFaceLandmarks.length >= 468) {
            const flm = this.latestFaceLandmarks;
            // Left Iris center = 468 (or average of 468..472), Right Iris center = 473
            const leftIris = flm[468] || flm[159];
            const rightIris = flm[473] || flm[386];
            const noseTip = flm[1];

            // Eye corners for relative iris position inside eye socket
            const lInner = flm[133], lOuter = flm[33];
            const rInner = flm[362], rOuter = flm[263];

            const lRatioX = (lInner && lOuter && Math.abs(lInner.x - lOuter.x) > 0.005)
              ? (leftIris.x - lOuter.x) / (lInner.x - lOuter.x)
              : 0.5;
            const rRatioX = (rInner && rOuter && Math.abs(rOuter.x - rInner.x) > 0.005)
              ? (rightIris.x - rInner.x) / (rOuter.x - rInner.x)
              : 0.5;
            const irisRelX = (lRatioX + rRatioX) * 0.5; // ~0.5 when looking straight

            // Combine head pose (nose & eye midpoint) + iris socket ratio for natural full-screen gaze!
            const headMirroredX = 1 - ((leftIris.x + rightIris.x) * 0.5 * 0.6 + noseTip.x * 0.4);
            const headY = ((leftIris.y + rightIris.y) * 0.5 * 0.7 + noseTip.y * 0.3);

            const combinedGazeX = headMirroredX + (0.5 - irisRelX) * 0.35;
            const combinedGazeY = headY;

            this.rawGazeX = combinedGazeX;
            this.rawGazeY = combinedGazeY;

            const screenGX = (0.5 + (combinedGazeX - this.neutralGazeX) * this.gazeGainX) * window.innerWidth;
            const screenGY = (0.5 + (combinedGazeY - this.neutralGazeY) * this.gazeGainY) * window.innerHeight;

            // Blink detection via Eye Aspect Ratio (upper vs lower eyelid distance)
            const lEyeOpen = Math.hypot(flm[159].x - flm[145].x, flm[159].y - flm[145].y);
            const rEyeOpen = Math.hypot(flm[386].x - flm[374].x, flm[386].y - flm[374].y);
            const eyesClosed = (lEyeOpen + rEyeOpen) * 0.5 < 0.011;

            this.updateEyeGazePoint(screenGX, screenGY, eyesClosed);

            // Draw glowing cyan Iris tracking rings on the mini camera canvas
            [leftIris, rightIris].forEach(pt => {
              const cx = (1 - pt.x) * canvas.width;
              const cy = pt.y * canvas.height;
              ctx.strokeStyle = '#00f0ff';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(cx, cy, 6, 0, Math.PI * 2);
              ctx.stroke();
              ctx.fillStyle = '#34d399';
              ctx.beginPath();
              ctx.arc(cx, cy, 2, 0, Math.PI * 2);
              ctx.fill();
            });
          } else {
            // Instant Optical Dark-Pupil / Face Center-of-Mass Fallback when FaceMesh is still loading
            optCtx.drawImage(videoEl, 0, 0, optCvs.width, optCvs.height);
            const img = optCtx.getImageData(0, 0, optCvs.width, optCvs.height).data;
            let sumX = 0, sumY = 0, weightSum = 0;
            // Scan upper-middle region where face/eyes are located
            for (let y = 6; y < 38; y++) {
              for (let x = 12; x < 52; x++) {
                const idx = (y * optCvs.width + x) * 4;
                const luma = img[idx] * 0.299 + img[idx + 1] * 0.587 + img[idx + 2] * 0.114;
                // Weight dark pupil/eyebrow features inside bright face region
                if (luma > 15 && luma < 95) {
                  const w = (100 - luma);
                  sumX += (optCvs.width - 1 - x) * w;
                  sumY += y * w;
                  weightSum += w;
                }
              }
            }
            if (weightSum > 0) {
              const normX = (sumX / weightSum) / optCvs.width;
              const normY = (sumY / weightSum) / optCvs.height;
              this.rawGazeX = normX;
              this.rawGazeY = normY;
              const screenGX = (0.5 + (normX - this.neutralGazeX) * 2.8) * window.innerWidth;
              const screenGY = (0.5 + (normY - this.neutralGazeY) * 2.5) * window.innerHeight;
              this.updateEyeGazePoint(screenGX, screenGY, false);
            }
          }

          // --- B. Process ☝️ Hand 21-Joint Landmarks ---
          if (this.latestHandLandmarks && this.latestHandLandmarks.length === 21) {
            const lm = this.latestHandLandmarks;
            // Draw 21-joint hand skeleton on mini canvas
            const bones = [
              [0,1],[1,2],[2,3],[3,4],
              [0,5],[5,6],[6,7],[7,8],
              [0,9],[9,10],[10,11],[11,12],
              [0,13],[13,14],[14,15],[15,16],
              [0,17],[17,18],[18,19],[19,20]
            ];
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.8;
            for (const [a, b] of bones) {
              ctx.beginPath();
              ctx.moveTo((1 - lm[a].x) * canvas.width, lm[a].y * canvas.height);
              ctx.lineTo((1 - lm[b].x) * canvas.width, lm[b].y * canvas.height);
              ctx.stroke();
            }
            for (let i = 0; i < 21; i++) {
              ctx.fillStyle = (i === 4 || i === 8) ? '#34d399' : '#fde68a';
              ctx.beginPath();
              ctx.arc((1 - lm[i].x) * canvas.width, lm[i].y * canvas.height, (i === 4 || i === 8) ? 4 : 2.2, 0, Math.PI * 2);
              ctx.fill();
            }

            const indexTip = lm[8];
            const thumbTip = lm[4];
            const screenX = (1 - indexTip.x) * window.innerWidth;
            const screenY = indexTip.y * window.innerHeight;
            const pinchDist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
            const pinching = pinchDist < 0.058;

            const indexUp  = lm[8].y < lm[6].y;
            const middleUp = lm[12].y < lm[10].y;
            const ringUp   = lm[16].y < lm[14].y;
            const pinkyUp  = lm[20].y < lm[18].y;
            const thumbUp  = lm[4].y < lm[3].y && lm[3].y < lm[2].y && lm[4].y < lm[6].y;

            let handPose = 'POINT';
            let rotating = false;
            if (!indexUp && !middleUp && !ringUp && !pinkyUp && !pinching) {
              handPose = 'FIST';
            } else if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
              handPose = 'THUMBS_UP';
            } else if (indexUp && middleUp && ringUp && pinkyUp && !pinching) {
              handPose = 'PALM';
              rotating = true;
            }

            this.updateSpatialPoint(screenX, screenY, pinching, rotating, handPose);
          } else {
            if (readout) {
              readout.textContent = '👁️ 눈동자 시선 커서 활성 · 🤏손핀치/응시=클릭';
            }
          }
        }

        requestAnimationFrame(processLoop);
      };
      requestAnimationFrame(processLoop);
    } catch (e) {
      this.toggleSimulatedHand(true);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.JarvisCameraGestureOS.init();
});
