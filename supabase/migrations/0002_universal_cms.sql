-- =============================================================================
-- POMS INTERNATIONAL
-- MIGRATION 0002: UNIVERSAL CMS FOUNDATION
-- PostgreSQL 15+ / Supabase
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. HARDEN EXISTING STAFF ROLE FUNCTION
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_active_staff(
    required_role public.app_role DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM public.staff_roles AS sr
        WHERE sr.profile_id = auth.uid()
          AND sr.active = TRUE
          AND (
              required_role IS NULL
              OR sr.role = required_role
              OR sr.role IN (
                  'owner'::public.app_role,
                  'super_admin'::public.app_role
              )
          )
    );
$function$;

REVOKE ALL ON FUNCTION public.is_active_staff(public.app_role)
FROM PUBLIC;

REVOKE ALL ON FUNCTION public.is_active_staff(public.app_role)
FROM anon;

GRANT EXECUTE ON FUNCTION public.is_active_staff(public.app_role)
TO authenticated;


-- ---------------------------------------------------------------------------
-- 2. WEBSITE PAGES
-- ---------------------------------------------------------------------------

CREATE TABLE public.site_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    parent_page_id UUID REFERENCES public.site_pages(id)
        ON DELETE SET NULL,

    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    route_path TEXT NOT NULL UNIQUE,

    page_type TEXT NOT NULL DEFAULT 'standard'
        CHECK (page_type IN (
            'standard',
            'homepage',
            'catalogue',
            'collection_index',
            'collection_detail',
            'contact',
            'custom_design',
            'wholesale',
            'authenticity',
            'legal',
            'faq',
            'size_guide',
            'shipping',
            'system'
        )),

    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),

    is_system_page BOOLEAN NOT NULL DEFAULT FALSE,

    show_in_header BOOLEAN NOT NULL DEFAULT FALSE,
    show_in_footer BOOLEAN NOT NULL DEFAULT FALSE,
    show_in_mobile BOOLEAN NOT NULL DEFAULT TRUE,
    open_in_new_tab BOOLEAN NOT NULL DEFAULT FALSE,

    display_order INTEGER NOT NULL DEFAULT 0,

    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    og_image_url TEXT,

    publish_at TIMESTAMPTZ,
    unpublish_at TIMESTAMPTZ,

    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT site_pages_slug_format
        CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

    CONSTRAINT site_pages_route_format
        CHECK (
            LEFT(route_path, 1) = '/'
            AND route_path !~ '[?#]'
        ),

    CONSTRAINT site_pages_valid_schedule
        CHECK (
            unpublish_at IS NULL
            OR publish_at IS NULL
            OR unpublish_at > publish_at
        ),

    CONSTRAINT site_pages_not_own_parent
        CHECK (parent_page_id IS NULL OR parent_page_id <> id)
);

CREATE INDEX site_pages_status_order_idx
    ON public.site_pages(status, display_order);

CREATE INDEX site_pages_parent_idx
    ON public.site_pages(parent_page_id);


-- ---------------------------------------------------------------------------
-- 3. PAGE TRANSLATIONS
-- ---------------------------------------------------------------------------

CREATE TABLE public.site_page_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    page_id UUID NOT NULL REFERENCES public.site_pages(id)
        ON DELETE CASCADE,

    language VARCHAR(10) NOT NULL
        CHECK (language IN ('en', 'am', 'so', 'zh-CN', 'hi', 'es')),

    title TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    og_title TEXT,
    og_description TEXT,

    is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(page_id, language)
);


-- ---------------------------------------------------------------------------
-- 4. PAGE SECTIONS
-- ---------------------------------------------------------------------------

