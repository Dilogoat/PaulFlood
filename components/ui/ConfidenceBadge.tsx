import type { SourceConfidence } from "@prisma/client";
import styles from "./ui.module.css";

export function ConfidenceBadge({ value }: { value: SourceConfidence }) {
  const label = value.replaceAll("_", " ");
  const className =
    value === "VERIFIED" ? styles.badgeOk : value === "UNVERIFIED" ? styles.badgeWarn : styles.badgePending;

  return <span className={className}>{label}</span>;
}
