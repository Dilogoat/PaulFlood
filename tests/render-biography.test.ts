import { describe, expect, it } from "vitest";
import { parseBiographyMarkdown, parseInline } from "@/lib/content/render-biography";

describe("parseInline", () => {
  it("parses markdown links", () => {
    const nodes = parseInline("See [IRFU obituary](https://example.com) for details.");
    expect(nodes).toEqual([
      { type: "text", value: "See " },
      { type: "link", label: "IRFU obituary", href: "https://example.com" },
      { type: "text", value: " for details." }
    ]);
  });
});

describe("parseBiographyMarkdown", () => {
  it("parses intro, section heading, and list", () => {
    const blocks = parseBiographyMarkdown(`Intro paragraph.

## Early Life

Body paragraph.

## References

- [Source one](https://example.com)
- Plain reference`);

    expect(blocks[0]).toEqual({
      type: "paragraph",
      inlines: [{ type: "text", value: "Intro paragraph." }]
    });
    expect(blocks[1]).toEqual({ type: "heading", level: 2, text: "Early Life" });
    expect(blocks[3]).toEqual({ type: "heading", level: 2, text: "References" });
    expect(blocks[4]?.type).toBe("list");

    const honours = parseBiographyMarkdown(`## Honours and Legacy

Intro line.

- First honour
- Second honour`);
    expect(honours).toEqual([
      { type: "heading", level: 2, text: "Honours and Legacy" },
      { type: "paragraph", inlines: [{ type: "text", value: "Intro line." }] },
      {
        type: "list",
        items: [
          [{ type: "text", value: "First honour" }],
          [{ type: "text", value: "Second honour" }]
        ]
      }
    ]);
  });
});
