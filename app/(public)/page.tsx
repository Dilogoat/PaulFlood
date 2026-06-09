import type { Metadata } from "next";
import Link from "next/link";
import styles from "./public.module.css";
import { getSiteOverview } from "@/lib/data";

export const metadata: Metadata = {
  title: "Paul Flood Heritage",
  description:
    "Citation-backed archive of Paul Flood's legacy at St. Mary's Rugby Club and the Paul Flood Cup and Plate."
};

export const revalidate = 60;

export default async function HomePage() {
  const overview = await getSiteOverview();

  return (
    <section className={styles.stack}>
      <div className={styles.hero}>
        <h1>Paul Flood Heritage</h1>
        <p className={styles.muted}>
          A curated archive of Paul Flood&apos;s legacy at St. Mary&apos;s Rugby Club and the
          continuing story of the Paul Flood Cup and Plate — supported by citations and source
          records.
        </p>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{overview.historyCount}</span>
            History entries
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{overview.winnerCount}</span>
            Winner records
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{overview.mediaCount}</span>
            Media items
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{overview.citationCount}</span>
            Citations
          </div>
        </div>
        <div className={styles.ctaRow}>
          <Link href="/paul-flood" className={styles.button}>
            Paul Flood timeline
          </Link>
          <Link href="/winners" className={styles.buttonSecondary}>
            Winners register
          </Link>
          <Link href="/sources" className={styles.buttonSecondary}>
            Browse sources
          </Link>
        </div>
      </div>
    </section>
  );
}
