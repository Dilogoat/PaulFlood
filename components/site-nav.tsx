import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/paul-flood", label: "Paul Flood" },
  { href: "/awards/cup", label: "Cup" },
  { href: "/awards/plate", label: "Plate" },
  { href: "/winners", label: "Winners" },
  { href: "/media", label: "Media" },
  { href: "/sources", label: "Sources" }
];

export function SiteNav() {
  return (
    <header className="header">
      <div className="shell nav-inner">
        <Link href="/" className="brand">
          Paul Flood Heritage
        </Link>
        <nav className="nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
