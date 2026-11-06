
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, X, ExternalLink } from "lucide-react";

interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shoe_type: string;
  materials: string[] | null;
  colors: string[] | null;
  minimum_order_quantity: number | null;
  package_quantity: number | null;
}

interface ProductImage {
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

interface Props {
  collection: Collection;
  products: Product[];
  images: ProductImage[];
  productError: boolean;
  imageError: boolean;
}

export default function CollectionDetailClient({
  collection,
  products,
  images,
  productError,
  imageError,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);

  const getProductImage = (productId: string) =>
    images
      .filter((image) => image.product_id === productId)
      .sort((a, b) => {
        if (a.is_primary !== b.is_primary) {
          return a.is_primary ? -1 : 1;
        }
        return a.display_order - b.display_order;
      })[0] ?? null;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <Link
          href="/collection"
          className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--gold)] transition hover:opacity-70"
        >
          <ArrowLeft size={15} />
          All Collections
        </Link>

        <div className="mb-14 border-b border-[var(--border)] pb-10">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
          POM&apos;S INTERNATIONAL
          </p>

          <h1 className="mb-5 font-serif text-4xl font-light tracking-wide md:text-6xl">
            {collection.name}
          </h1>

          {collection.description && (
            <p className="max-w-2xl text-sm leading-7 text-[var(--foreground-muted)] md:text-base">
              {collection.description}
            </p>
          )}

          <p className="mt-5 text-xs uppercase tracking-widest text-[var(--foreground-muted)]">
            {products.length} {products.length === 1 ? "Model" : "Models"}
          </p>
        </div>

        {productError ? (
          <div className="border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">
              Products could not be loaded. Please try again later.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <h2 className="mb-3 font-serif text-2xl">
              More designs are coming
            </h2>
            <p className="text-sm text-[var(--foreground-muted)]">
              This collection does not have published products yet.
            </p>
            <Link
              href="/catalogue"
              className="btn-gold-outline mt-6 inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest"
            >
              Explore Catalogue <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const image = getProductImage(product.id);

              return (
                <article
                  key={product.id}
                  className="border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--gold)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      image &&
                      setSelectedImage({
                        url: image.image_url,
                        alt: image.alt_text || product.name,
                      })
                    }
                    disabled={!image}
                    aria-label={`View larger image of ${product.name}`}
                    className="relative mb-5 flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-[var(--background-secondary)] disabled:cursor-default"
                  >
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.image_url}
                        alt={image.alt_text || product.name}
                        className="h-full w-full object-contain p-3 transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <span className="text-xs text-[var(--foreground-muted)]">
                        Product image unavailable
                      </span>
                    )}

                    {image && (
                      <span className="absolute bottom-3 right-3 bg-black/75 px-3 py-2 text-[10px] uppercase tracking-widest text-white">
                        Click to enlarge
                      </span>
                    )}
                  </button>

                  <p className="mb-2 text-[10px] uppercase tracking-widest text-[var(--gold)]">
                    {product.shoe_type}
                  </p>

                  <h2 className="font-serif text-xl">
                    {product.name}
                  </h2>

                  <div className="mt-3 space-y-2 text-xs text-[var(--foreground-muted)]">
                    <p>
                      <span className="text-[var(--foreground)]">Materials: </span>
                      {product.materials?.join(", ") || "Contact for details"}
                    </p>

                    <p>
                      <span className="text-[var(--foreground)]">Colors: </span>
                      {product.colors?.join(", ") || "Contact for details"}
                    </p>

                    <p>
                      <span className="text-[var(--foreground)]">Package: </span>
                      {product.package_quantity ?? 0} pairs per carton
                    </p>

                    <p>
                      <span className="text-[var(--foreground)]">MOQ: </span>
                      {product.minimum_order_quantity ?? 1}
                    </p>
                  </div>

                  <Link
                    href="/custom-design"
                    className="btn-gold-outline mt-6 inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-xs uppercase tracking-widest"
                  >
                    Request Quotation <ArrowRight size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {imageError && (
          <p className="mt-6 text-center text-xs text-[var(--foreground-muted)]">
            Some product images could not be loaded.
          </p>
        )}
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-5 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged product image"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            aria-label="Close enlarged image"
            className="absolute right-5 top-5 z-10 border border-white/30 p-3 text-white hover:border-[var(--gold)]"
          >
            <X size={22} />
          </button>

          <div
            className="flex max-h-full max-w-5xl flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-h-[78vh] max-w-full object-contain"
            />

            <a
              href={selectedImage.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[var(--gold)] px-5 py-3 text-xs uppercase tracking-widest text-white hover:bg-[var(--gold)] hover:text-black"
            >
              Open Original Image <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
