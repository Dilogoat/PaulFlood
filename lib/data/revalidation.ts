/** Public paths that admin mutations must revalidate when content changes. */
export const PUBLIC_REVALIDATE_PATHS = [
  "/",
  "/paul-flood",
  "/awards/cup",
  "/awards/plate",
  "/winners",
  "/media",
  "/sources"
] as const;

export type PublicRevalidatePath = (typeof PUBLIC_REVALIDATE_PATHS)[number];
