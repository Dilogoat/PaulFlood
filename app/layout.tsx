import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paul Flood Heritage",
  description: "Citation-backed archive of Paul Flood's legacy at St. Mary's Rugby Club."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
