-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 011: Guest RSVP Submission RPC & Policy
-- Created: 2026-08-17
-- Depends on: Migration 004 (invitations), Migration 006 (rsvps)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Allows anonymous and authenticated guests to securely submit RSVP responses
--   for published, non-expired invitations before the RSVP deadline.
--
-- SECURITY & PRIVACY GUARANTEES:
--   1. Direct anonymous SELECT, UPDATE, and DELETE on rsvps remain BLOCKED.
--   2. Submissions are only accepted for invitations where status = 'published'
--      and not expired and rsvp_enabled = true.
--   3. Submissions enforce max_pax and rsvp_deadline constraints server-side.
--   4. Guest messages are discarded/disallowed if allow_guest_message = false.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Secure RPC Function for Guest RSVP Submission ──────────────────────────
CREATE OR REPLACE FUNCTION public.submit_rsvp(
  p_invitation_id UUID,
  p_guest_name    TEXT,
  p_attendance    TEXT,
  p_pax           INTEGER,
  p_message       TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation     RECORD;
  v_rsvp_id        UUID;
  v_actual_pax     INTEGER;
  v_actual_message TEXT;
  v_cleaned_name   TEXT;
BEGIN
  -- Clean and validate guest name
  v_cleaned_name := TRIM(p_guest_name);
  IF v_cleaned_name IS NULL OR LENGTH(v_cleaned_name) < 2 OR LENGTH(v_cleaned_name) > 150 THEN
    RAISE EXCEPTION 'Nama tetamu mestilah antara 2 hingga 150 aksara.';
  END IF;

  -- 1. Fetch invitation metadata
  SELECT id, status, rsvp_enabled, rsvp_deadline, max_pax, allow_guest_message, expires_at
  INTO v_invitation
  FROM public.invitations
  WHERE id = p_invitation_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Jemputan tidak dijumpai.';
  END IF;

  -- 2. Verify publication lifecycle
  IF v_invitation.status != 'published' THEN
    RAISE EXCEPTION 'Jemputan ini belum diterbitkan.';
  END IF;

  IF v_invitation.expires_at IS NOT NULL AND v_invitation.expires_at <= now() THEN
    RAISE EXCEPTION 'Jemputan ini telah tamat tempoh.';
  END IF;

  -- 3. Verify RSVP is enabled
  IF NOT v_invitation.rsvp_enabled THEN
    RAISE EXCEPTION 'Borang RSVP telah dinyahaktifkan untuk majlis ini.';
  END IF;

  -- 4. Verify RSVP deadline
  IF v_invitation.rsvp_deadline IS NOT NULL AND CURRENT_DATE > v_invitation.rsvp_deadline THEN
    RAISE EXCEPTION 'Tarikh akhir RSVP telah tamat.';
  END IF;

  -- 5. Verify attendance and pax
  IF p_attendance NOT IN ('attending', 'not_attending') THEN
    RAISE EXCEPTION 'Pilihan kehadiran tidak sah.';
  END IF;

  IF p_attendance = 'not_attending' THEN
    v_actual_pax := 0;
  ELSE
    IF p_pax < 1 OR p_pax > v_invitation.max_pax THEN
      RAISE EXCEPTION 'Jumlah pax mestilah antara 1 hingga %.', v_invitation.max_pax;
    END IF;
    v_actual_pax := p_pax;
  END IF;

  -- 6. Verify guest message permissions
  IF v_invitation.allow_guest_message THEN
    v_actual_message := NULLIF(TRIM(p_message), '');
    IF v_actual_message IS NOT NULL AND LENGTH(v_actual_message) > 500 THEN
      RAISE EXCEPTION 'Ucapan tetamu tidak boleh melebihi 500 aksara.';
    END IF;
  ELSE
    v_actual_message := NULL;
  END IF;

  -- 7. Insert RSVP record
  INSERT INTO public.rsvps (
    invitation_id,
    guest_name,
    attendance,
    pax,
    message
  )
  VALUES (
    p_invitation_id,
    v_cleaned_name,
    p_attendance,
    v_actual_pax,
    v_actual_message
  )
  RETURNING id INTO v_rsvp_id;

  RETURN v_rsvp_id;
END;
$$;

-- Grant execution to anon and authenticated callers
GRANT EXECUTE ON FUNCTION public.submit_rsvp(UUID, TEXT, TEXT, INTEGER, TEXT) TO anon, authenticated;

-- ── 2. Additive INSERT Policy for direct guest submissions ────────────────────
CREATE POLICY "rsvps: public can insert rsvp to active published invitation"
  ON public.rsvps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = rsvps.invitation_id
        AND invitations.status = 'published'
        AND invitations.rsvp_enabled = true
        AND (invitations.expires_at IS NULL OR invitations.expires_at > now())
        AND (invitations.rsvp_deadline IS NULL OR invitations.rsvp_deadline >= CURRENT_DATE)
        AND (
          (rsvps.attendance = 'not_attending' AND rsvps.pax = 0) OR
          (rsvps.attendance = 'attending' AND rsvps.pax >= 1 AND rsvps.pax <= invitations.max_pax)
        )
    )
  );
