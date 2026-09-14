import { CitationBadge } from "@/components/ui/CitationBadge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import type { WinnerRecordView } from "@/lib/data";
import styles from "@/app/(public)/public.module.css";

type WinnersTableProps = {
  records: WinnerRecordView[];
  showAward?: boolean;
};

export function WinnersTable({ records, showAward = true }: WinnersTableProps) {
  const colSpan = showAward ? 7 : 6;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Season</th>
            {showAward ? <th>Award</th> : null}
            <th>Winner</th>
            <th>Runner up</th>
            <th>Score</th>
            <th>Confidence</th>
            <th>Sources</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td className={styles.emptyCell} colSpan={colSpan}>
                No winner records match your filters.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id}>
                <td data-label="Season">{record.season.year}</td>
                {showAward ? <td data-label="Award">{record.competition.name}</td> : null}
                <td data-label="Winner">{record.winnerName}</td>
                <td data-label="Runner up">{record.runnerUpName ?? "—"}</td>
                <td data-label="Score">{record.score ?? "—"}</td>
                <td data-label="Confidence">
                  <ConfidenceBadge value={record.sourceConfidence} />
                </td>
                <td data-label="Sources">
                  <CitationBadge citations={record.evidenceLinks.map((link) => link.citation)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
