import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const IMAGE_BUCKET = "custom-design-references";
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_IMAGES = 5;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function clean(value: FormDataEntryValue | string | undefined, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const admin = createAdminClient();
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await request.json();

      if (data?.type === "custom-design-upload") {
        const mimeType = clean(data.contentType, 80);
        if (![...ALLOWED_IMAGE_TYPES].includes(mimeType)) return jsonError("Only JPG, PNG and WEBP images are accepted.");
        const bucketResult = await admin.storage.createBucket(IMAGE_BUCKET, {
          public: false,
          fileSizeLimit: MAX_IMAGE_BYTES,
          allowedMimeTypes: [...ALLOWED_IMAGE_TYPES],
        });
        if (bucketResult.error && !/already exists/i.test(bucketResult.error.message)) {
          return jsonError("Reference-image storage is not configured. Please contact the site administrator.", 500);
        }
        const extension = mimeType === "image/jpeg" ? "jpg" : mimeType === "image/png" ? "png" : "webp";
        const path = `pending/${crypto.randomUUID()}.${extension}`;
        const { data: signed, error: signedError } = await admin.storage.from(IMAGE_BUCKET).createSignedUploadUrl(path);
        if (signedError || !signed) return jsonError("Could not prepare a secure image upload. Please try again.", 500);
        return NextResponse.json({ ok: true, path, token: signed.token });
      }

      if (data?.type === "custom-design") {
        const name = clean(data.name, 160);
        const phone = clean(data.phone, 60);
        const email = clean(data.email, 254);
        const country = clean(data.country, 100);
        const description = clean(data.description, 4000);
        const material = clean(data.materialPreference, 120);
        const color = clean(data.colorPreference, 120);
        const contactMethod = clean(data.contactMethod, 20).toLowerCase();
        const imagePaths = Array.isArray(data.referenceImagePaths)
          ? data.referenceImagePaths.filter((path: unknown): path is string => typeof path === "string" && path.startsWith("pending/") && !path.includes(".."))
          : [];

        if (!name || !phone || !description) return jsonError("Name, phone and design details are required.");
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError("Enter a valid email address.");
        if (imagePaths.length < 1 || imagePaths.length > MAX_IMAGES) return jsonError("Upload between one and five reference images.");

        const referenceCode = `POMS-CD-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const { error: insertError } = await admin.from("custom_designs").insert({
          reference_code: referenceCode,
          guest_name: name,
          guest_email: email || null,
          guest_phone: phone,
          guest_country: country || null,
          design_description: description,
          material_preference: material || null,
          color_preference: color || null,
          preferred_contact_method: contactMethod || "whatsapp",
          reference_image_urls: imagePaths,
        });
        if (insertError) {
          await admin.storage.from(IMAGE_BUCKET).remove(imagePaths);
          console.error("Custom design inquiry insert failed:", insertError.message);
          return jsonError("Your inquiry could not be saved. Please try again later.", 500);
        }
        return NextResponse.json({ ok: true, referenceCode });
      }

      if (data?.type === "wholesale") {
        const companyName = clean(data.companyName, 180);
        const buyerName = clean(data.buyerName, 160);
        const email = clean(data.email, 254);
        const phone = clean(data.phone, 60);
        const country = clean(data.country, 100);
        if (!companyName || !buyerName || !email || !phone || !country) {
          return jsonError("Complete all required company and contact fields.");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError("Enter a valid business email address.");

        const { error } = await admin.from("wholesale_inquiries").insert({
          company_name: companyName,
          buyer_name: buyerName,
          email,
          phone,
          country,
          freight_method: clean(data.freightMethod, 100),
          target_cartons: clean(data.targetCartons, 120),
          models_of_interest: clean(data.modelsOfInterest, 2000),
          notes: clean(data.notes, 4000),
        });
        if (error) {
          console.error("Wholesale inquiry insert failed:", error.message);
          return jsonError("Your inquiry could not be saved. Please try again later.", 500);
        }
        return NextResponse.json({ ok: true });
      }

      return jsonError("Invalid inquiry type.");
    }

    return jsonError("Unsupported request format.", 415);
  } catch (error) {
    console.error("Public inquiry endpoint failed:", error);
    return jsonError("The inquiry service is temporarily unavailable. Please try again later.", 500);
  }
}
