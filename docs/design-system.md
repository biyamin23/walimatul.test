# WALIMATUL — Design System

**Version:** 1.0 (Phase 1)
**UI Reference:** `docs/references/walimatul-ui-reference.png`

---

## Design Principles

- Warm, romantic, and timeless
- Never corporate or overly futuristic
- Mobile-first
- Operational clarity in dashboard, immersive beauty in invitations
- Consistent design tokens — no per-page colour invention

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#FCF8F3` | Page background |
| `--background-soft` | `#FFFDFC` | Secondary background |
| `--surface` | `#FFFFFF` | Card backgrounds |
| `--surface-warm` | `#FFF9F5` | Warm card variant |
| `--primary` | `#174F3A` | Deep green — CTAs, sidebar, brand |
| `--primary-hover` | `#103F2E` | Button hover state |
| `--primary-soft` | `#EAF2ED` | Soft green tint — badges, hover bg |
| `--blush` | `#F5DDD6` | Floral accent |
| `--blush-soft` | `#FCF1EE` | Soft blush tint |
| `--peach` | `#EFC8B8` | Peach accent |
| `--gold` | `#B8955A` | Muted gold — dividers, eyebrows |
| `--gold-soft` | `#EADBC1` | Soft gold tint |
| `--text` | `#23342D` | Primary text |
| `--text-muted` | `#746F6B` | Secondary text |
| `--text-subtle` | `#A09894` | Disabled / placeholder text |
| `--border` | `#E8DDD5` | Form borders |
| `--border-soft` | `#F1E9E4` | Card borders |
| `--success` | `#317A52` | Attending / confirmed |
| `--warning` | `#B98132` | Pending / caution |
| `--danger` | `#B95454` | Not attending / error |

---

## Typography

### Platform Fonts

| Role | Font | CSS Class |
|------|------|-----------|
| Headings / Marketing | Playfair Display | `.font-display` |
| UI / Body / Forms | Inter | `.font-ui` (default body) |

Fonts are loaded via `next/font/google` (no external CSS requests).

### Invitation Template Fonts (Phase 4+)

| Role | Font |
|------|------|
| Couple Names | Great Vibes |
| Invitation Headings | Cormorant Garamond |
| Functional Text | Inter |

Do not load template fonts globally. Load them only within template components.

### Typography Scale

| Use | Font | Size |
|-----|------|------|
| Landing Hero | Playfair Display | 48–64px desktop, 36–44px mobile |
| Page Heading | Playfair Display | 32–42px |
| Section Heading | Playfair Display | 26–34px |
| Dashboard Heading | Inter semibold | 24–30px |
| Body | Inter | 14–16px |
| Labels | Inter | 13–14px |
| Buttons | Inter medium | 14–16px |
| Eyebrow | Inter semibold | 11–12px uppercase |

---

## Spacing & Layout

- Container max-width: 1200px (default), 768px (narrow), 1400px (wide)
- Container padding: `1.25rem` → `2rem` (sm) → `2.5rem` (lg)
- Section vertical padding: `5rem` (default), `3rem` (compact)

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `8px` | Inputs, small elements |
| `--radius` | `12px` | Default — inputs, tags |
| `--radius-lg` | `16px` | Cards, buttons |
| `--radius-xl` | `24px` | Large cards, panels |
| `--radius-pill` | `9999px` | Badges, pills |

---

## Shadows

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Subtle — small components |
| `--shadow-card` | Cards at rest |
| `--shadow-elevated` | Cards on hover, modals |

---

## Button Variants

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `primary` | Deep green | White | — |
| `secondary` | White | Deep green | Deep green |
| `ghost` | Transparent | Deep green | — |
| `destructive` | Soft red | Danger red | Danger red |

All buttons have hover, focus-visible, and disabled states.

---

## Card Variants

| Variant | Background | Border | Shadow |
|---------|-----------|--------|--------|
| `default` | White | Soft border | Card shadow |
| `warm` | Warm white | Soft border | Card shadow |
| `blush` | Blush soft | Blush border | Small shadow |
| `elevated` | White | Soft border | Elevated shadow |

---

## Badge Variants

`default` | `primary` | `success` | `warning` | `danger` | `gold` | `blush`

---

## Platform vs. Invitation Templates

| | Platform (SaaS) | Invitation Templates |
|--|--|--|
| Background | Cream ivory | Template-specific |
| Primary accent | Deep green | Template-specific |
| Typography | Playfair + Inter | Template-specific |
| Florals | Minimal (hero, marketing) | Prominent |
| Dashboard | Operational clarity | N/A |

Templates must not change the platform's theme.

---

## Floral Usage Rules

Use floral decorations in:
- Hero sections
- Template preview cards
- Empty states (where appropriate)
- Marketing sections

Avoid florals in:
- Data tables
- Billing and admin screens
- Dense dashboard controls

---

## Accessibility

- `:focus-visible` ring: `2px solid var(--primary)` with `2px` offset
- All interactive elements must be keyboard-reachable
- Semantic HTML throughout
- `aria-label` for icon-only buttons
- `role="list"` for custom list styling
- Adequate contrast (WCAG AA minimum)
- `prefers-reduced-motion` respected in all animations

---

## Animations

| Class | Effect |
|-------|--------|
| `.animate-fade-in` | Opacity 0 → 1 |
| `.animate-fade-up` | Opacity + translateY |
| `.animate-float` | Gentle vertical float |
| `.delay-{100–500}` | Stagger helpers |

All animations respect `prefers-reduced-motion: reduce`.
