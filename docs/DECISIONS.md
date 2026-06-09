# E-Prime Technical Decisions

Log of locked implementation choices. Update via PR when decisions change.

| Decision | Choice | Status | Date | Rationale |
|----------|--------|--------|------|-----------|
| Framework | Next.js 15 App Router | Locked | 2026-06-08 | Existing prototype; team familiarity |
| ORM | Prisma 6 | Locked | 2026-06-08 | Schema proven in v0 |
| Database | PostgreSQL | Locked | 2026-06-08 | Production backups; concurrent access |
| Styling | _TBD_ | Pending | — | Decide in Issue #2 |
| Auth library | _TBD_ | Pending | — | Decide in Issue #2 |
| Storage driver | _TBD_ | Pending | — | Decide in Issue #2 |
| Local Postgres | _TBD_ | Pending | — | Docker Compose vs hosted |

## How to propose a change

1. Open PR updating this table
2. Tag Orchestrator (A0) for review
3. Update `.env.example` if env vars change
