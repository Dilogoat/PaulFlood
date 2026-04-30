import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Paul Flood Heritage",
  description: "History of Paul Flood, the Paul Flood Cup, and the Paul Flood Plate."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        <main className="shell">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
