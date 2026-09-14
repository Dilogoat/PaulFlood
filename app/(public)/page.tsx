import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";
import { getSiteOverview } from "@/lib/data";

export const metadata: Metadata = {
  title: { absolute: "Paul Flood Heritage" },
  description:
    "Citation-backed archive of Paul Flood's legacy at St. Mary's Rugby Club and the Paul Flood Cup and Plate."
};

export const revalidate = 60;

export default async function HomePage() {
  const overview = await getSiteOverview();

  return (
    <section className={styles.stack}>
      <div className={styles.hero}>
        <div className={styles.portraitFrame}>
          <Image
            src="/uploads/2008/paul-flood-1955-2008.jpg"
            alt="Paul Flood, 1955–2008"
            width={495}
            height={495}
            className={styles.portrait}
            priority
          />
        </div>
        <div className={styles.heroText}>
          <h1 className={styles.name}>Paul Flood</h1>
          <p className={styles.years}>1955 – 2008</p>
          <p className={styles.descriptor}>
            Player, coach, referee and mentor at St Mary&apos;s College RFC —
            a pioneer of women&apos;s rugby, known affectionately as{" "}
            <span className={styles.nickname}>&ldquo;Floody&rdquo;</span>.
          </p>
        </div>
      </div>

      <p className={styles.lead}>
        Paul joined St Mary&apos;s College RFC in 1973 as a pacy young wing and
        gave the club 31 years across every level of the game. He helped set up
        and coach the Mary&apos;s Ladies XV, guiding players who went on to shape
        future generations of women&apos;s rugby, and championed participation for
        all through the IRFU&apos;s tag rugby programme. In his memory the club
        established the <strong>Paul Flood Cup</strong>. He is survived by his
        wife, Erica, and their children, Jonathan and Andrea.
      </p>

      <blockquote className={styles.quote}>
        <p className={styles.quoteText}>
          &ldquo;A proud St Mary&apos;s man, his passing will leave a void in the
          lives of all those he touched.&rdquo;
        </p>
        <footer className={styles.quoteAttr}>
          Association of Referees, Leinster Branch — <span>April 2008</span>
        </footer>
      </blockquote>

      <div className={styles.ctaRow}>
        <Link href="/paul-flood" className={styles.button}>
          Explore Paul&apos;s story
        </Link>
        <Link href="/winners" className={styles.buttonSecondary}>
          Winners register
        </Link>
        <Link href="/media" className={styles.buttonSecondary}>
          Media
        </Link>
        <Link href="/sources" className={styles.buttonSecondary}>
          Sources
        </Link>
      </div>

      <p className={styles.stats}>
        The archive holds{" "}
        <span className={styles.statNumber}>{overview.historyCount}</span> history
        entries · <span className={styles.statNumber}>{overview.winnerCount}</span>{" "}
        winner records ·{" "}
        <span className={styles.statNumber}>{overview.mediaCount}</span> media
        items ·{" "}
        <span className={styles.statNumber}>{overview.citationCount}</span>{" "}
        citations.
      </p>
    </section>
  );
}