CREATE TABLE public.site_page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    page_id UUID NOT NULL REFERENCES public.site_pages(id)
        ON DELETE CASCADE,

    section_type TEXT NOT NULL
        CHECK (section_type IN (
            'hero',
            'rich_text',
            'image_text',
            'image_gallery',
            'product_grid',
            'collection_grid',
            'video',
            'testimonials',
            'faq',
            'stats',
            'contact_cta',
            'promo_banner',
            'button_group',
            'spacer',
            'custom_design_cta'
        )),

    internal_name TEXT,

    content JSONB NOT NULL DEFAULT '{}'::JSONB
        CHECK (jsonb_typeof(content) = 'object'),

    settings JSONB NOT NULL DEFAULT '{}'::JSONB
        CHECK (jsonb_typeof(settings) = 'object'),

    display_order INTEGER NOT NULL DEFAULT 0,

    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    show_on_desktop BOOLEAN NOT NULL DEFAULT TRUE,
    show_on_mobile BOOLEAN NOT NULL DEFAULT TRUE,

    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX site_page_sections_page_order_idx
    ON public.site_page_sections(page_id, display_order);


-- ---------------------------------------------------------------------------
-- 5. SECTION TRANSLATIONS
-- ---------------------------------------------------------------------------

CREATE TABLE public.site_section_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    section_id UUID NOT NULL REFERENCES public.site_page_sections(id)
        ON DELETE CASCADE,

    language VARCHAR(10) NOT NULL
        CHECK (language IN ('en', 'am', 'so', 'zh-CN', 'hi', 'es')),

    title TEXT,
    subtitle TEXT,
    body TEXT,
    button_label TEXT,

    translated_content JSONB NOT NULL DEFAULT '{}'::JSONB
        CHECK (jsonb_typeof(translated_content) = 'object'),

    is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(section_id, language)
);


-- ---------------------------------------------------------------------------
-- 6. PAGE VERSION HISTORY
-- ---------------------------------------------------------------------------

CREATE TABLE public.site_page_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    page_id UUID NOT NULL REFERENCES public.site_pages(id)
    ON DELETE RESTRICT,

    version_number INTEGER NOT NULL CHECK (version_number > 0),

    snapshot JSONB NOT NULL
        CHECK (jsonb_typeof(snapshot) = 'object'),

    change_summary TEXT,

    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(page_id, version_number)
);

CREATE INDEX site_page_versions_history_idx
    ON public.site_page_versions(page_id, version_number DESC);


-- ---------------------------------------------------------------------------
-- 7. ENABLE ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_section_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_page_versions ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- 8. PAGE POLICIES
-- ---------------------------------------------------------------------------

CREATE POLICY "Public can view published pages"
ON public.site_pages
FOR SELECT
TO anon, authenticated
USING (
    status = 'published'
    AND (publish_at IS NULL OR publish_at <= NOW())
    AND (unpublish_at IS NULL OR unpublish_at > NOW())
);

CREATE POLICY "Content managers manage pages"
ON public.site_pages
FOR ALL
TO authenticated
USING (public.is_active_staff('content_manager'))
WITH CHECK (public.is_active_staff('content_manager'));


-- ---------------------------------------------------------------------------
-- 9. PAGE TRANSLATION POLICIES
-- ---------------------------------------------------------------------------

CREATE POLICY "Public can view published page translations"
ON public.site_page_translations
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.site_pages AS p
        WHERE p.id = page_id
          AND p.status = 'published'
          AND (p.publish_at IS NULL OR p.publish_at <= NOW())
          AND (p.unpublish_at IS NULL OR p.unpublish_at > NOW())
    )
);

CREATE POLICY "Content managers manage page translations"
ON public.site_page_translations
FOR ALL
TO authenticated
USING (public.is_active_staff('content_manager'))
WITH CHECK (public.is_active_staff('content_manager'));


-- ---------------------------------------------------------------------------
-- 10. SECTION POLICIES
-- ---------------------------------------------------------------------------

CREATE POLICY "Public can view visible published sections"
ON public.site_page_sections
FOR SELECT
TO anon, authenticated
USING (
    is_visible = TRUE
    AND EXISTS (
        SELECT 1
        FROM public.site_pages AS p
        WHERE p.id = page_id
          AND p.status = 'published'
          AND (p.publish_at IS NULL OR p.publish_at <= NOW())
          AND (p.unpublish_at IS NULL OR p.unpublish_at > NOW())
    )
);

