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
              <td colSpan={colSpan}>No winner records match your filters.</td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id}>
                <td>{record.season.year}</td>
                {showAward ? <td>{record.competition.name}</td> : null}
                <td>{record.winnerName}</td>
                <td>{record.runnerUpName ?? "—"}</td>
                <td>{record.score ?? "—"}</td>
                <td>
                  <ConfidenceBadge value={record.sourceConfidence} />
                </td>
                <td>
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
