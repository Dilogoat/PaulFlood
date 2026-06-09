import type { CompetitionType, MediaType, SourceConfidence } from "@prisma/client";

export type CitationSummary = {
  id: string;
  title: string;
  publisher: string | null;
  author: string | null;
  sourceUrl: string | null;
};

export type EvidenceLinkWithCitation = {
  id: string;
  note: string | null;
  citation: CitationSummary;
};

export type SeasonSummary = {
  id: string;
  year: number;
};

export type CompetitionSummary = {
  id: string;
  type: CompetitionType;
  name: string;
  description: string | null;
};

export type SiteOverview = {
  historyCount: number;
  winnerCount: number;
  citationCount: number;
  mediaCount: number;
};

export type PersonProfile = {
  id: string;
  fullName: string;
  roleTitle: string | null;
  biography: string | null;
  birthYear: number | null;
  deathYear: number | null;
};

export type WinnerRecordView = {
  id: string;
  winnerName: string;
  runnerUpName: string | null;
  score: string | null;
  venue: string | null;
  matchDate: Date | null;
  summary: string | null;
  sourceConfidence: SourceConfidence;
  season: SeasonSummary;
  competition: CompetitionSummary;
  evidenceLinks: EvidenceLinkWithCitation[];
};

export type ClubHistoryEntryView = {
  id: string;
  title: string;
  eventDate: Date | null;
  content: string;
  sourceConfidence: SourceConfidence;
  season: SeasonSummary | null;
  evidenceLinks: EvidenceLinkWithCitation[];
};

export type MediaAssetView = {
  id: string;
  title: string;
  description: string | null;
  mediaType: MediaType;
  filePath: string;
  sourceUrl: string | null;
  credit: string | null;
  rights: string | null;
  captureDate: Date | null;
  sourceConfidence: SourceConfidence;
  season: SeasonSummary | null;
  evidenceLinks: EvidenceLinkWithCitation[];
};

export type CitationView = {
  id: string;
  title: string;
  publisher: string | null;
  author: string | null;
  sourceUrl: string | null;
  archiveRef: string | null;
  publicationDate: Date | null;
  accessDate: Date | null;
  notes: string | null;
  evidenceLinks: {
    id: string;
    note: string | null;
    winnerRecord: { id: string; winnerName: string; season: SeasonSummary; competition: CompetitionSummary } | null;
    historyEntry: { id: string; title: string } | null;
    mediaAsset: { id: string; title: string } | null;
  }[];
};

export type AwardPageData = {
  id: string;
  type: CompetitionType;
  name: string;
  description: string | null;
  winnerRecords: WinnerRecordView[];
};

export type WinnersFilter = {
  competition?: CompetitionType;
  seasonYear?: number;
  search?: string;
  confidence?: SourceConfidence;
};