CREATE POLICY "Content managers manage page sections"
ON public.site_page_sections
FOR ALL
TO authenticated
USING (public.is_active_staff('content_manager'))
WITH CHECK (public.is_active_staff('content_manager'));


-- ---------------------------------------------------------------------------
-- 11. SECTION TRANSLATION POLICIES
-- ---------------------------------------------------------------------------

CREATE POLICY "Public can view published section translations"
ON public.site_section_translations
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.site_page_sections AS s
        JOIN public.site_pages AS p ON p.id = s.page_id
        WHERE s.id = section_id
          AND s.is_visible = TRUE
          AND p.status = 'published'
          AND (p.publish_at IS NULL OR p.publish_at <= NOW())
          AND (p.unpublish_at IS NULL OR p.unpublish_at > NOW())
    )
);

CREATE POLICY "Content managers manage section translations"
ON public.site_section_translations
FOR ALL
TO authenticated
USING (public.is_active_staff('content_manager'))
WITH CHECK (public.is_active_staff('content_manager'));


-- ---------------------------------------------------------------------------
-- 12. VERSION HISTORY POLICIES
-- Versions are immutable: staff can read and add versions, but not
-- modify or delete historical snapshots through ordinary client access.
-- ---------------------------------------------------------------------------

CREATE POLICY "Content managers view page versions"
ON public.site_page_versions
FOR SELECT
TO authenticated
USING (public.is_active_staff('content_manager'));

CREATE POLICY "Content managers create page versions"
ON public.site_page_versions
FOR INSERT
TO authenticated
WITH CHECK (public.is_active_staff('content_manager'));


-- ---------------------------------------------------------------------------
-- 13. TABLE PRIVILEGES
-- RLS continues to control which rows each user can access.
-- ---------------------------------------------------------------------------

GRANT SELECT ON
    public.site_pages,
    public.site_page_translations,
    public.site_page_sections,
    public.site_section_translations
TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE ON
    public.site_pages,
    public.site_page_translations,
    public.site_page_sections,
    public.site_section_translations
TO authenticated;

GRANT SELECT, INSERT ON public.site_page_versions
TO authenticated;


-- ============================================================
-- UNIVERSAL CMS: REDIRECTS, PAGE PROTECTION & HIERARCHY
-- ============================================================

-- 1. PAGE REDIRECTS
-- Preserve old URLs when a page route changes.

CREATE TABLE IF NOT EXISTS public.site_page_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    old_path TEXT NOT NULL UNIQUE,
    new_path TEXT NOT NULL,

    redirect_type SMALLINT NOT NULL DEFAULT 301
        CHECK (redirect_type IN (301, 302)),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_by UUID REFERENCES auth.users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT site_page_redirects_old_path_format
        CHECK (
            old_path LIKE '/%'
            AND old_path NOT LIKE '%?%'
            AND old_path NOT LIKE '%#%'
        ),

    CONSTRAINT site_page_redirects_new_path_format
        CHECK (
            new_path LIKE '/%'
            AND new_path NOT LIKE '%?%'
            AND new_path NOT LIKE '%#%'
        ),

    CONSTRAINT site_page_redirects_no_self_redirect
        CHECK (old_path <> new_path)
);

CREATE INDEX IF NOT EXISTS idx_site_page_redirects_active
    ON public.site_page_redirects (is_active)
    WHERE is_active = TRUE;


-- 2. REDIRECT TABLE SECURITY

ALTER TABLE public.site_page_redirects
    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active redirects"
    ON public.site_page_redirects;

CREATE POLICY "Public can view active redirects"
    ON public.site_page_redirects
    FOR SELECT
    TO anon, authenticated
    USING (is_active = TRUE);

DROP POLICY IF EXISTS "Content managers manage redirects"
    ON public.site_page_redirects;

CREATE POLICY "Content managers manage redirects"
    ON public.site_page_redirects
    FOR ALL
    TO authenticated
    USING (
        public.is_active_staff(
            'content_manager'::public.app_role
        )
    )
    WITH CHECK (
        public.is_active_staff(
            'content_manager'::public.app_role
        )
    );

