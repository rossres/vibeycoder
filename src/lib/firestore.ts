import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export async function getUserProgress(uid: string): Promise<Record<string, true> | null> {
  const db = getFirebaseDb();
  if (!db) return null;
  const ref = doc(db, "users", uid, "progress", "current");
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return (snap.data().completedTasks as Record<string, true>) ?? {};
  }
  return null;
}

export async function saveUserProgress(uid: string, completedTasks: Record<string, true>) {
  const db = getFirebaseDb();
  if (!db) return;
  const ref = doc(db, "users", uid, "progress", "current");
  await setDoc(ref, {
    completedTasks,
    lastUpdated: serverTimestamp(),
  }, { merge: true });

  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    completedTaskCount: Object.keys(completedTasks).length,
  }, { merge: true });
}

export async function createUserProfile(uid: string, name: string, email: string) {
  const db = getFirebaseDb();
  if (!db) return;
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    name,
    email,
    createdAt: serverTimestamp(),
    completedTaskCount: 0,
    signupPromptShown: true,
  });
}
