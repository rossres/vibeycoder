"use client";

import { useEffect, useRef } from "react";
import { CURRICULUM } from "@/data/curriculum";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

function getNotified(): Record<string, true> {
  try {
    const s = localStorage.getItem("vc-week-notified");
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

function markNotified(weekIdx: number) {
  try {
    const current = getNotified();
    current[String(weekIdx)] = true;
    localStorage.setItem("vc-week-notified", JSON.stringify(current));
  } catch {}
}

export function useWeekNotification(
  done: Record<string, true>,
  name: string,
  user: User | null
) {
  const prevDone = useRef<Record<string, true>>({});

  useEffect(() => {
    // Skip if no tasks completed yet or no change
    const keys = Object.keys(done);
    if (keys.length === 0) return;
    if (keys.length === Object.keys(prevDone.current).length) return;
    prevDone.current = done;

    const notified = getNotified();

    for (let wi = 0; wi < CURRICULUM.length; wi++) {
      // Already notified for this week
      if (notified[String(wi)]) continue;

      // Check if week is 100% complete
      let tot = 0;
      let dn = 0;
      CURRICULUM[wi].days.forEach((d, di) =>
        d.tasks.forEach((_, ti) => {
          tot++;
          if (done[`${wi}-${di}-${ti}`]) dn++;
        })
      );

      if (tot > 0 && dn === tot) {
        // Week just completed — send notification
        markNotified(wi);
        (async () => {
          try {
            const auth = getFirebaseAuth();
            const currentUser = auth?.currentUser;
            const token = currentUser ? await currentUser.getIdToken() : null;
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
            };
            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }
            await fetch("/api/notify-week-complete", {
              method: "POST",
              headers,
              body: JSON.stringify({
                userName: name,
                userEmail: user?.email || null,
                weekNumber: wi,
                weekTitle: CURRICULUM[wi].title,
                tasksCompleted: dn,
                totalTasks: tot,
              }),
            });
          } catch {}
        })();
      }
    }
  }, [done, name, user]);
}
