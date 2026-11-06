import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CollectionDetailClient from "./CollectionDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("collections")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  return {
    title: data ? `${data.name} | POM'S` : "Collection | POM'S",
    description:
      data?.description || "Explore POM'S luxury footwear collection.",
  };
}

export default async function CollectionDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("id, slug, name, description, cover_image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (collectionError || !collection) {
    notFound();
  }

  const { data: products, error: productError } = await supabase
    .from("products")
    .select(
      "id, name, slug, shoe_type, materials, colors, minimum_order_quantity, package_quantity"
    )
    .eq("collection_id", collection.id)
    .eq("is_published", true)
    .eq("is_archived", false)
    .order("display_order", { ascending: true });

  const productIds = (products ?? []).map((product) => product.id);

  let images: {
    product_id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    display_order: number;
  }[] = [];

  let imageError = false;

  if (productIds.length > 0) {
    const { data, error } = await supabase
      .from("product_images")
      .select("product_id, image_url, alt_text, is_primary, display_order")
      .in("product_id", productIds)
      .order("display_order", { ascending: true });

    images = data ?? [];
    imageError = !!error;
  }

  return (
    <CollectionDetailClient
      collection={collection}
      products={products ?? []}
      images={images}
      productError={!!productError}
      imageError={imageError}
    />
  );
}
