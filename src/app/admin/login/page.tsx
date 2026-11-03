"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email.trim() || !password) {
        throw new Error("Please enter both email and password.");
      }

      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (loginError) {
        throw new Error("Invalid email or password.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>

          <p className="font-serif text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
            Restricted Staff Portal
          </p>

          <h1 className="font-serif text-2xl text-[var(--foreground)]">
            Operating System Sign In
          </h1>

          <p className="text-xs text-[var(--foreground-muted)]">
            Authorized POM&apos;S administrative personnel only.
          </p>
        </div>

        {error && (
          <div className="border border-red-800 bg-red-950/30 p-3 text-xs text-red-300 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
              Staff Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@poms-shoes.com"
              autoComplete="username"
              className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full text-xs"
          >
            {loading ? "Verifying Session..." : "Access Admin Portal"}{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="pt-4 border-t border-[var(--border)]/40 text-center">
          <p className="text-[11px] text-[var(--foreground-muted)]">
            First time setup?{" "}
            <a
              href="/admin/setup"
              className="text-[var(--gold)] hover:underline font-medium"
            >
              Initialize Owner Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}