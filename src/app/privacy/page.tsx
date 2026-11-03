import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "POM'S international data protection, customer privacy policy, and confidential design handling.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-10 lg:py-24 space-y-10 text-xs leading-relaxed text-[var(--foreground-muted)]">
      <div className="border-b border-[var(--border)] pb-6 text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl text-[var(--foreground)]">Privacy Policy</h1>
        <p className="text-[11px] text-[var(--gold)] uppercase tracking-widest">
          Effective Date: November 1, 2026 · POM&apos;S International Footwear
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-lg text-[var(--foreground)] font-semibold">1. Customer Privacy Commitment</h2>
        <p>
          At POM&apos;S, we treat your personal information, footwear measurements, bespoke design sketches, and commercial wholesale inquiries with strict confidentiality. Customer information is never sold, leased, or disclosed to third parties.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-lg text-[var(--foreground)] font-semibold">2. Proprietary Design Isolation</h2>
        <p>
          Bespoke shoe sketches and reference photographs uploaded to our custom design portal are stored in secured private cloud storage. PostgreSQL Row-Level Security (RLS) ensures that design references are visible strictly to you and authorized POM&apos;S master craft staff.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-lg text-[var(--foreground)] font-semibold">3. Data Retention &amp; Security</h2>
        <p>
          All electronic communications and financial transaction records are encrypted in transit via TLS 1.3 and at rest via AES-256 standards. You may request deletion or export of your personal profile at any time by contacting our privacy compliance desk.
        </p>
      </div>
    </div>
  );
}
