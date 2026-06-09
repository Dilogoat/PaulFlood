# E-Prime Technical Decisions

Log of locked implementation choices. Update via PR when decisions change.

| Decision | Choice | Status | Date | Rationale |
|----------|--------|--------|------|-----------|
| Framework | Next.js 15 App Router | Locked | 2026-06-08 | Existing prototype; team familiarity |
| ORM | Prisma 6 | Locked | 2026-06-08 | Schema proven in v0 |
| Database | PostgreSQL | Locked | 2026-06-08 | Production backups; concurrent access |
| Styling | CSS Modules | Locked | 2026-06-08 | Scoped styles per route group; no Tailwind build step; suits memorial typography |
| Auth library | iron-session | Locked | 2026-06-08 | Encrypted cookie sessions; fits Next.js App Router; minimal surface |
| Password hashing | bcryptjs | Locked | 2026-06-08 | Standard bcrypt; hash stored in env for single admin V1 |
| Storage driver | Local filesystem | Locked | 2026-06-08 | Self-hosted deploy; `storage/uploads` behind `lib/storage` |
| Local Postgres | Docker Compose | Locked | 2026-06-08 | `docker-compose.yml` in repo; hosted Postgres optional for prod |
| Testing | Vitest + Playwright | Locked | 2026-06-08 | Fast unit tests + smoke E2E (issue #23–#25) |

## Revalidation paths (admin mutations)

All admin writes must revalidate these public paths when affected:

- `/`
- `/paul-flood`
- `/awards/cup`
- `/awards/plate`
- `/winners`
- `/media`
- `/sources`

## How to propose a change

1. Open PR updating this table
2. Tag Orchestrator (A0) for review
3. Update `.env.example` if env vars change
