import Image from "next/image";
import type { PaulFloodGalleryImage } from "@/lib/content/paul-flood-gallery";
import styles from "./bio-image-reel.module.css";

type BioImageReelProps = {
  images: PaulFloodGalleryImage[];
};

export function BioImageReel({ images }: BioImageReelProps) {
  if (!images.length) return null;

  return (
    <div className={styles.reelWrap} aria-label="Paul Flood and club heritage photographs">
      <div className={styles.reel}>
        {images.map((image) => (
          <figure key={image.src} className={styles.slide}>
            <div className={styles.imageFrame}>
              <Image
                src={image.src}
                alt={image.alt}
                width={420}
                height={280}
                className={styles.image}
                sizes="(max-width: 768px) 72vw, 320px"
              />
            </div>
            <figcaption className={styles.caption}>
              <span className={styles.captionTitle}>{image.caption}</span>
              <span className={styles.captionCredit}>{image.credit}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
