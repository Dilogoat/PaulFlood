# Multi-Agent Workstream Guide — E-Prime Rebuild

Read `docs/E_PRIME_PLAN.md` first. This file defines agent boundaries for parallel work.

## Agents

| ID | Name | Owns | Must not touch |
|----|------|------|----------------|
| A0 | Orchestrator | Branches, contracts, reviews, issue status | Feature implementation |
| A1 | Foundation | Scaffold, Postgres, Prisma, auth, middleware | Public UI, admin forms |
| A2 | Data | `lib/data`, import script, Person import | Auth, UI components |
| A3 | Public | `(public)` routes, public components, SEO | Admin routes, auth internals |
| A4 | Admin | `(admin)` routes, upload API, admin components | Public layout styling |
| A5 | Quality | Tests, CI, security checklist | Feature scope changes |
| A6 | Deploy | `docs/DEPLOY.md`, Docker Compose, env docs | Application logic |

## Shared contracts (coordinate before parallel work)

1. **`lib/data.ts`** — A2 owns; A3/A4 consume read functions only
2. **`lib/auth/require-admin.ts`** — A1 owns; A4 must call on every mutation
3. **`lib/validation.ts`** — A2 defines schemas; A4 uses in forms
4. **`lib/storage`** — A1 creates interface; A4 implements upload against it
5. **Design tokens** — A3 owns `app/(public)` theme; A4 uses separate admin tokens

## PR rules

- Branch: `e-prime/<issue-number>-short-name`
- Title: `[E-Prime] #N Description`
- Link issue: `Closes #N` in PR body
- Max ~400 lines per PR; split if larger
- Do not merge your own PR

## File ownership

```
A1: prisma/, lib/db/, lib/auth/, middleware.ts, docker-compose.yml
A2: lib/data.ts, lib/validation.ts, scripts/import-csv.ts, content/import/
A3: app/(public)/, components/public/, components/ui/ (shared primitives)
A4: app/(admin)/, app/api/admin/, app/api/media/, components/admin/
A5: tests/, .github/workflows/, vitest.config.ts, playwright.config.ts
A6: docs/DEPLOY.md, docs/github/
```

## Conflict hotspots

- `package.json` — announce dependency adds in issue comments
- `app/layout.tsx` — use route groups; avoid single root layout edits by multiple agents
- `prisma/schema.prisma` — schema frozen after M1 gate; changes need Orchestrator approval

## Communication

Update GitHub issue with:
- Blocked by #N
- Contract change proposal (wait for Orchestrator ack)
- PR ready for review
