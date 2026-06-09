import fs from "node:fs/promises";
import path from "node:path";
import {
  CompetitionType,
  MediaType,
  Prisma,
  PrismaClient,
  SourceConfidence,
} from "@prisma/client";

type CsvRow = Record<string, string>;

type ImportOptions = {
  dir: string;
  dryRun: boolean;
};

const prisma = new PrismaClient();
type DbClient = PrismaClient | Prisma.TransactionClient;

function parseArgs(): ImportOptions {
  const args = process.argv.slice(2);
  let dir = "content/import";
  let dryRun = false;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--dir" && args[i + 1]) {
      dir = args[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
    }
  }

  return { dir, dryRun };
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current.trim());
  return out;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? "";
    });
    return row;
  });
}

async function readCsvRows(baseDir: string, fileName: string): Promise<CsvRow[]> {
  const fullPath = path.resolve(baseDir, fileName);
  try {
    const content = await fs.readFile(fullPath, "utf8");
    const rows = parseCsv(content);
    console.log(`Loaded ${rows.length} row(s) from ${fileName}`);
    return rows;
  } catch (error) {
    console.log(`Skipped ${fileName} (not found or unreadable).`);
    return [];
  }
}

function parseDate(value: string): Date | null {
  const v = value.trim();
  if (!v) return null;
  const date = new Date(v);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: "${value}"`);
  }
  return date;
}

function parseCompetitionType(value: string): CompetitionType {
  if (value === "CUP" || value === "PLATE") return value;
  throw new Error(`Invalid competition_type/type "${value}"`);
}

function parseSourceConfidence(value: string): SourceConfidence {
  if (
    value === "VERIFIED" ||
    value === "NEEDS_CONFIRMATION" ||
    value === "UNVERIFIED"
  ) {
    return value;
  }
  throw new Error(`Invalid source_confidence "${value}"`);
}

function parseMediaType(value: string): MediaType {
  if (value === "IMAGE" || value === "VIDEO" || value === "DOCUMENT") return value;
  throw new Error(`Invalid media_type "${value}"`);
}

function requireString(row: CsvRow, key: string): string {
  const value = (row[key] ?? "").trim();
  if (!value) throw new Error(`Missing required column "${key}"`);
  return value;
}

async function main() {
  const options = parseArgs();
  const importDir = path.resolve(options.dir);
  console.log(`CSV import directory: ${importDir}`);
  console.log(`Mode: ${options.dryRun ? "DRY RUN" : "APPLY"}`);

  const counters = {
    competitions: 0,
    seasons: 0,
    persons: 0,
    winners: 0,
    history: 0,
    media: 0,
    citations: 0,
    links: 0,
  };

  const runImport = async (db: DbClient) => {
    const citationKeyToId = new Map<string, string>();
    const competitionsRows = await readCsvRows(importDir, "competitions.csv");
    for (const row of competitionsRows) {
      const type = parseCompetitionType(requireString(row, "type"));
      const name = requireString(row, "name");
      const description = (row.description ?? "").trim() || null;
      await db.competition.upsert({
        where: { type },
        update: { name, description },
        create: { type, name, description },
      });
      counters.competitions += 1;
    }

    const seasonsRows = await readCsvRows(importDir, "seasons.csv");
    for (const row of seasonsRows) {
      const year = Number.parseInt(requireString(row, "year"), 10);
      if (Number.isNaN(year)) throw new Error(`Invalid year "${row.year}"`);
      await db.season.upsert({
        where: { year },
        update: {
          startDate: parseDate(row.start_date ?? ""),
          endDate: parseDate(row.end_date ?? ""),
        },
        create: {
          year,
          startDate: parseDate(row.start_date ?? ""),
          endDate: parseDate(row.end_date ?? ""),
        },
      });
      counters.seasons += 1;
    }

    const citationsRows = await readCsvRows(importDir, "citations.csv");
    for (const row of citationsRows) {
      const citationKey = requireString(row, "citation_key");
      const title = requireString(row, "title");
      const created = await db.citation.create({
        data: {
          title,
          publisher: (row.publisher ?? "").trim() || null,
          author: (row.author ?? "").trim() || null,
          sourceUrl: (row.source_url ?? "").trim() || null,
          archiveRef: (row.archive_ref ?? "").trim() || null,
          publicationDate: parseDate(row.publication_date ?? ""),
          accessDate: parseDate(row.access_date ?? ""),
          notes: (row.notes ?? "").trim() || null,
        },
      });
      citationKeyToId.set(citationKey, created.id);
      counters.citations += 1;
    }

    const personRows = await readCsvRows(importDir, "person.csv");
    for (const row of personRows) {
      const fullName = requireString(row, "full_name");
      const data = {
        fullName,
        roleTitle: (row.role_title ?? "").trim() || null,
        biography: (row.biography ?? "").trim() || null,
        birthYear: (row.birth_year ?? "").trim()
          ? Number.parseInt((row.birth_year ?? "").trim(), 10)
          : null,
        deathYear: (row.death_year ?? "").trim()
          ? Number.parseInt((row.death_year ?? "").trim(), 10)
          : null
      };
      const existing = await db.person.findFirst({ where: { fullName } });
      if (existing) {
        await db.person.update({ where: { id: existing.id }, data });
      } else {
        await db.person.create({ data });
      }
      counters.persons += 1;
    }

    const winnerRows = await readCsvRows(importDir, "winner_records.csv");
    for (const row of winnerRows) {
      const competitionType = parseCompetitionType(
        requireString(row, "competition_type")
      );
      const seasonYear = Number.parseInt(requireString(row, "season_year"), 10);
      if (Number.isNaN(seasonYear)) {
        throw new Error(`Invalid season_year "${row.season_year}"`);
      }
      const competition = await db.competition.findUnique({
        where: { type: competitionType },
      });
      if (!competition) {
        throw new Error(`Competition "${competitionType}" not found.`);
      }
      const season = await db.season.upsert({
        where: { year: seasonYear },
        update: {},
        create: { year: seasonYear },
      });

      await db.winnerRecord.upsert({
        where: {
          competitionId_seasonId: {
            competitionId: competition.id,
            seasonId: season.id,
          },
        },
        update: {
          winnerName: requireString(row, "winner_name"),
          runnerUpName: (row.runner_up_name ?? "").trim() || null,
          score: (row.score ?? "").trim() || null,
          venue: (row.venue ?? "").trim() || null,
          matchDate: parseDate(row.match_date ?? ""),
          summary: (row.summary ?? "").trim() || null,
          sourceConfidence: parseSourceConfidence(
            requireString(row, "source_confidence")
          ),
        },
        create: {
          competitionId: competition.id,
          seasonId: season.id,
          winnerName: requireString(row, "winner_name"),
          runnerUpName: (row.runner_up_name ?? "").trim() || null,
          score: (row.score ?? "").trim() || null,
          venue: (row.venue ?? "").trim() || null,
          matchDate: parseDate(row.match_date ?? ""),
          summary: (row.summary ?? "").trim() || null,
          sourceConfidence: parseSourceConfidence(
            requireString(row, "source_confidence")
          ),
        },
      });
      counters.winners += 1;
    }

    const historyRows = await readCsvRows(importDir, "club_history_entries.csv");
    for (const row of historyRows) {
      const title = requireString(row, "title");
      const content = requireString(row, "content");
      const seasonYearRaw = (row.season_year ?? "").trim();
      let seasonId: string | null = null;
      if (seasonYearRaw) {
        const seasonYear = Number.parseInt(seasonYearRaw, 10);
        if (Number.isNaN(seasonYear)) {
          throw new Error(`Invalid season_year "${seasonYearRaw}"`);
        }
        const season = await db.season.upsert({
          where: { year: seasonYear },
          update: {},
          create: { year: seasonYear },
        });
        seasonId = season.id;
      }

      const eventDate = parseDate(row.event_date ?? "");
      const existing = await db.clubHistoryEntry.findFirst({
        where: {
          title,
          seasonId: seasonId ?? undefined,
          eventDate: eventDate ?? undefined,
        },
      });

      if (existing) {
        await db.clubHistoryEntry.update({
          where: { id: existing.id },
          data: {
            content,
            sourceConfidence: parseSourceConfidence(
              requireString(row, "source_confidence")
            ),
          },
        });
      } else {
        await db.clubHistoryEntry.create({
          data: {
            title,
            content,
            eventDate,
            seasonId,
            sourceConfidence: parseSourceConfidence(
              requireString(row, "source_confidence")
            ),
          },
        });
      }
      counters.history += 1;
    }

    const mediaRows = await readCsvRows(importDir, "media_assets.csv");
    for (const row of mediaRows) {
      const title = requireString(row, "title");
      const filePath = requireString(row, "file_path");
      const seasonYearRaw = (row.season_year ?? "").trim();
      let seasonId: string | null = null;
      if (seasonYearRaw) {
        const seasonYear = Number.parseInt(seasonYearRaw, 10);
        if (Number.isNaN(seasonYear)) {
          throw new Error(`Invalid season_year "${seasonYearRaw}"`);
        }
        const season = await db.season.upsert({
          where: { year: seasonYear },
          update: {},
          create: { year: seasonYear },
        });
        seasonId = season.id;
      }

      const existing = await db.mediaAsset.findFirst({
        where: { title, filePath },
      });

      const payload = {
        title,
        description: (row.description ?? "").trim() || null,
        mediaType: parseMediaType(requireString(row, "media_type")),
        filePath,
        sourceUrl: (row.source_url ?? "").trim() || null,
        credit: (row.credit ?? "").trim() || null,
        rights: (row.rights ?? "").trim() || null,
        seasonId,
        captureDate: parseDate(row.capture_date ?? ""),
        sourceConfidence: parseSourceConfidence(
          requireString(row, "source_confidence")
        ),
      };

      if (existing) {
        await db.mediaAsset.update({ where: { id: existing.id }, data: payload });
      } else {
        await db.mediaAsset.create({ data: payload });
      }
      counters.media += 1;
    }

    const evidenceRows = await readCsvRows(importDir, "evidence_links.csv");
    for (const row of evidenceRows) {
      const citationKey = requireString(row, "citation_key");
      const entityType = requireString(row, "entity_type");
      const citationId = citationKeyToId.get(citationKey);
      if (!citationId) {
        throw new Error(`Unknown citation_key "${citationKey}"`);
      }

      let winnerRecordId: string | null = null;
      let historyEntryId: string | null = null;
      let mediaAssetId: string | null = null;

      if (entityType === "WINNER_RECORD") {
        const competitionType = parseCompetitionType(
          requireString(row, "competition_type")
        );
        const seasonYear = Number.parseInt(requireString(row, "season_year"), 10);
        const winner = await db.winnerRecord.findFirst({
          where: {
            competition: { type: competitionType },
            season: { year: seasonYear },
          },
        });
        if (!winner) {
          throw new Error(
            `Winner record missing for ${competitionType} ${seasonYear}`
          );
        }
        winnerRecordId = winner.id;
      } else if (entityType === "HISTORY_ENTRY") {
        const title = requireString(row, "history_title");
        const history = await db.clubHistoryEntry.findFirst({
          where: { title },
        });
        if (!history) {
          throw new Error(`History entry missing for title "${title}"`);
        }
        historyEntryId = history.id;
      } else if (entityType === "MEDIA_ASSET") {
        const mediaTitle = requireString(row, "media_title");
        const media = await db.mediaAsset.findFirst({
          where: { title: mediaTitle },
        });
        if (!media) {
          throw new Error(`Media asset missing for title "${mediaTitle}"`);
        }
        mediaAssetId = media.id;
      } else {
        throw new Error(`Unsupported entity_type "${entityType}"`);
      }

      const existing = await db.evidenceLink.findFirst({
        where: {
          citationId,
          winnerRecordId,
          historyEntryId,
          mediaAssetId,
        },
      });
      if (!existing) {
        await db.evidenceLink.create({
          data: {
            citationId,
            winnerRecordId,
            historyEntryId,
            mediaAssetId,
            note: (row.note ?? "").trim() || null,
          },
        });
      }
      counters.links += 1;
    }
  };

  if (options.dryRun) {
    await prisma.$transaction(async (tx) => {
      await runImport(tx);
      throw new Error("__ROLLBACK_DRY_RUN__");
    }).catch((err: Error) => {
      if (err.message !== "__ROLLBACK_DRY_RUN__") {
        throw err;
      }
    });
  } else {
    await runImport(prisma);
  }

  console.log("Import summary:");
  console.log(JSON.stringify(counters, null, 2));
}

main()
  .catch((error) => {
    console.error("CSV import failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
