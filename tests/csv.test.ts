import { describe, expect, it } from "vitest";
import { parseCsv, parseCsvLine } from "@/lib/import/csv";

describe("parseCsvLine", () => {
  it("handles quoted commas", () => {
    expect(parseCsvLine('"Hello, world",plain')).toEqual(["Hello, world", "plain"]);
  });

  it("handles escaped quotes", () => {
    expect(parseCsvLine('"He said ""hello""",x')).toEqual(['He said "hello"', "x"]);
  });
});

describe("parseCsv", () => {
  it("maps headers to row objects", () => {
    const rows = parseCsv("name,season\nNavan,2026\nTullamore,2022");
    expect(rows).toEqual([
      { name: "Navan", season: "2026" },
      { name: "Tullamore", season: "2022" }
    ]);
  });

  it("returns empty array for empty content", () => {
    expect(parseCsv("")).toEqual([]);
  });
});
