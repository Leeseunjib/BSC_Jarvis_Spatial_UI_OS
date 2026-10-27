# 🔬 [REA Clean-Room Blueprint] SasariSa (사사리사) macOS ➔ Windows 11 Voice-First Edition

- **원본 GitHub**: `https://github.com/mvcompany8500-web/sasarisa`
- **원본 시연 영상**: `https://youtube.com/watch?v=muY9-sCxZlg`
- **역공학 엔진**: BSC REA 4-Stage Clean-Room Analyzer (`Invoke-ReaAnalyzer.js`)
- **연결된 4대 LLM 두뇌**: Google Gemini (`gemini-4-argon` OAuth Ultra $0 추가과금) · Ollama (`gemma4:e4b`) · LM Studio (`:1234`) · OpenAI GPT (`gpt-4o`)

## 1. 핵심 아키텍처 매핑
- **1. 사사리사 Voice-First 미니멀 HUD (Zero-Overlap Voice Dock)**
  - macOS 원본: `SwiftUI MenuBarExtra + NSPanel Non-Activating Floating HUD`
  - Windows 11 재구축: `SasariSa Voice-First Minimal HUD (#sasarisa-voice-pill, Alt+Space) + 24-Bar 실시간 마이크 dB 파형 + 무겹침 레이아웃` [SAFE]
- **2. 3중 하이브리드 한국어 음성인식(STT) & 96kbps HD 자동 발화(TTS)**
  - macOS 원본: `whisper.cpp CoreML + AVAudioEngine 로컬 마이크 캡처`
  - Windows 11 재구축: `Continuous Web Speech (1.2초 침묵 자동 전송 + Auto-Heal) + WebAudio Analyser + Windows SAPI 로컬 STT 폴백 + 현수/선희 HD TTS` [SAFE]
- **3. Google Gemini CLI & Antigravity CLI (OAuth Ultra $0 추가과금)**
  - macOS 원본: `Claude Code CLI 서브프로세스 브릿지`
  - Windows 11 재구축: `Google OAuth (`~/.gemini/oauth_creds.json` + `gemini` CLI / `agy`) 직결 브릿지 — 추가 API 과금 $0로 Gemini 4 Argon 활용` [SAFE]
- **4. 음성 기반 로컬 CLI & MCP / 본사 스킬 직결 실행기**
  - macOS 원본: `macOS Terminal & Shell Script Runner`
  - Windows 11 재구축: `Windows PowerShell / Git / Node CLI + Blender·ComfyUI·Firebase·Notion MCP + BSC 본사 스킬 음성 실행` [GUARDED_CONFIRM]
- **5. 원클릭 옵시디언×노션 뉴런 콘텐츠 & 응용 스튜디오**
  - macOS 원본: `Local Markdown Knowledge Viewer`
  - Windows 11 재구축: `뉴런(점) 1회 클릭 또는 음성 명령 시 전체 본문 열람 + 노션(/) 블록 편집 + 옵시디언 [[위키링크]]·백링크·실시간 뉴런 생성` [SAFE]
- **6. Windows 11 음악·쇼핑·카카오톡·메일 & 2중 안전 가드레일**
  - macOS 원본: `osascript Music / Safari / AXUIElement KakaoTalk + Irreversible Confirmation`
  - Windows 11 재구축: `YouTube Music/Spotify + 쿠팡/네이버쇼핑 + 카카오톡 클립보드/메일 + REQUIRES_CONFIRMATION 2단계 승인` [GUARDED_CONFIRM]