
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Package,
  Compass,
  CheckCircle2,
} from "lucide-react";

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  shoe_type: string;
  description: string | null;
}

interface FeaturedProductImage {
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

interface FeaturedProductCard {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
}

export default function HomePage() {
  const { t } = useLanguage();

  const [supabase] = useState(() => createClient());

  const [featuredProducts, setFeaturedProducts] = useState<
    FeaturedProductCard[]
  >([]);

  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadFeaturedProducts() {
      setFeaturedLoading(true);
      setFeaturedError("");

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, name, slug, shoe_type, description")
        .eq("is_published", true)
        .eq("is_archived", false)
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (productError) {
        if (active) {
          setFeaturedError(
            "Featured products are temporarily unavailable."
          );
          setFeaturedLoading(false);
        }
        return;
      }

      const products = (productData ?? []) as FeaturedProduct[];

      if (products.length === 0) {
        if (active) {
          setFeaturedProducts([]);
          setFeaturedLoading(false);
        }
        return;
      }

      const productIds = products.map((product) => product.id);

      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .select(
          "product_id, image_url, alt_text, is_primary, display_order"
        )
        .in("product_id", productIds)
        .order("display_order", { ascending: true });

      if (!active) return;

      if (imageError) {
        setFeaturedError(
          "Featured product photographs could not be loaded."
        );
        setFeaturedLoading(false);
        return;
      }

      const images = (imageData ?? []) as FeaturedProductImage[];

      const mappedProducts: FeaturedProductCard[] = products.map(
        (product) => {
          const productImages = images
            .filter((image) => image.product_id === product.id)
            .sort((a, b) => {
              if (a.is_primary !== b.is_primary) {
                return a.is_primary ? -1 : 1;
              }

              return a.display_order - b.display_order;
            });

          const primaryImage = productImages[0] ?? null;

          return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            category: product.shoe_type
              .replace(/_/g, " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase()),
            description:
              product.description ||
              "Discover this POM'S footwear design.",
            imageUrl: primaryImage?.image_url ?? null,
            imageAlt: primaryImage?.alt_text || product.name,
          };
        }
      );

      setFeaturedProducts(mappedProducts);
      setFeaturedLoading(false);
    }

    loadFeaturedProducts();

    return () => {
      active = false;
    };
  }, [supabase]);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden silk-bg px-5 py-24 text-center md:px-10">
        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)]/80 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span className="font-serif text-[11px] uppercase tracking-[0.3em] text-[var(--gold)]">
              {t("hero.eyebrow")}
            </span>
          </div>

          <h1 className="font-serif text-5xl font-light tracking-tight text-[var(--foreground)] sm:text-6xl md:text-7xl lg:text-8xl">
            {t("hero.title")}
          </h1>

          <div className="mx-auto h-px w-24 bg-[var(--gold)]" />

          <p className="mx-auto max-w-2xl font-serif text-lg leading-relaxed text-[var(--foreground-muted)] sm:text-xl">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/catalogue" className="btn-gold">
              {t("hero.ctaExplore")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link href="/custom-design" className="btn-gold-outline">
              {t("hero.ctaCustom")}
            </Link>

            <Link
              href="/wholesale"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest text-[var(--foreground-muted)] hover:text-[var(--gold)] transition"
            >
              {t("hero.ctaWholesale")} →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURED SIGNATURE EDITS */}
      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
          <div>
            <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
              Signature Collection
            </p>

            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[var(--foreground)]">
              The Sovereign Edit
            </h2>
          </div>

          <Link
            href="/catalogue"
            className="text-xs uppercase tracking-widest text-[var(--gold)] hover:underline inline-flex items-center gap-1.5"
          >
            View Complete Catalogue
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {featuredLoading ? (
          <div className="mt-12 border border-[var(--border)] bg-[var(--surface)] py-16 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">
              Loading featured footwear...
            </p>
          </div>
        ) : featuredError ? (
          <div className="mt-12 border border-[var(--border)] bg-[var(--surface)] py-16 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">
              {featuredError}
            </p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="mt-12 border border-[var(--border)] bg-[var(--surface)] py-16 text-center">
            <p className="font-serif text-lg text-[var(--foreground-muted)]">
              Our signature collection is being prepared. Please check back soon.
            </p>

            <Link
              href="/catalogue"
              className="btn-gold-outline mt-5 inline-flex"
            >
              Explore Catalogue
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--gold)]"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-[var(--gold)]">
                    <span>{item.category}</span>

                    <span className="border border-[var(--gold)]/40 px-2 py-0.5">
                      Featured
                    </span>
                  </div>

                  <div className="my-8 flex h-44 items-center justify-center overflow-hidden border border-[var(--border)]/30 bg-[var(--background-secondary)] p-2">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="font-serif text-sm italic text-center text-[var(--foreground-muted)]">
                        POM&apos;S Craftsmanship Photography
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[var(--foreground)] transition group-hover:text-[var(--gold)]">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[var(--foreground-muted)]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--border)]/40 pt-4">
                  <span className="text-xs font-medium text-[var(--gold)]">
                    Price on Request
                  </span>

                  <Link
                    href="/custom-design"
                    className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] hover:text-[var(--gold)]"
                  >
                    Inquire →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 3. CUSTOM SHOE DESIGN STUDIO PROMOTION */}
      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              <span>— {t("customDesign.tagline")} —</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-[var(--foreground)] leading-tight">
              {t("customDesign.title")}
            </h2>

            <p className="font-serif text-base leading-relaxed text-[var(--foreground-muted)]">
              {t("customDesign.description")}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2 border-l border-[var(--gold)] pl-4">
                <p className="font-serif text-sm font-semibold text-[var(--gold)]">
                  1. Upload &amp; Review
                </p>

                <p className="text-xs text-[var(--foreground-muted)]">
                  Send shoe photos or sketches for structural evaluation.
                </p>
              </div>

              <div className="space-y-2 border-l border-[var(--gold)] pl-4">
                <p className="font-serif text-sm font-semibold text-[var(--gold)]">
                  2. Leather &amp; Pricing
                </p>

                <p className="text-xs text-[var(--foreground-muted)]">
                  Choose from available calfskin, suede, or patent leathers.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/custom-design" className="btn-gold">
                {t("customDesign.submitBtn")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border border-[var(--border)] bg-[var(--background-secondary)] p-10 text-center space-y-4">
            <Compass className="h-16 w-16 text-[var(--gold)]" />

            <h3 className="font-serif text-2xl text-[var(--foreground)]">
              Direct Artisan Dialogue
            </h3>

            <p className="max-w-md text-xs leading-relaxed text-[var(--foreground-muted)]">
              Every bespoke inquiry opens a private encrypted conversation channel directly with our owner and master shoemakers.
            </p>

            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-widest text-[var(--gold)] font-medium">
                Photo Uploads · Swatches · Formal Quotes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERNATIONAL WHOLESALE SPOTLIGHT */}
      <section className="silk-bg border-y border-[var(--border)] py-20 px-5 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
              {t("wholesale.tagline")}
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl text-[var(--foreground)]">
              {t("wholesale.title")}
            </h2>

            <div className="mx-auto h-px w-20 bg-[var(--gold)]" />

            <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
              {t("wholesale.description")}
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 text-center">
            <div className="border border-[var(--border)] bg-[var(--surface)] p-8 space-y-3">
              <Package className="h-8 w-8 text-[var(--gold)] mx-auto" />

              <h3 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                Standard Export Cartons
              </h3>

              <p className="text-xs text-[var(--foreground-muted)]">
                Pre-packaged 12 or 24-pair cartons with full size ratio breakdowns across EU 36–42.
              </p>
            </div>

            <div className="border border-[var(--border)] bg-[var(--surface)] p-8 space-y-3">
              <CheckCircle2 className="h-8 w-8 text-[var(--gold)] mx-auto" />

              <h3 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                Multi-Currency Invoicing
              </h3>

              <p className="text-xs text-[var(--foreground-muted)]">
                Formal quotations available in USD, ETB, CNY, INR, and EUR with locked exchange rates.
              </p>
            </div>

            <div className="border border-[var(--border)] bg-[var(--surface)] p-8 space-y-3">
              <ShieldCheck className="h-8 w-8 text-[var(--gold)] mx-auto" />

              <h3 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                Reliable Global Freight
              </h3>

              <p className="text-xs text-[var(--foreground-muted)]">
                FOB Addis Ababa air cargo and sea container logistics with complete customs documentation.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/wholesale" className="btn-gold-outline">
              {t("wholesale.ctaQuote")}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. DATABASE AUTHENTICITY VERIFICATION TEASER */}
      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-14 text-center space-y-6">
          <ShieldCheck className="h-12 w-12 text-[var(--gold)] mx-auto" />

          <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            {t("authenticity.tagline")}
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--foreground)]">
            {t("authenticity.title")}
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--foreground-muted)]">
            {t("authenticity.description")}
          </p>

          <div>
            <Link href="/authenticity" className="btn-gold">
              Verify Footwear Authenticity
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
