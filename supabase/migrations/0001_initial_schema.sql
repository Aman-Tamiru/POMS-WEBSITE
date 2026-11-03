-- ==============================================================================
-- POM'S INTERNATIONAL FOOTWEAR PLATFORM
-- INITIAL DATABASE SCHEMA & COMPLETE ROW LEVEL SECURITY (RLS) POLICIES
-- Target Engine: PostgreSQL 15+ (Supabase)
-- Migration: 0001_initial_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES & ENUMS
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM (
        'owner', 
        'super_admin', 
        'product_manager', 
        'content_manager', 
        'customer_support', 
        'wholesale_manager'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.shoe_type AS ENUM (
        'flat', 
        'heel', 
        'pump', 
        'slipper', 
        'slide', 
        'sandal', 
        'boot', 
        'bespoke'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.conversation_status AS ENUM (
        'open', 
        'pending_admin', 
        'pending_customer', 
        'quoted', 
        'confirmed', 
        'closed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.quotation_status AS ENUM (
        'draft', 
        'sent', 
        'accepted', 
        'revision_requested', 
        'declined', 
        'expired'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.order_stage AS ENUM (
        'new_request', 
        'under_discussion', 
        'price_sent', 
        'awaiting_confirmation', 
        'confirmed', 
        'in_production', 
        'ready', 
        'shipped', 
        'completed', 
        'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.authenticity_status AS ENUM (
        'active', 
        'inactive', 
        'revoked'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. PROFILES & STAFF ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.staff_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role public.app_role NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    granted_by UUID REFERENCES public.profiles(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, role)
);

-- 4. COLLECTIONS & LOCALIZATION
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.collection_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL, -- 'en', 'am', 'so', 'zh-CN', 'hi', 'es'
    name TEXT NOT NULL,
    description TEXT,
    meta_title TEXT,
    meta_description TEXT,
    is_reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(collection_id, language)
);

-- 5. PRODUCTS, IMAGES & LOCALIZATION
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    shoe_type public.shoe_type DEFAULT 'flat',
    description TEXT,
    materials TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    sizes_available TEXT[] DEFAULT '{}',
    base_price DECIMAL(10,2),
    currency VARCHAR(5) DEFAULT 'USD',
    is_price_on_request BOOLEAN DEFAULT TRUE,
    is_wholesale_available BOOLEAN DEFAULT TRUE,
    minimum_order_quantity INT DEFAULT 1,
    package_quantity INT DEFAULT 12,
    is_featured BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    materials_description TEXT,
    meta_title TEXT,
    meta_description TEXT,
    is_reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, language)
);

-- 6. CUSTOM BESPOKE DESIGN & REALTIME CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.custom_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(32) UNIQUE NOT NULL,
    customer_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_phone TEXT NOT NULL,
    guest_country TEXT,
    design_description TEXT NOT NULL,
    material_preference TEXT,
    color_preference TEXT,
    preferred_contact_method VARCHAR(20) DEFAULT 'whatsapp',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    custom_design_id UUID REFERENCES public.custom_designs(id) ON DELETE SET NULL,
    customer_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_access_token VARCHAR(64) UNIQUE,
    title TEXT NOT NULL,
    status public.conversation_status DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_from_admin BOOLEAN DEFAULT FALSE,
    content TEXT NOT NULL,
    translated_content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. QUOTATIONS, ORDERS & STATUS AUDITING
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number VARCHAR(32) UNIQUE NOT NULL,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
    customer_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    recipient_name TEXT NOT NULL,
    recipient_email TEXT,
    recipient_phone TEXT,
    recipient_country TEXT,
    currency VARCHAR(5) DEFAULT 'USD',
    subtotal_amount DECIMAL(12,2) NOT NULL,
    shipping_estimated_amount DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    terms_and_conditions TEXT,
    status public.quotation_status DEFAULT 'sent',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    item_title TEXT NOT NULL,
    item_description TEXT,
    material_grade TEXT,
    color TEXT,
    size_breakdown TEXT,
    quantity INT NOT NULL,
    package_quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) UNIQUE NOT NULL,
    quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
    customer_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    stage public.order_stage DEFAULT 'confirmed',
    total_amount DECIMAL(12,2) NOT NULL,
    deposit_required_percent DECIMAL(5,2) DEFAULT 50.00,
    deposit_amount_paid DECIMAL(12,2) DEFAULT 0.00,
    is_deposit_verified BOOLEAN DEFAULT FALSE,
    payment_proof_url TEXT,
    shipping_address TEXT,
    destination_country TEXT,
    tracking_carrier TEXT,
    tracking_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_stage public.order_stage,
    new_stage public.order_stage NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PRODUCT AUTHENTICITY RECORDS
