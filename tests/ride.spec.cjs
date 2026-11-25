const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const AxeBuilder = require("@axe-core/playwright").default;
const path = require("node:path");
const source = require("../assets/maps/comparison/source.json");
async function scrub(page, value) {
  await page.locator("#ride-progress").evaluate((node, value) => {
    node.value = String(value);
    node.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}
async function stage(page, name, info) {
  if (!process.env.OSOL_SCREENSHOTS) return;
  const dir = path.join(process.env.OSOL_SCREENSHOTS, info.project.name);
  fs.mkdirSync(dir, { recursive: true });
  await page
    .locator("#route-experience")
    .screenshot({ path: path.join(dir, name + ".png") });
}
test("route exploration uses actual instructions, preserves independent progress and reaches arrival", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.locator("#ride-play").click();
  await expect(page.locator("#ride-play")).toHaveText("일시정지");
  await expect
    .poll(async () => Number(await page.locator("#ride-progress").inputValue()))
    .toBeGreaterThan(0);
  await page.locator("#ride-play").click();
  const paused = await page.locator("#ride-progress").inputValue();
  await page.waitForTimeout(150);
  expect(await page.locator("#ride-progress").inputValue()).toBe(paused);
  await page.locator("#ride-reset").click();
  await page.locator("#ride-next").click();
  const actual = source.find((r) => r.id === "scenic").response.routes[0];
  await expect(page.locator("#ride-instruction")).toHaveText(
    actual.instructions[1].text,
  );
  const projected =
    require("../assets/maps/comparison/projection.json").routes.find(
      (r) => r.id === "scenic",
    );
  const expectedPoint = projected.points[actual.instructions[1].interval[0]];
  const location = (
    await page.locator(".ride-position").getAttribute("transform")
  )
    .match(/-?\d+(?:\.\d+)?/g)
    .map(Number);
  expect(location[0]).toBeCloseTo(expectedPoint[0], 2);
  expect(location[1]).toBeCloseTo(expectedPoint[1], 2);
  await scrub(page, 500);
  await expect(page.locator("#ride-remaining")).toHaveText("8.4 km");
  const marker = await page.locator(".ride-position").getAttribute("transform");
  await page.locator("[data-route=balanced]").click();
  await expect(page.locator("#ride-progress")).toHaveValue("0");
  await expect(page.locator("#ride-remaining")).toHaveText("14.8 km");
  await scrub(page, 750);
  await expect(page.locator("#ride-remaining")).toHaveText("3.7 km");
  await page.locator("[data-route=scenic]").click();
  await expect(page.locator("#ride-progress")).toHaveValue("500");
  await expect(page.locator(".ride-position")).toHaveAttribute(
    "transform",
    marker,
  );
  await expect(page.locator("#ride-play")).toHaveText("이어서 재생");
  await stage(page, "ride-paused-mobile", info);
  await scrub(page, 1000);
  await expect(page.locator("#ride-status")).toHaveText("일광해수욕장 도착");
  await expect(page.locator("#ride-remaining")).toHaveText("0 m");
  await expect(page.locator("#ride-next")).toBeDisabled();
  await page.locator("#ride-play").click();
  await expect(page.locator("#ride-play")).toHaveText("일시정지");
  expect(
    Number(await page.locator("#ride-progress").inputValue()),
  ).toBeLessThan(100);
  await page.locator("#ride-play").click();
  await page.locator("#ride-reset").click();
  await expect(page.locator("#ride-previous")).toBeDisabled();
  expect(errors).toEqual([]);
});
test("failed guidance can retry without losing selection or claiming playback", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/comparison/source.json", (route) =>
    fail
      ? route.fulfill({ status: 503, body: "unavailable" })
      : route.continue(),
  );
  await page.goto("/");
  await page.locator("#ride-play").click();
  await expect(page.locator("#ride-play")).toHaveText("안내 다시 불러오기");
  await expect(page.locator("#ride-status")).toHaveText(
    "안내를 불러오지 못했어요",
  );
  await expect(page.locator("#ride-progress")).toBeDisabled();
  await page.locator("[data-route=balanced]").click();
  fail = false;
  await page.locator("#ride-play").click();
  await expect(page.locator("#ride-play")).toHaveText("일시정지");
  await expect(page.locator("#atlas-map .selected")).toHaveAttribute(
    "data-path",
    "balanced",
  );
});
test("reduced motion is a keyboard-operated discrete tour and map failure stops playback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#ride-play")).toHaveText("안내 살펴보기");
  await page.locator("#ride-play").click();
  await expect(page.locator("#ride-progress")).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#ride-progress")).toHaveValue("1");
  await page.keyboard.press("End");
  await expect(page.locator("#ride-status")).toHaveText("일광해수욕장 도착");
  await page.locator("#ride-previous").click();
  expect(
    Number(await page.locator("#ride-progress").inputValue()),
  ).toBeLessThan(1000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#ride-play").click();
  await expect(page.locator("#ride-play")).toHaveText("일시정지");
  await page.locator("#atlas-map img:visible").evaluate((img) => {
    img.src = "/missing-map-for-guidance.webp";
  });
  await expect(page.locator("#ride-play")).toBeDisabled();
  await expect(page.locator("#ride-status")).toHaveText("주행 미리보기");
});
test("leaving the stage and opening the map pause playback without auto-resume", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#ride-play").click();
  await expect(page.locator("#ride-play")).toHaveText("일시정지");
  await page.locator("h1").scrollIntoViewIfNeeded();
  await expect(page.locator("#ride-play")).not.toHaveText("일시정지");
  await page.locator("#ride-play").scrollIntoViewIfNeeded();
  await page.locator("#ride-play").click();
  await expect(page.locator("#ride-play")).toHaveText("일시정지");
  await page.locator(".map-expand").click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#ride-play")).not.toHaveText("일시정지");
});
test("guidance stage reflows in both themes without clipping controls", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.locator("#ride-play").click();
  await page.locator("#ride-play").click();
  await scrub(page, 420);
  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme });
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const id of [
        "ride-play",
        "ride-previous",
        "ride-next",
        "ride-reset",
        "ride-progress",
      ]) {
        const box = await page.locator("#" + id).boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
      await stage(page, `ride-${theme}-${width}`, info);
      if (width === 375 || width === 1440) {
        const result = await new AxeBuilder({ page })
          .include("#route-experience")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(result.violations).toEqual([]);
      }
    }
  }
});

test("cinematic preview and homepage both support working guidance without script errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const url of ["/", "/cinematic.html"]) {
    await page.goto(url);
    await page.locator("[data-route=balanced]").click();
    await expect(page.locator("#ride-remaining")).toHaveText("14.8 km");
    await page.locator("#ride-play").click();
    await expect(page.locator("#ride-play")).toHaveText("일시정지");
    await page.locator("#ride-play").click();
    await scrub(page, 420);
    await expect(page.locator(".ride-position")).toBeVisible();
  }
  expect(errors).toEqual([]);
});
