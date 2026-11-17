# Osol product site · 2026-11-16

Owner Codex; branch `feat/product-site-refresh`, base main313c25c; existing primary checkout, no extra worktree. Evidence: `~/.cache/osol/web-refresh-20261105/20261116/`. Remove owned preview process and project-specific generated caches at closure; retain source and QA evidence.

## Context and decisions

2026-11-17 release232 handoff: existing visitors need the current install file and a concise account of what changed. Update only the existing platform build labels, APK target, release notes and verification date. Preserve the invited-only TestFlight explanation and existing page hierarchy. The branch is a candidate until both artifacts and the public manifest are verified; run the release-link check before merging. No new interaction or policy change.

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

## Interactive product story · 2026-11-17

Owner Codex, branch `feat/interactive-route-story`, base `f6be255`; existing checkout. Evidence `~/.cache/osol/web-refresh-20261105/20261117-interactive/`. User authorized implementing the Herdr-inspired interaction analysis after first defining aesthetic direction, typography and layout; explicitly wants a real route where preferences produce visible differences. No invented geometry or outcome metrics. Existing draft-only release boundary remains: reviewable PR before production merge.

### Aesthetic direction: a contemporary riding atlas

The subject is the road and the rider's choice. A broad, authentic coastal map is the main visual; a precise, left-aligned Korean headline sets the pace. Mist/slate surfaces, cobalt selection, pine scenic information. Draw from road signage and cartographic instruments, not terminal aesthetics. Material appears only on controls above the map and the navigation. No decorative route lines, fictitious landscape, floating phone shell, repeating feature-card grid, oversized brand stamp or ornamental section numbering.

Typography: system Korean sans stack; display `clamp(3rem, 6.5vw, 6rem)`/1.08, weight700, tracking−0.02em; section heading `clamp(2rem,4vw,3.75rem)`/1.2,650; body1.0625rem/1.7, tracking0; labels0.875–1rem/1.5,600; useful notes≥0.8125rem/1.6. Route metrics1.8rem on desktop and1.5rem on mobile comparison controls, tabular numerals, units subordinate; each option keeps its distance and time visible together. One Korean/Latin font family, no decorative English overlines. Display line breaks are intentional, body line length≈38–50 Korean characters.

Layout: maximum84rem with responsive24–48px gutters. Hero headline and short introduction sit above a wide map-led interaction; asymmetry comes from a narrow decision panel and a broad map, not floating decoration. Rhythm: compact nav → generous thesis → dense useful comparison → quiet explanation → actual app preview → installation. Mobile places the full-width map and legible route choices in document flow; no shrunken desktop simulator. Two visitor purposes remain explicit: compare a route to a known destination, or learn how to find a course when undecided.

Motion: direct selection feedback, a350ms critically damped-style transition for selected control, a short route fade/reveal preserving geometry and map registration. No fake calculating delay, autoplay parade, scroll hijacking or camera flight between alternatives. Rapid re-selection cancels earlier visual effects and the final intent wins. Reduced motion shows the completed state without path drawing or movement. Theme uses the existing crossfade. No drag affordance unless actual dragging is implemented.

Facts: app permits user-named preference presets with five weight axes; names in this demonstration are editorial example presets, not claims about built-in defaults. Actual public routing responses and unchanged app map style are authoritative. Success is understanding a route difference and reaching installation; actual user comprehension remains a hypothesis until observed.

| Component | Task → needed information | Expression and placement | States and validation |
|---|---|---|---|
| Main route comparison | Understand how preferences change a ride → same endpoints, selected preference, road geometry, distance/time, preference explanation | Real example, fixed map extent, directly selectable alternatives with comparable metrics beside map; selected shape and text, not color alone | Default is meaningful without JS; ready/selected/rapid repeat/load failure/retry/reduced motion/keyboard/touch tested; no live routing claim |
| Map inspection | Inspect where paths diverge → named endpoints and comparison context | Optional larger dialog of the same map, selection stays in sync; close and focus return | Escape, click outside, focus containment, no background scrolling, exact geometry |
| Two entry purposes | Find the right starting action → destination search or course discovery | Two clear text links below the hero, anchored to a concise explanation of each app flow | Real app capabilities only; no fabricated public course feed |
| Supporting story | Understand what happens after choosing → guidance, record/privacy, crew | Preserve factual support and native crew preview, vary density; no fake ride or live crew stats | Help/install links usable without JS; screen labelled as example |

Data choice is evidence-driven: retain all queried candidates in the existing evidence run; ship only selected comparison responses and their provenance. Render the same viewport for each theme and generate route projections directly from unmodified coordinates. Public page loads only same-origin assets; no user location permission, routing request, tracker or map SDK at runtime. Prefer a small, self-contained enhancement over adding a framework.

Validation task: “부산에서 이 구간을 달리려 합니다. 두 가지 취향을 비교하고, 더 마음에 드는 길과 그때의 거리·시간을 확인한 뒤 설치 방법을 찾아주세요.” Automated/state and independent rendered checks are not a user study. Review desktop/mobile light/dark, no-JS, reduced motion, failure, focus and fast switching; preserve legal/bridge behavior.

Implementation refinement: selected real segment is 부산 미포 → 일광해수욕장 roadside parking (same destination coordinates for both requests). Balanced14776.2m/1049.1s versus scenic-weighted16769.7m/1199.1s; the visible mid-route detour is actual geometry. Source `assets/maps/comparison/source.json`; registration and hashes `docs/comparison-provenance.json`. No scenery ranking is inferred from the route's name.

The enlarged map opens at200% on mobile and125% on desktop, with100–300% controls. Touch uses native two-axis scrolling; mouse uses Pointer Events/capture,1:1 scroll tracking and capped24px edge resistance with350ms release. Keyboard users focus the labelled scroll region and use arrow keys. Geometry/image share one transform. Closing restores the inline map, exact selection and launch-button focus. Reduced motion cancels ongoing route/release animations. Native image failure shows retry without hiding known distance/time. Desktop and mobile use the same registered map; mobile moves choices before it, rather than shrinking a desktop sidebar.
