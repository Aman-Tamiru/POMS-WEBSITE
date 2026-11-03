# POM'S Beginner-Friendly Setup & Deployment Guide
**Project:** POM'S International Footwear Platform  
**Target Repository:** `poms-international-website`  
**Root Folder:** `POMS-WEBSITE`  
**Prerequisites:** Node.js 18+ or 20+, Git, Free Supabase Account, Free Vercel Account, Free GitHub Account

---

## 1. Welcome & Critical First Rule

Welcome to the POM'S international footwear platform setup guide. This guide is written with clear, step-by-step instructions so you can run the project locally, set up the backend database, create your owner account, and deploy to the web without needing advanced technical experience.

> ### ⚠️ CRITICAL NOTICE — PROTECT MSSQUEEN
> **Do not use any credentials, database URLs, or Vercel projects belonging to MSSQUEEN.**  
> POM'S is a brand new, 100% separate project. You will create a **brand new free project in Supabase** and a **brand new project in Vercel**. MSSQUEEN will remain completely untouched.

---

## 2. Step 1: Install Dependencies & Run Locally

Open your terminal or PowerShell inside the `POMS-WEBSITE` project folder:

```bash
# Verify you are in the correct folder
cd "c:\Users\amant\Desktop\My Projects\POMS-WEBSITE"

# Install project dependencies
npm install

# Start the local development server
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```
You will see the POM'S luxury footwear website running locally.

---

## 3. Step 2: Create Your New Supabase Project

POM'S uses Supabase for its PostgreSQL database, user authentication, and secure image storage.

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **"New Project"**.
3. Choose your organization.
4. Fill in the project details:
   - **Name:** `poms-international-footwear` (or `poms-website`)
   - **Database Password:** Choose a strong password and save it in a safe place.
   - **Region:** Select the region closest to your target audience (e.g., Frankfurt/Europe or US East).
   - **Pricing Plan:** Free tier is completely fine to start.
5. Click **"Create new project"** and wait about 2 minutes for Supabase to provision your database.

---

## 4. Step 3: Configure Environment Variables

1. Inside your `POMS-WEBSITE` folder, copy `.env.example` to create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open your new Supabase project dashboard and click on the **Settings (gear icon)** at the bottom left, then click **"API"**.
3. Copy your project credentials into `.env.local`:
   ```env
   # In Supabase Settings -> API:
   # 1. Project URL:
   NEXT_PUBLIC_SUPABASE_URL=https://your-new-project-id.supabase.co

   # 2. Project API Keys -> anon / public:
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

   # 3. Project API Keys -> service_role (SECRET - never share this!):
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

   # Application URL (for local development):
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Admin Bootstrap Key (Choose your own secret phrase for owner creation):
   ADMIN_BOOTSTRAP_TOKEN=poms_owner_secret_setup_token_2026
   ```

---

## 5. Step 4: Apply Database Migrations & Storage Buckets

1. In your Supabase dashboard, click on the **SQL Editor** icon in the left sidebar.
2. Click **"New Query"**.
3. Open the file `supabase/migrations/0001_initial_schema.sql` located in your `POMS-WEBSITE` folder.
4. Copy the entire contents of that SQL file, paste it into the Supabase SQL Editor, and click **"Run"**.
5. You should see a green success message: *"Success. No rows returned."* All 28 tables and security policies are now created!

### Set Up Storage Buckets
1. In the Supabase dashboard, click on **Storage** in the left sidebar.
2. Click **"New Bucket"** and create these 3 buckets:
   - Bucket 1:
     - Name: `public-catalogue`
     - **Public Bucket:** Turn this toggle **ON** (checked).
   - Bucket 2:
     - Name: `private-designs`
     - **Public Bucket:** Leave this toggle **OFF** (private).
   - Bucket 3:
     - Name: `private-quotations`
     - **Public Bucket:** Leave this toggle **OFF** (private).

---

## 6. Step 5: Create Your Owner / Administrator Account

There is **no public registration page** for administrators. To create the initial Owner account safely:

1. Make sure your local development server is running (`npm run dev`).
2. Open your browser and navigate to the one-time bootstrap page:
   ```
   http://localhost:3000/admin/setup
   ```
3. Enter:
   - **Bootstrap Secret Token:** The exact value you set for `ADMIN_BOOTSTRAP_TOKEN` in `.env.local`.
   - **Owner Email:** Your personal or business email (e.g., `owner@poms-shoes.com`).
   - **Owner Full Name:** Your name.
   - **Password:** A strong, secure password for your owner account.
4. Click **"Initialize Owner Account"**.
5. Once created, navigate to:
   ```
   http://localhost:3000/admin/login
   ```
6. Sign in with your owner email and password. You will be taken straight into the **POM'S Admin Portal**!

---

## 7. Step 6: Test the Features

Perform these quick tests to confirm everything is working smoothly:
1. **Theme Switcher:** Click the Theme icon (Sun/Moon) in the top header. The site should transition between the rich Dark luxury theme and the warm Ivory Light theme.
2. **Language Switcher:** Select different languages from the header dropdown (English, Amharic, Chinese, Hindi, Spanish).
3. **Admin Products:** Log in to `/admin`, click **Products**, and click **Add New Product**. Upload a shoe photo and save.
4. **Custom Shoe Design Form:** Open `/custom-design`, fill out the form, upload an image, and submit. Check `/admin/inbox` or `/admin/designs` to see the submission appear immediately!

---

## 8. Step 7: Connect to GitHub

1. Go to [https://github.com](https://github.com) and click **"New repository"**.
2. Name the repository:
   ```
   poms-international-website
   ```
3. Set the repository to **Private** (recommended to protect your business assets).
4. Do not initialize with README, .gitignore, or license (we already have them).
5. In your local terminal inside `POMS-WEBSITE`, run:
   ```bash
   git init
   git add .
   git commit -m "feat: complete initial release of POM'S international footwear platform"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/poms-international-website.git
   git push -u origin main
   ```

---

## 9. Step 8: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in.
2. Click **"Add New..."** -> **"Project"**.
3. Connect your GitHub account if not already connected, and select `poms-international-website`.
4. In the **Environment Variables** section, add the same variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (Set this to your Vercel URL, e.g. `https://poms-international-website.vercel.app`)
   - `ADMIN_BOOTSTRAP_TOKEN`
5. Click **"Deploy"**.
6. Within 2 minutes, your website will be live worldwide!

---

## 10. Step 9: Connect a Custom Domain (When Ready)

When you purchase your official domain (e.g., `poms-shoes.com` or `pomsfootwear.com`):
1. In your Vercel Project Dashboard, go to **Settings** -> **Domains**.
2. Type in your domain name and click **Add**.
3. Vercel will provide two DNS records (an `A` record and a `CNAME` record).
4. Log in to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) and add those two DNS records.
5. Vercel will automatically generate a free SSL certificate within 15–30 minutes, and your site will be secure at `https://yourdomain.com`.
