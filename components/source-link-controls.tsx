"use client";

import { useState } from "react";

type SourceLinkControlsProps = {
  url: string;
};

export function SourceLinkControls({ url }: SourceLinkControlsProps) {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="source-actions">
      <a href={url} target="_blank" rel="noreferrer" className="source-link">
        Open source
      </a>
      <button type="button" className="btn-secondary source-copy-btn" onClick={copyUrl}>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
