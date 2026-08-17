# WALIMATUL — Template System

## Architecture

```
templates/
  types.ts                      — InvitationTemplateData contract, TemplateComponent type
  registry.ts                   — Map component_key → React component
  blush-garden/
    Template.tsx                — Blush Garden production invitation component
    config.ts                   — Design metadata + theme tokens
    fonts.ts                    — Scoped Google Fonts (Great Vibes, Cormorant Garamond, Inter)
    preview-data.ts             — Sample & edge-case datasets for preview & visual testing
    components/
      BotanicalOrnaments.tsx    — SVG corner accents, botanical dividers & flourishes
      CoverSection.tsx          — Responsive cover / hero section (Great Vibes script names)
      OpeningSection.tsx        — Bismillah motif, opening quotation & blessing
      CoupleSection.tsx         — Formal couple presentation
      EventDetailsSection.tsx   — Ceremonial date/time, venue & Maps/Waze actions
      GallerySection.tsx        — Responsive photo gallery layout
      RsvpPreviewSection.tsx    — RSVP presentation details & guest settings
      ClosingSection.tsx        — Doa, blessing & subtle WALIMATUL attribution
  shared/                       — Shared utilities, ornaments, layout primitives
```

---

## Contract: InvitationTemplateData

Every template component accepts exactly this shape (from `templates/types.ts`):

```ts
interface InvitationTemplateData {
  id: string;
  groomName: string;
  groomShortName: string;
  brideName: string;
  brideShortName: string;
  weddingDate: string | null;
  startTime: string | null;
  endTime: string | null;
  venueName: string | null;
  venueAddress: string | null;
  googleMapsUrl: string | null;
  wazeUrl: string | null;
  openingMessage: string | null;
  invitationMessage: string | null;
  closingMessage: string | null;
  gallery: GalleryItem[];
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
  maxPax: number;
  allowGuestMessage: boolean;
  musicEnabled: boolean;
  musicKey: string | null;
}
```

Templates must NOT define their own incompatible data interfaces.

---

## Database Mapper Layer

The mapper in `lib/templates/map-invitation.ts` converts Supabase snake_case rows to `InvitationTemplateData`:

```ts
import { mapInvitationToTemplateData } from "@/lib/templates/map-invitation";

const templateData = mapInvitationToTemplateData(invitationRow, galleryRows);
```

**Rule:** Template components must never access database fields directly or contain data-fetching logic.

---

## Template Availability Rule

A template is actionable only when BOTH are true:

| Condition | Source |
|-----------|--------|
| `templates.is_active = true` | Supabase DB |
| `component_key in registry` | `templates/registry.ts` |

If `is_active` in DB but no component: show "unavailable" state — never crash.
If component exists but `is_active = false`: do not show in catalogue.

---

## Registry API

```ts
// Check availability
isTemplateComponentAvailable('blush-garden') // → true | false

// Get component (null-safe)
const Template = getTemplateComponent('blush-garden')
if (!Template) return <UnavailableState />
return <Template data={data} mode="live" />
```

---

## Template Render Modes

| Mode | Usage |
|------|-------|
| `"live"` | Public invitation page (full features) |
| `"preview"` | Preview route / template card preview (shows preview badge, presentation buttons) |
| `"editor"` | Editor live preview pane (real-time, placeholder data allowed) |

---

## Blush Garden Design Specifications

### Palette Tokens
```
Background:  #FCF8F3 (Warm Ivory)
Soft Blush:  #F5DDD6
Light Blush: #FCF1EE
Primary:     #174F3A (Deep Green)
Gold:        #B8955A (Muted Gold)
Warm Text:   #746F6B (Warm Charcoal)
Warm Border: #E8DDD5
```

### Typography
- **Couple Names**: Great Vibes (fluid `clamp(2.75rem, 11vw, 5.25rem)` with graceful wrapping)
- **Ceremonial Headings & Dates**: Cormorant Garamond
- **Body & Functional Text**: Inter

### Responsive Viewports Tested
- **Mobile (360px – 430px)**: Primary target, full touch-friendly targets, no horizontal overflow.
- **Tablet (768px – 1024px)**: Centered editorial container (~640-720px max-width) with soft backdrop.
- **Desktop (1440px+)**: Intimate invitation container with warm ambient border and shadows.

### Preview Route
Accessible at `/templates/blush-garden/preview` with interactive dataset switcher (Standard, Long Names, Minimal).
