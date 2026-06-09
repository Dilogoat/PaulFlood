import type { Citation, Competition, EvidenceLink, Season } from "@prisma/client";
import type {
  CitationSummary,
  CitationView,
  ClubHistoryEntryView,
  CompetitionSummary,
  EvidenceLinkWithCitation,
  MediaAssetView,
  PersonProfile,
  SeasonSummary,
  WinnerRecordView
} from "./types";

type EvidenceLinkWithCitationRow = EvidenceLink & { citation: Citation };

export function mapCitationSummary(citation: Citation): CitationSummary {
  return {
    id: citation.id,
    title: citation.title,
    publisher: citation.publisher,
    author: citation.author,
    sourceUrl: citation.sourceUrl
  };
}

export function mapEvidenceLinks(links: EvidenceLinkWithCitationRow[]): EvidenceLinkWithCitation[] {
  return links.map((link) => ({
    id: link.id,
    note: link.note,
    citation: mapCitationSummary(link.citation)
  }));
}

export function mapSeason(season: Pick<Season, "id" | "year">): SeasonSummary {
  return { id: season.id, year: season.year };
}

export function mapCompetition(competition: Pick<Competition, "id" | "type" | "name" | "description">): CompetitionSummary {
  return {
    id: competition.id,
    type: competition.type,
    name: competition.name,
    description: competition.description
  };
}

type WinnerRecordRow = {
  id: string;
  winnerName: string;
  runnerUpName: string | null;
  score: string | null;
  venue: string | null;
  matchDate: Date | null;
  summary: string | null;
  sourceConfidence: WinnerRecordView["sourceConfidence"];
  season: Pick<Season, "id" | "year">;
  competition: Pick<Competition, "id" | "type" | "name" | "description">;
  evidenceLinks: EvidenceLinkWithCitationRow[];
};

export function mapWinnerRecord(record: WinnerRecordRow): WinnerRecordView {
  return {
    id: record.id,
    winnerName: record.winnerName,
    runnerUpName: record.runnerUpName,
    score: record.score,
    venue: record.venue,
    matchDate: record.matchDate,
    summary: record.summary,
    sourceConfidence: record.sourceConfidence,
    season: mapSeason(record.season),
    competition: mapCompetition(record.competition),
    evidenceLinks: mapEvidenceLinks(record.evidenceLinks)
  };
}

type HistoryEntryRow = {
  id: string;
  title: string;
  eventDate: Date | null;
  content: string;
  sourceConfidence: ClubHistoryEntryView["sourceConfidence"];
  season: Pick<Season, "id" | "year"> | null;
  evidenceLinks: EvidenceLinkWithCitationRow[];
};

export function mapHistoryEntry(entry: HistoryEntryRow): ClubHistoryEntryView {
  return {
    id: entry.id,
    title: entry.title,
    eventDate: entry.eventDate,
    content: entry.content,
    sourceConfidence: entry.sourceConfidence,
    season: entry.season ? mapSeason(entry.season) : null,
    evidenceLinks: mapEvidenceLinks(entry.evidenceLinks)
  };
}

type MediaAssetRow = {
  id: string;
  title: string;
  description: string | null;
  mediaType: MediaAssetView["mediaType"];
  filePath: string;
  sourceUrl: string | null;
  credit: string | null;
  rights: string | null;
  captureDate: Date | null;
  sourceConfidence: MediaAssetView["sourceConfidence"];
  season: Pick<Season, "id" | "year"> | null;
  evidenceLinks: EvidenceLinkWithCitationRow[];
};

export function mapMediaAsset(asset: MediaAssetRow): MediaAssetView {
  return {
    id: asset.id,
    title: asset.title,
    description: asset.description,
    mediaType: asset.mediaType,
    filePath: asset.filePath,
    sourceUrl: asset.sourceUrl,
    credit: asset.credit,
    rights: asset.rights,
    captureDate: asset.captureDate,
    sourceConfidence: asset.sourceConfidence,
    season: asset.season ? mapSeason(asset.season) : null,
    evidenceLinks: mapEvidenceLinks(asset.evidenceLinks)
  };
}

type CitationRow = Citation & {
  evidenceLinks: {
    id: string;
    note: string | null;
    winnerRecord: {
      id: string;
      winnerName: string;
      season: Pick<Season, "id" | "year">;
      competition: Pick<Competition, "id" | "type" | "name" | "description">;
    } | null;
    historyEntry: { id: string; title: string } | null;
    mediaAsset: { id: string; title: string } | null;
  }[];
};

export function mapCitationView(citation: CitationRow): CitationView {
  return {
    id: citation.id,
    title: citation.title,
    publisher: citation.publisher,
    author: citation.author,
    sourceUrl: citation.sourceUrl,
    archiveRef: citation.archiveRef,
    publicationDate: citation.publicationDate,
    accessDate: citation.accessDate,
    notes: citation.notes,
    evidenceLinks: citation.evidenceLinks.map((link) => ({
      id: link.id,
      note: link.note,
      winnerRecord: link.winnerRecord
        ? {
            id: link.winnerRecord.id,
            winnerName: link.winnerRecord.winnerName,
            season: mapSeason(link.winnerRecord.season),
            competition: mapCompetition(link.winnerRecord.competition)
          }
        : null,
      historyEntry: link.historyEntry,
      mediaAsset: link.mediaAsset
    }))
  };
}

export function mapPerson(person: {
  id: string;
  fullName: string;
  roleTitle: string | null;
  biography: string | null;
  birthYear: number | null;
  deathYear: number | null;
}): PersonProfile {
  return {
    id: person.id,
    fullName: person.fullName,
    roleTitle: person.roleTitle,
    biography: person.biography,
    birthYear: person.birthYear,
    deathYear: person.deathYear
  };
}
