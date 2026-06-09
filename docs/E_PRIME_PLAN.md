# E-Prime Rebuild Plan — Paul Flood Heritage

**Status:** Approved direction  
**Repo:** https://github.com/Dilogoat/PaulFlood  
**Strategy:** Spec-driven greenfield rebuild. Preserve domain model and research data; rewrite the application layer.  
**Execution model:** Multi-agent parallel workstreams with milestone gates.

---

## 1. Executive Summary

The current codebase (`legacy/v0`) is a functional prototype (~2,000 LOC, single commit) with a **strong data model** and **weak application layer** (auth, admin UX, public design, tests). E-prime treats the prototype as a **migration spec**, not a foundation.

### What we keep

| Asset | Location | Action |
|-------|----------|--------|
| Prisma schema (domain model) | `prisma/schema.prisma` | Copy to new app; minor indexes only |
| Research CSVs | `content/import/*.csv` | First-class migration source |
| CSV import logic | `scripts/import-csv.ts` | Port once; add tests |
| Editorial workflow | `content/research/`, `docs/CSV_IMPORT.md` | Keep docs; update paths |
| URL information architecture | `/`, `/paul-flood`, `/awards/*`, `/winners`, `/media`, `/sources`, `/admin` | Preserve routes |
| Deploy intent | Self-hosted + reverse proxy | Update for Postgres |

### What we rewrite

- Authentication and session management
- All public pages and visual design
- Entire admin CMS (componentized, not monolithic)
- Shared UI components and design tokens
- Middleware, mutation guards, caching strategy
- Test suite and CI
- Infrastructure: **PostgreSQL** + structured media storage from day one

### What we do not do

- Switch frameworks (stay **Next.js 15 App Router** + **Prisma** + **TypeScript**)
- Adopt a headless CMS (evidence-link graph is core IP)
- Redesign the domain model from scratch

---

## 2. V1 Definition of Done

V1 is complete when all of the following are true:

1. **Data:** Production CSV import applied; seed placeholders not used in production path
2. **Public:** All 7 public routes live with memorial-quality design (not admin-dashboard aesthetic)
3. **Paul Flood:** `Person` biography surfaced on `/paul-flood` (hero + timeline)
4. **Winners:** Search/filter on `/winners` (season, award, name, confidence)
5. **Citations:** Public pages link citations to `/sources` or inline source detail
6. **Media:** Admin file upload; images render on `/media` with credits/rights
7. **Auth:** Hashed credentials, signed per-session tokens, middleware validation, all mutations guarded
8. **Mobile:** Usable nav and scrollable tables on phone-width viewports
9. **SEO:** Per-page metadata, favicon, `robots.txt`, sitemap
10. **Quality:** ≥15 automated tests (auth, import dry-run, core queries); CI on PR
11. **Deploy:** Documented Postgres + app deploy; backup strategy for DB and uploads

---

## 3. Repository Strategy

### Branches

| Branch | Purpose |
|--------|---------|
| `main` | E-prime rebuild (active development) |
| `legacy/v0` | Frozen snapshot of prototype (tag `v0-prototype`) |

### Bootstrap sequence (before feature code)

1. Tag current `main` as `v0-prototype`
2. Create `legacy/v0` from current state
3. Reset `main` to E-prime scaffold (empty Next app + copied schema/docs) — **Issue #1**
4. All E-prime work merges to `main` via PR

### Directory layout (target)

```
app/
  (public)/           # Public route group — memorial layout
    page.tsx
    paul-flood/
    awards/
    winners/
    media/
    sources/
    layout.tsx
  (admin)/            # Admin route group — separate chrome
    admin/
    layout.tsx
  api/
    auth/
    admin/
    media/upload/
components/
  public/
  admin/
  ui/
lib/
  auth/
  data/
  db/
  storage/
  validation/
prisma/
  schema.prisma
  migrations/
scripts/
  import-csv.ts
  github/
content/
  import/
  research/
docs/
  E_PRIME_PLAN.md
  DEPLOY.md
tests/
  unit/
  integration/
legacy/               # Optional: symlink or note to legacy/v0 branch
```

---

## 4. Technical Architecture

### Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 App Router | Team familiarity; SSR + server actions |
| Language | TypeScript strict | Existing convention |
| ORM | Prisma 6 | Schema already proven |
| Database | **PostgreSQL** | Production-ready; backups; concurrent access |
| Validation | Zod | Existing convention |
| Auth | Signed HTTP-only session cookie (e.g. `iron-session` or Jose JWT in cookie) | Proper per-login sessions |
| Password | bcrypt | Env or DB-stored admin hash |
| Styling | CSS modules or Tailwind + design tokens | Pick one in Issue #2; no hand-rolled global-only CSS |
| Media | Local `storage/uploads` or S3-compatible | Abstracted behind `lib/storage` |
| Testing | Vitest + Playwright (smoke) | Fast unit + critical paths |
| CI | GitHub Actions | Lint, test, build on PR |

