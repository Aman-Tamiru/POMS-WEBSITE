
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface ProductGalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
}

interface Props {
  images: ProductGalleryImage[];
  productName: string;
}

export default function PomsProductGallery({
  images,
  productName,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = images[activeIndex];

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowRight" && images.length > 1) {
        setActiveIndex((current) => (current + 1) % images.length);
      }

      if (event.key === "ArrowLeft" && images.length > 1) {
        setActiveIndex(
          (current) => (current - 1 + images.length) % images.length
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, images.length]);

  if (!images.length) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center border border-[var(--border)] bg-[var(--surface)]">
        <span className="font-serif text-sm italic text-[var(--foreground-muted)]">
          Product photography coming soon
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative block aspect-[4/5] w-full overflow-hidden bg-[var(--surface)]"
        aria-label={`Enlarge ${productName} photograph`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage.image_url}
          alt={activeImage.alt_text || productName}
          className="h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-[1.03]"
        />

        <span className="absolute bottom-5 right-5 border border-white/30 bg-black/75 px-4 py-3 text-[9px] uppercase tracking-widest text-white">
          Enlarge photograph
        </span>
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View product image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`aspect-square overflow-hidden border bg-[var(--surface)] ${
                activeIndex === index
                  ? "border-[var(--gold)]"
                  : "border-[var(--border)]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.image_url}
                alt={image.alt_text || `${productName} view ${index + 1}`}
                className="h-full w-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image viewer`}
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/10 p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 z-20 rounded-full border border-[var(--border)] bg-[var(--background)]/80 p-3 text-[var(--foreground)]"
          >
            <X size={22} />
          </button>

          <div
            className="relative flex h-[92vh] w-full items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (activeIndex - 1 + images.length) % images.length
                    )
                  }
                  aria-label="Previous image"
                  className="absolute left-2 z-10 rounded-full bg-[var(--background)]/80 p-3 text-[var(--foreground)]"
                >
                  <ChevronLeft />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((activeIndex + 1) % images.length)
                  }
                  aria-label="Next image"
                  className="absolute right-2 z-10 rounded-full bg-[var(--background)]/80 p-3 text-[var(--foreground)]"
                >
                  <ChevronRight />
                </button>
              </>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.image_url}
              alt={activeImage.alt_text || productName}
              className="max-h-[90vh] max-w-[92vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
