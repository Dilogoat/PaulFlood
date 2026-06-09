import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>Paul Flood Heritage — citation-backed archive of club legacy, cup, and plate history.</p>
      </div>
    </footer>
  );
}
