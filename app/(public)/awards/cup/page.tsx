import type { Metadata } from "next";
import { CompetitionType } from "@prisma/client";
import { CompetitionNote } from "@/components/public/CompetitionNote";
import { WinnersTable } from "@/components/public/WinnersTable";
import styles from "../../public.module.css";
import { getAwardPageData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Paul Flood Cup",
  description: "History and winners of the Paul Flood Memorial Cup."
};

export const revalidate = 60;

export default async function CupPage() {
  const competition = await getAwardPageData(CompetitionType.CUP);

  return (
    <section className={styles.stack}>
      <div className={styles.hero}>
        <h1>{competition?.name ?? "Paul Flood Cup"}</h1>
        <p className={styles.muted}>
          {competition?.description ??
            "Season-by-season winners of the Paul Flood Memorial Cup with source confidence."}
        </p>
      </div>
      <CompetitionNote>
        This is the Leinster Women&rsquo;s Rugby (union) Paul Flood Cup, played from 2010 onwards. It is
        distinct from the 2008 Budweiser Tag All-Ireland Open Paul Flood Memorial Cup &mdash; a separate
        tag rugby competition also named in Paul&rsquo;s honour.
      </CompetitionNote>
      <WinnersTable records={competition?.winnerRecords ?? []} showAward={false} />
    </section>
  );
}
