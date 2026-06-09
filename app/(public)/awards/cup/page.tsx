import type { Metadata } from "next";
import { CompetitionType } from "@prisma/client";
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
      <WinnersTable records={competition?.winnerRecords ?? []} showAward={false} />
    </section>
  );
}
