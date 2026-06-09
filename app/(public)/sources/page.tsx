import type { Metadata } from "next";
import { SourceLinkControls } from "@/components/ui/SourceLinkControls";
import styles from "../public.module.css";
import { getCitations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sources",
  description: "Citation index for the Paul Flood heritage archive."
};

export const revalidate = 60;

export default async function SourcesPage() {
  const citations = await getCitations();

  return (
    <section className={styles.stack}>
      <div className={styles.hero}>
        <h1>Sources & Citations</h1>
        <p className={styles.muted}>
          Archival references linked to winners, history entries, and media records.
        </p>
      </div>
      {citations.map((citation) => (
        <article key={citation.id} id={`citation-${citation.id}`} className={styles.card}>
          <h3>{citation.title}</h3>
          <p className={styles.muted}>
            {[citation.author, citation.publisher].filter(Boolean).join(" — ") || "Source record"}
          </p>
          {citation.notes ? <p>{citation.notes}</p> : null}
          <SourceLinkControls sourceUrl={citation.sourceUrl} />
          {citation.evidenceLinks.length ? (
            <ul className={styles.muted}>
              {citation.evidenceLinks.map((link) => (
                <li key={link.id}>
                  {link.winnerRecord
                    ? `Winner: ${link.winnerRecord.winnerName} (${link.winnerRecord.season.year})`
                    : null}
                  {link.historyEntry ? `History: ${link.historyEntry.title}` : null}
                  {link.mediaAsset ? `Media: ${link.mediaAsset.title}` : null}
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}
