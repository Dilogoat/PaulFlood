import Link from "next/link";
import { getSiteOverview } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const overview = await getSiteOverview();

  return (
    <>
      <span className="badge">E-Prime rebuild</span>
      <h1>Paul Flood Heritage</h1>
      <p>
        A citation-backed archive of Paul Flood&apos;s legacy at St. Mary&apos;s Rugby Club and the
        Paul Flood Cup and Plate.
      </p>
      <ul className="stats">
        <li>
          <strong>{overview.historyCount}</strong> history entries
        </li>
        <li>
          <strong>{overview.winnerCount}</strong> winner records
        </li>
        <li>
          <strong>{overview.mediaCount}</strong> media items
        </li>
        <li>
          <strong>{overview.citationCount}</strong> citations
        </li>
      </ul>
      <p className="muted">
        Public pages are being rebuilt. Data layer is live from PostgreSQL.
      </p>
      <p>
        <Link href="/admin">Admin</Link>
      </p>
    </>
  );
}
