"use client";

import { useState } from "react";

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [input, setInput] = useState("");

  const start = () => {
    if (!input.trim()) return;
    onStart(input.trim());
  };

  const hasInput = input.trim().length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-vc-bg font-mono px-5">
      <div className="text-center max-w-[460px]">
        <div className="text-[52px] mb-3">{"</>"}</div>
        <h1 className="text-[28px] font-extrabold text-vc-text font-sans tracking-tight mb-2">
          AI Coding Bootcamp
        </h1>
        <p className="text-sm text-vc-text-dim mb-7 leading-relaxed">
          4 weeks · 30 min/day · Zero to building AI-powered apps
        </p>
        <div className="flex justify-center gap-8 mb-8">
          {[["28", "Days"], ["30", "Min/Day"], ["∞", "Potential"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-[26px] font-bold text-vc-cyan">{n}</div>
              <div className="text-[10px] text-vc-text-faint uppercase tracking-widest mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && start()}
          placeholder="Your name, coder..."
          className="w-full bg-vc-surface-alt border border-vc-input-border rounded-[10px] px-4 py-3.5 text-[15px] text-vc-text text-center font-mono outline-none mb-2.5 placeholder:text-vc-text-dim focus:border-vc-cyan/50 transition-colors"
        />
        <button
          onClick={start}
          disabled={!hasInput}
          className="w-full rounded-[10px] py-3.5 text-[15px] font-bold font-sans border-none transition-all"
          style={{
            background: hasInput ? "linear-gradient(135deg, #00f0ff, #a855f7)" : "#222",
            color: hasInput ? "#000" : "#555",
            cursor: hasInput ? "pointer" : "default",
          }}
        >
          Start My Journey →
        </button>
        <p className="text-[11px] text-vc-text-ghost mt-4">Progress saves automatically</p>
      </div>
    </div>
  );
}
