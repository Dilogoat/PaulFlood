import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "pf_admin_session";

function hashToken(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function expectedSessionHash(): string {
  const username = process.env.ADMIN_USERNAME ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return hashToken(`${username}:${password}:${secret}`);
}

export function getAdminSessionToken(): string {
  return expectedSessionHash();
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

export async function createAdminSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, expectedSessionHash(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function requireAdminSession() {
  const jar = await cookies();
  const session = jar.get(SESSION_COOKIE)?.value;
  if (!session || session !== expectedSessionHash()) {
    redirect("/admin/login");
  }
}

export function isAdminSessionToken(token?: string): boolean {
  return Boolean(token) && token === expectedSessionHash();
}
