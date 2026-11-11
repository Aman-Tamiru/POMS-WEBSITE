"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";

type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
};

type ProductImage = {
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean | null;
  display_order: number | null;
};

export default function PomsCinematicHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [productImage, setProductImage] = useState("");
  const [productName, setProductName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let active = true;

    async function loadFeaturedProduct() {
      const supabase = createClient();

      const { data: products, error } = await supabase
        .from("products")
        .select("id, name, slug")
        .eq("is_published", true)
        .eq("is_archived", false)
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(1);

      if (error || !products?.length || !active) {
        return;
      }

      const product = products[0] as FeaturedProduct;

      const { data: images } = await supabase
        .from("product_images")
        .select(
          "product_id, image_url, alt_text, is_primary, display_order"
        )
        .eq("product_id", product.id)
        .order("display_order", { ascending: true });

      if (!active) return;

      const productImages = (images ?? []) as ProductImage[];

      const selectedImage = [...productImages].sort((a, b) => {
        return Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary));
      })[0];

      if (selectedImage?.image_url) {
        setProductImage(selectedImage.image_url);
        setProductName(product.name);
      }
    }

    loadFeaturedProduct();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setLoaded(true);
      return;
    }

    let frame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();

        const x =
          ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y =
          ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

        element.style.setProperty(
          "--pointer-x",
          Math.max(-1, Math.min(1, x)).toFixed(3)
        );

        element.style.setProperty(
          "--pointer-y",
          Math.max(-1, Math.min(1, y)).toFixed(3)
        );
      });
    };

    const resetPointer = () => {
      element.style.setProperty("--pointer-x", "0");
      element.style.setProperty("--pointer-y", "0");
    };

    const handleScroll = () => {
      const bounds = element.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -bounds.top / Math.max(bounds.height, 1))
      );

      element.style.setProperty(
        "--scroll-progress",
        progress.toFixed(3)
      );
    };

    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerleave", resetPointer);
    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();
    setLoaded(true);

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className={`poms-cinematic-hero ${loaded ? "is-loaded" : ""}`}
      aria-label="POM'S luxury footwear introduction"
    >
      <div className="poms-hero-grain" aria-hidden="true" />
      <div className="poms-hero-orbit poms-hero-orbit-one" aria-hidden="true" />
      <div className="poms-hero-orbit poms-hero-orbit-two" aria-hidden="true" />

      <div className="poms-hero-particles" aria-hidden="true">
      {Array.from({ length: 24 }, (_, index) => (
  <span
    key={index}
    className="poms-hero-particle"
    style={{
      "--particle-index": index,
      left: `${(index * 37 + 9) % 100}%`,
      top: `${(index * 53 + 13) % 100}%`,
    } as CSSProperties}
    aria-hidden="true"
  />
))}
      </div>

      <div className="poms-hero-inner">
        <div className="poms-hero-copy">
          <div className="poms-hero-eyebrow">
            <span className="poms-hero-eyebrow-line" />
            <Sparkles size={13} strokeWidth={1.4} />
            <span>{t("hero.eyebrow")}</span>
          </div>

          <h1 className="poms-hero-title">
            {t("hero.title")}
          </h1>

          <p className="poms-hero-subtitle">
            {t("hero.subtitle")}
          </p>

          <div className="poms-hero-actions">
            <Link href="/catalogue" className="poms-hero-primary">
              {t("hero.ctaExplore")}
              <ArrowRight size={16} />
            </Link>

            <Link href="/custom-design" className="poms-hero-secondary">
              {t("hero.ctaCustom")}
            </Link>
          </div>

          <Link href="/wholesale" className="poms-hero-wholesale">
            {t("hero.ctaWholesale")}
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="poms-hero-visual">
          <div className="poms-hero-stage">
            <div className="poms-hero-stage-ring" />
            <div className="poms-hero-stage-ring poms-hero-stage-ring-inner" />

            <div className="poms-hero-light" />

            <div className="poms-hero-product">
              {productImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={productImage}
                  alt={productName || "POM'S featured footwear"}
                  className="poms-hero-product-image"
                  onLoad={() => setLoaded(true)}
                />
              ) : (
                <div className="poms-hero-product-placeholder">
                  <span>POM&apos;S</span>
                  <small>INTERNATIONAL</small>
                </div>
              )}
            </div>

            <div className="poms-hero-reflection" />

            <div className="poms-hero-product-caption">
              <span className="poms-hero-caption-line" />
              <span>{productName || "POM'S COLLECTION"}</span>
            </div>
          </div>

          <div className="poms-hero-side-note">
            <span>01 / 03</span>
            <span className="poms-hero-side-divider" />
            <span>CRAFTED WITH INTENTION</span>
          </div>
        </div>
      </div>

      <div className="poms-hero-bottom">
        <span>SCROLL TO DISCOVER</span>
        <ArrowDown size={15} />
        <span className="poms-hero-bottom-line" />
      </div>

      <div className="poms-hero-index" aria-hidden="true">
        P / I
      </div>
    </section>
  );
}