### Auth design (non-negotiable)

```
Login → verify bcrypt(password) → issue signed session (random session id + expiry)
Middleware → verify signature on ALL /admin/* and /api/admin/*
Server actions → requireAdmin() at top of every mutation
Logout → invalidate session server-side (session store or versioned secret)
```

No static hash derived from `username:password:secret`.

### Caching

| Route type | Strategy |
|------------|----------|
| Public read pages | `revalidate` 60–300s or on-demand via `revalidatePath` after admin writes |
| Admin | `dynamic = "force-dynamic"` |
| API upload | No cache |

### Data layer

- Copy `prisma/schema.prisma` verbatim (+ optional `@@index` additions)
- Change datasource to `postgresql`
- Port `scripts/import-csv.ts` with same CSV contracts
- Add `Person` seed/import row for Paul Flood biography

---

## 5. Multi-Agent Workstreams

Agents work in parallel where dependencies allow. Each agent owns a workstream and opens PRs against `main`. **No agent merges their own PR.**

### Coordination rules

1. **Foundation Agent** must land scaffold + Prisma + auth skeleton before others integrate
2. **Data Agent** can port import script in parallel once schema is merged
3. **Public Agent** and **Admin Agent** work against shared `lib/data` contracts — define interfaces in Issue #3 first
4. **Quality Agent** sets up CI early (even on empty tests)
5. **Deploy Agent** documents env vars; does not block V1 feature work

### Agent roster

| Agent | Workstream | Primary issues | Depends on |
|-------|------------|----------------|------------|
| **A0 — Orchestrator** | Branch setup, contracts, PR review | #1, #3 | — |
| **A1 — Foundation** | Repo scaffold, Postgres, Prisma, auth | #2, #4, #5, #6 | #1 |
| **A2 — Data** | Import port, Person data, query layer | #7, #8, #9 | #4 |
| **A3 — Public** | Memorial UI, all public routes | #10–#16 | #3, #8 |
| **A4 — Admin** | CMS, upload, evidence management | #17–#22 | #3, #5, #8 |
| **A5 — Quality** | Tests, CI, security audit | #23–#26 | #5 (parallel setup at #2) |
| **A6 — Deploy** | Deploy docs, Docker optional, backups | #27, #28 | #4 |

```mermaid
gantt
    title E-Prime Workstream Dependencies
    dateFormat  YYYY-MM-DD
    section Foundation
    Branch + scaffold           :a1, 2026-06-09, 2d
    Postgres + Prisma           :a2, after a1, 2d
    Auth system                 :a3, after a2, 3d
    section Data
    Query contracts             :b1, after a2, 1d
    Import port + Person        :b2, after b1, 3d
    section Public
    Design system + layout      :c1, after b1, 4d
    Public pages                :c2, after c1, 5d
    section Admin
    Admin shell + CRUD          :d1, after a3, 6d
    Upload + evidence           :d2, after d1, 3d
    section Quality
    CI setup                    :e1, after a1, 2d
    Tests + audit               :e2, after a3, 4d
    section Deploy
    Docs + backup               :f1, after a2, 3d
```

---

## 6. Milestones

### M0 — Planning & GitHub setup
- E-prime plan approved
- GitHub milestones, labels, issues, project board created
- `legacy/v0` branch and `v0-prototype` tag

### M1 — Foundation
- Empty E-prime scaffold on `main`
- PostgreSQL + Prisma migrated
- Auth login/logout/middleware/guards working

### M2 — Data
- `lib/data` query layer
- CSV import ported and tested
- Paul Flood `Person` record in import

### M3 — Public site
- Design system + public layout
- All 7 public routes
- Search, citation links, SEO, mobile

### M4 — Admin CMS
- Admin layout separate from public
- Full CRUD + upload + evidence link management

### M5 — Quality & security
- 15+ tests
- CI green
- Security checklist passed

### M6 — Launch
- Media assets ingested
- Production import run
- Deploy docs validated

---

## 7. Phase Detail

### Phase 0 — Repo bootstrap (A0)

- Tag `v0-prototype`, branch `legacy/v0`
- Initialize E-prime `main` with minimal Next.js + TS + ESLint
- Add `AGENTS.md` with workstream boundaries
- Copy `prisma/schema.prisma` (postgresql), `content/`, `docs/CSV_IMPORT.md`

**Gate:** `npm run build` passes on empty scaffold

### Phase 1 — Foundation (A1)

- Docker Compose for local Postgres (or document hosted Neon/Supabase)
- Prisma migrate; no seed placeholders in production path
- Auth: bcrypt password, signed session, `requireAdmin()` helper
- Middleware validates session signature
- `.env.example` updated for all vars

**Gate:** Login → admin redirect → logout works; invalid cookie rejected at middleware

### Phase 2 — Data layer (A2)

- Implement `lib/data/*` mirroring current queries + `getPerson()`
- Port `import-csv.ts`; `npm run import:csv -- --dry-run` passes
- Add `person.csv` or column in import for biography
- Run import against dev DB

