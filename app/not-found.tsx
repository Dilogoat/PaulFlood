import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ width: "min(720px, 92vw)", margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Page not found</h1>
      <p>The page you requested is not in this archive.</p>
      <p>
        <Link href="/">Return home</Link>
      </p>
    </main>
  );
}
