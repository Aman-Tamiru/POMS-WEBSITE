"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ExternalLink, Maximize2, X } from "lucide-react";

type PomsImageLightboxProps = {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
};

export default function PomsImageLightbox({
  src,
  alt,
  className = "",
  aspectRatio = "portrait",
}: PomsImageLightboxProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    landscape: "aspect-[16/10]",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge image: ${alt}`}
        className={`group relative block w-full overflow-hidden bg-[var(--surface)] ${aspectClasses[aspectRatio]} ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center border border-white/40 bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged image: ${alt}`}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center border border-white/30 text-white transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative h-[80vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
              priority
            />

            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 inline-flex items-center gap-2 border border-white/40 bg-black/70 px-4 py-3 text-[10px] uppercase tracking-widest text-white transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              View original
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
