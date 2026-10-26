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

  init() {
    this.injectGestureOverlayDOM();
  },

  injectGestureOverlayDOM() {
    if (document.getElementById('jarvis-spatial-gesture-bar')) return;

    // 1. Spatial Cursor (Bright Minimal Monotone with Clear Status Tag)
    const cursor = document.createElement('div');
    cursor.id = 'jarvis-spatial-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 38px;
      height: 38px;
      border: 2px solid #18181b;
      background: rgba(255, 255, 255, 0.78);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
      transition: width 0.12s, height 0.12s, background 0.12s, border-color 0.12s;
    `;
    cursor.innerHTML = `
      <div style="width:7px;height:7px;background:#18181b;border-radius:50%;"></div>
      <div id="jarvis-spatial-cursor-label" style="
        position:absolute;top:42px;left:50%;transform:translateX(-50%);
        background:#18181b;color:#ffffff;font-size:10.5px;font-weight:700;
        padding:3px 9px;border-radius:6px;white-space:nowrap;
        box-shadow:0 2px 8px rgba(0,0,0,0.15);
      ">1. 인식 [HOVER]</div>
    `;
    document.body.appendChild(cursor);

    // 2. Floating Camera Gesture PIP & 4-Step Gesture Pill Bar (Bright Minimal Monotone)
    const pip = document.createElement('div');
    pip.id = 'jarvis-spatial-gesture-bar';
    pip.style.cssText = `
      position: fixed;
      bottom: 72px;
      right: 24px;
      width: 320px;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 16px;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
      z-index: 9500;
      display: none;
      overflow: hidden;
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #18181b;
    `;
    pip.innerHTML = `
      <div style="padding:10px 14px;background:#f4f5f7;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:12px;font-weight:800;color:#111827;display:flex;align-items:center;gap:6px;">
          <span>🖐️ 카메라 비전 제스처 OS</span>
          <span id="jcam-status-chip" style="font-size:10px;padding:2px 7px;border-radius:999px;background:#18181b;color:#fff;font-weight:700;">READY</span>
        </div>
        <button type="button" id="jcam-close-btn" style="background:none;border:none;font-size:14px;color:#6b7280;cursor:pointer;font-weight:700;">✕</button>
      </div>
      <div style="padding:10px 12px;display:flex;flex-direction:column;gap:8px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:11px;font-weight:600;">
          <div id="jpill-recognize" style="padding:5px 8px;border-radius:8px;border:1px solid #18181b;background:#18181b;color:#fff;">1. 인식 (검지 #8)</div>
          <div id="jpill-click" style="padding:5px 8px;border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;color:#4b5563;">2. 클릭 (핀치 #4+#8)</div>
          <div id="jpill-drag" style="padding:5px 8px;border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;color:#4b5563;">3. 이동 (핀치 드래그)</div>
          <div id="jpill-rotate" style="padding:5px 8px;border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;color:#4b5563;">4. 회전 (손바닥 3D)</div>
        </div>
        <video id="jcam-video" playsinline style="display:none;"></video>
        <canvas id="jcam-canvas" width="294" height="164" style="width:100%;height:164px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;display:block;"></canvas>
        <div style="display:flex;gap:6px;">
          <button type="button" id="jcam-btn-webcam" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid #18181b;background:#18181b;color:#ffffff;font-size:11.5px;font-weight:700;cursor:pointer;">🎥 실시간 웹캠 ON</button>
          <button type="button" id="jcam-btn-sim" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid #d1d5db;background:#ffffff;color:#111827;font-size:11.5px;font-weight:600;cursor:pointer;">🖐️ 가상 핸드 데모</button>
        </div>
      </div>
    `;
    document.body.appendChild(pip);

    document.getElementById('jcam-close-btn')?.addEventListener('click', () => this.toggleGestureWidget(false));
    document.getElementById('jcam-btn-webcam')?.addEventListener('click', () => this.toggleRealWebcam());
    document.getElementById('jcam-btn-sim')?.addEventListener('click', () => this.toggleSimulatedHand());
  },

  toggleGestureWidget(forceState) {
    this.injectGestureOverlayDOM();
    const pip = document.getElementById('jarvis-spatial-gesture-bar');
    const cursor = document.getElementById('jarvis-spatial-cursor');
    if (!pip) return;
    this.gestureEnabled = typeof forceState === 'boolean' ? forceState : pip.style.display === 'none';
    pip.style.display = this.gestureEnabled ? 'block' : 'none';
    if (cursor) cursor.style.display = this.gestureEnabled ? 'flex' : 'none';

    if (this.gestureEnabled && !this.webcamActive && !this.simHandActive) {
      this.toggleSimulatedHand(true);
    } else if (!this.gestureEnabled) {
      this.stopAllTracking();
    }
  },

  stopAllTracking() {
    this.webcamActive = false;
    this.simHandActive = false;
    if (this.mpCamera && this.mpCamera.stop) {
      try { this.mpCamera.stop(); } catch (_) {}
    }
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
    const cursor = document.getElementById('jarvis-spatial-cursor');
    if (cursor) cursor.style.display = 'none';
  },

  setActivePill(pillId) {
    ['jpill-recognize', 'jpill-click', 'jpill-drag', 'jpill-rotate'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === pillId) {
        el.style.background = '#18181b';
        el.style.color = '#ffffff';
        el.style.borderColor = '#18181b';
      } else {
        el.style.background = '#f9fafb';
        el.style.color = '#4b5563';
        el.style.borderColor = '#e5e7eb';
      }
    });
  },

  updateSpatialPoint(x, y, pinching, rotating) {
    this.pointerX = x;
    this.pointerY = y;
    const cursor = document.getElementById('jarvis-spatial-cursor');
    const label = document.getElementById('jarvis-spatial-cursor-label');
    if (cursor) {
      cursor.style.display = 'flex';
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      cursor.style.width = pinching ? '26px' : '38px';
      cursor.style.height = pinching ? '26px' : '38px';
      cursor.style.borderColor = rotating ? '#d97706' : (pinching ? '#059669' : '#18181b');
    }

    // 4. 3D Rotate Mode
    if (rotating) {
      this.setActivePill('jpill-rotate');
      if (label) label.textContent = '4. 회전 [3D ROTATE]';
      const normX = (x / window.innerWidth - 0.5) * 2;
      const normY = (y / window.innerHeight - 0.5) * 2;
      const stage = document.getElementById('jarvis-unified-stage');
      if (stage && stage.style.display !== 'none') {
        stage.style.transform = `perspective(1400px) rotateY(${normX * 6}deg) rotateX(${-normY * 4}deg)`;
      } else if (window.BrainGraph && window.BrainGraph.controls) {
        window.BrainGraph.controls.azimuthAngle = normX * Math.PI * 0.5;
      }
      return;
    } else {
      const stage = document.getElementById('jarvis-unified-stage');
      if (stage) stage.style.transform = '';
    }

    // 3. Drag Move Mode
    if (pinching && this.activeDragEl) {
      this.setActivePill('jpill-drag');
      if (label) label.textContent = '3. 이동 [PINCH DRAG]';
      this.activeDragEl.style.position = 'fixed';
      this.activeDragEl.style.left = `${x - this.dragOffsetX}px`;
      this.activeDragEl.style.top = `${y - this.dragOffsetY}px`;
      this.activeDragEl.style.zIndex = '9200';
      return;
    }

    const elem = document.elementFromPoint(x, y);
    if (this.lastHoveredEl && this.lastHoveredEl !== elem) {
      this.lastHoveredEl.style.outline = '';
    }

    if (elem) {
      const clickable = elem.closest('button, .ud-btn, .ud-slot-card, .dock-btn, a');
      const draggableWin = elem.closest('.hud-window');
      if (clickable) {
        clickable.style.outline = '2px solid #18181b';
        this.lastHoveredEl = clickable;
      }

      if (pinching && !this.wasPinching) {
        this.setActivePill('jpill-click');
        if (label) label.textContent = '2. 클릭 [PINCH CLICK]';
        if (clickable) {
          clickable.click();
        } else if (draggableWin) {
          this.activeDragEl = draggableWin;
          const rect = draggableWin.getBoundingClientRect();
          this.dragOffsetX = x - rect.left;
          this.dragOffsetY = y - rect.top;
        }
      } else if (!pinching) {
        this.setActivePill('jpill-recognize');
        if (label) {
          label.textContent = clickable
            ? `1. 인식 [${clickable.textContent.trim().slice(0, 14)}]`
            : '1. 인식 [HOVER]';
        }
      }
    }

    if (!pinching && this.activeDragEl) {
      this.activeDragEl = null;
    }
    this.wasPinching = pinching;
  },

  drawHandSkeletonOnCanvas(normX, normY, pinch, rotate) {
    const canvas = document.getElementById('jcam-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle grid on light background
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < canvas.width; gx += 32) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
    }
    for (let gy = 0; gy < canvas.height; gy += 32) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
    }

    const hx = normX * 200 + 45;
    const hy = normY * 95 + 42;
    ctx.strokeStyle = rotate ? '#d97706' : (pinch ? '#059669' : '#18181b');
    ctx.lineWidth = 2.2;

    const fingers = [
      [hx - 22, hy - 8],
      [hx - 9, pinch ? hy - 10 : hy - 36],
      [hx + 4, hy - 40],
      [hx + 16, hy - 34],
      [hx + 26, rotate ? hy + 4 : hy - 22]
    ];

    fingers.forEach((f, idx) => {
      ctx.beginPath();
      ctx.moveTo(hx, hy + 24);
      ctx.lineTo(f[0], f[1]);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(f[0], f[1], idx <= 1 ? 4.5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = idx <= 1 ? '#18181b' : '#6b7280';
      ctx.fill();
    });

    ctx.fillStyle = '#111827';
    ctx.font = '700 10.5px sans-serif';
    ctx.fillText(
      rotate ? 'MODE 4: 3D ROTATE (손바닥 회전)' : (pinch ? 'MODE 2/3: PINCH CLICK & DRAG' : 'MODE 1: INDEX #8 POINTING'),
      10, 152
    );
  },

  toggleSimulatedHand(forceOn) {
    this.simHandActive = typeof forceOn === 'boolean' ? forceOn : !this.simHandActive;
    const chip = document.getElementById('jcam-status-chip');
    if (chip) chip.textContent = this.simHandActive ? 'VIRTUAL HAND' : 'STANDBY';

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
        this.updateSpatialPoint(sx, sy, pinch, rot);
      }, 40);
    }
  },

  async ensureMediaPipeLoaded() {
    if (window.Hands && window.Camera) return true;
    const scripts = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
    ];
    for (const src of scripts) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.crossOrigin = 'anonymous';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return Boolean(window.Hands && window.Camera);
  },

  async toggleRealWebcam() {
    if (this.webcamActive) {
      this.webcamActive = false;
      if (this.mpCamera) try { this.mpCamera.stop(); } catch (_) {}
      const chip = document.getElementById('jcam-status-chip');
      if (chip) chip.textContent = 'STANDBY';
      return;
    }

    try {
      const chip = document.getElementById('jcam-status-chip');
      if (chip) chip.textContent = 'LOADING CAM...';
      await this.ensureMediaPipeLoaded();

      const videoEl = document.getElementById('jcam-video');
      const canvas = document.getElementById('jcam-canvas');
      const ctx = canvas.getContext('2d');

      const hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.65
      });

      hands.onResults((results) => {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const lm = results.multiHandLandmarks[0];
          if (window.drawConnectors && window.HAND_CONNECTIONS) {
            window.drawConnectors(ctx, lm, window.HAND_CONNECTIONS, { color: '#18181b', lineWidth: 2 });
            window.drawLandmarks(ctx, lm, { color: '#059669', lineWidth: 1, radius: 2.5 });
          }

          const indexTip = lm[8];
          const thumbTip = lm[4];
          const pinkyTip = lm[20];
          const wrist = lm[0];

          const screenX = (1 - indexTip.x) * window.innerWidth;
          const screenY = indexTip.y * window.innerHeight;
          const pinchDist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
          const pinching = pinchDist < 0.055;
          const pinkyDist = Math.hypot(pinkyTip.x - wrist.x, pinkyTip.y - wrist.y);
          const rotating = pinkyDist < 0.18 && !pinching;

          this.updateSpatialPoint(screenX, screenY, pinching, rotating);
        }
        ctx.restore();
      });

      this.mpCamera = new window.Camera(videoEl, {
        onFrame: async () => {
          if (this.webcamActive) await hands.send({ image: videoEl });
        },
        width: 640,
        height: 480
      });

      await this.mpCamera.start();
      this.simHandActive = false;
      if (this.simTimer) clearInterval(this.simTimer);
      this.webcamActive = true;
      if (chip) chip.textContent = 'WEBCAM 21-PT LIVE';
    } catch (e) {
      this.toggleSimulatedHand(true);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.JarvisCameraGestureOS.init();
});
