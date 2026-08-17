-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 003: Templates
-- Created: 2026-08-17
-- Depends on: Migration 001 (profiles) for handle_updated_at()
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Templates store product metadata only.
--   The actual invitation design is a coded React component.
--   DB ↔ Code link: component_key (e.g. 'blush-garden')
--
-- ARCHITECTURE:
--   templates.component_key → templates/registry.ts → React component
--
-- RLS STRATEGY:
--   Anyone (anon + authenticated) can SELECT active templates (product catalogue).
--   Only postgres/service role can INSERT/UPDATE/DELETE templates.
--   Clients cannot modify templates, activate them, or change prices.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Ensure set_updated_at function exists (idempotent, created in Migration 001) ─
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── 1. Templates table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.templates (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT          NOT NULL,
  slug            TEXT          NOT NULL UNIQUE,
  description     TEXT,
  category        TEXT,
  component_key   TEXT          NOT NULL UNIQUE,
  thumbnail_url   TEXT,
  preview_url     TEXT,
  price           NUMERIC(10,2) NOT NULL DEFAULT 0     CHECK (price >= 0),
  validity_months INTEGER       NOT NULL DEFAULT 6     CHECK (validity_months > 0),
  is_active       BOOLEAN       NOT NULL DEFAULT true,
  is_featured     BOOLEAN       NOT NULL DEFAULT false,
  sort_order      INTEGER       NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TRIGGER on_templates_updated
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ── 2. Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_templates_slug      ON public.templates (slug);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON public.templates (is_active);
CREATE INDEX IF NOT EXISTS idx_templates_sort_order ON public.templates (sort_order ASC);

-- ── 3. Enable RLS ─────────────────────────────────────────────────────────────
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- ── 4. RLS Policies ───────────────────────────────────────────────────────────

-- Anyone (anonymous + authenticated) may SELECT active templates.
-- This is the product catalogue — it must be publicly browsable.
CREATE POLICY "templates: public read active"
  ON public.templates
  FOR SELECT
  USING (is_active = true);

-- Clients (authenticated) cannot INSERT/UPDATE/DELETE templates.
-- Only database admin via SQL Editor or service role may manage templates.
-- No INSERT/UPDATE/DELETE policies are created for authenticated or anon roles.
-- Note: postgres superuser bypasses RLS by default.

-- ── 5. Financial Column Protection ────────────────────────────────────────────
-- Prevent authenticated users from modifying template pricing directly.
-- Templates are read-only for all authenticated connections.
-- Since no UPDATE policy exists for authenticated role, this is already enforced.
-- Document explicitly: template prices are source of truth for display only.
-- Order snapshot (orders.amount) captures the price at time of purchase.

-- ─────────────────────────────────────────────────────────────────────────────
-- NOTE: Template deactivation
--   Never hard-delete templates that have existing invitations/orders.
--   Use: UPDATE templates SET is_active = false WHERE slug = '...';
--   Existing invitations will continue to render from their template_id FK.
--   Only templates with is_active = true appear in the product catalogue.
-- ─────────────────────────────────────────────────────────────────────────────
