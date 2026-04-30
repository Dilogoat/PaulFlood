"use server";

import { MediaType, SourceConfidence } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { citationSchema, historySchema, mediaSchema, winnerSchema } from "@/lib/validation";

async function upsertSeason(year: number) {
  return prisma.season.upsert({
    where: { year },
    update: {},
    create: { year }
  });
}

export async function createWinner(formData: FormData) {
  const parsed = winnerSchema.parse({
    competitionId: formData.get("competitionId"),
    seasonYear: formData.get("seasonYear"),
    winnerName: formData.get("winnerName"),
    runnerUpName: formData.get("runnerUpName") || undefined,
    score: formData.get("score") || undefined,
    venue: formData.get("venue") || undefined,
    summary: formData.get("summary") || undefined,
    sourceConfidence: (formData.get("sourceConfidence") as SourceConfidence) ?? SourceConfidence.NEEDS_CONFIRMATION
  });

  const season = await upsertSeason(parsed.seasonYear);
  await prisma.winnerRecord.upsert({
    where: { competitionId_seasonId: { competitionId: parsed.competitionId, seasonId: season.id } },
    update: {
      winnerName: parsed.winnerName,
      runnerUpName: parsed.runnerUpName,
      score: parsed.score,
      venue: parsed.venue,
      summary: parsed.summary,
      sourceConfidence: parsed.sourceConfidence
    },
    create: {
      competitionId: parsed.competitionId,
      seasonId: season.id,
      winnerName: parsed.winnerName,
      runnerUpName: parsed.runnerUpName,
      score: parsed.score,
      venue: parsed.venue,
      summary: parsed.summary,
      sourceConfidence: parsed.sourceConfidence
    }
  });
  revalidatePath("/admin");
  revalidatePath("/winners");
  revalidatePath("/awards/cup");
  revalidatePath("/awards/plate");
}

export async function deleteWinner(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.winnerRecord.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function createHistoryEntry(formData: FormData) {
  const parsed = historySchema.parse({
    seasonYear: formData.get("seasonYear") || undefined,
    title: formData.get("title"),
    content: formData.get("content"),
    sourceConfidence: (formData.get("sourceConfidence") as SourceConfidence) ?? SourceConfidence.NEEDS_CONFIRMATION
  });

  const season = parsed.seasonYear ? await upsertSeason(parsed.seasonYear) : null;
  await prisma.clubHistoryEntry.create({
    data: {
      seasonId: season?.id,
      title: parsed.title,
      content: parsed.content,
      sourceConfidence: parsed.sourceConfidence
    }
  });

  revalidatePath("/admin");
  revalidatePath("/paul-flood");
}

export async function deleteHistoryEntry(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.clubHistoryEntry.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function createMedia(formData: FormData) {
  const parsed = mediaSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    mediaType: (formData.get("mediaType") as MediaType) ?? MediaType.IMAGE,
    filePath: formData.get("filePath"),
    sourceUrl: formData.get("sourceUrl") || undefined,
    credit: formData.get("credit") || undefined,
    rights: formData.get("rights") || undefined,
    seasonYear: formData.get("seasonYear") || undefined,
    sourceConfidence: (formData.get("sourceConfidence") as SourceConfidence) ?? SourceConfidence.NEEDS_CONFIRMATION
  });

  const season = parsed.seasonYear ? await upsertSeason(parsed.seasonYear) : null;
  await prisma.mediaAsset.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      mediaType: parsed.mediaType,
      filePath: parsed.filePath,
      sourceUrl: parsed.sourceUrl || null,
      credit: parsed.credit,
      rights: parsed.rights,
      seasonId: season?.id,
      sourceConfidence: parsed.sourceConfidence
    }
  });

  revalidatePath("/admin");
  revalidatePath("/media");
}

