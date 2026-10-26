# 🔬 [REA Clean-Room Blueprint] SasariSa (사사리사) macOS ➔ Windows 11 Native Edition

- **원본 GitHub**: `https://github.com/mvcompany8500-web/sasarisa`
- **원본 시연 영상**: `https://youtube.com/watch?v=muY9-sCxZlg`
- **역공학 엔진**: BSC REA 4-Stage Clean-Room Analyzer (`Invoke-ReaAnalyzer.js`)
- **연결된 4대 LLM 두뇌**: OpenAI GPT (`gpt-4o`, `o3-mini`) · Google Gemini (`gemini-2.5-flash`, `gemini-2.5-pro`) · LM Studio (`127.0.0.1:1234`) · Ollama (`127.0.0.1:11434` `gemma4:e4b`)

## 1. macOS ➔ Windows 11 6대 핵심 모듈 1:1 매핑
- **1. 사사리사 플로팅 보이스 바 (Floating Voice Pill & Action Stepper)**
  - macOS 원본: `SwiftUI MenuBarExtra + NSPanel Non-Activating Floating HUD`
  - Windows 11 재구축: `SasariSa Floating Voice Pill (#sasarisa-voice-pill, Alt+Space 단축키) + 실시간 오디오 파형 캔버스 + 단계별 실행 배지` [SAFE]
- **2. 온디바이스 음성 인식(STT) & 호출어("사사리사" / "자비스") 감지**
  - macOS 원본: `whisper.cpp CoreML + AVAudioEngine 로컬 마이크 캡처`
  - Windows 11 재구축: `Web Speech STT + Faster-Whisper/Whisper WebGPU + 현수/선희 HD 96kbps 자연 음성 TTS 양방향 브릿지` [SAFE]
- **3. 말로 하는 음악 재생 & 미디어 제어**
  - macOS 원본: `osascript -e 'tell application "Music" to play' / Spotify AppleScript`
  - Windows 11 재구축: `Windows Media Session (WScript.Shell SendKeys 미디어 키) + YouTube Music / Spotify / 멜론 자동 검색·재생 실행` [SAFE]
- **4. 말로 하는 쇼핑 검색 & 최저가/추천 브리핑**
  - macOS 원본: `Safari / Chrome AppleScript 탭 제어 및 상품 페이지 오픈`
  - Windows 11 재구축: `Windows Edge/Chrome 기반 쿠팡·네이버쇼핑·다나와 즉시 검색 오픈 + 4대 LLM(GPT/Gemini/LM Studio/Ollama) 쇼핑 포인트 요약` [SAFE]
- **5. 카카오톡 메시지 전송 & 메일 답장 (되돌릴 수 없는 작업 2중 안전장치)**
  - macOS 원본: `macOS Accessibility AXUIElement (KakaoTalk / Mail.app 제어 + 전송 전 음성 재확인)`
  - Windows 11 재구축: `Windows KakaoTalk.exe 프로세스 활성화·클립보드 초안 세팅 & Outlook/Gmail 답장 생성 + BSC Harness 2중 승인 카드(REQUIRES_CONFIRMATION)` [GUARDED_CONFIRM]
- **6. 말로 하는 코딩 & 4대 멀티 LLM(GPT · Gemini · LM Studio · Ollama) 연동**
  - macOS 원본: `Claude Code CLI 서브프로세스 브릿지`
  - Windows 11 재구축: `Antigravity IDE 2.0 코드 생성기 + multi-llm-provider-hub.js (GPT-4o / Gemini 2.5 / LM Studio :1234 / Ollama Gemma 4 :11434)` [SAFE]

## 2. 되돌릴 수 없는 작업(Irreversible Actions) 2중 안전장치
- 카카오톡/메신저 전송, 이메일 발송, 결제/주문, 파일 정리/삭제 명령은 즉시 실행하지 않고 **사사리사 2중 확인 가드레일(`REQUIRES_CONFIRMATION`)**을 거쳐 대표님이 승인하실 때만 최종 실행됩니다.