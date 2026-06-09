import { MediaType, SourceConfidence } from "@prisma/client";
import { z } from "zod";

export const winnerSchema = z.object({
  competitionId: z.string().min(1),
  seasonYear: z.coerce.number().int().min(1900).max(2200),
  winnerName: z.string().min(2),
  runnerUpName: z.string().optional(),
  score: z.string().optional(),
  venue: z.string().optional(),
  summary: z.string().optional(),
  sourceConfidence: z.nativeEnum(SourceConfidence)
});

export const historySchema = z.object({
  seasonYear: z.coerce.number().int().min(1900).max(2200).optional(),
  title: z.string().min(3),
  content: z.string().min(10),
  sourceConfidence: z.nativeEnum(SourceConfidence)
});

export const mediaSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  mediaType: z.nativeEnum(MediaType),
  filePath: z.string().min(3),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  credit: z.string().optional(),
  rights: z.string().optional(),
  seasonYear: z.coerce.number().int().min(1900).max(2200).optional(),
  sourceConfidence: z.nativeEnum(SourceConfidence)
});

export const citationSchema = z.object({
  title: z.string().min(3),
  publisher: z.string().optional(),
  author: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  archiveRef: z.string().optional(),
  notes: z.string().optional()
});

export const evidenceLinkSchema = z
  .object({
    citationId: z.string().min(1),
    winnerRecordId: z.string().optional(),
    historyEntryId: z.string().optional(),
    mediaAssetId: z.string().optional(),
    note: z.string().optional()
  })
  .refine(
    (value) => Boolean(value.winnerRecordId || value.historyEntryId || value.mediaAssetId),
    { message: "Link must target a winner, history entry, or media asset." }
  );

export const personSchema = z.object({
  fullName: z.string().min(2),
  roleTitle: z.string().optional(),
  biography: z.string().optional(),
  birthYear: z.coerce.number().int().min(1800).max(2200).optional(),
  deathYear: z.coerce.number().int().min(1800).max(2200).optional()
});
