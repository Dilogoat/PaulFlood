import styles from "@/app/(admin)/admin.module.css";

type AdminSectionProps = {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function AdminSection({ title, subtitle, defaultOpen = false, children }: AdminSectionProps) {
  return (
    <details className={styles.section} open={defaultOpen}>
      <summary className={styles.sectionSummary}>
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className={styles.muted}>{subtitle}</p> : null}
        </div>
        <span className={styles.sectionToggle}>Expand</span>
      </summary>
      <div className={styles.sectionBody}>{children}</div>
    </details>
  );
}
