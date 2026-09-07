-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration: Seed Rose Chateau Template
-- Created: 2026-09-07
-- Depends on: Migration 003 (templates)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Seeds the premium template: Rose Chateau (RM49, 6 months validity).
--
-- RULES:
--   Idempotent insert/upsert on slug = 'rose-chateau'.
--   Links to templates/registry.ts via component_key = 'rose-chateau'.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.templates (
  name,
  slug,
  description,
  category,
  component_key,
  price,
  validity_months,
  is_active,
  is_featured,
  sort_order
) VALUES (
  'Rose Chateau',
  'rose-chateau',
  'A luxurious romantic floral wedding invitation featuring deep burgundy, soft blush stationery, antique gold accents, and an embossed wax-seal opening.',
  'Floral',
  'rose-chateau',
  49.00,
  6,
  true,
  true,
  2
)
-- On conflict (rerun), update structural metadata only.
-- Do NOT overwrite Admin-managed commercial values (price, validity_months, is_active, is_featured).
ON CONFLICT (slug) DO UPDATE
  SET
    name            = EXCLUDED.name,
    description     = EXCLUDED.description,
    category        = EXCLUDED.category,
    component_key   = EXCLUDED.component_key,
    sort_order      = EXCLUDED.sort_order,
    updated_at      = now();
