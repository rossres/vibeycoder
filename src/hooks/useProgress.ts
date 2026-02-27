"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getUserProgress, saveUserProgress } from "@/lib/firestore";
import { CURRICULUM } from "@/data/curriculum";

function loadLocal(key: string) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function saveLocal(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function useProgress() {
  const { user } = useAuth();
  const [done, setDone] = useState<Record<string, true>>({});
  const [loaded, setLoaded] = useState(false);

  // Load progress: localStorage first, then merge with Firestore if authenticated
  useEffect(() => {
    const local = loadLocal("cb-done3") || {};
    setDone(local);

    if (user) {
      getUserProgress(user.uid).then((remote) => {
        if (remote) {
          const merged = { ...remote, ...local };
          setDone(merged);
          saveLocal("cb-done3", merged);
          saveUserProgress(user.uid, merged).catch(() => {});
        }
        setLoaded(true);
      }).catch(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
  }, [user]);

  // Toggle task completion
  const toggle = useCallback((weekIdx: number, dayIdx: number, taskIdx: number) => {
    const key = `${weekIdx}-${dayIdx}-${taskIdx}`;
    setDone((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;

      saveLocal("cb-done3", next);
      if (user) {
        saveUserProgress(user.uid, next).catch(() => {});
      }
      return next;
    });
  }, [user]);

  // Calculate progress for a week or specific day
  const prog = useCallback((weekIdx: number, dayIdx?: number) => {
    let tot = 0, dn = 0;
    if (dayIdx !== undefined) {
      const tasks = CURRICULUM[weekIdx].days[dayIdx].tasks;
      tasks.forEach((_, ti) => { tot++; if (done[`${weekIdx}-${dayIdx}-${ti}`]) dn++; });
    } else {
      CURRICULUM[weekIdx].days.forEach((d, di) =>
        d.tasks.forEach((_, ti) => { tot++; if (done[`${weekIdx}-${di}-${ti}`]) dn++; })
      );
    }
    return { tot, dn, pct: tot > 0 ? Math.round((dn / tot) * 100) : 0 };
  }, [done]);

  // Total progress across all weeks
  const totalProgress = (() => {
    let t = 0, d = 0;
    CURRICULUM.forEach((w, wi) =>
      w.days.forEach((dy, di) =>
        dy.tasks.forEach((_, ti) => { t++; if (done[`${wi}-${di}-${ti}`]) d++; })
      )
    );
    return { t, d, pct: t > 0 ? Math.round((d / t) * 100) : 0 };
  })();

  const completedCount = Object.keys(done).length;

  return { done, toggle, prog, totalProgress, completedCount, loaded };
}
