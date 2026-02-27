const CLAUDE_URL = "https://claude.ai/new";

export function buildAskClaudePrompt(
  weekTitle: string,
  dayTitle: string,
  taskText: string,
  taskHow: string,
): string {
  return `I am working through Vibey Coder.

Week: ${weekTitle}
Day: ${dayTitle}

Task:
${taskText}

Context:
${taskHow}

Goal:
Help me complete this task step-by-step. Be clear and concise.
If code is needed, provide the exact code.
If explanation is needed, keep it short.`;
}

export function buildStuckPrompt(
  weekTitle: string,
  dayTitle: string,
  taskText: string,
  whatHappened: string,
  whatExpected: string,
  errorText?: string,
): string {
  let prompt = `I am working on a project in Vibey Coder.

Week: ${weekTitle}
Day: ${dayTitle}
Task: ${taskText}

Here is what happened:
${whatHappened}

Here is what I expected:
${whatExpected}`;

  if (errorText?.trim()) {
    prompt += `\n\nIf there is an error:\n${errorText}`;
  }

  prompt += `

Please:
1. Diagnose what might be wrong.
2. Explain it simply.
3. Give step-by-step instructions to fix it.
4. If code changes are needed, show exactly what to modify.`;

  return prompt;
}

export function openClaude() {
  window.open(CLAUDE_URL, "_blank");
}

export async function copyAndOpenClaude(prompt: string): Promise<void> {
  await navigator.clipboard.writeText(prompt);
  openClaude();
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
