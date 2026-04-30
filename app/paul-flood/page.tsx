import { CitationBadge } from "@/components/citation-badge";
import { getPaulFloodHistory } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PaulFloodPage() {
  const entries = await getPaulFloodHistory();

  return (
    <section className="stack">
      <div className="hero">
        <h1>Paul Flood at St. Mary&apos;s Rugby Club</h1>
        <p className="muted">
          A timeline of notable events, milestones, and legacy moments. Each entry should be
          supported by archival evidence.
        </p>
      </div>
      {entries.map((entry) => (
        <article key={entry.id} className="card">
          <h3>{entry.title}</h3>
          <p className="muted">
            {entry.eventDate ? new Date(entry.eventDate).toLocaleDateString() : "Date pending"}{" "}
            {entry.season ? `- Season ${entry.season.year}` : ""}
          </p>
          <p>{entry.content}</p>
          <CitationBadge citations={entry.evidenceLinks.map((link) => link.citation)} />
        </article>
      ))}
    </section>
  );
}
