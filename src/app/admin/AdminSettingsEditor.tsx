
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Plus, Save, Trash2, RefreshCw } from "lucide-react";

type Setting = {
  id: string;
  setting_key: string;
  setting_value: unknown;
  description: string | null;
};

type Props = {
  moduleKey: "wholesale" | "shipping" | "theme";
  title: string;
  description: string;
  examples: { key: string; label: string; help: string; value: unknown }[];
};

export default function AdminSettingsEditor({
  moduleKey,
  title,
  description,
  examples,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("{}");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("poms_admin_settings")
      .select("id,setting_key,setting_value,description")
      .eq("module_key", moduleKey)
      .order("setting_key");

    if (queryError) setError(queryError.message);
    else setRows((data ?? []) as Setting[]);

    setLoading(false);
  }, [supabase, moduleKey]);

  useEffect(() => {
    void load();
  }, [load]);

  
async function saveSetting(row: Setting) {
    setSaving(true);
    setError("");
    setMessage("");
  
    let parsed: unknown;
  
    try {
      parsed =
        typeof row.setting_value === "string"
          ? JSON.parse(row.setting_value)
          : row.setting_value;
    } catch {
      setError(`Invalid JSON in ${row.setting_key}.`);
      setSaving(false);
      return;
    }
  
    const { error: updateError } = await supabase
      .from("poms_admin_settings")
      .update({ setting_value: parsed })
      .eq("id", row.id);
  
    if (updateError) setError(updateError.message);
    else setMessage(`${row.setting_key} saved successfully.`);
  
    setSaving(false);
    await load();
  }
  

  async function addSetting() {
    setError("");
    setMessage("");

    if (!newKey.trim()) {
      setError("Enter a setting key.");
      return;
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(newValue);
    } catch {
      setError("The value must be valid JSON. For text, use quotation marks.");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase
      .from("poms_admin_settings")
      .insert({
        module_key: moduleKey,
        setting_key: newKey.trim().toLowerCase().replace(/\s+/g, "_"),
        setting_value: parsed,
      });

    if (insertError) setError(insertError.message);
    else {
      setNewKey("");
      setNewValue("{}");
      setMessage("Setting added.");
    }

    setSaving(false);
    await load();
  }

  async function deleteSetting(id: string) {
    if (!window.confirm("Delete this setting?")) return;

    const { error: deleteError } = await supabase
      .from("poms_admin_settings")
      .delete()
      .eq("id", id);

    if (deleteError) setError(deleteError.message);
    else setMessage("Setting deleted.");

    await load();
  }

  async function addExample(example: Props["examples"][number]) {
    setSaving(true);
    setError("");

    const { error: insertError } = await supabase
      .from("poms_admin_settings")
      .insert({
        module_key: moduleKey,
        setting_key: example.key,
        setting_value: example.value,
        description: example.help,
      });

    if (insertError) setError(insertError.message);
    else setMessage(`${example.label} added.`);

    setSaving(false);
    await load();
  }

  function updateRow(id: string, value: string) {
    setRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, setting_value: value } : row
      )
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-7 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-7">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[var(--gold)]">
          <ArrowLeft className="h-4 w-4" /> Admin Dashboard
        </Link>

        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
            POMS International
          </p>
          <h1 className="mt-2 font-serif text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--foreground-muted)]">
            {description}
          </p>
        </header>

        {error && <p role="alert" className="border border-red-500 p-3 text-sm">{error}</p>}
        {message && <p role="status" className="border border-[var(--gold)] p-3 text-sm">{message}</p>}

        <section className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl">Saved settings</h2>
            <button onClick={() => void load()} className="text-sm text-[var(--gold)]">
              <RefreshCw className="mr-1 inline h-4 w-4" /> Refresh
            </button>
          </div>

          {loading ? (
            <p className="py-6 text-sm text-[var(--foreground-muted)]">Loading settings...</p>
          ) : rows.length === 0 ? (
            <p className="py-6 text-sm text-[var(--foreground-muted)]">
              No settings have been created in this module yet.
            </p>
          ) : (
            <div className="mt-5 space-y-5">
              {rows.map((row) => (
                <article key={row.id} className="space-y-2 border-t border-[var(--border)] pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <label className="font-medium">{row.setting_key}</label>
                    <button
                      onClick={() => void deleteSetting(row.id)}
                      className="text-red-500"
                      aria-label={`Delete ${row.setting_key}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={
                      typeof row.setting_value === "string"
                        ? JSON.stringify(row.setting_value, null, 2)
                        : JSON.stringify(row.setting_value, null, 2)
                    }
                    onChange={(event) => updateRow(row.id, event.target.value)}
                    className="w-full border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-sm"
                  />

                  <button
                    disabled={saving}
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(row.setting_value as string);
                        void saveSetting({ ...row, setting_value: parsed });
                      } catch {
                        setError(`Invalid JSON in ${row.setting_key}.`);
                      }
                    }}
                    className="inline-flex items-center gap-2 border border-[var(--gold)] px-4 py-2 text-sm text-[var(--gold)] disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" /> Save
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-serif text-xl">Suggested settings</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {examples.map((example) => (
              <div key={example.key} className="border border-[var(--border)] p-4">
                <p className="font-medium">{example.label}</p>
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">{example.help}</p>
                <button
                  disabled={saving || rows.some((row) => row.setting_key === example.key)}
                  onClick={() => void addExample(example)}
                  className="mt-3 text-sm text-[var(--gold)] disabled:opacity-40"
                >
                  <Plus className="mr-1 inline h-4 w-4" /> Add setting
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-serif text-xl">Create custom setting</h2>
          <input
            value={newKey}
            onChange={(event) => setNewKey(event.target.value)}
            placeholder="Setting key, e.g. minimum_order_value"
            className="mt-4 w-full border border-[var(--border)] bg-[var(--background)] p-3"
          />
          <textarea
            value={newValue}
            onChange={(event) => setNewValue(event.target.value)}
            rows={4}
            className="mt-3 w-full border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-sm"
            placeholder='{"value": 10}'
          />
          <button
            disabled={saving}
            onClick={() => void addSetting()}
            className="mt-3 inline-flex items-center gap-2 bg-[var(--gold)] px-5 py-3 text-sm text-black disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Add setting
          </button>
        </section>
      </div>
    </main>
  );
}
