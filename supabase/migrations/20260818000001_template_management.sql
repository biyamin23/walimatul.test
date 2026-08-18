-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 015: Template Management & Hybrid Design System
-- Created: 2026-08-18
-- Depends on: Migration 003 (templates), Migration 014 (is_admin helper)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   1. Support Admin Template Management (CRUD, status lifecycle, design config).
--   2. Allow multiple Hybrid templates to share a component_key (e.g. 'hybrid-editorial').
--   3. Add status ('draft', 'active', 'archived'), design_config (jsonb), and updated_by.
--   4. RLS policies:
--      - Public/Clients can view 'active' templates (catalogue) + templates they own invitations for.
--      - Admins have full SELECT, INSERT, UPDATE, DELETE access.
--   5. Storage bucket 'template-assets' for public design assets with Admin-only write.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Update templates table columns ─────────────────────────────────────────

-- Allow multiple templates to share component_key (e.g. 'hybrid-editorial')
ALTER TABLE public.templates DROP CONSTRAINT IF EXISTS templates_component_key_key;

-- Add status lifecycle column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'templates' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.templates ADD COLUMN status TEXT NOT NULL DEFAULT 'active'
      CHECK (status IN ('draft', 'active', 'archived'));
  END IF;
END;
$$;

-- Add design_config JSONB column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'templates' AND column_name = 'design_config'
  ) THEN
    ALTER TABLE public.templates ADD COLUMN design_config JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;
END;
$$;

-- Add updated_by audit column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'templates' AND column_name = 'updated_by'
  ) THEN
    ALTER TABLE public.templates ADD COLUMN updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END;
$$;

-- Ensure existing templates have valid status
UPDATE public.templates
SET status = CASE WHEN is_active THEN 'active' ELSE 'draft' END
WHERE status IS NULL OR status = '';

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_templates_status ON public.templates (status);

-- ── 2. Additive RLS Policies on templates ────────────────────────────────────

-- Drop existing public read policy if present to replace with comprehensive one
DROP POLICY IF EXISTS "templates: public can view active" ON public.templates;
DROP POLICY IF EXISTS "templates: admin full access" ON public.templates;
DROP POLICY IF EXISTS "templates: admin can insert" ON public.templates;
DROP POLICY IF EXISTS "templates: admin can update" ON public.templates;
DROP POLICY IF EXISTS "templates: admin can delete" ON public.templates;

-- Public / Anonymous / Client SELECT policy:
-- 1. Anyone can view active templates (for /templates catalogue and preview).
-- 2. Authenticated users can also view templates referenced by their own invitations.
-- 3. Admins can view ALL templates (draft, active, archived).
CREATE POLICY "templates: view policy"
  ON public.templates
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'active'
    OR is_active = true
    OR public.is_admin()
    OR (
      auth.uid() IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.invitations
        WHERE invitations.template_id = templates.id
          AND invitations.user_id = auth.uid()
      )
    )
  );

-- Admin INSERT
CREATE POLICY "templates: admin can insert"
  ON public.templates
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Admin UPDATE
CREATE POLICY "templates: admin can update"
  ON public.templates
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin DELETE (safe deletion check is enforced in server action before DELETE)
CREATE POLICY "templates: admin can delete"
  ON public.templates
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ── 3. Storage Bucket 'template-assets' Policies ──────────────────────────────
-- Public read for template design assets (backgrounds, ornaments, overlays, thumbnails)
-- Admin-only write/update/delete.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects'
  ) THEN
    -- Ensure bucket exists in storage.buckets if table exists
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'template-assets',
      'template-assets',
      true,
      5242880, -- 5 MB
      ARRAY['image/jpeg', 'image/png', 'image/webp']
    )
    ON CONFLICT (id) DO UPDATE SET
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

    -- Storage policies
    DROP POLICY IF EXISTS "template-assets: public can view" ON storage.objects;
    CREATE POLICY "template-assets: public can view"
      ON storage.objects
      FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'template-assets');

    DROP POLICY IF EXISTS "template-assets: admin can insert" ON storage.objects;
    CREATE POLICY "template-assets: admin can insert"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'template-assets'
        AND public.is_admin()
      );

    DROP POLICY IF EXISTS "template-assets: admin can update" ON storage.objects;
    CREATE POLICY "template-assets: admin can update"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'template-assets'
        AND public.is_admin()
      )
      WITH CHECK (
        bucket_id = 'template-assets'
        AND public.is_admin()
      );

    DROP POLICY IF EXISTS "template-assets: admin can delete" ON storage.objects;
    CREATE POLICY "template-assets: admin can delete"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'template-assets'
        AND public.is_admin()
      );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- In environments where storage.objects RLS is managed via dashboard
    NULL;
END;
$$;
