# Web release readiness — 2026-11-11

Support PR #4 is merged at osol-web main `313c25c`. This legal-only branch starts
from that main, carries the earlier audit without re-stacking the support change,
and prepares an unpublished policy revision. It does not certify legal compliance
or completion of deletion requests. Main is deployed by GitHub Pages, so merging
changes to published files is publication.

## Support changes already merged (#4)

- `delete-account.html`: names Osol, prominently offers an email deletion request,
  uses the already published `superriaco@gmail.com` support address, and provides
  a visible fallback address. Requires no app installation or account login.
- The mailto button opens a draft. The page explicitly says the person must send
  it and does not claim a request was submitted or deletion completed.
- The template asks for login email, login method and request details. It warns
  against sending passwords, verification codes and login tokens.
- `help.html`: removes the inaccurate claim that every released app already has
  account deletion, links the independent request page, and removes the iOS-only
  qualifier from Apple login (Android uses an OAuth browser flow).
- Home/help navigation exposes the request page. Existing shared CSS is reused.

The user confirmed individual operation, public responsible-person name 조민제, and continued use of the published
`superriaco@gmail.com` address. No company registration, paid account or invented
business particulars are needed for this factual draft. Sending a support/deletion request
to the Gmail mailbox and its manual fulfillment have not been tested. Separately, two
Supabase authentication emails were actually delivered and received by the user; that
does not prove support-mailbox request fulfillment. A mailto link is a request path,
not a deletion backend.

## Factual privacy differences found

| Existing statement | Code evidence and proposed correction |
|---|---|
| Kakao is an account-login provider | No Kakao login. Google, Apple and email are supported. Kakao Local supplies server-side place search, with Photon fallback. `Osol/app/lib/api/geocode_api.dart`, `Osol/api/geocode.py` |
| Marketing opt-in, timestamps and in-app/email withdrawal exist | No marketing opt-in/withdrawal or sending pipeline found. Required age/terms/privacy consent is a different flow. Do not describe a planned marketing system as operating. `Osol/app/lib/api/consent_repository.dart`, migration `0023` |
| Only display name/avatar are profile data | Profile editing includes display name, bio, bike and multiple bikes. `Osol/app/lib/api/profile_repository.dart` |
| Photo description omits EXIF capture location/time | Ride cover upload reads EXIF GPS/time into `add_ride_photo`; selected image bytes are uploaded. File metadata can remain in original bytes. `Osol/app/lib/api/photo_repository.dart`, `Osol/app/lib/util/exif_geotag.dart` |
| Location is used only for routing/ride-follow | Crew sessions broadcast user id, location, heading, speed and timestamp to a private Supabase Realtime channel. Recording and saved rides store route geometry. `Osol/app/lib/api/crew_session_service.dart`, `Osol/app/lib/state/crew_session_providers.dart` |
| Google only processes social login | Firebase Cloud Messaging receives device push tokens; server notifications are sent through FCM/APNs. `Osol/app/lib/api/push_service.dart`, `Osol/supabase/functions/notify-crew/` |
| No provider is involved in self-hosted map/routing data | Map assets use Cloudflare R2; routing/search runs on an Oracle Tokyo VM. LiveKit carries crew voice. Requests involve provider infrastructure; the absolute claim that no personal information reaches third parties cannot be maintained. Actual contracts, locations, logs and retention need owner confirmation. |
| Supabase processing is described only as Seoul | The primary social DB is Seoul; auth/email delivery, edge executions, CDN, push, voice and infrastructure logs require separate confirmation. Do not generalize the DB region to every provider. |
| App uninstall removes server session/account data | Uninstalling the app is not an account deletion request and does not prove server-side token/session removal. Provide the explicit request path. |
| Account data and Storage are all immediately deleted | 0024 and three deletion-related functions are deployed; dedicated-account password/capability deletion and Storage/crew cleanup passed. Published language must preserve failure/retry, Apple/provider validation and retention boundaries. |

## Remaining decisions and execution contracts

The user resolved individual operating status, responsible-person name 조민제 and support
email (unchanged). The user also approved these operating rules:

- Private work backups: dispose within seven days after validation, no later than
  2026-11-18; document a reason and new expiry before the deadline if validation is unfinished.
- Completed support/deletion-request mail: retain for 90 days after closure and manually
  clean up monthly. Pending requests remain until resolved. This is an approved rule,
  not an implemented automatic purge or evidence of completed cleanup.

Publication dates remain unapproved. Provider-specific logs need a concrete execution
plan and final disclosure before notice; actual VM containers currently have no verified
rotation/expiry setting. Detailed status and proposals are in
`_drafts/legal/owner-decisions.md` and `_drafts/legal/log-retention-findings.md`.

`_drafts/legal/retention-and-providers.md` separates deployed behavior, root's live evidence,
unverified provider settings and approved/manual cleanup rules. Migration 0024 and
`delete-account`, `apple-delete-callback`, `livekit-token` are deployed from Osol `d4c6700`;
PR150 merged as main `02955e5`. Completed receipts clear user_id and voice room identifiers
across all aliases and are queryable for 30 days. The daily purge is scheduled for 03:17 UTC
(normally 30–31 days of physical retention). Root executed the same cleanup command in an
actual temporary pg_cron probe: one expired owned fixture was deleted successfully, the probe
was unscheduled, and the original daily job remains `17 3 * * *`. This proves actual command
execution, not continuous future job uptime. Pending requests remain until resolved.
The separate private auth/public/storage metadata dump follows the approved backup rule;
account deletion does not automatically rewrite it. A hosted-backup list with zero entries
does not prove absence of provider internal copies.

