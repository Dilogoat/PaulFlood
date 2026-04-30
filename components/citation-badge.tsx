import type { Citation } from "@prisma/client";

type CitationBadgeProps = {
  citations: Citation[];
};

export function CitationBadge({ citations }: CitationBadgeProps) {
  if (!citations.length) {
    return <span className="badge warning">No citation yet</span>;
  }

  return (
    <span className="badge">
      {citations.length} source{citations.length > 1 ? "s" : ""}
    </span>
  );
}
