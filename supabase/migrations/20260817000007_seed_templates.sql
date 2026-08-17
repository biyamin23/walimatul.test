-- ─────────────────────────────────────────────────────────────────────────────
-- WALIMATUL — Migration 009: Seed Templates
-- Created: 2026-08-17
-- Depends on: Migration 003 (templates)
-- ─────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Seeds the initial product: Blush Garden (RM49, 6 months validity).
--
-- RULES:
--   Only Blush Garden is active (is_active = true).
--   Future templates are seeded with is_active = false.
--   Template prices are display-only. Orders snapshot the actual amount.
--
-- BLUSH GARDEN:
--   component_key: 'blush-garden'
--   This value is the key in templates/registry.ts → BlushGardenTemplate component.
--   The full Blush Garden React component will be implemented in Phase 4.
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
  'Blush Garden',
  'blush-garden',
  'A romantic floral wedding invitation with ivory, blush, and muted gold tones. Elegant, warm, and timeless.',
  'Floral',
  'blush-garden',
  49.00,
  6,
  true,
  true,
  1
)
ON CONFLICT (slug) DO UPDATE
  SET
    name            = EXCLUDED.name,
    description     = EXCLUDED.description,
    category        = EXCLUDED.category,
    component_key   = EXCLUDED.component_key,
    price           = EXCLUDED.price,
    validity_months = EXCLUDED.validity_months,
    is_active       = EXCLUDED.is_active,
    is_featured     = EXCLUDED.is_featured,
    sort_order      = EXCLUDED.sort_order,
    updated_at      = now();

-- ─────────────────────────────────────────────────────────────────────────────
-- FUTURE TEMPLATES (seeded as inactive — DO NOT activate until implemented):
-- ─────────────────────────────────────────────────────────────────────────────
-- INSERT INTO public.templates (name, slug, component_key, price, validity_months, is_active, is_featured, sort_order)
-- VALUES
--   ('Royal Gold',     'royal-gold',    'royal-gold',    49.00, 6, false, false, 2),
--   ('Minimal White',  'minimal-white', 'minimal-white', 49.00, 6, false, false, 3),
--   ('Malay Heritage', 'malay-heritage','malay-heritage', 49.00, 6, false, false, 4);

-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICATION QUERIES:
--
--   -- Confirm Blush Garden row
--   SELECT name, price, validity_months, is_active, is_featured
--   FROM public.templates WHERE slug = 'blush-garden';
--
--   Expected:
--   name         | price | validity_months | is_active | is_featured
--   Blush Garden | 49.00 | 6               | true      | true
-- ─────────────────────────────────────────────────────────────────────────────
