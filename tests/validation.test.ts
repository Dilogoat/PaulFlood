import { CompetitionType, MediaType, SourceConfidence } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  citationSchema,
  evidenceLinkSchema,
  historySchema,
  mediaSchema,
  personSchema,
  winnerSchema
} from "@/lib/validation";

describe("winnerSchema", () => {
  it("accepts valid winner input", () => {
    const result = winnerSchema.parse({
      competitionId: "cmp_1",
      seasonYear: 2022,
      winnerName: "Tullamore",
      sourceConfidence: SourceConfidence.VERIFIED
    });
    expect(result.winnerName).toBe("Tullamore");
  });

  it("rejects short winner name", () => {
    expect(() =>
      winnerSchema.parse({
        competitionId: "cmp_1",
        seasonYear: 2022,
        winnerName: "A",
        sourceConfidence: SourceConfidence.VERIFIED
      })
    ).toThrow();
  });
});

describe("historySchema", () => {
  it("accepts optional season year", () => {
    const result = historySchema.parse({
      title: "Club milestone",
      content: "A notable event in club history.",
      sourceConfidence: SourceConfidence.NEEDS_CONFIRMATION
    });
    expect(result.seasonYear).toBeUndefined();
  });
});

describe("mediaSchema", () => {
  it("accepts empty source URL", () => {
    const result = mediaSchema.parse({
      title: "Final photo",
      mediaType: MediaType.IMAGE,
      filePath: "/uploads/2022/final.jpg",
      sourceUrl: "",
      sourceConfidence: SourceConfidence.UNVERIFIED
    });
    expect(result.sourceUrl).toBe("");
  });
});

describe("citationSchema", () => {
  it("rejects invalid source URL", () => {
    expect(() =>
      citationSchema.parse({
        title: "IRFU report",
        sourceUrl: "not-a-url"
      })
    ).toThrow();
  });
});

describe("evidenceLinkSchema", () => {
  it("requires a linked entity", () => {
    expect(() =>
      evidenceLinkSchema.parse({
        citationId: "cit_1"
      })
    ).toThrow();
  });

  it("accepts winner record link", () => {
    const result = evidenceLinkSchema.parse({
      citationId: "cit_1",
      winnerRecordId: "win_1"
    });
    expect(result.winnerRecordId).toBe("win_1");
  });
});

describe("personSchema", () => {
  it("coerces birth year", () => {
    const result = personSchema.parse({
      fullName: "Paul Flood",
      birthYear: "1940"
    });
    expect(result.birthYear).toBe(1940);
  });
});

describe("competition type enum", () => {
  it("is not part of winner schema but used in queries", () => {
    expect(CompetitionType.CUP).toBe("CUP");
  });
});
