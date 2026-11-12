
"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, Check, LoaderCircle, UserRound, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export default function OwnerProfileEditor() {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (active) {
          setMessage("Unable to identify the signed-in administrator.");
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (error || !data) {
        setMessage(error?.message || "Owner profile could not be found.");
      } else {
        const profile = data as Profile;
        setUserId(profile.id);
        setEmail(user.email || "");
        setFullName(profile.full_name || "");
        setAvatarUrl(profile.avatar_url || "");
      }

      setLoading(false);
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId || !fullName.trim()) {
      setMessage("Please enter your display name.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      let nextAvatarUrl = avatarUrl;

      if (selectedFile) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
          throw new Error("Choose a JPG, PNG or WebP photograph.");
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
          throw new Error("Your profile photograph must be 5 MB or smaller.");
        }

        const extension = selectedFile.type === "image/jpeg"
          ? "jpg"
          : selectedFile.type === "image/png"
            ? "png"
            : "webp";

        const path = `profiles/${userId}/avatar-${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, selectedFile, {
            contentType: selectedFile.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);

        nextAvatarUrl = data.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          avatar_url: nextAvatarUrl || null,
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      setAvatarUrl(nextAvatarUrl);
      setSelectedFile(null);
      setMessage("Owner profile saved successfully.");
      setEditing(false);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save owner profile."
      );
    } finally {
      setSaving(false);
    }
  }

  const displayedImage = previewUrl || avatarUrl;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setEditing((value) => !value)}
        aria-expanded={editing}
        className="flex items-center gap-2 border border-[var(--border)] px-2 py-1.5 transition hover:border-[var(--gold)]"
      >
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--gold)]/50 bg-[var(--background)]">
          {displayedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayedImage}
              alt="Owner profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound className="h-4 w-4 text-[var(--gold)]" />
          )}
        </span>

        <span className="max-w-[130px] text-left">
          <span className="block truncate text-xs font-semibold text-[var(--foreground)]">
            {loading ? "Loading profile…" : fullName || "Owner"}
          </span>
          <span className="block text-[9px] uppercase tracking-wider text-[var(--gold)]">
            Owner profile
          </span>
        </span>
      </button>

      {editing && (
        <div className="absolute right-0 top-full z-[90] mt-3 w-[min(340px,90vw)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg text-[var(--foreground)]">
              Owner Identity
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setSelectedFile(null);
                setMessage("");
              }}
              aria-label="Close profile editor"
              className="text-[var(--foreground-muted)] hover:text-[var(--gold)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[var(--gold)]/50 bg-[var(--background)]">
                {displayedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayedImage}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-7 w-7 text-[var(--gold)]" />
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-2 border border-[var(--border)] px-3 py-2 text-xs text-[var(--foreground)] hover:border-[var(--gold)]">
                <Camera className="h-4 w-4 text-[var(--gold)]" />
                Change photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) =>
                    setSelectedFile(event.target.files?.[0] || null)
                  }
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">
                Display name
              </span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                maxLength={100}
                className="w-full border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </label>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">
                Account email
              </p>
              <p className="mt-1 break-all text-xs text-[var(--foreground)]">
                {email}
              </p>
            </div>

            {message && (
              <p role="status" className="text-xs text-[var(--gold)]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || saving}
              className="flex w-full items-center justify-center gap-2 bg-[var(--gold)] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {saving ? "Saving…" : "Save profile"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