export async function deleteMedia(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function createCitation(formData: FormData) {
  const parsed = citationSchema.parse({
    title: formData.get("title"),
    publisher: formData.get("publisher") || undefined,
    author: formData.get("author") || undefined,
    sourceUrl: formData.get("sourceUrl") || undefined,
    archiveRef: formData.get("archiveRef") || undefined,
    notes: formData.get("notes") || undefined
  });

  await prisma.citation.create({
    data: {
      title: parsed.title,
      publisher: parsed.publisher,
      author: parsed.author,
      sourceUrl: parsed.sourceUrl || null,
      archiveRef: parsed.archiveRef,
      notes: parsed.notes,
      accessDate: new Date()
    }
  });
  revalidatePath("/admin");
  revalidatePath("/sources");
}

export async function deleteCitation(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.citation.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function updateHistoryEntry(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const parsed = historySchema.parse({
    seasonYear: formData.get("seasonYear") || undefined,
    title: formData.get("title"),
    content: formData.get("content"),
    sourceConfidence: (formData.get("sourceConfidence") as SourceConfidence) ?? SourceConfidence.NEEDS_CONFIRMATION
  });
  const season = parsed.seasonYear ? await upsertSeason(parsed.seasonYear) : null;
  await prisma.clubHistoryEntry.update({
    where: { id },
    data: {
      title: parsed.title,
      content: parsed.content,
      seasonId: season?.id ?? null,
      sourceConfidence: parsed.sourceConfidence
    }
  });
  revalidatePath("/admin");
}

export async function updateMedia(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const parsed = mediaSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    mediaType: (formData.get("mediaType") as MediaType) ?? MediaType.IMAGE,
    filePath: formData.get("filePath"),
    sourceUrl: formData.get("sourceUrl") || undefined,
    credit: formData.get("credit") || undefined,
    rights: formData.get("rights") || undefined,
    seasonYear: formData.get("seasonYear") || undefined,
    sourceConfidence: (formData.get("sourceConfidence") as SourceConfidence) ?? SourceConfidence.NEEDS_CONFIRMATION
  });
  const season = parsed.seasonYear ? await upsertSeason(parsed.seasonYear) : null;
  await prisma.mediaAsset.update({
    where: { id },
    data: {
      title: parsed.title,
      description: parsed.description,
      mediaType: parsed.mediaType,
      filePath: parsed.filePath,
      sourceUrl: parsed.sourceUrl || null,
      credit: parsed.credit,
      rights: parsed.rights,
      seasonId: season?.id ?? null,
      sourceConfidence: parsed.sourceConfidence
    }
  });
  revalidatePath("/admin");
}

export async function updateCitation(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const parsed = citationSchema.parse({
    title: formData.get("title"),
    publisher: formData.get("publisher") || undefined,
    author: formData.get("author") || undefined,
    sourceUrl: formData.get("sourceUrl") || undefined,
    archiveRef: formData.get("archiveRef") || undefined,
    notes: formData.get("notes") || undefined
  });
  await prisma.citation.update({
    where: { id },
    data: {
      title: parsed.title,
      publisher: parsed.publisher,
      author: parsed.author,
      sourceUrl: parsed.sourceUrl || null,
      archiveRef: parsed.archiveRef,
      notes: parsed.notes
    }
  });
  revalidatePath("/admin");
}

export async function createEvidenceLink(formData: FormData) {
  const citationId = String(formData.get("citationId") ?? "");
  const winnerRecordId = String(formData.get("winnerRecordId") ?? "") || null;
  const historyEntryId = String(formData.get("historyEntryId") ?? "") || null;
  const mediaAssetId = String(formData.get("mediaAssetId") ?? "") || null;
  const note = String(formData.get("note") ?? "") || null;

  if (!citationId || (!winnerRecordId && !historyEntryId && !mediaAssetId)) {
    return;
  }

  await prisma.evidenceLink.create({
    data: {
      citationId,
      winnerRecordId,
      historyEntryId,
      mediaAssetId,
      note
    }
  });

  revalidatePath("/admin");
  revalidatePath("/winners");
  revalidatePath("/paul-flood");
  revalidatePath("/media");
  revalidatePath("/sources");
}
