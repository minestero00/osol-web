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
  await expect(page.locator("#atlas-map .map-light")).toBeVisible();
  await expect(page.locator("#atlas-map .map-dark")).toBeHidden();
  await expect(page.locator("#atlas-map")).toHaveAttribute(
    "aria-label",
    /미포에서 일광까지/,
  );
  await page.locator(".theme-button").click();
  await page.locator("[data-theme-choice=dark]").click();
  await expect(page.locator("#atlas-map .map-dark")).toBeVisible();
  await expect(page.locator("#atlas-map .map-light")).toBeHidden();
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
    "https://api.minestero.com/app/releases/Osol-2.0.0-233.apk",
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

test("route preferences keep exact paths, metrics and selection in sync through rapid changes", async ({
  page,
}, info) => {
  await page.goto("/");
  const paths = await page
    .locator("[data-path]")
    .evaluateAll((nodes) =>
      Object.fromEntries(
        nodes.map((n) => [n.dataset.path, n.getAttribute("d")]),
      ),
    );
  const source = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../assets/maps/comparison/source.json"),
    ),
  );
  for (const id of ["balanced", "scenic", "balanced", "scenic"]) {
    await page.locator(`[data-route="${id}"]`).click();
    await expect(page.locator(`[data-route="${id}"]`)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.locator("#atlas-map .route-line.selected"),
    ).toHaveAttribute("data-path", id);
    const actual = source.find((r) => r.id === id).response.routes[0];
    await expect(page.locator("#atlas-map")).toHaveAttribute(
      "aria-label",
      new RegExp((actual.distance_m / 1000).toFixed(1) + "km"),
    );
    await expect(page.locator("#dialog-route-label")).toContainText(
      "약 " + Math.round(actual.duration_s / 60) + "분",
    );
  }
  expect(
    await page
      .locator("[data-path]")
      .evaluateAll((nodes) =>
        Object.fromEntries(
          nodes.map((n) => [n.dataset.path, n.getAttribute("d")]),
        ),
      ),
  ).toEqual(paths);
  await page.locator("#compare-routes").check();
  await expect(page.locator("#atlas-map")).toHaveAttribute("data-compare", "");
  await expect(page.locator("#compare-legend")).toBeVisible();
  await capture(page, "route-comparison-mobile", info);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await capture(page, "route-comparison-desktop", info);
});

test("map enlargement contains keyboard focus, Escape restores selection and scroll state", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.locator("[data-route=balanced]").click();
  const inlineWidth = await page
    .locator("#atlas-map")
    .evaluate((e) => e.getBoundingClientRect().width);
  await page.locator(".map-expand").click();
  await expect(page.locator("#map-dialog")).toBeVisible();
  expect(
    await page
      .locator("#atlas-map")
      .evaluate((e) => e.getBoundingClientRect().width),
  ).toBeGreaterThan(inlineWidth * 1.5);
  await page.locator("#map-zoom-in").click();
  await expect(page.locator("#map-zoom-level")).toHaveText("250%");
  await page.locator("#map-zoom-out").click();
  await expect(page.locator("#map-zoom-level")).toHaveText("200%");
  await page.locator(".dialog-close").focus();
  await expect(page.locator(".dialog-close")).toBeFocused();
  await expect(page.locator("#dialog-map-host #atlas-map")).toHaveCount(1);
  await expect(page.locator("#dialog-route-label")).toContainText("균형 있게");
  expect(
    await page.evaluate(() => document.documentElement.style.overflow),
  ).toBe("hidden");
  for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() => !!document.activeElement.closest("#map-dialog")),
  ).toBe(true);
  await capture(page, "route-expanded", info);
  await page.keyboard.press("Escape");
  await expect(page.locator(".map-expand")).toBeFocused();
  await expect(page.locator("#map-home #atlas-map")).toHaveCount(1);
  await expect(page.locator("#atlas-map .route-line.selected")).toHaveAttribute(
    "data-path",
    "balanced",
  );
  expect(
    await page.evaluate(() => document.documentElement.style.overflow),
  ).toBe("");
});

test("map failure is distinct from a route result and retry recovers", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/comparison/coast-light.webp*", (route) =>
    fail ? route.abort() : route.continue(),
  );
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator(".map-error")).toBeVisible();
  await page.locator("[data-route=balanced]").click();
  await expect(page.locator("#route-difference")).toContainText("2.0km 덜");
  fail = false;
  await page.locator("#map-retry").click();
  await expect(page.locator(".map-error")).toBeHidden();
  await expect(page.locator(".map-expand")).toBeEnabled();
  await expect(page.locator("#atlas-map .map-light")).toHaveJSProperty(
    "naturalWidth",
    1200,
  );
});

test("keyboard comparison and reduced motion show final state without animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("[data-route=balanced]").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-route=balanced]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  await expect(page.locator("[data-route=scenic]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(
    await page
      .locator("#atlas-map")
      .evaluate(
        (e) =>
          e
            .getAnimations({ subtree: true })
            .filter((a) => a.playState === "running").length,
      ),
  ).toBe(0);
});

