import Link from "next/link";
import { StatCards } from "@/components/stat-cards";
import { getSiteOverview } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const overview = await getSiteOverview();

  return (
    <div className="stack">
      <section className="hero">
        <h1>Paul Flood Heritage</h1>
        <p className="muted">
          A curated archive of Paul Flood&apos;s legacy at St. Mary&apos;s Rugby Club and the
          continuing story of the Paul Flood Cup and Plate.
        </p>
        <p>
          <Link href="/winners">View winners archive</Link> | <Link href="/sources">Browse sources</Link>
        </p>
      </section>
      <StatCards
        stats={[
          { label: "History Entries", value: overview.historyCount },
          { label: "Winner Records", value: overview.winnerCount },
          { label: "Media Items", value: overview.mediaCount },
          { label: "Citations", value: overview.citationCount }
        ]}
      />
    </div>
  );
}
