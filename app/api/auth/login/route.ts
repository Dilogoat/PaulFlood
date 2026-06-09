import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/auth/password";
import { type AdminSession, getAdminSessionOptions } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");

  const expectedUsername = process.env.ADMIN_USERNAME ?? "";
  const valid = username === expectedUsername && verifyAdminPassword(password);

  if (!valid) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  const session = await getIronSession<AdminSession>(request, response, getAdminSessionOptions());
  session.isLoggedIn = true;
  session.loginAt = Date.now();
  await session.save();

  return response;
}
