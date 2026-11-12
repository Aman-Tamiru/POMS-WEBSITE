
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PomsReveal from "@/components/brand/PomsReveal";

type PomsCollectionShowcaseProps = {
  slug: string;
  name: string;
  description: string | null;
  imageSrc: string;
  imageAlt: string;
  modelCount: number;
  modelLabel: string;
  modelsLabel: string;
  publishedLabel: string;
  browseLabel: string;
  fallbackDescription: string;
  delay?: number;
};

export default function PomsCollectionShowcase({
  slug,
  name,
  description,
  imageSrc,
  imageAlt,
  modelCount,
  modelLabel,
  modelsLabel,
  publishedLabel,
  browseLabel,
  fallbackDescription,
  delay = 0,
}: PomsCollectionShowcaseProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    setTilt({
      x: (0.5 - y) * 9,
      y: (x - 0.5) * 11,
    });
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <PomsReveal direction="up" delay={delay}>
      <article className="poms-collection-showcase group">
        <Link
          href={`/collection/${slug}`}
          className="block"
          aria-label={`${browseLabel}: ${name}`}
        >
          <div
            className="poms-collection-3d-scene"
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
          >
            <div
              className="poms-collection-3d-card"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              <div className="poms-collection-image-stage">
                <div className="poms-collection-image-glow" />

                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="poms-collection-image"
                />

                <div className="poms-collection-image-shade" />

                <span className="poms-collection-image-index">
                  POM&apos;S /{" "}
                  {String(Math.round(delay / 120) + 1).padStart(2, "0")}
                </span>

                <span className="poms-collection-image-discover">
                  {browseLabel}
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>

          <div className="poms-collection-card-details">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]">
                {publishedLabel}
              </span>

              <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
                {modelCount}{" "}
                {modelCount === 1 ? modelLabel : modelsLabel}
              </span>
            </div>

            <h2 className="mb-3 text-2xl font-light tracking-wide text-[var(--foreground)] transition-colors duration-500 group-hover:text-[var(--gold)]">
              {name}
            </h2>

            <p className="mb-6 text-sm leading-7 text-[var(--foreground-muted)]">
              {description || fallbackDescription}
            </p>

            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--gold)]">
              {browseLabel}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </span>
          </div>
        </Link>
      </article>
    </PomsReveal>
  );
}
