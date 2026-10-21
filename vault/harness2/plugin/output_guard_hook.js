// Tool-Loop Middleware Hook (c8: plugin)
// Enforces non-skippable checks inside the tool loop (tool.execute.after & experimental.chat.system.transform)
module.exports = {
  name: "bsc_harness2_output_guard",
  "experimental.chat.system.transform": async (systemPrompt) => {
    return systemPrompt;
  },
  "tool.execute.after": async (event) => {
    if (event && event.output && event.output.length > 45000) {
      return { ...event, output: event.output.slice(0, 45000) + "\n...[Harness² Plugin: truncated oversized tool output to protect reasoning budget]" };
    }
    return event;
  }
};