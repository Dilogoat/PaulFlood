import { requireAdmin } from "@/lib/auth/require-admin";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <section className={styles.dashboard}>
      <h1>Dashboard</h1>
      <p className={styles.muted}>CMS modules will be added in issues #17–#22.</p>
      <div className={styles.dashboardActions}>
        <form action="/api/auth/logout" method="post">
          <button className={styles.button} type="submit">
            Sign out
          </button>
        </form>
      </div>
    </section>
  );
}
