# Osol web

Korean product, installation and support site. Plain HTML/CSS/JavaScript, hosted at https://osol.minestero.com on GitHub Pages. A merge into `main` publishes; a draft PR does not.

## Work and verification

Use the existing checkout and branch from current `main`. Read `docs/ux-product-site.md` before UI changes; record task → information → expression → states → validation. Keep major copy in `docs/web-copy.md`. Do not edit immutable consent snapshots or advance policy dates without the separate policy publication process in `legal/README.md`.

```sh
npm ci
PLAYWRIGHT_SKIP_BROWSER_GC=1 PLAYWRIGHT_BROWSERS_PATH=/absolute/task/evidence/browsers npx playwright install chromium webkit
npm run check
npm run format:check
PLAYWRIGHT_BROWSERS_PATH=/absolute/task/evidence/browsers npm test
python3 tools/check-release.py
```

Tests use an owned localhost server on127.0.0.1:8766. Set `OSOL_CHROME_EXECUTABLE` to use an installed Chrome; `PLAYWRIGHT_BROWSERS_PATH` can isolate browser downloads. `OSOL_TEST_OUTPUT` and `OSOL_SCREENSHOTS` point to the existing task evidence directory. Capture waits for lazy images to decode, without changing their rendered styling. All authentication test values are synthetic, and app-scheme defaults are prevented in fallback tests. No real messages, account deletions, logins or location requests.

Verify320/375/768/1440 widths, light/dark, keyboard, reduced motion, contrast preference, blocked storage/clipboard and no-JS recovery. Automated axe checks complement fresh independent rendered review; neither is a screen-reader or physical-device test. No extra large-text native-app QA is implied.

## Release and cleanup

The install page is a dated static snapshot. Run `tools/check-release.py` immediately before publication and update both links and notes if channels/builds change. New store links require a deliberate copy update. Review `docs/release-audit-2026-11-16.md` for remaining policy publication work.

Reuse `~/.cache/osol/web-refresh-20261105/<run-id>/` for local evidence. At closure stop only the owned preview server, retain final screenshots/logs/manifests, and delete generated project-specific dependencies, browser downloads and npm cache. Keep package lock and source, unique evidence, release artifacts and credentials. Never globally prune shared caches or delete the entire Osol evidence root. Run `make workspace-audit` in sibling Osol at start/end. Prefer a single checkout; no extra worktree for reviews.

## Authentic map assets

Do not draw illustrative roads or fabricate route shapes. `docs/map-provenance.json` records the app style source SHA, actual request/response and unchanged geometry. The two map images are renders of `OsolMapStyle.vector` and production PMTiles, not native UI screenshots. The only native preview is the labelled crew example. Map attribution must remain visible wherever the images are used.

After `npm ci`, with Dart available, reproduce the stored routing result into an owned evidence folder:

```sh
OSOL_MAP_WORKDIR=/absolute/task/evidence/real-map OSOL_APP_REPO=/absolute/Osol node tools/render-real-map.cjs
```

Use `OSOL_CHROME_EXECUTABLE` for installed Chrome if needed. The generator only starts a loopback server and reads public map tiles/glyphs. It neither fetches a new route nor publishes assets. To change a route, retain the real API request/response, review the returned geometry and timing, regenerate both themes, update provenance hashes and re-review the render. Never substitute QA fixture geometry for a public route.

## Interactive riding atlas

The visual direction, type hierarchy, layout and component decisions are defined in `docs/ux-product-site.md` (2026-11-17 section); copy in `docs/web-copy.md`. Homepage-only styles live in `home.css`, interaction in `route-demo.js`; support/consent/bridge pages retain their shared layout.

`assets/maps/comparison/source.json` retains two actual same-endpoint routing requests and responses. They are editorial preference examples, not factory presets or live calculations. `projection.json` registers unchanged coordinates to the basemap. `tools/check-site.py` verifies source hashes, Mercator projection, point count and the actual inline SVG path. The public page uses same-origin WebP and SVG only, with no runtime map SDK, routing call or location permission.

