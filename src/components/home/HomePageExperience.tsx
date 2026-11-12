"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, Package, ShieldCheck, Sparkles } from "lucide-react";
import PomsCinematicHero from "@/components/home/PomsCinematicHero";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";

import PomsSectionHeading from "@/components/brand/PomsSectionHeading";
import PomsEditorialBand from "@/components/brand/PomsEditorialBand";
import PomsReveal from "@/components/brand/PomsReveal";
import PomsProductGallery from "@/components/product/PomsProductGallery";
import PomsCraftsmanshipStory from "@/components/home/sections/PomsCraftsmanshipStory";
interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  shoe_type: string;
  description: string | null;
}

interface FeaturedProductImage {
  id: string;
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
  images: {
    id: string;
    image_url: string;
    alt_text: string | null;
  }[];
}

export default function HomePageExperience() {
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

      if (!active) return;

      if (productError) {
        setFeaturedError(
          "Featured products are temporarily unavailable."
        );
        setFeaturedLoading(false);
        return;
      }

      const products = (productData ?? []) as FeaturedProduct[];

      if (products.length === 0) {
        setFeaturedProducts([]);
        setFeaturedLoading(false);
        return;
      }

      const productIds = products.map((product) => product.id);

      const { data: imageData, error: imageError } = await supabase
  .from("product_images")
  .select(
    "id, product_id, image_url, alt_text, is_primary, display_order"
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
              images: productImages.map((image) => ({
                id: image.id,
                image_url: image.image_url,
                alt_text: image.alt_text || product.name,
              })),
          };
        }
      );

      setFeaturedProducts(mappedProducts);
      setFeaturedLoading(false);
    }

    void loadFeaturedProducts();

    return () => {
      active = false;
    };
  }, [supabase]);

  const heroProduct = featuredProducts.find(
    (product) => product.imageUrl
  );

  return (
    <main className="poms-homepage overflow-hidden pb-20">
 <PomsCinematicHero />
      

      <section className="poms-home-hero relative">

        <div className="poms-home-hero-inner mx-auto grid min-h-[680px] max-w-[1600px] lg:grid-cols-[1.05fr_0.95fr]">

          <div className="relative z-10 flex flex-col justify-center px-6 py-20 sm:px-12 lg:px-16 xl:px-24">

            <PomsReveal direction="up">

              <div className="mb-8 inline-flex w-fit items-center gap-3 border border-[var(--border)] px-4 py-2">
                <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />

                <span className="text-[9px] uppercase tracking-[0.32em] text-[var(--gold)] sm:text-[10px]">
                  {t("hero.eyebrow")}
                </span>
              </div>

              <p className="mb-5 text-[10px] uppercase tracking-[0.38em] text-[var(--foreground-muted)]">
                POM&apos;S INTERNATIONAL
              </p>

              <h1 className="max-w-3xl font-serif text-5xl font-normal leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-6xl md:text-7xl xl:text-[88px]">
                {t("hero.title")}
              </h1>

              <div className="my-8 flex items-center gap-3">
                <span className="h-px w-14 bg-[var(--gold)]" />
                <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
              </div>

              <p className="max-w-xl font-serif text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
                {t("hero.subtitle")}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">

                <Link
                  href="/catalogue"
                  className="btn-gold inline-flex items-center gap-3"
                >
                  {t("hero.ctaExplore")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/custom-design"
                  className="btn-gold-outline inline-flex items-center gap-3"
                >
                  {t("hero.ctaCustom")}
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

              <Link
                href="/wholesale"
                className="mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[var(--foreground-muted)] transition hover:text-[var(--gold)]"
              >
                {t("hero.ctaWholesale")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

            </PomsReveal>

          </div>

          <div className="poms-home-hero-visual relative min-h-[440px] overflow-hidden lg:min-h-full">

            {heroProduct?.imageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroProduct.imageUrl}
                  alt={heroProduct.imageAlt}
                  className="absolute inset-0 h-full w-full object-contain p-8 sm:p-14 lg:p-12 xl:p-20"
                />

                <div className="absolute bottom-7 left-7 z-10 max-w-[75%] border border-white/20 bg-black/65 px-5 py-4 text-white backdrop-blur-md">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#d1b276]">
                    Featured design
                  </p>

                  <p className="mt-2 font-serif text-xl">
                    {heroProduct.name}
                  </p>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="poms-hero-monogram">
                  P
                </div>
              </div>
            )}

            <div className="poms-hero-outline" aria-hidden="true" />

            <span className="absolute right-6 top-6 text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]">
              EST. POM&apos;S
            </span>

          </div>

        </div>

        <div className="poms-home-hero-bottom flex items-center justify-between px-6 py-5 sm:px-12 lg:px-16">
          <span className="text-[9px] uppercase tracking-[0.28em] text-[var(--foreground-muted)]">
            Footwear · Design · Wholesale
          </span>

          <span className="text-[9px] uppercase tracking-[0.28em] text-[var(--gold)]">
            Addis Ababa · Ethiopia
          </span>
        </div>

      </section>


      {/* =========================================
          02 — BRAND INTRODUCTION
      ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">

        <PomsReveal>

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">

            <div>
              <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">
                The POM&apos;S Perspective
              </p>

              <p className="font-serif text-5xl leading-none text-[var(--foreground)] sm:text-6xl">
                Design.
                <br />
                Identity.
                <br />
                <span className="italic text-[var(--gold)]">
                  Expression.
                </span>
              </p>
            </div>

            <div className="max-w-3xl lg:pt-2">

              <h2 className="font-serif text-2xl leading-relaxed text-[var(--foreground)] sm:text-3xl lg:text-4xl">
                Footwear is more than what you wear. It is part of how you express yourself.
              </h2>

              <p className="mt-7 text-sm leading-8 text-[var(--foreground-muted)] sm:text-base">
                POM&apos;S International is an Addis Ababa-based footwear
                brand with an international outlook. We bring together
                considered design, distinctive silhouettes and
                opportunities for bespoke and wholesale collaboration.
              </p>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-3 border-b border-[var(--gold)] pb-3 text-[10px] uppercase tracking-[0.25em] text-[var(--foreground)] transition hover:text-[var(--gold)]"
              >
                Discover our story
                <ArrowUpRight className="h-4 w-4" />
              </Link>

            </div>

          </div>

        </PomsReveal>

      </section>


      {/* =========================================
          03 — COLLECTION DISCOVERY
      ========================================= */}
      {/* =========================================
    ETHIOPIAN CRAFTSMANSHIP STORY
========================================= */}

<PomsCraftsmanshipStory
  imageUrl={heroProduct?.imageUrl}
  imageAlt={heroProduct?.imageAlt || "POM'S featured footwear design"}
/>

      <section className="poms-collection-section px-6 py-24 sm:px-10 lg:px-16">

        <div className="mx-auto max-w-7xl">

          <PomsReveal>
            <PomsSectionHeading
              eyebrow="Explore POM'S"
              title="A World of Distinctive Design"
              description="Explore the POM'S collection universe and discover the footwear direction that speaks to you."
            />
          </PomsReveal>

          <div className="mt-16 grid gap-5 md:grid-cols-3">

            <PomsReveal delay={0}>
              <Link
                href="/collection"
                className="poms-collection-card group"
              >
                <span className="poms-collection-number">01</span>

                <div className="poms-collection-card-content">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]">
                    Signature line
                  </p>

                  <h3 className="mt-4 font-serif text-3xl text-[var(--foreground)]">
                    Sovereign
                  </h3>

                  <span className="mt-7 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-[var(--foreground-muted)] transition group-hover:text-[var(--gold)]">
                    Explore collection
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </PomsReveal>

            <PomsReveal delay={100}>
              <Link
                href="/collection"
                className="poms-collection-card poms-collection-card-featured group"
              >
                <span className="poms-collection-number">02</span>

                <div className="poms-collection-card-content">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]">
                    Artisanal edit
                  </p>

                  <h3 className="mt-4 font-serif text-3xl text-[var(--foreground)]">
                    Signature Slides
                  </h3>

                  <span className="mt-7 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-[var(--foreground-muted)] transition group-hover:text-[var(--gold)]">
                    Explore collection
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </PomsReveal>

            <PomsReveal delay={200}>
              <Link
                href="/collection"
                className="poms-collection-card poms-collection-card-third group"
              >
                <span className="poms-collection-number">03</span>

                <div className="poms-collection-card-content">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]">
                    Bespoke direction
                  </p>

                  <h3 className="mt-4 font-serif text-3xl text-[var(--foreground)]">
                    Evening & Bridal
                  </h3>

                  <span className="mt-7 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-[var(--foreground-muted)] transition group-hover:text-[var(--gold)]">
                    Explore collection
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </PomsReveal>

          </div>

          <div className="mt-10 text-center">
            <Link
              href="/collection"
              className="inline-flex items-center gap-3 border-b border-[var(--gold)] pb-3 text-[10px] uppercase tracking-[0.25em] text-[var(--foreground)] hover:text-[var(--gold)]"
            >
              View all collections
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

      </section>


      {/* =========================================
          04 — FEATURED PRODUCTS
      ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16">

        <PomsReveal>
          <div className="flex flex-col justify-between gap-6 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">

            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">
                Selected for you
              </p>

              <h2 className="font-serif text-4xl text-[var(--foreground)] sm:text-5xl">
              The Featured Products
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--foreground-muted)]">
                Discover the designs currently highlighted by POM&apos;S.
                Each displayed product is loaded from our live catalogue.
              </p>
            </div>

            <Link
              href="/catalogue"
              className="inline-flex w-fit items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[var(--gold)] hover:underline"
            >
              Explore catalogue
              <ArrowUpRight className="h-4 w-4" />
            </Link>

          </div>
        </PomsReveal>

        {featuredLoading && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse"
              >
                <div className="aspect-[4/5] bg-[var(--surface)]" />
                <div className="mt-5 h-3 w-2/3 bg-[var(--surface)]" />
                <div className="mt-3 h-3 w-1/2 bg-[var(--surface)]" />
              </div>
            ))}
          </div>
        )}

        {!featuredLoading && featuredError && (
          <div className="mt-12 border border-[var(--border)] p-10 text-center">
            <p className="text-sm text-[var(--foreground-muted)]">
              {featuredError}
            </p>

            <Link
              href="/catalogue"
              className="mt-5 inline-flex items-center gap-2 text-xs text-[var(--gold)]"
            >
              Visit catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {!featuredLoading &&
          !featuredError &&
          featuredProducts.length === 0 && (
            <div className="mt-12 border border-[var(--border)] p-12 text-center">
              <p className="font-serif text-xl text-[var(--foreground)]">
              Featured products are being prepared.
              </p>

              <p className="mt-3 text-sm text-[var(--foreground-muted)]">
                Explore the complete catalogue to discover available designs.
              </p>

              <Link
                href="/catalogue"
                className="btn-gold-outline mt-6 inline-flex"
              >
                Explore catalogue
              </Link>
            </div>
          )}

        {!featuredLoading &&
          !featuredError &&
          featuredProducts.length > 0 && (
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">

              {featuredProducts.map((item, index) => (
                <PomsReveal key={item.id} delay={index * 70}>

                  <article className="poms-product-card group">

                    <div className="relative">

                      <div className="absolute left-3 top-3 z-10 border border-[var(--gold)]/50 bg-[var(--background)]/85 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-[var(--gold)]">
                        Featured
                      </div>

                      {item.imageUrl ? (
                        <PomsProductGallery
                        images={item.images}
                        productName={item.name}
                      />
                      ) : (
                        <div className="flex aspect-[4/5] items-center justify-center border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
                          <div>
                            <Sparkles className="mx-auto h-8 w-8 text-[var(--gold)]" />

                            <p className="mt-4 font-serif text-lg text-[var(--foreground)]">
                              {item.name}
                            </p>

                            <p className="mt-2 text-[9px] uppercase tracking-widest text-[var(--foreground-muted)]">
                              Photography coming soon
                            </p>
                          </div>
                        </div>
                      )}

                    </div>

                    <div className="pt-5">

                      <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--gold)]">
                        {item.category}
                      </p>

                      <Link
  href={`/product/${item.slug}`}
  className="mt-3 block font-serif text-xl text-[var(--foreground)] transition-colors group-hover:text-[var(--gold)] hover:text-[var(--gold)]"
>
  {item.name}
</Link>

                      <p className="mt-3 line-clamp-3 text-xs leading-6 text-[var(--foreground-muted)]">
                        {item.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">

                        <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--gold)]">
                          Price on request
                        </span>

                        <Link
  href={`/product/${item.slug}`}
                          className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-[var(--foreground-muted)] transition hover:text-[var(--gold)]"
                        >
                          Inquire
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>

                      </div>

                    </div>

                  </article>

                </PomsReveal>
              ))}

            </div>
          )}

      </section>


      {/* =========================================
          05 — CUSTOM DESIGN
      ========================================= */}

      <section className="px-6 py-10 sm:px-10 lg:px-16">

        <PomsReveal>
          <div className="mx-auto grid max-w-7xl overflow-hidden border border-[var(--border)] lg:grid-cols-[1.1fr_0.9fr]">

            <div className="poms-custom-story flex flex-col justify-center px-7 py-16 sm:px-12 lg:px-16">

              <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">
                {t("customDesign.tagline")}
              </p>

              <h2 className="mt-6 max-w-2xl font-serif text-4xl leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                {t("customDesign.title")}
              </h2>

              <p className="mt-7 max-w-xl text-sm leading-8 text-[var(--foreground-muted)]">
                {t("customDesign.description")}
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">

                <div className="border-l border-[var(--gold)] pl-5">
                  <p className="font-serif text-lg text-[var(--foreground)]">
                    Share your inspiration
                  </p>

                  <p className="mt-2 text-xs leading-6 text-[var(--foreground-muted)]">
                    Send reference photographs, sketches and design ideas.
                  </p>
                </div>

                <div className="border-l border-[var(--gold)] pl-5">
                  <p className="font-serif text-lg text-[var(--foreground)]">
                    Discuss your design
                  </p>

                  <p className="mt-2 text-xs leading-6 text-[var(--foreground-muted)]">
                    Share your material, colour and construction preferences.
                  </p>
                </div>

              </div>

              <Link
                href="/custom-design"
                className="btn-gold mt-10 inline-flex w-fit items-center gap-3"
              >
                {t("customDesign.submitBtn")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>

            </div>

            <div className="poms-custom-visual flex min-h-[380px] flex-col items-center justify-center p-10 text-center">

              <div className="poms-custom-emblem">
                <Compass className="h-12 w-12 text-[var(--gold)]" />
              </div>

              <p className="mt-8 text-[9px] uppercase tracking-[0.35em] text-[var(--gold)]">
                POM&apos;S BESPOKE STUDIO
              </p>

              <h3 className="mt-4 max-w-sm font-serif text-3xl leading-tight text-[var(--foreground)]">
                An idea becomes a design.
              </h3>

              <p className="mt-5 max-w-sm text-xs leading-7 text-[var(--foreground-muted)]">
                Start a conversation about the footwear you have in mind.
              </p>

            </div>

          </div>
        </PomsReveal>

      </section>


      {/* =========================================
          06 — WHOLESALE
      ========================================= */}

      <section className="pt-10">

        <PomsEditorialBand
          eyebrow={t("wholesale.tagline")}
          title={t("wholesale.title")}
          description={t("wholesale.description")}
          buttonLabel={t("wholesale.ctaQuote")}
          href="/wholesale"
          variant="light"
        />

        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-16 sm:grid-cols-3 sm:px-10 lg:px-16">

          <PomsReveal>
            <div className="poms-service-card">
              <Package className="h-7 w-7 text-[var(--gold)]" />

              <h3 className="mt-5 font-serif text-xl text-[var(--foreground)]">
                Wholesale packaging
              </h3>

              <p className="mt-3 text-xs leading-6 text-[var(--foreground-muted)]">
                Review available carton quantities and minimum order details
                with our wholesale team.
              </p>
            </div>
          </PomsReveal>

          <PomsReveal delay={100}>
            <div className="poms-service-card">
              <Compass className="h-7 w-7 text-[var(--gold)]" />

              <h3 className="mt-5 font-serif text-xl text-[var(--foreground)]">
                Commercial enquiries
              </h3>

              <p className="mt-3 text-xs leading-6 text-[var(--foreground-muted)]">
                Discuss your business requirements and request a tailored
                wholesale quotation.
              </p>
            </div>
          </PomsReveal>

          <PomsReveal delay={200}>
            <div className="poms-service-card">
              <ShieldCheck className="h-7 w-7 text-[var(--gold)]" />

              <h3 className="mt-5 font-serif text-xl text-[var(--foreground)]">
                Product confidence
              </h3>

              <p className="mt-3 text-xs leading-6 text-[var(--foreground-muted)]">
                Access the POM&apos;S product information and authenticity
                verification service.
              </p>
            </div>
          </PomsReveal>

        </div>

      </section>


      {/* =========================================
          07 — AUTHENTICITY
      ========================================= */}

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16">

        <PomsReveal>

          <div className="poms-authenticity-panel grid gap-10 p-8 sm:p-12 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:p-16">

            <div className="flex h-20 w-20 items-center justify-center border border-[var(--gold)]/40">
              <ShieldCheck className="h-9 w-9 text-[var(--gold)]" />
            </div>

            <div>

              <p className="text-[9px] uppercase tracking-[0.35em] text-[var(--gold)]">
                {t("authenticity.tagline")}
              </p>

              <h2 className="mt-4 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
                {t("authenticity.title")}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
                {t("authenticity.description")}
              </p>

            </div>

            <Link
              href="/authenticity"
              className="btn-gold inline-flex w-fit items-center gap-3"
            >
              Verify product
              <ArrowUpRight className="h-4 w-4" />
            </Link>

          </div>

        </PomsReveal>

      </section>


      {/* =========================================
          08 — CUSTOMER CONTACT
      ========================================= */}

      <section className="mx-auto max-w-7xl px-6 pb-10 sm:px-10 lg:px-16">

        <PomsReveal>

          <div className="border-y border-[var(--border)] py-16 text-center sm:py-24">

            <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold)]">
              The POM&apos;S Customer Desk
            </p>

            <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Let&apos;s start a conversation.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[var(--foreground-muted)]">
              Whether you are exploring a collection, planning a bespoke
              design or discussing a wholesale opportunity, our contact
              desk is ready to receive your enquiry.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">

              <Link
                href="/contact"
                className="btn-gold inline-flex items-center gap-3"
              >
                Contact POM&apos;S
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/faq"
                className="btn-gold-outline inline-flex items-center gap-3"
              >
                Customer assistance
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </div>

        </PomsReveal>

      </section>

    </main>
  );
}
