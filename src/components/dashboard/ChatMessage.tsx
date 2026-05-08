"use client";

import type { ChatMessage as ChatMessageType } from "@/hooks/useChatSession";

interface ChatMessageProps {
  message: ChatMessageType;
}

function renderMarkdown(text: string) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trimStart().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push(
        <pre
          key={key++}
          className="bg-[#0d0d1a] border border-vc-border rounded-md px-3 py-2 text-[11px] leading-[1.6] overflow-x-auto my-1.5 md:text-xs"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Header lines (## or ###)
    const headerMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headerMatch) {
      blocks.push(
        <div key={key++} className="text-[13px] font-bold text-vc-text mt-2 mb-0.5">
          {formatInline(headerMatch[2])}
        </div>
      );
      i++;
      continue;
    }

    // Numbered list item (1. or 1)
    const numMatch = line.match(/^(\d+)[.)]\s+(.+)/);
    if (numMatch) {
      const items: React.ReactNode[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\d+)[.)]\s+(.+)/);
        if (!m) break;
        items.push(
          <li key={key++} className="ml-1">
            {formatInline(m[2])}
          </li>
        );
        i++;
      }
      blocks.push(
        <ol key={key++} className="list-decimal pl-5 my-1 space-y-0.5">
          {items}
        </ol>
      );
      continue;
    }

    // Bullet list item (- or *)
    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      const items: React.ReactNode[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^[-*]\s+(.+)/);
        if (!m) break;
        items.push(
          <li key={key++} className="ml-1">
            {formatInline(m[1])}
          </li>
        );
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-5 my-1 space-y-0.5">
          {items}
        </ul>
      );
      continue;
    }

    // Regular paragraph
    blocks.push(
      <p key={key++} className="my-1">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return blocks;
}

function formatInline(text: string): React.ReactNode {
  // Split on inline code, bold, and regular text
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let k = 0;

  while (remaining.length > 0) {
    // Inline code: `...`
    const codeMatch = remaining.match(/^([\s\S]*?)`([^`]+)`([\s\S]*)/);
    // Bold: **...**
    const boldMatch = remaining.match(/^([\s\S]*?)\*\*([^*]+)\*\*([\s\S]*)/);

    // Find the earliest match
    const codeIdx = codeMatch ? codeMatch[1].length : Infinity;
    const boldIdx = boldMatch ? boldMatch[1].length : Infinity;

    if (codeIdx === Infinity && boldIdx === Infinity) {
      // No more matches
      parts.push(remaining);
      break;
    }

    if (codeIdx <= boldIdx && codeMatch) {
      if (codeMatch[1]) parts.push(codeMatch[1]);
      parts.push(
        <code
          key={k++}
          className="bg-[#0d0d1a] px-1 py-0.5 rounded text-vc-cyan text-[11px]"
        >
          {codeMatch[2]}
        </code>
      );
      remaining = codeMatch[3];
    } else if (boldMatch) {
      if (boldMatch[1]) parts.push(boldMatch[1]);
      parts.push(
        <strong key={k++} className="text-vc-text font-bold">
          {boldMatch[2]}
        </strong>
      );
      remaining = boldMatch[3];
    }
  }

  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isEmpty = !message.content && message.isStreaming;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed md:max-w-[75%] md:text-sm ${
          isUser
            ? "text-black font-mono"
            : "bg-vc-card-inner text-[#ccc]"
        }`}
        style={
          isUser
            ? { background: "linear-gradient(135deg, #00f0ff, #a855f7)" }
            : undefined
        }
      >
        {isEmpty ? (
          <div className="flex gap-1 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-vc-text-ghost animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-vc-text-ghost animate-pulse [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-vc-text-ghost animate-pulse [animation-delay:300ms]" />
          </div>
        ) : isUser ? (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        ) : (
          <div className="break-words">{renderMarkdown(message.content)}</div>
        )}
      </div>
    </div>
  );
}
