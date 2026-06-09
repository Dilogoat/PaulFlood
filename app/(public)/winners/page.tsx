import type { Metadata } from "next";
import { CompetitionType, SourceConfidence } from "@prisma/client";
import { Suspense } from "react";
import { WinnersFilter } from "@/components/public/WinnersFilter";
import { WinnersTable } from "@/components/public/WinnersTable";
import styles from "../public.module.css";
import { getWinners } from "@/lib/data";

export const metadata: Metadata = {
  title: "Winners Register",
  description: "Searchable register of Paul Flood Cup and Plate winners by season."
};

export const revalidate = 60;

type SearchParams = Promise<{
  search?: string;
  competition?: string;
  seasonYear?: string;
  confidence?: string;
}>;

export default async function WinnersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const competition =
    params.competition === CompetitionType.CUP || params.competition === CompetitionType.PLATE
      ? params.competition
      : undefined;
  const seasonYear = params.seasonYear ? Number.parseInt(params.seasonYear, 10) : undefined;
  const confidence =
    params.confidence === SourceConfidence.VERIFIED ||
    params.confidence === SourceConfidence.NEEDS_CONFIRMATION ||
    params.confidence === SourceConfidence.UNVERIFIED
      ? params.confidence
      : undefined;

  const winners = await getWinners({
    search: params.search,
    competition,
    seasonYear: Number.isNaN(seasonYear) ? undefined : seasonYear,
    confidence
  });

  return (
    <section className={styles.stack}>
      <div className={styles.hero}>
        <h1>Winners Register</h1>
        <p className={styles.muted}>Unified searchable register for Cup and Plate winners by season.</p>
      </div>
      <Suspense fallback={null}>
        <WinnersFilter />
      </Suspense>
      <WinnersTable records={winners} />
    </section>
  );
}
