"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./site-nav.module.css";

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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          Paul Flood Heritage
        </Link>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
        <nav className={open ? styles.navOpen : styles.nav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.linkActive : styles.link}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
