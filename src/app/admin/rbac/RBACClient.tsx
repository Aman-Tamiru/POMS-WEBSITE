
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, RefreshCw, ShieldCheck, UserPlus } from "lucide-react";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
};

type StaffRole = {
  id: string;
  profile_id: string;
  role: string;
  active: boolean;
  granted_at: string;
};

const ROLES = [
  "owner",
  "super_admin",
  "product_manager",
  "content_manager",
  "customer_support",
  "wholesale_manager",
];

export default function RBACClient() {
  const supabase = createClient();
  const [staff, setStaff] = useState<StaffRole[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedRole, setSelectedRole] = useState("product_manager");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    const [rolesResult, profilesResult] = await Promise.all([
      supabase
        .from("staff_roles")
        .select("id,profile_id,role,active,granted_at")
        .order("granted_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id,email,full_name")
        .order("email"),
    ]);

    if (rolesResult.error || profilesResult.error) {
      setError(
        rolesResult.error?.message ||
        profilesResult.error?.message ||
        "Unable to load staff records."
      );
    } else {
      setStaff(rolesResult.data || []);
      setProfiles(profilesResult.data || []);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const addRole = async () => {
    if (!selectedProfile || !selectedRole) return;

    setSaving(true);
    setError("");

    const { error: insertError } = await supabase
      .from("staff_roles")
      .insert({
        profile_id: selectedProfile,
        role: selectedRole,
        active: true,
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      setSelectedProfile("");
      await loadData();
    }

    setSaving(false);
  };

  const toggleRole = async (item: StaffRole) => {
    setError("");

    const { error: updateError } = await supabase
      .from("staff_roles")
      .update({ active: !item.active })
      .eq("id", item.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      await loadData();
    }
  };

  const getProfile = (id: string) =>
    profiles.find((profile) => profile.id === id);

  const availableProfiles = profiles.filter(
    (profile) => !staff.some(
      (item) =>
        item.profile_id === profile.id &&
        item.role === selectedRole &&
        item.active
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
              Security & Administration
            </p>
            <h1 className="mt-2 font-serif text-3xl">Staff & Permissions</h1>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Manage existing staff accounts and their administrative roles.
            </p>
          </div>

          <button onClick={() => void loadData()} className="border border-[var(--border)] p-3">
            <RefreshCw size={17} />
          </button>
        </header>

        <section className="border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="text-[var(--gold)]" size={19} />
            <h2 className="font-serif text-xl">Assign Staff Role</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              className="min-w-0 border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
            >
              <option value="">Select existing account</option>
              {availableProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.full_name || profile.email} — {profile.email}
                </option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <button
              onClick={() => void addRole()}
              disabled={!selectedProfile || saving}
              className="bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50"
            >
              {saving ? "Saving..." : "Assign Role"}
            </button>
          </div>
        </section>

        {error && (
          <p className="border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <section className="border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border)] p-5">
            <h2 className="font-serif text-xl">Staff Access Registry</h2>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              {staff.length} role assignments
            </p>
          </div>

          {loading ? (
            <p className="p-6 text-sm">Loading staff records...</p>
          ) : staff.length === 0 ? (
            <p className="p-6 text-sm text-[var(--foreground-muted)]">
              No staff role assignments found.
            </p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {staff.map((item) => {
                const profile = getProfile(item.profile_id);

                return (
                  <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {profile?.full_name || profile?.email || "Unknown account"}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {profile?.email || item.profile_id}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-wider text-[var(--gold)]">
                        {item.role.replaceAll("_", " ")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${item.active ? "text-green-500" : "text-red-400"}`}>
                        {item.active ? "Active" : "Inactive"}
                      </span>
                      <button
                        onClick={() => void toggleRole(item)}
                        className="border border-[var(--border)] px-3 py-2 text-xs hover:border-[var(--gold)]"
                      >
                        {item.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => (
            <div key={role} className="border border-[var(--border)] bg-[var(--surface)] p-4">
              <ShieldCheck size={18} className="text-[var(--gold)]" />
              <p className="mt-3 text-sm font-semibold">{role.replaceAll("_", " ")}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
