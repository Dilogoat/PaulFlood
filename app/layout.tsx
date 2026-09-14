import type { Metadata } from "next";
import "./globals.css";

const description =
  "Citation-backed archive of Paul Flood's legacy at St. Mary's Rugby Club.";

export const metadata: Metadata = {
  metadataBase: new URL("https://paulflood.sytes.net"),
  title: {
    default: "Paul Flood Heritage",
    template: "%s · Paul Flood Heritage"
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Paul Flood Heritage",
    title: "Paul Flood Heritage",
    description,
    url: "/",
    locale: "en_IE"
  },
  twitter: {
    card: "summary_large_image",
    title: "Paul Flood Heritage",
    description
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Paul Flood Heritage",
      url: "https://paulflood.sytes.net"
    },
    {
      "@type": "Person",
      name: "Paul Flood",
      birthDate: "1955",
      deathDate: "2008",
      description:
        "Player, coach, referee and mentor at St Mary's College RFC; pioneer of women's rugby and IRFU tag rugby.",
      image:
        "https://paulflood.sytes.net/uploads/2008/paul-flood-1955-2008.jpg"
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
