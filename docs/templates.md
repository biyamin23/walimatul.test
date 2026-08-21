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
    OverlayAnimation.tsx        — Lightweight CSS overlay particle animation engine
    fonts.ts                    — Font loaders for approved Google font registry
    motion/                     — Motion for React card & section animation primitives
      MotionReveal.tsx          — Scroll-triggered section & card reveal
      MotionStagger.tsx         — Sequential children reveal container
      MotionHero.tsx            — Dedicated initial page entrance animation
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

## Animation Systems: Overlay vs Card Animation

WALIMATUL maintains **two separate, decoupled animation systems** in Hybrid templates:

| Feature | Overlay Animation (`overlay`) | Card Animation (`animation`) |
|---|---|---|
| **Engine** | Lightweight Pure CSS Keyframes | **Motion for React** (`motion/react`) |
| **Purpose** | Continuous ambient atmospheric particles drifting across screen | Scroll-triggered entrance reveals for content sections & cards |
| **Targets** | Petals, sparkles, bokeh, soft-float, gentle-glow | Hero title, couple presentation, event details, RSVP, gallery, footer |
| **Trigger** | Continuous loop on page | Viewport scroll (`whileInView`, `viewport: { once: true, amount: 0.15 }`) |
| **Z-Index** | `z-20` (pointer-events: none) | `z-10` (interactive content cards) |
| **Presets** | `none`, `soft-float`, `sparkle`, `bokeh`, `petals`, `gentle-glow` | `none`, `soft-fade`, `fade-up` (Disyorkan), `gentle-scale`, `staggered-reveal` |
| **Speeds** | `slow` (14s), `normal` (9s), `fast` (6s) | `normal` (0.62s), `slow` (0.92s) |
| **Accessibility** | `@media (prefers-reduced-motion: reduce)` disables keyframes | `useReducedMotion()` renders static markup without transform/hidden state |

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
    "mobileImageUrl": "https://.../mobile-1080x1920.webp",
    "desktopImageUrl": "https://.../desktop-1920x1080.webp",
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
    "preset": "petals",
    "customAssetUrl": "https://.../custom-petal.png",
    "opacity": 0.6,
    "speed": "normal",
    "ornamentSize": "medium"
  },
  "animation": {
    "cardPreset": "fade-up",
    "duration": "normal",
    "triggerOnce": true
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

## Card Animation Presets (Motion for React)

1. `none`: Static presentation, no hidden initial state.
2. `soft-fade`: `initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}`
3. `fade-up` (Disyorkan): `initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}`
4. `gentle-scale`: `initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}`
5. `staggered-reveal`: Staggered sequential children entrance (`staggerChildren: 0.1s`).

---

## Floating Ornament Asset Guidelines

- **Dimensions**: 512 × 512 px or 1024 × 1024 px.
- **Format**: PNG or WebP with transparent background.
- **Canvas Coverage**: Crop artwork tightly so the ornament occupies 70–90% of the canvas.
- **Size Scaling**:
  - `small`: ~48px rendered size.
  - `medium`: ~80px rendered size (default).
  - `large`: ~120px rendered size.

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

---

## Phase 10B: Guest Experience Features

All guest experience features belong strictly to the **invitation data layer** (wedding content) rather than template design configurations (presentation themes).

### 1. Photo Gallery
- **Bucket**: `invitation-gallery` (Public Read, Owner Insert/Update/Delete).
- **Path structure**: `{user_id}/{invitation_id}/{uuid}.{ext}`
- **Constraints**: Maximum 12 photos per invitation, max 5MB per file, JPEG/PNG/WebP only.
- **Features**: Drag & drop upload, manual/mobile reorder buttons, replace photo, delete photo with confirmation modal, and responsive image lightbox.

### 2. Live Countdown
- **Timezone**: Canonical Malaysian Time (`Asia/Kuala_Lumpur`, UTC+8).
- **Target**: Computed from `invitations.wedding_date` and `invitations.start_time` (defaults to 11:00:00).
- **States**:
  - `upcoming`: 4-column counter (`Hari`, `Jam`, `Minit`, `Saat`).
  - `in_progress`: "🎉 Majlis sedang berlangsung" (day of the event).
  - `ended`: "Majlis telah berlangsung" (past events).
- **Zero negative values**: Never displays negative time.

### 3. Public Guest Wishes (Doa & Bingkisan Kasih)
- **Privacy Model**: All guest RSVP messages are **private by default** (`rsvps.show_on_invitation = false`).
- **Owner Moderation**: Invitation owner approves/hides messages via `/dashboard/invitations/[id]/rsvp`.
- **Public Query Strict Privacy**: The public endpoint only queries and returns `id, guest_name, message, created_at` from approved records of published non-expired invitations. Sensitive guest data (phone, email, attendance status, pax count) is **never** selected or exposed.

### 4. Background Music via YouTube
- **Input & Validation**: Canonical YouTube URL parser (`lib/youtube.ts`) supports `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/`, and stores clean 11-char video IDs.
- **Floating Audio Controller**: Minimalist floating widget positioned at `fixed bottom-6 right-6 z-40`, non-obstructive to RSVP or mobile sticky navigation bars.
- **Playback States**: Play (pulsing sound bars), Pause (▶), Loading (spinner), Unavailable (fails gracefully without crashing the invitation).
- **Autoplay Handling**: No assumption of unprompted browser autoplay. Volume initialized conservatively at ~35%.

