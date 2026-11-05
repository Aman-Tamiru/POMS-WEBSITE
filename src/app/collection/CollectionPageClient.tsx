
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
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
            {t("collectionPage.eyebrow")}
          </p>

          <h1 className="mb-6 text-4xl font-light tracking-wide text-neutral-900 md:text-6xl">
            {t("collectionPage.title")}
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
            {t("collectionPage.description")}
          </p>
        </div>

        {collectionError ? (
          <div className="py-20 text-center">
            <h2 className="mb-3 text-xl font-medium text-neutral-900">
              {t("collectionPage.unavailable")}
            </h2>
            <p className="text-sm text-neutral-500">
              {t("collectionPage.tryAgain")}
            </p>
          </div>
        ) : collections.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="mb-3 text-xl font-medium text-neutral-900">
              {t("collectionPage.emptyTitle")}
            </h2>
            <p className="mb-8 text-sm text-neutral-500">
              {t("collectionPage.emptyDescription")}
            </p>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 border border-neutral-900 px-7 py-3 text-xs uppercase tracking-widest text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
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
                    <div className="relative mb-6 aspect-[4/5] overflow-hidden bg-neutral-100">
                      {col.cover_image_url ? (
                        <Image
                        src={col.cover_image_url}
                        alt={`${col.name} ${t("collectionPage.collectionAlt")}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-neutral-400">
                          {t("collectionPage.coverAlt")}
                        </div>
                      )}
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                        {t("collectionPage.publishedCollection")}
                      </span>

                      <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                        {productCountError
                          ? t("collectionPage.models")
                          : `${count} ${
                              count === 1
                                ? t("collectionPage.model")
                                : t("collectionPage.models")
                            }`}
                      </span>
                    </div>

                    <h2 className="mb-3 text-2xl font-light tracking-wide text-neutral-900">
                      {col.name}
                    </h2>

                    <p className="mb-6 text-sm leading-7 text-neutral-600">
                      {col.description ||
                        t("collectionPage.collectionFallback")}
                    </p>

                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-900">
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
