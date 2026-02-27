"use client";

import { useState } from "react";
import { copyAndOpenClaude } from "@/lib/claude";
import { track } from "@/lib/analytics";

interface IntroFlowProps {
  name: string;
  onComplete: () => void;
}

const IDEA_OPTIONS = [
  { emoji: "🎮", label: "A simple game", prompt: "a simple browser game (like a click counter or quiz)" },
  { emoji: "🌤️", label: "A weather app", prompt: "a weather display app that shows today's forecast" },
  { emoji: "📝", label: "A to-do list", prompt: "a clean to-do list app where I can add and check off tasks" },
  { emoji: "🎨", label: "A personal page", prompt: "a personal landing page about me with my name and interests" },
];

export default function IntroFlow({ name, onComplete }: IntroFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAskClaude = async () => {
    if (selectedIdea === null) return;
    const idea = IDEA_OPTIONS[selectedIdea];
    const prompt = `I'm a complete beginner learning to code. I want to build ${idea.prompt}.

Build me a working version I can see right now. Use HTML, CSS, and JavaScript in a single file. Make it look cool with a dark theme.

Keep the code simple enough that I can understand it. Add comments explaining what each part does.`;

    track("intro_open_claude_clicked");
    setCopied(true);
    await copyAndOpenClaude(prompt);
  };

  const steps = [
    // Step 0: Pick an idea
    <div key="pick" className="text-center max-w-md mx-auto">
      <div className="text-5xl mb-4">💡</div>
      <h2 className="text-2xl font-bold text-vc-text font-sans mb-2">
        Hey {name}. Let&apos;s build something.
      </h2>
      <p className="text-sm text-vc-text-dim mb-8">Pick any idea. You&apos;ll have a working version in 5 minutes.</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {IDEA_OPTIONS.map((idea, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdea(i)}
            className="p-4 rounded-xl border-2 text-left cursor-pointer bg-vc-card transition-all"
            style={{
              borderColor: selectedIdea === i ? "#00f0ff" : "#181828",
              background: selectedIdea === i ? "#00f0ff08" : undefined,
            }}
          >
            <div className="text-2xl mb-1">{idea.emoji}</div>
            <div className="text-sm font-semibold text-vc-text">{idea.label}</div>
          </button>
        ))}
      </div>
      <button
        onClick={() => selectedIdea !== null && setStep(1)}
        disabled={selectedIdea === null}
        className="w-full py-3.5 rounded-xl text-sm font-bold font-sans border-none cursor-pointer transition-all disabled:opacity-30"
        style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)", color: "#000" }}
      >
        Next →
      </button>
    </div>,

    // Step 1: Open Claude
    <div key="claude" className="text-center max-w-md mx-auto">
      <div className="text-5xl mb-4">🤖</div>
      <h2 className="text-2xl font-bold text-vc-text font-sans mb-2">
        Ask Claude to build it
      </h2>
      <p className="text-sm text-vc-text-dim mb-6">
        Claude is your AI coding partner. Click below — it&apos;ll copy a prompt and open Claude.
      </p>
      <p className="text-xs text-vc-text-muted mb-8">
        Paste the prompt into Claude and watch it build your{" "}
        {selectedIdea !== null ? IDEA_OPTIONS[selectedIdea].label.toLowerCase() : "project"}.
      </p>
      <button
        onClick={handleAskClaude}
        className="w-full py-3.5 rounded-xl text-sm font-bold font-sans border-none cursor-pointer mb-3"
        style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)", color: "#000" }}
      >
        {copied ? "Prompt copied. Paste it into Claude." : "Ask Claude →"}
      </button>
      {copied && (
        <button
          onClick={() => setStep(2)}
          className="w-full py-3 rounded-xl text-sm font-semibold text-vc-text-secondary bg-vc-surface-hover border-none cursor-pointer"
        >
          Done — I see it working →
        </button>
      )}
    </div>,

    // Step 2: Orientation
    <div key="orient" className="text-center max-w-md mx-auto">
      <div className="text-5xl mb-4">🧭</div>
      <h2 className="text-2xl font-bold text-vc-text font-sans mb-2">
        What you&apos;re looking at
      </h2>
      <p className="text-sm text-vc-text-dim mb-6">
        Claude just wrote code. Here&apos;s what those parts are:
      </p>
      <div className="flex flex-col gap-3 text-left mb-8">
        {[
          { label: "Structure", desc: "The HTML — what things exist on the page (buttons, text, boxes)", color: "#00f0ff" },
          { label: "Style", desc: "The CSS — how it looks (colors, spacing, fonts)", color: "#a855f7" },
          { label: "Behavior", desc: "The JavaScript — what happens when you click, type, or interact", color: "#f97316" },
        ].map((item) => (
          <div key={item.label} className="bg-vc-card rounded-lg p-4" style={{ borderLeft: `3px solid ${item.color}` }}>
            <div className="text-sm font-bold text-vc-text mb-0.5">{item.label}</div>
            <div className="text-xs text-vc-text-dim leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-vc-text-muted mb-6">
        Over the next 28 days, you&apos;ll learn to write all of this yourself — with AI as your partner.
      </p>
      <button
        onClick={() => {
          track("intro_completed");
          onComplete();
        }}
        className="w-full py-3.5 rounded-xl text-sm font-bold font-sans border-none cursor-pointer"
        style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)", color: "#000" }}
      >
        Enter the Lab →
      </button>
    </div>,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-vc-bg font-mono px-5">
      {steps[step]}
    </div>
  );
}
