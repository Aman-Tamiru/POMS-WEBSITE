"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url?: string | null;
  image_url?: string | null;
  is_published: boolean;
};

type Product = {
    id: string;
    name: string;
    slug: string;
    collection_id: string | null;
    is_published: boolean;
    is_archived: boolean;
  };

const initialForm = {
  name: "",
  slug: "",
  description: "",
  cover_image_url: "",
  is_published: true,
  productIds: [] as string[],
};

export default function CollectionManagerClient() {
    const [supabase] = useState(() => createClient());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const { data: collectionData, error: collectionError } =
        await supabase.from("collections").select("*").order("name");

      if (collectionError) throw collectionError;

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, name, slug, collection_id, is_published, is_archived")
        .order("name");

      if (productError) throw productError;

      setCollections((collectionData ?? []) as Collection[]);
      setProducts((productData ?? []) as Product[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load collections."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setSelectedFile(null);
    setMessage("");
    setError("");
  }

  function editCollection(collection: Collection) {
    setEditingId(collection.id);
  
    setForm({
      name: collection.name,
      slug: collection.slug,
      description: collection.description ?? "",
      cover_image_url: collection.cover_image_url ?? "",
      is_published: collection.is_published,
      productIds: products
        .filter((product) => product.collection_id === collection.id)
        .map((product) => product.id),
    });
  
    setSelectedFile(null);
    setMessage("");
    setError("");
  }

    
  async function saveCollection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
  
    try {
      if (!form.name.trim() || !form.slug.trim()) {
        throw new Error("Collection name and slug are required.");
      }
  
      let coverImageUrl = form.cover_image_url;
  
      if (selectedFile) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(
            selectedFile.type
          )
        ) {
          throw new Error("Use JPG, PNG or WebP images.");
        }
  
        if (selectedFile.size > 5 * 1024 * 1024) {
          throw new Error("Image must be 5 MB or smaller.");
        }
  
        const safeName = selectedFile.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "-"
        );
  
        const storagePath = `collections/${Date.now()}-${safeName}`;
  
        const { error: uploadError } = await supabase.storage
          .from("collection-images")
          .upload(storagePath, selectedFile, {
            contentType: selectedFile.type,
            upsert: false,
          });
  
        if (uploadError) throw uploadError;
  
        const { data } = supabase.storage
          .from("collection-images")
          .getPublicUrl(storagePath);
  
        coverImageUrl = data.publicUrl;
      }
  
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.description.trim(),
        is_published: form.is_published,
        cover_image_url: coverImageUrl || null,
      };
  
      let collectionId = editingId;
  
      if (editingId) {
        const { error: updateError } = await supabase
          .from("collections")
          .update(payload)
          .eq("id", editingId);
  
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from("collections")
          .insert(payload)
          .select("id")
          .single();
  
        if (insertError) throw insertError;
  
        collectionId = data.id;
      }
  
      if (!collectionId) {
        throw new Error("Collection ID could not be found.");
      }
  
      const previouslyAssignedIds = products
        .filter((product) => product.collection_id === collectionId)
        .map((product) => product.id);
  
      const removedProductIds = previouslyAssignedIds.filter(
        (productId) => !form.productIds.includes(productId)
      );
  
      if (form.productIds.length > 0) {
        const { error: assignError } = await supabase
          .from("products")
          .update({ collection_id: collectionId })
          .in("id", form.productIds);
  
        if (assignError) throw assignError;
      }
  
      if (removedProductIds.length > 0) {
        const { error: unassignError } = await supabase
          .from("products")
          .update({ collection_id: null })
          .in("id", removedProductIds)
          .eq("collection_id", collectionId);
  
        if (unassignError) throw unassignError;
      }
  
      resetForm();
      await loadData();
  
      setMessage("Collection saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save collection."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(collection: Collection) {
    setError("");
    setMessage("");

    const { error: updateError } = await supabase
      .from("collections")
      .update({ is_published: !collection.is_published })
      .eq("id", collection.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage("Collection status updated.");
    await loadData();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090909] p-8 text-white">
        Loading collections...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] px-5 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <a
          href="/admin"
          className="text-xs uppercase tracking-widest text-[#c5a46d]"
        >
          ← Back to Admin Dashboard
        </a>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#c5a46d]">
              POM&apos;S International
            </p>
            <h1 className="mt-3 text-3xl font-light">Collection Manager</h1>
            <p className="mt-2 text-sm text-white/50">
              Manage collection photography, descriptions and products.
            </p>
          </div>

          <button
            onClick={resetForm}
            className="bg-[#c5a46d] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black"
          >
            Add Collection
          </button>
        </div>

        {message && (
          <p className="mt-6 border border-green-800 bg-green-950/30 p-4 text-sm text-green-300">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-6 border border-red-800 bg-red-950/30 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        <section className="mt-10 grid gap-5 sm:grid-cols-3">
          <div className="border border-white/10 p-5">
            <p className="text-xs uppercase text-white/40">Total Collections</p>
            <p className="mt-3 text-3xl">{collections.length}</p>
          </div>
          <div className="border border-white/10 p-5">
            <p className="text-xs uppercase text-white/40">Published</p>
            <p className="mt-3 text-3xl">
              {collections.filter((item) => item.is_published).length}
            </p>
          </div>
          <div className="border border-white/10 p-5">
            <p className="text-xs uppercase text-white/40">Available Products</p>
            <p className="mt-3 text-3xl">{products.length}</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-xl font-light">Your Collections</h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <article
                key={collection.id}
                className="overflow-hidden border border-white/10 bg-white/[0.02]"
              >
                {(collection.cover_image_url || collection.image_url) && (
                  <img
                    src={collection.cover_image_url || collection.image_url || ""}
                    alt={collection.name}
                    className="h-52 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg">{collection.name}</h3>
                    <span className="text-xs text-[#c5a46d]">
                      {collection.is_published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-white/50">
                    {collection.description}
                  </p>

                  <p className="mt-3 text-xs text-white/40">
                    /{collection.slug}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => void editCollection(collection)}
                      className="flex-1 border border-[#c5a46d] px-3 py-2 text-xs uppercase tracking-wider text-[#c5a46d]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void togglePublished(collection)}
                      className="flex-1 border border-white/20 px-3 py-2 text-xs uppercase tracking-wider"
                    >
                      {collection.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 border border-white/10 p-6 md:p-8">
          <h2 className="text-xl font-light">
            {editingId ? "Edit Collection" : "Create Collection"}
          </h2>

          <form onSubmit={saveCollection} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm text-white/60">
                Collection Name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="mt-2 w-full border border-white/15 bg-transparent p-3 text-white"
                />
              </label>

              <label className="block text-sm text-white/60">
                URL Slug
                <input
                  required
                  value={form.slug}
                  onChange={(event) =>
                    setForm({ ...form, slug: event.target.value })
                  }
                  className="mt-2 w-full border border-white/15 bg-transparent p-3 text-white"
                />
              </label>
            </div>

            <label className="block text-sm text-white/60">
              Description
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                className="mt-2 w-full border border-white/15 bg-transparent p-3 text-white"
              />
            </label>

            <label className="block text-sm text-white/60">
              Collection Cover Photograph
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] ?? null)
                }
                className="mt-2 block w-full text-sm"
              />
            </label>

            {(selectedFile || form.cover_image_url) && (
              <div>
                <p className="mb-2 text-xs text-white/40">Image Preview</p>
                <img
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : form.cover_image_url
                  }
                  alt="Collection preview"
                  className="h-48 w-full max-w-md object-cover"
                />
              </div>
            )}

            <div>
              <h3 className="mb-3 text-sm text-white/60">
                Assign Existing Products
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <label
                    key={product.id}
                    className="flex items-center gap-3 border border-white/10 p-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.productIds.includes(product.id)}
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          productIds: event.target.checked
                            ? [...current.productIds, product.id]
                            : current.productIds.filter(
                                (id) => id !== product.id
                              ),
                        }));
                      }}
                    />
                    {product.name}
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(event) =>
                  setForm({
                    ...form,
                    is_published: event.target.checked,
                  })
                }
              />
              Publish collection
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#c5a46d] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-black disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Collection"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border border-white/20 px-8 py-3 text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}