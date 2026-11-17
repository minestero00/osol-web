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
