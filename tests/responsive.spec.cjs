const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const pages = [
  "index.html",
  "cinematic.html",
  "download.html",
  "help.html",
  "crew.html?code=ABCD2345",
  "auth.html?code=qa-placeholder",
  "delete-account.html",
  "privacy.html",
  "terms.html",
  "404.html",
  "legal/privacy/2026-07-17.html",
  "legal/terms/2026-07-21.html",
];
const sizes = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 540, height: 720 },
  { width: 720, height: 900 },
  { width: 768, height: 1024 },
  { width: 1000, height: 768 },
  { width: 1001, height: 768 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 667, height: 375 },
  { width: 844, height: 390 },
];
async function measure(page) {
  return page.evaluate(() => {
    const findings = [];
    for (const el of document.querySelectorAll(
      "h1,h2,h3,p,summary,label,button,input,output",
    )) {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (
        !r.width ||
        !r.height ||
        style.visibility === "hidden" ||
        el.closest(
          "[hidden],[inert],.sr-only,.route-overlay,.film-device,.film-copy,#dialog-map-host,.atlas-map",
        )
      )
        continue;
      if (r.left < -1 || r.right > innerWidth + 1)
        findings.push({
          kind: "outside",
          tag: el.tagName,
          text: el.textContent.trim().slice(0, 60),
          left: r.left,
          right: r.right,
        });
      if (
        el.clientWidth > 0 &&
        el.scrollWidth > el.clientWidth + 2 &&
        style.overflowX !== "auto"
      )
        findings.push({
          kind: "text-clip",
          tag: el.tagName,
          text: el.textContent.trim().slice(0, 60),
          client: el.clientWidth,
          scroll: el.scrollWidth,
        });
    }
    return findings;
  });
}
async function capture(page, name, info) {
  if (!process.env.OSOL_SCREENSHOTS || info.project.name !== "chromium") return;
  const dir = path.join(process.env.OSOL_SCREENSHOTS, info.project.name);
  fs.mkdirSync(dir, { recursive: true });
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map((img) => {
        img.loading = "eager";
        return img.decode().catch(() => {});
      }),
    );
  });
  await page.screenshot({
    path: path.join(dir, name + ".png"),
    fullPage: true,
  });
}
for (const url of pages)
  for (const theme of ["light", "dark"])
    test(`responsive ${url} ${theme}`, async ({ page }, info) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.goto("/" + url);
      await page.evaluate(async () => {
        await Promise.all(
          [...document.images].map((img) => {
            img.loading = "eager";
            return img.decode().catch(() => {});
          }),
        );
      });
      for (const viewport of sizes) {
        await page.setViewportSize(viewport);
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            ),
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${url} ${viewport.width}x${viewport.height}`,
        ).toBe(true);
        const headerLines = await page
          .locator(".nav-actions > .button")
          .evaluateAll((nodes) =>
            nodes.map((el) => {
              const text = [...el.childNodes].find(
                (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
              );
              if (!text) return 1;
              const range = document.createRange();
              range.selectNodeContents(text);
              return [...range.getClientRects()].filter((r) => r.width > 0)
                .length;
            }),
          );
        expect(
          headerLines.every((lines) => lines === 1),
          "header action wraps",
        ).toBe(true);
        expect(
          await measure(page),
          `${url} ${viewport.width}x${viewport.height}`,
        ).toEqual([]);
      }
      // Measure the complete resize matrix before collecting representative renders.
      for (const viewport of sizes.filter((v) =>
        [320, 768, 1440].includes(v.width),
      )) {
        await page.setViewportSize(viewport);
        await capture(
          page,
          `${url.split("?")[0].replaceAll("/", "-")}-${theme}-${viewport.width}`,
          info,
        );
      }
    });
test("short opening scenes keep text, direct action and final choices separate", async ({
  page,
}, info) => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 480, height: 800 },
    { width: 540, height: 720 },
    { width: 720, height: 900 },
    { width: 768, height: 1024 },
    { width: 800, height: 900 },
    { width: 801, height: 900 },
    { width: 667, height: 375 },
    { width: 844, height: 390 },
    { width: 1024, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const overlaps = await page.evaluate(() => {
      const a = document.querySelector(".film-copy").getBoundingClientRect();
      const b = document.querySelector(".film-skip").getBoundingClientRect();
      return (
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
      );
    });
    expect(
      overlaps,
      `intro overlaps direct action ${viewport.width}x${viewport.height}`,
    ).toBe(false);
    await page.evaluate(() => {
      const f = document.querySelector(".film");
      scrollTo({
        top: f.offsetTop + f.offsetHeight - innerHeight,
        behavior: "instant",
      });
    });
    await expect(page.locator(".film-app-summary")).not.toHaveAttribute(
      "inert",
      "",
    );
    const clipped = await page.locator(".film-options").evaluate((el) => {
      const stage = el.closest(".film-stage").getBoundingClientRect();
      return [...el.querySelectorAll("button,a")].some((b) => {
        const r = b.getBoundingClientRect();
        return (
          r.left < stage.left - 1 ||
          r.right > stage.right + 1 ||
          r.bottom > stage.bottom + 1
        );
      });
    });
    const targets = await page
      .locator(".film-options button, .film-options a, .film-app-head a")
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const r = node.getBoundingClientRect();
          return { width: r.width, height: r.height };
        }),
      );
    for (const target of targets) {
      expect(target.width).toBeGreaterThanOrEqual(44);
      expect(target.height).toBeGreaterThanOrEqual(44);
    }
    expect(
      clipped,
      `final opening controls clipped ${viewport.width}x${viewport.height}`,
    ).toBe(false);
    await capture(page, `opening-${viewport.width}x${viewport.height}`, info);
  }
});

test("route and guidance remain operable in short landscape and breakpoint widths", async ({
  page,
}, info) => {
  for (const viewport of [
    { width: 667, height: 375 },
    { width: 844, height: 390 },
    { width: 1001, height: 768 },
    { width: 1024, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.locator("#ride-enter").click();
    await page.locator("#ride-next").click();
    await expect(page.locator("#ride-instruction")).not.toBeEmpty();
    await expect
      .poll(async () => {
        const heading = await page.locator(".ride-heading").boundingBox();
        const controls = await page.locator(".ride-bottom").boundingBox();
        return heading.y + heading.height <= controls.y;
      })
      .toBe(true);
    await page.locator("#ride-exit").click();
    await expect(page.locator("[data-route=scenic]")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const cta = await page.locator("#ride-enter").boundingBox();
    expect(cta.height).toBeGreaterThanOrEqual(44);
  }
});
