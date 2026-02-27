"use client";

import type { Day } from "@/types/curriculum";
import CheckIcon from "@/components/ui/CheckIcon";
import ChevronIcon from "@/components/ui/ChevronIcon";
import TaskItem from "./TaskItem";

interface DayAccordionProps {
  day: Day;
  dayIndex: number;
  weekIndex: number;
  weekColor: string;
  done: Record<string, true>;
  toggle: (weekIdx: number, dayIdx: number, taskIdx: number) => void;
  dayProgress: { tot: number; dn: number; pct: number };
  isExpanded: boolean;
  onToggleExpand: () => void;
  expandedTask: number | null;
  onToggleTask: (taskIdx: number) => void;
}

export default function DayAccordion({
  day,
  dayIndex,
  weekIndex,
  weekColor,
  done,
  toggle,
  dayProgress,
  isExpanded,
  onToggleExpand,
  expandedTask,
  onToggleTask,
}: DayAccordionProps) {
  const isDone = dayProgress.pct === 100;

  return (
    <div
      className="bg-vc-card rounded-[10px] overflow-hidden"
      style={{ borderLeft: `3px solid ${isDone ? "#10b981" : weekColor}` }}
    >
      {/* Day header */}
      <button
        onClick={onToggleExpand}
        className="w-full flex justify-between items-center px-3.5 py-3 bg-transparent border-none cursor-pointer text-vc-text-secondary font-mono"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-[7px] flex items-center justify-center text-[10px] font-extrabold"
            style={{
              background: isDone ? "#10b981" : `${weekColor}28`,
              color: isDone ? "#fff" : weekColor,
            }}
          >
            {isDone ? <CheckIcon /> : `D${day.day}`}
          </div>
          <div className="text-left">
            <div className="text-[13px] font-bold text-vc-text">{day.title}</div>
            <div className="text-[10px] text-vc-text-faint mt-px">
              {day.time} · {dayProgress.dn}/{dayProgress.tot}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-vc-text-ghost">
          <div className="w-10 h-[3px] bg-vc-progress-track rounded-sm overflow-hidden">
            <div
              className="h-full rounded-sm transition-[width] duration-300"
              style={{ background: isDone ? "#10b981" : weekColor, width: `${dayProgress.pct}%` }}
            />
          </div>
          <ChevronIcon open={isExpanded} />
        </div>
      </button>

      {/* Day content */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5">
          {/* Objective */}
          <div className="bg-vc-card-inner rounded-lg px-3 py-2.5 mb-3 flex gap-2">
            <span className="text-[13px]">🎯</span>
            <span className="text-xs text-vc-text-muted leading-relaxed">{day.objective}</span>
          </div>

          {/* Tasks */}
          <div className="flex flex-col gap-1.5 mb-3">
            {day.tasks.map((t, ti) => {
              const key = `${weekIndex}-${dayIndex}-${ti}`;
              return (
                <TaskItem
                  key={ti}
                  task={t}
                  weekIdx={weekIndex}
                  dayIdx={dayIndex}
                  taskIdx={ti}
                  weekColor={weekColor}
                  isDone={!!done[key]}
                  isExpanded={expandedTask === ti}
                  onToggleExpand={() => onToggleTask(ti)}
                  onToggleComplete={() => toggle(weekIndex, dayIndex, ti)}
                />
              );
            })}
          </div>

          {/* Takeaway + Pro Tip */}
          <div className="flex flex-col gap-1.5">
            <div className="rounded-[7px] px-3 py-2.5" style={{ background: "#00f0ff08", border: "1px solid #00f0ff18" }}>
              <div className="text-[10px] font-bold tracking-wide text-vc-cyan mb-0.5">💡 KEY TAKEAWAY</div>
              <div className="text-xs leading-relaxed text-[#aaa]">{day.keyTakeaway}</div>
            </div>
            <div className="rounded-[7px] px-3 py-2.5" style={{ background: "#f9731608", border: "1px solid #f9731618" }}>
              <div className="text-[10px] font-bold tracking-wide text-vc-orange mb-0.5">⭐ PRO TIP</div>
              <div className="text-xs leading-relaxed text-[#aaa]">{day.proTip}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
