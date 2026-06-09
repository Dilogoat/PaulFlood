import { expect, test } from "@playwright/test";

test("home page shows heritage title and stats", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Paul Flood Heritage" })).toBeVisible();
  await expect(page.getByText("Winner records")).toBeVisible();
});

test("winners register renders", async ({ page }) => {
  await page.goto("/winners");
  await expect(page.getByRole("heading", { name: "Winners Register" })).toBeVisible();
});

test("sources page renders", async ({ page }) => {
  await page.goto("/sources");
  await expect(page.getByRole("heading", { name: /Sources & Citations/i })).toBeVisible();
});

test("unauthenticated admin access redirects to login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: "Admin login" })).toBeVisible();
});

test("admin can sign in", async ({ page }) => {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.E2E_ADMIN_PASSWORD ?? "ci-test-password";

  await page.goto("/admin/login");
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
