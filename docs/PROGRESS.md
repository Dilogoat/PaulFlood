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

## 2026-06-08 — Quality & deploy docs (issues #23–#27)

### Quality (#23–#26)

- Vitest: validation, mappers, auth, CSV parsing, and `lib/data` query tests
- Playwright smoke tests: public pages + admin login
- GitHub Actions CI: lint, test, build, e2e (Postgres service container)
- `docs/SECURITY.md` — checklist audit from E_PRIME_PLAN §8
- `app/error.tsx` — public error boundary

### Deploy (#27)

- `docs/DEPLOY.md` — Postgres, proxy, backups, restore drill, env reference

### Next up (#28)

- Production media ingest + CSV import on target host
- V1 Definition of Done sign-off
- Tag release `v1.0.0`
