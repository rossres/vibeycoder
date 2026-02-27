"use client";

import { useState } from "react";
import type { Task } from "@/types/curriculum";
import CheckIcon from "@/components/ui/CheckIcon";
import ChevronIcon from "@/components/ui/ChevronIcon";
import { buildAskClaudePrompt, copyAndOpenClaude, copyToClipboard } from "@/lib/claude";
import { track } from "@/lib/analytics";

interface TaskItemProps {
  task: Task;
  weekIdx: number;
  dayIdx: number;
  taskIdx: number;
  weekTitle: string;
  dayTitle: string;
  weekColor: string;
  isDone: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
  onStuck: () => void;
}

export default function TaskItem({
  task,
  weekIdx,
  dayIdx,
  taskIdx,
  weekTitle,
  dayTitle,
  weekColor,
  isDone,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  onStuck,
}: TaskItemProps) {
  const [copied, setCopied] = useState(false);

  const handleAskClaude = async () => {
    const prompt = buildAskClaudePrompt(weekTitle, dayTitle, task.text, task.how);
    track("ask_claude_clicked", { week: weekIdx + 1, day: dayIdx + 1, task: taskIdx });
    setCopied(true);
    await copyAndOpenClaude(prompt);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyPrompt = async () => {
    const prompt = buildAskClaudePrompt(weekTitle, dayTitle, task.text, task.how);
    await copyToClipboard(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="bg-vc-card-inner rounded-lg overflow-hidden transition-colors duration-200"
      style={{ border: `1px solid ${isExpanded ? weekColor + "44" : "#161622"}` }}
    >
      {/* Task row */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-start gap-2.5 px-3 py-2.5 bg-transparent border-none cursor-pointer text-vc-text-secondary font-mono text-left"
      >
        <div
          onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
          className="w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 mt-0.5 cursor-pointer"
          style={{
            border: `2px solid ${isDone ? "#10b981" : "#444"}`,
            background: isDone ? "#10b981" : "transparent",
            color: "#fff",
          }}
        >
          {isDone && <CheckIcon />}
        </div>
        <span
          className="text-xs leading-relaxed flex-1"
          style={{ opacity: isDone ? 0.4 : 1, textDecoration: isDone ? "line-through" : "none" }}
        >
          {task.type === "reflect" ? "💭 " : ""}{task.text}
        </span>
        <ChevronIcon open={isExpanded} />
      </button>

      {/* Explainer panel */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-vc-border-inner">
          <div className="mt-2.5 mb-2.5">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: weekColor }}>
              📖 How To Do This
            </div>
            <div className="text-xs leading-[1.7] text-[#bbb] whitespace-pre-line">{task.how}</div>
          </div>
          <div
            className="rounded-md px-2.5 py-2 mb-3"
            style={{ background: `${weekColor}08`, border: `1px solid ${weekColor}22` }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-vc-gold mb-1">
              💡 Why This Matters
            </div>
            <div className="text-xs leading-relaxed text-vc-text-muted">{task.why}</div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mb-3">
            {task.type === "action" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAskClaude}
                  className="flex-1 py-2 rounded-lg text-xs font-bold font-sans border-none cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)", color: "#000" }}
                >
                  {copied ? "Prompt copied. Paste it into Claude." : "Ask Claude"}
                </button>
                <button
                  onClick={handleCopyPrompt}
                  className="px-3 py-2 rounded-lg text-[10px] text-vc-text-dim bg-vc-surface-hover border-none cursor-pointer hover:text-vc-text-secondary transition-colors"
                >
                  Copy prompt
                </button>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
              className="w-full py-2.5 rounded-[7px] border-none text-[13px] font-bold cursor-pointer font-sans"
              style={{
                background: isDone ? "#1a1a2a" : weekColor,
                color: isDone ? "#888" : "#000",
              }}
            >
              {isDone ? "✓ Completed — Click to Undo" : "✓ Mark as Complete"}
            </button>
          </div>

          {/* I'm stuck link */}
          <div className="text-center">
            <button
              onClick={onStuck}
              className="text-[11px] text-vc-text-ghost hover:text-vc-cyan transition-colors bg-transparent border-none cursor-pointer font-mono"
            >
              I&apos;m stuck
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
