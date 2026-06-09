import { CompetitionType, SourceConfidence } from "@prisma/client";
import { beforeAll, describe, expect, it } from "vitest";
import { getPerson, getSiteOverview, getWinners } from "@/lib/data";

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDatabase)("lib/data queries", () => {
  beforeAll(async () => {
    const overview = await getSiteOverview();
    if (overview.winnerCount === 0) {
      console.warn("Query tests expect imported CSV data. Run: npm run import:csv");
    }
  });

  it("getSiteOverview returns non-negative counts", async () => {
    const overview = await getSiteOverview();
    expect(overview.historyCount).toBeGreaterThanOrEqual(0);
    expect(overview.winnerCount).toBeGreaterThanOrEqual(0);
    expect(overview.citationCount).toBeGreaterThanOrEqual(0);
    expect(overview.mediaCount).toBeGreaterThanOrEqual(0);
  });

  it("getWinners filters by competition", async () => {
    const cupWinners = await getWinners({ competition: CompetitionType.CUP });
    expect(cupWinners.every((row) => row.competition.type === CompetitionType.CUP)).toBe(true);
  });

  it("getWinners filters by confidence", async () => {
    const verified = await getWinners({ confidence: SourceConfidence.VERIFIED });
    expect(verified.every((row) => row.sourceConfidence === SourceConfidence.VERIFIED)).toBe(true);
  });

  it("getPerson returns profile when seeded", async () => {
    const person = await getPerson();
    if (person) {
      expect(person.fullName.length).toBeGreaterThan(1);
    } else {
      expect(person).toBeNull();
    }
  });
});