GRANT SELECT ON public.site_page_redirects
    TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE
    ON public.site_page_redirects
    TO authenticated;

-- Validate every active redirect to prevent redirect loops,
-- including redirects created or edited directly.

CREATE OR REPLACE FUNCTION public.validate_site_page_redirect()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
    creates_redirect_cycle BOOLEAN;
BEGIN
    IF NEW.is_active IS NOT TRUE THEN
        RETURN NEW;
    END IF;

    -- Serialize redirect graph changes to avoid concurrent cycles.
    PERFORM pg_advisory_xact_lock(193674839, 1);

    WITH RECURSIVE redirect_chain(path, visited, has_cycle) AS (
        SELECT
            NEW.new_path,
            ARRAY[NEW.new_path]::TEXT[],
            FALSE

        UNION ALL

        SELECT
            r.new_path,
            rc.visited || r.new_path,
            r.new_path = ANY(rc.visited)
        FROM redirect_chain AS rc
        INNER JOIN public.site_page_redirects AS r
            ON r.old_path = rc.path
        WHERE r.is_active = TRUE
          AND r.old_path <> NEW.old_path
          AND rc.has_cycle = FALSE
    )
    SELECT EXISTS (
        SELECT 1
        FROM redirect_chain
        WHERE path = NEW.old_path
           OR has_cycle = TRUE
    )
    INTO creates_redirect_cycle;

    IF creates_redirect_cycle THEN
        RAISE EXCEPTION
            'This redirect would create a redirect loop.';
    END IF;

    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_validate_site_page_redirect
    ON public.site_page_redirects;

CREATE TRIGGER trigger_validate_site_page_redirect_insert
    BEFORE INSERT
    ON public.site_page_redirects
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_site_page_redirect();

CREATE TRIGGER trigger_validate_site_page_redirect_update
    BEFORE UPDATE OF old_path, new_path, is_active
    ON public.site_page_redirects
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_site_page_redirect();

-- 3. AUTOMATIC REDIRECT WHEN A PAGE URL CHANGES
-- Remove a redirect if its old URL becomes a live page URL.
-- Create or update the redirect from the previous URL.

CREATE OR REPLACE FUNCTION public.handle_site_page_route_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
    creates_redirect_cycle BOOLEAN;
BEGIN
    -- Use the same lock as direct redirect changes.
    PERFORM pg_advisory_xact_lock(193674839, 1);
    IF OLD.route_path IS DISTINCT FROM NEW.route_path THEN

        DELETE FROM public.site_page_redirects
        WHERE old_path = NEW.route_path;

        WITH RECURSIVE redirect_chain(path, visited) AS (
            SELECT
                NEW.route_path,
                ARRAY[NEW.route_path]::TEXT[]

            UNION ALL

            SELECT
                r.new_path,
                rc.visited || r.new_path
            FROM redirect_chain AS rc
            JOIN public.site_page_redirects AS r
                ON r.old_path = rc.path
            WHERE r.is_active = TRUE
              AND NOT (r.new_path = ANY(rc.visited))
        )
        SELECT EXISTS (
            SELECT 1
            FROM redirect_chain
            WHERE path = OLD.route_path
        )
        INTO creates_redirect_cycle;

        IF creates_redirect_cycle THEN
            RAISE EXCEPTION
                'This URL change would create a redirect loop.';
        END IF;

        INSERT INTO public.site_page_redirects (
            old_path,
            new_path,
            redirect_type,
            is_active,
            created_by,
            updated_at
        )
        VALUES (
            OLD.route_path,
            NEW.route_path,
            301,
            TRUE,
            auth.uid(),
            NOW()
        )
        ON CONFLICT (old_path)
        DO UPDATE SET
            new_path = EXCLUDED.new_path,
            redirect_type = EXCLUDED.redirect_type,
            is_active = TRUE,
            created_by = EXCLUDED.created_by,
            updated_at = NOW();

    END IF;

    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_site_page_route_change
    ON public.site_pages;

