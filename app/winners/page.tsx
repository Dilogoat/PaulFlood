import { getWinners } from "@/lib/data";
import { CitationBadge } from "@/components/citation-badge";

export const dynamic = "force-dynamic";

export default async function WinnersPage() {
  const winners = await getWinners();

  return (
    <section className="stack">
      <div className="hero">
        <h1>Winners Register</h1>
        <p className="muted">Unified searchable register for Cup and Plate winners by season.</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Season</th>
            <th>Award</th>
            <th>Winner</th>
            <th>Runner Up</th>
            <th>Confidence</th>
            <th>Sources</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((record) => (
            <tr key={record.id}>
              <td>{record.season.year}</td>
              <td>{record.competition.name}</td>
              <td>{record.winnerName}</td>
              <td>{record.runnerUpName ?? "-"}</td>
              <td>{record.sourceConfidence.replaceAll("_", " ")}</td>
              <td>
                <CitationBadge citations={record.evidenceLinks.map((link) => link.citation)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
