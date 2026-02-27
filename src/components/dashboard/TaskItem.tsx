"use client";

import type { Task } from "@/types/curriculum";
import CheckIcon from "@/components/ui/CheckIcon";
import ChevronIcon from "@/components/ui/ChevronIcon";

interface TaskItemProps {
  task: Task;
  weekIdx: number;
  dayIdx: number;
  taskIdx: number;
  weekColor: string;
  isDone: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
}

export default function TaskItem({
  task,
  weekColor,
  isDone,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
}: TaskItemProps) {
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
            className="rounded-md px-2.5 py-2 mb-2.5"
            style={{ background: `${weekColor}08`, border: `1px solid ${weekColor}22` }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-vc-gold mb-1">
              💡 Why This Matters
            </div>
            <div className="text-xs leading-relaxed text-vc-text-muted">{task.why}</div>
          </div>
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
      )}
    </div>
  );
}