CREATE TRIGGER trigger_site_page_route_change
    AFTER UPDATE OF route_path
    ON public.site_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_site_page_route_change();


-- 4. PROTECT SYSTEM PAGES
-- System pages cannot be deleted or archived.
-- A system page cannot be changed into a non-system page.

CREATE OR REPLACE FUNCTION public.protect_site_system_pages()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    IF TG_OP = 'DELETE' THEN

        IF OLD.is_system_page = TRUE THEN
            RAISE EXCEPTION
                'System pages cannot be permanently deleted. Archive or manage them through approved page settings.';
        END IF;

        RETURN OLD;
    END IF;

    IF OLD.is_system_page = TRUE THEN

        IF NEW.is_system_page = FALSE THEN
            RAISE EXCEPTION
                'A system page cannot lose its system-page protection.';
        END IF;

        IF NEW.status <> 'published' THEN
    RAISE EXCEPTION
        'System pages must remain published.';
END IF;

    END IF;

    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_protect_site_system_pages
    ON public.site_pages;

CREATE TRIGGER trigger_protect_site_system_pages
    BEFORE UPDATE OR DELETE
    ON public.site_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_site_system_pages();


-- 5. VALIDATE PAGE HIERARCHY
-- Prevent a page from becoming its own parent,
-- directly or indirectly.

CREATE OR REPLACE FUNCTION public.validate_site_page_hierarchy()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
    creates_hierarchy_cycle BOOLEAN;
BEGIN
    -- Serialize hierarchy changes to prevent concurrent circular assignments.
    PERFORM pg_advisory_xact_lock(193674839, 2);
    IF NEW.parent_page_id IS NULL THEN
        RETURN NEW;
    END IF;

    IF NEW.id = NEW.parent_page_id THEN
        RAISE EXCEPTION
            'A page cannot be its own parent.';
    END IF;

    WITH RECURSIVE ancestors(id, parent_page_id) AS (
        SELECT
            p.id,
            p.parent_page_id
        FROM public.site_pages AS p
        WHERE p.id = NEW.parent_page_id

        UNION

        SELECT
            p.id,
            p.parent_page_id
        FROM public.site_pages AS p
        INNER JOIN ancestors AS a
            ON p.id = a.parent_page_id
    )
    SELECT EXISTS (
        SELECT 1
        FROM ancestors
        WHERE id = NEW.id
    )
    INTO creates_hierarchy_cycle;

    IF creates_hierarchy_cycle THEN
        RAISE EXCEPTION
            'This parent assignment would create a circular page hierarchy.';
    END IF;

    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_validate_site_page_hierarchy
    ON public.site_pages;

DROP TRIGGER IF EXISTS trigger_validate_site_page_hierarchy_insert
    ON public.site_pages;

DROP TRIGGER IF EXISTS trigger_validate_site_page_hierarchy_update
    ON public.site_pages;


CREATE TRIGGER trigger_validate_site_page_hierarchy_insert
    BEFORE INSERT
    ON public.site_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_site_page_hierarchy();


CREATE TRIGGER trigger_validate_site_page_hierarchy_update
    BEFORE UPDATE OF parent_page_id
    ON public.site_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_site_page_hierarchy();


-- ============================================================
-- END: REDIRECTS, PAGE PROTECTION & HIERARCHY
-- ============================================================


-- ============================================================
-- UNIVERSAL CMS: VERSION HISTORY & RESTORATION
-- ============================================================

-- 1. CONTROLLED VERSION CREATION
-- Only active content managers can create snapshots.
-- Page row locking prevents concurrent version-number collisions.

