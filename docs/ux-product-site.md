# Osol product site · 2026-11-16

## 2026-11-17: Osol 2.0 앱·웹 공동 재설계 계획

사용자는 레퍼런스 사이트의 감정과 세부 디자인을 앱에서도 느끼게 하도록 앱 자체의 대규모 재설계를 요청했고,
목표 앱 버전을 **2.0.0**으로 정했다. 앱의 현재 디자인에 웹을 맞추는 범위를 넘어 앱/웹의 정보 구조·타입·재질·모션을 함께 검토한다.
실행 계획 정본은 Osol 저장소의 [`docs/exec-plans/active/osol-2-design.md`](https://github.com/minestero00/Osol/blob/main/docs/exec-plans/active/osol-2-design.md)이며,
현재 로컬 계획 초안 단계여서 원격 링크는 계획이 반영된 뒤 유효하다. 로컬 위치는 `../Osol/docs/exec-plans/active/osol-2-design.md`(웹 저장소 루트 기준)다.

아래 map-first 히어로는 이전 구현 이력이다. PR8의 실제 지도/경로 비교·출처·접근성·오류 복구는 재사용 후보로 유지하고,
앱 핵심6장과 웹 첫 화면의 두 방향 시안을 비교한 뒤 새 페이지 구성을 확정한다.
제안 흐름은 실제 라이딩 풍경+앱 → 목적지/코스 두 상황 → 경로 비교 → 기록/크루 → 설치다.
앱·웹 공통 색 역할/타입 성격/재질/모션을 정의하되 화면 크기와 사용 맥락에 맞는 별도 위계를 둔다.
사진과 앱 캡처는 실제 장소·경로·출시 기능에 대응해야 한다. 합성 QA 코스를 홍보용 실경로로 사용하지 않는다.
이번 변경은 계획 문서만이며,2.0 디자인/기능/빌드/공개 배포가 완료됐다는 뜻이 아니다.

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

## Interactive completion · 2026-11-18

Continue existing PR8 (`feat/interactive-route-story`), owner Codex, same checkout. Preserve the preceding joint-design notes. Evidence stays under `~/.cache/osol/web-refresh-20261105/20261117-interactive/final-20261118/`. No production merge in this task.

Visitor task: understand the difference between route choices, find a start appropriate to whether they know their destination, understand optional crew sharing, and reach the right installation channel. This is a design hypothesis, not observed user research.

Keep the riding-atlas direction: neutral mist/slate, cobalt for chosen actions, pine for a scenic context; system Korean type at17px body, generous editorial headings, full-width factual cartography. Alternate the dense route comparison with an open two-purpose section and a darker crew surface. Glass is restricted to navigation. Preserve real route geometry; regenerate the comparison from current app style62b61f1 and disclose the development style. Never market pending POI features as installed.

| Element | Task / needed information → expression | States and validation |
|---|---|---|
| Chapter navigation | Know where I am / jump to a purpose → four labelled anchors with current chapter and a discreet reading progress line | Scroll/resize/hash/keyboard; no scroll interception, no focus changes on scroll; compact layout320px |
| Start selector | Decide how to begin → destination/course choices reveal the corresponding actual three-step workflow and link | Semantic tabs only after enhancement; keyboard arrows/Home/End, fast switching, all content visible with no JS |
| Crew explanation | Understand optional sharing before installing → select route/location/voice concepts to reveal what each does | Explanatory tabs, never pretend to activate a real crew, location or microphone; no permission request; no-JS shows all explanations |
| Section arrival | Follow the reading hierarchy → one short12px arrival with full text opacity on meaningful groups | Content never hidden waiting for JS; offscreen observer, reduced-motion bypass and cancel; no autoplay/scroll-jacking |

The same comparison, route zoom/drag, failure recovery and selected metrics remain. Support, legal, auth and install routes retain their existing contracts. Final verification includes both browser engines, all page accessibility/regression checks, a focused new interaction suite and independent rendered review. Physical Safari/Chrome and actual user comprehension remain unverified.

## Cinematic prototype · 2026-11-18

User approved a first-three-scene prototype after reference discussion. Branch feat/cinematic-atlas-prototype, same checkout, evidence existing web-refresh root/20261118-cinematic. Prototype cinematic.html only; public homepage remains the comparison. Task: feel the riding context, understand that this map becomes an app workflow, then choose between real routes. Assumption: spatial continuity improves comprehension; no user study yet.

Scene1: large authentic map and short headline. Scene2: same registered map scales into a UI reconstruction with real endpoint/distance/time; caption explicitly says reconstruction, not native screenshot. Scene3: existing real-route comparison with exact unchanged geometry, buttons, zoom, attribution and error recovery. Scroll uses native progress, never intercepts wheel/touch or changes focus. One sticky section only. Map and SVG share3:2 geometry. No terrain or invented roads. Reduced motion/no-JS show a static complete composition and direct comparison link. Validate320/375/768/1440, two themes, keyboard/skip, reduced motion, source coordinate consistency, browser regression and fresh rendered review. Not production deployment approval.

## Departure ending refinement · 2026-11-18

User rejected the closing split headline/platform-card layout as visually weak. Continue the same local cinematic branch without Actions or publication. Visitor task: finish exploring and choose the correct device installation path. Needed information: two platforms, APK versus invited TestFlight, beta status. Replace management-like cards with a full-width cobalt closing scene, large two-line Korean invitation and two compact direct installation anchors. Buttons remain visible and usable throughout. Typography moves at most24px with native scroll; no opacity reduction, new sticky region or forced scroll. Reduced-motion/no-JS renders the completed layout. Facts about channels remain explicit below the actions. Hypothesis: a single decisive visual close preserves the product story better than two independent cards. Validate both pages,320–1440, themes, target links, keyboard, reduced motion and independent render review.

## Cinematic homepage publication · 2026-11-18

User authorized deploying all current web work. Promote reviewed cinematic composition to index.html; retain cinematic.html as the noindex comparison/prototype URL. Ending is the reviewed departure composition in both pages. Local full checks precede a single publication PR. User requested conserving Actions; verification workflow skipped via commit marker, not reported as hosted success. Repository main currently has no branch protection or rules. Existing Pages branch publication is still required; no workflow/rules/billing changes. Evidence uses the existing20261118-cinematic run with publish-* filenames.

## Freely explorable route and guidance · 2026-11-25

User approved implementation: visitors should directly operate functions, with no redundant dummy-data notices. Keep the existing slate/cobalt/pine atlas and scroll introduction; the interactive stage is visitor-controlled. Work in existing checkout, branch feat/explorable-ride from current main6169462. Evidence: ~/.cache/osol/web-refresh-20261105/20261125-explorable/. No publication requested in this turn.

Context → decision → action: a prospective rider compares two routes to the same destination, then plays or scrubs guidance to understand how the chosen route feels. Completion: select a route, inspect a turn, pause, return to the other route without losing the first route's progress. Actual stored production geometry/instructions are facts; whether this improves installation decisions is an untested hypothesis.

| Element | Task / information / expression | States and verification |
|---|---|---|
| Existing route choices | Compare actual distance/time; keep both choices and selected state visible | Selection also changes guidance; switching pauses playback and retains per-route position |
| Guidance stage | Understand the route; one actual instruction, remaining route distance, selected-map position and travelled trace | No fabricated turns/speed/GPS. Use original instruction intervals and geographic distances, registered SVG points. Loading, failure/retry, pause, arrival; map image failure blocks playback but preserves numerical comparisons |
| Playback controls | Explore without a prescribed tour; play/pause, previous/next turn, native labelled range and restart | Manual by default, 45-second distance-based preview. Reduced motion uses discrete turn steps, no continuous playback. Pause on tab hiding, leaving viewport, modal expansion or preference change; no auto-resume. Keyboard and touch controls >=44px |
| Copy / source | Let the interaction explain the product | Concise action labels. Move dates, route weights, browser reconstruction/source details into existing expandable details. Attribution stays visible; do not imply live navigation, recording or real crew connectivity |

Validation: both browsers;320/375/768/1440, light/dark, no-JS essentials, keyboard, reduced motion, data/image failure and recovery, rapid route changes, arrival/restart, original path/provenance unchanged. Independent rendered review separately from automated checks; no user study or physical-device claim. First release scope is route → guidance, not pretend saving/sharing sessions.

Acceptance: local `check`, `format:check` and full Chromium/WebKit **92 tests PASS** (2026-11-25; accepted-tests.log). Includes both entry pages, loaded-guidance axe, registered original instruction point, responsive44px controls, pause/restore/retry/reduced-motion flows; original route provenance checks pass. Fresh independent actual-render review initially requested correct roundabout glyph and explicit remaining-distance meaning; both fixed. Second fresh review **PASS** across light/dark mobile/desktop; supplied Chromium/WebKit renders viewed, inherited model used because Opus unavailable. Earlier faded dark capture was corrected by waiting finite transitions. Screenshot cropping may include sticky header over the top of a tall stage; not treated as a layout collision. Browser MCP shared-profile connection was unavailable; dedicated local Playwright ran the real browsers. No physical-device, user-study or live-navigation claim. Source is local on feat/explorable-ride; no push, Actions run or production deployment. Reproducible npm/browser caches are removed at closure; evidence remains under the existing run path above.

## App-shaped route stage · 2026-11-25

User asks for the web experience to feel like the actual app. Previous flow published as c57c8c7/PR13, verified at public domain. Owner Codex, existing checkout feat/app-like-route-stage from main c57c8c7. Reuse existing evidence 20261125-explorable/app-stage.

Context → judgment → action: prospective rider chooses one actual route, opens its guidance, inspects turns, and returns to route choice. Native references: TestFlight300 source and retained relief-native-2/ride-services-light.png (actual turn banner above map, summary sheet below). Actual app composition is fact; web usability improvement is a hypothesis. Do not add fake GPS speed, phone status bars, inactive tabs, permissions or real-save claims.

| Component | Decision / reason | States / validation |
|---|---|---|
| Map canvas | Replace split web comparison with one bounded app viewport, real basemap/registered SVG, useful UI floating above it | Cropping preserves map/path registration. Mobile viewport reserves unobscured map area for both endpoint markers and panels; no stretched geography |
| Route sheet | Compare two real routes and proceed; bottom sheet on mobile, lower-left overlay on wide display | Actual choice state, metrics, compare switch, one “이 길로 안내 보기” action. No-JS keeps existing static comparison |
| Guidance | Native-style top turn banner and bottom progress controls | Explicit enter/back modes, focus lands on playback/back appropriately. Returning pauses, preserves per-route progress; errors/retry stay recoverable; reduced motion remains discrete |
| Copy / tools | Name actual task rather than explain the simulation | No fake phone frame, speedometer or disabled app tabs. Existing attribution/source details remain; expand map remains functional |

Verify original route hashes, both entry pages,320/375/768/1440 light/dark, mode/focus/back/pause/restore, visibility pause, no-JS, failures, touch44px, loaded accessibility and independent actual-render review. No changes to native app or arbitrary real-time routing.

User refinements during implementation: delete redundant route-difference/explanation copy entirely; numbers in choices suffice. Native existing scope already collapses credits after5 foreground seconds once per launch and exposes MapCreditsScreen / Flutter registry from settings; no duplicate native implementation. Web does one fully visible five-second foreground credit exposure per page lifetime, then hides all repeated map/dialog credits, with a persistent footer licence link and no-JS visible fallback. OSMF Interactive maps guidance checked2026-11-25 explicitly permits this startup / About-menu pattern. Keep retained source notices and packages available; no long-lived localStorage flag that suppresses notices forever.

Acceptance: local check/format and **98 Chromium/WebKit tests PASS**, accepted-tests.log in the app-stage evidence run. Includes actual next-instruction point/distance, mode/back/focus, pause/resume, layout bounds, source integrity, startup credit collapse without reappearance and persistent licence discovery. New independent rendered review PASS against the actual native reference. Initial low Chromium CTA capture caveat resolved by a settled taller-viewport capture and a CTA-inside-stage assertion in both browsers; product styling unchanged. Opus unavailable, inherited-model reviewer viewed actual browser renders. Native source/binary unchanged: existing MapAttributionScope + settings MapCreditsScreen verified from current source, not claimed as a new native build or device test. User's preceding deployment request continues for these refinements; publish once through the existing Pages/main route after local gates, skip verification Actions, preserve settings/protections.

## Whole-site responsive QA · 2026-11-25

User asks to verify and fix all web screens. Owner Codex, existing checkout fix/responsive-site from main cf8022c. Evidence reuses 20261125-explorable/responsive. Task: read the product, operate route/guidance, choose installation, recover/support/auth/crew on narrow phone, tablet, desktop and short landscape viewports. Existing320/375/768/1440 tests are facts; intermediate breakpoints and short-height collisions need further evidence. No new public features or decorative explanation copy. Preserve original paths/data and consent snapshots. Check root overflow separately from intentionally clipped map geometry, text clipping, visible controls, menu/theme focus, sheet/map occlusion and scroll introduction at both phases. Adapt only demonstrated layout failures; no large-text native-app or physical-device claims. Locally verify Chromium/WebKit, fresh rendered review and one publication; conserve verification Actions and remove owned caches at closure.

Responsive decisions and verified findings:

| Finding / context | Decision and reason | Verification |
|---|---|---|
|1001px stage grew past its parent because of preferred aspect ratio/min-height|Explicit100% stage width, desktop panels bounded to31% so both content and route fit|Breakpoint1000/1001/1024 resize and guidance controls|
|Short intro text overlapped its direct action; tablet portrait cut final options|Flowing scene at height<=700px or width480–800px, two columns when>=600px; taller phone/wide-desktop scroll treatment retained|Opening phases at320/375/480/540/667/720/768/800/801/844/1024; every final control within scene and real touch targets>=44|
|Reduced-motion universal transition duration animated margins/padding during resize|Limit those transitions to color/background/border/opacity; share main gutter for full-bleed sections|Consecutive resize matrix, both engines; no masking page overflow|
|Narrow header split 시작하기 across lines|Keep header action one line and tighten narrow spacing, preserve48px theme/menu controls|Actual text-range line count, all page widths|
|Selection color interpolation briefly weakened contrast|Change app route-choice colors together, keep route reveal motion; allow snapshots/axe to settle finite transitions|Final full accessibility/interaction suite|

Acceptance: **150 tests PASS** in Chromium/installed Chrome and WebKit, including new52 responsive cases and prior98 regressions. Twelve routes × light/dark ×11 viewport configurations (320–1440px, portrait/landscape/intermediate boundaries), plus expanded intro/guidance cases. `accepted-check.log`, `accepted-format.log`, `accepted-tests.log` in the existing responsive evidence run. First independent review found tablet clipping; new fresh review PASS after flowing layout and explicit tablet bounds/touch checks. Both reviews and ordinary focused captures remain in evidence. Opus unavailable, inherited reviewer model used; actual rendered screens viewed. No native/physical-device/user-study claim. Immutable policy HTML/source-map provenance untouched. A premature initial harness run lacked WebKit and was interrupted while waiting lazy-image capture; final installed-browser/eager-image runs are the acceptance evidence. Publish once using prior authorized local-first Pages workflow, then remove owned npm/browser/dependency caches and stop only the owned preview.