Root verified live 0022/0023 login, consent, RLS and three-preset-cap behavior. Two owned
accounts subsequently passed live password-authenticated and no-Auth capability recovery
deletion, Storage API cleanup including server-uploaded owner-NULL prefix objects, crew
leader transfer, last-member crew/session cascade, two receipt aliases with identifiers
cleared, and pending upload/new voice-token rejection. Existing five users, five profiles,
two crews and one Storage object were unchanged. Actual Google/Apple reauthentication,
active media disconnect/rejoin and physical-device validation remain separate gates.
The user added Apple's callback Return URL; registration alone is not an OAuth E2E result.

Runtime map assets are live, root verified 13 public checks, and source PR149 is merged.
Older clients can still access r2.dev. App build and distribution evidence appears below;
it does not establish old-client retirement or physical-device success.

Provider contract/region/transfer details should be investigated from actual
accounts and official contracts, not handed to the user as a broad questionnaire.
Current official Supabase DPA names Supabase Pte. Ltd, unlike old published text.
Use the provider matrix to confirm the exact contract rather than invent an entity.

## Policy revision handling

`_drafts/legal/privacy-next.md` and `_drafts/legal/terms-next.md` contain proposed
changes for review. The privacy draft now contains concrete replacement copy, while the provider/retention and owner-decision files isolate publication blockers. They are working drafts, not consent documents. The `_drafts` tree is excluded by the default GitHub Pages/Jekyll build; verify that exclusion before publishing a support-only change. Existing
`privacy.html`, `terms.html`, `legal/privacy/2026-07-17.html`,
`legal/terms/2026-07-21.html` and `legal/versions.json` are unchanged.

A conditional schedule is notice on 2026-11-12 / effect on 2026-12-12, reflecting the current text's material-change 30-day notice promise. It is unapproved and must move if publication is later. After owner decisions and final code verification: establish actual notice/effective
dates; produce new immutable HTML snapshot paths and hashes; update latest pages;
coordinate the Flutter supported policy versions and server policy together.
Publishing a legal revision is a separate action from publishing support/help.
The legal README records the already published initial snapshots; it does not authorize
publication of these proposed revisions.

## Store source checks

Checked primary sources on 2026-11-11:

- [Apple account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/): an in-app initiation path is needed; manual fulfillment can be acceptable with a communicated duration and completion confirmation. Apple token revocation and user-generated content require attention.
- [Google Play account deletion](https://support.google.com/googleplay/android-developer/answer/13327111): an in-app path and a functional independent web resource are required. The web path can use customer-service email and must not require reinstalling the app. Retained data and request expectations must be disclosed.

The prepared page supplies the independent request entry, but unverified mailbox
fulfillment, retention and timing prevent calling this complete store compliance.

## Current Korean primary-source check

Read the [PIPC 2026.4 privacy-policy guidance](https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=I030010000&nttId=12018)
and its official attached PDF on 2026-11-11, focusing on retention, outsourcing,
overseas transfers, responsible-person/contact and revision-history sections.
The draft distinguishes specific retention periods/determinable criteria,
provider processing vs overseas transfers, and current vs prior document versions.
The confirmed responsible-person name 조민제 and existing support email are reflected;
the source does not justify inventing a company, department or phone.
This source check is not legal approval.

## Authentication email delivery verified

Root verified the `minestero.com` sending domain and connected Supabase SMTP over port465
with domain-only sending credentials. Sending region is Tokyo (`ap-northeast-1`). Two actual
signup/recovery emails were delivered and the user confirmed receipt; PKCE exchanges and
signup consent records passed. The initial Full Access setup key was revoked.
Open/click tracking is disabled. The app's authentication flow does not process inbound mail;
the existing root domain's Enable Receiving ON setting was preserved. Gmail remains support.
Support-mail request fulfillment has not been tested by these authentication-email checks.

The [official Resend region documentation](https://resend.com/docs/dashboard/domains/regions)
places account data, including email metadata, logs and API records, in the United States
regardless of sending region. The current public DPA names Plus Five Five, Inc.
[Resend's retention documentation](https://resend.com/security/gdpr/) states 30-day email/log
retention on Free/Pro/Scale and seven-day backups; confirm the applicable plan/contract before
final publication. These are provider-specific facts, not a shared period for all services.

## Build228 distribution evidence

- iOS IPA228: App Store Connect reports VALID and IN_BETA_TESTING for `Osol 내부`.
  Source is main `02955e5`. This is internal TestFlight processing/distribution evidence,
  not public App Store release or actual-device acceptance.
- Android APK228: built from `8436530`, which fixes the Apple callback manifest filter
  to `android:host="callback"` for `signinwithapple://callback?...`. PR151 passed all six
  checks and merged as `7171f2e`; its source tree matches the APK source tree.
  [Release228](https://github.com/minestero00/Osol/releases/tag/v1.0.0-beta.228)
  was published at 2026-11-11 12:28:40 UTC. All five server-side asset SHA-256 values
  matched, and the actual downloaded APK, manifest and SHA256SUMS matched at 12:29:28 UTC.
  This verifies publication and artifact integrity; it does not establish device acceptance.
- The difference is Android-only; preserve each platform's source SHA rather than
  representing both binaries as built from the same revision. Actual Google/Apple login,
  microphone/voice rejoin, push, location and accessibility checks on a physical device
  are not claimed by either successful build or store processing state.