CREATE OR REPLACE FUNCTION public.create_site_page_version(
    p_page_id UUID,
    p_change_summary TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_page public.site_pages%ROWTYPE;
    v_next_version INTEGER;
    v_snapshot JSONB;
    v_page_translations JSONB;
    v_sections JSONB;
    v_version_id UUID;
BEGIN
    IF NOT public.is_active_staff(
        'content_manager'::public.app_role
    ) THEN
        RAISE EXCEPTION 'Permission denied: active content manager required.'
            USING ERRCODE = '42501';
    END IF;

    SELECT p.*
    INTO v_page
    FROM public.site_pages AS p
    WHERE p.id = p_page_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Page not found.';
    END IF;

    SELECT COALESCE(MAX(v.version_number), 0) + 1
    INTO v_next_version
    FROM public.site_page_versions AS v
    WHERE v.page_id = p_page_id;

    SELECT COALESCE(
        jsonb_agg(to_jsonb(pt) ORDER BY pt.language),
        '[]'::JSONB
    )
    INTO v_page_translations
    FROM public.site_page_translations AS pt
    WHERE pt.page_id = p_page_id;

    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'section', to_jsonb(s),
                'translations',
                COALESCE(
                    (
                        SELECT jsonb_agg(
                            to_jsonb(st)
                            ORDER BY st.language
                        )
                        FROM public.site_section_translations AS st
                        WHERE st.section_id = s.id
                    ),
                    '[]'::JSONB
                )
            )
            ORDER BY s.display_order, s.created_at, s.id
        ),
        '[]'::JSONB
    )
    INTO v_sections
    FROM public.site_page_sections AS s
    WHERE s.page_id = p_page_id;

    v_snapshot := jsonb_build_object(
        'schema_version', 1,
        'page', to_jsonb(v_page),
        'page_translations', v_page_translations,
        'sections', v_sections
    );

    INSERT INTO public.site_page_versions (
        page_id,
        version_number,
        snapshot,
        change_summary,
        created_by
    )
    VALUES (
        p_page_id,
        v_next_version,
        v_snapshot,
        NULLIF(BTRIM(p_change_summary), ''),
        auth.uid()
    )
    RETURNING id INTO v_version_id;

    RETURN v_version_id;
END;
$function$;


-- 2. CONTROLLED PAGE RESTORATION
-- Saves the current state first, then restores the selected snapshot.
-- Existing section and translation IDs are preserved.

