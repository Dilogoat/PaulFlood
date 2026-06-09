import type { MetadataRoute } from "next";

const routes = [
  "/",
  "/paul-flood",
  "/awards/cup",
  "/awards/plate",
  "/winners",
  "/media",
  "/sources"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8
  }));
}
