/**
 * 🧩 BSC J.A.R.V.I.S. OS — Universal JavaScript / Node.js & Browser SDK (`JarvisSDK`)
 * Compatible with Antigravity 2.0 (`google.antigravity`), Ollama (`:11434`),
 * LM Studio (`:1234`), and RunNow 15 On-Device WebGPU Models.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JarvisSDK = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const DEFAULT_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:7777';

  class JarvisClient {
    constructor(options = {}) {
      this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    }

    async getModelsCatalog() {
      const res = await fetch(`${this.baseUrl}/api/jarvis/models-catalog`);
      return res.json();
    }

    async selectBrain({ provider = 'ollama', modelId = 'gemma4:e4b', selectionMode = 'MANUAL' } = {}) {
      const res = await fetch(`${this.baseUrl}/api/jarvis/select-brain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, modelId, selectionMode })
      });
      return res.json();
    }

    async create5StepPlan(prompt, clientEnv = 'PC') {
      const res = await fetch(`${this.baseUrl}/api/jarvis/autonomous-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, clientEnv })
      });
      return res.json();
    }

    async approveAndExecutePlan(planId) {
      const res = await fetch(`${this.baseUrl}/api/jarvis/autonomous-execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      return res.json();
    }

    async runTerminalCommand(command, cwd = '') {
      const res = await fetch(`${this.baseUrl}/api/jarvis/terminal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, cwd })
      });
      return res.json();
    }

    async saveCodeFile(filePath, content) {
      const res = await fetch(`${this.baseUrl}/api/jarvis/ide-save-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, content })
      });
      return res.json();
    }

    getAntigravityPythonSdkTemplate(taskPrompt = '프로젝트 아키텍처 검증 및 6종 보고서 생성') {
      return [
        '# Antigravity Python SDK + BSC J.A.R.V.I.S. Local Brain Bridge',
        'import asyncio, sys',
        'from google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig',
        '',
        'async def run_bsc_jarvis_agent():',
        '    config = LocalAgentConfig(',
        '        system_instructions="당신은 이건우 대표님의 BSC J.A.R.V.I.S. 에이전트입니다. CHLGD 헌장과 데이터 무손실(Append-Only) 원칙을 준수하세요.",',
        '        capabilities=CapabilitiesConfig(),',
        '    )',
        '    async with Agent(config) as agent:',
        `        response = await agent.chat(${JSON.stringify(taskPrompt)})`,
        '        async for token in response:',
        '            sys.stdout.write(token)',
        '            sys.stdout.flush()',
        '',
        'if __name__ == "__main__":',
        '    asyncio.run(run_bsc_jarvis_agent())'
      ].join('\n');
    }
  }

  const defaultInstance = new JarvisClient();
  defaultInstance.JarvisClient = JarvisClient;
  return defaultInstance;
});
