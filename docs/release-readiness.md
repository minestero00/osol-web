# Web release readiness — 2026-11-11

This branch prepares support changes and an unpublished policy revision. It does
not certify legal compliance or completion of deletion requests. Main is deployed
by GitHub Pages, so merging changes to published files is publication.

## Prepared support changes

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

The support address is present in existing published help/privacy/terms. Mailbox
access, delivery and the operator's ability to fulfill requests were not tested;
no email was sent. A mailto link is a request path, not a deletion backend.

## Factual privacy differences found

| Existing statement | Code evidence and proposed correction |
|---|---|
| Kakao is an account-login provider | No Kakao login. Google, Apple and email are supported. Kakao Local supplies server-side place search, with Photon fallback. `Osol/app/lib/api/geocode_api.dart`, `Osol/api/geocode.py` |
| Marketing opt-in, timestamps and in-app/email withdrawal exist | No marketing opt-in/withdrawal or sending pipeline found. Required age/terms/privacy consent is a different flow. Do not describe a planned marketing system as operating. `Osol/app/lib/api/consent_repository.dart`, migration `0023` |
| Only display name/avatar are profile data | Profile editing includes display name, bio, bike and multiple bikes. `Osol/app/lib/api/profile_repository.dart` |
| Photo processing excludes capture location/time | Ride cover upload reads EXIF GPS/time into `add_ride_photo`; selected image bytes are uploaded. File metadata can remain in original bytes. `Osol/app/lib/api/photo_repository.dart`, `Osol/app/lib/util/exif_geotag.dart` |
| Location is used only for routing/ride-follow | Crew sessions broadcast user id, location, heading, speed and timestamp to a private Supabase Realtime channel. Recording and saved rides store route geometry. `Osol/app/lib/api/crew_session_service.dart`, `Osol/app/lib/state/crew_session_providers.dart` |
| Google only processes social login | Firebase Cloud Messaging receives device push tokens; server notifications are sent through FCM/APNs. `Osol/app/lib/api/push_service.dart`, `Osol/supabase/functions/notify-crew/` |
| No provider is involved in self-hosted map/routing data | Map assets use Cloudflare R2; routing/search runs on an Oracle Tokyo VM. LiveKit carries crew voice. Requests involve provider infrastructure; the absolute claim that no personal information reaches third parties cannot be maintained. Actual contracts, locations, logs and retention need owner confirmation. |
| Every data type is stored only in Supabase Seoul | The primary social DB is Seoul; auth/email delivery, edge executions, CDN, push, voice and infrastructure logs require separate confirmation. Do not generalize the DB region to every provider. |
| App uninstall removes server session/account data | Uninstalling the app is not an account deletion request and does not prove server-side token/session removal. Provide the explicit request path. |
| Account data and Storage are all immediately deleted | Full deletion implementation and production validation are in progress in Osol. Published language must match its final failure/retry, crew ownership, Apple revocation and retention behavior. |

## Operator facts still needed

1. Confirm the service controller name and operating status: web currently says
   “운영자”/“Osol 운영팀”; the app-repo draft names 조민제. Confirm whether the
   service is operated as an individual or registered business, and the actual
   controller/contact particulars required for that status. Do not invent an
   address, company registration or representative name.
2. Confirm ownership and active monitoring of `superriaco@gmail.com`, identity
   verification procedure, request acknowledgment, fulfillment time and completion
   notice. A fixed time is not invented in this branch.
3. Confirm any retained deletion receipts, server/CDN/auth logs, backups and legal
   retention grounds, data categories, periods and disposal method. The deletion
   agent proposes a short-lived operation receipt; final fields and duration
   must match deployed SQL and code.
4. Confirm provider legal entities, processing roles, contracted regions and any
   overseas transfer basis/details for Supabase, Oracle, Cloudflare, Google/FCM,
   Apple/APNs, LiveKit and Kakao/Photon as applicable. Source proves the data flow,
   not the legal contracting classification.
5. Confirm notice date, effective date, user communication and whether renewed
   required consent is appropriate. Do not retroactively assign a new version.
6. Confirm account-deletion behavior on every supported Apple login path and
   actual device tests before claiming the in-app flow is available universally.

## Policy revision handling

`_drafts/legal/privacy-next.md` and `_drafts/legal/terms-next.md` contain proposed
changes for review. They are working drafts, not consent documents. The `_drafts` tree is excluded by the default GitHub Pages/Jekyll build; verify that exclusion before publishing a support-only change. Existing
`privacy.html`, `terms.html`, `legal/privacy/2026-07-17.html`,
`legal/terms/2026-07-21.html` and `legal/versions.json` are unchanged.

After owner decisions and final code verification: establish notice/effective
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
