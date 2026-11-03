# POM'S — International Footwear & Wholesale Platform

> **Official Brand System for POM'S**  
> *"Elegance in every step, Confidence in every you."*

---

## 🌟 Overview

**POM'S** is an enterprise-grade international footwear platform combining a luxury consumer storefront, bespoke made-to-order shoe design collaboration portal, and a complete B2B wholesale quotation and export management system.

Built using **Next.js 15+ (App Router)**, **TypeScript**, **Tailwind CSS 4+**, and **Supabase (PostgreSQL, Storage, Auth, Realtime)**, it features:
- **Universal Dual Theme Engine:** High-contrast Dark Luxury Theme (default: deep black, champagne gold) and Warm Ivory Light Theme, selectable across the entire platform.
- **Six-Language Internationalization (i18n):** English (`en`), Amharic (`am`), Somali (`so`), Simplified Chinese (`zh-CN`), Hindi (`hi`), and Spanish (`es`) across public pages and database records.
- **Dynamic Catalogue & Responsive Grid:** Multi-faceted filtering (type, color, material, availability) and configurable 1-to-6 column layouts.
- **Bespoke Footwear Studio:** Genuine database-backed custom shoe inquiry submission with multi-image uploads and private chat threads.
- **Real-Time Customer Messaging:** End-to-end private communication between customer and owner with photo attachments, quotations, and strict Row-Level Security (RLS) customer isolation.
- **B2B Wholesale & Quotation Engine:** 10-stage order state machine, package carton quantities, MOQs, multi-currency support (USD, ETB, CNY, INR, EUR), and dynamic wholesale PDF catalogue generation.
- **Database-Backed Authenticity Verification:** Live QR code and serial code lookup with verification badges and audit logs.
- **Mobile-First Android Admin Portal (`/admin`):** Comprehensive smartphone-optimized management system allowing the owner to control products, homepage banners, media, orders, and inquiries on the go.

---

## 🛡️ Critical Isolation Notice

POM'S is an entirely separate, standalone platform. It has zero coupling to the owner's legacy MSSQUEEN project:
- Separate project folder: `POMS-WEBSITE`
- Separate GitHub repository: `poms-international-website`
- Separate Supabase project, database, and storage buckets
- Separate Vercel deployment and custom domain

---

## 🚀 Quick Start for Beginners

### 1. Prerequisites
- [Node.js](https://nodejs.org) (v18.18 or v20+)
- Git installed on your computer

### 2. Install & Start Development Server
```bash
# Navigate to the project directory
cd "c:\Users\amant\Desktop\My Projects\POMS-WEBSITE"

# Install dependencies
npm install

# Start the dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Connect Supabase & Setup Owner Account
Follow the step-by-step instructions in [POMS_SETUP_GUIDE.md](file:///c:/Users/amant/Desktop/My%20Projects/POMS-WEBSITE/POMS_SETUP_GUIDE.md) to:
1. Create your free Supabase project.
2. Run the database migration script (`supabase/migrations/0001_initial_schema.sql`).
3. Set your environment variables in `.env.local`.
4. Initialize your Owner account at `/admin/setup`.

---

## 📚 Essential Project Documentation

Read these documents to understand the platform:
- [POMS_MASTER_SPEC.md](file:///c:/Users/amant/Desktop/My%20Projects/POMS-WEBSITE/POMS_MASTER_SPEC.md) — Master product specification and complete feature requirements.
- [POMS_BUILD_CHECKLIST.md](file:///c:/Users/amant/Desktop/My%20Projects/POMS-WEBSITE/POMS_BUILD_CHECKLIST.md) — Feature status tracker (implemented, tested, pending).
- [POMS_ARCHITECTURE.md](file:///c:/Users/amant/Desktop/My%20Projects/POMS-WEBSITE/POMS_ARCHITECTURE.md) — System architecture, data flow, and technology topology.
- [POMS_DATABASE_SCHEMA.md](file:///c:/Users/amant/Desktop/My%20Projects/POMS-WEBSITE/POMS_DATABASE_SCHEMA.md) — Complete 28-table PostgreSQL schema, relationships, and RLS policies.
- [POMS_SECURITY_PLAN.md](file:///c:/Users/amant/Desktop/My%20Projects/POMS-WEBSITE/POMS_SECURITY_PLAN.md) — Zero-trust customer privacy, RBAC, and storage security.
- [POMS_REFERENCE_AUDIT.md](file:///c:/Users/amant/Desktop/My%20Projects/POMS-WEBSITE/POMS_REFERENCE_AUDIT.md) — Technical findings from the MSSQUEEN reference website.
- [POMS_IMPLEMENTATION_ROADMAP.md](file:///c:/Users/amant/Desktop/My%20Projects/POMS-WEBSITE/POMS_IMPLEMENTATION_ROADMAP.md) — 10-phase execution plan.
- [POMS_SETUP_GUIDE.md](file:///c:/Users/amant/Desktop/My%20Projects/POMS-WEBSITE/POMS_SETUP_GUIDE.md) — Beginner-friendly local setup and Vercel deployment.
- [AGENTS.md](file:///c:/Users/amant/Desktop/My%20Projects/POMS-WEBSITE/AGENTS.md) — Mandatory directives for AI agents and developers.

---

## 🔒 Security & Privacy Standard
Every database query is protected by PostgreSQL Row-Level Security (RLS). Customer A can never access or inspect Customer B's records, conversations, design sketches, or quotations. All administrative routes require verified server-side session tokens with active staff role verification.
