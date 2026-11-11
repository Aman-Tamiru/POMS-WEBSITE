
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, RefreshCw, Search, Users } from "lucide-react";

type Customer = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  preferred_language: string | null;
  created_at: string;
};

export default function CustomerDirectoryClient() {
  const supabase = createClient();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("profiles")
      .select("id,email,full_name,phone,preferred_language,created_at")
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
    } else {
      setCustomers(data || []);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const filtered = customers.filter((customer) =>
    [
      customer.full_name,
      customer.email,
      customer.phone,
    ].some((value) =>
      value?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-7 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[var(--gold)]">
          <ArrowLeft size={16} /> Admin Dashboard
        </Link>

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              Customer Relations
            </p>
            <h1 className="mt-2 font-serif text-3xl">Customer Directory</h1>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Registered customer accounts and contact information.
            </p>
          </div>
          <button onClick={() => void loadCustomers()} className="border border-[var(--border)] p-3">
            <RefreshCw size={17} />
          </button>
        </header>

        <section className="grid gap-3 sm:grid-cols-2">
          <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
            <Users className="text-[var(--gold)]" size={20} />
            <p className="mt-3 font-serif text-3xl">{customers.length}</p>
            <p className="text-xs text-[var(--foreground-muted)]">Registered profiles</p>
          </div>
          <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
            <Search className="text-[var(--gold)]" size={20} />
            <p className="mt-3 font-serif text-3xl">{filtered.length}</p>
            <p className="text-xs text-[var(--foreground-muted)]">Matching records</p>
          </div>
        </section>

        <div className="flex items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-4">
          <Search size={17} className="text-[var(--foreground-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or phone..."
            className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none"
          />
        </div>

        {error && (
          <p className="border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <section className="overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
          {loading ? (
            <p className="p-6 text-sm">Loading customer directory...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-[var(--foreground-muted)]">
              No registered customers match this search.
            </p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filtered.map((customer) => (
                <article key={customer.id} className="grid gap-3 p-5 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">
                  <div>
                    <p className="font-medium">
                      {customer.full_name || "Name not provided"}
                    </p>
                    <p className="mt-1 break-all text-xs text-[var(--foreground-muted)]">
                      {customer.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--foreground-muted)]">Phone</p>
                    <p className="text-sm">{customer.phone || "Not provided"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--foreground-muted)]">Language</p>
                    <p className="text-sm">{customer.preferred_language || "en"}</p>
                  </div>

                  <div className="text-xs text-[var(--foreground-muted)]">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
