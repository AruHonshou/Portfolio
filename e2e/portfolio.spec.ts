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

test("decorative ordinal labels are removed and WhatsApp is available", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator(".section-heading > span, .skill-grid article > span, .project-cover > span, .certifications li > span")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", "https://wa.me/50685097920");
  await expect(page.getByRole("heading", { name: "Responsabilidades" }).first()).toBeVisible();
});

test("desktop project story reaches the complete final card", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop-only horizontal story");
  await page.goto("/es");
  const story = page.locator("#projects");
  await expect.poll(() => story.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(1000);
  await story.evaluate((element) => {
    document.documentElement.style.scrollBehavior = "auto";
    const rect = element.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top + rect.height - window.innerHeight);
  });
  await page.waitForTimeout(150);
  const bounds = await page.locator(".project-card").last().evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, viewport: window.innerWidth };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(18);
  expect(bounds.right).toBeLessThanOrEqual(bounds.viewport - 18);
});

test("fluid canvas changes after pointer movement", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop WebGL behavior");
  await page.goto("/es");
  const canvas = page.getByTestId("fluid-canvas");
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(300);
  const before = await canvas.screenshot();
  await page.mouse.move(180, 180);
  await page.mouse.move(760, 430, { steps: 8 });
  await page.waitForTimeout(250);
  const after = await canvas.screenshot();
  expect(Buffer.compare(before, after)).not.toBe(0);
});

test("fluid readability profile follows dense and protected sections", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop fluid context");
  await page.goto("/es");
  const canvas = page.getByTestId("fluid-canvas");
  await expect(canvas).toHaveAttribute("data-fluid-context", "hero");
  await page.locator("#skills").evaluate((element) => {
    document.documentElement.style.scrollBehavior = "auto";
    element.scrollIntoView({ block: "center" });
  });
  await expect(canvas).toHaveAttribute("data-fluid-context", "skills");
  await page.locator("#projects").evaluate((element) => element.scrollIntoView({ block: "start" }));
  await expect(canvas).toHaveAttribute("data-fluid-context", "projects");
  await page.locator("#contact").evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect(canvas).toHaveAttribute("data-fluid-context", "contact");
});

test("long project titles stay intact in both languages", async ({ page }, testInfo) => {
  for (const locale of ["es", "en"]) {
    await page.goto(`/${locale}`);
    const measurements = await page.evaluate(() => {
      const compact = Array.from(document.querySelectorAll<HTMLElement>('.project-card[data-title-size="compact"]'));
      const normal = document.querySelector<HTMLElement>('.project-card[data-title-size="normal"]');
      return {
        compactCount: compact.length,
        compactWidth: compact[0]?.getBoundingClientRect().width ?? 0,
        normalWidth: normal?.getBoundingClientRect().width ?? 0,
        titles: compact.flatMap((card) => Array.from(card.querySelectorAll<HTMLElement>(".project-cover strong, .project-body h3")).map((title) => {
          const style = getComputedStyle(title);
          return { overflow: title.scrollWidth - title.clientWidth, overflowWrap: style.overflowWrap, wordBreak: style.wordBreak, text: title.textContent };
        })),
      };
    });
    expect(measurements.compactCount).toBeGreaterThan(0);
    expect(measurements.titles.every((title) => title.overflow <= 1 && title.overflowWrap === "normal" && title.wordBreak === "normal")).toBe(true);
    if (testInfo.project.name === "desktop") expect(measurements.compactWidth).toBeGreaterThan(measurements.normalWidth);
  }
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
