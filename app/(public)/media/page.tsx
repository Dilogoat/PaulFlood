import type { Metadata } from "next";
import Image from "next/image";
import { CitationBadge } from "@/components/ui/CitationBadge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import styles from "../public.module.css";
import { getMediaAssets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Media Archive",
  description: "Photos and supporting media for Paul Flood, the Cup, and the Plate."
};

export const revalidate = 60;

export default async function MediaPage() {
  const assets = await getMediaAssets();

  return (
    <section className={styles.stack}>
      <div className={styles.hero}>
        <h1>Media Archive</h1>
        <p className={styles.muted}>
          Photos and supporting media with credits, rights notes, and citation links.
        </p>
      </div>
      <div className={`${styles.grid} ${styles.gridFour}`}>
        {assets.map((asset) => (
          <article className={styles.card} key={asset.id}>
            {asset.mediaType === "IMAGE" ? (
              <Image
                src={asset.filePath}
                alt={asset.title}
                width={420}
                height={260}
                className={styles.mediaImage}
              />
            ) : (
              <p className={styles.muted}>Non-image asset: {asset.mediaType}</p>
            )}
            <h3>{asset.title}</h3>
            {asset.description ? <p className={styles.muted}>{asset.description}</p> : null}
            {asset.credit ? <p className={styles.muted}>Credit: {asset.credit}</p> : null}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <ConfidenceBadge value={asset.sourceConfidence} />
              <CitationBadge citations={asset.evidenceLinks.map((link) => link.citation)} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
