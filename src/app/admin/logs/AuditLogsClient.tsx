
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Activity, ArrowLeft, RefreshCw, Search } from "lucide-react";

type ActivityLog = {
  id: string;
  actor_profile_id: string | null;
  action_type: string;
  entity_name: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
};

export default function AuditLogsClient() {
  const supabase = createClient();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError("");

    const [logsResult, profilesResult] = await Promise.all([
      supabase
        .from("activity_logs")
        .select("id,actor_profile_id,action_type,entity_name,entity_id,details,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("profiles")
        .select("id,email,full_name"),
    ]);

    if (logsResult.error || profilesResult.error) {
      setError(
        logsResult.error?.message ||
        profilesResult.error?.message ||
        "Unable to load activity logs."
      );
    } else {
      setLogs(logsResult.data || []);
      setProfiles(profilesResult.data || []);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  const filtered = logs.filter((log) =>
    [
      log.action_type,
      log.entity_name,
      log.entity_id,
      JSON.stringify(log.details || {}),
    ].some((value) =>
      value?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const actorName = (id: string | null) => {
    if (!id) return "System";
    const profile = profiles.find((item) => item.id === id);
    return profile?.full_name || profile?.email || "Unknown staff";
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-7 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[var(--gold)]">
          <ArrowLeft size={16} /> Admin Dashboard
        </Link>

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              Security & Accountability
            </p>
            <h1 className="mt-2 font-serif text-3xl">Audit & Activity Logs</h1>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Review recorded administrative activity from the database.
            </p>
          </div>
          <button onClick={() => void loadLogs()} className="border border-[var(--border)] p-3">
            <RefreshCw size={17} />
          </button>
        </header>

        <section className="grid gap-3 sm:grid-cols-2">
          <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
            <Activity className="text-[var(--gold)]" size={20} />
            <p className="mt-3 font-serif text-3xl">{logs.length}</p>
            <p className="text-xs text-[var(--foreground-muted)]">Recent recorded events</p>
          </div>
          <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-serif text-3xl">{filtered.length}</p>
            <p className="mt-3 text-xs text-[var(--foreground-muted)]">Matching events</p>
          </div>
        </section>

        <div className="flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-4">
          <Search size={17} className="text-[var(--foreground-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actions, entities or details..."
            className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none"
          />
        </div>

        {error && (
          <p className="border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <section className="border border-[var(--border)] bg-[var(--surface)]">
          {loading ? (
            <p className="p-6 text-sm">Loading activity history...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-[var(--foreground-muted)]">
              No recorded activity matches this search.
            </p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filtered.map((log) => (
                <article key={log.id} className="space-y-2 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-[var(--gold)]">
                      {log.action_type.replaceAll("_", " ")}
                    </p>
                    <time className="text-xs text-[var(--foreground-muted)]">
                      {new Date(log.created_at).toLocaleString()}
                    </time>
                  </div>

                  <p className="text-sm">
                    {log.entity_name}
                    {log.entity_id ? ` · ${log.entity_id}` : ""}
                  </p>

                  <p className="text-xs text-[var(--foreground-muted)]">
                    Performed by: {actorName(log.actor_profile_id)}
                  </p>

                  {log.details && (
                    <pre className="overflow-x-auto border border-[var(--border)] bg-[var(--background)] p-3 text-xs text-[var(--foreground-muted)]">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
