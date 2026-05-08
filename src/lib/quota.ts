import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "./firebase-admin";

export const DAILY_REQUEST_CAP = 100;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface QuotaResult {
  ok: boolean;
  remaining: number;
}

/**
 * Atomically check and increment the user's daily request count.
 * Fails closed: if Firestore is unavailable, the request is denied.
 * Storage path: users/{uid}/usage/{YYYY-MM-DD}
 */
export async function checkAndIncrementDailyQuota(uid: string): Promise<QuotaResult> {
  const db = getAdminFirestore();
  if (!db) return { ok: false, remaining: 0 };

  const ref = db.doc(`users/${uid}/usage/${todayKey()}`);

  try {
    return await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const current = snap.exists ? ((snap.data()?.requestCount as number) ?? 0) : 0;

      if (current >= DAILY_REQUEST_CAP) {
        return { ok: false, remaining: 0 };
      }

      tx.set(
        ref,
        {
          requestCount: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      return { ok: true, remaining: DAILY_REQUEST_CAP - (current + 1) };
    });
  } catch (err) {
    console.error("Quota transaction failed:", err);
    return { ok: false, remaining: 0 };
  }
}
