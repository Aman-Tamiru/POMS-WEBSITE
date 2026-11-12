
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import PomsCollectionShowcase from "@/components/collection/PomsCollectionShowcase";

interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  display_order: number;
}

interface CollectionPageClientProps {
  collections: Collection[];
  productCounts: Record<string, number>;
  collectionError: boolean;
  productCountError: boolean;
}

const collectionCoverImages: Record<string, string> = {
  "sovereign-line": "/images/collections/sovereign-line-cover.jpg",
  "artisanal-slides": "/images/collections/artisanal-slides-cover.jpg",
  "bespoke-evening": "/images/collections/bespoke-evening-cover.jpg",
};

export default function CollectionPageClient({
  collections,
  productCounts,
  collectionError,
  productCountError,
}: CollectionPageClientProps) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="poms-collection-page-heading mb-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
            {t("collectionPage.eyebrow")}
          </p>

          <h1 className="mb-6 text-4xl font-light tracking-wide text-[var(--foreground)] md:text-6xl">
            {t("collectionPage.title")}
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-[var(--foreground-muted)] md:text-base">
            {t("collectionPage.description")}
          </p>
        </div>

        {collectionError ? (
          <div className="border border-[var(--border)] bg-[var(--surface)] py-20 text-center">
            <h2 className="mb-3 text-xl font-medium text-[var(--foreground)]">
              {t("collectionPage.unavailable")}
            </h2>
            <p className="text-sm text-[var(--foreground-muted)]">
              {t("collectionPage.tryAgain")}
            </p>
          </div>
        ) : collections.length === 0 ? (
          <div className="border border-[var(--border)] bg-[var(--surface)] py-20 text-center">
            <h2 className="mb-3 text-xl font-medium text-[var(--foreground)]">
              {t("collectionPage.emptyTitle")}
            </h2>

            <p className="mb-8 text-sm text-[var(--foreground-muted)]">
              {t("collectionPage.emptyDescription")}
            </p>

            <Link
              href="/catalogue"
              className="btn-gold-outline inline-flex items-center gap-2 px-7 py-3 text-xs uppercase tracking-widest"
            >
              {t("collectionPage.exploreCatalogue")}
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((col, index) => {
              const count = productCounts[col.id] ?? 0;

              const imageSrc =
                col.cover_image_url ||
                collectionCoverImages[col.slug];

              if (!imageSrc) {
                return (
                  <article key={col.id} className="group">
                    <Link
                      href={`/collection/${col.slug}`}
                      className="block"
                    >
                      <div className="mb-6 flex aspect-[4/5] items-center justify-center border border-[var(--border)] bg-[var(--background-secondary)] text-xs uppercase tracking-widest text-[var(--foreground-muted)]">
                        {t("collectionPage.coverAlt")}
                      </div>

                      <h2 className="mb-3 text-2xl font-light tracking-wide">
                        {col.name}
                      </h2>

                      <p className="text-sm leading-7 text-[var(--foreground-muted)]">
                        {col.description ||
                          t("collectionPage.collectionFallback")}
                      </p>
                    </Link>
                  </article>
                );
              }

              return (
                <PomsCollectionShowcase
                  key={col.id}
                  slug={col.slug}
                  name={col.name}
                  description={col.description}
                  imageSrc={imageSrc}
                  imageAlt={`${col.name} ${t("collectionPage.collectionAlt")}`}
                  modelCount={count}
                  modelLabel={t("collectionPage.model")}
                  modelsLabel={t("collectionPage.models")}
                  publishedLabel={t("collectionPage.publishedCollection")}
                  browseLabel={t("collectionPage.browseModels")}
                  fallbackDescription={t("collectionPage.collectionFallback")}
                  delay={index * 120}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
