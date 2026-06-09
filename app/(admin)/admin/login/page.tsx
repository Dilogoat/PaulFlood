import styles from "../../admin.module.css";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "invalid";

  return (
    <section className={styles.panel}>
      <h1>Admin login</h1>
      <p className={styles.muted}>Sign in to manage heritage archive content.</p>
      {hasError ? <p className={styles.error}>Invalid username or password.</p> : null}
      <form className={styles.form} action="/api/auth/login" method="post">
        <label>
          Username
          <input name="username" type="text" autoComplete="username" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className={styles.button} type="submit">
          Sign in
        </button>
      </form>
    </section>
  );
}
