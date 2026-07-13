import { expect, test } from "@playwright/test";

test("Spanish and English routes expose localized content", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator("h1")).toContainText("Kendall");
  await expect(page.getByRole("heading", { name: "Sobre mí" })).toBeVisible();
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("language switch preserves the active section", async ({ page }) => {
  await page.goto("/es#projects");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en#projects$/);
});

test("mobile menu supports Escape and has no horizontal overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only behavior");
  await page.goto("/es");
  const menu = page.locator('button[aria-controls="primary-menu"]');
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await expect(page.locator(".project-track")).toHaveCSS("display", "grid");
});

test("reduced motion and WebGL fallback preserve content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
  await page.locator("canvas").evaluate((canvas) => canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(page.getByRole("heading", { name: "Let's build something useful." })).toBeVisible();
});

test("primary links are keyboard reachable and console stays clean", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/es");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
  expect(errors).toEqual([]);
});
