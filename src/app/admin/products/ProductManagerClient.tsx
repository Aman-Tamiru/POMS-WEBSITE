
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    ArrowLeft,
    Plus,
    Pencil,
    Image as ImageIcon,
    Eye,
    EyeOff,
    Archive,
    RefreshCw,
    X,
    Save,
    Package,
  } from "lucide-react";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  shoe_type: string;
  collection_id: string | null;
  materials: string[] | null;
  colors: string[] | null;
  sizes_available: string[] | null;
  base_price: number | null;
  currency: string | null;
  is_price_on_request: boolean;
  is_wholesale_available: boolean;
  minimum_order_quantity: number;
  package_quantity: number;
  is_featured: boolean;
  is_archived: boolean;
  is_published: boolean;
  display_order: number;
};

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
};

type Collection = {
  id: string;
  name: string;
  slug: string;
};

const initialForm = {
  name: "",
  slug: "",
  description: "",
  shoe_type: "flat",
  collection_id: "",
  materials: "",
  colors: "",
  sizes_available: "",
  base_price: "",
  currency: "USD",
  is_price_on_request: true,
  is_wholesale_available: true,
  minimum_order_quantity: "1",
  package_quantity: "12",
  is_featured: false,
  is_published: false,
  display_order: "0",
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProductManagerClient() {
    const [supabase] = useState(() => createClient());

  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [form, setForm] = useState(initialForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");

    const [
      { data: productData, error: productError },
      { data: imageData, error: imageError },
      { data: collectionData, error: collectionError },
    ] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("display_order", { ascending: true }),
      supabase
        .from("product_images")
        .select("*")
        .order("display_order", { ascending: true }),
      supabase
        .from("collections")
        .select("id, name, slug")
        .order("display_order", { ascending: true }),
    ]);

    if (productError) {
      setMessage(`Unable to load products: ${productError.message}`);
    } else {
      setProducts((productData ?? []) as Product[]);
    }

    if (imageError) {
      setMessage(`Unable to load product images: ${imageError.message}`);
    } else {
      setImages((imageData ?? []) as ProductImage[]);
    }

    if (collectionError) {
      setMessage(`Unable to load collections: ${collectionError.message}`);
    } else {
      setCollections((collectionData ?? []) as Collection[]);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openNewForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setSelectedFiles([]);
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name ?? "",
      slug: product.slug ?? "",
      description: product.description ?? "",
      shoe_type: product.shoe_type ?? "flat",
      collection_id: product.collection_id ?? "",
      materials: (product.materials ?? []).join(", "),
      colors: (product.colors ?? []).join(", "),
      sizes_available: (product.sizes_available ?? []).join(", "),
      base_price: product.base_price?.toString() ?? "",
      currency: product.currency ?? "USD",
      is_price_on_request: product.is_price_on_request ?? true,
      is_wholesale_available: product.is_wholesale_available ?? true,
      minimum_order_quantity: String(product.minimum_order_quantity ?? 1),
      package_quantity: String(product.package_quantity ?? 12),
      is_featured: product.is_featured ?? false,
      is_published: product.is_published ?? false,
      display_order: String(product.display_order ?? 0),
    });
    setSelectedFiles([]);
    setMessage("");
    setShowForm(true);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (!form.name.trim()) {
        throw new Error("Product name is required.");
      }

      const slug = makeSlug(form.slug || form.name);

      if (!slug) {
        throw new Error("Please provide a valid product name or slug.");
      }

      const payload = {
        name: form.name.trim(),
        slug,
        description: form.description.trim() || null,
        shoe_type: form.shoe_type,
        collection_id: form.collection_id || null,
        materials: splitValues(form.materials),
        colors: splitValues(form.colors),
        sizes_available: splitValues(form.sizes_available),
        base_price: form.base_price ? Number(form.base_price) : null,
        currency: form.currency,
        is_price_on_request: form.is_price_on_request,
        is_wholesale_available: form.is_wholesale_available,
        minimum_order_quantity: Math.max(1, Number(form.minimum_order_quantity) || 1),
        package_quantity: Math.max(1, Number(form.package_quantity) || 1),
        is_featured: form.is_featured,
        is_published: form.is_published,
        display_order: Number(form.display_order) || 0,
      };

      let productId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();

        if (error) throw error;
        productId = data.id;
      }

      if (!productId) {
        throw new Error("Product was saved but its ID could not be found.");
      }

      if (selectedFiles.length > 0) {
        const uploadedImages: {
          product_id: string;
          image_url: string;
          alt_text: string;
          is_primary: boolean;
          display_order: number;
        }[] = [];

        for (let index = 0; index < selectedFiles.length; index++) {
          const file = selectedFiles[index];

          if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            throw new Error(`${file.name}: use JPG, PNG or WebP images.`);
          }

          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`${file.name}: image must be 5 MB or smaller.`);
          }

          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
          const path = `${productId}/${Date.now()}-${index}-${safeName}`;

          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(path, file, {
              contentType: file.type,
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const { data: publicUrl } = supabase.storage
            .from("product-images")
            .getPublicUrl(path);

          uploadedImages.push({
            product_id: productId,
            image_url: publicUrl.publicUrl,
            alt_text: `${form.name.trim()} product photograph`,
            is_primary: index === 0 && images.every(
              (image) => image.product_id !== productId
            ),
            display_order: index,
          });
        }

        const { error: imageInsertError } = await supabase
          .from("product_images")
          .insert(uploadedImages);

        if (imageInsertError) throw imageInsertError;
      }

      setMessage(
        selectedFiles.length
          ? "Product and photographs saved successfully."
          : "Product saved successfully."
      );

      setShowForm(false);
      setSelectedFiles([]);
      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_published: !product.is_published })
      .eq("id", product.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadData();
  };

  const toggleArchived = async (product: Product) => {
    const confirmed = window.confirm(
      product.is_archived
        ? `Restore "${product.name}"?`
        : `Archive "${product.name}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .update({
        is_archived: !product.is_archived,
        is_published: product.is_archived ? product.is_published : false,
      })
      .eq("id", product.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadData();
  };

  const visibleProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.slug.toLowerCase().includes(search.toLowerCase());

    return matchesSearch && product.is_archived === showArchived;
  });

  const getPrimaryImage = (productId: string) =>
    images.find((image) => image.product_id === productId && image.is_primary)
      ?.image_url ??
    images.find((image) => image.product_id === productId)?.image_url;

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 pb-16 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--gold)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Dashboard
            </Link>
            <h1 className="font-serif text-2xl font-bold tracking-wide sm:text-3xl">
              Product Manager
            </h1>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Manage your product catalogue, photographs and publication.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void loadData()}
              className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--gold)]"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={openNewForm}
              className="inline-flex items-center gap-2 bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Total Products", products.filter((p) => !p.is_archived).length],
            ["Published", products.filter((p) => p.is_published && !p.is_archived).length],
            ["Featured", products.filter((p) => p.is_featured && !p.is_archived).length],
            ["Archived", products.filter((p) => p.is_archived).length],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                {label}
              </p>
              <p className="mt-2 font-serif text-2xl font-bold text-[var(--gold)]">
                {value}
              </p>
            </div>
          ))}
        </section>

        {message && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 border border-[var(--border)] bg-[var(--surface)] p-3 text-sm"
          >
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSave}
            className="space-y-5 border border-[var(--gold)]/50 bg-[var(--surface)] p-4 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
              <h2 className="font-serif text-xl font-semibold">
                {editingId ? "Edit Product" : "Create Product"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-[var(--foreground-muted)] hover:text-[var(--gold)]"
                aria-label="Close product form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                Product Name *
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                      slug: editingId ? form.slug : makeSlug(e.target.value),
                    })
                  }
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                  placeholder="e.g. Signature Pointed Bow Flat"
                />
              </label>

              <label className="space-y-1 text-sm">
                URL Slug
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                  placeholder="signature-pointed-bow-flat"
                />
              </label>

              <label className="space-y-1 text-sm">
                Shoe Type *
                <select
                  value={form.shoe_type}
                  onChange={(e) => setForm({ ...form, shoe_type: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                >
                  {["flat", "heel", "pump", "slipper", "slide", "sandal", "boot", "bespoke"].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm">
                Collection
                <select
                  value={form.collection_id}
                  onChange={(e) => setForm({ ...form, collection_id: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                >
                  <option value="">No collection</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm sm:col-span-2">
                Product Description
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                  placeholder="Describe the design, craftsmanship and product details..."
                />
              </label>

              <label className="space-y-1 text-sm">
                Materials (comma-separated)
                <input
                  value={form.materials}
                  onChange={(e) => setForm({ ...form, materials: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                  placeholder="Calfskin leather, suede"
                />
              </label>

              <label className="space-y-1 text-sm">
                Colors (comma-separated)
                <input
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                  placeholder="Noir Black, Burgundy Wine"
                />
              </label>

              <label className="space-y-1 text-sm">
                Available Sizes (comma-separated)
                <input
                  value={form.sizes_available}
                  onChange={(e) => setForm({ ...form, sizes_available: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                  placeholder="36, 37, 38, 39, 40"
                />
              </label>

              <label className="space-y-1 text-sm">
                Display Order
                <input
                  type="number"
                  min="0"
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                />
              </label>

              <label className="space-y-1 text-sm">
                Base Price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.base_price}
                  onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                  placeholder="Leave blank if not set"
                />
              </label>

              <label className="space-y-1 text-sm">
                Currency
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                >
                  {["USD", "ETB", "EUR", "GBP", "AED"].map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-sm">
                Minimum Order Quantity
                <input
                  type="number"
                  min="1"
                  value={form.minimum_order_quantity}
                  onChange={(e) => setForm({ ...form, minimum_order_quantity: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                />
              </label>

              <label className="space-y-1 text-sm">
                Package Quantity
                <input
                  type="number"
                  min="1"
                  value={form.package_quantity}
                  onChange={(e) => setForm({ ...form, package_quantity: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
                />
              </label>
            </div>

            <div className="space-y-3 border-t border-[var(--border)] pt-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_price_on_request}
                  onChange={(e) => setForm({ ...form, is_price_on_request: e.target.checked })}
                />
                Price available on request
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_wholesale_available}
                  onChange={(e) => setForm({ ...form, is_wholesale_available: e.target.checked })}
                />
                Available for wholesale
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                />
                Feature on homepage
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                />
                Publish product on website
              </label>
            </div>

            <div className="space-y-2 border-t border-[var(--border)] pt-4">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <ImageIcon className="h-4 w-4 text-[var(--gold)]" />
                Product Photographs
              </label>
              <p className="text-xs text-[var(--foreground-muted)]">
                JPG, PNG or WebP. Maximum 5 MB per image. You can select multiple images.
                The first image becomes the primary image if the product has no existing photographs.
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
                className="block w-full text-sm text-[var(--foreground-muted)] file:mr-3 file:border-0 file:bg-[var(--gold)] file:px-4 file:py-2 file:font-semibold file:text-black"
              />
              {selectedFiles.length > 0 && (
                <p className="text-xs text-[var(--gold)]">
                  {selectedFiles.length} image(s) selected
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Product"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-[var(--border)] px-5 py-2.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-semibold">
                {showArchived ? "Archived Products" : "Your Products"}
              </h2>
              <p className="text-xs text-[var(--foreground-muted)]">
                {visibleProducts.length} product(s)
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="min-w-0 border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowArchived(!showArchived)}
                className="border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--gold)]"
              >
                {showArchived ? "Active Products" : "View Archived"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--foreground-muted)]">
              Loading products...
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
              <Package className="mx-auto h-9 w-9 text-[var(--gold)]" />
              <p className="mt-3 font-serif text-lg">No products found</p>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Add your first product or change your search.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => {
                const image = getPrimaryImage(product.id);

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden border border-[var(--border)] bg-[var(--surface)]"
                  >
                    <div className="relative aspect-[4/3] bg-[var(--background-secondary)]">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--foreground-muted)]">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs">No photograph uploaded</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 p-4">
                      <div>
                        <h3 className="font-serif text-lg font-semibold">{product.name}</h3>
                        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                          {product.shoe_type} · {product.slug}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className={`border px-2 py-1 ${product.is_published ? "border-green-700 text-green-600" : "border-[var(--border)] text-[var(--foreground-muted)]"}`}>
                          {product.is_published ? "Published" : "Draft"}
                        </span>
                        {product.is_featured && (
                          <span className="border border-[var(--gold)]/50 px-2 py-1 text-[var(--gold)]">
                            Featured
                          </span>
                        )}
                        {product.is_archived && (
                          <span className="border border-red-700 px-2 py-1 text-red-500">
                            Archived
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[var(--foreground-muted)]">
                        MOQ: {product.minimum_order_quantity} · Package: {product.package_quantity}
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="inline-flex items-center justify-center gap-2 border border-[var(--border)] px-3 py-2 text-xs hover:border-[var(--gold)]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void togglePublished(product)}
                          disabled={product.is_archived}
                          className="inline-flex items-center justify-center gap-2 border border-[var(--border)] px-3 py-2 text-xs hover:border-[var(--gold)] disabled:opacity-40"
                        >
                          {product.is_published ? (
                            <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
                          ) : (
                            <><Eye className="h-3.5 w-3.5" /> Publish</>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => void toggleArchived(product)}
                          className="col-span-2 inline-flex items-center justify-center gap-2 border border-[var(--border)] px-3 py-2 text-xs text-[var(--foreground-muted)] hover:border-red-700 hover:text-red-500"
                        >
                          <Archive className="h-3.5 w-3.5" />
                          {product.is_archived ? "Restore Product" : "Archive Product"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