**Gate:** Public pages can render imported data in dev

### Phase 3 — Public site (A3)

**Design direction:** Light, readable memorial site. Club imagery, strong typography, amber accent retained. Photography-led home hero. Not dark dashboard.

| Page | Requirements |
|------|--------------|
| `/` | Hero image, intro, stat cards, clear CTAs |
| `/paul-flood` | Person bio + timeline; citations linked |
| `/awards/cup`, `/plate` | Competition intro + winners table |
| `/winners` | Unified table + search/filter |
| `/media` | Responsive grid, lightbox optional |
| `/sources` | Citation index with open/copy |

- Per-page `metadata`
- Mobile nav (hamburger)
- `not-found.tsx`, `error.tsx`

**Gate:** Design review — does not look like admin tool

### Phase 4 — Admin CMS (A4)

- Separate `(admin)` layout — no public nav
- Componentized forms (not 300-line page)
- CRUD: winners, history, media, citations, evidence links (create + list + delete)
- File upload → `lib/storage`
- All mutations call `requireAdmin()`
- `revalidatePath` for all affected public routes

**Gate:** Full editorial workflow without manual file paths

### Phase 5 — Quality (A5)

- Vitest: auth helpers, validation schemas, import dry-run
- Playwright: login smoke, home + winners render
- GitHub Actions: lint, test, build
- Security checklist (see §8)

**Gate:** CI required for merge

### Phase 6 — Launch (A6)

- Ingest media files to storage
- Production CSV import
- `docs/DEPLOY.md` (Postgres, proxy, backups)
- Restore drill documented

**Gate:** V1 Definition of Done (§2) signed off

---

## 8. Security Checklist

- [ ] bcrypt password storage (not plaintext env compare)
- [ ] Per-session signed tokens with expiry
- [ ] Middleware validates token cryptographically
- [ ] Every server action and admin API route calls `requireAdmin()`
- [ ] Upload: type/size validation, sanitized filenames, no path traversal
- [ ] CSRF: SameSite cookies + origin check on mutations
- [ ] Rate limit `/admin` and `/api/auth` at proxy
- [ ] Secrets only in env; `.env` gitignored
- [ ] Postgres credentials not committed
- [ ] `next/image` remote patterns restricted (not `**`)

---

## 9. Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/paulflood"

# Auth
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH=""          # bcrypt hash; or ADMIN_PASSWORD for dev-only bootstrap
SESSION_SECRET=""               # 32+ random bytes for signing

# Storage
STORAGE_DRIVER="local"          # local | s3
STORAGE_LOCAL_PATH="./storage/uploads"
# S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY (if s3)

# App
NODE_ENV="production"
NEXT_PUBLIC_SITE_URL="https://your-host.example"
```

---

## 10. Risk Register

| Risk | Mitigation |
|------|------------|
| Greenfield scope creep | V1 DoD (§2) is fixed scope; v2 backlog for nice-to-haves |
| Agent merge conflicts | Shared contracts in `lib/data`; small PRs; Orchestrator reviews |
| Import regression | Port script with dry-run tests; keep CSV contracts identical |
| Media licensing | Track rights in `MediaAsset.rights`; don't block V1 on full archive |
| Postgres ops overhead | Docker Compose for dev; document single-PC backup |
| Auth library choice paralysis | Default: `iron-session` or Jose + cookie; decide in Issue #5 |

---

## 11. V2 Backlog (out of scope for V1)

- Multi-user admin roles
- Audit log for edits
- Full-text search (Postgres FTS)
- Print-friendly winners PDF
- RSS/Atom for new history entries
- Public API (read-only JSON)
- Light/dark theme toggle
- i18n

---

## 12. GitHub Project Structure

| Milestone | Issues |
|-----------|--------|
| M0 Planning | #1 |
| M1 Foundation | #2–#6 |
| M2 Data | #7–#9 |
| M3 Public | #10–#16 |
| M4 Admin | #17–#22 |
| M5 Quality | #23–#26 |
| M6 Launch | #27–#28 |

**Labels:** `agent:*`, `milestone:*`, `priority:*`, `type:*`

**Project board columns:** Backlog → Ready → In Progress → In Review → Done

Bootstrap script: `scripts/github/bootstrap-e-prime.ps1`  
Run after `gh auth login`.

---

## 13. PR Guidelines

- One issue per PR where possible
- Title format: `[E-Prime] #N Short description`
- Must pass CI
- Orchestrator or human review before merge
- No direct commits to `main` without PR after scaffold lands

---

## 14. Reference Links

- Prototype README: `/README.md` (on `legacy/v0`)
- CSV format: `docs/CSV_IMPORT.md`
- Citation workflow: `content/research/citation-intake-template.md`
- GitHub bootstrap: `docs/github/BOOTSTRAP.md`
- Agent boundaries: `AGENTS.md` (created in Issue #1)

---

*Last updated: 2026-06-08*
