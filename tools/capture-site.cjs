// Fresh page per viewport prevents stale composited layers after viewport changes.
const { chromium, webkit } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
(async () => {
  const output = process.env.OSOL_SCREENSHOTS;
  if (!output)
    throw new Error("Set OSOL_SCREENSHOTS to the existing task run directory");
  const engine = process.env.OSOL_BROWSER || "chromium";
  const browser = await { chromium, webkit }[engine].launch(
    engine === "chromium" && process.env.OSOL_CHROME_EXECUTABLE
      ? { executablePath: process.env.OSOL_CHROME_EXECUTABLE }
      : {},
  );
  const dir = path.join(output, engine);
  fs.mkdirSync(dir, { recursive: true });
  const routes = {
    index: "index.html",
    download: "download.html",
    help: "help.html",
    privacy: "privacy.html",
    terms: "terms.html",
    "delete-account": "delete-account.html",
    crew: "crew.html?code=ABCD2345",
    auth: "auth.html?code=qa-placeholder",
    404: "404.html",
    "legal-privacy": "legal/privacy/2026-07-17.html",
    "legal-terms": "legal/terms/2026-07-21.html",
  };
  const records = [];
  for (const [name, url] of Object.entries(routes))
    for (const width of [375, 1440])
      for (const theme of ["light", "dark"]) {
        const page = await browser.newPage({
          viewport: { width, height: width === 375 ? 812 : 1000 },
          colorScheme: theme,
        });
        await page.goto("http://127.0.0.1:8766/" + url);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            [...document.images].map(async (image) => {
              image.loading = "eager";
              await image.decode();
            }),
          );
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
        });
        const prefix = `${name}-${width}-${theme}`;
        await page.screenshot({
          path: path.join(dir, prefix + ".png"),
          fullPage: true,
        });
        await page.screenshot({ path: path.join(dir, prefix + "-top.png") });
        await page.evaluate(() =>
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "instant",
          }),
        );
        await page.screenshot({ path: path.join(dir, prefix + "-bottom.png") });
        records.push({
          name,
          url,
          width,
          theme,
          height: await page.evaluate(
            () => document.documentElement.scrollHeight,
          ),
        });
        await page.close();
      }
  await browser.close();
  fs.writeFileSync(
    path.join(dir, "capture.json"),
    JSON.stringify(records, null, 2),
  );
  console.log(
    `${engine}: ${records.length} fresh pages, full/top/bottom captures`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