CREATE TABLE IF NOT EXISTS public.authenticity_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    verification_code VARCHAR(32) UNIQUE NOT NULL,
    batch_number VARCHAR(32),
    manufactured_date DATE,
    status public.authenticity_status DEFAULT 'active',
    verification_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.authenticity_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    authenticity_record_id UUID REFERENCES public.authenticity_records(id) ON DELETE CASCADE,
    code_entered TEXT NOT NULL,
    result_status VARCHAR(20) NOT NULL,
    ip_hash VARCHAR(64),
    user_agent TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. HOMEPAGE, MEDIA & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(50) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    body_text TEXT,
    button_label TEXT,
    button_link TEXT,
    background_image_url TEXT,
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    custom_config JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    alt_text TEXT,
    category VARCHAR(50) DEFAULT 'catalogue',
    file_size_bytes BIGINT,
    mime_type VARCHAR(50),
    is_archived BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_profile_id UUID REFERENCES public.profiles(id),
    action_type VARCHAR(50) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authenticity_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authenticity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 11. SECURITY DEFINER HELPER FUNCTION FOR ROLE CHECKS
CREATE OR REPLACE FUNCTION public.is_active_staff(required_role public.app_role DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    IF required_role IS NULL THEN
        RETURN EXISTS (
            SELECT 1 FROM public.staff_roles
            WHERE profile_id = auth.uid() AND active = TRUE
        );
    ELSE
        RETURN EXISTS (
            SELECT 1 FROM public.staff_roles
            WHERE profile_id = auth.uid() AND active = TRUE
              AND (role = required_role OR role = 'owner' OR role = 'super_admin')
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. RLS POLICIES

-- Public Read Policies
DROP POLICY IF EXISTS "Public users view published products" ON public.products;
CREATE POLICY "Public users view published products" 
ON public.products FOR SELECT 
USING (is_published = TRUE AND is_archived = FALSE);

DROP POLICY IF EXISTS "Public users view product images" ON public.product_images;
CREATE POLICY "Public users view product images" 
ON public.product_images FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.is_published = TRUE));

DROP POLICY IF EXISTS "Public users view published collections" ON public.collections;
CREATE POLICY "Public users view published collections" 
ON public.collections FOR SELECT 
USING (is_published = TRUE);

DROP POLICY IF EXISTS "Public users view published homepage sections" ON public.homepage_sections;
CREATE POLICY "Public users view published homepage sections" 
ON public.homepage_sections FOR SELECT 
USING (is_visible = TRUE);

-- Customer Isolation Policies (Zero Leakage: Customer A never sees Customer B)
DROP POLICY IF EXISTS "Customers view only their own profile" ON public.profiles;
CREATE POLICY "Customers view only their own profile" 
ON public.profiles FOR SELECT 
USING (id = auth.uid() OR public.is_active_staff());

DROP POLICY IF EXISTS "Customers update only their own profile" ON public.profiles;
CREATE POLICY "Customers update only their own profile" 
ON public.profiles FOR UPDATE 
USING (id = auth.uid());

DROP POLICY IF EXISTS "Customers view only their own conversations" ON public.conversations;
CREATE POLICY "Customers view only their own conversations" 
ON public.conversations FOR SELECT 
USING (customer_profile_id = auth.uid() OR public.is_active_staff());

DROP POLICY IF EXISTS "Customers view only their own messages" ON public.messages;
CREATE POLICY "Customers view only their own messages" 
ON public.messages FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = conversation_id 
          AND (c.customer_profile_id = auth.uid() OR public.is_active_staff())
    )
);

DROP POLICY IF EXISTS "Customers insert messages in their conversation" ON public.messages;
CREATE POLICY "Customers insert messages in their conversation" 
ON public.messages FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = conversation_id 
          AND (c.customer_profile_id = auth.uid() OR public.is_active_staff())
    )
);

