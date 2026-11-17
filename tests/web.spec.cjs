const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("node:fs");
const path = require("node:path");
const pages = [
  "index.html",
  "download.html",
  "help.html",
  "privacy.html",
  "terms.html",
  "delete-account.html",
  "crew.html?code=ABCD2345",
  "auth.html?code=qa-placeholder",
  "404.html",
  "legal/privacy/2026-07-17.html",
  "legal/terms/2026-07-21.html",
];
async function capture(page, name, testInfo) {
  if (!process.env.OSOL_SCREENSHOTS) return;
  const dir = path.join(process.env.OSOL_SCREENSHOTS, testInfo.project.name);
  fs.mkdirSync(dir, { recursive: true });
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map(async (image) => {
        image.loading = "eager";
        await image.decode();
      }),
    );
  });
  await page.screenshot({
    path: path.join(dir, name + ".png"),
    fullPage: true,
  });
}
for (const url of pages)
  for (const theme of ["light", "dark"]) {
    test(`${url} ${theme}: mobile/desktop, accessibility and render`, async ({
      page,
    }, info) => {
      await page.emulateMedia({ colorScheme: theme });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const requests = [];
      page.on("request", (r) => requests.push(r.url()));
      await page.goto("/" + url);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1:visible")).toHaveCount(1);
      await expect(page.locator("h1:visible")).toBeVisible();
      for (const width of [320, 375, 768, 1440]) {
        await page.setViewportSize({ width, height: width > 720 ? 1000 : 812 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `overflow at ${width}`,
        ).toBe(true);
        if (width === 375 || width === 1440) {
          const result = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          expect(
            result.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => ({
                html: n.html,
                summary: n.failureSummary,
              })),
            })),
          ).toEqual([]);
        }
      }
      expect(errors).toEqual([]);
      expect(
        requests.filter(
          (u) =>
            !u.startsWith("http://127.0.0.1:8766/") && !u.startsWith("data:"),
        ),
      ).toEqual([]);
    });
  }
