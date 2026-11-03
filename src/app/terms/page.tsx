import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "POM'S commercial terms, custom footwear deposit rules, and wholesale contract guidelines.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-10 lg:py-24 space-y-10 text-xs leading-relaxed text-[var(--foreground-muted)]">
      <div className="border-b border-[var(--border)] pb-6 text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl text-[var(--foreground)]">Terms &amp; Conditions</h1>
        <p className="text-[11px] text-[var(--gold)] uppercase tracking-widest">
          Effective Date: November 1, 2026 · POM&apos;S International Footwear
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-lg text-[var(--foreground)] font-semibold">1. Bespoke Production &amp; Deposits</h2>
        <p>
          Custom made-to-order footwear is handcrafted specifically to agreed individual measurements and leather selections. A non-refundable deposit (typically 50% of the agreed quotation) is required before pattern cutting and assembly commences.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-lg text-[var(--foreground)] font-semibold">2. Wholesale Quotations &amp; Validity</h2>
        <p>
          All commercial pro-forma quotations issued for wholesale carton purchases remain valid for the period specified on the quotation document (typically 30 calendar days). Prices lock upon receipt of the agreed deposit or commercial letter of credit.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-lg text-[var(--foreground)] font-semibold">3. Freight, Customs &amp; Tariffs</h2>
        <p>
          Unless explicitly stipulated under a DDP (Delivered Duty Paid) agreement, import customs tariffs, clearance surcharges, and destination country taxes are the sole responsibility of the consignee.
        </p>
      </div>
    </div>
  );
}
