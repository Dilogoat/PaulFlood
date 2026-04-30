import { CompetitionType } from "@prisma/client";
import { CitationBadge } from "@/components/citation-badge";
import { getAwardPageData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PlatePage() {
  const plate = await getAwardPageData(CompetitionType.PLATE);

  return (
    <section className="stack">
      <div className="hero">
        <h1>Paul Flood Plate</h1>
        <p className="muted">{plate?.description ?? "Plate history and winners archive."}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Season</th>
            <th>Winner</th>
            <th>Runner Up</th>
            <th>Score</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {plate?.winnerRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.season.year}</td>
              <td>{record.winnerName}</td>
              <td>{record.runnerUpName ?? "-"}</td>
              <td>{record.score ?? "-"}</td>
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
