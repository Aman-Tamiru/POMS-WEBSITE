import type { Metadata } from "next";
import { Plane, Ship, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "International Shipping & Freight Information",
  description: "POM'S official international freight guidelines, air cargo terms, customs disclosures, and lead times.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-10 lg:py-24 space-y-12">
      <div className="border-b border-[var(--border)] pb-8 text-center max-w-2xl mx-auto space-y-3">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Export &amp; Logistics
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[var(--foreground)]">
          Shipping &amp; Customs Information
        </h1>
        <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
          Official freight procedures for retail customers, bespoke made-to-order pairs, and wholesale export consignments dispatched from Addis Ababa, Ethiopia.
        </p>
      </div>

      {/* Shipping Tiers */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 space-y-4">
          <Plane className="h-8 w-8 text-[var(--gold)]" />
          <h2 className="font-serif text-xl text-[var(--foreground)]">Air Cargo (Express &amp; Freight)</h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            Direct air freight dispatched via Ethiopian Cargo &amp; Logistics or express international courier (DHL Express / FedEx). Ideal for bespoke sample runs, small boutique orders, and high-priority cartons.
          </p>
          <ul className="text-xs text-[var(--foreground-muted)] space-y-1 pt-2 list-disc pl-4">
            <li>Middle East &amp; Gulf: 3–6 business days</li>
            <li>Europe &amp; UK: 4–7 business days</li>
            <li>North America &amp; Asia: 6–10 business days</li>
          </ul>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 space-y-4">
          <Ship className="h-8 w-8 text-[var(--gold)]" />
          <h2 className="font-serif text-xl text-[var(--foreground)]">Ocean Freight (FCL / LCL)</h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            Full Container Load (FCL) and Less than Container Load (LCL) dispatched via the Port of Djibouti. Optimized for volume wholesale buyers, multi-carton seasonal stock, and national retail chains.
          </p>
          <ul className="text-xs text-[var(--foreground-muted)] space-y-1 pt-2 list-disc pl-4">
            <li>Red Sea &amp; Mediterranean: 14–22 days</li>
            <li>Western Europe: 20–30 days</li>
            <li>East Coast USA &amp; Asia: 28–40 days</li>
          </ul>
        </div>
      </div>

      {/* Customs & Duties Disclosure */}
      <div className="border border-[var(--border)] bg-[var(--surface)] p-8 space-y-4">
        <div className="flex items-center gap-2 text-[var(--gold)]">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="font-serif text-lg font-bold">Import Customs, Tariffs &amp; Taxes Disclosure</h2>
        </div>
        <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
          Unless explicitly agreed upon in a Delivered Duty Paid (DDP) pro-forma contract, all customs clearance fees, import tariffs, value-added taxes (VAT), or inspection levies assessed by the destination country are the sole commercial responsibility of the receiving buyer or importer.
        </p>
        <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
          POM&apos;S provides full export documentation—including Commercial Invoices, Packing Lists, Certificates of Origin (COO), and Air Waybills (AWB)—to facilitate seamless customs clearance.
        </p>
      </div>

      {/* Production Lead Times */}
      <div className="border border-[var(--border)] bg-[var(--background-secondary)] p-6 text-xs text-[var(--foreground-muted)] space-y-2">
        <p className="text-[var(--gold)] font-serif font-semibold text-sm">
          Production Lead Time Notice
        </p>
        <p>
          Custom bespoke pairs typically require 10 to 18 working days of handcrafting prior to dispatch. Wholesale carton production lead times depend on total pairs and raw material availability, confirmed upon pro-forma deposit verification.
        </p>
      </div>
    </div>
  );
}