DROP POLICY IF EXISTS "Customers view only their own quotations" ON public.quotations;
CREATE POLICY "Customers view only their own quotations" 
ON public.quotations FOR SELECT 
USING (customer_profile_id = auth.uid() OR public.is_active_staff());

DROP POLICY IF EXISTS "Customers view only their own orders" ON public.orders;
CREATE POLICY "Customers view only their own orders" 
ON public.orders FOR SELECT 
USING (customer_profile_id = auth.uid() OR public.is_active_staff());

-- Staff Management Full Access Policies
DROP POLICY IF EXISTS "Staff manage products" ON public.products;
CREATE POLICY "Staff manage products" 
ON public.products FOR ALL 
USING (public.is_active_staff('product_manager'));

DROP POLICY IF EXISTS "Staff manage collections" ON public.collections;
CREATE POLICY "Staff manage collections" 
ON public.collections FOR ALL 
USING (public.is_active_staff('product_manager'));

DROP POLICY IF EXISTS "Staff manage homepage" ON public.homepage_sections;
CREATE POLICY "Staff manage homepage" 
ON public.homepage_sections FOR ALL 
USING (public.is_active_staff('content_manager'));

DROP POLICY IF EXISTS "Staff manage quotations" ON public.quotations;
CREATE POLICY "Staff manage quotations" 
ON public.quotations FOR ALL 
USING (public.is_active_staff('wholesale_manager'));

DROP POLICY IF EXISTS "Staff manage orders" ON public.orders;
CREATE POLICY "Staff manage orders" 
ON public.orders FOR ALL 
USING (public.is_active_staff('wholesale_manager'));

DROP POLICY IF EXISTS "Staff view all conversations" ON public.conversations;
CREATE POLICY "Staff view all conversations" 
ON public.conversations FOR ALL 
USING (public.is_active_staff('customer_support'));

DROP POLICY IF EXISTS "Staff manage media" ON public.media_library;
CREATE POLICY "Staff manage media" 
ON public.media_library FOR ALL 
USING (public.is_active_staff());

DROP POLICY IF EXISTS "Owner manages staff roles" ON public.staff_roles;
CREATE POLICY "Owner manages staff roles" 
ON public.staff_roles FOR ALL 
USING (public.is_active_staff('owner'));

DROP POLICY IF EXISTS "Staff view activity logs" ON public.activity_logs;
CREATE POLICY "Staff view activity logs" 
ON public.activity_logs FOR SELECT 
USING (public.is_active_staff('owner'));

-- 13. SEED DEFAULT HOMEPAGE SECTIONS
INSERT INTO public.homepage_sections (section_key, title, subtitle, body_text, button_label, button_link, display_order, is_visible)
VALUES 
(
    'hero',
    'Elegance In Every Step',
    'POM''S INTERNATIONAL FOOTWEAR',
    'Discover bespoke craftsmanship, modern luxury silhouettes, and international wholesale footwear engineered for global distinction.',
    'EXPLORE COLLECTION',
    '/catalogue',
    1,
    TRUE
),
(
    'featured_lines',
    'The Signature Edit',
    'CURATED COLLECTIONS',
    'Iconic pointed flats, sculpted evening heels, and artisanal slides handcrafted with premier leather and champagne gold accents.',
    'VIEW ALL LINES',
    '/collection',
    2,
    TRUE
),
(
    'custom_design',
    'Bring Your Footwear Vision to Life',
    'BESPOKE SHOE STUDIO',
    'Have a footwear silhouette or custom material in mind? Upload your photographs, select your preferences, and collaborate directly with our master artisans.',
    'START CUSTOM DESIGN',
    '/custom-design',
    3,
    TRUE
),
(
    'wholesale_banner',
    'International Wholesale & Bulk Export',
    'GLOBAL B2B DISTRIBUTION',
    'Supplying international boutiques, footwear retailers, and department stores worldwide with flexible carton packaging, MOQs, and reliable freight.',
    'REQUEST WHOLESALE QUOTE',
    '/wholesale',
    4,
    TRUE
),
(
    'authenticity',
    'Product Authenticity Verification',
    'GENUINE CRAFTSMANSHIP GUARANTEE',
    'Every pair of POM''S footwear features a unique serial identifier and QR code. Verify your official shoes directly against our master database.',
    'VERIFY PRODUCT',
    '/authenticity',
    5,
    TRUE
)
ON CONFLICT (section_key) DO NOTHING;
