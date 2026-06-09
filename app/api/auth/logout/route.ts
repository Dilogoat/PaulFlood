import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { type AdminSession, getAdminSessionOptions } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  const session = await getIronSession<AdminSession>(request, response, getAdminSessionOptions());
  session.destroy();
  await session.save();

  return response;
}
