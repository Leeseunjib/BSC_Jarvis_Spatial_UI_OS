# ⚡ 04. Token Flow Optimization & Deterministic Architecture

> **청지기적 절제 원칙**: "가장 뛰어난 에이전트 시스템은 무작정 많은 토큰을 태우는 시스템이 아니라, 결정론적 코드(Deterministic Code)와 2-Hop 이정표를 통해 최소한의 토큰으로 가장 정확한 진리에 도달하는 시스템이다."

## 1. 토큰 흐름 3단계 압축 파이프라인 (Token Flow Pipeline)

| 단계 | 기법 명칭 | 작동 원리 | 토큰 소모 비교 |
| :--- | :--- | :--- | :--- |
| **Stage 1** | **Deterministic Pre-Filter** | LLM 호출 전 `build-brain-map.js` 및 로컬 인덱서가 파일 메타데이터와 그래프 토폴로지를 0 토큰으로 사전 계산 | **0 Tokens** (100% 절감) |
| **Stage 2** | **MAPS 2-Hop Signpost** | `01_MEMORY_MAP.md`(40줄) → 도메인 Signpost → 타겟 문서로 2번 만에 핀셋 도달 (`pavrus117/ai-os-maps-guide` 실증) | 27.7k → **16.8k** (40% 절감) |
| **Stage 3** | **BSC Micro-Knowledge Query** | 문서 전체 대신 매칭된 헤딩/문단(3~10줄)만 컨텍스트에 주입하고 상세 전문은 HUD `Report Window`로 직접 렌더링 | 16.8k → **1.8k** (89% 절감) |

## 2. Show, Don't Store & Direct HUD Rendering
- 에이전트가 수천 줄의 마크다운 보고서를 채팅창에 다시 타이핑하며 출력 토큰(Output Tokens)을 낭비하는 대신, 자비스는 **`/api/summon` (`Report Window`)**을 통해 로컬 파일 시스템의 문서를 HUD 화면에 직접 렌더링(0 출력 토큰)하고, 음성으로는 핵심 요약 2~3문장만 브리핑합니다.

## 연결 노드
- [[00_SOUL_and_Worldview]]
- [[01_MEMORY_MAP]]
- [[03_Multimodal_HUD_Manual]]
- [[05_BSC_28_Agents_Roster]]
