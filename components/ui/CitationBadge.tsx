import Link from "next/link";
import type { CitationSummary } from "@/lib/data";
import styles from "./ui.module.css";

type CitationBadgeProps = {
  citations: CitationSummary[];
};

export function CitationBadge({ citations }: CitationBadgeProps) {
  if (!citations.length) {
    return <span className={styles.badgeWarn}>No citation yet</span>;
  }

  if (citations.length === 1) {
    return (
      <Link href={`/sources#citation-${citations[0].id}`} className={styles.badge}>
        1 source
      </Link>
    );
  }

  return (
    <Link href="/sources" className={styles.badge}>
      {citations.length} sources
    </Link>
  );
}
