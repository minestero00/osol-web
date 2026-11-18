// Offline asset build: unchanged app basemap + exact routing geometry projected by MapLibre.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const { chromium } = require("playwright");
(async () => {
  const root = path.resolve(__dirname, ".."),
    work = process.env.OSOL_MAP_WORKDIR;
  if (!work) throw Error("OSOL_MAP_WORKDIR required");
  fs.mkdirSync(work, { recursive: true });
  const app = process.env.OSOL_APP_REPO || path.resolve(root, "../Osol");
  const source = fs.readFileSync(
    path.join(app, "app/lib/map/osol_map_style.dart"),
    "utf8",
  );
  const stub =
    "\nenum Brightness {light,dark}\nclass Config {static const glyphsUrl='https://api.minestero.com/maps/fonts/{fontstack}/{range}.pbf';static const pmtilesUrl='https://api.minestero.com/maps/korea.pmtiles';static const useVectorBasemap=true;}\nvoid main(List<String> args) {print(OsolMapStyle.vector(Config.pmtilesUrl,night:args.contains('dark')));}\n";
  const dart = path.join(work, "export-style.dart");
  fs.writeFileSync(
    dart,
    source
      .replace("import 'dart:ui' show Brightness;", "")
      .replace("import '../config.dart';", "") + stub,
  );
  for (const theme of ["light", "dark"]) {
    const r = spawnSync("dart", [dart, theme], { encoding: "utf8" });
    if (r.status !== 0) throw Error(r.stderr);
    fs.writeFileSync(path.join(work, `style-${theme}.json`), r.stdout);
  }
  const gl = path.join(
    path.dirname(require.resolve("maplibre-gl/package.json")),
    "dist",
  );
  const pm = path.resolve(
    path.dirname(require.resolve("pmtiles")),
    "../../dist/pmtiles.js",
  );
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://localhost");
    let f;
    if (u.pathname === "/") f = path.join(__dirname, "comparison-render.html");
    else if (u.pathname === "/pmtiles.js") f = pm;
    else if (u.pathname.startsWith("/gl/"))
      f = path.join(gl, path.basename(u.pathname));
    else if (/^\/style-(light|dark)\.json$/.test(u.pathname))
      f = path.join(work, path.basename(u.pathname));
    else if (u.pathname === "/routes.json")
      f = path.join(root, "assets/maps/comparison/source.json");
    else {
      res.writeHead(404).end();
      return;
    }
    res.setHeader(
      "Content-Type",
      {
        ".html": "text/html",
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".json": "application/json",
        ".css": "text/css",
      }[path.extname(f)] || "application/octet-stream",
    );
    fs.createReadStream(f)
      .on("error", () => res.destroy())
      .pipe(res);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: process.env.OSOL_CHROME_EXECUTABLE,
    });
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({
        viewport: { width: 1200, height: 800 },
        deviceScaleFactor: 1,
      });
      await page.goto(
        `http://127.0.0.1:${server.address().port}/?theme=${theme}`,
      );
      await page.waitForFunction(
        () => window.renderReady,
        {},
        { timeout: 90000 },
      );
      const result = await page.evaluate(() => window.renderDetails);
      if (result.errors.length) throw Error(JSON.stringify(result.errors));
      await page.screenshot({ path: path.join(work, `coast-${theme}.png`) });
      fs.writeFileSync(
        path.join(work, `projection-${theme}.json`),
        JSON.stringify(result, null, 2),
      );
      await page.close();
    }
    fs.writeFileSync(
      path.join(work, "style-sha256.txt"),
      crypto.createHash("sha256").update(source).digest("hex"),
    );
  } finally {
    await browser?.close();
    await new Promise((r) => server.close(r));
  }
  console.log(
    "Comparison basemaps and registered route projections rendered:",
    work,
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
