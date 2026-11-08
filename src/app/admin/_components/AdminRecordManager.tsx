
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RefreshCw, Save, Search, FileJson } from "lucide-react";

type RecordItem = Record<string, unknown> & {
  id: string | number;
};

type Props = {
  table: string;
  title: string;
  description: string;
};

export default function AdminRecordManager({
  table,
  title,
  description,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [editor, setEditor] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: loadError } = await supabase
      .from(table)
      .select("*")
      .limit(100);

    if (loadError) {
      setError(loadError.message);
      setRecords([]);
    } else {
      const rows = (data ?? []) as RecordItem[];
      setRecords(rows);
      setSelectedId(null);
      setEditor("");
    }

    setLoading(false);
  }, [supabase, table]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  function openRecord(record: RecordItem) {
    setSelectedId(record.id);
    setEditor(JSON.stringify(record, null, 2));
    setError("");
    setSuccess("");
  }

  async function saveRecord() {
    if (selectedId === null) return;

    setError("");
    setSuccess("");

    let edited: RecordItem;

    try {
      edited = JSON.parse(editor) as RecordItem;
    } catch {
      setError("The JSON is not valid. Correct it before saving.");
      return;
    }

    const original = records.find((record) => record.id === selectedId);

    if (!original) {
      setError("The selected record is no longer in the loaded list.");
      return;
    }

    if (String(edited.id) !== String(original.id)) {
      setError("Record IDs cannot be changed.");
      return;
    }

    const protectedFields = new Set(["id", "created_at", "updated_at"]);
    const patch: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(edited)) {
      if (
        !protectedFields.has(key) &&
        JSON.stringify(value) !== JSON.stringify(original[key])
      ) {
        patch[key] = value;
      }
    }

    for (const key of Object.keys(original)) {
      if (
        !protectedFields.has(key) &&
        !Object.prototype.hasOwnProperty.call(edited, key)
      ) {
        setError(`The field "${key}" cannot be removed from the record.`);
        return;
      }
    }

    if (Object.keys(patch).length === 0) {
      setSuccess("There are no changes to save.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase
      .from(table)
      .update(patch)
      .eq("id", original.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Record updated successfully.");
      await loadRecords();
    }

    setSaving(false);
  }

  const filteredRecords = records.filter((record) =>
    JSON.stringify(record).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              POMS International
            </p>
            <h1 className="mt-2 font-serif text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadRecords()}
            disabled={loading}
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

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="min-w-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--foreground-muted)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search records..."
                className="w-full border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm"
              />
            </div>

            <div className="border border-[var(--border)] bg-[var(--surface)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] p-3">
                <span className="text-xs uppercase tracking-widest text-[var(--gold)]">
                  Records
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">
                  {filteredRecords.length} shown
                </span>
              </div>

              {loading ? (
                <p className="p-6 text-sm text-[var(--foreground-muted)]">
                  Loading records...
                </p>
              ) : filteredRecords.length === 0 ? (
                <p className="p-6 text-sm text-[var(--foreground-muted)]">
                  No records found.
                </p>
              ) : (
                <div className="max-h-[650px] divide-y divide-[var(--border)] overflow-y-auto">
                  {filteredRecords.map((record) => (
                    <button
                      key={String(record.id)}
                      type="button"
                      onClick={() => openRecord(record)}
                      className={`w-full p-4 text-left transition hover:bg-[var(--background)] ${
                        selectedId === record.id
                          ? "border-l-2 border-[var(--gold)] bg-[var(--background)]"
                          : ""
                      }`}
                    >
                      <span className="block truncate text-sm font-medium">
                        {String(
                          record.name ??
                            record.subject ??
                            record.title ??
                            record.email ??
                            `Record ${record.id}`
                        )}
                      </span>
                      <span className="mt-1 block truncate text-xs text-[var(--foreground-muted)]">
                        ID: {String(record.id)}
                      </span>
                      <span className="mt-1 block truncate text-xs text-[var(--foreground-muted)]">
                        {String(
                          record.status ??
                            record.created_at ??
                            "Record"
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="min-w-0 space-y-3">
            <div className="flex items-center gap-2">
              <FileJson className="h-4 w-4 text-[var(--gold)]" />
              <h2 className="font-serif text-xl">Record Editor</h2>
            </div>

            {selectedId === null ? (
              <div className="flex min-h-64 flex-col items-center justify-center border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
                <FileJson className="h-9 w-9 text-[var(--gold)]" />
                <p className="mt-3 text-sm">Select a record to view or edit it.</p>
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  Existing database records will not be recreated.
                </p>
              </div>
            ) : (
              <>
                <textarea
                  value={editor}
                  onChange={(event) => setEditor(event.target.value)}
                  spellCheck={false}
                  className="min-h-[440px] w-full border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-xs leading-6 text-[var(--foreground)]"
                />

                <button
                  type="button"
                  onClick={() => void saveRecord()}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
