import { MediaType, SourceConfidence } from "@prisma/client";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createCitation,
  createEvidenceLink,
  createHistoryEntry,
  createMedia,
  createWinner,
  deleteCitation,
  deleteHistoryEntry,
  deleteMedia,
  deleteWinner,
  updateCitation,
  updateHistoryEntry,
  updateMedia
} from "@/app/admin/actions";

function AdminSection({
  title,
  subtitle,
  defaultOpen = false,
  children
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="admin-section card" open={defaultOpen}>
      <summary>
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
        </div>
        <span className="admin-section-toggle">Expand</span>
      </summary>
      <div className="admin-section-body">{children}</div>
    </details>
  );
}

export default async function AdminPage() {
  await requireAdminSession();

  const [competitions, winners, historyEntries, mediaAssets, citations] = await Promise.all([
    prisma.competition.findMany({ orderBy: { name: "asc" } }),
    prisma.winnerRecord.findMany({ include: { competition: true, season: true }, orderBy: { season: { year: "desc" } } }),
    prisma.clubHistoryEntry.findMany({ include: { season: true }, orderBy: { createdAt: "desc" } }),
    prisma.mediaAsset.findMany({ include: { season: true }, orderBy: { createdAt: "desc" } }),
    prisma.citation.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return (
    <section className="admin-shell">
      <div className="hero">
        <h1>Admin Dashboard</h1>
        <p className="muted">Manage historical content, winners, citations, and evidence links.</p>
        <form action="/api/admin/logout" method="post">
          <button className="btn-secondary" type="submit">
            Logout
          </button>
        </form>
      </div>

      <AdminSection title="Add or Update Winner" subtitle="Create or replace a winner row by competition + season." defaultOpen>
        <form action={createWinner} className="form-grid">
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
          <label>Season Year<input name="seasonYear" type="number" required /></label>
          <label>Winner<input name="winnerName" required /></label>
          <label>Runner Up<input name="runnerUpName" /></label>
          <label>Score<input name="score" /></label>
          <label>Venue<input name="venue" /></label>
          <label>Summary<textarea name="summary" rows={3} /></label>
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
          <button type="submit">Save Winner</button>
        </form>
      </AdminSection>

      <AdminSection title="Add History Entry" subtitle="Add a timeline/history claim with confidence tagging.">
        <form action={createHistoryEntry} className="form-grid">
          <label>Season Year (optional)<input name="seasonYear" type="number" /></label>
          <label>Title<input name="title" required /></label>
          <label>Content<textarea name="content" rows={4} required /></label>
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
          <button type="submit">Save Entry</button>
        </form>
      </AdminSection>

      <AdminSection title="Add Media" subtitle="Register image/video/document metadata and source links.">
        <form action={createMedia} className="form-grid">
          <label>Title<input name="title" required /></label>
          <label>Description<textarea name="description" rows={3} /></label>
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
          <label>File Path (e.g. /uploads/2022/final.jpg)<input name="filePath" required /></label>
          <label>Source URL<input name="sourceUrl" /></label>
          <label>Credit<input name="credit" /></label>
          <label>Rights<input name="rights" /></label>
          <label>Season Year (optional)<input name="seasonYear" type="number" /></label>
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
          <button type="submit">Save Media</button>
        </form>
      </AdminSection>

      <AdminSection title="Add Citation" subtitle="Create a source record before linking evidence.">
        <form action={createCitation} className="form-grid">
          <label>Title<input name="title" required /></label>
          <label>Publisher<input name="publisher" /></label>
          <label>Author<input name="author" /></label>
          <label>Source URL<input name="sourceUrl" /></label>
          <label>Archive Ref<input name="archiveRef" /></label>
          <label>Notes<textarea name="notes" rows={3} /></label>
          <button type="submit">Save Citation</button>
        </form>
      </AdminSection>

      <AdminSection title="Link Citation to Evidence" subtitle="Attach citations to winners, history entries, and media.">
        <form action={createEvidenceLink} className="form-grid">
          <label>
            Citation
            <select name="citationId" required>
              <option value="">Select citation</option>
              {citations.map((citation) => (
                <option key={citation.id} value={citation.id}>
                  {citation.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Winner Record (optional)
            <select name="winnerRecordId">
              <option value="">None</option>
              {winners.map((winner) => (
                <option key={winner.id} value={winner.id}>
                  {winner.season.year} {winner.competition.name} - {winner.winnerName}
                </option>
              ))}
            </select>
          </label>
          <label>
            History Entry (optional)
            <select name="historyEntryId">
              <option value="">None</option>
              {historyEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Media Asset (optional)
            <select name="mediaAssetId">
              <option value="">None</option>
              {mediaAssets.map((media) => (
                <option key={media.id} value={media.id}>
                  {media.title}
                </option>
              ))}
            </select>
          </label>
          <label>Note<input name="note" /></label>
          <button type="submit">Create Link</button>
        </form>
      </AdminSection>

      <AdminSection title="Existing Records" subtitle="Review and maintain imported content. Delete actions are immediate.">
        <p className="muted">Delete actions are immediate.</p>
        <details className="admin-subsection" open>
          <summary>Winners ({winners.length})</summary>
          <div className="admin-subsection-body">
            {winners.map((winner) => (
              <form key={winner.id} action={deleteWinner} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="hidden" name="id" value={winner.id} />
                <span>{winner.season.year} - {winner.competition.name} - {winner.winnerName}</span>
                <button className="btn-secondary" type="submit">Delete</button>
              </form>
            ))}
          </div>
        </details>
        <details className="admin-subsection">
          <summary>History Entries ({historyEntries.length})</summary>
          <div className="admin-subsection-body">
            {historyEntries.map((entry) => (
              <div key={entry.id} className="card" style={{ marginBottom: 8 }}>
                <form action={updateHistoryEntry} className="form-grid">
                  <input type="hidden" name="id" value={entry.id} />
                  <input name="title" defaultValue={entry.title} />
                  <textarea name="content" defaultValue={entry.content} rows={2} />
                  <input name="seasonYear" type="number" defaultValue={entry.season?.year ?? undefined} />
                  <select name="sourceConfidence" defaultValue={entry.sourceConfidence}>
                    {Object.values(SourceConfidence).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <button type="submit">Update</button>
                </form>
                <form action={deleteHistoryEntry}><input type="hidden" name="id" value={entry.id} /><button className="btn-secondary" type="submit">Delete</button></form>
              </div>
            ))}
          </div>
        </details>
        <details className="admin-subsection">
          <summary>Media ({mediaAssets.length})</summary>
          <div className="admin-subsection-body">
            {mediaAssets.map((asset) => (
              <div key={asset.id} className="card" style={{ marginBottom: 8 }}>
                <form action={updateMedia} className="form-grid">
                  <input type="hidden" name="id" value={asset.id} />
                  <input name="title" defaultValue={asset.title} />
                  <input name="filePath" defaultValue={asset.filePath} />
                  <input name="sourceUrl" defaultValue={asset.sourceUrl ?? ""} />
                  <textarea name="description" defaultValue={asset.description ?? ""} rows={2} />
                  <input name="credit" defaultValue={asset.credit ?? ""} />
                  <input name="rights" defaultValue={asset.rights ?? ""} />
                  <input name="seasonYear" type="number" defaultValue={asset.season?.year ?? undefined} />
                  <select name="mediaType" defaultValue={asset.mediaType}>
                    {Object.values(MediaType).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <select name="sourceConfidence" defaultValue={asset.sourceConfidence}>
                    {Object.values(SourceConfidence).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <button type="submit">Update</button>
                </form>
                <form action={deleteMedia}><input type="hidden" name="id" value={asset.id} /><button className="btn-secondary" type="submit">Delete</button></form>
              </div>
            ))}
          </div>
        </details>
        <details className="admin-subsection">
          <summary>Citations ({citations.length})</summary>
          <div className="admin-subsection-body">
            {citations.map((citation) => (
              <div key={citation.id} className="card" style={{ marginBottom: 8 }}>
                <form action={updateCitation} className="form-grid">
                  <input type="hidden" name="id" value={citation.id} />
                  <input name="title" defaultValue={citation.title} />
                  <input name="publisher" defaultValue={citation.publisher ?? ""} />
                  <input name="author" defaultValue={citation.author ?? ""} />
                  <input name="sourceUrl" defaultValue={citation.sourceUrl ?? ""} />
                  <input name="archiveRef" defaultValue={citation.archiveRef ?? ""} />
                  <textarea name="notes" defaultValue={citation.notes ?? ""} rows={2} />
                  <button type="submit">Update</button>
                </form>
                <form action={deleteCitation}><input type="hidden" name="id" value={citation.id} /><button className="btn-secondary" type="submit">Delete</button></form>
              </div>
            ))}
          </div>
        </details>
      </AdminSection>
    </section>
  );
}
