"use client";

interface SignUpPromptProps {
  name: string;
  onSignUp: () => void;
  onDismiss: () => void;
}

export default function SignUpPrompt({ name, onSignUp, onDismiss }: SignUpPromptProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="mx-4 mb-4 bg-vc-card border border-vc-border rounded-xl p-4 shadow-2xl max-w-lg sm:mx-auto">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎉</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-vc-text font-sans m-0 mb-1">
              Nice work, {name}!
            </p>
            <p className="text-xs text-vc-text-muted m-0 mb-3 leading-relaxed">
              Create a free account to save your progress across devices and never lose your work.
            </p>
            <div className="flex gap-2">
              <button
                onClick={onSignUp}
                className="px-4 py-2 rounded-lg text-xs font-bold font-sans border-none cursor-pointer"
                style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)", color: "#000" }}
              >
                Sign Up Free
              </button>
              <button
                onClick={onDismiss}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-vc-text-dim bg-vc-surface-hover border-none cursor-pointer hover:text-vc-text-secondary transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
