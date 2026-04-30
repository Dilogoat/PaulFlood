# CSV Import Guide

The importer reads CSV files from `content/import` by default.

## Command
- Dry run (validates and rolls back writes):
  - `npm run import:csv -- --dry-run`
- Apply:
  - `npm run import:csv`
- Alternate directory:
  - `npm run import:csv -- --dir path/to/csvs`

## Supported Files
- `competitions.csv`
- `seasons.csv`
- `winner_records.csv`
- `club_history_entries.csv`
- `media_assets.csv`
- `citations.csv`
- `evidence_links.csv`

Missing files are skipped; present files are imported.

## Required Header Notes
- `winner_records.csv`
  - required: `competition_type`, `season_year`, `winner_name`, `source_confidence`
- `club_history_entries.csv`
  - required: `title`, `content`, `source_confidence`
- `media_assets.csv`
  - required: `title`, `media_type`, `file_path`, `source_confidence`
- `citations.csv`
  - required: `citation_key`, `title`
- `evidence_links.csv`
  - required: `citation_key`, `entity_type`

## Enum Values
- `competition_type`: `CUP`, `PLATE`
- `source_confidence`: `VERIFIED`, `NEEDS_CONFIRMATION`, `UNVERIFIED`
- `media_type`: `IMAGE`, `VIDEO`, `DOCUMENT`
- `entity_type`: `WINNER_RECORD`, `HISTORY_ENTRY`, `MEDIA_ASSET`

## Date Format
- Use ISO date strings like `2026-04-28`.

## Import Behavior
- Upserts competitions and seasons.
- Upserts winner records by `(competition, season)`.
- Updates or creates history entries by `(title, season, event_date)`.
- Updates or creates media assets by `(title, file_path)`.
- Creates citations and maps them by `citation_key` for evidence linking.
- Creates missing evidence links, skips duplicates.
