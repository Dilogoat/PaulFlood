"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/(admin)/admin.module.css";

type MediaUploadFieldProps = {
  filePathInputId?: string;
};

export function MediaUploadField({ filePathInputId = "media-file-path" }: MediaUploadFieldProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: data
      });
      const payload = (await response.json()) as { filePath?: string; error?: string };

      if (!response.ok || !payload.filePath) {
        setStatus(payload.error ?? "Upload failed");
        return;
      }

      const input = document.getElementById(filePathInputId) as HTMLInputElement | null;
      if (input) {
        input.value = payload.filePath;
      }
      setStatus(`Uploaded to ${payload.filePath}`);
      form.reset();
    } catch {
      setStatus("Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.uploadBox}>
      <form className={styles.formInline} onSubmit={onUpload}>
        <label>
          Season year
          <input name="seasonYear" type="number" defaultValue={new Date().getFullYear()} />
        </label>
        <label>
          Image file
          <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required />
        </label>
        <button type="submit" className={styles.button} disabled={busy}>
          {busy ? "Uploading…" : "Upload image"}
        </button>
      </form>
      {status ? <p className={styles.muted}>{status}</p> : null}
    </div>
  );
}
