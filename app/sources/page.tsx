import { getCitations } from "@/lib/data";
import { SourceLinkControls } from "@/components/source-link-controls";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const citations = await getCitations();

  return (
    <section className="stack">
      <div className="hero">
        <h1>Sources Index</h1>
        <p className="muted">
          Evidence register for all published claims and media records in this project.
        </p>
      </div>
      {citations.map((citation) => (
        <article key={citation.id} className="card">
          <h3>{citation.title}</h3>
          <p className="muted">
            {citation.publisher ?? "Unknown publisher"} {citation.author ? `- ${citation.author}` : ""}
          </p>
          {citation.sourceUrl ? (
            <>
              <SourceLinkControls url={citation.sourceUrl} />
              <p className="muted source-url-text">{citation.sourceUrl}</p>
            </>
          ) : null}
          <p className="muted">
            Linked evidence: {citation.evidenceLinks.length}
            {citation.archiveRef ? ` - Ref: ${citation.archiveRef}` : ""}
          </p>
        </article>
      ))}
    </section>
  );
}
