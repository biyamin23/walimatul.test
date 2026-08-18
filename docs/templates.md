# WALIMATUL — Template System & Hybrid Architecture

## Architecture

```
templates/
  types.ts                      — InvitationTemplateData contract, TemplateComponentProps
  registry.ts                   — Map component_key → React component
  blush-garden/                 — Coded React template component
    Template.tsx
    config.ts
    fonts.ts
    preview-data.ts
    components/
  hybrid-editorial/             — Reusable Hybrid template engine (Phase 10A)
    Template.tsx                — Configurable renderer (consumes dynamic design_config)
    OverlayAnimation.tsx        — Lightweight CSS overlay animation presets
    fonts.ts                    — Font loaders for approved Google font registry
```

---

## Coded vs Hybrid Templates

WALIMATUL supports two categories of templates:

1. **Coded Templates (`blush-garden`)**:
   - Implemented as dedicated, handcrafted React components with custom JSX layout and bespoke ornament assets.
   - Ideal for unique signature styles.

2. **Hybrid Configurable Templates (`hybrid-editorial`)**:
   - Reusable, production-grade presentation renderer that consumes dynamic `design_config` (JSONB) and uploaded graphical assets (PNG/JPG/WebP).
   - Allows Admin to launch new commercial visual variations without deploying new React code.
   - **Guaranteed Purity**: No raw executable JavaScript/HTML is ever uploaded or executed. Dynamic wedding data remains live HTML/text.

---

## Contract: InvitationTemplateData

Every template component accepts exactly this shape (from `templates/types.ts`):

```ts
export interface TemplateComponentProps {
  data: InvitationTemplateData;
  mode?: "preview" | "live" | "editor";
  designConfig?: TemplateDesignConfig | Record<string, unknown>;
}
```

**Rule:** Template components must never query the database directly or contain server dependencies.

---

## Template Status Lifecycle

Templates progress through a 3-stage lifecycle:

```
[ draft ] ──(Admin Activate)──> [ active ] ──(Admin Archive)──> [ archived ]
   │
 (Delete allowed ONLY if unreferenced)
```

| Status | Customer Catalogue | New Purchases | Existing Invitations |
|---|---|---|---|
| **Draft** | Hidden | Not selectable | Renders in Admin Preview |
| **Active** | Visible (`/templates`) | Selectable | Renders on Public & Editor |
| **Archived** | Hidden | Not selectable | Renders on Historical/Active Invitations |

### Safe Delete Protection
- **Hard Delete**: Permitted ONLY when `status = 'draft'` AND 0 invitations reference it AND 0 orders reference it.
- **In-Use Protection**: If any invitation or order references the template, hard delete is blocked and "Archive" is offered instead, ensuring zero broken historical invitations.

---

## Hybrid Design Configuration (`design_config`)

Stored as JSONB in `public.templates.design_config`:

```json
{
  "colors": {
    "background": "#FDFBF7",
    "surface": "#FFFFFF",
    "surfaceCard": "rgba(255, 255, 255, 0.88)",
    "primaryText": "#2C2523",
    "secondaryText": "#736862",
    "accent": "#9C7A4A",
    "border": "#EFE8DF",
    "buttonBg": "#9C7A4A",
    "buttonText": "#FFFFFF"
  },
  "typography": {
    "headingFont": "cormorant",
    "scriptFont": "great-vibes",
    "bodyFont": "inter"
  },
  "background": {
    "color": "#FDFBF7",
    "imageUrl": "https://.../background.webp",
    "size": "cover",
    "repeat": "no-repeat",
    "overlayOpacity": 0.1
  },
  "ornaments": {
    "topOrnamentUrl": "https://.../top-ornament.png",
    "bottomOrnamentUrl": "https://.../bottom-ornament.png",
    "dividerStyle": "floral"
  },
  "overlay": {
    "enabled": true,
    "animationPreset": "soft-float",
    "customAssetUrl": null,
    "opacity": 0.6,
    "speed": "normal"
  }
}
```

---

## Approved Font Registry

1. `cormorant`: Cormorant Garamond (Serif Elegan)
2. `playfair`: Playfair Display (Serif Klasik)
3. `great-vibes`: Great Vibes (Kaligrafi Romantik)
4. `inter`: Inter (Moden & Jelas)
5. `outfit`: Outfit (Sans Kontemporari)

---

## Overlay Animation Presets

1. `none`: Static presentation.
2. `soft-float`: Subtle floating elements.
3. `sparkle`: Micro-particle glowing sparkles.
4. `bokeh`: Soft blurred light circles drifting slowly.
5. `petals`: Drifting soft floral petals.
6. `gentle-glow`: Ambient pulsing radial glow.

### Safety & Accessibility
- `pointer-events: none` on all animations (never blocks RSVP, Maps, or links).
- `@media (prefers-reduced-motion: reduce)` automatically disables all animations.

---

## Template Asset Storage (`template-assets`)

- Bucket: `template-assets` (Public Read, Admin Write/Update/Delete).
- Directory structure:
  ```
  template-assets/
    {template_slug}/
      thumbnail/
      background/
      ornaments/
      overlays/
  ```
- Allowed formats: JPG, PNG, WebP (Max 5 MB).
