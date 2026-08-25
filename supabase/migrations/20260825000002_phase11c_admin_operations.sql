-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 018: Phase 11C Admin Operations (Settings, Announcements, Audit Logs)
-- Created: 2026-08-25
-- Depends on: Migration 001 (profiles), Migration 014 (admin read access)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   1. Create public.platform_settings table for operational configurations.
--   2. Create public.announcements table for client dashboard notices.
--   3. Create public.admin_audit_logs table for append-only audit trail.
--   4. Establish strict RLS policies (admin-only for audit and settings, scheduled read for announcements).
--   5. Seed initial platform settings defaults with ON CONFLICT DO NOTHING.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Platform Settings Table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key         TEXT        PRIMARY KEY,
  value       JSONB       NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  UUID        REFERENCES public.profiles(id)
);

CREATE TRIGGER on_platform_settings_updated
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Admin policies for platform_settings
DROP POLICY IF EXISTS "platform_settings: admin can view all" ON public.platform_settings;
CREATE POLICY "platform_settings: admin can view all"
  ON public.platform_settings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "platform_settings: admin can insert" ON public.platform_settings;
CREATE POLICY "platform_settings: admin can insert"
  ON public.platform_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "platform_settings: admin can update" ON public.platform_settings;
CREATE POLICY "platform_settings: admin can update"
  ON public.platform_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 1b. Constrained Runtime Platform Settings RPC ────────────────────────────
-- Allows clients and public runtime callers to fetch ONLY client-safe operational settings.
-- SECURITY DEFINER ensures access without exposing raw platform_settings table to non-admins.
CREATE OR REPLACE FUNCTION public.get_runtime_platform_settings()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings JSONB;
BEGIN
  SELECT jsonb_object_agg(key, value)
  INTO v_settings
  FROM public.platform_settings
  WHERE key IN (
    'support_whatsapp',
    'default_invitation_validity_months',
    'max_gallery_photos',
    'manual_payment_instructions',
    'maintenance_notice'
  );

  RETURN COALESCE(v_settings, '{}'::jsonb);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_runtime_platform_settings() TO authenticated, anon;

-- ── 2. Announcements Table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  audience    TEXT        NOT NULL DEFAULT 'clients' CHECK (audience IN ('clients')),
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  created_by  UUID        REFERENCES public.profiles(id),
  updated_by  UUID        REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER on_announcements_updated
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_announcements_status_schedule
  ON public.announcements (status, starts_at, ends_at);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Admin full management on announcements
DROP POLICY IF EXISTS "announcements: admin can view all" ON public.announcements;
CREATE POLICY "announcements: admin can view all"
  ON public.announcements
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "announcements: admin can insert" ON public.announcements;
CREATE POLICY "announcements: admin can insert"
  ON public.announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "announcements: admin can update" ON public.announcements;
CREATE POLICY "announcements: admin can update"
  ON public.announcements
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Client read policy: only active announcements within current schedule
DROP POLICY IF EXISTS "announcements: clients can view active scheduled" ON public.announcements;
CREATE POLICY "announcements: clients can view active scheduled"
  ON public.announcements
  FOR SELECT
  TO authenticated
  USING (
    status = 'active'
    AND audience = 'clients'
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at > now())
  );

-- ── 3. Admin Audit Logs Table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID        NOT NULL REFERENCES public.profiles(id),
  action      TEXT        NOT NULL,
  entity_type TEXT        NOT NULL,
  entity_id   TEXT,
  before_data JSONB,
  after_data  JSONB,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at
  ON public.admin_audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_entity
  ON public.admin_audit_logs (entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action
  ON public.admin_audit_logs (action);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin SELECT and INSERT only (append-only: NO update or delete policies)
DROP POLICY IF EXISTS "admin_audit_logs: admin can view all" ON public.admin_audit_logs;
CREATE POLICY "admin_audit_logs: admin can view all"
  ON public.admin_audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_audit_logs: admin can insert" ON public.admin_audit_logs;
CREATE POLICY "admin_audit_logs: admin can insert"
  ON public.admin_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ── 4. Seed Initial Platform Settings ────────────────────────────────────────
INSERT INTO public.platform_settings (key, value, description)
VALUES
  (
    'support_whatsapp',
    '{"phone": "60148412018", "display": "+60148412018"}'::jsonb,
    'Nombor WhatsApp sokongan rasmi WALIMATUL untuk bantuan pelanggan.'
  ),
  (
    'default_invitation_validity_months',
    '6'::jsonb,
    'Tempoh sah jemputan lalai (dalam bulan) untuk pakej baharu.'
  ),
  (
    'max_gallery_photos',
    '12'::jsonb,
    'Had maksimum bilangan gambar galeri yang boleh dimuat naik bagi setiap jemputan.'
  ),
  (
    'manual_payment_instructions',
    '{"text": "Scan kod QR Touch ’n Go eWallet dan muat naik tangkap layar resit pembayaran anda untuk semakan dan pengaktifan jemputan."}'::jsonb,
    'Arahan pembayaran manual yang dipaparkan kepada klien di halaman pembayaran.'
  ),
  (
    'maintenance_notice',
    '{"enabled": false, "text": ""}'::jsonb,
    'Notis penyelenggaraan berjadual yang boleh diaktifkan jika terdapat kerja penyelenggaraan sistem.'
  )
ON CONFLICT (key) DO NOTHING;
