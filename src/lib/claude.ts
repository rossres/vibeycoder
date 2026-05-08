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

// --- Embedded chat prompt builders ---

export function buildChatSystemPrompt(): string {
  return `You are a coding tutor embedded in Vibey Coder, a 28-day builder lab where people create real apps with AI.

Guidelines:
- Be concise. Short paragraphs, numbered steps.
- When showing code, keep snippets minimal and explain each part.
- Be encouraging but not patronizing.
- If someone is stuck, diagnose before jumping to solutions.
- If a task is about reflection, guide the thinking process.`;
}

export function buildAskClaudeUserMessage(
  weekTitle: string,
  dayTitle: string,
  taskText: string,
  taskHow: string,
): string {
  return `I'm working on this task and need help:

Week: ${weekTitle}
Day: ${dayTitle}
Task: ${taskText}

Context: ${taskHow}

Help me complete this step-by-step.`;
}

export function buildStuckUserMessage(
  weekTitle: string,
  dayTitle: string,
  taskText: string,
  whatHappened: string,
  whatExpected: string,
  errorText?: string,
): string {
  let msg = `I'm stuck on a task:

Week: ${weekTitle}
Day: ${dayTitle}
Task: ${taskText}

What happened: ${whatHappened}
What I expected: ${whatExpected}`;

  if (errorText?.trim()) {
    msg += `\n\nError message:\n${errorText}`;
  }

  msg += `\n\nDiagnose the issue and give me step-by-step instructions to fix it.`;
  return msg;
}
