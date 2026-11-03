"use client";

import { useState, FormEvent } from "react";
import { ShieldAlert, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

export default function AdminSetupPage() {
  const [bootstrapKey, setBootstrapKey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleBootstrap = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bootstrapKey,
          email,
          password,
          fullName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize owner account");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An error occurred during setup."
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--gold)]">
            <Lock className="h-6 w-6" />
          </div>
          <p className="font-serif text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
            Initial Owner Bootstrap
          </p>
          <h1 className="font-serif text-2xl text-[var(--foreground)]">
            Provision Master Admin
          </h1>
          <p className="text-xs text-[var(--foreground-muted)]">
            One-time server setup for the POM&apos;S business owner.
          </p>
        </div>

        {status === "success" ? (
          <div className="border border-green-800 bg-green-950/20 p-6 text-center space-y-4 text-xs text-green-200">
            <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto" />
            <p className="font-bold text-sm text-green-300">Owner Account Initialized!</p>
            <p>You can now sign in to the mobile admin portal using your credentials.</p>
            <div className="pt-2">
              <Link href="/admin/login" className="btn-gold w-full text-xs">
                Proceed to Admin Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBootstrap} className="space-y-4">
            {status === "error" && (
              <div className="border border-red-800 bg-red-950/30 p-3 text-xs text-red-300 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                Bootstrap Secret Key <span className="text-[var(--gold)]">*</span>
              </label>
              <input
                type="password"
                required
                value={bootstrapKey}
                onChange={(e) => setBootstrapKey(e.target.value)}
                placeholder="From your .env.local ADMIN_BOOTSTRAP_TOKEN"
                className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                Owner Email <span className="text-[var(--gold)]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@poms-shoes.com"
                className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                Owner Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Master Artisan / Owner"
                className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                Master Password <span className="text-[var(--gold)]">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-gold w-full text-xs"
            >
              {status === "loading" ? "Initializing..." : "Create Owner Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
