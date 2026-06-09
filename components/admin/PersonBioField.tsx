import styles from "@/app/(admin)/admin.module.css";

type PersonBioFieldProps = {
  defaultValue?: string | null;
};

export function PersonBioField({ defaultValue }: PersonBioFieldProps) {
  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <label>
        Biography (Markdown)
        <textarea
          name="biography"
          rows={18}
          defaultValue={defaultValue ?? ""}
          className={styles.bioTextarea}
          spellCheck
        />
      </label>
      <details className={styles.bioHelp}>
        <summary>Formatting guide</summary>
        <ul>
          <li>
            <code>## Section title</code> — section heading on the public bio page
          </li>
          <li>Blank line between paragraphs</li>
          <li>
            <code>- bullet item</code> — bullet lists (e.g. honours, references)
          </li>
          <li>
            <code>[link label](https://example.com)</code> — external reference links
          </li>
        </ul>
        <p className={styles.muted}>
          Changes save to the database immediately. Re-running CSV import will restore content from{" "}
          <code>content/person/biography.md</code>.
        </p>
      </details>
    </div>
  );
}
