import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
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

  // Send verification email — required before chat/notify endpoints when
  // REQUIRE_EMAIL_VERIFIED is enabled server-side. Fire-and-forget.
  sendEmailVerification(user).catch((e) =>
    console.error("sendEmailVerification failed:", e)
  );

  // Firestore writes are fire-and-forget — never block signup
  createUserProfile(user.uid, name, email).catch((e) =>
    console.error("Firestore profile write failed:", e)
  );
  if (Object.keys(existingProgress).length > 0) {
    saveUserProgress(user.uid, existingProgress).catch((e) =>
      console.error("Firestore progress write failed:", e)
    );
  }

  return user;
}

export async function resendVerificationEmail(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth?.currentUser) throw new Error("Not signed in");
  await sendEmailVerification(auth.currentUser);
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
