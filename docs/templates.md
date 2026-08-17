# WALIMATUL — Template System

## Architecture

```
templates/
  types.ts           — InvitationTemplateData contract, TemplateComponent type
  registry.ts        — Map component_key → React component
  blush-garden/
    Template.tsx     — Blush Garden invitation component (placeholder in Phase 3)
    config.ts        — Static palette + metadata
  shared/            — Future: shared utilities, ornaments, layout primitives
```

---

## Contract: InvitationTemplateData

Every template component accepts exactly this shape (from `templates/types.ts`):

```ts
interface InvitationTemplateData {
  id: string
  groomName: string
  groomShortName: string
  brideName: string
  brideShortName: string
  weddingDate: string | null
  startTime: string | null
  endTime: string | null
  venueName: string | null
  venueAddress: string | null
  googleMapsUrl: string | null
  wazeUrl: string | null
  openingMessage: string | null
  invitationMessage: string | null
  closingMessage: string | null
  gallery: GalleryItem[]
  rsvpEnabled: boolean
  rsvpDeadline: string | null
  maxPax: number
  allowGuestMessage: boolean
  musicEnabled: boolean
  musicKey: string | null
}
```

Templates must NOT define their own incompatible data interfaces.

---

## Template Availability Rule

A template is actionable only when BOTH are true:

| Condition | Source |
|-----------|--------|
| `templates.is_active = true` | Supabase DB |
| `component_key in registry` | `templates/registry.ts` |

If is_active but no component: show "unavailable" state — never crash.
If component exists but is_active = false: do not show in catalogue.

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
| `"preview"` | Template card preview (lightweight) |
| `"editor"` | Editor pane (real-time, placeholder data allowed) |

---

## Adding a New Template

1. Create `templates/{slug}/Template.tsx` implementing `TemplateComponent`
2. Create `templates/{slug}/config.ts` with static metadata
3. Add to `TEMPLATE_REGISTRY` in `templates/registry.ts`
4. Add a migration seeding the DB row with matching `component_key`
5. Set `is_active = true` only when the component is production-ready

---

## Blush Garden (Phase 3 → Phase 4)

| Phase | State |
|-------|-------|
| Phase 3 | Structural placeholder — renders couple names + date in brand palette |
| Phase 4 | Full Playfair Display / ivory / blush / muted gold floral design |
| Phase 5 | Editor integration with live preview |
| Phase 6 | Public route with full UX |

### Blush Garden Design Tokens
```
Background: #FCF8F3 (Warm Ivory)
Blush:      #F5DDD6
Primary:    #174F3A (Deep Green)
Gold:       #B8955A (Muted Gold)
Fonts:      Playfair Display (headings), Inter (body)
```

---

## Data Flow

```
invitations (DB row)
    ↓
toTemplateData() [future utility]
    ↓
InvitationTemplateData (normalized)
    ↓
getTemplateComponent(component_key)
    ↓
<BlushGardenTemplate data={...} mode="live" />
    ↓
Rendered invitation
```
