import type { Metadata } from "next";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Admin | Paul Flood Heritage",
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <strong>Paul Flood Heritage — Admin</strong>
      </header>
      {children}
    </div>
  );
}
