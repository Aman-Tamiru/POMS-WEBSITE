"use client";

import { useState, FormEvent } from "react";
import { Package, Globe2, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export default function WholesalePage() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    companyName: "",
    buyerName: "",
    email: "",
    phone: "",
    country: "United States",
    freightMethod: "Air Freight (FOB)",
    targetCartons: "10 Cartons (120 Pairs)",
    modelsOfInterest: "",
    notes: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/public-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "wholesale", ...form }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your inquiry could not be submitted.");
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-10 lg:py-24 space-y-16">
      <div className="border-b border-[var(--border)] pb-8 text-center max-w-3xl mx-auto space-y-3">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          B2B Global Trade
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[var(--foreground)]">
          International Wholesale &amp; Bulk Distribution
        </h1>
        <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
          Partner directly with POM&apos;S for container-tier or carton-tier luxury footwear supply. We manufacture and export worldwide with standardized packaging and locked currency contracts.
        </p>
      </div>

      {/* 3 Core Packaging Standards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 space-y-4">
          <Package className="h-8 w-8 text-[var(--gold)]" />
          <h2 className="font-serif text-xl text-[var(--foreground)]">Carton Packaging Specs</h2>
          <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
            Standard export cartons contain 12 or 24 pairs. Balanced size ratios (EU 36 to 42) or customized size breakdowns are available on request.
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 space-y-4">
          <Globe2 className="h-8 w-8 text-[var(--gold)]" />
          <h2 className="font-serif text-xl text-[var(--foreground)]">Multi-Currency Quoting</h2>
          <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
            Quotations issued in USD, ETB, CNY, INR, and EUR. Price locks protect your margin against currency volatility during production.
          </p>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 space-y-4">
          <FileText className="h-8 w-8 text-[var(--gold)]" />
          <h2 className="font-serif text-xl text-[var(--foreground)]">Downloadable PDF Catalogue</h2>
          <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
            Export a comprehensive B2B PDF catalogue with hi-res photos, materials, MOQs, and carton volume data directly from our platform.
          </p>
        </div>
      </div>

      {/* Wholesale Inquiry Form */}
      <div className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-14">
        {submitted ? (
          <div className="text-center space-y-6 py-8">
            <CheckCircle2 className="h-16 w-16 text-[var(--gold)] mx-auto" />
            <h2 className="font-serif text-3xl text-[var(--foreground)]">Wholesale Inquiry Received</h2>
            <p className="max-w-md mx-auto text-sm text-[var(--foreground-muted)]">
              Thank you, <strong className="text-[var(--foreground)]">{form.buyerName}</strong>. Our international export director will prepare a formal quotation for <strong className="text-[var(--foreground)]">{form.companyName}</strong> within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-gold-outline text-xs mt-4"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-[var(--border)] pb-4">
              <h2 className="font-serif text-2xl text-[var(--foreground)]">Request Wholesale Pro-Forma Quotation</h2>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                Fill in your commercial details to receive an itemized wholesale proposal.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                  Company / Boutique Name <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="e.g. Royal Footwear Distributors LLC"
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                  Buyer / Representative Name <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.buyerName}
                  onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                  placeholder="Full Name"
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                  Business Email <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="buyer@company.com"
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                  Phone / WhatsApp <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 ... or +251 ..."
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                  Destination Country <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder="e.g. United States, UAE, UK"
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                  Preferred Freight Method
                </label>
                <select
                  value={form.freightMethod}
                  onChange={(e) => setForm({ ...form, freightMethod: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                >
                  <option value="Air Freight (FOB)">Air Cargo (FOB Bole Airport Addis Ababa)</option>
                  <option value="Sea Freight (FOB)">Sea Freight Container (FOB Djibouti)</option>
                  <option value="Express Courier">Express Courier (DHL/FedEx)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                  Target Quantity
                </label>
                <input
                  type="text"
                  value={form.targetCartons}
                  onChange={(e) => setForm({ ...form, targetCartons: e.target.value })}
                  placeholder="e.g. 20 Cartons (240 Pairs)"
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                Footwear Lines of Interest &amp; Customization Notes
              </label>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Specify models, leather choices, packaging branding, or target delivery timeframe..."
                className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>

            {submitError && (
              <p role="alert" className="border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
                {submitError}
              </p>
            )}
            <button type="submit" disabled={saving} className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Submitting inquiry..." : "Transmit Wholesale Inquiry"}
              {!saving && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
