import { PrismaClient, CompetitionType, SourceConfidence, MediaType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cup = await prisma.competition.upsert({
    where: { type: CompetitionType.CUP },
    update: {},
    create: {
      type: CompetitionType.CUP,
      name: "Paul Flood Cup",
      description: "Annual cup competition honouring Paul Flood."
    }
  });

  const plate = await prisma.competition.upsert({
    where: { type: CompetitionType.PLATE },
    update: {},
    create: {
      type: CompetitionType.PLATE,
      name: "Paul Flood Plate",
      description: "Annual plate competition linked to the Paul Flood legacy."
    }
  });

  const season2025 = await prisma.season.upsert({
    where: { year: 2025 },
    update: {},
    create: { year: 2025 }
  });

  const citation = await prisma.citation.create({
    data: {
      title: "St. Mary's Rugby Club Annual Programme 2025",
      publisher: "St. Mary's Rugby Club",
      archiveRef: "SMRC-PROG-2025",
      accessDate: new Date(),
      notes: "Template citation. Replace with verified references.",
    }
  });

  const winner = await prisma.winnerRecord.upsert({
    where: {
      competitionId_seasonId: {
        competitionId: cup.id,
        seasonId: season2025.id
      }
    },
    update: {},
    create: {
      competitionId: cup.id,
      seasonId: season2025.id,
      winnerName: "Example RFC",
      runnerUpName: "Sample RFC",
      score: "24-17",
      venue: "St. Mary's Grounds",
      sourceConfidence: SourceConfidence.UNVERIFIED
    }
  });

  await prisma.clubHistoryEntry.create({
    data: {
      seasonId: season2025.id,
      title: "Paul Flood Heritage Site Project Initiated",
      content: "This is starter content. Replace with confirmed club history material.",
      sourceConfidence: SourceConfidence.UNVERIFIED
    }
  });

  await prisma.mediaAsset.create({
    data: {
      title: "Paul Flood Cup Placeholder Image",
      description: "Replace with licensed media and verified context.",
      mediaType: MediaType.IMAGE,
      filePath: "/uploads/placeholders/cup-placeholder.svg",
      credit: "TBC",
      rights: "TBC",
      sourceConfidence: SourceConfidence.UNVERIFIED
    }
  });

  await prisma.evidenceLink.create({
    data: {
      citationId: citation.id,
      winnerRecordId: winner.id,
      note: "Initial evidence link template"
    }
  });

  await prisma.competition.update({
    where: { id: plate.id },
    data: {}
  });
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
