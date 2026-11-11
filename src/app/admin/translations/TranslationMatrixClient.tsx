
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
  { code: "so", label: "Soomaali" },
  { code: "zh-CN", label: "简体中文" },
  { code: "hi", label: "हिन्दी" },
  { code: "es", label: "Español" },
];

const contentTypes = [
  {
    key: "products",
    label: "Products",
    base: "products",
    translations: "product_translations",
    foreign: "product_id",
  },
  {
    key: "collections",
    label: "Collections",
    base: "collections",
    translations: "collection_translations",
    foreign: "collection_id",
  },
  {
    key: "pages",
    label: "CMS Pages",
    base: "site_pages",
    translations: "site_page_translations",
    foreign: "page_id",
  },
  {
    key: "sections",
    label: "CMS Sections",
    base: "site_page_sections",
    translations: "site_section_translations",
    foreign: "section_id",
  },
] as const;

type Item = {
  id: string;
  label: string;
};

type Field = {
  name: string;
  value: string;
};

export default function TranslationMatrixClient() {
  const supabase = useMemo(() => createClient(), []);

  const [type, setType] = useState<
    (typeof contentTypes)[number]["key"]
  >("products");

  const [language, setLanguage] = useState("am");
  const [items, setItems] = useState<Item[]>([]);
  const [itemId, setItemId] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [reviewed, setReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const config = contentTypes.find((entry) => entry.key === type)!;

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setFields([]);
    setItems([]);
    setItemId("");

    try {
      if (type === "products") {
        const { data, error: queryError } = await supabase
          .from("products")
          .select("id,name")
          .order("name");

        if (queryError) {
          setError(queryError.message);
          return;
        }

        setItems(
          (data ?? []).map((row: { id: string; name: string }) => ({
            id: row.id,
            label: row.name,
          }))
        );
      } else if (type === "collections") {
        const { data, error: queryError } = await supabase
          .from("collections")
          .select("id,name")
          .order("name");

        if (queryError) {
          setError(queryError.message);
          return;
        }

        setItems(
          (data ?? []).map((row: { id: string; name: string }) => ({
            id: row.id,
            label: row.name,
          }))
        );
      } else if (type === "pages") {
        const { data, error: queryError } = await supabase
          .from("site_pages")
          .select("id,title,route_path")
          .order("title");

        if (queryError) {
          setError(queryError.message);
          return;
        }

        setItems(
          (data ?? []).map(
            (row: {
              id: string;
              title: string;
              route_path: string | null;
            }) => ({
              id: row.id,
              label: `${row.title} (${row.route_path ?? "No route"})`,
            })
          )
        );
      } else {
        const { data, error: queryError } = await supabase
          .from("site_page_sections")
          .select("id,section_type")
          .order("section_type");

        if (queryError) {
          setError(queryError.message);
          return;
        }

        setItems(
          (data ?? []).map(
            (row: { id: string; section_type: string }) => ({
              id: row.id,
              label: `${row.section_type} — ${row.id}`,
            })
          )
        );
      }
    } catch {
      setError("Unable to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [supabase, type]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function loadTranslation(id: string, lang: string) {
    if (!id) {
      setItemId("");
      setFields([]);
      setReviewed(false);
      return;
    }

    setItemId(id);
    setLoading(true);
    setError("");
    setMessage("");
    setFields([]);
    setReviewed(false);

    try {
      const { data, error: queryError } = await supabase
        .from(config.translations)
        .select("*")
        .eq(config.foreign, id)
        .eq("language", lang)
        .maybeSingle();

      if (queryError) {
        setError(queryError.message);
        return;
      }

      const fieldNames =
        type === "products"
          ? [
              "name",
              "description",
              "materials_description",
              "meta_title",
              "meta_description",
            ]
          : type === "collections"
            ? [
                "name",
                "description",
                "meta_title",
                "meta_description",
              ]
            : type === "pages"
              ? [
                  "title",
                  "seo_title",
                  "seo_description",
                  "og_title",
                  "og_description",
                ]
              : ["title", "subtitle", "body", "button_label"];

      setFields(
        fieldNames.map((name) => ({
          name,
          value: data?.[name] ?? "",
        }))
      );

      setReviewed(Boolean(data?.is_reviewed));
    } catch {
      setError("Unable to load this translation. Please try again.");
      setFields([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveTranslation() {
    if (!itemId) {
      setError("Select a content item first.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const values: Record<string, unknown> = {
        [config.foreign]: itemId,
        language,
        is_reviewed: reviewed,
      };

      fields.forEach((field) => {
        values[field.name] = field.value || null;
      });

      if (
        type === "products" ||
        type === "collections" ||
        type === "pages"
      ) {
        const requiredField = type === "pages" ? "title" : "name";

        if (!values[requiredField]) {
          setError(`The ${requiredField} field is required.`);
          return;
        }
      }

      if (type === "sections") {
        values.translated_content = {};
      }

      const { error: saveError } = await supabase
        .from(config.translations)
        .upsert(values, {
          onConflict: `${config.foreign},language`,
        });

      if (saveError) {
        setError(saveError.message);
      } else {
        setMessage("Translation saved successfully.");
      }
    } catch {
      setError("Unable to save the translation. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-7 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-7">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-[var(--gold)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin Dashboard
        </Link>

        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
            POMS International
          </p>

          <h1 className="mt-2 font-serif text-3xl">
            Translation Matrix
          </h1>

          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Edit and review translations for products, collections, CMS
            pages and CMS sections.
          </p>
        </header>

        {error && (
          <p
            role="alert"
            className="border border-red-500 p-3 text-sm"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="border border-[var(--gold)] p-3 text-sm"
          >
            {message}
          </p>
        )}

        <section className="grid gap-4 border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-2">
          <label className="text-sm">
            Content type

            <select
              value={type}
              onChange={(event) => setType(event.target.value as typeof type)}
              className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] p-3"
            >
              {contentTypes.map((entry) => (
                <option key={entry.key} value={entry.key}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            Language

            <select
              value={language}
              onChange={(event) => {
                const nextLanguage = event.target.value;
                setLanguage(nextLanguage);

                if (itemId) {
                  void loadTranslation(itemId, nextLanguage);
                }
              }}
              className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] p-3"
            >
              {languages.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm sm:col-span-2">
            Content item

            <select
              value={itemId}
              onChange={(event) =>
                void loadTranslation(event.target.value, language)
              }
              className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] p-3"
            >
              <option value="">Select content</option>

              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => void loadItems()}
            disabled={loading}
            className="text-left text-sm text-[var(--gold)] disabled:opacity-50"
          >
            <RefreshCw className="mr-1 inline h-4 w-4" />
            Refresh content list
          </button>
        </section>

        <section className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-serif text-xl">
            Translation fields
          </h2>

          {loading ? (
            <p className="py-6 text-sm">Loading...</p>
          ) : !itemId ? (
            <p className="py-6 text-sm text-[var(--foreground-muted)]">
              Select a content item to edit its translation.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {fields.map((field) => (
                <label
                  key={field.name}
                  className="block text-sm"
                >
                  {field.name.replaceAll("_", " ")}

                  <textarea
                    rows={
                      field.name.includes("description") ||
                      field.name === "body"
                        ? 5
                        : 2
                    }
                    value={field.value}
                    onChange={(event) =>
                      setFields((current) =>
                        current.map((entry) =>
                          entry.name === field.name
                            ? {
                                ...entry,
                                value: event.target.value,
                              }
                            : entry
                        )
                      )
                    }
                    className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] p-3"
                  />
                </label>
              ))}

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={reviewed}
                  onChange={(event) =>
                    setReviewed(event.target.checked)
                  }
                />
                Mark translation as reviewed
              </label>

              <button
                type="button"
                disabled={saving || loading}
                onClick={() => void saveTranslation()}
                className="inline-flex items-center gap-2 bg-[var(--gold)] px-5 py-3 text-sm text-black disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save translation"}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
