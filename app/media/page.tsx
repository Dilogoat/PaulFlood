import Image from "next/image";
import { getMediaAssets } from "@/lib/data";
import { CitationBadge } from "@/components/citation-badge";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const assets = await getMediaAssets();

  return (
    <section className="stack">
      <div className="hero">
        <h1>Media Archive</h1>
        <p className="muted">
          Photos and supporting media for Paul Flood, the Cup, and the Plate with source tracking.
        </p>
      </div>
      <div className="grid four">
        {assets.map((asset) => (
          <article className="card" key={asset.id}>
            {asset.mediaType === "IMAGE" ? (
              <Image
                src={asset.filePath}
                alt={asset.title}
                width={420}
                height={260}
                style={{ width: "100%", height: "auto", borderRadius: 8 }}
              />
            ) : (
              <p className="muted">Non-image asset: {asset.mediaType}</p>
            )}
            <h3>{asset.title}</h3>
            <p className="muted">{asset.description}</p>
            <p className="muted">Confidence: {asset.sourceConfidence.replaceAll("_", " ")}</p>
            <CitationBadge citations={asset.evidenceLinks.map((link) => link.citation)} />
          </article>
        ))}
      </div>
    </section>
  );
}
