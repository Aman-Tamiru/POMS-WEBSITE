# POM'S INTERNATIONAL FOOTWEAR PLATFORM
## Master System Specification & Technical Charter
**Document Version:** 1.0.0  
**Brand:** POM'S  
**Target Repository:** `poms-international-website`  
**Root Workspace:** `POMS-WEBSITE`  
**Author:** Lead Software Architect, Systems Engineer, Security Engineer & QA Lead

---

## 1. Project Purpose & Critical Directives

### 1.1 Purpose
POM'S is a premier international footwear brand specializing in luxury women's shoes, bespoke made-to-order footwear, and international wholesale/B2B distribution. This platform serves as the unified global storefront, customer collaboration hub, quotation engine, and administrative operating system.

### 1.2 Non-Negotiable Directives & Isolation Protocol
1. **Total Isolation from MSSQUEEN:**
   - The reference website (`mssqueen-website.vercel.app`) and its related projects (`mssqueen-manager`, `mssqueen-website-recovery`) belong to the owner and must remain 100% untouched.
   - Zero shared code, zero shared credentials, zero shared Supabase instances, zero shared storage buckets, and zero shared Vercel deployments.
   - POM'S runs on its own independent infrastructure.
2. **Production Integrity & No Pretending:**
   - No mock buttons, no fake database records, no simulated file uploads, and no hardcoded product stubs masquerading as completed features.
   - External dependencies (e.g., Supabase credentials, Resend email keys, Exchange Rate APIs, AI translation APIs) must be clearly identified with exact environment variable definitions and fallback behaviors when unconfigured.
3. **Session Efficiency & Long-Term Continuity:**
   - All architectural decisions, schemas, configurations, and implementation steps must be fully codified in repository documentation so work can proceed seamlessly across future sessions or manual development.

---

## 2. Brand Identity & Design System

### 2.1 Brand Ethos
- **Name:** **POM'S**
- **Tagline:** Elegance in every step, Confidence in every you.
- **Attributes:** Luxury, Precision Craftsmanship, Global Sophistication, Modern Footwear Engineering, Uncompromising Trust.

### 2.2 Dual Theme Specification (Universal Availability)
The theme selector is prominent in the header across **every single page**—including the public storefront, customer portal, customer messaging view, and the mobile admin portal.

| Design Attribute | Dark Theme (Default) | Light Theme |
|---|---|---|
| **Base Background** | Deep Black (`#000000`, `#050505`) | Warm Ivory / Soft Cream (`#FBF9F5`, `#F5F0E8`) |
| **Surface / Card Background** | Charcoal & Dark Bronze (`#0D0D0B`, `#141310`) | Pure Warm White / Alabaster (`#FFFFFF`, `#FAF7F2`) |
| **Primary Accent** | Champagne Gold (`#C9A45C`, `#D4AF37`) | Champagne Gold (`#B89248`, `#C9A45C`) |
| **Highlight Accent** | Soft Metallic Gold (`#E1C98A`) | Rich Antique Gold (`#9E7B35`) |
| **Muted Accent** | Muted Gold / Sand (`#CBB98A`) | Muted Bronze / Khaki (`#8C734B`) |
| **Borders** | Subtle Gold Hairlines (`rgba(201, 164, 92, 0.25)`) | Soft Warm Gold Borders (`rgba(184, 146, 72, 0.3)`) |
| **Primary Text** | Pale Ivory / Pure White (`#F5F5F0`, `#FFFFFF`) | Deep Charcoal (`#1A1A18`, `#262522`) |
| **Secondary Text** | Gold-Muted (`#CBB98A`, `rgba(255,255,255,0.65)`) | Deep Bronze Gray (`#5A564F`, `#6E6960`) |
| **Typography Family** | Display: `Cinzel`, Serif: `Playfair Display`, Body: `Cormorant Garamond`, UI/Admin: `Inter / Geist Sans` | Same Typography Pairing |

---

## 3. Six-Language Internationalization (i18n)

### 3.1 Supported Locales
1. **English (`en`)** — Default
2. **Amharic (`am`)** — Ethiopian Domestic & Diaspora Footwear Market
3. **Somali (`so`)** — Horn of Africa & Global Somali Retail Trade
4. **Simplified Chinese (`zh-CN`)** — International Supply Chain & Asian Wholesale
5. **Hindi (`hi`)** — South Asian Regional Trade & International Buyers
6. **Spanish (`es`)** — Latin American, European & US Hispanic Markets

