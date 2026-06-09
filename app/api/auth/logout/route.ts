import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  session.destroy();

  return NextResponse.redirect(new URL("/admin/login", request.url), 303);
}
