-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration: Seed Toile Royale Template
-- Created: 2026-10-04
-- Depends on: Migration 003 (templates)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Seeds the premium template: Toile Royale (RM49, 6 months validity).
--
-- RULES:
--   Idempotent insert/upsert on slug = 'toile-royale'.
--   Links to templates/registry.ts via component_key = 'toile-royale'.
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
  'Toile Royale',
  'toile-royale',
  'A vintage French Toile de Jouy wedding invitation featuring engraved burgundy botanicals, antique parchment, a Rococo cartouche frame, and double-sided ceremony stationery.',
  'Classic',
  'toile-royale',
  49.00,
  6,
  true,
  true,
  3
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
