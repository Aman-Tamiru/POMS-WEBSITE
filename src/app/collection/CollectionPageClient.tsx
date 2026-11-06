
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import Image from "next/image";

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

export default function CollectionPageClient({
  collections,
  productCounts,
  collectionError,
  productCountError,
}: CollectionPageClientProps) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
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
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((col) => {
              const count = productCounts[col.id] ?? 0;

              return (
                <article key={col.id} className="group">
                  <Link
                    href={`/collection/${col.slug}`}
                    className="block"
                  >
                    <div className="relative mb-6 aspect-[4/5] overflow-hidden border border-[var(--border)] bg-[var(--background-secondary)]">
                      {col.cover_image_url ? (
                        <Image
                          src={col.cover_image_url}
                          alt={`${col.name} ${t("collectionPage.collectionAlt")}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-[var(--foreground-muted)]">
                          {t("collectionPage.coverAlt")}
                        </div>
                      )}
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]">
                        {t("collectionPage.publishedCollection")}
                      </span>

                      <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)]">
                        {productCountError
                          ? t("collectionPage.models")
                          : `${count} ${
                              count === 1
                                ? t("collectionPage.model")
                                : t("collectionPage.models")
                            }`}
                      </span>
                    </div>

                    <h2 className="mb-3 text-2xl font-light tracking-wide text-[var(--foreground)] transition group-hover:text-[var(--gold)]">
                      {col.name}
                    </h2>

                    <p className="mb-6 text-sm leading-7 text-[var(--foreground-muted)]">
                      {col.description ||
                        t("collectionPage.collectionFallback")}
                    </p>

                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--gold)]">
                      {t("collectionPage.browseModels")}
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
