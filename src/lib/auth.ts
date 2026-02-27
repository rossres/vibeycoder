import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, saveUserProgress } from "./firestore";

export async function signUp(
  email: string,
  password: string,
  name: string,
  existingProgress: Record<string, true>
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  await createUserProfile(user.uid, name, email);
  if (Object.keys(existingProgress).length > 0) {
    await saveUserProgress(user.uid, existingProgress);
  }

  return user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
