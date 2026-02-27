"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/claude";
import { track } from "@/lib/analytics";

interface ShipItProps {
  weekIndex: number;
  weekTitle: string;
  existingShip?: { link: string; shippedAt: number };
  onShip: (weekIndex: number, link: string) => void;
  onContinue: () => void;
}

export default function ShipIt({ weekIndex, weekTitle, existingShip, onShip, onContinue }: ShipItProps) {
  const [link, setLink] = useState(existingShip?.link || "");
  const [shipped, setShipped] = useState(!!existingShip);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShip = () => {
    if (!link.trim()) return;
    onShip(weekIndex, link.trim());
    setShipped(true);
    track("ship_link_submitted", { week: weekIndex + 1 });
  };

  const handleCopyLink = async () => {
    await copyToClipboard(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (shipped) {
    return (
      <div className="bg-vc-card rounded-xl p-5 text-center" style={{ borderLeft: "3px solid #10b981" }}>
        <div className="text-4xl mb-3">🚀</div>
        <div className="text-lg font-bold text-vc-text font-sans mb-1">Shipped.</div>
        <div className="text-2xl font-extrabold text-vc-text font-sans mb-4">Yo, I built this.</div>
        <div className="flex justify-center gap-2 mb-4">
          {link && (
            <>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-vc-surface-hover text-vc-text-secondary no-underline border-none cursor-pointer hover:text-vc-cyan transition-colors"
              >
                View
              </a>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-vc-surface-hover text-vc-text-secondary border-none cursor-pointer hover:text-vc-cyan transition-colors"
              >
                {linkCopied ? "Copied!" : "Copy Link"}
              </button>
            </>
          )}
        </div>
        {weekIndex < 3 && (
          <button
            onClick={onContinue}
            className="w-full py-3 rounded-xl text-sm font-bold font-sans border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)", color: "#000" }}
          >
            Continue to Week {weekIndex + 2} →
          </button>
        )}
        {weekIndex === 3 && (
          <div className="text-sm text-vc-green font-bold font-sans mt-2">
            🎓 You graduated. Legend.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-vc-card rounded-xl p-5" style={{ borderLeft: "3px solid #f97316" }}>
      <div className="text-2xl mb-2">🚀</div>
      <h3 className="text-base font-bold text-vc-text font-sans mb-1">Ship It</h3>
      <p className="text-xs text-vc-text-dim mb-4">
        Paste your {weekIndex === 0 ? "Claude artifact link" : "deployed project link"} to mark {weekTitle} complete.
      </p>
      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Paste your link here..."
        className="w-full bg-vc-surface-alt border border-vc-input-border rounded-lg px-3 py-2.5 text-xs text-vc-text font-mono outline-none mb-3 placeholder:text-vc-text-ghost focus:border-vc-cyan/50 transition-colors"
      />
      <button
        onClick={handleShip}
        disabled={!link.trim()}
        className="w-full py-2.5 rounded-lg text-sm font-bold font-sans border-none cursor-pointer transition-opacity disabled:opacity-30"
        style={{ background: "linear-gradient(135deg, #f97316, #f9a825)", color: "#000" }}
      >
        I shipped it
      </button>
    </div>
  );
}
