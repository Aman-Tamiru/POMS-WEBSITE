import type { Metadata } from "next";
import { AlertCircle, Ruler } from "lucide-react";

export const metadata: Metadata = {
  title: "International Shoe Size Guide",
  description: "Official POM'S footwear size conversion table covering EU, UK, US, and Centimeter standards.",
};

const sizeRows = [
  { eu: "35", uk: "2.5", us: "4.5", cm: "22.5", inches: "8.8" },
  { eu: "36", uk: "3.5", us: "5.5", cm: "23.0", inches: "9.0" },
  { eu: "37", uk: "4.0", us: "6.0", cm: "23.8", inches: "9.3" },
  { eu: "38", uk: "5.0", us: "7.0", cm: "24.5", inches: "9.6" },
  { eu: "39", uk: "6.0", us: "8.0", cm: "25.1", inches: "9.8" },
  { eu: "40", uk: "6.5", us: "8.5", cm: "25.8", inches: "10.1" },
  { eu: "41", uk: "7.5", us: "9.5", cm: "26.5", inches: "10.4" },
  { eu: "42", uk: "8.0", us: "10.0", cm: "27.1", inches: "10.6" },
  { eu: "43", uk: "9.0", us: "11.0", cm: "27.8", inches: "10.9" },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:px-10 lg:py-24 space-y-12">
      <div className="border-b border-[var(--border)] pb-8 text-center max-w-3xl mx-auto space-y-3">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Measurement &amp; Fitting
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[var(--foreground)]">
          International Shoe Size Guide
        </h1>
        <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
          Compare sizing across European (EU), British (UK), American (US), and foot length measurements in Centimeters.
        </p>
      </div>

      {/* Sizing Table */}
      <div className="border border-[var(--border)] bg-[var(--surface)] overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)] text-[var(--gold)] font-serif uppercase tracking-widest">
              <th className="p-4 font-semibold">EU Size</th>
              <th className="p-4 font-semibold">UK Size</th>
              <th className="p-4 font-semibold">US Size</th>
              <th className="p-4 font-semibold">Foot Length (CM)</th>
              <th className="p-4 font-semibold">Foot Length (Inches)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/40 text-[var(--foreground)]">
            {sizeRows.map((row) => (
              <tr key={row.eu} className="hover:bg-[var(--surface-hover)] transition">
                <td className="p-4 font-mono font-bold text-[var(--gold)]">{row.eu}</td>
                <td className="p-4 font-mono">{row.uk}</td>
                <td className="p-4 font-mono">{row.us}</td>
                <td className="p-4 font-mono">{row.cm} cm</td>
                <td className="p-4 font-mono">{row.inches} in</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fitting Advice & Critical Fit Warning */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
          <div className="flex items-center gap-2 text-[var(--gold)]">
            <Ruler className="h-5 w-5" />
            <h2 className="font-serif text-lg font-bold">How to Measure Your Foot</h2>
          </div>
          <ol className="text-xs text-[var(--foreground-muted)] space-y-2 list-decimal pl-4 leading-relaxed">
            <li>Place a blank sheet of paper on a hard floor against a straight wall.</li>
            <li>Stand upright with your heel resting gently against the wall.</li>
            <li>Mark the tip of your longest toe on the paper with a pencil held vertically.</li>
            <li>Measure the distance from the edge of the paper to the marked point in centimeters.</li>
            <li>Compare your measurement against the chart above.</li>
          </ol>
        </div>

        <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertCircle className="h-5 w-5" />
            <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">Silhouette Fit Variations</h2>
          </div>
          <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
            <strong className="text-[var(--foreground)]">Pointed Toe Flats &amp; Pumps:</strong> Pointed toe silhouettes feature a narrower toe box. Clients with wider feet often prefer ordering one half to one full size up.
          </p>
          <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
            <strong className="text-[var(--foreground)]">Open Slides &amp; Sandals:</strong> True to size. The contoured footbed accommodates standard European widths.
          </p>
          <p className="text-[11px] text-[var(--gold)] italic">
            * Note: Shoe sizing may vary slightly depending on leather elasticity, lining, and construction lasts.
          </p>
        </div>
      </div>
    </div>
  );
}
