import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSession = {
  isLoggedIn: boolean;
  loginAt: number;
};

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) {
    return secret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to at least 32 characters");
  }
  return "development-only-secret-minimum-32-chars";
}

export function getAdminSessionOptions(): SessionOptions {
  return {
    password: sessionSecret(),
    cookieName: "pf_admin_session",
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8
    }
  };
}

export async function getAdminSession() {
  return getIronSession<AdminSession>(await cookies(), getAdminSessionOptions());
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const session = await getAdminSession();
  return session.isLoggedIn === true;
}
