"use client";

import { useState } from "react";
import Image from "next/image";

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
    <div className="min-h-screen flex items-center justify-center bg-vc-bg font-mono px-5 relative overflow-hidden">
      {/* Atmospheric glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,240,255,0.07) 0%, rgba(168,85,247,0.04) 30%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div className="text-center max-w-[460px] md:max-w-lg relative">
        <div className="animate-fade-in flex justify-center mb-5">
          <Image
            src="/logo.png"
            alt="vibeycoder"
            width={352}
            height={192}
            className="h-28 w-auto md:h-36"
            priority
          />
        </div>
        <p className="text-sm text-vc-text-dim mb-7 leading-relaxed md:text-base animate-fade-in-d1">
          4 weeks · 30 min/day · Zero to building AI-powered apps
        </p>
        <div className="flex justify-center gap-8 mb-8 animate-fade-in-d2">
          {[["28", "Days"], ["30", "Min/Day"], ["4", "Apps"]].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-[26px] font-bold text-vc-cyan md:text-3xl" style={{ textShadow: "0 0 20px rgba(0,240,255,0.3)" }}>{n}</div>
              <div className="text-[10px] text-vc-text-faint uppercase tracking-widest mt-0.5 md:text-xs">{l}</div>
            </div>
          ))}
        </div>
        <div className="animate-fade-in-d3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && start()}
            placeholder="Your name, coder..."
            className="w-full bg-vc-surface-alt border border-vc-input-border rounded-[10px] px-4 py-3.5 text-[15px] text-vc-text text-center font-mono outline-none mb-2.5 placeholder:text-vc-text-dim transition-all"
          />
          <button
            onClick={start}
            disabled={!hasInput}
            className={`w-full rounded-[10px] py-3.5 text-[15px] font-bold font-sans border-none transition-all ${hasInput ? "btn-glow cursor-pointer" : ""}`}
            style={{
              background: hasInput ? "linear-gradient(135deg, #00f0ff, #a855f7)" : "#1a1a24",
              color: hasInput ? "#000" : "#555",
              cursor: hasInput ? "pointer" : "default",
            }}
          >
            Start My Journey
          </button>
        </div>
        <p className="text-[11px] text-vc-text-ghost mt-4 animate-fade-in-d4">Progress saves automatically</p>
      </div>
    </div>
  );
}