### 3.2 Scope of Internationalization
- **Header Language Switcher:** Always visible next to theme selector.
- **Full UI Localization:** Navigation, homepage sections, forms, validation messages, order statuses, customer accounts, and notifications.
- **Database Content Localization:** Products and collections maintain separate translation records for name, description, SEO tags, and highlights across all 5 languages.
- **AI Translation Workflow:** Admin can draft in English and trigger AI-assisted draft translations for Amharic, Somali, Chinese, Hindi, and Spanish, with mandatory manual review and approval before publishing.
- **Graceful Fallback:** If a translation is missing or unverified, the system cleanly falls back to English with a discreet indicator in admin mode.

---

## 4. Public Storefront Architecture & Pages

### 4.1 Homepage (`/`)
- **Announcement Bar:** Global promotional message (editable in admin).
- **Hero Section:** High-resolution product showcase, title, subtitle, primary CTA (Shop Collection / Custom Design / Wholesale).
- **Featured Collections Slider/Grid:** Visual curation of active collections.
- **Curated Products Grid:** Dynamic selection of new arrivals and signature shoes.
- **Brand Story & Craftsmanship:** Narrative spotlighting design philosophy and materials.
- **Custom Shoe Design Promotion:** Visual teaser driving to the bespoke submission tool.
- **Wholesale & B2B Inquiry Spotlight:** Direct invitation for international package buyers.
- **Brand Trust & Authenticity Section:** Explanation of genuine POM'S verification and QR validation.
- **Contact & Inquiries Section:** Clear contact details, social links, location, and newsletter signup.
- **Discreet Footer Link:** Access link to the `/admin` portal.

### 4.2 Dynamic Collections (`/collection`, `/collection/[slug]`)
- Collection name, description, cover photography, multiple gallery images.
- Associated products with live inventory / quotation status.
- Multilingual translations for all collection metadata.

### 4.3 Product Catalogue (`/catalogue`)
- Responsive multi-column layout (configurable 1 to 6 columns).
- Real-time client & server filtering by:
  - Shoe Type (Flats, Heels, Boots, Slippers, Slides, Sandals).
  - Collection.
  - Primary Color & Accent Color.
  - Material (Leather, Suede, Velvet, Patent, Satin, Synthetic).
  - Availability (In Stock, Made to Order, Wholesale Package Only).
- Fast full-text search across product names and descriptions.
- Dynamic sorting (Featured, Newest, Name A-Z).

### 4.4 Individual Product Page (`/product/[slug]`)
- Multi-image interactive gallery with high-resolution zoom.
- Product specifications: materials, heel height, sole composition, color variants.
- Sizing availability with dynamic link to International Size Guide.
- Wholesale specifications: Package quantity, Carton size, Minimum Order Quantity (MOQ).
- Dynamic Pricing: Display explicit price or "Price on Request / Inquire for Quotation".
- Direct Action Buttons:
  - "Request Wholesale Quote" (pre-populates wholesale form).
  - "Inquire About Product" (initiates private message conversation).
  - "Add to Wishlist".
  - "Share Design".
- Related products recommendation carousel.

### 4.5 Custom Shoe Design Studio (`/custom-design`)
- Dedicated portal for clients to submit custom footwear requests:
  - Client Full Name, Email, Phone/WhatsApp, Country.
  - Multi-image file uploader (sketches, reference shoes, heel photos, material swatches).
  - Material, color, and heel height preferences.
  - Detailed design notes and specific occasion requirements.
  - Contact preference (WhatsApp, Email, In-App Portal).
- **True Persistence:** Submissions automatically create:
  1. A `custom_designs` record in PostgreSQL.
  2. Secure storage uploads in Supabase Storage (`design-references` bucket).
  3. A dedicated private `conversations` channel linking client and owner.
  4. Instant notification alert for the administrator.

### 4.6 Product Authenticity Verification (`/authenticity`)
- Real database-backed security system.
- Code entry input field + direct camera QR code scanner.
- Instant server verification of unique serial numbers and batch codes:
  - **Valid / Authentic:** Displays model name, manufacturing date, verification count, batch number, and official authenticity seal.
  - **Invalid:** Warns customer that the code does not exist.
  - **Inactive:** Informs customer that the batch code has expired or been revoked.
  - **Audit Logging:** Every verification attempt logs timestamp, IP hash, and status.

