import { MediaType, SourceConfidence } from "@prisma/client";
import { AdminSection } from "@/components/admin/AdminSection";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/db/prisma";
import {
  createCitation,
  createEvidenceLink,
  createHistoryEntry,
  createMedia,
  createWinner,
  deleteCitation,
  deleteEvidenceLink,
  deleteHistoryEntry,
  deleteMedia,
  deleteWinner,
  updatePerson
} from "./actions";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [person, competitions, winners, historyEntries, mediaAssets, citations, evidenceLinks] =
    await Promise.all([
      prisma.person.findFirst({ orderBy: { createdAt: "asc" } }),
      prisma.competition.findMany({ orderBy: { name: "asc" } }),
      prisma.winnerRecord.findMany({
        include: { competition: true, season: true },
        orderBy: { season: { year: "desc" } }
      }),
      prisma.clubHistoryEntry.findMany({
        include: { season: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.mediaAsset.findMany({
        include: { season: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.citation.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.evidenceLink.findMany({
        include: {
          citation: true,
          winnerRecord: { include: { season: true, competition: true } },
          historyEntry: true,
          mediaAsset: true
        },
        orderBy: { createdAt: "desc" }
      })
    ]);

  return (
    <section className={styles.dashboard}>
      <h1>Dashboard</h1>
      <p className={styles.muted}>Manage winners, history, media, citations, and evidence links.</p>
      <div className={styles.dashboardActions}>
        <form action="/api/auth/logout" method="post">
          <button className={styles.button} type="submit">
            Sign out
          </button>
        </form>
      </div>

      <AdminSection title="Paul Flood profile" subtitle="Biography shown on the public Paul Flood page." defaultOpen>
        <form action={updatePerson} className={styles.formGrid}>
          <label>
            Full name
            <input name="fullName" defaultValue={person?.fullName ?? "Paul Flood"} required />
          </label>
          <label>
            Role title
            <input name="roleTitle" defaultValue={person?.roleTitle ?? ""} />
          </label>
          <label>
            Birth year
            <input name="birthYear" type="number" defaultValue={person?.birthYear ?? ""} />
          </label>
          <label>
            Death year
            <input name="deathYear" type="number" defaultValue={person?.deathYear ?? ""} />
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            Biography
            <textarea name="biography" rows={5} defaultValue={person?.biography ?? ""} />
          </label>
          <button type="submit">Save profile</button>
        </form>
      </AdminSection>

      <AdminSection title="Add or update winner" subtitle="Upserts by competition + season." defaultOpen>
        <form action={createWinner} className={styles.formGrid}>
          <label>
            Competition
            <select name="competitionId" required>
              {competitions.map((competition) => (
                <option key={competition.id} value={competition.id}>
                  {competition.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Season year
            <input name="seasonYear" type="number" required />
          </label>
          <label>
            Winner
            <input name="winnerName" required />
          </label>
          <label>
            Runner up
            <input name="runnerUpName" />
          </label>
          <label>
            Score
            <input name="score" />
          </label>
          <label>
            Venue
            <input name="venue" />
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            Summary
            <textarea name="summary" rows={2} />
          </label>
          <label>
            Confidence
            <select name="sourceConfidence" defaultValue={SourceConfidence.NEEDS_CONFIRMATION}>
              {Object.values(SourceConfidence).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Save winner</button>
        </form>
        <div className={styles.recordList}>
          {winners.map((winner) => (
            <div key={winner.id} className={styles.recordCard}>
              <h3>
                {winner.season.year} — {winner.competition.name}: {winner.winnerName}
              </h3>
              <p className={styles.muted}>{winner.runnerUpName ? `vs ${winner.runnerUpName}` : "No runner up"}</p>
              <form action={deleteWinner} className={styles.recordActions}>
                <input type="hidden" name="id" value={winner.id} />
                <button type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="History entries" subtitle="Timeline content for /paul-flood.">
        <form action={createHistoryEntry} className={styles.formGrid}>
          <label>
            Season year (optional)
            <input name="seasonYear" type="number" />
          </label>
          <label>
            Title
            <input name="title" required />
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            Content
            <textarea name="content" rows={4} required />
          </label>
          <label>
            Confidence
            <select name="sourceConfidence" defaultValue={SourceConfidence.NEEDS_CONFIRMATION}>
              {Object.values(SourceConfidence).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Save entry</button>
        </form>
        <div className={styles.recordList}>
          {historyEntries.map((entry) => (
            <div key={entry.id} className={styles.recordCard}>
              <h3>{entry.title}</h3>
              <p className={styles.muted}>{entry.season ? `Season ${entry.season.year}` : "No season"}</p>
              <form action={deleteHistoryEntry} className={styles.recordActions}>
                <input type="hidden" name="id" value={entry.id} />
                <button type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Media" subtitle="Register images and metadata for /media.">
        <MediaUploadField filePathInputId="media-file-path" />
        <form action={createMedia} className={styles.formGrid}>
          <label>
            Title
            <input name="title" required />
          </label>
          <label>
            Type
            <select name="mediaType" defaultValue={MediaType.IMAGE}>
              {Object.values(MediaType).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            File path
            <input id="media-file-path" name="filePath" required placeholder="/uploads/2022/example.jpg" />
          </label>
          <label>
            Source URL
            <input name="sourceUrl" />
          </label>
          <label>
            Credit
            <input name="credit" />
          </label>
          <label>
            Rights
            <input name="rights" />
          </label>
          <label>
            Season year
            <input name="seasonYear" type="number" />
          </label>
          <label>
            Confidence
            <select name="sourceConfidence" defaultValue={SourceConfidence.NEEDS_CONFIRMATION}>
              {Object.values(SourceConfidence).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Save media</button>
        </form>
        <div className={styles.recordList}>
          {mediaAssets.map((asset) => (
            <div key={asset.id} className={styles.recordCard}>
              <h3>{asset.title}</h3>
              <p className={styles.muted}>{asset.filePath}</p>
              <form action={deleteMedia} className={styles.recordActions}>
                <input type="hidden" name="id" value={asset.id} />
                <button type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Citations" subtitle="Source records for /sources.">
        <form action={createCitation} className={styles.formGrid}>
          <label>
            Title
            <input name="title" required />
          </label>
          <label>
            Author
            <input name="author" />
          </label>
          <label>
            Publisher
            <input name="publisher" />
          </label>
          <label>
            Source URL
            <input name="sourceUrl" />
          </label>
          <label>
            Archive ref
            <input name="archiveRef" />
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            Notes
            <textarea name="notes" rows={2} />
          </label>
          <button type="submit">Save citation</button>
        </form>
        <div className={styles.recordList}>
          {citations.map((citation) => (
            <div key={citation.id} className={styles.recordCard}>
              <h3>{citation.title}</h3>
              <p className={styles.muted}>{citation.author ?? citation.publisher ?? "No author"}</p>
              <form action={deleteCitation} className={styles.recordActions}>
                <input type="hidden" name="id" value={citation.id} />
                <button type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Evidence links" subtitle="Connect citations to winners, history, or media.">
        <form action={createEvidenceLink} className={styles.formGrid}>
          <label>
            Citation
            <select name="citationId" required>
              {citations.map((citation) => (
                <option key={citation.id} value={citation.id}>
                  {citation.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Winner (optional)
            <select name="winnerRecordId" defaultValue="">
              <option value="">None</option>
              {winners.map((winner) => (
                <option key={winner.id} value={winner.id}>
                  {winner.season.year} {winner.competition.name}: {winner.winnerName}
                </option>
              ))}
            </select>
          </label>
          <label>
            History entry (optional)
            <select name="historyEntryId" defaultValue="">
              <option value="">None</option>
              {historyEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Media asset (optional)
            <select name="mediaAssetId" defaultValue="">
              <option value="">None</option>
              {mediaAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.title}
                </option>
              ))}
            </select>
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            Note
            <input name="note" />
          </label>
          <button type="submit">Create link</button>
        </form>
        <div className={styles.recordList}>
          {evidenceLinks.map((link) => (
            <div key={link.id} className={styles.recordCard}>
              <h3>{link.citation.title}</h3>
              <p className={styles.muted}>
                {link.winnerRecord
                  ? `Winner: ${link.winnerRecord.winnerName} (${link.winnerRecord.season.year})`
                  : null}
                {link.historyEntry ? `History: ${link.historyEntry.title}` : null}
                {link.mediaAsset ? `Media: ${link.mediaAsset.title}` : null}
              </p>
              <form action={deleteEvidenceLink} className={styles.recordActions}>
                <input type="hidden" name="id" value={link.id} />
                <button type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </AdminSection>
    </section>
  );
}
