"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Upload, CheckCircle2, ShieldAlert, ArrowRight} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function CustomDesignPage() {
  const { t } = useLanguage();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    country: "Ethiopia",
    materialPreference: "Calfskin Leather",
    colorPreference: "Noir Black",
    description: "",
    contactMethod: "whatsapp",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (images.length + selectedFiles.length > 5) {
        setSubmitError("Please upload no more than five reference images.");
        e.target.value = "";
        return;
      }
      const invalidFile = selectedFiles.find(
        (file) => !allowedTypes.includes(file.type) || file.size > 15 * 1024 * 1024
      );
      if (invalidFile) {
        setSubmitError("Use JPG, PNG or WEBP images, up to 15 MB each.");
        e.target.value = "";
        return;
      }
      setSubmitError("");
      setImages((prev) => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    if (previews[index]) URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (images.length === 0) {
      setSubmitError("Please upload at least one reference shoe photograph or design sketch.");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const referenceImagePaths: string[] = [];

      for (const image of images) {
        const uploadTicketResponse = await fetch("/api/public-inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "custom-design-upload", contentType: image.type }),
        });
        const uploadTicket = await uploadTicketResponse.json();
        if (!uploadTicketResponse.ok) throw new Error(uploadTicket.error || "Could not prepare image upload.");

        const { error: uploadError } = await supabase.storage
          .from("custom-design-references")
          .uploadToSignedUrl(uploadTicket.path, uploadTicket.token, image, { contentType: image.type });
        if (uploadError) throw new Error("A reference image could not be uploaded. Please try again.");
        referenceImagePaths.push(uploadTicket.path);
      }

      const response = await fetch("/api/public-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "custom-design", ...form, referenceImagePaths }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your request could not be submitted.");

      setReferenceCode(result.referenceCode);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-14 space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--gold)]">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <p className="font-serif text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
            Custom Footwear Request Registered
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--foreground)]">
            Your Design Has Been Received
          </h1>

          <div className="p-4 border border-[var(--border)] bg-[var(--background-secondary)] text-center">
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
              Your Private Inquiry Reference
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--gold)]">
              {referenceCode}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
            Our master shoemakers have received your specifications and reference photographs.
            We will review structural viability, compile available leather grades, and contact
            you via <strong className="text-[var(--foreground)]">{form.contactMethod.toUpperCase()}</strong> at{" "}
            <strong className="text-[var(--foreground)]">{form.phone}</strong>.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setImages([]);
                setPreviews([]);
              }}
              className="btn-gold-outline text-xs"
            >
              Submit Another Request
            </button>
            <a
              href={`https://wa.me/251920237030?text=${encodeURIComponent(
                `Hello POM'S, I have submitted a custom shoe design inquiry: ${referenceCode}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-xs"
            >
              Open Direct WhatsApp Dialogue
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:px-10 lg:py-20">
      <div className="border-b border-[var(--border)] pb-8 text-center max-w-3xl mx-auto">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Bespoke Studio
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-[var(--foreground)]">
          {t("customDesign.title")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">
          {t("customDesign.description")}
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr] items-start">
        {/* Left Column: Workflow Explanation */}
        <div className="space-y-8 border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="font-serif text-xl text-[var(--foreground)]">How Custom Design Works</h2>

          <div className="space-y-6 text-xs text-[var(--foreground-muted)]">
            <div className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--gold)] font-serif text-[var(--gold)] font-semibold">
                1
              </span>
              <div>
                <p className="font-serif text-sm text-[var(--foreground)] font-medium">Upload Photographs</p>
                <p className="mt-1 leading-relaxed">Provide pictures of a shoe silhouette, heel style, or sketch you love.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--gold)] font-serif text-[var(--gold)] font-semibold">
                2
              </span>
              <div>
                <p className="font-serif text-sm text-[var(--foreground)] font-medium">Artisan Evaluation</p>
                <p className="mt-1 leading-relaxed">POM&apos;S assesses pattern complexity, lasts, and material requirements.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--gold)] font-serif text-[var(--gold)] font-semibold">
                3
              </span>
              <div>
                <p className="font-serif text-sm text-[var(--foreground)] font-medium">Leather &amp; Quotation</p>
                <p className="mt-1 leading-relaxed">We provide swatch photos and formal price options for each leather grade.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--gold)] font-serif text-[var(--gold)] font-semibold">
                4
              </span>
              <div>
                <p className="font-serif text-sm text-[var(--foreground)] font-medium">Craft &amp; Delivery</p>
                <p className="mt-1 leading-relaxed">Production begins upon deposit confirmation. Delivered locally or shipped internationally.</p>
              </div>
            </div>
          </div>

          <div className="border border-[var(--border)]/70 bg-[var(--background-secondary)] p-4 text-xs text-[var(--foreground-muted)] space-y-1">
            <p className="text-[var(--gold)] font-medium flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" /> Deposit Protocol
            </p>
            <p>
              Production requires an agreed deposit (typically 50%). No payment is required to submit your initial design inquiry.
            </p>
          </div>
        </div>

        {/* Right Column: Submission Form */}
        <form onSubmit={handleSubmit} className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 space-y-6">
          {/* Photo Uploader */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-2 font-medium">
              Shoe Design Photographs / Sketches <span className="text-[var(--gold)]">*</span>
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] bg-[var(--background-secondary)] p-6 cursor-pointer hover:border-[var(--gold)] transition text-center">
              <Upload className="h-8 w-8 text-[var(--gold)] mb-2" />
              <span className="text-xs text-[var(--foreground)] font-medium">Click to upload reference photos</span>
              <span className="mt-1 text-[11px] text-[var(--foreground-muted)]">PNG, JPG, WEBP up to 15MB</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>

            {/* Preview Thumbnails */}
            {previews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative h-16 w-16 border border-[var(--border)] overflow-hidden">
                    <Image
  src={previews[i]}
  alt={`Design reference ${i + 1}`}
  width={300}
  height={300}
  unoptimized
  className="h-full w-full object-cover"
/>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 bg-red-800 text-white text-[10px] w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Full Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
              Your Full Name <span className="text-[var(--gold)]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Elena Rostova"
              className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          {/* Contact Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                Phone / WhatsApp <span className="text-[var(--gold)]">*</span>
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+251 9... or +1 ..."
                className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@domain.com"
                className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>
          </div>

          {/* Material & Color Preferences */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                Preferred Material
              </label>
              <select
                value={form.materialPreference}
                onChange={(e) => setForm({ ...form, materialPreference: e.target.value })}
                className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              >
                <option value="Calfskin Leather">Calfskin Leather</option>
                <option value="Plush Suede">Plush Suede</option>
                <option value="Patent Leather">Patent Leather</option>
                <option value="Velvet">Evening Velvet</option>
                <option value="Metallic Leather">Champagne Metallic Leather</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                Preferred Colorway
              </label>
              <input
                type="text"
                value={form.colorPreference}
                onChange={(e) => setForm({ ...form, colorPreference: e.target.value })}
                placeholder="e.g. Noir Black, Burgundy, Ivory"
                className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>
          </div>

          {/* Design Details */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
              Specific Requirements &amp; Fitting Notes
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell us about the heel height, toe shape, buckle details, sole preferences, or specific occasion..."
              className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          {submitError && (
            <p role="alert" className="border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
              {submitError}
            </p>
          )}
          <button type="submit" disabled={saving} className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Submitting securely..." : "Submit Custom Design Request"}
            {!saving && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