To reproduce the comparison after `npm ci`, use the existing evidence run (Dart and `cwebp` required):

```sh
OSOL_MAP_WORKDIR=/absolute/existing/evidence/render OSOL_CHROME_EXECUTABLE='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node tools/render-comparison.cjs
python3 tools/update-comparison.py --render-dir /absolute/existing/evidence/render
npx prettier --write index.html
npm run check
```

The renderer exports the current sibling app style unchanged. If changing the app source/style or route examples, update provenance `app_source_commit`, copy and metrics and inspect both themes before publication. The update helper does not fetch routes or infer claims from weights. Numeric selection/summary coherence is checked against original API responses by browser tests. Keep all original evidence; do not overwrite earlier accepted render runs when changing inputs.

## Product journey interactions

`journey.js` enhances the existing homepage with purpose and crew-explanation tabs, current-section navigation and short section arrival motion. The header stays a single navigation surface. No-JS keeps every explanation visible. Tabs explain the app; they never request location/microphone or activate a real session. Honor reduced motion even when the preference changes during a transition.

Always install test browsers into the existing evidence run using `PLAYWRIGHT_BROWSERS_PATH` and `PLAYWRIGHT_SKIP_BROWSER_GC=1`. The default Playwright installer may garbage-collect unrelated browser revisions in the shared cache. Use the same isolated path for test execution; remove only that owned directory at closure.

## Actions quota / local-first work

During Actions usage limits, develop and verify locally using the exact `check`, `format:check` and Chromium/WebKit test scope above. Save source SHA, commands, logs and screenshots in the existing evidence run. Local success is not a hosted CI result. Keep work local until publication is needed; avoid repeated pushes that each start a workflow. Check actual workflow annotations before claiming billing/capacity failure. Do not change billing, disable required checks, broaden bypass permissions or mark hosted checks successful. Pages publication remains a separate deployment step.

`cinematic.html` is the first-three-scene scroll prototype, with `cinematic.css`/`cinematic.js`. It reuses the registered real map and exact route geometry; it is a UI reconstruction, not a native screenshot. Open it on the local preview server and scroll, then select preferences inside the scene or in the comparison below.

## Route → guidance exploration

`route-demo.js` lazily reads the retained same-origin comparison/source.json on the first guidance action. Original instruction intervals and geographic distances drive a registered position marker and travelled prefix; no runtime routing service, map SDK, geolocation or microphone is used. Route choices retain independent progress. The visitor controls play/pause, turn steps, range and restart; playback pauses when hidden, off-screen, expanded or switched. Reduced motion provides discrete keyboard/touch exploration. Remaining distance is labelled, and no real trip/record/share is created. Public source details live in the existing expandable route-method section.

The noindex cinematic preview mirrors the homepage interaction; keep both in sync. `tests/ride.spec.cjs` verifies both entries, response-derived guidance, recovery, arrival/restart, route switching, reduced motion, responsive controls and loaded-state accessibility.

## App-shaped map stage

`app-stage.css` enhances the comparison into a single map viewport with route-choice and guidance modes. The route sheet and turn banner use the native app's composition without a fake device frame/status bar. Actual next-maneuver intervals drive the turn distance; original geometry is retained. ResizeObserver reserves map space for real panel heights on mobile. Native MapAttributionScope/MapCreditsScreen already implement startup-only credits and settings licence access; web credits collapse after a fully-visible foreground five seconds once per page, with a persistent help.html#map-licenses link. No-JS keeps attribution visible.

## Responsive regression coverage

`tests/responsive.spec.cjs` checks all12 published/preview/support/policy routes in both themes at11 viewport sizes, including1000/1001px and short landscape. Opening controls are also measured at tablet portrait widths480–800px. Short/tablet introductions flow in document order; normal taller phone and wide desktop retain scroll transitions. Header labels, actual hit targets, map/sheet clearance and restored selections are tested. Full-bleed sections share the shell gutter, and reduced motion never interpolates layout geometry.
