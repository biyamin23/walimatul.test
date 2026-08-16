# WALIMATUL — Architecture

**Version:** 1.0 (Phase 1)

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first) |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Hosting | Vercel |
| Source Control | Git / GitHub |

---

## Core Architecture Principle

> **Wedding data belongs to the invitation. Design belongs to the template.**

Wedding content (names, dates, venue, messages) is stored in the `invitations` table and passed to templates as a typed `InvitationTemplateData` interface. Templates are coded React components that render the data. Changing a template does not lose any wedding data.

---

## Route Structure

```
app/
├── page.tsx                          → Landing
├── templates/
│   ├── page.tsx                      → Template gallery
│   └── [slug]/page.tsx               → Template preview
├── pricing/page.tsx
├── login/page.tsx
├── register/page.tsx
├── forgot-password/page.tsx
├── auth/callback/route.ts            → Google OAuth callback
├── dashboard/
│   ├── layout.tsx                    → Auth guard (client)
│   ├── page.tsx                      → Dashboard home
│   ├── invitations/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── edit/page.tsx
│   │       ├── preview/page.tsx
│   │       ├── share/page.tsx
│   │       └── rsvp/page.tsx
│   ├── billing/page.tsx
│   └── profile/page.tsx
├── admin/
│   ├── layout.tsx                    → Auth guard (admin only)
│   ├── page.tsx
│   ├── templates/page.tsx
│   ├── invitations/page.tsx
│   ├── users/page.tsx
│   ├── orders/page.tsx
│   └── settings/page.tsx
└── [slug]/page.tsx                   → Public invitation (guests)
```

---

## Public vs Protected Routes

| Route Pattern | Access |
|---------------|--------|
| `/` | Public |
| `/templates/*` | Public |
| `/pricing` | Public |
| `/[slug]` | Public (published invitations only) |
| `/login`, `/register` | Public (redirect if authenticated) |
| `/dashboard/*` | Client auth required |
| `/admin/*` | Admin role required |

---

## Directory Structure

```
components/
├── ui/                   → Button, Card, Input, Label, Badge, Container, SectionHeading
├── layout/               → Navbar, Footer
├── marketing/            → Landing-specific components
├── dashboard/            → Client dashboard components
├── admin/                → Admin interface components
├── invitation/           → Shared invitation rendering components
└── forms/                → Reusable form components

lib/
├── constants/            → brand.ts, routes.ts
├── auth/                 → Auth helpers
├── supabase/             → Supabase client (browser + server)
├── database/             → Query helpers
├── permissions/          → Role checks
├── validation/           → Zod schemas
└── utils/                → Utility functions

templates/
├── registry.ts           → Template component map
├── shared/               → Shared template utilities
└── blush-garden/         → First template
    ├── Template.tsx
    ├── config.ts
    └── assets/

types/
└── index.ts              → All shared TypeScript types

supabase/
├── config.toml
└── migrations/           → All schema migrations

docs/
├── product-spec.md
├── architecture.md
├── database.md
├── templates.md
├── authentication.md
├── design-system.md
├── development-rules.md
└── references/           → UI mockup and reference images
```

---

## Supabase Configuration

**Project ref:** `xjaclwiilmmzjiftnnob`
**Project URL:** `https://xjaclwiilmmzjiftnnob.supabase.co`

```bash
supabase login
supabase link --project-ref xjaclwiilmmzjiftnnob
```

All schema changes go through migrations in `supabase/migrations/`.

---

## Template Architecture

Templates receive normalized `InvitationTemplateData`. The registry maps `component_key` strings (stored in the database) to React components:

```ts
const templateRegistry = {
  "blush-garden": BlushGardenTemplate,
  // future templates here
}
```

Unknown `component_key` values fail gracefully with a fallback UI.

---

## Payment Architecture

Payment integration is NOT implemented in V1. The architecture supports:

```
Review → Payment → Server Verification → Order Paid → Publish Enabled
```

Server-side verification is mandatory. Client-side redirect alone is never sufficient proof of payment.

---

## Performance Considerations

- Public invitation routes (`/[slug]`) must not import dashboard/admin bundles
- Use React `lazy` / Next.js dynamic imports for heavy components
- Images served as WebP with proper `next/image` sizing
- Invitation templates use minimal client JavaScript
