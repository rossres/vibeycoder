import type { Week } from "@/types/curriculum";

interface WeekHeaderProps {
  week: Week;
  weekIndex: number;
}

export default function WeekHeader({ week, weekIndex }: WeekHeaderProps) {
  return (
    <div className="px-5 pb-2 md:px-8 md:pb-3">
      <span
        className="inline-block text-[9px] font-bold text-black px-2 py-0.5 rounded-xl uppercase tracking-widest mb-1.5 md:text-[10px]"
        style={{ background: week.color }}
      >
        Week {weekIndex + 1}
      </span>
      <h2 className="text-[22px] font-extrabold text-vc-text font-sans m-0 mb-0.5 md:text-[26px] lg:text-3xl">{week.title}</h2>
      <p className="text-[13px] text-vc-text-dim m-0 md:text-sm">{week.subtitle}</p>
    </div>
  );
}
