import { afterEach, describe, expect, it } from "vitest";
import { getAdminSessionOptions } from "@/lib/auth/session";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const originalCookieSecure = process.env.SESSION_COOKIE_SECURE;

afterEach(() => {
  process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  delete process.env.SESSION_COOKIE_SECURE;
  if (originalCookieSecure !== undefined) {
    process.env.SESSION_COOKIE_SECURE = originalCookieSecure;
  }
});

describe("getAdminSessionOptions", () => {
  it("uses secure cookies only for HTTPS site URLs", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    delete process.env.SESSION_COOKIE_SECURE;
    expect(getAdminSessionOptions().cookieOptions?.secure).toBe(false);

    process.env.NEXT_PUBLIC_SITE_URL = "https://paulflood.example";
    expect(getAdminSessionOptions().cookieOptions?.secure).toBe(true);
  });

  it("honours SESSION_COOKIE_SECURE override", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    process.env.SESSION_COOKIE_SECURE = "true";
    expect(getAdminSessionOptions().cookieOptions?.secure).toBe(true);
  });
});
