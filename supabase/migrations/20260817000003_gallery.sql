-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 005: Invitation Gallery
-- Created: 2026-08-17
-- Depends on: Migration 004 (invitations)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Stores gallery photo references (Supabase Storage paths) for an invitation.
--   Ownership is inherited from the parent invitation.
--   Storage bucket: 'invitation-gallery' (public or signed URLs — configured separately).
--
-- PATH CONVENTION:
--   {user_id}/{invitation_id}/{filename}
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Gallery table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invitation_gallery (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID        NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  storage_path  TEXT        NOT NULL,
  sort_order    INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_gallery_invitation_id ON public.invitation_gallery (invitation_id);
CREATE INDEX IF NOT EXISTS idx_gallery_sort_order    ON public.invitation_gallery (invitation_id, sort_order ASC);

-- ── 3. Enable RLS ─────────────────────────────────────────────────────────────
ALTER TABLE public.invitation_gallery ENABLE ROW LEVEL SECURITY;

-- ── 4. RLS Policies ───────────────────────────────────────────────────────────
-- Ownership is established via the parent invitation.
-- All policies use EXISTS to verify the caller owns the parent invitation.

-- SELECT: read own gallery
CREATE POLICY "gallery: authenticated users read own"
  ON public.invitation_gallery
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = invitation_gallery.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- INSERT: add photo to own invitation
CREATE POLICY "gallery: authenticated users insert own"
  ON public.invitation_gallery
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = invitation_gallery.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- UPDATE: reorder own gallery (sort_order)
CREATE POLICY "gallery: authenticated users update own"
  ON public.invitation_gallery
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = invitation_gallery.invitation_id
        AND invitations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = invitation_gallery.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- DELETE: remove own gallery photo
CREATE POLICY "gallery: authenticated users delete own"
  ON public.invitation_gallery
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = invitation_gallery.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- Anonymous access: closed in Phase 3.
-- Phase 6 will add public read for published invitation galleries.

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage Bucket Note:
--   Bucket: 'invitation-gallery'
--   Configure in Supabase Dashboard → Storage → Buckets
--   Recommended: private bucket with signed URLs for Phase 3
--   Future: public bucket or signed URL generation on read
-- ─────────────────────────────────────────────────────────────────────────────
