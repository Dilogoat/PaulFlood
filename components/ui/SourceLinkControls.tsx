"use client";

import styles from "./ui.module.css";

type SourceLinkControlsProps = {
  sourceUrl?: string | null;
};

export function SourceLinkControls({ sourceUrl }: SourceLinkControlsProps) {
  if (!sourceUrl) return null;

  return (
    <div className={styles.sourceControls}>
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        Open source
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(sourceUrl);
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        Copy link
      </button>
    </div>
  );
}
