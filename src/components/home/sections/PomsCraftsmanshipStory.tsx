
"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import PomsReveal from "@/components/brand/PomsReveal";

interface Props {
  imageUrl?: string | null;
  imageAlt?: string;
}

export default function PomsCraftsmanshipStory({
  imageUrl,
  imageAlt = "POM'S International footwear design",
}: Props) {
  return (
    <section className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto grid max-w-[1600px] lg:min-h-[680px] lg:grid-cols-2">

        <div className="relative flex items-center px-6 py-20 sm:px-12 lg:px-16 xl:px-24">
          <PomsReveal direction="up">
            <div className="max-w-xl">

              <div className="mb-8 inline-flex items-center gap-3">
                <span className="h-px w-10 bg-[var(--gold)]" />
                <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                <span className="text-[9px] uppercase tracking-[0.32em] text-[var(--gold)]">
                  Our Ethiopian Identity
                </span>
              </div>

              <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[var(--foreground-muted)]">
                POM&apos;S INTERNATIONAL · ADDIS ABABA
              </p>

              <h2 className="font-serif text-4xl font-light leading-[1.12] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Rooted in Ethiopia.
                <br />
                <span className="italic text-[var(--gold)]">
                  Designed to travel.
                </span>
              </h2>

              <div className="my-8 flex items-center gap-3">
                <span className="h-px w-14 bg-[var(--gold)]" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
              </div>

              <p className="text-sm leading-8 text-[var(--foreground-muted)] sm:text-base">
                From Addis Ababa, POM&apos;S International brings a distinctive
                footwear vision to an international audience. Our approach
                brings together thoughtful design, considered details and
                opportunities for creative collaboration.
              </p>

              <p className="mt-5 text-sm leading-8 text-[var(--foreground-muted)] sm:text-base">
                We believe every design should express individuality.
                Whether discovering our collections or developing a
                bespoke concept, every conversation begins with your vision.
              </p>

              <div className="mt-10 flex flex-wrap gap-6">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 border-b border-[var(--gold)] pb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:text-[var(--gold)]"
                >
                  Discover our story
                  <ArrowUpRight size={15} />
                </Link>

                <Link
                  href="/custom-design"
                  className="inline-flex items-center gap-3 border-b border-[var(--border)] pb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  Explore bespoke design
                  <ArrowUpRight size={15} />
                </Link>
              </div>

            </div>
          </PomsReveal>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-[var(--surface)] lg:min-h-full">
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={imageAlt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-contain p-8 transition-transform duration-1000 hover:scale-[1.04] sm:p-14 lg:p-16"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="font-serif text-8xl text-[var(--gold)]/50">
                  P
                </span>
                <p className="mt-4 text-[9px] uppercase tracking-[0.4em] text-[var(--foreground-muted)]">
                  POM&apos;S INTERNATIONAL
                </p>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/10 bg-black/65 px-6 py-5 backdrop-blur-sm sm:px-10">
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/80">
              Design · Identity · Expression
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#d1b276]">
              Addis Ababa · Ethiopia
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
