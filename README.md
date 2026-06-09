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

## Requirements

- **Node.js** 24.16+ (LTS) — see `.nvmrc`
- **Docker Desktop** — for local PostgreSQL
- **npm** 11+

Upgrade Node on Windows:

```powershell
winget upgrade --id OpenJS.NodeJS.LTS -e
```

Restart your terminal, then verify:

```powershell
node --version   # expect v24.16.0 or newer
npm.cmd --version
```

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
