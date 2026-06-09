import type { CompetitionType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  mapCitationView,
  mapHistoryEntry,
  mapMediaAsset,
  mapPerson,
  mapWinnerRecord
} from "./mappers";
import type {
  AwardPageData,
  ClubHistoryEntryView,
  CitationView,
  MediaAssetView,
  PersonProfile,
  SiteOverview,
  WinnerRecordView,
  WinnersFilter
} from "./types";

const evidenceInclude = {
  include: { citation: true }
} as const;

export async function getSiteOverview(): Promise<SiteOverview> {
  const [historyCount, winnerCount, citationCount, mediaCount] = await Promise.all([
    prisma.clubHistoryEntry.count(),
    prisma.winnerRecord.count(),
    prisma.citation.count(),
    prisma.mediaAsset.count()
  ]);

  return { historyCount, winnerCount, citationCount, mediaCount };
}

export async function getAwardPageData(type: CompetitionType): Promise<AwardPageData | null> {
  const competition = await prisma.competition.findUnique({
    where: { type },
    include: {
      winnerRecords: {
        include: {
          season: true,
          competition: true,
          evidenceLinks: evidenceInclude
        },
        orderBy: { season: { year: "desc" } }
      }
    }
  });

  if (!competition) return null;

  return {
    id: competition.id,
    type: competition.type,
    name: competition.name,
    description: competition.description,
    winnerRecords: competition.winnerRecords.map(mapWinnerRecord)
  };
}

export async function getPaulFloodHistory(): Promise<ClubHistoryEntryView[]> {
  const entries = await prisma.clubHistoryEntry.findMany({
    include: {
      season: true,
      evidenceLinks: evidenceInclude
    },
    orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }]
  });

  return entries.map(mapHistoryEntry);
}

export async function getPerson(): Promise<PersonProfile | null> {
  const person = await prisma.person.findFirst({
    orderBy: { createdAt: "asc" }
  });

  return person ? mapPerson(person) : null;
}

function buildWinnersWhere(filter?: WinnersFilter): Prisma.WinnerRecordWhereInput {
  const conditions: Prisma.WinnerRecordWhereInput[] = [];

  if (filter?.competition) {
    conditions.push({ competition: { type: filter.competition } });
  }
  if (filter?.seasonYear) {
    conditions.push({ season: { year: filter.seasonYear } });
  }
  if (filter?.confidence) {
    conditions.push({ sourceConfidence: filter.confidence });
  }
  if (filter?.search?.trim()) {
    const search = filter.search.trim();
    conditions.push({
      OR: [
        { winnerName: { contains: search, mode: "insensitive" } },
        { runnerUpName: { contains: search, mode: "insensitive" } },
        { venue: { contains: search, mode: "insensitive" } }
      ]
    });
  }

  return conditions.length ? { AND: conditions } : {};
}

export async function getWinners(filter?: WinnersFilter): Promise<WinnerRecordView[]> {
  const winners = await prisma.winnerRecord.findMany({
    where: buildWinnersWhere(filter),
    include: {
      season: true,
      competition: true,
      evidenceLinks: evidenceInclude
    },
    orderBy: { season: { year: "desc" } }
  });

  return winners.map(mapWinnerRecord);
}

export async function getMediaAssets(): Promise<MediaAssetView[]> {
  const assets = await prisma.mediaAsset.findMany({
    include: {
      season: true,
      evidenceLinks: evidenceInclude
    },
    orderBy: [{ season: { year: "desc" } }, { createdAt: "desc" }]
  });

  return assets.map(mapMediaAsset);
}

export async function getCitations(): Promise<CitationView[]> {
  const citations = await prisma.citation.findMany({
    include: {
      evidenceLinks: {
        include: {
          winnerRecord: { include: { competition: true, season: true } },
          historyEntry: true,
          mediaAsset: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return citations.map(mapCitationView);
}
