
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CollectionPageClient from "./CollectionPageClient";

export const metadata: Metadata = {
  title: "Collections | POM'S",
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

export default async function CollectionPage() {
  const supabase = await createClient();

  const {
    data: collectionData,
    error: collectionError,
  } = await supabase
    .from("collections")
    .select(
      "id, slug, name, description, cover_image_url, display_order"
    )
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  const collections: Collection[] = collectionData ?? [];

  let productCounts: Record<string, number> = {};
  let productCountError = false;

  if (collections.length > 0) {
    const collectionIds = collections.map((collection) => collection.id);

    const {
      data: productData,
      error: productError,
    } = await supabase
      .from("products")
      .select("collection_id")
      .in("collection_id", collectionIds)
      .eq("is_published", true)
      .eq("is_archived", false);

    productCountError = !!productError;

    if (productData) {
      productCounts = productData.reduce(
        (counts: Record<string, number>, product) => {
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
    <CollectionPageClient
      collections={collections}
      productCounts={productCounts}
      collectionError={!!collectionError}
      productCountError={productCountError}
    />
  );
}
