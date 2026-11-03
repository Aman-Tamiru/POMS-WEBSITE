
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  const [supabase] = useState(() => createClient());
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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
          setLoadError("We could not load the catalogue. Please try again later.");
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
        setLoadError("Products loaded, but their photographs could not be retrieved.");
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
    () => ["All", ...Array.from(new Set(products.map((item) => item.availability)))],
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

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-10 lg:py-20">
      <div className="border-b border-[var(--border)] pb-8">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Complete Directory
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--foreground)] sm:text-5xl">
          Footwear Catalogue
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--foreground-muted)]">
          Explore individual luxury pairs and carton-tier wholesale collections.
          Filter by shoe type, material, or export availability.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 border border-[var(--border)] bg-[var(--surface)] p-4 md:flex-row">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--foreground-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, material, color..."
            className="w-full border border-[var(--border)] bg-[var(--background)] py-2 pl-10 pr-4 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
          />
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
          <span className="mr-1 text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
            Type:
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
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
          Availability:
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
            {availability}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-16 border border-[var(--border)] bg-[var(--surface)] py-16 text-center">
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading footwear catalogue...
          </p>
        </div>
      )}

      {!loading && loadError && (
        <div className="mt-16 border border-[var(--border)] bg-[var(--surface)] py-16 text-center">
          <p className="text-sm text-[var(--foreground-muted)]">{loadError}</p>
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
                      {item.availability}
                    </span>
                  </div>

                  <div className="my-6 flex h-48 items-center justify-center overflow-hidden border border-[var(--border)]/40 bg-[var(--background-secondary)] p-2">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="font-serif text-center text-xs italic text-[var(--foreground-muted)]">
                        {item.name} Photography
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-xl font-medium text-[var(--foreground)] transition group-hover:text-[var(--gold)]">
                    {item.name}
                  </h2>

                  <div className="mt-3 space-y-1 text-xs text-[var(--foreground-muted)]">
                    <p>
                      <strong className="font-normal text-[var(--foreground)]">
                        Material:
                      </strong>{" "}
                      {item.materials.length
                        ? item.materials.join(", ")
                        : "Contact for details"}
                    </p>
                    <p>
                      <strong className="font-normal text-[var(--foreground)]">
                        Colorway:
                      </strong>{" "}
                      {item.colors.length
                        ? item.colors.join(", ")
                        : "Contact for details"}
                    </p>
                    <p>
                      <strong className="font-normal text-[var(--foreground)]">
                        Package Spec:
                      </strong>{" "}
                      {item.packageQty > 0
                        ? `${item.packageQty} pairs/carton`
                        : "Contact for details"}{" "}
                      · MOQ: {item.moq}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--border)]/40 pt-4">
                  <span className="text-xs font-medium text-[var(--gold)]">
                    Price on Request
                  </span>
                  <Link
                    href="/custom-design"
                    className="btn-gold-outline inline-flex items-center gap-1 text-[0.65rem] px-3.5 py-2"
                  >
                    Request Quotation <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-16 border border-[var(--border)] bg-[var(--surface)] py-16 text-center">
              <p className="font-serif text-lg text-[var(--foreground-muted)]">
                {products.length === 0
                  ? "Our footwear catalogue is being prepared. Please check back soon."
                  : "No footwear models matched your selected criteria."}
              </p>
              {products.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="btn-gold-outline mt-4 text-xs"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
