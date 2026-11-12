-- POMS Phase 2: persistent public inquiries
-- Apply this migration in Supabase SQL Editor before enabling the updated forms.

ALTER TABLE public.custom_designs
  ADD COLUMN IF NOT EXISTS reference_image_urls TEXT[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.wholesale_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  freight_method TEXT,
  target_cartons TEXT,
  models_of_interest TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.wholesale_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff manage custom design inquiries" ON public.custom_designs;
CREATE POLICY "Staff manage custom design inquiries"
ON public.custom_designs FOR ALL
USING (
  public.is_active_staff('content_manager'::public.app_role)
  OR public.is_active_staff('customer_support'::public.app_role)
)
WITH CHECK (
  public.is_active_staff('content_manager'::public.app_role)
  OR public.is_active_staff('customer_support'::public.app_role)
);

DROP POLICY IF EXISTS "Staff manage wholesale inquiries" ON public.wholesale_inquiries;
CREATE POLICY "Staff manage wholesale inquiries"
ON public.wholesale_inquiries FOR ALL
USING (
  public.is_active_staff('wholesale_manager'::public.app_role)
  OR public.is_active_staff('content_manager'::public.app_role)
)
WITH CHECK (
  public.is_active_staff('wholesale_manager'::public.app_role)
  OR public.is_active_staff('content_manager'::public.app_role)
);

-- Uploaded custom-design references remain private; only authorized staff can read them.
DROP POLICY IF EXISTS "Staff read custom design reference files" ON storage.objects;
CREATE POLICY "Staff read custom design reference files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'custom-design-references'
  AND (
    public.is_active_staff('content_manager'::public.app_role)
    OR public.is_active_staff('customer_support'::public.app_role)
  )
);