### 4.7 International Wholesale Portal (`/wholesale`)
- Comprehensive overview of POM'S export capabilities, packaging standards, and production volume.
- Wholesale Inquiry Form:
  - Company/Buyer Name, Business License/Tax ID (optional), Country of Destination.
  - Preferred Shipping Method (Air Freight, Sea Freight, Express Courier).
  - Target Quantities, Product Categories of Interest, Package Quantity requirements.
- Direct link to Downloadable Wholesale PDF Catalogue.

### 4.8 International Shoe Size Guide (`/size-guide`)
- Comprehensive conversion chart: EU (35–43), UK (2–9), US (4–11), Foot Length in Centimeters (CM) and Inches.
- Foot measurement guide with visual instructions.
- Footwear fit notes explaining model-specific considerations (e.g., pointed toe vs. open slide fit).

### 4.9 International Shipping & Customs Policy (`/shipping`)
- Clear guidelines on export terms (FOB Addis Ababa, CIF, DDP where applicable).
- Customs duties and import tax disclosures for international wholesale buyers.
- Estimated shipping transit windows by continent and carrier.

### 4.10 Additional Core Pages
- `/about` — Editorial brand narrative and craftsmanship philosophy.
- `/contact` — Contact channels, WhatsApp direct integration, location map.
- `/faq` — Answers to custom design, wholesale, payment, and authenticity questions.
- `/privacy` & `/terms` — International privacy policy and commercial terms.
- `/account` & `/account/messages` — Customer authentication, order tracking, and private conversations.

---

## 5. Customer Messaging & Private Collaboration System

### 5.1 Dual Customer Authentication Model
1. **Registered Customers:** Full account creation via Supabase Auth (Email + Password or OTP). Access to order history, quotation archives, saved measurements, and active message threads.
2. **Verified Guest Access:** Visitors submitting custom designs or wholesale inquiries without an account receive a cryptographically secure, unguessable access token (UUIDv4 / HMAC-SHA256) granting access only to their specific conversation thread via `/inquiry/[token]`.

### 5.2 Thread & Messaging Capabilities
- Two-way messaging between customer and POM'S administrator.
- Real-time updates powered by Supabase Realtime WebSocket subscriptions.
- Rich image attachments: customers upload shoe photos; admin replies with leather swatches, heel samples, mockups, and formal quotations.
- Message status indicators: Sent, Delivered, Read, Admin Replied.
- Multilingual translation toggle: displays original text alongside AI-assisted translation for smooth international trade.
- **Strict Privacy Enforcement:** Postgres Row-Level Security (RLS) ensures Customer A can never access or inspect Customer B's threads or attachments.

---

## 6. Quotation & B2B Order Management Engine

### 6.1 Formal Quotation Creation
Administrators can generate itemized quotations directly within a customer conversation:
- Quotation Number (e.g., `POM-Q-2026-0042`).
- Line items: Product / Custom Design, Material Grade, Color, Size Breakdown, Package Count, Unit Price, Total Price.
- Currency selection: USD ($), ETB (Br), CNY (¥), INR (₹), EUR (€).
- Estimated Shipping Cost & Terms.
- Quotation Validity Expiration Date.
- Custom terms and attachment files (e.g., leather spec sheet).

### 6.2 Customer Review & Acceptance
- Customer reviews formal quote in their private portal.
- Actions: "Accept Quotation", "Request Modification", "Decline / Inquire".
- Upon acceptance, status moves to **Awaiting Confirmation / Deposit**.

### 6.3 10-Stage Order Lifecycle
1. `new_request` — Initial inquiry or custom submission received.
2. `under_discussion` — Specifications and materials being reviewed.
3. `price_sent` — Formal quotation transmitted to customer.
4. `awaiting_confirmation` — Waiting for customer acceptance and deposit.
5. `confirmed` — Customer accepted and deposit verified.
6. `in_production` — Footwear in active manufacturing.
7. `ready` — Production complete, final inspection passed.
8. `shipped` — Dispatched with carrier details and waybill.
9. `completed` — Delivered and finalized.
10. `cancelled` — Terminated with recorded cancellation reason.

