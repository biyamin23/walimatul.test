# WALIMATUL — Development Rules

**Version:** 1.0

These rules apply to all contributors and all development phases.

---

## Brand

1. The application is always called **WALIMATUL** — never rename it
2. Brand signature is always **by nasuhalias**
3. Never use placeholder brands (Weddingly, InviteApp, MyWedding, etc.)
4. All brand values come from `lib/constants/brand.ts` — never hardcode them

## Design

5. Every page uses the WALIMATUL design token system
6. Do not invent different colour schemes per page
7. Do not independently redesign finished pages
8. Reuse Button, Card, Container, SectionHeading, Badge components
9. Maintain the distinction: SaaS platform vs invitation templates
10. Invitation templates must not force global theme changes
11. Florals are welcome in marketing and templates; keep dashboards operational

## Typography

12. Platform headings and marketing: **Playfair Display**
13. Platform UI, forms, body: **Inter**
14. Invitation template fonts (Great Vibes, Cormorant Garamond) load only inside template components — never globally

## Code Quality

15. TypeScript strict mode — never use `any` to silence errors
16. Run `npx tsc --noEmit` before considering a phase complete
17. Run `npm run lint` and fix all lint errors
18. Run `npm run build` and fix all build errors
19. Do not install packages without a clear justification

## Security

20. **Never disable RLS**
21. Never weaken ownership rules to fix bugs
22. Never expose `SUPABASE_SERVICE_ROLE_KEY` or any secret to the browser
23. Never commit `.env.local`, database passwords, OAuth secrets, or payment keys
24. `.env.example` is the only environment file committed to source control
25. Reserved slugs must be validated server-side, not only in the UI
26. Authorization must be server-side and backed by RLS — UI-only hiding is insufficient

## Mobile

27. Test all public invitation routes at: 360px, 375px, 390px, 430px, 768px, desktop
28. No horizontal overflow on any screen size
29. Public invitations are especially mobile-first

## Accessibility

30. All interactive elements must be keyboard-accessible
31. Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`
32. One `<h1>` per page, proper heading hierarchy
33. All form inputs must have associated `<label>`
34. Icon-only buttons must have `aria-label`
35. Images must have `alt` text
36. Adequate contrast (WCAG AA minimum)
37. All animations respect `prefers-reduced-motion`

## Architecture

38. **Wedding data belongs to the invitation. Design belongs to the template.**
39. The `InvitationTemplateData` interface is the only accepted contract between invitations and templates
40. Never tightly couple wedding content with a specific template layout
41. Guest public invitation routes must not import dashboard or admin bundles

## Documentation

42. Update docs after any architectural changes
43. Keep `docs/design-system.md` current when adding new design tokens or components
44. Add migration files to `supabase/migrations/` for every schema change

## Git

45. Use focused, semantic commits
46. Do not make one giant "generate everything" commit
47. Commit message format: `type(scope): description`
    Examples: `feat: add invitation editor`, `fix: rsvp pax validation`, `chore: update env example`
