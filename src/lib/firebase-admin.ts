import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let _app: App | null = null;

function getAdminApp(): App | null {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (serviceAccountKey) {
    try {
      const parsed = JSON.parse(serviceAccountKey);
      _app = initializeApp({ credential: cert(parsed) });
      return _app;
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
      return null;
    }
  }

  if (projectId) {
    // Fallback: initialize with just projectId (works on GCP, limited on Vercel)
    _app = initializeApp({ projectId });
    return _app;
  }

  return null;
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  if (!app) return null;
  return getAuth(app);
}

export function getAdminFirestore(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  return getFirestore(app);
}

export interface VerifiedUser {
  uid: string;
  emailVerified: boolean;
}

/**
 * Verify a Firebase ID token from a request's Authorization header.
 * Returns { uid, emailVerified } on success, or null on failure.
 */
export async function verifyAuthToken(request: Request): Promise<VerifiedUser | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const idToken = authHeader.slice(7);
  if (!idToken) return null;

  const auth = getAdminAuth();
  if (!auth) return null;

  try {
    const decoded = await auth.verifyIdToken(idToken);
    return {
      uid: decoded.uid,
      emailVerified: decoded.email_verified === true,
    };
  } catch {
    return null;
  }
}