test("theme selection, persistence, rapid switching, escape and system reset", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".theme-button").click();
  await page.locator("[data-theme-choice=dark]").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const theme of ["light", "dark", "system"]) {
    await page.locator(".theme-button").click();
    await page.locator(`[data-theme-choice=${theme}]`).click();
  }
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  await page.locator(".theme-button").click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".theme-button")).toBeFocused();
  await expect(page.locator(".theme-options")).toBeHidden();
});
test("blocked storage, view-transition fallback and mobile navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("denied");
      },
    });
    document.startViewTransition = undefined;
  });
  await page.goto("/");
  await page.locator(".theme-button").click();
  await page.locator("[data-theme-choice=dark]").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator(".menu-toggle").click();
  await expect(page.locator(".nav-links")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".menu-toggle")).toBeFocused();
  await expect(page.locator(".nav-links")).toBeHidden();
  await page.locator(".menu-toggle").click();
  await page.locator(".nav-links a").last().click();
  await expect(page).toHaveURL(/help.html/);
});
test("real route cartography follows theme with reduced motion and contrast", async ({
  page,
}, info) => {
  await page.emulateMedia({
    reducedMotion: "reduce",
    contrast: "more",
    colorScheme: "light",
  });
  await page.goto("/");
  await expect(page.locator(".map-light")).toBeVisible();
  await expect(page.locator(".map-dark")).toBeHidden();
  await expect(page.locator("#real-route-title")).toHaveText(
    "부산 미포 → 송정",
  );
  await page.locator(".theme-button").click();
  await page.locator("[data-theme-choice=dark]").click();
  await expect(page.locator(".map-dark")).toBeVisible();
  await expect(page.locator(".map-light")).toBeHidden();
  await expect(page.locator("#app-screen")).toHaveAttribute(
    "src",
    "assets/screens/crew.png",
  );
  await capture(page, "home-real-route-reduced-contrast", info);
});
test("FAQ search results, no results, reset, and question disclosure", async ({
  page,
}, info) => {
  await page.goto("/help.html");
  const search = page.locator("#faq-search");
  await search.fill("testflight");
  await expect(page.locator("details:visible")).toHaveCount(1);
  await expect(page.locator("details:visible")).toHaveAttribute("open", "");
  await search.fill("없는질문XYZ");
  await expect(page.locator("#faq-empty")).toBeVisible();
  await expect(page.locator("details:visible")).toHaveCount(0);
  await capture(page, "help-no-results", info);
  await page.locator("#faq-empty button").click();
  await expect(search).toBeFocused();
  expect(await page.locator("details:visible").count()).toBeGreaterThan(15);
  await page.locator("details summary").first().click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
});
test("crew code sanitization, copy denial and explicit handoff fallback", async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText() {
          return Promise.reject(new Error("denied"));
        },
      },
    });
  });
  await page.goto("/crew.html?code=%20ab-cd2345%20");
  await expect(page.locator("#code")).toHaveText("ABCD2345");
  await expect(page.locator("#open")).toHaveAttribute(
    "href",
    "osol://crew/join?code=ABCD2345",
  );
  await expect(page.locator("#fallback")).toBeHidden();
  await page.locator("[data-copy]").click();
  await expect(page.locator("#code-status")).toContainText("선택해 복사");
  await page
    .locator("#open")
    .evaluate((e) =>
      e.addEventListener("click", (event) => event.preventDefault()),
    );
  await page.locator("#open").click();
  await expect(page.locator("#fallback")).toBeVisible();
  await capture(page, "crew-fallback", info);
  await page.goto("/crew.html?code=%3C%3E");
  await expect(page.locator("#bad")).toBeVisible();
  await expect(page.locator("#ok")).toBeHidden();
  await page.goto("/crew.html?code=" + "a".repeat(80));
  await expect(page.locator("#code")).toHaveText("A".repeat(32));
});
test("authentication query/hash, error precedence and plain states", async ({
  page,
}, info) => {
  for (const suffix of [
    "?code=qa-placeholder",
    "#access_token=qa-placeholder&type=recovery",
  ]) {
    await page.goto("/auth.html" + suffix);
    await expect(page.locator("#open")).toHaveAttribute(
      "href",
      "osol://login-callback" + suffix,
    );
    await expect(page.locator("#fallback")).toBeHidden();
  }
  await page
    .locator("#open")
    .evaluate((e) =>
      e.addEventListener("click", (event) => event.preventDefault()),
    );
  await page.locator("#open").click();
  await expect(page.locator("#fallback")).toBeVisible();
  await capture(page, "auth-fallback", info);
  await page.goto("/auth.html?error=otp_expired&code=qa-placeholder");
  await expect(page.locator("#bad-title")).toHaveText("링크가 만료됐어요");
  await expect(page.locator("#ok")).toBeHidden();
  await capture(page, "auth-expired", info);
  await page.goto("/auth.html#error=access_denied");
  await expect(page.locator("#bad-title")).toHaveText("확인하지 못했어요");
  await page.goto("/auth.html");
  await expect(page.locator("#plain")).toBeVisible();
});
test("JavaScript-disabled essentials and bridge explanation", async ({
  browser,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  for (const url of [
    "index.html",
    "download.html",
    "help.html",
    "crew.html",
    "auth.html",
  ]) {
    await page.goto("http://127.0.0.1:8766/" + url);
    await expect(page.locator("main")).toBeVisible();
    expect(
      await page.locator('a[href="download.html"],a[href="help.html"]').count(),
    ).toBeGreaterThan(0);
    if (["crew.html", "auth.html"].includes(url))
      await expect(page.locator(".noscript-note")).toContainText("JavaScript");
  }
  await context.close();
});
test("install links and nested 404 base", async ({ page }) => {
  await page.goto("/download.html");
  await expect(page.locator('a[href$=".apk"]')).toHaveAttribute(
    "href",
    "https://api.minestero.com/app/releases/Osol-1.0.0-232.apk",
  );
  await page.route("**/missing/nested/page", (route) =>
    route.fulfill({
      status: 404,
      contentType: "text/html",
      body: fs.readFileSync(path.join(__dirname, "../404.html"), "utf8"),
    }),
  );
  await page.goto("/missing/nested/page");
  expect(
    await page.locator("link[rel=stylesheet]").evaluate((e) => e.href),
  ).toBe("http://127.0.0.1:8766/style.css");
  await expect(page.locator("h1:visible")).toBeVisible();
});
