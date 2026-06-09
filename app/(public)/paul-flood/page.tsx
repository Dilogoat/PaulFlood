import type { Metadata } from "next";
import { BioContent } from "@/components/public/BioContent";
import { BioImageReel } from "@/components/public/BioImageReel";
import { CitationBadge } from "@/components/ui/CitationBadge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { PAUL_FLOOD_GALLERY } from "@/lib/content/paul-flood-gallery";
import styles from "../public.module.css";
import { getPaulFloodHistory, getPerson } from "@/lib/data";

export const metadata: Metadata = {
  title: "Paul Flood",
  description: "Biography and club history timeline for Paul Flood at St. Mary's Rugby Club."
};

export const revalidate = 60;

export default async function PaulFloodPage() {
  const [person, entries] = await Promise.all([getPerson(), getPaulFloodHistory()]);

  return (
    <section className={styles.stack}>
      <div className={styles.hero}>
        <BioImageReel images={PAUL_FLOOD_GALLERY} />
        <h1>Paul Flood at St. Mary&apos;s Rugby Club</h1>
        <p className={styles.muted}>
          Biography and a timeline of notable events, milestones, and legacy moments.
        </p>
      </div>

      {person ? (
        <article className={styles.card}>
          <h2>{person.fullName}</h2>
          {person.roleTitle ? <p className={styles.muted}>{person.roleTitle}</p> : null}
          {person.birthYear || person.deathYear ? (
            <p className={styles.muted}>
              {person.birthYear ?? "?"} — {person.deathYear ?? "present"}
            </p>
          ) : null}
          {person.biography ? <BioContent biography={person.biography} /> : null}
        </article>
      ) : null}

      {entries.map((entry) => (
        <article key={entry.id} className={styles.card}>
          <h3>{entry.title}</h3>
          <p className={styles.muted}>
            {entry.eventDate ? new Date(entry.eventDate).toLocaleDateString() : "Date pending"}
            {entry.season ? ` — Season ${entry.season.year}` : ""}
          </p>
          <p>{entry.content}</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
            <ConfidenceBadge value={entry.sourceConfidence} />
            <CitationBadge citations={entry.evidenceLinks.map((link) => link.citation)} />
          </div>
        </article>
      ))}
    </section>
  );
}
