
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, X, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  shoeType: string;
  materials: string[];
  colors: string[];
  moq: number;
  packageQty: number;
  availability: string;
  imageUrl: string | null;
  imageAlt: string;
}

interface DatabaseProduct {
  id: string;
  name: string;
  slug: string;
  shoe_type: string;
  materials: string[] | null;
  colors: string[] | null;
  minimum_order_quantity: number | null;
  package_quantity: number | null;
  is_wholesale_available: boolean;
}

interface DatabaseImage {
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

const formatShoeType = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export default function CataloguePage() {
  const { t } = useLanguage();

  const [supabase] = useState(() => createClient());
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    url: string;
    alt: string;
  } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setLoadError("");

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(
          "id, name, slug, shoe_type, materials, colors, minimum_order_quantity, package_quantity, is_wholesale_available"
        )
        .eq("is_published", true)
        .eq("is_archived", false)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (productError) {
        if (active) {
          setLoadError("products");
          setLoading(false);
        }
        return;
      }

      const visibleProducts = (productData ?? []) as DatabaseProduct[];

      if (visibleProducts.length === 0) {
        if (active) {
          setProducts([]);
          setLoading(false);
        }
        return;
      }

      const productIds = visibleProducts.map((product) => product.id);

      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .select("product_id, image_url, alt_text, is_primary, display_order")
        .in("product_id", productIds)
        .order("display_order", { ascending: true });

      if (!active) return;

      if (imageError) {
        setLoadError("images");
        setLoading(false);
        return;
      }

      const images = (imageData ?? []) as DatabaseImage[];

