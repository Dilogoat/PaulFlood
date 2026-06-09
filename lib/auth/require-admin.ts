import { redirect } from "next/navigation";
import { getAdminSession } from "./session";

export async function requireAdmin(): Promise<void> {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }
}
