# AGENTS.md — Developer & AI Pair-Programming Directive
**Target System:** POM'S International Footwear Platform  
**Workspace:** `POMS-WEBSITE`  
**Target Repository:** `poms-international-website`  
**Brand:** POM'S  

---

## 1. Welcome to the POM'S Project

This document provides mandatory directives for any AI coding assistant (Cursor Agent, Copilot, Antigravity, Claude, etc.) or human software engineer working on this codebase.

### 1.1 What POM'S Is
POM'S is an enterprise-grade international footwear e-commerce, custom bespoke shoe design, and B2B wholesale platform. It is a real production system built to serve global consumers and international container/carton wholesale footwear buyers.

---

## 2. Mandatory Guardrails & Non-Negotiables

### 2.1 NEVER TOUCH MSSQUEEN
> [!CAUTION]
> The owner has a pre-existing project called **MSSQUEEN** (`mssqueen-website`, `mssqueen-manager`, `mssqueen-website.vercel.app`).
> - **DO NOT** modify, delete, overwrite, inspect for editing, or deploy to any files, repositories, databases, or Vercel projects belonging to MSSQUEEN.
> - **DO NOT** connect POM'S to MSSQUEEN's Supabase project or reuse its API keys.
> - POM'S is a 100% separate, standalone platform.

### 2.2 NO FAKE / SIMULATED FUNCTIONALITY
- Do not add fake buttons that do nothing.
- Do not simulate database calls with `setTimeout` or in-memory arrays when database tables exist.
- Do not use client-side alert dialogs claiming an email was sent or a photo was uploaded.
- If an external integration is missing (e.g., API keys for live AI translation or email dispatch), implement proper graceful fallbacks and document the exact environment variables required.

### 2.3 DO NOT REMOVE FEATURES
Never silently remove or simplify features described in `POMS_MASTER_SPEC.md`. All features—including the 6 languages, dual theme, quotation engine, 10-stage order lifecycle, dynamic PDF generator, and authenticity verification—are required.

---

## 3. Technology Stack & Key Architecture Decisions

- **Framework:** Next.js 15+ using the **App Router** (`src/app/`).
- **Language:** TypeScript 5+ (Strict Mode enabled).
- **Styling:** Tailwind CSS 4+ with custom CSS variables for Dark Theme (`#000000`, `#c9a45c`) and Light Theme (`#fbf9f5`, `#1a1a18`).
- **Backend:** Supabase PostgreSQL with 100% Row-Level Security (RLS) enforcement.
- **Client & Server Data Fetching:** React Server Components (RSC) for public pages; Server Actions for mutations; `@supabase/ssr` for server-side auth cookie handling.
- **Storage:** Supabase Storage segregated into `public-catalogue` (public) and `private-designs` / `private-quotations` (private, signed URLs).
- **Admin Layout:** Mobile-first responsive ergonomics tailored for Android phone operation.

---

## 4. Documents to Read First

Before generating code or altering architecture, read these core project documents in order:
1. `POMS_MASTER_SPEC.md` — The complete authoritative requirement specification.
2. `POMS_BUILD_CHECKLIST.md` — The live tracker of all implemented, tested, and pending features.
3. `POMS_ARCHITECTURE.md` — The detailed technical topology and data flow.
4. `POMS_DATABASE_SCHEMA.md` — The 28-table PostgreSQL DDL, relationships, and RLS policies.
5. `POMS_SECURITY_PLAN.md` — Authentication, guest tokens, customer isolation, and storage rules.
6. `POMS_SETUP_GUIDE.md` — Local startup, Supabase setup, and deployment instructions.

---

## 5. Coding & Security Conventions

1. **Server Actions First:** For database mutations, use Next.js Server Actions with `'use server'` in `src/app/actions/`. Validate all input with **Zod**.
2. **Never Expose Secrets:** `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_BOOTSTRAP_TOKEN`, and AI API keys must never be prefixed with `NEXT_PUBLIC_` or imported into client components (`'use client'`).
3. **Customer Isolation:** When querying messages, conversations, quotations, or orders, always verify `auth.uid() = customer_profile_id` or that the user has an active role in `staff_roles`.
4. **Theme & i18n Consistency:** Every new public component must support both Dark and Light themes via semantic Tailwind classes (`bg-background text-foreground border-border`) and pull user-facing copy from `src/locales/` or localized database fields.
5. **Updating the Checklist:** Whenever you implement or test a feature, update its status in `POMS_BUILD_CHECKLIST.md` immediately with notes on what was verified.

---

## 6. How to Run & Validate

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run type check and lint
npm run lint
npx tsc --noEmit
```
