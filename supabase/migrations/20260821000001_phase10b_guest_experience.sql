-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 016: Phase 10B Guest Experience Features
-- Created: 2026-08-21
-- Depends on: Migration 004 (invitations), Migration 005 (gallery), Migration 006 (rsvps)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   1. Add columns to invitations for Live Countdown, Guest Wishes & YouTube Music.
--   2. Add show_on_invitation flag to rsvps for guest message moderation.
--   3. Create storage bucket 'invitation-gallery' with owner-isolated RLS.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Update invitations table columns ───────────────────────────────────────

DO $$
BEGIN
  -- Countdown toggle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'countdown_enabled'
  ) THEN
    ALTER TABLE public.invitations ADD COLUMN countdown_enabled BOOLEAN NOT NULL DEFAULT false;
  END IF;

  -- Guest wishes toggle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'guest_wishes_enabled'
  ) THEN
    ALTER TABLE public.invitations ADD COLUMN guest_wishes_enabled BOOLEAN NOT NULL DEFAULT false;
  END IF;

  -- Music enabled toggle (ensure exists)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'music_enabled'
  ) THEN
    ALTER TABLE public.invitations ADD COLUMN music_enabled BOOLEAN NOT NULL DEFAULT false;
  END IF;

  -- YouTube video ID for background music
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'music_youtube_video_id'
  ) THEN
    ALTER TABLE public.invitations ADD COLUMN music_youtube_video_id TEXT;
  END IF;

  -- YouTube music loop setting
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'music_loop'
  ) THEN
    ALTER TABLE public.invitations ADD COLUMN music_loop BOOLEAN NOT NULL DEFAULT false;
  END IF;
END;
$$;

-- ── 2. Update rsvps table for guest wish moderation ───────────────────────────

DO $$
BEGIN
  -- show_on_invitation flag: strictly default false (private until owner approves)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'rsvps' AND column_name = 'show_on_invitation'
  ) THEN
    ALTER TABLE public.rsvps ADD COLUMN show_on_invitation BOOLEAN NOT NULL DEFAULT false;
  END IF;
END;
$$;

-- Index for querying public guest wishes
CREATE INDEX IF NOT EXISTS idx_rsvps_public_wishes
  ON public.rsvps (invitation_id, created_at DESC)
  WHERE show_on_invitation = true;

-- ── 3. Public SELECT policy for approved guest wishes ─────────────────────────
-- Enables unauthenticated guests to read ONLY approved messages from published invitations.
DROP POLICY IF EXISTS "rsvps: public can view approved wishes" ON public.rsvps;
CREATE POLICY "rsvps: public can view approved wishes"
  ON public.rsvps
  FOR SELECT
  TO anon, authenticated
  USING (
    show_on_invitation = true
    AND message IS NOT NULL
    AND message <> ''
    AND EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = rsvps.invitation_id
        AND invitations.status = 'published'
        AND invitations.slug IS NOT NULL
        AND (invitations.expires_at IS NULL OR invitations.expires_at > now())
        AND invitations.guest_wishes_enabled = true
    )
  );

-- Owner UPDATE policy for RSVPs (e.g. toggling show_on_invitation)
DROP POLICY IF EXISTS "rsvps: owner can update own invitation rsvps" ON public.rsvps;
CREATE POLICY "rsvps: owner can update own invitation rsvps"
  ON public.rsvps
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = rsvps.invitation_id
        AND invitations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = rsvps.invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- ── 4. Storage Bucket: invitation-gallery ─────────────────────────────────────
-- Public bucket for wedding photo gallery uploads. Max 5MB, JPG/PNG/WebP only.
-- Path convention: {user_id}/{invitation_id}/{filename}

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'invitation-gallery',
      'invitation-gallery',
      true,
      5242880, -- 5 MB
      ARRAY['image/jpeg', 'image/png', 'image/webp']
    )
    ON CONFLICT (id) DO UPDATE SET
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

    -- Storage RLS policies
    DROP POLICY IF EXISTS "invitation-gallery: public can view" ON storage.objects;
    CREATE POLICY "invitation-gallery: public can view"
      ON storage.objects
      FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'invitation-gallery');

    -- Authenticated owner INSERT: path must start with user's auth.uid()
    DROP POLICY IF EXISTS "invitation-gallery: owner can insert" ON storage.objects;
    CREATE POLICY "invitation-gallery: owner can insert"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'invitation-gallery'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );

    -- Authenticated owner UPDATE
    DROP POLICY IF EXISTS "invitation-gallery: owner can update" ON storage.objects;
    CREATE POLICY "invitation-gallery: owner can update"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'invitation-gallery'
        AND auth.uid()::text = (storage.foldername(name))[1]
      )
      WITH CHECK (
        bucket_id = 'invitation-gallery'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );

    -- Authenticated owner DELETE
    DROP POLICY IF EXISTS "invitation-gallery: owner can delete" ON storage.objects;
    CREATE POLICY "invitation-gallery: owner can delete"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'invitation-gallery'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END;
$$;
