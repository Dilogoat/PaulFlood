import { CompetitionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getSiteOverview() {
  const [historyCount, winnerCount, citationCount, mediaCount] = await Promise.all([
    prisma.clubHistoryEntry.count(),
    prisma.winnerRecord.count(),
    prisma.citation.count(),
    prisma.mediaAsset.count()
  ]);

  return { historyCount, winnerCount, citationCount, mediaCount };
}

export async function getAwardPageData(type: CompetitionType) {
  const competition = await prisma.competition.findUnique({
    where: { type },
    include: {
      winnerRecords: {
        include: { season: true, evidenceLinks: { include: { citation: true } } },
        orderBy: { season: { year: "desc" } }
      }
    }
  });

  return competition;
}

export async function getPaulFloodHistory() {
  return prisma.clubHistoryEntry.findMany({
    include: { season: true, evidenceLinks: { include: { citation: true } } },
    orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }]
  });
}

export async function getWinners(competition?: CompetitionType) {
  return prisma.winnerRecord.findMany({
    where: competition
      ? { competition: { type: competition } }
      : undefined,
    include: {
      season: true,
      competition: true,
      evidenceLinks: { include: { citation: true } }
    },
    orderBy: { season: { year: "desc" } }
  });
}

export async function getMediaAssets() {
  return prisma.mediaAsset.findMany({
    include: { season: true, evidenceLinks: { include: { citation: true } } },
    orderBy: [{ season: { year: "desc" } }, { createdAt: "desc" }]
  });
}

export async function getCitations() {
  return prisma.citation.findMany({
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
}
