"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  mode: "signup" | "login";
  name: string;
  existingProgress: Record<string, true>;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ mode: initialMode, name, existingProgress, onClose, onSuccess }: AuthModalProps) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await signUp(email, password, name, existingProgress);
      } else {
        await signIn(email, password);
      }
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      if (message.includes("email-already-in-use")) {
        setError("An account with this email already exists. Try logging in.");
      } else if (message.includes("weak-password")) {
        setError("Password must be at least 6 characters.");
      } else if (message.includes("invalid-email")) {
        setError("Please enter a valid email address.");
      } else if (message.includes("invalid-credential")) {
        setError("Invalid email or password.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
      <div className="bg-vc-card border border-vc-border rounded-xl max-w-[400px] w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-vc-text-ghost hover:text-vc-text text-lg bg-transparent border-none cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-vc-text font-sans mb-1">
          {mode === "signup" ? "Save Your Progress" : "Welcome Back"}
        </h2>
        <p className="text-xs text-vc-text-dim mb-5">
          {mode === "signup"
            ? "Create a free account to sync progress across devices."
            : "Log in to pick up where you left off."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full bg-vc-surface-alt border border-vc-input-border rounded-lg px-4 py-3 text-sm text-vc-text font-mono outline-none placeholder:text-vc-text-dim focus:border-vc-cyan/50 transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (6+ characters)"
            required
            minLength={6}
            className="w-full bg-vc-surface-alt border border-vc-input-border rounded-lg px-4 py-3 text-sm text-vc-text font-mono outline-none placeholder:text-vc-text-dim focus:border-vc-cyan/50 transition-colors"
          />

          {error && <p className="text-xs text-red-400 m-0">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-3 text-sm font-bold font-sans border-none cursor-pointer transition-opacity disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)", color: "#000" }}
          >
            {loading ? "..." : mode === "signup" ? "Create Account" : "Log In"}
          </button>
        </form>

        <p className="text-[11px] text-vc-text-ghost text-center mt-4">
          {mode === "signup" ? (
            <>Already have an account?{" "}
              <button onClick={() => { setMode("login"); setError(""); }} className="text-vc-cyan bg-transparent border-none cursor-pointer font-mono text-[11px]">Log in</button>
            </>
          ) : (
            <>Don&apos;t have an account?{" "}
              <button onClick={() => { setMode("signup"); setError(""); }} className="text-vc-cyan bg-transparent border-none cursor-pointer font-mono text-[11px]">Sign up</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
