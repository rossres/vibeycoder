"use client";

import type { Week } from "@/types/curriculum";

interface WeekTabsProps {
  weeks: Week[];
  activeWeek: number;
  weekProgress: (weekIdx: number) => { tot: number; dn: number; pct: number };
  onSelectWeek: (weekIdx: number) => void;
}

export default function WeekTabs({ weeks, activeWeek, weekProgress, onSelectWeek }: WeekTabsProps) {
  return (
    <div className="flex gap-1.5 px-5 py-3 overflow-x-auto">
      {weeks.map((w, i) => {
        const p = weekProgress(i);
        const isActive = activeWeek === i;
        return (
          <button
            key={i}
            onClick={() => onSelectWeek(i)}
            className="flex flex-col items-center gap-0.5 px-3.5 py-2 rounded-[10px] cursor-pointer min-w-[64px] font-mono bg-transparent transition-colors"
            style={{
              border: `2px solid ${isActive ? w.color : "transparent"}`,
              background: isActive ? `${w.color}12` : "transparent",
              color: "#ddd",
            }}
          >
            <span className="text-lg">{w.icon}</span>
            <span className="text-[10px] font-semibold tracking-wide">WK {i + 1}</span>
            <span className="text-xs font-bold" style={{ color: w.color }}>{p.pct}%</span>
          </button>
        );
      })}
    </div>
  );
}
