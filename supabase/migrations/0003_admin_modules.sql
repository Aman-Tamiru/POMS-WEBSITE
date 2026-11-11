
-- POMS International: additive admin-module settings
-- Does not alter or delete existing business records.

CREATE TABLE IF NOT EXISTS public.poms_admin_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_key TEXT NOT NULL,
    setting_key TEXT NOT NULL,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    description TEXT,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (module_key, setting_key)
);

ALTER TABLE public.poms_admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can read admin module settings"
ON public.poms_admin_settings;

CREATE POLICY "Staff can read admin module settings"
ON public.poms_admin_settings
FOR SELECT TO authenticated
USING (
    public.is_active_staff('owner'::public.app_role)
    OR public.is_active_staff('super_admin'::public.app_role)
    OR public.is_active_staff('content_manager'::public.app_role)
    OR public.is_active_staff('wholesale_manager'::public.app_role)
);

DROP POLICY IF EXISTS "Authorized staff manage admin module settings"
ON public.poms_admin_settings;

CREATE POLICY "Authorized staff manage admin module settings"
ON public.poms_admin_settings
FOR ALL TO authenticated
USING (
    public.is_active_staff('owner'::public.app_role)
    OR public.is_active_staff('super_admin'::public.app_role)
    OR (
        module_key IN ('shipping', 'wholesale')
        AND public.is_active_staff('wholesale_manager'::public.app_role)
    )
    OR (
        module_key IN ('theme')
        AND public.is_active_staff('content_manager'::public.app_role)
    )
)
WITH CHECK (
    public.is_active_staff('owner'::public.app_role)
    OR public.is_active_staff('super_admin'::public.app_role)
    OR (
        module_key IN ('shipping', 'wholesale')
        AND public.is_active_staff('wholesale_manager'::public.app_role)
    )
    OR (
        module_key IN ('theme')
        AND public.is_active_staff('content_manager'::public.app_role)
    )
);

CREATE INDEX IF NOT EXISTS poms_admin_settings_module_idx
ON public.poms_admin_settings(module_key);

CREATE OR REPLACE FUNCTION public.set_poms_admin_settings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS poms_admin_settings_updated_at
ON public.poms_admin_settings;

CREATE TRIGGER poms_admin_settings_updated_at
BEFORE UPDATE ON public.poms_admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_poms_admin_settings_updated_at();
