# POM'S Reference Site Inspection & Audit Report
**Reference Site:** [MSSQUEEN Website](https://mssqueen-website.vercel.app)  
**Inspection Date:** November 1, 2026  
**Auditor:** POM'S Lead Software Architect & Full-Stack Engineering Team  
**Scope:** Architecture, UI/UX, Feature Completeness, Security, and Strategic Roadmap for POM'S

---

## 1. Executive Summary & Core Isolation Mandate

The reference website `https://mssqueen-website.vercel.app` represents the existing footwear brand **MSSQUEEN**. While it establishes an evocative, high-end luxury aesthetic (deep black background, champagne gold typography, high-contrast serif headings, and refined imagery), the underlying implementation is largely static, relying on hardcoded content files and client-side placeholders.

> ### ⚠️ STRICT ISOLATION GUARDRAIL
> - **Zero Shared Infrastructure:** Under no circumstances shall POM'S connect to MSSQUEEN's Supabase instance, database tables, storage buckets, Vercel deployments, or repository.
> - **Separate Identity & Codebase:** POM'S is an independent international footwear brand with its own local workspace (`POMS-WEBSITE`), GitHub repository (`poms-international-website`), independent Supabase project, custom domain, and dedicated configuration.
> - **Source Integrity:** MSSQUEEN files and databases remain untouched and unmodified.

---

## 2. Pages Inspected on the Reference Website

From direct inspection of the production source files (`mssqueen-website` and `mssqueen-manager`), the following pages and routes were analyzed:

| Route | Page Name | Technical Implementation in Reference Site |
|---|---|---|
| `/` | Homepage | Static Server/Client component composed of `Hero`, `FeaturedCollection`, `AboutSection`, `AuthenticitySection`, `BrandValues`, `ContactSection`. |
| `/collection` | Collection Overview | Renders a hardcoded 2-column grid from `src/lib/content.ts` (4 static items). |
| `/collection/[slug]` | Product Detail | Static product template displaying image, title, description, and direct enquiry links. |
| `/custom-design` | Custom Design Form | React client component with client-side image preview and form fields. Submission triggers a `mailto:` link without saving to a database. |
| `/about` | About Brand | Static text narrative detailing brand vision and craftsmanship. |
| `/authenticity` | Authenticity Information | Static page explaining the presence of QR codes on packaging; renders an SVG QR code graphic without dynamic database lookup. |
| `/contact` | Contact Page | Direct links for email, phone (+251 Addis Ababa), physical location, and social media handles. |
| `/login` | Staff Manager Login (in separate `mssqueen-manager` app) | Isolated internal portal utilizing Supabase Auth password authentication with role-based routing (`admin`, `assistant_manager`, `operations_manager`). |

---

## 3. Existing Features Identified

1. **Brand Aesthetic & Styling:**
   - Dark luxury color palette: `#000000` (deep black), `#0b0b0b` / `#11100d` (charcoal/dark bronze surfaces), `#c9a45c` (champagne gold), `#e1c98a` (soft gold highlight), `#cbb98a` (muted gold).
   - High-end typography pairing: **Cinzel** (brand uppercase headers/navigation), **Playfair Display** (editorial serif headings), and **Cormorant Garamond** (refined body text).
   - Tailored button styles: `.btn-gold` (solid gold background with black text) and `.btn-gold-outline` (subtle 1px gold border with smooth hover fills).
   - Smooth header blur (`backdrop-blur-md` on scroll) and responsive hamburger menu.

2. **Custom Design Submission Concept:**
   - Dedicated landing page explaining the 4-step workflow: Upload -> Review -> Material Selection -> Order Confirmation.
   - Separate section for payment screenshot submission guidelines (50% production deposit).

3. **Product Presentation Concept:**
   - Elegant photography framing with gold border accents (`border-gold/25`, `hover:border-gold/70`).
   - Clean aspect ratio image cards with clear titles and descriptions.

4. **Authenticity Section Concept:**
   - Branded QR mark graphic with customer-facing guidance advising buyers to verify official products.

---

## 4. Shortcomings & Areas Requiring Immediate Improvement

The reference site, while visually appealing, suffered from significant technical and architectural limitations that cannot support a serious international footwear business:

1. **Simulated / Incomplete Workflows (No Real Persistence):**
   - **Custom Design Form:** Did not upload images to cloud storage. Instead, it instructed the user via browser alert: *"The selected image is not automatically attached to this email. Please attach the shoe image manually before sending."*
   - **Payment Confirmation:** Exhibited a file picker with the disclaimer: *"File selection only: your payment confirmation is not uploaded or sent anywhere yet."*
   - **Authenticity Check:** Displayed a generic QR vector graphic that simply linked back to `/authenticity`. It had zero database verification, no batch or serial code lookups, and no dynamic authentication states.

2. **Hardcoded Catalogue & Rigid Content Management:**
   - Products, descriptions, and images were hardcoded in `content.ts`.
   - Adding or editing a product required a developer to modify TypeScript code and redeploy to Vercel.
   - The business owner had no mobile or web administrative portal to manage products, prices, or homepage banners.

3. **Split Infrastructure Dilemma:**
   - The owner had two separate repositories: `mssqueen-website` (public storefront) and `mssqueen-manager` (internal staff ERP).
   - The storefront did not connect to the manager's Supabase database. They were completely disconnected silos.

4. **Single-Theme & Single-Language Restrictions:**
   - Strictly dark theme only. No support for users preferring light mode (warm ivory, cream, champagne gold).
   - English language only (`en`), despite serving international and Ethiopian markets that require Amharic, Chinese, Hindi, and Spanish.

5. **Lack of Wholesale Capabilities:**
   - No Minimum Order Quantity (MOQ) logic, package quantity tiers, container/carton specs, or bulk quotation requests.
   - No multi-currency display (USD, ETB, CNY, INR, EUR) or exchange rate tracking.

6. **Absence of Customer Accounts & Private Messaging:**
   - Customers could not log in to track their custom design inquiries or view quotes.
   - No secure guest token verification mechanism.
   - Conversations could not occur on-platform; everything leaked to unsecured external emails.

---

## 5. Design & Structural Elements to Retain for POM'S

POM'S will retain the premium spirit of the reference site while executing it to enterprise production standards:

- **Typography Mastery:** Retain the refined serif and classical header combinations (**Cinzel**, **Playfair Display**, **Cormorant Garamond**), pairing them with modern sans-serif fallbacks (**Inter** / **Geist Sans**) for crisp admin tabular data and mobile forms.
- **Gold & Black Heritage:** Preserve the signature champagne gold (`#c9a45c`, `#e1c98a`) and deep charcoal/black base as the default dark theme.
- **Editorial Card Styling:** Retain the elegant hairline borders (`border-gold/20` to `border-gold/60`), silk background gradients, and subtle glow effects.
- **Clear Custom Footwear Value Proposition:** Retain the 4-stage custom shoe creation story ("Your Design. Our Craft.") but back it with genuine database uploads, authenticated conversations, and direct administrator replies.

---

## 6. What New Features POM'S Needs (Implemented From Day 1)

1. **Unified Application Architecture:** A single Next.js App Router application integrating both the public international storefront and the mobile-first `/admin` portal.
2. **Dynamic Supabase Backend:** PostgreSQL database with 25+ relational tables, Row-Level Security (RLS), and dedicated private/public storage buckets.
3. **Dual Theme Engine:** Dark Theme (default: deep black, champagne gold) and Light Theme (warm ivory, cream, soft white, gold, charcoal text) with persistent state across the entire platform.
4. **5-Language Internationalization:** English (`en`), Amharic (`am`), Simplified Chinese (`zh-CN`), Hindi (`hi`), and Spanish (`es`) across public pages, product titles, descriptions, and admin settings.
5. **Real-Time Customer Messaging & Custom Design Portal:**
   - Registered customer portal + secure token-authenticated guest portal.
   - Secure image attachments (shoe photos, sketches, material samples).
   - Strict RLS isolation: Customer A can never view Customer B's records or photos.
6. **Wholesale & Quotation Engine:**
   - Bulk enquiries, package pricing, custom MOQs, validity dates, multi-currency quotations (USD, ETB, CNY, INR, EUR).
   - Automated downloadable PDF Wholesale Catalogue generator.
7. **Database-Backed Authenticity Verification:**
   - Real database check of unique serial/QR codes with instant verification results (Valid, Invalid, Inactive, Not Found).
8. **Mobile-First Android Admin Portal (`/admin`):**
   - Touch-friendly Android management for products, homepage layout, media uploads, customer inquiries, and quotations without needing a desktop PC.

---

## 7. Inspection Constraints & Accessibility Notes

- **Network Fetch:** Direct automated network fetching from the standard sandboxed CLI was prevented due to sandbox isolation boundaries; however, full offline inspection of the official production repository source code (`mssqueen-website` and `mssqueen-manager`) on local disk provided 100% comprehensive visibility into all routes, styling, state management, and backend interactions.
- **Backend Coupling Verification:** Confirmed that `mssqueen-website` had zero active database connections, while `mssqueen-manager` utilized an isolated Supabase project. POM'S will establish a completely new, clean Supabase project with zero legacy dependencies.
