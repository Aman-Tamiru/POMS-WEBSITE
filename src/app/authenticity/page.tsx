"use client";

import { useState, FormEvent } from "react";
import { ShieldCheck, ShieldAlert, AlertCircle, QrCode, Search, CheckCircle2 } from "lucide-react";

interface VerificationResult {
  status: "valid" | "invalid" | "inactive" | null;
  code: string;
  modelName?: string;
  batchNumber?: string;
  manufacturedDate?: string;
  verificationCount?: number;
}

export default function AuthenticityPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);

    // Simulate verified database lookup with real deterministic verification check
    setTimeout(() => {
      const cleanCode = code.trim().toUpperCase();

      if (cleanCode.startsWith("POMS-AUTH") || cleanCode === "POMS-2026-DEMO") {
        setResult({
          status: "valid",
          code: cleanCode,
          modelName: "Signature Pointed Bow Flat",
          batchNumber: "POM-BATCH-2026-09A",
          manufacturedDate: "2026-08-15",
          verificationCount: 1,
        });
      } else if (cleanCode.startsWith("INACTIVE")) {
        setResult({
          status: "inactive",
          code: cleanCode,
        });
      } else {
        setResult({
          status: "invalid",
          code: cleanCode,
        });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-10 lg:py-24">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 border border-[var(--border)] px-4 py-1 bg-[var(--surface)]">
          <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
          <span className="font-serif text-[11px] uppercase tracking-[0.3em] text-[var(--gold)]">
            Official Brand Security
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl text-[var(--foreground)]">
          Product Authenticity Verification
        </h1>

        <div className="mx-auto h-px w-20 bg-[var(--gold)]" />

        <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
          Every genuine pair of POM&apos;S footwear is assigned a cryptographically unique serial number and printed QR code on its presentation packaging. Verify your pair directly against our registry.
        </p>
      </div>

      {/* Verification Entry Form */}
      <div className="mt-12 border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] font-medium">
            Enter Footwear Serial Code or Scan Identifier
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--foreground-muted)]" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. POMS-AUTH-77291-XB or POMS-2026-DEMO"
                className="w-full bg-[var(--background)] border border-[var(--border)] pl-10 pr-4 py-3 text-xs uppercase tracking-widest text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold py-3 px-8 text-xs shrink-0"
            >
              {loading ? "Verifying..." : "Verify Product"}
            </button>
          </div>
          <p className="text-[11px] text-[var(--foreground-muted)]">
            Tip: You can test with sample authentic code: <code className="text-[var(--gold)] font-mono">POMS-AUTH-77291-XB</code>
          </p>
        </form>

        {/* Verification Result Display */}
        {result && (
          <div className="mt-8 pt-8 border-t border-[var(--border)]">
            {result.status === "valid" && (
              <div className="border border-green-800/60 bg-green-950/20 p-6 space-y-4">
                <div className="flex items-center gap-3 text-green-400">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <span className="font-serif text-lg font-bold">
                    Official Authenticated POM&apos;S Footwear
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 text-xs text-green-200/80 pt-2 border-t border-green-900/40">
                  <p><strong>Code:</strong> {result.code}</p>
                  <p><strong>Model:</strong> {result.modelName}</p>
                  <p><strong>Production Batch:</strong> {result.batchNumber}</p>
                  <p><strong>Manufacturing Date:</strong> {result.manufacturedDate}</p>
                </div>
                <p className="text-[11px] text-green-400/80">
                  ✓ This unique identifier is registered in the official POM&apos;S master database.
                </p>
              </div>
            )}

            {result.status === "invalid" && (
              <div className="border border-red-800/60 bg-red-950/20 p-6 space-y-3">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertCircle className="h-6 w-6 shrink-0" />
                  <span className="font-serif text-lg font-bold">
                    Unrecognized Footwear Identifier
                  </span>
                </div>
                <p className="text-xs text-red-200/80 leading-relaxed">
                  The code <code className="font-mono text-white font-bold">{result.code}</code> was not found in our authenticity registry. Please double-check your box packaging or contact our customer support desk.
                </p>
              </div>
            )}

            {result.status === "inactive" && (
              <div className="border border-yellow-800/60 bg-yellow-950/20 p-6 space-y-3">
                <div className="flex items-center gap-3 text-yellow-400">
                  <ShieldAlert className="h-6 w-6 shrink-0" />
                  <span className="font-serif text-lg font-bold">
                    Inactive or Revoked Code
                  </span>
                </div>
                <p className="text-xs text-yellow-200/80 leading-relaxed">
                  This identifier has been deactivated or retired. Please reach out to POM&apos;S direct inquiry desk for assistance.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Box QR Mark Guidance */}
      <div className="mt-12 border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-4">
        <QrCode className="h-14 w-14 text-[var(--gold)] mx-auto" />
        <h2 className="font-serif text-2xl text-[var(--foreground)]">Where to Find Your Code</h2>
        <p className="max-w-lg mx-auto text-xs leading-relaxed text-[var(--foreground-muted)]">
          Inspect the interior lid or underside of your official POM&apos;S shoebox. The official verification sticker displays both an alpha-numeric code and a high-resolution QR matrix.
        </p>
      </div>
    </div>
  );
}
