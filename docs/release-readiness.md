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

The user confirmed individual operation and continued use of the published
`superriaco@gmail.com` address. No company registration, paid account or invented
business particulars are needed for this factual draft. Email delivery and
fulfillment were not tested by sending a message. A mailto link is a request path,
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
| Account data and Storage are all immediately deleted | Full deletion implementation and production validation are in progress in Osol. Published language must match its final failure/retry, crew ownership, Apple revocation and retention behavior. |

## Remaining decisions and execution contracts

The user resolved operating status (individual) and support email (unchanged).
Remaining owner decisions are reduced to public responsible-person display,
executable retention/cleanup criteria, and the publication schedule. Detailed,
concrete proposals are in `_drafts/legal/owner-decisions.md`.

`_drafts/legal/retention-and-providers.md` separates current code, production facts
reported by root, unverified provider settings, and proposed cleanup. Completed
receipts lose user_id and are queryable for 30 days, but physical purge is currently
opportunistic; do not claim exact 30-day deletion. The private pre-migration dump
includes auth/public/storage metadata and needs an actual expiry/disposal contract.
A hosted-backup list with 0 entries does not prove absence of provider internal copies.

Root reports live 0022/0023 migration and isolated test-account checks for login,
consent false/true, forbidden writes and a cap of 3 presets and rejection of the fourth passed; 5 legacy accounts
remain. These checks are not OAuth, real email delivery or device evidence.
Account-deletion code/tests are ready but final deployment/live verification
remains distinct. Map proxy is upcoming; older clients can still access r2.dev.

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
The existing legal README's old “branch remains local” deployment note predates
the already published snapshots and must not be used as current deployment status.

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
A public responsible-person or appropriate privacy/grievance contact is still
needed; the source does not justify inventing a company, department or phone.
This source check is not legal approval.
