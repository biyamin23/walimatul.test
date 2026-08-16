# WALIMATUL — Template System

**Version:** 1.0 (Phase 4 target)

---

## Core Principle

> **Templates are coded, responsive React layouts — not static images.**

A template receives normalized `InvitationTemplateData` and renders it as a beautiful, interactive wedding invitation using real HTML, CSS, and animations.

---

## Template Contract

All templates receive and must handle `InvitationTemplateData`:

```ts
interface InvitationTemplateData {
  groomName: string
  groomShortName: string
  brideName: string
  brideShortName: string
  weddingDate: string
  startTime?: string
  endTime?: string
  venueName: string
  venueAddress?: string
  googleMapsUrl?: string
  wazeUrl?: string
  openingMessage?: string
  invitationMessage?: string
  closingMessage?: string
  gallery: string[]
  rsvpEnabled: boolean
  rsvpDeadline?: string
  maxPax: number
  allowGuestMessage: boolean
  musicEnabled: boolean
  musicKey?: string
}
```

---

## Template Registry

`templates/registry.ts` maps database `component_key` to React components:

```ts
const templateRegistry = {
  "blush-garden": BlushGardenTemplate,
}
```

Unknown keys must fail gracefully — never crash the page.

---

## File Structure

```
templates/
├── registry.ts
├── shared/
│   └── (shared utilities, hooks, components)
└── blush-garden/
    ├── Template.tsx
    ├── config.ts
    └── assets/
        ├── background.webp
        ├── flower-top.webp
        ├── flower-bottom.webp
        ├── divider.svg
        └── frame.svg
```

---

## Template Sections (Blush Garden)

1. Opening Screen — couple names + Open Invitation button
2. Couple Names — script font hero
3. Date + Countdown
4. Invitation Message
5. Event Details (time, venue, dress code)
6. Google Maps / Waze buttons
7. Gallery
8. RSVP Form
9. Closing / Thank You

---

## Blush Garden Design

| Element | Value |
|---------|-------|
| Background | Ivory `#FCF8F3` |
| Florals | Blush `#F5DDD6`, Peach `#EFC8B8` |
| Accents | Muted gold `#B8955A` |
| Couple names | Great Vibes (script) |
| Headings | Cormorant Garamond |
| Functional text | Inter |

---

## Adding a New Template (V1 Workflow)

1. Design in Figma / Photoshop
2. Separate into responsive sections
3. Export decorative assets as `.webp` / `.svg`
4. Create `templates/your-template/Template.tsx`
5. Create `templates/your-template/config.ts`
6. Register in `templates/registry.ts`
7. Create Supabase `templates` record with matching `component_key`
8. Set `is_active = true`

---

## Template Independence

Wedding data (names, dates, venue, gallery, RSVPs) must survive changing templates. The `invitations` table is never coupled to a specific template layout.

Example: Abu & Hana can switch from Blush Garden to Royal Gold — all their data remains intact.

---

## Animation Guidelines

- Subtle coded animations only (fade, fade-up, slow zoom, gentle float)
- Never animate every element
- Always respect `prefers-reduced-motion`
- No external animation libraries required for basic effects
