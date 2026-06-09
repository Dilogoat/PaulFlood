# E-Prime Progress Notes

## 2026-06-08 — Public site + Admin CMS (issues #10–#22)

### Public site (#10–#16)

- Memorial light theme with CSS Modules (`public.module.css`, nav/footer components)
- Routes: `/`, `/paul-flood`, `/awards/cup`, `/awards/plate`, `/winners`, `/media`, `/sources`
- Winners register with URL search params (competition, season, confidence, text search)
- Citation badges link to `/sources#citation-{id}`
- SEO: `sitemap.ts`, `robots.ts`, per-page metadata, `not-found.tsx`
- Home page shows live stats from `getSiteOverview()` with `revalidate = 60`

### Admin CMS (#17–#22)

- `lib/validation.ts` — Zod schemas for all content types
- `app/(admin)/admin/actions.ts` — server actions with `requireAdmin()` on every mutation
- `revalidatePublicPaths()` revalidates all public routes after changes
- Componentized dashboard sections (winners, history, media, citations, evidence links, person)
- `POST /api/admin/media/upload` — image upload to `public/uploads/{year}/` (max 5MB, jpeg/png/webp/gif)

### Next up (#23–#28)

- Vitest unit tests for validation and data mappers
- Playwright smoke tests
- Security checklist pass
- Self-hosted deploy + launch
