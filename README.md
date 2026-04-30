# Paul Flood Heritage Website

Next.js + Prisma + SQLite website for documenting:
- Paul Flood's legacy at St. Mary's Rugby Club
- Paul Flood Cup history and winners
- Paul Flood Plate history and winners
- Citation-backed evidence and media archive

## Site Outline
- `/` Home with key stats and entry points
- `/paul-flood` biographical and club timeline
- `/awards/cup` Cup history and winners
- `/awards/plate` Plate history and winners
- `/winners` unified winners register
- `/media` photo/media archive
- `/sources` citation index
- `/admin` authenticated content management

## Core Components
- App Router pages for public history and archives
- SQLite-backed Prisma models for winners/history/media/citations
- Admin dashboard for create, update, delete
- Evidence links connecting citations to records
- Source confidence status (`VERIFIED`, `NEEDS_CONFIRMATION`, `UNVERIFIED`)

## Data Model
- `Person`
- `Competition`
- `Season`
- `WinnerRecord`
- `ClubHistoryEntry`
- `MediaAsset`
- `Citation`
- `EvidenceLink`

## Local Setup
1. Copy `.env.example` to `.env`.
2. Set:
   - `DATABASE_URL="file:./dev.db"`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
3. Install dependencies.
4. Run:
   - `npm run db:generate`
   - `npm run db:migrate`
   - `npm run db:seed`
   - `npm run dev`

## Citation Workflow
- Add citation records first.
- Create/update winner/history/media records.
- Link evidence through admin `Link Citation to Evidence` form.
- Avoid publishing key claims without citation coverage.

## Local Hosting
See `docs/DEPLOY_LOCAL_PROXY.md` for reverse proxy + NO-IP setup.

## CSV Bulk Import
- Place CSV files in `content/import/`.
- Validate without writing:
  - `npm run import:csv -- --dry-run`
- Apply import:
  - `npm run import:csv`
- Full format reference:
  - `docs/CSV_IMPORT.md`
