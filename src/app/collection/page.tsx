
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Curated women's luxury footwear lines by POM'S. Pointed flats, slippers, and artisanal slides.",
};

export const dynamic = "force-dynamic";

interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  display_order: number;
}

interface CollectionProduct {
  collection_id: string;
}

export default async function CollectionsPage() {
  const supabase = await createClient();

  const { data: collectionData, error: collectionError } = await supabase
    .from("collections")
    .select(
      "id, slug, name, description, cover_image_url, display_order"
    )
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  const collections = (collectionData ?? []) as Collection[];

  let productCounts: Record<string, number> = {};
  let productCountError = false;

  if (collections.length > 0 && !collectionError) {
    const collectionIds = collections.map((collection) => collection.id);

    const { data: productData, error: productsError } = await supabase
      .from("products")
      .select("collection_id")
      .in("collection_id", collectionIds)
      .eq("is_published", true)
      .eq("is_archived", false);

    if (productsError) {
      productCountError = true;
    } else {
      const products = (productData ?? []) as CollectionProduct[];

      productCounts = products.reduce<Record<string, number>>(
        (counts, product) => {
          if (product.collection_id) {
            counts[product.collection_id] =
              (counts[product.collection_id] ?? 0) + 1;
          }

          return counts;
        },
        {}
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:py-24">
      {/* PAGE INTRODUCTION */}
      <div className="border-b border-[var(--border)] pb-8">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Curation
        </p>

        <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-[var(--foreground)]">
          POM&apos;S Footwear Collections
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--foreground-muted)]">
          Explore our seasonal edits and signature designs. Each collection
          is engineered for comfort, structural longevity, and international
          luxury appeal.
        </p>
      </div>

      {/* COLLECTIONS */}
      {collectionError ? (
        <div className="mt-12 border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
          <p className="font-serif text-xl text-[var(--foreground)]">
            Collections are temporarily unavailable.
          </p>

          <p className="mt-3 text-sm text-[var(--foreground-muted)]">
            Please try again later.
          </p>
        </div>
      ) : collections.length === 0 ? (
        <div className="mt-12 border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
          <h2 className="font-serif text-2xl text-[var(--foreground)]">
            Our collections are being prepared.
          </h2>

          <p className="mt-3 text-sm text-[var(--foreground-muted)]">
            Please check back soon to discover our footwear collections.
          </p>

          <Link href="/catalogue" className="btn-gold-outline mt-6 inline-flex">
            Explore Catalogue
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {collections.map((col) => (
            <article
              key={col.id}
              className="group flex flex-col justify-between border border-[var(--border)] bg-[var(--surface)] p-8 transition hover:border-[var(--gold)]"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[var(--gold)]">
                  <span>Published Collection</span>

                  <span>
                    {productCountError
                      ? "Models"
                      : `${productCounts[col.id] ?? 0} Models`}
                  </span>
                </div>

                <div className="my-8 flex h-52 items-center justify-center overflow-hidden border border-[var(--border)]/40 bg-[var(--background-secondary)] p-4">
                  {col.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={col.cover_image_url}
                      alt={`${col.name} collection`}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="font-serif italic text-sm text-center text-[var(--foreground-muted)]">
                      {col.name} Cover Asset
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl text-[var(--foreground)] transition group-hover:text-[var(--gold)]">
                  {col.name}
                </h2>

                <p className="mt-3 text-xs leading-relaxed text-[var(--foreground-muted)]">
                  {col.description ||
                    "Discover the craftsmanship and distinctive designs of this POM'S collection."}
                </p>
              </div>

              <div className="mt-8 border-t border-[var(--border)]/40 pt-6">
                <Link
                  href="/catalogue"
                  className="btn-gold-outline w-full text-xs"
                >
                  Browse Collection Models
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
