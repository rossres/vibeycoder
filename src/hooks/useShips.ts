"use client";

import { useState, useEffect, useCallback } from "react";

interface ShipData {
  link: string;
  shippedAt: number;
}

export function useShips() {
  const [ships, setShips] = useState<Record<number, ShipData>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vc_shipLinks");
      if (stored) setShips(JSON.parse(stored));
    } catch {}
  }, []);

  const submitShip = useCallback((weekIndex: number, link: string) => {
    setShips((prev) => {
      const next = {
        ...prev,
        [weekIndex]: { link, shippedAt: Date.now() },
      };
      try { localStorage.setItem("vc_shipLinks", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const shippedCount = Object.keys(ships).length;

  return { ships, submitShip, shippedCount };
}