      const mappedProducts: ProductItem[] = visibleProducts.map((product) => {
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
          shoeType: formatShoeType(product.shoe_type),
          materials: product.materials ?? [],
          colors: product.colors ?? [],
          moq: product.minimum_order_quantity ?? 1,
          packageQty: product.package_quantity ?? 0,
          availability: product.is_wholesale_available
            ? "Wholesale Available"
            : "Contact for Details",
          imageUrl: primaryImage?.image_url ?? null,
          imageAlt: primaryImage?.alt_text || product.name,
        };
      });

      setProducts(mappedProducts);
      setLoading(false);
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [supabase]);

  const shoeTypes = useMemo(
    () => ["All", ...Array.from(new Set(products.map((item) => item.shoeType)))],
    [products]
  );

  const availabilityOptions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(products.map((item) => item.availability))),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return products.filter((item) => {
      const searchableText = [
        item.name,
        item.shoeType,
        ...item.materials,
        ...item.colors,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(normalizedSearch);
      const matchesType =
        selectedType === "All" || item.shoeType === selectedType;
      const matchesAvailability =
        selectedAvailability === "All" ||
        item.availability === selectedAvailability;

      return matchesSearch && matchesType && matchesAvailability;
    });
  }, [products, searchTerm, selectedType, selectedAvailability]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("All");
    setSelectedAvailability("All");
  };

  const translateAvailability = (value: string) => {
    if (value === "Wholesale Available") {
      return t("cataloguePage.wholesaleAvailable");
    }

    if (value === "Contact for Details") {
      return t("cataloguePage.contactForDetails");
    }

    return value;
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-10 lg:py-20">
      <div className="border-b border-[var(--border)] pb-8">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          {t("cataloguePage.eyebrow")}
        </p>

        <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)] sm:text-5xl">
          {t("cataloguePage.title")}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--foreground-muted)]">
          {t("cataloguePage.description")}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 border border-[var(--border)] bg-[var(--surface)] p-4 md:flex-row">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--foreground-muted)]" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("cataloguePage.search")}
            className="w-full border border-[var(--border)] bg-[var(--background)] py-2 pl-10 pr-4 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
          />
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
          <span className="mr-1 text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
            {t("cataloguePage.type")}
          </span>

          {shoeTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`border px-3 py-1.5 text-xs transition ${
                selectedType === type
                  ? "border-[var(--gold)] bg-[var(--gold)] font-semibold text-black"
                  : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
              }`}
            >
              {type === "All" ? t("cataloguePage.all") : type}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
          {t("cataloguePage.availability")}
        </span>

        {availabilityOptions.map((availability) => (
          <button
            key={availability}
            onClick={() => setSelectedAvailability(availability)}
            className={`border px-3 py-1.5 text-xs transition ${
              selectedAvailability === availability
                ? "border-[var(--gold)] bg-[var(--gold)] font-semibold text-black"
                : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
            }`}
          >
            {availability === "All"
              ? t("cataloguePage.all")
              : translateAvailability(availability)}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-16 border border-[var(--border)] bg-[var(--surface)] py-16 text-center">
          <p className="text-sm text-[var(--foreground-muted)]">
            {t("cataloguePage.loading")}
          </p>
        </div>
      )}

      {!loading && loadError && (
        <div className="mt-16 border border-[var(--border)] bg-[var(--surface)] py-16 text-center">
          <p className="text-sm text-[var(--foreground-muted)]">
            {loadError === "products"
              ? t("cataloguePage.loadError")
              : t("cataloguePage.imageError")}
          </p>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--gold)]"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[var(--gold)]">
                    <span>{item.shoeType}</span>

                    <span className="border border-[var(--gold)]/30 px-2 py-0.5">
                      {translateAvailability(item.availability)}
                    </span>
                  </div>

                  <div className="my-6">
  {item.imageUrl ? (
    <button
      type="button"
      onClick={() =>
        setSelectedImage({
          id: item.id,
          url: item.imageUrl!,
          alt: item.imageAlt,
        })
      }
      aria-label={`Enlarge image of ${item.name}`}
      className="flex h-48 w-full cursor-zoom-in items-center justify-center overflow-hidden border border-[var(--border)]/40 bg-[var(--background-secondary)] p-2 transition hover:border-[var(--gold)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={item.imageAlt}
        className="h-full w-full object-contain transition duration-300 hover:scale-105"
      />
    </button>
  ) : (
    <div className="flex h-48 items-center justify-center border border-[var(--border)]/40 bg-[var(--background-secondary)] p-2">
      <span className="text-center font-serif text-xs italic text-[var(--foreground-muted)]">
        {item.name} {t("cataloguePage.photography")}
      </span>
    </div>
  )}
</div>
{selectedImage?.id === item.id && (
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Enlarged product image"
    onClick={() => setSelectedImage(null)}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-5"
  >
    <button
      type="button"
      onClick={() => setSelectedImage(null)}
      aria-label="Close enlarged image"
      className="absolute right-5 top-5 rounded-full border border-white/30 p-3 text-white hover:bg-white/20"
    >
      <X className="h-6 w-6" />
    </button>

    <div
      onClick={(event) => event.stopPropagation()}
      className="flex max-h-[90vh] max-w-5xl flex-col items-center gap-5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={selectedImage.url}
        alt={selectedImage.alt}
        className="max-h-[75vh] max-w-full object-contain"
      />

      <a
        href={selectedImage.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-white underline hover:text-[var(--gold)]"
      >
        Open Original Image
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  </div>
)}
                  <h2 className="font-serif text-xl font-medium text-[var(--foreground)] transition group-hover:text-[var(--gold)]">
                    {item.name}
                  </h2>

                  <div className="mt-3 space-y-1 text-xs text-[var(--foreground-muted)]">
                    <p>
                      <strong className="font-normal text-[var(--foreground)]">
                        {t("cataloguePage.material")}
                      </strong>{" "}
                      {item.materials.length
                        ? item.materials.join(", ")
                        : t("cataloguePage.contactForDetailsShort")}
                    </p>

                    <p>
                      <strong className="font-normal text-[var(--foreground)]">
                        {t("cataloguePage.colorway")}
                      </strong>{" "}
                      {item.colors.length
                        ? item.colors.join(", ")
                        : t("cataloguePage.contactForDetailsShort")}
                    </p>

                    <p>
                      <strong className="font-normal text-[var(--foreground)]">
                        {t("cataloguePage.packageSpec")}
                      </strong>{" "}
                      {item.packageQty > 0
                        ? `${item.packageQty} ${t("cataloguePage.pairsPerCarton")}`
                        : t("cataloguePage.contactForDetailsShort")}{" "}
                      · {t("cataloguePage.moq")} {item.moq}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--border)]/40 pt-4">
                  <span className="text-xs font-medium text-[var(--gold)]">
                    {t("cataloguePage.priceOnRequest")}
                  </span>

                  <Link
                    href="/custom-design"
                    className="btn-gold-outline inline-flex items-center gap-1 px-3.5 py-2 text-[0.65rem]"
                  >
                    {t("cataloguePage.requestQuotation")}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-16 border border-[var(--border)] bg-[var(--surface)] py-16 text-center">
              <p className="font-serif text-lg text-[var(--foreground-muted)]">
                {products.length === 0
                  ? t("cataloguePage.emptyDescription")
                  : t("cataloguePage.noResults")}
              </p>

              {products.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="btn-gold-outline mt-4 text-xs"
                >
                  {t("cataloguePage.resetFilters")}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
