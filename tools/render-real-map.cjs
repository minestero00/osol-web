// Development-only renderer. It does not add a map SDK to the public website.
const fs = require("node:fs"),
  path = require("node:path"),
  http = require("node:http"),
  crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const { chromium } = require("playwright");
(async () => {
  const repo = path.resolve(__dirname, "..");
  const app = process.env.OSOL_APP_REPO || path.resolve(repo, "../Osol");
  const work = process.env.OSOL_MAP_WORKDIR;
  if (!work)
    throw new Error(
      "Set OSOL_MAP_WORKDIR to the owned task evidence directory",
    );
  fs.mkdirSync(work, { recursive: true });
  const source = fs.readFileSync(
    path.join(app, "app/lib/map/osol_map_style.dart"),
    "utf8",
  );
  const stub = `\nenum Brightness {light,dark}\nclass Config {static const glyphsUrl='https://api.minestero.com/maps/fonts/{fontstack}/{range}.pbf';static const pmtilesUrl='https://api.minestero.com/maps/korea.pmtiles';static const useVectorBasemap=true;}\nvoid main(List<String> args) {print(OsolMapStyle.vector(Config.pmtilesUrl,night:args.contains('dark')));}\n`;
  const dart = path.join(work, "export-style.dart");
  fs.writeFileSync(
    dart,
    source
      .replace("import 'dart:ui' show Brightness;", "")
      .replace("import '../config.dart';", "") + stub,
  );
  for (const theme of ["light", "dark"]) {
    const result = spawnSync("dart", [dart, theme], { encoding: "utf8" });
    if (result.status !== 0) throw new Error(result.stderr);
    fs.writeFileSync(path.join(work, `style-${theme}.json`), result.stdout);
  }
  fs.copyFileSync(
    path.join(repo, "assets/maps/route-response.json"),
    path.join(work, "route-response.json"),
  );
  const gl = path.join(
    path.dirname(require.resolve("maplibre-gl/package.json")),
    "dist",
  );
  const pm = path.resolve(
    path.dirname(require.resolve("pmtiles")),
    "../../dist/pmtiles.js",
  );
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let file;
    if (url.pathname === "/") file = path.join(__dirname, "map-render.html");
    else if (url.pathname === "/pmtiles.js") file = pm;
    else if (url.pathname.startsWith("/maplibre/"))
      file = path.join(gl, path.basename(url.pathname));
    else if (
      [
        "/style-light.json",
        "/style-dark.json",
        "/route-response.json",
      ].includes(url.pathname)
    )
      file = path.join(work, path.basename(url.pathname));
    else {
      res.writeHead(404).end();
      return;
    }
    const type = {
      ".html": "text/html",
      ".mjs": "text/javascript",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
    }[path.extname(file)];
    res.setHeader("Content-Type", type || "application/octet-stream");
    fs.createReadStream(file)
      .on("error", () => res.destroy())
      .pipe(res);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch(
      process.env.OSOL_CHROME_EXECUTABLE
        ? { executablePath: process.env.OSOL_CHROME_EXECUTABLE }
        : {},
    );
    for (const theme of ["light", "dark"]) {
      const page = await browser.newPage({
        viewport: { width: 600, height: 650 },
        deviceScaleFactor: 2,
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(
        `http://127.0.0.1:${server.address().port}/?theme=${theme}`,
      );
      await page.waitForFunction(
        () => window.renderReady,
        {},
        { timeout: 60000 },
      );
      const details = await page.evaluate(() => ({
        errors: window.renderErrors,
        ...window.renderDetails,
      }));
      if (errors.length || details.errors.length)
        throw new Error(JSON.stringify({ errors, details }));
      await page.screenshot({
        path: path.join(work, `mipo-songjeong-${theme}.png`),
      });
      fs.writeFileSync(
        path.join(work, `render-${theme}.json`),
        JSON.stringify(details, null, 2),
      );
      await page.close();
    }
    fs.writeFileSync(
      path.join(work, "source-sha256.txt"),
      crypto.createHash("sha256").update(source).digest("hex") + "\n",
    );
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
  console.log(
    "Rendered unchanged app vector style and stored route response into",
    work,
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
