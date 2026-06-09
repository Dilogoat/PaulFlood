# E-Prime Issue Index

Quick reference for all 28 bootstrap issues. Created on GitHub by `scripts/github/bootstrap-e-prime.ps1`.

| # | Title | Milestone | Agent | Priority |
|---|-------|-----------|-------|----------|
| 1 | Repo bootstrap — legacy branch, tag, scaffold | M0 | A0 | Critical |
| 2 | Tech decisions — styling, auth, storage | M1 | A1 | Critical |
| 3 | Shared contracts — lib/data interfaces | M1 | A0 | Critical |
| 4 | PostgreSQL + Prisma setup | M1 | A1 | Critical |
| 5 | Authentication — login, session, bcrypt | M1 | A1 | Critical |
| 6 | Middleware — validate session | M1 | A1 | High |
| 7 | Port CSV import + dry-run tests | M2 | A2 | Critical |
| 8 | Implement lib/data query layer | M2 | A2 | Critical |
| 9 | Person import + biography content | M2 | A2 | High |
| 10 | Public design system + layout | M3 | A3 | Critical |
| 11 | Home page — hero, stats, CTAs | M3 | A3 | High |
| 12 | Paul Flood page — bio + timeline | M3 | A3 | High |
| 13 | Awards pages — Cup and Plate | M3 | A3 | High |
| 14 | Winners register — search/filter | M3 | A3 | Critical |
| 15 | Media gallery page | M3 | A3 | High |
| 16 | Sources page + SEO | M3 | A3 | High |
| 17 | Admin layout shell | M4 | A4 | Critical |
| 18 | Admin CRUD — winners and history | M4 | A4 | High |
| 19 | Admin CRUD — citations and evidence | M4 | A4 | High |
| 20 | Media upload API + CRUD | M4 | A4 | Critical |
| 21 | Admin CRUD — Person biography | M4 | A4 | Medium |
| 22 | Admin revalidation + cache | M4 | A4 | High |
| 23 | CI pipeline | M5 | A5 | Critical |
| 24 | Unit tests | M5 | A5 | High |
| 25 | E2E smoke tests | M5 | A5 | Medium |
| 26 | Security audit | M5 | A5 | High |
| 27 | Deploy documentation | M6 | A6 | High |
| 28 | Launch — media + production import | M6 | A6 | Critical |

## Dependency chain (critical path)

```
#1 → #2, #3, #4 → #5 → #6
#4 → #7 → #8, #9
#3, #8, #10 → public pages (#11–#16)
#5, #6, #17 → admin (#18–#22)
#1 → #23 (early) → #24, #25, #26
#4 → #27 → #28
```

## Parallel lanes after #1

| Lane | Agent | Issues |
|------|-------|--------|
| Foundation | A1 | #2, #4, #5, #6 |
| Contracts | A0 | #3 |
| Data | A2 | #7, #8, #9 (after #4) |
| Quality (early) | A5 | #23 |
| Deploy (early) | A6 | #27 (after #4) |
