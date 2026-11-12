
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PomsEditorialBandProps = {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  variant?: "dark" | "light";
};

export default function PomsEditorialBand({
  eyebrow,
  title,
  description,
  buttonLabel,
  href,
}: PomsEditorialBandProps) {
  return (
    <section className="poms-editorial-band poms-editorial-theme-aware relative overflow-hidden">
      <div className="poms-editorial-orb" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-10 md:py-24 lg:grid-cols-[1fr_auto] lg:items-end lg:px-16">
        <div className="max-w-3xl">
          <p className="poms-editorial-eyebrow mb-5 text-[10px] font-semibold uppercase tracking-[0.4em] sm:text-xs">
            {eyebrow}
          </p>

          <h2 className="poms-editorial-title font-serif text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h2>

          <p className="poms-editorial-description mt-6 max-w-2xl text-sm leading-8 sm:text-base">
            {description}
          </p>
        </div>

        <Link
          href={href}
          className="poms-editorial-cta group inline-flex w-fit items-center gap-5 border-b border-[var(--gold)] pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors"
        >
          {buttonLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
