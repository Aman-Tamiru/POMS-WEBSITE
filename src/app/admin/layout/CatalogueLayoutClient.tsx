
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, RefreshCw, ChevronUp, ChevronDown, Save } from "lucide-react";

type Page = {
  id: string;
  title: string;
  route_path: string;
  page_type: string;
};

type Section = {
  id: string;
  page_id: string;
  section_type: string;
  display_order: number;
};

export default function CatalogueLayoutClient() {
  const supabase = useMemo(() => createClient(), []);
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: pageError } = await supabase
      .from("site_pages")
      .select("id,title,route_path,page_type")
      .order("title");

    if (pageError) {
      setError(pageError.message);
      setLoading(false);
      return;
    }

    const pageRows = (data ?? []) as Page[];
    setPages(pageRows);

    const catalogue = pageRows.find(
      (page) => page.page_type === "catalogue" || page.route_path === "/catalogue"
    );

    const pageId = selectedPage || catalogue?.id || pageRows[0]?.id || "";
    setSelectedPage(pageId);

    if (pageId) {
      const { data: sectionData, error: sectionError } = await supabase
        .from("site_page_sections")
        .select("id,page_id,section_type,display_order")
        .eq("page_id", pageId)
        .order("display_order");

      if (sectionError) setError(sectionError.message);
      else setSections((sectionData ?? []) as Section[]);
    } else {
      setSections([]);
    }

    setLoading(false);
  }, [supabase, selectedPage]);

  useEffect(() => {
    void load();
  }, [load]);

  async function selectPage(id: string) {
    setSelectedPage(id);
    setLoading(true);
    setError("");

    const { data, error: sectionError } = await supabase
      .from("site_page_sections")
      .select("id,page_id,section_type,display_order")
      .eq("page_id", id)
      .order("display_order");

    if (sectionError) setError(sectionError.message);
    else setSections((data ?? []) as Section[]);

    setLoading(false);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;

    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];

    setSections(next.map((section, order) => ({
      ...section,
      display_order: order,
    })));
  }

  async function saveOrder() {
    setSaving(true);
    setError("");
    setMessage("");

    for (let index = 0; index < sections.length; index++) {
      const section = sections[index];

      const { error: updateError } = await supabase
        .from("site_page_sections")
        .update({ display_order: index })
        .eq("id", section.id)
        .eq("page_id", selectedPage);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    }

    setMessage("Catalogue section order saved.");
    setSaving(false);
    await selectPage(selectedPage);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-7 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-7">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[var(--gold)]">
          <ArrowLeft className="h-4 w-4" /> Admin Dashboard
        </Link>

        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">POMS International</p>
          <h1 className="mt-2 font-serif text-3xl">Catalogue Layout Editor</h1>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Select a CMS page and arrange its existing sections. This changes the CMS display order;
            it does not automatically change pages that are not yet rendered from the CMS.
          </p>
        </header>

        {error && <p role="alert" className="border border-red-500 p-3 text-sm">{error}</p>}
        {message && <p role="status" className="border border-[var(--gold)] p-3 text-sm">{message}</p>}

        <section className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <label className="text-sm">
            CMS page
            <select
              value={selectedPage}
              onChange={(event) => void selectPage(event.target.value)}
              className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] p-3"
            >
              <option value="">Select a page</option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title} — {page.route_path}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-6 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl">Page sections</h2>
            <button onClick={() => void load()} className="text-sm text-[var(--gold)]">
              <RefreshCw className="mr-1 inline h-4 w-4" /> Refresh
            </button>
          </div>

          {loading ? (
            <p className="py-6 text-sm">Loading CMS sections...</p>
          ) : sections.length === 0 ? (
            <p className="py-6 text-sm text-[var(--foreground-muted)]">
              No sections were found for this page in the CMS.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {sections.map((section, index) => (
                <article key={section.id} className="flex items-center gap-3 border border-[var(--border)] p-4">
                  <span className="w-8 text-sm text-[var(--gold)]">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{section.section_type.replaceAll("_", " ")}</p>
                    <p className="mt-1 truncate text-xs text-[var(--foreground-muted)]">{section.id}</p>
                  </div>
                  <button
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="p-2 text-[var(--gold)] disabled:opacity-30"
                    aria-label="Move section up"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <button
                    disabled={index === sections.length - 1}
                    onClick={() => move(index, 1)}
                    className="p-2 text-[var(--gold)] disabled:opacity-30"
                    aria-label="Move section down"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </article>
              ))}
            </div>
          )}

          <button
            disabled={saving || !selectedPage || sections.length === 0}
            onClick={() => void saveOrder()}
            className="mt-6 inline-flex items-center gap-2 bg-[var(--gold)] px-5 py-3 text-sm text-black disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save section order"}
          </button>
        </section>
      </div>
    </main>
  );
}
