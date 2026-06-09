import { afterEach, describe, expect, it } from "vitest";
import { hashAdminPassword, verifyAdminPassword } from "@/lib/auth/password";

const originalUsername = process.env.ADMIN_USERNAME;
const originalHash = process.env.ADMIN_PASSWORD_HASH;

afterEach(() => {
  process.env.ADMIN_USERNAME = originalUsername;
  process.env.ADMIN_PASSWORD_HASH = originalHash;
});

describe("verifyAdminPassword", () => {
  it("returns false when env is missing", () => {
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD_HASH;
    expect(verifyAdminPassword("anything")).toBe(false);
  });

  it("verifies bcrypt hash", () => {
    const password = "heritage-test-password";
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD_HASH = hashAdminPassword(password);
    expect(verifyAdminPassword(password)).toBe(true);
    expect(verifyAdminPassword("wrong-password")).toBe(false);
  });
});

describe("hashAdminPassword", () => {
  it("produces a bcrypt hash", () => {
    const hash = hashAdminPassword("secret");
    expect(hash.startsWith("$2")).toBe(true);
    expect(hash.length).toBeGreaterThan(50);
  });
});
