"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthChange, signUp as authSignUp, signIn as authSignIn, signOut as authSignOut } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, existingProgress: Record<string, true>) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => { throw new Error("AuthContext not initialized"); },
  signIn: async () => { throw new Error("AuthContext not initialized"); },
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp: authSignUp,
      signIn: authSignIn,
      signOut: authSignOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
