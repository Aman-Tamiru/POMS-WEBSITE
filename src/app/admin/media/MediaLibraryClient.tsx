"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Archive,
  Image as ImageIcon,
  RefreshCw,
  Search,
  Upload,
} from "lucide-react";

type MediaItem = {
  id: string;
  file_url: string;
  file_name: string;
  alt_text: string | null;
  category: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  is_archived: boolean;
  created_at: string;
};

const STORAGE_BUCKET = "public-catalogue";

export default function MediaLibraryClient() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("media_library")
      .select(
        "id,file_url,file_name,alt_text,category,file_size_bytes,mime_type,is_archived,created_at"
      )
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setItems([]);
    } else {
      setItems((data ?? []) as MediaItem[]);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    setSuccess("");

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Image size must be 10 MB or less.");
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const filePath = `website/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("media_library")
        .insert({
          file_url: urlData.publicUrl,
          file_name: file.name,
          alt_text: file.name.replace(/\.[^/.]+$/, ""),
          category: "website",
          file_size_bytes: file.size,
          mime_type: file.type,
          is_archived: false,
        });

      if (insertError) {
        throw new Error(
          `The image uploaded, but its library record could not be saved: ${insertError.message}`
        );
      }

      setSuccess("Image uploaded successfully.");
      await loadMedia();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function toggleArchive(item: MediaItem) {
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("media_library")
      .update({ is_archived: !item.is_archived })
      .eq("id", item.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(item.is_archived ? "Image restored." : "Image archived.");
    await loadMedia();
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.file_name.toLowerCase().includes(search.toLowerCase()) ||
      (item.alt_text ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              POMS International
            </p>
            <h1 className="mt-2 font-serif text-3xl">Media Library</h1>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Manage images used across your website.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black">
            {uploading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleUpload(file);
                event.currentTarget.value = "";
              }}
            />
          </label>
        </header>

        {error && (
          <p className="border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p className="border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
            {success}
          </p>
        )}

        <section className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--foreground-muted)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search images..."
              className="w-full border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm"
          >
            <option value="all">All categories</option>
            {categories.map((itemCategory) => (
              <option key={itemCategory} value={itemCategory}>
                {itemCategory}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => void loadMedia()}
            className="flex items-center justify-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </section>

        {loading ? (
          <p className="py-16 text-center text-sm text-[var(--foreground-muted)]">
            Loading media library...
          </p>
        ) : filteredItems.length === 0 ? (
          <div className="border border-[var(--border)] bg-[var(--surface)] px-5 py-16 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-[var(--gold)]" />
            <p className="mt-4 font-serif text-xl">No images found</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Uploaded images will appear here.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="aspect-square bg-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.file_url}
                    alt={item.alt_text ?? item.file_name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-2 p-3">
                  <p className="truncate text-xs font-semibold">
                    {item.file_name}
                  </p>
                  <p className="text-[10px] text-[var(--foreground-muted)]">
                    {item.category} ·{" "}
                    {item.file_size_bytes
                      ? `${(item.file_size_bytes / 1024).toFixed(0)} KB`
                      : "Size unavailable"}
                  </p>

                  <button
                    type="button"
                    onClick={() => void toggleArchive(item)}
                    className="flex w-full items-center justify-center gap-2 border border-[var(--border)] px-2 py-2 text-xs hover:border-[var(--gold)]"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    {item.is_archived ? "Restore" : "Archive"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}