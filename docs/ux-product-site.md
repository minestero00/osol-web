# Osol product site · 2026-11-16

Owner Codex; branch `feat/product-site-refresh`, base main313c25c; existing primary checkout, no extra worktree. Evidence: `~/.cache/osol/web-refresh-20261105/20261116/`. Remove owned preview process and project-specific generated caches at closure; retain source and QA evidence.

## Context and decisions

The visitor is a Korean motorcycle rider deciding whether Osol fits a ride and how to start on their phone. Existing members arrive for help, crew invitations or authentication. Success: explain the routing preference, find the appropriate installation path, or complete the intended support handoff. These are design hypotheses; browser tests and rendered review do not establish user-study or road-safety outcomes.

Facts: public update manifest checked 2026-11-16 reports Android APK231 and internal TestFlight231; both public store channels are null. Main app has newer map/course UI than231. Billing remains off, ordinary presets3 and crews10. Do not advertise unreleased discovery controls as universally installed, guarantee legality/safety, invent testimonials/download counts, or present a synthetic route as a real calculation.

User explicitly asks for Apple HIG / Liquid Glass, system font body17, semantic adaptive colors, spring response0.3–0.4/damping1 and gesture damping0.8, direct Pointer Events tracking/rubber-band edges and reduced-motion fallback. These instructions override older web16px/card16 specifications. Osol's O/route mark and slate/cobalt/pine semantic brand remain. Glass belongs to navigation and controls; content retains opaque readable surfaces. Reference: [Apple materials](https://developer.apple.com/design/human-interface-guidelines/materials), [motion](https://developer.apple.com/design/human-interface-guidelines/motion). Web implementation approximates the material; it is not native UIKit Liquid Glass.

Local ui-ux-pro-max design-system search twice returned generic enterprise Swiss styling. Do not persist its palette/fonts as canon. Use the explicit user direction and Osol tokens; apply its useful keyboard, focus, contrast, reflow and reduced-motion guidance.

| Element | Task → information | Expression/location and choice | States / verification |
|---|---|---|---|
| Hero | Decide what Osol helps with → motorcycle routing/preferences/record/crew | Left-aligned thesis, actual app cartography and operational route geometry, one start CTA and a feature anchor | Dated real Mipo→Songjeong routing result, unchanged87points, never live traffic; readable320–1440, light/dark |
| Feature story | Decide whether core capabilities fit → route, recording/privacy, crew | Unequal editorial sections with task-specific illustrations; no fake phone shell/testimonial/cards grid | Links to exact help topics; no claim of universal offline navigation or guaranteed safe roads |
| App screen preview | Understand the real interface → crew setup screen | One native screenshot with alt text; no decorative device shell | Original normal-size crew QA image, example data/development beta disclosure, source SHA in screenshot-provenance.json; never claimed as exact231 |
| Install page | Find correct installation → platform, build, APK versus invited TestFlight | Explicit Android/iOS sections, direct APK link only after checked metadata; responsive layout with no separate cross-device handoff panel | Internal-test participation explained; no App Store/Play availability claim; JS-disabled content remains usable |
| FAQ search | Recover or learn → concise question and answer | Native details with labelled search and live result count; all questions available without JS | No match distinguished, clear action and visible support email, keyboard focus |
| Crew bridge | Carry invite into app → code, next action, fallback | Code copy plus explicit open; never auto-launch | Empty/normal/fallback, clipboard denial has selectable code; no success claim before app participation |
| Theme | Read comfortably → system/light/dark | Small shared control; persistent preference is optional local storage | Defaults to OS, blocked storage handled, quick changes settle, crossfade/reduced motion, transparency/contrast fallback |

## Verification / release boundary

All7 existing routes plus install/404, published immutable policy snapshots, viewport375/768/1440 (320 overflow), light/dark, keyboard, focus, links, JS-disabled essentials, reduced motion and high contrast. Automated checks cover HTML/assets/immutable hashes and meaningful JS interactions, including auth query/hash errors and safe crew handoff with synthetic values only. No real auth/mail/deletion requests. Fresh independent rendered review required; Opus unavailable, use provided inherited model and disclose it.

Latest legal text and PR5 drafts need factual re-reconciliation after deployed0025–0029, metadata stripping, retention changes and private media. Preserve immutable policy bytes. This refresh is not consent-policy publication or operator/legal approval. Main merge publishes via GitHub Pages; prepare reviewable PR, no automatic production merge.

User refinement: remove “휴대폰에서 이어서 보기” and install-URL copy. Platform installation guidance is sufficient; avoid adding peripheral handoff features to the main product story.

User refinement: no invented cartography or routes. All map imagery must come from the actual app style/data and traceable routing output. The synthetic hero/explorer, decorative privacy path and two QA route/record screenshots were removed. Real map provenance and geometry equality are checked in CI. The hero is a browser render of unchanged app cartography, not a native-app screenshot. No drag surface remains, so the gesture spring/pointer requirements do not apply to a fabricated interaction. Motion remains subtle button response and theme crossfade.
