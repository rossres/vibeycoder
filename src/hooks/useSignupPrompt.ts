"use client";

import { useState, useEffect } from "react";

const PROMPT_THRESHOLDS = [5, 15, 30, 60];

export function useSignupPrompt(completedCount: number, isAuthenticated: boolean) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissedAtCount, setDismissedAtCount] = useState<number>(0);

  useEffect(() => {
    if (isAuthenticated) {
      setShowPrompt(false);
      return;
    }

    try {
      const dismissed = localStorage.getItem("vc-signup-dismissed");
      if (dismissed) {
        const { count } = JSON.parse(dismissed);
        setDismissedAtCount(count);
      }
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) return;

    const nextThreshold = PROMPT_THRESHOLDS.find((t) => t > dismissedAtCount);
    if (nextThreshold && completedCount >= nextThreshold) {
      setShowPrompt(true);
    }
  }, [completedCount, isAuthenticated, dismissedAtCount]);

  const dismiss = () => {
    setShowPrompt(false);
    try {
      localStorage.setItem("vc-signup-dismissed", JSON.stringify({
        count: completedCount,
        timestamp: Date.now(),
      }));
    } catch {}
    setDismissedAtCount(completedCount);
  };

  return { showPrompt, dismiss };
}