---

## 7. Dynamic Wholesale PDF Catalogue Generator

- Server-side PDF generation module (`@react-pdf/renderer` or `pdfmake`).
- Admin can configure catalogue export:
  - Filter by collection, category, or specific shoes.
  - Select target language (English, Amharic, Chinese, Hindi, Spanish).
  - Include or exclude wholesale pricing / package tiers.
- Generated PDF includes:
  - Official POM'S luxury branding and cover page.
  - High-resolution product photographs.
  - Materials, sole details, available sizes, package carton specs, and MOQs.
  - Official contact details, QR code to verify live catalogue, and export terms.

---

## 8. Mobile-First Android Admin Portal (`/admin`)

The administrator must be able to manage the entire global brand from an Android smartphone. Every screen is optimized for mobile touch ergonomics (large tap targets, floating action buttons, responsive bottom sheets, swipe gestures).

### 8.1 Authentication & Staff Roles
- Secure server-side credential verification (no public registration).
- Role-Based Access Control (RBAC):
  - `owner` / `super_admin`: Full system control, financial logs, staff creation.
  - `content_manager`: Homepage editor, brand copy, translations.
  - `product_manager`: Products, collections, media library, catalogue layout.
  - `customer_support`: Customer messaging, custom design triage.
  - `wholesale_manager`: Wholesale inquiries, quotation generation, orders.
- Comprehensive `activity_logs` tracking every administrative action.

### 8.2 The 19 Core Admin Modules
1. **Executive Dashboard:** Live metrics (Active Inquiries, Unread Messages, Pending Quotes, Confirmed Orders, Catalogue Size, Storage Usage).
2. **Homepage Editor:** Visual section reordering, banner uploads, heading edits, draft/publish states.
3. **Collection Manager:** Create/edit collections, assign hero photos, manage multilingual text.
4. **Product Manager:** Full CRUD, multi-image upload, image reordering, wholesale package specs, SEO metadata.
5. **Media Library:** Central asset hub with direct Android camera and gallery upload, categorization, safe-deletion dependency checks.
6. **Custom Design Inquiries:** Filterable pipeline of bespoke shoe requests with photo viewer and instant chat launch.
7. **Customer Messages:** Multi-channel inbox with real-time notifications, photo sharing, and quick replies.
8. **Customer Directory:** Registered and guest customer profiles, inquiry history, order volume.
9. **Quotations Manager:** Quote builder, currency switcher, PDF exporter, status tracker.
10. **Order Manager:** 10-stage production tracker, shipping updates, deposit verification.
11. **Translation Manager:** Central matrix of 5-language content; AI translation trigger and manual editor.
12. **Layout & Grid Editor:** Granular control over catalogue columns (1–6 cols on desktop, 1–2 on mobile), image aspect ratios, card spacing, and text visibility.
13. **Theme Settings:** Palette customization, preview tokens, default contrast modes.
14. **Wholesale Settings:** Default packaging units, standard carton volumes, export terms.
15. **Shipping Settings:** Country-specific freight estimates, carrier options, delivery notices.
16. **SEO & Metadata Manager:** OpenGraph defaults, sitemap generator, canonical URL rules.
17. **Staff & Permissions:** Role assignment, staff invite tokens, access revocation.
18. **Activity & Audit Logs:** Immutable timestamped record of administrative events.
19. **Website Settings:** Brand contact details, social links, maintenance mode toggle.

---

## 9. Security, Authentication & Data Protection

1. **Row-Level Security (RLS):** Enabled on every single database table. Explicit SQL policies restrict customer data to verified owners.
2. **Storage Bucket Segregation:**
   - `public-catalogue`: Public read access for product and collection photography.
   - `private-designs`: Private read/write; accessible strictly by the uploading customer and authorized admin staff.
   - `private-quotations`: Restricted to transaction participants.
3. **Server-Side API Security:** Privileged operations (quotation creation, status modification, owner bootstrap) execute exclusively via Next.js Server Actions with server-side session and role verification.
4. **Zero Client Secret Leakage:** `SUPABASE_SERVICE_ROLE_KEY`, AI translation keys, and email service keys reside exclusively in server environment variables.
5. **Rate Limiting & Input Sanitization:** Sensitive routes (login, custom design submission, message post) enforce IP-based rate limiting and strict Zod schema validation.
