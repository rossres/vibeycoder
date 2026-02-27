"use client";

interface HeaderProps {
  name: string;
  totalProgress: { t: number; d: number; pct: number };
  shippedCount: number;
  onLoginClick?: () => void;
  isAuthenticated?: boolean;
}

export default function Header({ name, totalProgress, shippedCount, onLoginClick, isAuthenticated }: HeaderProps) {
  return (
    <div className="px-5 pt-4 pb-3 border-b border-vc-border">
      <div className="flex justify-between items-center mb-2.5">
        <div>
          <h1 className="text-lg font-extrabold text-vc-text font-sans m-0">Vibey Coder</h1>
          <p className="text-xs text-vc-text-dim mt-0.5">
            Hey <span className="text-vc-cyan">{name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isAuthenticated && onLoginClick && (
            <button
              onClick={onLoginClick}
              className="text-[11px] text-vc-text-dim hover:text-vc-cyan transition-colors cursor-pointer bg-transparent border-none font-mono"
            >
              Log in
            </button>
          )}
          {shippedCount > 0 && (
            <div className="bg-vc-surface rounded-2xl px-3 py-1 text-xs font-semibold text-vc-text">
              🚀 {shippedCount}
            </div>
          )}
          <div className="bg-vc-surface rounded-2xl px-3 py-1 text-xs font-semibold text-vc-text">
            {totalProgress.d}/{totalProgress.t}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex-1 h-[5px] bg-vc-border rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-[width] duration-400"
            style={{
              background: "linear-gradient(90deg, #00f0ff, #a855f7, #f97316, #10b981)",
              width: `${totalProgress.pct}%`,
            }}
          />
        </div>
        <span className="text-xs font-bold text-vc-text min-w-[30px] text-right">{totalProgress.pct}%</span>
      </div>
    </div>
  );
}
