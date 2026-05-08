"use client";

interface WelcomeBannerProps {
  onDismiss: () => void;
}

export default function WelcomeBanner({ onDismiss }: WelcomeBannerProps) {
  return (
    <div className="mx-5 mt-3 rounded-xl px-4 py-3.5 relative md:mx-8 md:px-5 md:py-4" style={{ background: "#00f0ff0a", border: "1px solid #00f0ff20" }}>
      <div className="text-sm font-bold text-vc-text font-sans mb-0.5 md:text-base">Welcome to the Lab</div>
      <div className="text-xs text-vc-text-muted leading-relaxed">
        One mission at a time. Build elsewhere. Track it here.
      </div>
      <button
        onClick={onDismiss}
        className="mt-2.5 px-4 py-1.5 rounded-lg text-xs font-bold font-sans border-none cursor-pointer text-vc-bg"
        style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)" }}
      >
        Got it
      </button>
    </div>
  );
}
