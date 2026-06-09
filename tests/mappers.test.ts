import { CompetitionType, MediaType, SourceConfidence } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  mapCitationSummary,
  mapCitationView,
  mapHistoryEntry,
  mapPerson,
  mapWinnerRecord
} from "@/lib/data/mappers";

const citation = {
  id: "cit_1",
  title: "Sportsfile report",
  publisher: "Sportsfile",
  author: null,
  sourceUrl: "https://example.com/report",
  archiveRef: null,
  publicationDate: null,
  accessDate: null,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe("mapCitationSummary", () => {
  it("maps citation fields", () => {
    expect(mapCitationSummary(citation)).toEqual({
      id: "cit_1",
      title: "Sportsfile report",
      publisher: "Sportsfile",
      author: null,
      sourceUrl: "https://example.com/report"
    });
  });
});

describe("mapWinnerRecord", () => {
  it("maps nested season and competition", () => {
    const view = mapWinnerRecord({
      id: "win_1",
      winnerName: "Navan",
      runnerUpName: "Opponent",
      score: "24-12",
      venue: "Dublin",
      matchDate: null,
      summary: null,
      sourceConfidence: SourceConfidence.VERIFIED,
      season: { id: "season_1", year: 2026 },
      competition: {
        id: "cmp_1",
        type: CompetitionType.CUP,
        name: "Paul Flood Cup",
        description: null
      },
      evidenceLinks: [{ id: "link_1", note: null, citation }]
    });

    expect(view.season.year).toBe(2026);
    expect(view.competition.type).toBe(CompetitionType.CUP);
    expect(view.evidenceLinks[0].citation.title).toBe("Sportsfile report");
  });
});

describe("mapHistoryEntry", () => {
  it("allows null season", () => {
    const view = mapHistoryEntry({
      id: "hist_1",
      title: "Memorial established",
      eventDate: null,
      content: "The cup was inaugurated.",
      sourceConfidence: SourceConfidence.NEEDS_CONFIRMATION,
      season: null,
      evidenceLinks: []
    });
    expect(view.season).toBeNull();
  });
});

describe("mapPerson", () => {
  it("maps biography profile", () => {
    expect(
      mapPerson({
        id: "person_1",
        fullName: "Paul Flood",
        roleTitle: "Club stalwart",
        biography: "Long-serving member.",
        birthYear: 1940,
        deathYear: 2010
      })
    ).toMatchObject({ fullName: "Paul Flood", birthYear: 1940 });
  });
});

describe("mapCitationView", () => {
  it("maps linked evidence targets", () => {
    const view = mapCitationView({
      ...citation,
      evidenceLinks: [
        {
          id: "link_1",
          note: null,
          winnerRecord: {
            id: "win_1",
            winnerName: "Navan",
            season: { id: "season_1", year: 2026 },
            competition: {
              id: "cmp_1",
              type: CompetitionType.CUP,
              name: "Paul Flood Cup",
              description: null
            }
          },
          historyEntry: null,
          mediaAsset: null
        }
      ]
    });

    expect(view.evidenceLinks[0].winnerRecord?.winnerName).toBe("Navan");
  });
});

describe("mapMediaAsset", () => {
  it("is imported from mappers module", async () => {
    const { mapMediaAsset } = await import("@/lib/data/mappers");
    const view = mapMediaAsset({
      id: "media_1",
      title: "Final",
      description: null,
      mediaType: MediaType.IMAGE,
      filePath: "/uploads/2022/final.jpg",
      sourceUrl: null,
      credit: null,
      rights: null,
      captureDate: null,
      sourceConfidence: SourceConfidence.VERIFIED,
      season: { id: "season_1", year: 2022 },
      evidenceLinks: []
    });
    expect(view.filePath).toBe("/uploads/2022/final.jpg");
  });
});
