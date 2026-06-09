"use client";

import Link from "next/link";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ width: "min(720px, 92vw)", margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Something went wrong</h1>
      <p>The archive could not load this page.</p>
      {process.env.NODE_ENV === "development" ? (
        <p style={{ color: "#57534e", fontSize: "0.9rem" }}>{error.message}</p>
      ) : null}
      <p>
        <button type="button" onClick={reset}>
          Try again
        </button>{" "}
        or <Link href="/">return home</Link>
      </p>
    </main>
  );
}