test("enlarged map mouse drag tracks pointer and keyboard can move the viewport", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".map-expand").click();
  const host = page.locator("#dialog-map-host");
  const box = await host.boundingBox();
  const before = await host.evaluate((e) => e.scrollLeft);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 60, box.y + box.height / 2);
  await page.mouse.up();
  expect(await host.evaluate((e) => e.scrollLeft)).toBeGreaterThan(before + 40);
  await host.focus();
  await page.keyboard.press("ArrowLeft");
  await expect
    .poll(() => host.evaluate((e) => e.scrollLeft))
    .toBeLessThan(before + 60);
  await page.keyboard.press("Escape");
  await expect(page.locator("#atlas-map")).not.toHaveAttribute(
    "style",
    /width/,
  );
});

test("journey choices support keyboard, rapid switching and no network side effects", async ({
  page,
}) => {
  await page.goto("/");
  const requests = [];
  page.on("request", (r) => {
    if (
      ["fetch", "xhr"].includes(r.resourceType()) ||
      !r.url().startsWith("http://127.0.0.1:8766/")
    )
      requests.push(r.url());
  });
  const first = page.getByRole("tab", { name: "목적지가 있어요" });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "코스부터 찾을래요" }),
  ).toBeFocused();
  await expect(page.locator("#discover-panel")).toBeVisible();
  await expect(page.locator("#destination-panel")).toBeHidden();
  await page.keyboard.press("Home");
  await expect(first).toBeFocused();
  await expect(page.locator("#destination-panel")).toBeVisible();
  for (let i = 0; i < 4; i++) {
    await page.getByRole("tab", { name: "위치 공유", exact: true }).click();
    await page.getByRole("tab", { name: "음성 연결", exact: true }).click();
  }
  await expect(page.locator("#crew-voice-panel")).toBeVisible();
  await expect(page.locator("#crew-location-panel")).toBeHidden();
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("tab", { name: "같은 경로", exact: true }),
  ).toBeFocused();
  await expect(page.locator("#crew-route-panel")).toBeVisible();
  expect(requests).toEqual([]);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("chapter anchors and reduced motion preserve final content and focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "메뉴 열기" }).click();
  await page.locator('a[data-chapter][href="#ride"]').click();
  await expect(page).toHaveURL(/#ride$/);
  await expect(page.locator('a[data-chapter][href="#ride"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  await page.getByRole("tab", { name: "코스부터 찾을래요" }).click();
  await expect(page.locator("#discover-panel")).toBeVisible();
  expect(
    await page
      .locator("#discover-panel")
      .evaluate((el) => el.getAnimations().length),
  ).toBe(0);
  await page.locator('a[data-chapter][href="#start"]').click();
  await expect(page.locator('a[data-chapter][href="#start"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
});

test("journey explanations remain complete without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8766/");
  for (const id of [
    "destination-panel",
    "discover-panel",
    "crew-route-panel",
    "crew-location-panel",
    "crew-voice-panel",
  ]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await expect(page.locator(".story-tabs:visible")).toHaveCount(0);
  await context.close();
});

test("cinematic prototype keeps geometry, native scroll and reduced-motion final state", async ({
  page,
}) => {
  await page.goto("/cinematic.html");
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  const film = page.locator(".film");
  await page.evaluate(() => {
    const f = document.querySelector(".film");
    scrollTo({
      top:
        f.getBoundingClientRect().top + scrollY + f.offsetHeight - innerHeight,
      behavior: "instant",
    });
  });
  await expect(page.locator("[data-film-phase]")).toHaveText(
    "내 방식으로 준비하고 · 앱 UI 재구성",
  );
  await page.locator('[data-film-route="balanced"]').click();
  await expect(page.locator(".film-app-summary strong")).toContainText("14.8");
  await expect(
    page.locator('#route-experience [data-route="balanced"]'),
  ).toHaveAttribute("aria-pressed", "true");
  for (const id of ["balanced", "scenic"]) {
    const paths = page.locator(`[data-path="${id}"]`);
    expect(await paths.nth(0).getAttribute("d")).toBe(
      await paths.nth(1).getAttribute("d"),
    );
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(film).toHaveCSS("height", "900px");
  await page.locator(".film-skip").click();
  await expect(page).toHaveURL(/#route-experience$/);
  await page.locator('[data-route="balanced"]').click();
  await expect(page.locator('[data-route="balanced"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("departure ending keeps device actions accessible in both layouts", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const url of ["/index.html", "/cinematic.html"]) {
    await page.goto(url);
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator("#start").scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const platform of ["android", "ios"]) {
        const link = page.locator(
          `.departure a[href="download.html#${platform}"]`,
        );
        await expect(link).toBeVisible();
        expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(44);
      }
    }
    const result = await new AxeBuilder({ page })
      .include("#start")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    await page.locator('.departure a[href="download.html#ios"]').focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/download.html#ios$/);
  }
});
