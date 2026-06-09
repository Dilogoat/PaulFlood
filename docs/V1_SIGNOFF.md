# V1 Launch Sign-Off — Paul Flood Heritage

**Date:** 2026-06-08  
**Release tag:** `v1.0.0`  
**Reference:** `docs/E_PRIME_PLAN.md` §2 Definition of Done

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Production CSV import applied | ✅ | `npm run import:csv`; 12 winners, 15 citations, 5 media |
| 2 | All 7 public routes live, memorial design | ✅ | `(public)` routes + CSS Modules theme |
| 3 | Person biography on `/paul-flood` | ✅ | `getPerson()` + timeline from `getPaulFloodHistory()` |
| 4 | Winners search/filter | ✅ | `/winners` with URL params + `WinnersFilter` |
| 5 | Citations link to `/sources` | ✅ | `CitationBadge` → `/sources#citation-{id}` |
| 6 | Admin upload; media on `/media` | ✅ | Upload API + credits/rights on media cards |
| 7 | Auth hardened; mutations guarded | ✅ | bcrypt, iron-session, middleware, `requireAdmin()` |
| 8 | Mobile nav and scrollable tables | ✅ | `SiteNav` hamburger + `.tableWrap` overflow |
| 9 | SEO: metadata, favicon, robots, sitemap | ✅ | Per-page metadata, `app/icon.svg`, `robots.ts`, `sitemap.ts` |
| 10 | ≥15 automated tests; CI on PR | ✅ | 26 Vitest + 5 Playwright; `.github/workflows/ci.yml` |
| 11 | Deploy docs; backup strategy | ✅ | `docs/DEPLOY.md`, `docs/SECURITY.md` |

## Media ingest

All five `media_assets.csv` paths resolve to files under `public/uploads/`:

| Year | File |
|------|------|
| 2010 | `st-marys-capture-paul-flood-memorial-trophy-irfu.jpg` |
| 2013 | `old-belvedere-paul-flood-cup-sportsfile-741923.jpg` |
| 2014 | `clondalkin-v-gorey-team-photo.jpg` |
| 2022 | `tullamore-v-tullow-paul-flood-cup-sportsfile-2213920.jpg` |
| 2026 | `navan-paul-flood-cup-winners.webp` |

## Production launch steps

1. Provision Postgres and set `.env` (see `docs/DEPLOY.md`)
2. `npx prisma migrate deploy && npm run import:csv`
3. Copy `public/uploads/` to production host
4. `npm run build && npm run start` behind HTTPS proxy
5. Set `NEXT_PUBLIC_SITE_URL` to public HTTPS URL (enables secure session cookies)

## Post-launch

- Verify `/admin` login on production HTTPS
- Schedule nightly `pg_dump` + uploads backup
- Monitor Sportsfile/IRFU image rights before wide public promotion
