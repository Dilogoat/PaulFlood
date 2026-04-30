type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <section className="shell" style={{ maxWidth: 480, paddingTop: 40 }}>
      <div className="card">
        <h1>Admin Login</h1>
        <p className="muted">Manage winners, citations, history, and media.</p>
        {params.error ? <p className="badge warning">Invalid credentials</p> : null}
        <form action="/api/admin/login" method="POST" className="form-grid">
          <label>
            Username
            <input type="text" name="username" required />
          </label>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </section>
  );
}
