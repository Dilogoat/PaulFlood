import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./competition-note.module.css";

type CompetitionNoteProps = {
  /** The clarifying message. Pass a string or rich children. */
  children: ReactNode;
  /** Optional short label shown above the message (defaults to "Two competitions, one name"). */
  label?: string;
  /** Where the trailing link points (defaults to Paul's story). */
  href?: string;
  /** Text for the trailing link (defaults to "Read Paul's story"). */
  linkText?: string;
};

/**
 * A subtle, reusable info note used to distinguish the two different
 * competitions that share Paul Flood's name (women's rugby union Cup & Plate
 * vs. the 2008 Budweiser Tag All-Ireland Open Memorial Cup).
 *
 * Server component — no client-side interactivity.
 */
export function CompetitionNote({
  children,
  label = "Two competitions, one name",
  href = "/paul-flood",
  linkText = "Read Paul's story"
}: CompetitionNoteProps) {
  return (
    <aside className={styles.note} aria-label={label}>
      <p className={styles.label}>{label}</p>
      <p className={styles.body}>
        {children}{" "}
        <Link className={styles.link} href={href}>
          {linkText}
        </Link>
      </p>
    </aside>
  );
}
