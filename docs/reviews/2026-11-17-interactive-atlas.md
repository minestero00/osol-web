# Interactive atlas review · 2026-11-17

Scope: homepage design direction and real route comparison; support/consent/authentication remain regression-covered. Existing checkout, branch `feat/interactive-route-story`, base `f6be255`. Direction, typography, layout and component rationale are in `../ux-product-site.md`; copy in `../web-copy.md`.

## Result

Fresh independent review: **PASS** at1440×1000 and375×812, light/dark. The actual coast and divergent routes make the subject specific; map choice, metrics and explanation remain consistent. Selected route uses solid line and labelled selection; comparison uses a dashed alternative. Mobile200% enlargement,250% zoom, movement, close/selection/focus restoration, lower sections, installation/footer and reduced motion were observed in actual Chrome DevTools renders. Opus was unavailable; the inherited model performed the required fresh independent review. This is not a user study or physical riding/accessibility certification.

The first independent review requested changes: mobile enlargement was actually narrower, hidden desktop line breaks concatenated Korean words, and the decorative switch track intercepted direct input clicks. All three were fixed before fresh review. Independent first-pass screenshots are under `review-1/` in the evidence run. The accepted reviewer inspected Chrome DevTools screenshot output; that tool denied cache-path screenshot saving, so no bypass was used. Persistent accepted browser captures are under `screens-accepted/`.

## Validation

- `npm run check`:11HTML documents, local links/assets, immutable policy/screenshot hashes, real route response hashes and exact Mercator source→projection→SVG registration PASS.
- `npm run format:check`, `git diff --check`:PASS.
- Final `npm test`:**70/70 PASS in49.7s**, Chrome and WebKit. Eleven documents, light/dark,320/375/768/1440 widths, axe, theme/FAQ/auth/crew/install/no-JS, map selection, overlay, exact retained paths/metrics, rapid changes, dialog focus/restoration, actual enlargement, image error/retry, reduced motion, mouse drag and keyboard viewport movement.
- Earlier runs are retained as failures/interruption:64pass/4fail (switch hit target and accidental100ms global reduced-motion SVG transitions);12focused pass after fixes; a full run interrupted by user turn;69pass/1fail because WebKit did not natively scroll the focused map with ArrowLeft. Explicit arrow movement fixed that browser difference before final70pass.
- `python3 tools/check-release.py`:PASS against current public232manifest. This does not publish or submit the app.
- Additional dialog axe at1440light and375dark: recorded in `dialog-axe.json` (a preliminary harness used browser.newPage and was corrected to an explicit context; only the completed context-based results count).

## Authenticity and limitations

Both examples originate from real public routing responses with identical endpoints, retrieved2026-11-17. Balanced14776.2m/1049.1s, scenic-weighted16769.7m/1199.1s. No coordinate interpolation or decorative road geometry. App basemap style is exported unchanged, and the SVG projection is checked against coordinates. Example names are editorial input-weight choices, not factory presets or guaranteed scenic/safe routes. Public page makes no route call or location request; all interactive assets are same-origin.

The final screenshot for quick review is `preview-desktop.png`. Evidence root: `/Users/riaco/.cache/osol/web-refresh-20261105/20261117-interactive/`. Current release channels and law/policy drafts are outside this implementation. Draft PR only; production remains unchanged pending review.

## 2026-11-18 · Product journey completion

Continued PR8 in the existing checkout, preserving the uncommitted joint-design notes at the start. Refreshed comparison cartography from app62b61f1; original routing requests/responses, geometry and metrics are unchanged. The map is labelled as a2.0 development style. No new POI feature is advertised as deployed.

Added a single header navigation with active chapter and reading progress, destination/course workflow tabs, and three explanatory crew tabs. Their controls never activate a real session or request permissions. Section arrival uses short12px motion at full text opacity, with reduced-motion cancellation; ordinary scrolling and no-JS content remain available. Mobile crew panel height was reduced after review. The actual native screenshot retains its existing beta/example disclosure.

Fresh independent reviewer `/root/web_journey_review` inspected12 actual375/1440 light/dark renders. PASS after closing excess mobile panel space and verifying active navigation after two animation frames. Opus is unavailable; the reviewer used the inherited available model. Review does not establish physical-device behavior or user comprehension.

Evidence: `~/.cache/osol/web-refresh-20261105/20261117-interactive/final-20261118/`. The first test run found an overly broad network assertion (the existing lazy crew image is a legitimate same-origin asset). The assertion now rejects fetch/XHR and external requests while permitting static image loads. Intermediate runs were interrupted during navigation refinement; they are not final-pass evidence. Final suite result is recorded below.

Environment incident: the initial `playwright install webkit` used its default shared cache and automatically removed older chromium1248/headless1248/ffmpeg1011/firefox1538/webkit2336 revisions. This was unintended; sources and user data were not removed. Other projects may need to reinstall their pinned browser versions. New webkit2388/ffmpeg1013 were relocated into the owned evidence browser directory for final testing. README now requires both isolated `PLAYWRIGHT_BROWSERS_PATH` and `PLAYWRIGHT_SKIP_BROWSER_GC=1`; no further shared-cache cleanup was performed.

The subsequent complete run had75 passes and one WebKit reduced-motion failure: the global0.1s transition-duration rule still created transitions on switched panels. Explicit `transition:none!important` and `animation:none!important` for the new panels/tabs now override that rule. Both engines passed the focused regression before the final full rerun. These failed/interrupted logs remain in evidence.

A further WebKit accessibility run caught text while the arrival opacity was still below1, reducing contrast. Arrival now animates only a12px translation with full opacity throughout, preserving text contrast during motion as well as after it. Reduced motion disables the arrival entirely.

Final result: **76/76 PASS** (Chromium + WebKit,39.1s, `complete-tests.log`), including11 page variants at320/375/768/1440 widths, light/dark, axe checks, route geometry/selection, map failure/drag/dialog, new tabs/current chapter/reduced-motion/no-JS flows. Static site/JS/provenance checks, Prettier and `git diff --check` PASS. Public release-link check matches beta232. Screenshots:12 reviewed; physical devices, assistive-technology use and user comprehension remain untested. No deployment or merge occurred.
