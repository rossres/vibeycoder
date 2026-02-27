import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";
import { createUserProfile, saveUserProgress } from "./firestore";

export async function signUp(
  email: string,
  password: string,
  name: string,
  existingProgress: Record<string, true>
): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not configured");
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  await createUserProfile(user.uid, name, email);
  if (Object.keys(existingProgress).length > 0) {
    await saveUserProgress(user.uid, existingProgress);
  }

  return user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not configured");
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOut() {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): (() => void) {
  const auth = getFirebaseAuth();
  if (!auth) {
    // Firebase not configured — call back with null immediately and return no-op
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
