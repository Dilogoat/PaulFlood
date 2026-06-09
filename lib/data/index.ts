import type { CompetitionType } from "@prisma/client";
import type {
  AwardPageData,
  ClubHistoryEntryView,
  CitationView,
  MediaAssetView,
  PersonProfile,
  SiteOverview,
  WinnerRecordView,
  WinnersFilter
} from "./types";

export * from "./types";
export * from "./revalidation";

const NOT_IMPLEMENTED = "lib/data queries are implemented in issue #8";

/** Home page stat cards. */
export async function getSiteOverview(): Promise<SiteOverview> {
  throw new Error(NOT_IMPLEMENTED);
}

/** Cup or Plate competition page with ordered winners. */
export async function getAwardPageData(_type: CompetitionType): Promise<AwardPageData | null> {
  void _type;
  throw new Error(NOT_IMPLEMENTED);
}

/** Paul Flood club history timeline entries. */
export async function getPaulFloodHistory(): Promise<ClubHistoryEntryView[]> {
  throw new Error(NOT_IMPLEMENTED);
}

/** Primary Paul Flood biography (Person model). */
export async function getPerson(): Promise<PersonProfile | null> {
  throw new Error(NOT_IMPLEMENTED);
}

/** Unified winners register with optional filters for /winners search. */
export async function getWinners(_filter?: WinnersFilter): Promise<WinnerRecordView[]> {
  void _filter;
  throw new Error(NOT_IMPLEMENTED);
}

/** Media archive grid items. */
export async function getMediaAssets(): Promise<MediaAssetView[]> {
  throw new Error(NOT_IMPLEMENTED);
}

/** Citation index with linked evidence summaries. */
export async function getCitations(): Promise<CitationView[]> {
  throw new Error(NOT_IMPLEMENTED);
}
