import { revalidatePath } from "next/cache";
import { PUBLIC_REVALIDATE_PATHS } from "@/lib/data/revalidation";

export function revalidatePublicPaths(): void {
  for (const path of PUBLIC_REVALIDATE_PATHS) {
    revalidatePath(path);
  }
  revalidatePath("/admin");
}
