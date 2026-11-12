
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductDetailClient from "./ProductDetailClient";

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
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_archived", false)
    .maybeSingle();

  return {
    title: data ? `${data.name} | POM'S International` : "Product | POM'S",
    description:
      data?.description || "Explore POM'S International luxury footwear.",
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, shoe_type, description, materials, colors, sizes_available, minimum_order_quantity, package_quantity, is_wholesale_available, is_price_on_request, base_price, currency, collection_id"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_archived", false)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const { data: imageData } = await supabase
    .from("product_images")
    .select("id, image_url, alt_text, is_primary, display_order")
    .eq("product_id", product.id)
    .order("display_order", { ascending: true });

  const images = (imageData ?? [])
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) {
        return a.is_primary ? -1 : 1;
      }
      return a.display_order - b.display_order;
    })
    .map((image) => ({
      id: image.id,
      image_url: image.image_url,
      alt_text: image.alt_text,
    }));

  let collection: { name: string; slug: string } | null = null;

  if (product.collection_id) {
    const { data } = await supabase
      .from("collections")
      .select("name, slug")
      .eq("id", product.collection_id)
      .maybeSingle();

    collection = data;
  }

  return (
    <ProductDetailClient
      product={product}
      images={images}
      collection={collection}
    />
  );
}
