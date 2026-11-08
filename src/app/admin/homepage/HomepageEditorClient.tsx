"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, RefreshCw, Save } from "lucide-react";

type HomepageSection = {
  id: string;
  section_key: string;
  title: string;
  subtitle: string | null;
  body_text: string | null;
  button_label: string | null;
  button_link: string | null;
  background_image_url: string | null;
  display_order: number;
  is_visible: boolean;
  custom_config: Record<string, unknown> | null;
  updated_at: string;
};

export default function HomepageEditorClient() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  const loadSections = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("homepage_sections")
      .select(
        "id,section_key,title,subtitle,body_text,button_label,button_link,background_image_url,display_order,is_visible,custom_config,updated_at"
      )
      .order("display_order", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setSections([]);
    } else {
      setSections((data ?? []) as HomepageSection[]);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadSections();
  }, [loadSections]);

  function updateField<K extends keyof HomepageSection>(
    id: string,
    field: K,
    value: HomepageSection[K]
  ) {
    setSections((current) =>
      current.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  }

  async function saveSection(section: HomepageSection) {
    setSavingId(section.id);
    setError("");
    setSuccess("");

    const { error: saveError } = await supabase
      .from("homepage_sections")
      .update({
        title: section.title,
        subtitle: section.subtitle,
        body_text: section.body_text,
        button_label: section.button_label,
        button_link: section.button_link,
        background_image_url: section.background_image_url,
        display_order: section.display_order,
        is_visible: section.is_visible,
        custom_config: section.custom_config,
        updated_at: new Date().toISOString(),
      })
      .eq("id", section.id);

    if (saveError) {
      setError(saveError.message);
    } else {
      setSuccess(`"${section.title}" saved successfully.`);
      await loadSections();
    }

    setSavingId(null);
  }

  async function toggleVisibility(section: HomepageSection) {
    const nextValue = !section.is_visible;

    updateField(section.id, "is_visible", nextValue);

    const { error: updateError } = await supabase
      .from("homepage_sections")
      .update({
        is_visible: nextValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", section.id);

    if (updateError) {
      updateField(section.id, "is_visible", section.is_visible);
      setError(updateError.message);
      return;
    }

    setSuccess(
      nextValue ? "Homepage section is now visible." : "Section is hidden."
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              POMS International
            </p>
            <h1 className="mt-2 font-serif text-3xl">Homepage Editor</h1>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Edit your existing homepage sections and their visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadSections()}
            className="flex items-center gap-2 border border-[var(--border)] px-4 py-3 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
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

        {loading ? (
          <p className="py-16 text-center text-sm text-[var(--foreground-muted)]">
            Loading homepage sections...
          </p>
        ) : sections.length === 0 ? (
          <p className="border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--foreground-muted)]">
            No homepage sections were returned by Supabase.
          </p>
        ) : (
          <div className="space-y-5">
            {sections.map((section) => (
              <article
                key={section.id}
                className="space-y-4 border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--gold)]">
                      {section.section_key}
                    </p>
                    <h2 className="mt-1 font-serif text-xl">
                      {section.title || "Untitled section"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => void toggleVisibility(section)}
                    className="flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-xs"
                  >
                    {section.is_visible ? (
                      <Eye className="h-4 w-4 text-[var(--gold)]" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                    {section.is_visible ? "Visible" : "Hidden"}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1 text-xs">
                    <span className="text-[var(--foreground-muted)]">
                      Section title
                    </span>
                    <input
                      value={section.title ?? ""}
                      onChange={(event) =>
                        updateField(section.id, "title", event.target.value)
                      }
                      className="w-full border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs">
                    <span className="text-[var(--foreground-muted)]">
                      Subtitle
                    </span>
                    <input
                      value={section.subtitle ?? ""}
                      onChange={(event) =>
                        updateField(section.id, "subtitle", event.target.value)
                      }
                      className="w-full border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs sm:col-span-2">
                    <span className="text-[var(--foreground-muted)]">
                      Body text
                    </span>
                    <textarea
                      rows={4}
                      value={section.body_text ?? ""}
                      onChange={(event) =>
                        updateField(section.id, "body_text", event.target.value)
                      }
                      className="w-full border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs">
                    <span className="text-[var(--foreground-muted)]">
                      Button label
                    </span>
                    <input
                      value={section.button_label ?? ""}
                      onChange={(event) =>
                        updateField(
                          section.id,
                          "button_label",
                          event.target.value
                        )
                      }
                      className="w-full border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs">
                    <span className="text-[var(--foreground-muted)]">
                      Button link
                    </span>
                    <input
                      value={section.button_link ?? ""}
                      onChange={(event) =>
                        updateField(
                          section.id,
                          "button_link",
                          event.target.value
                        )
                      }
                      className="w-full border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs sm:col-span-2">
                    <span className="text-[var(--foreground-muted)]">
                      Background image URL
                    </span>
                    <input
                      value={section.background_image_url ?? ""}
                      onChange={(event) =>
                        updateField(
                          section.id,
                          "background_image_url",
                          event.target.value
                        )
                      }
                      className="w-full border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
                    />
                  </label>

                  <label className="space-y-1 text-xs">
                    <span className="text-[var(--foreground-muted)]">
                      Display order
                    </span>
                    <input
                      type="number"
                      value={section.display_order}
                      onChange={(event) =>
                        updateField(
                          section.id,
                          "display_order",
                          Number(event.target.value)
                        )
                      }
                      className="w-full border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
                    />
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={savingId === section.id}
                    onClick={() => void saveSection(section)}
                    className="flex items-center gap-2 bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {savingId === section.id ? "Saving..." : "Save Section"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}