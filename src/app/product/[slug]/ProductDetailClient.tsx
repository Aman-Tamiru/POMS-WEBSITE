
"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Package } from "lucide-react";
import PomsProductGallery, {
  ProductGalleryImage,
} from "@/components/product/PomsProductGallery";

interface Product {
  id: string;
  name: string;
  slug: string;
  shoe_type: string;
  description: string | null;
  materials: string[] | null;
  colors: string[] | null;
  sizes_available: string[] | null;
  minimum_order_quantity: number | null;
  package_quantity: number | null;
  is_wholesale_available: boolean;
  is_price_on_request: boolean;
  base_price: number | null;
  currency: string | null;
}

interface Props {
  product: Product;
  images: ProductGalleryImage[];
  collection: { name: string; slug: string } | null;
}

export default function ProductDetailClient({
  product,
  images,
  collection,
}: Props) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-10 lg:px-16">
        <nav className="mb-10 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
          <Link href="/" className="hover:text-[var(--gold)]">Home</Link>
          <span>/</span>
          <Link href="/catalogue" className="hover:text-[var(--gold)]">Catalogue</Link>
          <span>/</span>
          <span className="text-[var(--gold)]">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <PomsProductGallery
            images={images}
            productName={product.name}
          />

          <section className="flex flex-col justify-center py-4">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">
              POM&apos;S INTERNATIONAL · {product.shoe_type}
            </p>

            <h1 className="mt-5 font-serif text-4xl font-light leading-tight sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            <div className="my-7 h-px w-20 bg-[var(--gold)]" />

            {product.description && (
              <p className="text-sm leading-8 text-[var(--foreground-muted)]">
                {product.description}
              </p>
            )}

            <div className="mt-9 space-y-5 border-y border-[var(--border)] py-7">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-[var(--gold)]">
                  Materials
                </p>
                <p className="mt-2 text-sm">
                  {product.materials?.join(", ") || "Contact for details"}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-widest text-[var(--gold)]">
                  Available colours
                </p>
                <p className="mt-2 text-sm">
                  {product.colors?.join(", ") || "Contact for details"}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-widest text-[var(--gold)]">
                  Available sizes
                </p>
                <p className="mt-2 text-sm">
                  {product.sizes_available?.join(", ") || "Contact for details"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-[var(--gold)]">
                    Minimum order
                  </p>
                  <p className="mt-2 font-serif text-2xl">
                    {product.minimum_order_quantity ?? 1} pairs
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-widest text-[var(--gold)]">
                    Package quantity
                  </p>
                  <p className="mt-2 font-serif text-2xl">
                    {product.package_quantity ?? 12} pairs
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Package className="h-5 w-5 text-[var(--gold)]" />
              <span className="text-xs text-[var(--foreground-muted)]">
                {product.is_wholesale_available
                  ? "Available for wholesale inquiries"
                  : "Contact us for availability"}
              </span>
            </div>

            <p className="mt-8 font-serif text-2xl">
              {product.is_price_on_request || product.base_price === null
                ? "Price on request"
                : `${product.currency || "USD"} ${product.base_price.toFixed(2)}`}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/custom-design?product=${encodeURIComponent(product.slug)}`}
                className="btn-gold inline-flex flex-1 items-center justify-center gap-3 px-6 py-4 text-center text-[10px] uppercase tracking-widest"
              >
                Request a quotation
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/wholesale"
                className="btn-gold-outline inline-flex items-center justify-center gap-3 px-6 py-4 text-[10px] uppercase tracking-widest"
              >
                Wholesale
              </Link>
            </div>

            {collection && (
              <Link
                href={`/collection/${collection.slug}`}
                className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] hover:text-[var(--gold)]"
              >
                <Check size={13} />
                Part of {collection.name}
              </Link>
            )}

            <Link
              href="/catalogue"
              className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--gold)]"
            >
              <ArrowLeft size={14} />
              Return to catalogue
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
