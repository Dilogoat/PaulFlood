import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteNav } from "@/components/public/SiteNav";
import styles from "./public.module.css";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </>
  );
}
