# Paul Flood Heritage Website (E-Prime)

Spec-driven rebuild of the Paul Flood heritage archive.

## Status

E-Prime scaffold on `main`. The v0 prototype lives on `legacy/v0` (tag `v0-prototype`).

## Documentation

- **Master plan:** [docs/E_PRIME_PLAN.md](docs/E_PRIME_PLAN.md)
- **Agent workstreams:** [AGENTS.md](AGENTS.md)
- **Tech decisions:** [docs/DECISIONS.md](docs/DECISIONS.md)
- **CSV import format:** [docs/CSV_IMPORT.md](docs/CSV_IMPORT.md)
- **GitHub issues:** https://github.com/Dilogoat/PaulFlood/issues?q=label%3Ae-prime

## Local setup

1. Copy `.env.example` to `.env`
2. Start Postgres: `docker compose up -d` (requires Docker Desktop)
3. `npm install`
4. `npm run db:generate`
5. `npm run db:migrate`
6. `npm run dev`

Auth implementation: GitHub issue #5.

## Preserved from v0

- Domain model: `prisma/schema.prisma` (PostgreSQL)
- Research data: `content/import/*.csv`
- Import script: `scripts/import-csv.ts` (port in progress, issue #7)