CREATE OR REPLACE FUNCTION public.restore_site_page_version(
    p_page_id UUID,
    p_version_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_page public.site_pages%ROWTYPE;
    v_version public.site_page_versions%ROWTYPE;

    v_page_snapshot JSONB;
    v_section_item JSONB;
    v_section JSONB;
    v_translation JSONB;

    v_backup_version_id UUID;
BEGIN
    IF NOT public.is_active_staff(
        'content_manager'::public.app_role
    ) THEN
        RAISE EXCEPTION 'Permission denied: active content manager required.'
            USING ERRCODE = '42501';
    END IF;

    -- Lock the page to serialize concurrent changes and restores.
    SELECT p.*
    INTO v_page
    FROM public.site_pages AS p
    WHERE p.id = p_page_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Page not found.';
    END IF;

    -- Lock and verify the requested historical version.
    SELECT v.*
    INTO v_version
    FROM public.site_page_versions AS v
    WHERE v.id = p_version_id
      AND v.page_id = p_page_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'The requested version does not exist for this page.';
    END IF;

    v_page_snapshot := v_version.snapshot;

    -- Validate the snapshot structure before changing anything.
    IF jsonb_typeof(v_page_snapshot->'page')
        IS DISTINCT FROM 'object'
       OR jsonb_typeof(v_page_snapshot->'page_translations')
        IS DISTINCT FROM 'array'
       OR jsonb_typeof(v_page_snapshot->'sections')
        IS DISTINCT FROM 'array'
    THEN
        RAISE EXCEPTION 'The selected version has an invalid snapshot structure.';
    END IF;

   IF (v_page_snapshot->>'schema_version')::INTEGER
    IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'Unsupported page snapshot version.';
END IF;

    IF (v_page_snapshot->'page'->>'id')::UUID
    IS DISTINCT FROM p_page_id THEN
    RAISE EXCEPTION 'The snapshot page ID does not match the requested page.';
END IF;

    -- Preserve the current state before restoration.
    v_backup_version_id :=
        public.create_site_page_version(
            p_page_id,
            'Automatic backup before restoring version '
                || v_version.version_number::TEXT
        );

    -- Restore the page's editable fields.
    UPDATE public.site_pages
    SET
        parent_page_id =
            (v_page_snapshot->'page'->>'parent_page_id')::UUID,

        title = v_page_snapshot->'page'->>'title',
        slug = v_page_snapshot->'page'->>'slug',
        route_path = v_page_snapshot->'page'->>'route_path',
        page_type = v_page_snapshot->'page'->>'page_type',
        status = v_page_snapshot->'page'->>'status',

        is_system_page =
            (v_page_snapshot->'page'->>'is_system_page')::BOOLEAN,

        show_in_header =
            (v_page_snapshot->'page'->>'show_in_header')::BOOLEAN,

        show_in_footer =
            (v_page_snapshot->'page'->>'show_in_footer')::BOOLEAN,

        show_in_mobile =
            (v_page_snapshot->'page'->>'show_in_mobile')::BOOLEAN,

        open_in_new_tab =
            (v_page_snapshot->'page'->>'open_in_new_tab')::BOOLEAN,

        display_order =
            (v_page_snapshot->'page'->>'display_order')::INTEGER,

        seo_title = v_page_snapshot->'page'->>'seo_title',
        seo_description = v_page_snapshot->'page'->>'seo_description',
        canonical_url = v_page_snapshot->'page'->>'canonical_url',
        og_image_url = v_page_snapshot->'page'->>'og_image_url',

        publish_at =
            (v_page_snapshot->'page'->>'publish_at')::TIMESTAMPTZ,

        unpublish_at =
            (v_page_snapshot->'page'->>'unpublish_at')::TIMESTAMPTZ,

        updated_by = auth.uid(),
        updated_at = NOW()
    WHERE id = p_page_id;

    -- Replace existing page translations.
    DELETE FROM public.site_page_translations
    WHERE page_id = p_page_id;

    FOR v_translation IN
        SELECT value
        FROM jsonb_array_elements(
            v_page_snapshot->'page_translations'
        ) AS items(value)
    LOOP
        INSERT INTO public.site_page_translations (
            id,
            page_id,
            language,
            title,
            seo_title,
            seo_description,
            og_title,
            og_description,
            is_reviewed,
            created_at,
            updated_at
        )
        VALUES (
            (v_translation->>'id')::UUID,
            p_page_id,
            v_translation->>'language',
            v_translation->>'title',
            v_translation->>'seo_title',
            v_translation->>'seo_description',
            v_translation->>'og_title',
            v_translation->>'og_description',
            COALESCE(
                (v_translation->>'is_reviewed')::BOOLEAN,
                FALSE
            ),
            COALESCE(
                (v_translation->>'created_at')::TIMESTAMPTZ,
                NOW()
            ),
            NOW()
        );
    END LOOP;

    -- Replace existing sections.
    -- Their translations are removed by the existing ON DELETE CASCADE.
    DELETE FROM public.site_page_sections
    WHERE page_id = p_page_id;

    FOR v_section_item IN
        SELECT value
        FROM jsonb_array_elements(
            v_page_snapshot->'sections'
        ) AS items(value)
    LOOP
        v_section := v_section_item->'section';

        IF jsonb_typeof(v_section) IS DISTINCT FROM 'object'
           OR jsonb_typeof(v_section_item->'translations')
                IS DISTINCT FROM 'array'
        THEN
            RAISE EXCEPTION 'A section in this snapshot is invalid.';
        END IF;

        INSERT INTO public.site_page_sections (
            id,
            page_id,
            section_type,
            internal_name,
            content,
            settings,
            display_order,
            is_visible,
            show_on_desktop,
            show_on_mobile,
            created_by,
            updated_by,
            created_at,
            updated_at
        )
        VALUES (
            (v_section->>'id')::UUID,
            p_page_id,
            v_section->>'section_type',
            v_section->>'internal_name',
            COALESCE(v_section->'content', '{}'::JSONB),
            COALESCE(v_section->'settings', '{}'::JSONB),
            COALESCE(
                (v_section->>'display_order')::INTEGER,
                0
            ),
            COALESCE(
                (v_section->>'is_visible')::BOOLEAN,
                TRUE
            ),
            COALESCE(
                (v_section->>'show_on_desktop')::BOOLEAN,
                TRUE
            ),
            COALESCE(
                (v_section->>'show_on_mobile')::BOOLEAN,
                TRUE
            ),
            (v_section->>'created_by')::UUID,
            auth.uid(),
            COALESCE(
                (v_section->>'created_at')::TIMESTAMPTZ,
                NOW()
            ),
            NOW()
        );

        -- Restore each section's translations.
        FOR v_translation IN
            SELECT value
            FROM jsonb_array_elements(
                v_section_item->'translations'
            ) AS items(value)
        LOOP
            INSERT INTO public.site_section_translations (
                id,
                section_id,
                language,
                title,
                subtitle,
                body,
                button_label,
                translated_content,
                is_reviewed,
                created_at,
                updated_at
            )
            VALUES (
                (v_translation->>'id')::UUID,
                (v_section->>'id')::UUID,
                v_translation->>'language',
                v_translation->>'title',
                v_translation->>'subtitle',
                v_translation->>'body',
                v_translation->>'button_label',
                COALESCE(
                    v_translation->'translated_content',
                    '{}'::JSONB
                ),
                COALESCE(
                    (v_translation->>'is_reviewed')::BOOLEAN,
                    FALSE
                ),
                COALESCE(
                    (v_translation->>'created_at')::TIMESTAMPTZ,
                    NOW()
                ),
                NOW()
            );
        END LOOP;
    END LOOP;

    RETURN v_backup_version_id;
END;
$function$;


-- 3. VERSION TABLE ACCESS CONTROL
-- Users may read versions only through the existing RLS policy.
-- Direct client-side insertion, modification and deletion are disabled.
-- Snapshot creation and restoration happen through the functions above.

REVOKE ALL ON TABLE public.site_page_versions
    FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE public.site_page_versions
    TO authenticated;

REVOKE ALL ON FUNCTION public.create_site_page_version(UUID, TEXT)
    FROM PUBLIC, anon;

REVOKE ALL ON FUNCTION public.restore_site_page_version(UUID, UUID)
    FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.create_site_page_version(UUID, TEXT)
    TO authenticated;

GRANT EXECUTE ON FUNCTION public.restore_site_page_version(UUID, UUID)
    TO authenticated;


-- ============================================================
-- END: VERSION HISTORY & RESTORATION
-- ============================================================

-- ============================================================
-- AUTOMATIC UPDATED_AT TIMESTAMP MANAGEMENT
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$function$;


-- Site pages
DROP TRIGGER IF EXISTS trigger_site_pages_updated_at
    ON public.site_pages;

CREATE TRIGGER trigger_site_pages_updated_at
    BEFORE UPDATE ON public.site_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();


-- Page translations
DROP TRIGGER IF EXISTS trigger_site_page_translations_updated_at
    ON public.site_page_translations;

CREATE TRIGGER trigger_site_page_translations_updated_at
    BEFORE UPDATE ON public.site_page_translations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();


-- Page sections
DROP TRIGGER IF EXISTS trigger_site_page_sections_updated_at
    ON public.site_page_sections;

CREATE TRIGGER trigger_site_page_sections_updated_at
    BEFORE UPDATE ON public.site_page_sections
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();


-- Section translations
DROP TRIGGER IF EXISTS trigger_site_section_translations_updated_at
    ON public.site_section_translations;

CREATE TRIGGER trigger_site_section_translations_updated_at
    BEFORE UPDATE ON public.site_section_translations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();


-- Page redirects
DROP TRIGGER IF EXISTS trigger_site_page_redirects_updated_at
    ON public.site_page_redirects;

CREATE TRIGGER trigger_site_page_redirects_updated_at
    BEFORE UPDATE ON public.site_page_redirects
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- END: AUTOMATIC UPDATED_AT TIMESTAMP MANAGEMENT
-- ============================================================

COMMIT;