"use server";

import { MediaType, SourceConfidence } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidatePublicPaths } from "@/lib/admin/revalidate";
import { prisma } from "@/lib/db/prisma";
import {
  citationSchema,
  evidenceLinkSchema,
  historySchema,
  mediaSchema,
  personSchema,
  winnerSchema
} from "@/lib/validation";

async function upsertSeason(year: number) {
  return prisma.season.upsert({
    where: { year },
    update: {},
    create: { year }
  });
}

export async function createWinner(formData: FormData) {
  await requireAdmin();

  const parsed = winnerSchema.parse({
    competitionId: formData.get("competitionId"),
    seasonYear: formData.get("seasonYear"),
    winnerName: formData.get("winnerName"),
    runnerUpName: formData.get("runnerUpName") || undefined,
    score: formData.get("score") || undefined,
    venue: formData.get("venue") || undefined,
    summary: formData.get("summary") || undefined,
    sourceConfidence:
      (formData.get("sourceConfidence") as SourceConfidence) ?? SourceConfidence.NEEDS_CONFIRMATION
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

  revalidatePublicPaths();
}

export async function deleteWinner(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.winnerRecord.delete({ where: { id } });
  revalidatePublicPaths();
}

export async function createHistoryEntry(formData: FormData) {
  await requireAdmin();

  const parsed = historySchema.parse({
    seasonYear: formData.get("seasonYear") || undefined,
    title: formData.get("title"),
    content: formData.get("content"),
    sourceConfidence:
      (formData.get("sourceConfidence") as SourceConfidence) ?? SourceConfidence.NEEDS_CONFIRMATION
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

  revalidatePublicPaths();
}

export async function updateHistoryEntry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const parsed = historySchema.parse({
    seasonYear: formData.get("seasonYear") || undefined,
    title: formData.get("title"),
    content: formData.get("content"),
    sourceConfidence:
      (formData.get("sourceConfidence") as SourceConfidence) ?? SourceConfidence.NEEDS_CONFIRMATION
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

  revalidatePublicPaths();
}

export async function deleteHistoryEntry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.clubHistoryEntry.delete({ where: { id } });
  revalidatePublicPaths();
}

export async function createMedia(formData: FormData) {
  await requireAdmin();

  const parsed = mediaSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    mediaType: (formData.get("mediaType") as MediaType) ?? MediaType.IMAGE,
    filePath: formData.get("filePath"),
    sourceUrl: formData.get("sourceUrl") || undefined,
    credit: formData.get("credit") || undefined,
    rights: formData.get("rights") || undefined,
    seasonYear: formData.get("seasonYear") || undefined,
    sourceConfidence:
      (formData.get("sourceConfidence") as SourceConfidence) ?? SourceConfidence.NEEDS_CONFIRMATION
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

  revalidatePublicPaths();
}

export async function updateMedia(formData: FormData) {
  await requireAdmin();
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
    sourceConfidence:
      (formData.get("sourceConfidence") as SourceConfidence) ?? SourceConfidence.NEEDS_CONFIRMATION
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

  revalidatePublicPaths();
}

export async function deleteMedia(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePublicPaths();
}

export async function createCitation(formData: FormData) {
  await requireAdmin();

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

  revalidatePublicPaths();
}

export async function updateCitation(formData: FormData) {
  await requireAdmin();
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

  revalidatePublicPaths();
}

export async function deleteCitation(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.citation.delete({ where: { id } });
  revalidatePublicPaths();
}

export async function createEvidenceLink(formData: FormData) {
  await requireAdmin();

  const parsed = evidenceLinkSchema.parse({
    citationId: formData.get("citationId"),
    winnerRecordId: formData.get("winnerRecordId") || undefined,
    historyEntryId: formData.get("historyEntryId") || undefined,
    mediaAssetId: formData.get("mediaAssetId") || undefined,
    note: formData.get("note") || undefined
  });

  await prisma.evidenceLink.create({
    data: {
      citationId: parsed.citationId,
      winnerRecordId: parsed.winnerRecordId,
      historyEntryId: parsed.historyEntryId,
      mediaAssetId: parsed.mediaAssetId,
      note: parsed.note
    }
  });

  revalidatePublicPaths();
}

export async function deleteEvidenceLink(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.evidenceLink.delete({ where: { id } });
  revalidatePublicPaths();
}

export async function updatePerson(formData: FormData) {
  await requireAdmin();

  const parsed = personSchema.parse({
    fullName: formData.get("fullName"),
    roleTitle: formData.get("roleTitle") || undefined,
    biography: formData.get("biography") || undefined,
    birthYear: formData.get("birthYear") || undefined,
    deathYear: formData.get("deathYear") || undefined
  });

  const existing = await prisma.person.findFirst({ orderBy: { createdAt: "asc" } });
  if (existing) {
    await prisma.person.update({
      where: { id: existing.id },
      data: parsed
    });
  } else {
    await prisma.person.create({ data: parsed });
  }

  revalidatePublicPaths();
}
