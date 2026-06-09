"use client";

import { CompetitionType, SourceConfidence } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";
import styles from "@/app/(public)/public.module.css";

export function WinnersFilter() {
  const router = useRouter();
  const params = useSearchParams();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = new URLSearchParams();

    const search = String(data.get("search") ?? "").trim();
    const competition = String(data.get("competition") ?? "");
    const seasonYear = String(data.get("seasonYear") ?? "").trim();
    const confidence = String(data.get("confidence") ?? "");

    if (search) next.set("search", search);
    if (competition) next.set("competition", competition);
    if (seasonYear) next.set("seasonYear", seasonYear);
    if (confidence) next.set("confidence", confidence);

    const query = next.toString();
    router.push(query ? `/winners?${query}` : "/winners");
  }

  return (
    <form className={styles.filterBar} onSubmit={onSubmit}>
      <label>
        Search
        <input name="search" defaultValue={params.get("search") ?? ""} placeholder="Winner, venue..." />
      </label>
      <label>
        Award
        <select name="competition" defaultValue={params.get("competition") ?? ""}>
          <option value="">All</option>
          <option value={CompetitionType.CUP}>Cup</option>
          <option value={CompetitionType.PLATE}>Plate</option>
        </select>
      </label>
      <label>
        Season
        <input name="seasonYear" type="number" defaultValue={params.get("seasonYear") ?? ""} placeholder="e.g. 2022" />
      </label>
      <label>
        Confidence
        <select name="confidence" defaultValue={params.get("confidence") ?? ""}>
          <option value="">All</option>
          <option value={SourceConfidence.VERIFIED}>Verified</option>
          <option value={SourceConfidence.NEEDS_CONFIRMATION}>Needs confirmation</option>
          <option value={SourceConfidence.UNVERIFIED}>Unverified</option>
        </select>
      </label>
      <label>
        &nbsp;
        <button type="submit" className={styles.button}>
          Filter
        </button>
      </label>
    </form>
  );
}
