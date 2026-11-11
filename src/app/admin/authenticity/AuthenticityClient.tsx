
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, RefreshCw, ShieldCheck, Copy } from "lucide-react";

type Product = { id: string; name: string };
type RecordRow = {
  id: string;
  product_id: string | null;
  verification_code: string;
  batch_number: string | null;
  manufactured_date: string | null;
  status: string;
  verification_count: number;
  created_at: string;
};

function createCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = new Uint8Array(20);
  crypto.getRandomValues(random);

  return Array.from(random, (value) => alphabet[value % alphabet.length]).join("");
}

export default function AuthenticityClient() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<Product[]>([]);
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [productId, setProductId] = useState("");
  const [batch, setBatch] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    const [productResult, recordResult] = await Promise.all([
      supabase.from("products").select("id,name").order("name"),
      supabase
        .from("authenticity_records")
        .select("id,product_id,verification_code,batch_number,manufactured_date,status,verification_count,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    if (productResult.error) setError(productResult.error.message);
    else setProducts((productResult.data ?? []) as Product[]);

    if (recordResult.error) setError(recordResult.error.message);
    else setRecords((recordResult.data ?? []) as RecordRow[]);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  async function generateCodes() {
    setError("");
    setMessage("");

    if (!productId) {
      setError("Select a product.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      setError("Generate between 1 and 50 codes at a time.");
      return;
    }

    setSaving(true);

    const payload = Array.from({ length: quantity }, () => ({
      product_id: productId,
      verification_code: createCode(),
      batch_number: batch.trim() || null,
      manufactured_date: date || null,
      status: "active",
      verification_count: 0,
    }));

    const { error: insertError } = await supabase
      .from("authenticity_records")
      .insert(payload);

    if (insertError) {
      setError(insertError.message);
    } else {
      setMessage(`${quantity} authenticity code(s) created.`);
      setBatch("");
      setDate("");
      await load();
    }

    setSaving(false);
  }

  async function changeStatus(record: RecordRow) {
    const nextStatus = record.status === "active" ? "inactive" : "active";

    const { error: updateError } = await supabase
      .from("authenticity_records")
      .update({ status: nextStatus })
      .eq("id", record.id);

    if (updateError) setError(updateError.message);
    else {
      setMessage(`Code status changed to ${nextStatus}.`);
      await load();
    }
  }

  function copyCode(code: string) {
    void navigator.clipboard.writeText(code);
    setMessage("Code copied.");
  }

  const productName = (id: string | null) =>
    products.find((product) => product.id === id)?.name ?? "Unassigned product";

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-7 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[var(--gold)]">
          <ArrowLeft className="h-4 w-4" /> Admin Dashboard
        </Link>

        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">POMS International</p>
          <h1 className="mt-2 font-serif text-3xl">Authenticity Code Generator</h1>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Generate unique product verification codes and manage existing records.
          </p>
        </header>

        {error && <p role="alert" className="border border-red-500 p-3 text-sm">{error}</p>}
        {message && <p role="status" className="border border-[var(--gold)] p-3 text-sm">{message}</p>}

        <section className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="flex items-center gap-2 font-serif text-xl">
            <ShieldCheck className="h-5 w-5 text-[var(--gold)]" />
            Generate new codes
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Product
              <select
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] p-3"
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              Batch number
              <input
                value={batch}
                onChange={(event) => setBatch(event.target.value)}
                className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] p-3"
                placeholder="e.g. POMS-2026-001"
              />
            </label>

            <label className="text-sm">
              Manufactured date
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] p-3"
              />
            </label>

            <label className="text-sm">
              Number of codes (maximum 50)
              <input
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] p-3"
              />
            </label>
          </div>

          <button
            disabled={saving}
            onClick={() => void generateCodes()}
            className="mt-5 bg-[var(--gold)] px-5 py-3 text-sm text-black disabled:opacity-50"
          >
            {saving ? "Generating..." : "Generate authenticity codes"}
          </button>
        </section>

        <section className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl">Existing authenticity records</h2>
            <button onClick={() => void load()} className="text-sm text-[var(--gold)]">
              <RefreshCw className="mr-1 inline h-4 w-4" /> Refresh
            </button>
          </div>

          {loading ? (
            <p className="py-6 text-sm">Loading records...</p>
          ) : records.length === 0 ? (
            <p className="py-6 text-sm text-[var(--foreground-muted)]">No authenticity records found.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--foreground-muted)]">
                    <th className="p-3">Verification code</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Batch</th>
                    <th className="p-3">Verifications</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-[var(--border)]">
                      <td className="p-3 font-mono">
                        {record.verification_code}
                        <button onClick={() => copyCode(record.verification_code)} className="ml-2 text-[var(--gold)]" aria-label="Copy code">
                          <Copy className="inline h-4 w-4" />
                        </button>
                      </td>
                      <td className="p-3">{productName(record.product_id)}</td>
                      <td className="p-3">{record.batch_number || "—"}</td>
                      <td className="p-3">{record.verification_count}</td>
                      <td className="p-3">{record.status}</td>
                      <td className="p-3">
                        <button onClick={() => void changeStatus(record)} className="text-[var(--gold)]">
                          {record.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
