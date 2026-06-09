import type { Metadata } from "next";
import { CompetitionType } from "@prisma/client";
import { WinnersTable } from "@/components/public/WinnersTable";
import styles from "../../public.module.css";
import { getAwardPageData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Paul Flood Plate",
  description: "History and winners of the Paul Flood Plate."
};

export const revalidate = 60;

export default async function PlatePage() {
  const competition = await getAwardPageData(CompetitionType.PLATE);

  return (
    <section className={styles.stack}>
      <div className={styles.hero}>
        <h1>{competition?.name ?? "Paul Flood Plate"}</h1>
        <p className={styles.muted}>
          {competition?.description ??
            "Season-by-season winners of the Paul Flood Plate with source confidence."}
        </p>
      </div>
      <WinnersTable records={competition?.winnerRecords ?? []} showAward={false} />
    </section>
  );
}
