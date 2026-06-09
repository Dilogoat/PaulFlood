export type BioInline =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

export type BioBlock =
  | { type: "paragraph"; inlines: BioInline[] }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; items: BioInline[][] };

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export function parseInline(text: string): BioInline[] {
  const nodes: BioInline[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    nodes.push({ type: "link", label: match[1], href: match[2] });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push({ type: "text", value: text.slice(lastIndex) });
  }

  return nodes.length ? nodes : [{ type: "text", value: text }];
}

function pushBodyLines(blocks: BioBlock[], lines: string[]): void {
  const paragraphs: string[] = [];
  const listItems: string[] = [];

  function flushParagraphs() {
    for (const paragraph of paragraphs.splice(0, paragraphs.length)) {
      blocks.push({ type: "paragraph", inlines: parseInline(paragraph) });
    }
  }

  function flushList() {
    if (!listItems.length) return;
    blocks.push({
      type: "list",
      items: listItems.splice(0, listItems.length).map((item) => parseInline(item))
    });
  }

  for (const line of lines) {
    if (line.startsWith("- ")) {
      flushParagraphs();
      listItems.push(line.slice(2).trim());
      continue;
    }
    flushList();
    paragraphs.push(paragraphs.length ? `${paragraphs.pop()} ${line}` : line);
  }

  flushList();
  flushParagraphs();
}

export function parseBiographyMarkdown(source: string): BioBlock[] {
  const blocks: BioBlock[] = [];
  const chunks = source.replace(/\r\n/g, "\n").trim().split(/\n\n+/);

  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) continue;

    if (lines[0].startsWith("## ")) {
      blocks.push({ type: "heading", level: 2, text: lines[0].slice(3).trim() });
      pushBodyLines(blocks, lines.slice(1));
      continue;
    }

    if (lines[0].startsWith("### ")) {
      blocks.push({ type: "heading", level: 3, text: lines[0].slice(4).trim() });
      pushBodyLines(blocks, lines.slice(1));
      continue;
    }

    pushBodyLines(blocks, lines);
  }

  return blocks;
}
