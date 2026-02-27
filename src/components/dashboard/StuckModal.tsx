"use client";

import { useState } from "react";
import { buildStuckPrompt, copyAndOpenClaude } from "@/lib/claude";
import { track } from "@/lib/analytics";

interface StuckModalProps {
  weekTitle: string;
  dayTitle: string;
  taskText: string;
  weekNum: number;
  dayNum: number;
  taskIdx: number;
  onClose: () => void;
}

export default function StuckModal({
  weekTitle,
  dayTitle,
  taskText,
  weekNum,
  dayNum,
  taskIdx,
  onClose,
}: StuckModalProps) {
  const [whatHappened, setWhatHappened] = useState("");
  const [whatExpected, setWhatExpected] = useState("");
  const [errorText, setErrorText] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!whatHappened.trim()) return;
    const prompt = buildStuckPrompt(weekTitle, dayTitle, taskText, whatHappened, whatExpected, errorText);
    track("stuck_opened", { week: weekNum, day: dayNum, task: taskIdx });
    setSent(true);
    await copyAndOpenClaude(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
      <div className="bg-vc-card border border-vc-border rounded-xl max-w-[440px] w-full p-5 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-vc-text-ghost hover:text-vc-text text-lg bg-transparent border-none cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-base font-bold text-vc-text font-sans mb-1">I&apos;m stuck</h3>
        <p className="text-[11px] text-vc-text-dim mb-4">
          Tell us what happened and we&apos;ll build a help prompt for Claude.
        </p>

        <div className="bg-vc-card-inner rounded-lg px-3 py-2 mb-4 text-xs text-vc-text-muted">
          <span className="text-vc-text-dim">Task:</span> {taskText}
        </div>

        {!sent ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-vc-text-dim block mb-1">
                What happened?
              </label>
              <textarea
                value={whatHappened}
                onChange={(e) => setWhatHappened(e.target.value)}
                placeholder="I tried to... but then..."
                rows={3}
                className="w-full bg-vc-surface-alt border border-vc-input-border rounded-lg px-3 py-2.5 text-xs text-vc-text font-mono outline-none resize-none placeholder:text-vc-text-ghost focus:border-vc-cyan/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-vc-text-dim block mb-1">
                What did you expect?
              </label>
              <textarea
                value={whatExpected}
                onChange={(e) => setWhatExpected(e.target.value)}
                placeholder="I expected to see..."
                rows={2}
                className="w-full bg-vc-surface-alt border border-vc-input-border rounded-lg px-3 py-2.5 text-xs text-vc-text font-mono outline-none resize-none placeholder:text-vc-text-ghost focus:border-vc-cyan/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-vc-text-dim block mb-1">
                Paste error <span className="text-vc-text-ghost">(optional)</span>
              </label>
              <textarea
                value={errorText}
                onChange={(e) => setErrorText(e.target.value)}
                placeholder="Error message..."
                rows={2}
                className="w-full bg-vc-surface-alt border border-vc-input-border rounded-lg px-3 py-2.5 text-xs text-vc-text font-mono outline-none resize-none placeholder:text-vc-text-ghost focus:border-vc-cyan/50 transition-colors"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!whatHappened.trim()}
              className="w-full py-2.5 rounded-lg text-sm font-bold font-sans border-none cursor-pointer transition-opacity disabled:opacity-30"
              style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)", color: "#000" }}
            >
              Ask Claude for Help
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-sm font-bold text-vc-text font-sans mb-1">Prompt copied.</p>
            <p className="text-xs text-vc-text-dim mb-4">Paste it into Claude.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-xs font-semibold text-vc-text-secondary bg-vc-surface-hover border-none cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
