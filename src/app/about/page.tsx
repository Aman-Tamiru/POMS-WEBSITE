import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About POM'S",
  description: "The story, craftsmanship philosophy, and international vision behind POM'S luxury footwear.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-10 lg:py-24 space-y-16">
      <div className="border-b border-[var(--border)] pb-8 text-center max-w-2xl mx-auto space-y-3">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Brand Philosophy
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[var(--foreground)]">
          About POM&apos;S Footwear
        </h1>
        <div className="mx-auto h-px w-20 bg-[var(--gold)]" />
        <p className="font-serif text-lg italic text-[var(--gold)]">
          &ldquo;Elegance in every step, Confidence in every you.&rdquo;
        </p>
      </div>

      {/* Narrative Section */}
      <div className="space-y-8 text-sm leading-relaxed text-[var(--foreground-muted)]">
        <div className="border-l-2 border-[var(--gold)] pl-6 space-y-3">
          <h2 className="font-serif text-2xl text-[var(--foreground)]">The Craftsmanship Vision</h2>
          <p>
            POM&apos;S was established with a singular objective: to create women&apos;s footwear that marries architectural elegance with uncompromising daily comfort. Based in Addis Ababa with an international perspective, our designs highlight refined pointed silhouettes, hand-finished embellishments, and artisanal leathers.
          </p>
        </div>

        <div className="border-l-2 border-[var(--gold)] pl-6 space-y-3">
          <h2 className="font-serif text-2xl text-[var(--foreground)]">Made for Your Vision</h2>
          <p>
            Unlike mass-production retailers, POM&apos;S bridges the gap between ready-to-wear luxury collections and bespoke footwear engineering. Our custom design studio allows discerning clients worldwide to collaborate directly with our shoemakers, selecting their preferred leather grades, sole profiles, and heel heights.
          </p>
        </div>

        <div className="border-l-2 border-[var(--gold)] pl-6 space-y-3">
          <h2 className="font-serif text-2xl text-[var(--foreground)]">Global Wholesale &amp; Quality Commitment</h2>
          <p>
            As an expanding international brand, POM&apos;S supplies boutique owners, fashion department stores, and regional footwear distributors. Every carton leaving our workshop is built to rigorous structural tolerances, verified with unique authenticity codes, and packaged for dependable international delivery.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 text-center space-y-6">
        <Sparkles className="h-10 w-10 text-[var(--gold)] mx-auto" />
        <h2 className="font-serif text-3xl text-[var(--foreground)]">Experience POM&apos;S</h2>
        <p className="max-w-md mx-auto text-xs text-[var(--foreground-muted)]">
          Explore our current catalogue or submit a custom footwear design inquiry today.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link href="/catalogue" className="btn-gold text-xs">
            Explore Footwear <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/custom-design" className="btn-gold-outline text-xs">
            Start Custom Design
          </Link>
        </div>
      </div>
    </div>
  );
}
