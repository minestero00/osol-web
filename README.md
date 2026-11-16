# Osol web

Korean product, installation and support site. Plain HTML/CSS/JavaScript, hosted at https://osol.minestero.com on GitHub Pages. A merge into `main` publishes; a draft PR does not.

## Work and verification

Use the existing checkout and branch from current `main`. Read `docs/ux-product-site.md` before UI changes; record task → information → expression → states → validation. Keep major copy in `docs/web-copy.md`. Do not edit immutable consent snapshots or advance policy dates without the separate policy publication process in `legal/README.md`.

```sh
npm ci
npx playwright install chromium webkit
npm run check
npm run format:check
npm test
python3 tools/check-release.py
```

Tests use an owned localhost server on127.0.0.1:8766. Set `OSOL_CHROME_EXECUTABLE` to use an installed Chrome; `PLAYWRIGHT_BROWSERS_PATH` can isolate browser downloads. `OSOL_TEST_OUTPUT` and `OSOL_SCREENSHOTS` point to the existing task evidence directory. Capture waits for lazy images to decode, without changing their rendered styling. All authentication test values are synthetic, and app-scheme defaults are prevented in fallback tests. No real messages, account deletions, logins or location requests.

Verify320/375/768/1440 widths, light/dark, keyboard/Pointer Events, reduced motion, contrast preference, blocked storage/clipboard and no-JS recovery. Automated axe checks complement fresh independent rendered review; neither is a screen-reader or physical-device test. No extra large-text native-app QA is implied.

## Release and cleanup

The install page is a dated static snapshot. Run `tools/check-release.py` immediately before publication and update both links and notes if channels/builds change. New store links require a deliberate copy update. Review `docs/release-audit-2026-11-16.md` for remaining policy publication work.

Reuse `~/.cache/osol/web-refresh-20261105/<run-id>/` for local evidence. At closure stop only the owned preview server, retain final screenshots/logs/manifests, and delete generated project-specific dependencies, browser downloads and npm cache. Keep package lock and source, unique evidence, release artifacts and credentials. Never globally prune shared caches or delete the entire Osol evidence root. Run `make workspace-audit` in sibling Osol at start/end. Prefer a single checkout; no extra worktree for reviews.
