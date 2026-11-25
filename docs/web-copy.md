# Web support copy — 2026-11-11

This is the local web copy contract for the account-deletion request page.
Uses the app's `docs/design/voice-and-states.md` tone and the shared web design
language. It does not certify deletion fulfillment or legal approval.

| State | Title | Explanation | Action | Component |
|---|---|---|---|---|
| Deletion request | 계정 삭제 요청 | Osol 계정과 관련 데이터의 삭제를 요청할 수 있어요. 앱을 다시 설치하지 않아도 이메일로 요청할 수 있어요. | 삭제 요청 메일 작성 | Existing `.cta` mailto link |
| Mail client opens | 메일을 보내야 요청이 전달돼요 | 버튼을 누르면 메일 앱이 열려요. 내용을 확인하고 직접 보내 주세요. | 삭제 요청 메일 작성 | Helper paragraph before CTA |
| Mail client unavailable | 메일 앱이 열리지 않나요? | 아래 주소로 직접 메일을 보내 주세요. 제목에 ‘Osol 계정 삭제 요청’을 적어 주세요. | superriaco@gmail.com | Visible email link and text |
| Identity check | 본인 확인에 필요한 정보 | 가입·로그인에 사용한 이메일과 로그인 수단을 알려 주세요. 이메일을 확인하기 어렵다면 표시 이름과 상황을 적어 주세요. 비밀번호·인증번호·로그인 토큰은 보내지 마세요. | None | Section text |
| Request fulfillment | 요청 후에는 | 요청을 확인하면 계정 소유 여부를 확인할 방법과 처리 일정을 답장으로 안내해 드려요. 메일 작성 버튼을 누르는 것만으로 계정이 삭제되지는 않아요. | None | Section text |
| Deletion scope | 어떤 데이터를 요청할 수 있나요? | 계정·프로필, 주행 기록·공유 코스, 업로드한 사진과 관련 계정 데이터의 삭제를 요청할 수 있어요. | 개인정보 처리방침 | Section and normal link |

Existing published support address is reused. No email is sent by this site.
The mailto template asks only for account identification and request details.

## Product-site copy contract · 2026-11-16

| State / area | Copy and intended meaning |
|---|---|
| Hero | 가는 길도, 내 취향대로. / 이륜차 라이더를 위한 경로 안내, 주행 기록, 그리고 크루. |
| CTA | Osol 시작하기 → installation instructions, not an unsupported store badge |
| Actual map | 부산 미포 → 송정 / 실제 도로를 따라 찾은 경로 / 5.4km·약7분 / 2026.11.16 탐색 예시. Returned87points are unchanged; not live traffic. |
| Routing | 이륜차 통행 제한과 도로 정보를 반영해 경로를 찾습니다. 실제 표지와 도로 상황을 우선 확인하세요. |
| Privacy feature | 기록과 공유는 따로. 시작·끝 위치 보호와 공개 범위를 확인하고 공유하세요. |
| Installation | Android 베타 APK / iPhone 베타 · 초대받은 참여자만. Public store channels unavailable. |
| Support | 질문을 검색해 보세요 / 맞는 답변이 없어요 / 검색 지우기 / 문의 메일 작성. Draft opening is not sending. |
| Crew code copy success / failure | 초대 코드를 복사했어요. / 복사하지 못했어요. 코드를 선택해 복사해 주세요. |
| App preview | 크루와 준비하기. 예시 데이터로 촬영한 개발 베타 화면입니다. 설치 버전과 다를 수 있어요. |
| Narrow policy table | 표를 좌우로 움직여 전체 내용을 확인하세요. |
| Crew handoff | 앱에서 초대 내용을 확인하고 참여를 이어가세요. Opening the web page never confirms membership. |
| Theme | 화면 모드 / 기기 설정 / 라이트 / 다크 |
| Unavailable page | 길을 찾지 못했어요 / 주소가 바뀌었거나 페이지가 없어요. / Osol 홈으로 |

Copy is factual product guidance, not a promise of safety, current road legality, public-store approval or support fulfillment. Existing support identity and immutable legal versions are unchanged.

## Interactive atlas · 2026-11-17

| State / area | Copy and intended meaning |
|---|---|
| Hero | 같은 목적지. 다른 라이딩. / 가는 길에도 취향이 있으니까. 나에게 맞는 길을 고르고, 달린 길을 기록하고, 함께 나누세요. |
| Real comparison | 부산 미포 → 일광해수욕장 / 오늘은 어떤 길로? / 취향을 눌러 길의 차이를 확인하세요. |
| Balanced example | 균형 있게 / 경치·한적함·편안함을 고르게 / 14.8km·약17분. Actual14776.2m/1049.1s. |
| Scenic example | 경치에 더 비중을 / 경치와 한적함의 비중을 높여서 / 16.8km·약20분. Actual16769.7m/1199.1s. |
| Comparison | 균형 경로보다2.0km 더, 약3분 더. / 경치 예시보다2.0km 덜, 약3분 덜. Based on rounded differences1993.5m/150s. Preference names describe editorial examples, not factory defaults or measured scenic quality. |
| Selection | 선택 / 선택됨 / 두 경로 겹쳐 보기 / 실선은 선택한 길, 점선은 다른 길이에요. |
| Map | 부산의 동쪽, 바다를 따라 / 지도 크게 보기 / 지도 닫기. This is a fixed public example, not the visitor's live location or navigation. |
| Provenance | 2026.11.17 실제 탐색 예시 · 현재 도로 상황과 다를 수 있어요. / 이 경로는 어떻게 골랐나요? Actual app style and exact route coordinates; same endpoints. |
| Image failure | 지도를 불러오지 못했어요. 거리와 시간은 아래에서 비교할 수 있어요. / 지도 다시 불러오기 |
| No JS | 경치에 비중을 둔 경로를 표시하고 있어요. JavaScript를 켜면 두 경로를 바꿔볼 수 있어요. |
| Two purposes | 갈 곳이 있어도. 아직 없어도. / 목적지는 정했어요. / 달릴 곳부터 찾고 싶어요. Links lead to route demonstration and installation respectively, no simulated live discovery feed. |

Same-day geocode lookup located 일광해수욕장 공영주차장 at35.2613889286804,129.233033843704; example routes use that roadside destination. Preference percentages are input weights, never safety or scenery guarantees. Map labels, metrics and comparisons are synchronized on selection; no real ride or crew event is created.

Map inspection refinement: 지도 배율 / 지도 축소 / 지도 확대 / 확대해서 길의 차이를 살펴보세요. / 확대한 지도. 방향키 또는 스크롤로 이동할 수 있어요. / 닫기. The original ‘지도 크게 보기’ promise now means an actually larger registered map (mobile200%, desktop125%), not a smaller isolated image. Zoom percentage is announced; viewport is keyboard scrollable; no visitor location is requested.

## Interactive completion · 2026-11-18

- Chapter links: 길 고르기 / 출발 준비 / 기록과 크루 / 설치.
- Start choices: 목적지가 있어요 / 코스부터 찾을래요. Their three steps describe the app workflow, never perform a calculation or location request on this site.
- Crew explanations: 같은 경로 / 위치 공유 / 음성 연결. These controls explain capabilities; they never toggle a real sharing session.
- Map disclosure: 앱2.0 개발 중인 지도 스타일로 표현한 실제 경로 예시입니다. Routing response date stays2026.11.17. Pending POI functionality is not advertised as released.

## Cinematic prototype · 2026-11-18

Opening: 도착보다 먼저. 마음이 가는 길. → 그 길을, 내 화면으로.
Visible caption: 길을 만나고 / 내 방식으로 준비하고 · 앱 UI 재구성.
Controls: 목적지/출발 준비 anchor, 균형 있게 / 경치에 더 비중을 with exact retained metrics, 경로 자세히 보기, 직접 길 고르기. They lead to working choices or existing explanatory flows; they do not perform a live route calculation.

## Departure ending · 2026-11-18

Final invitation: 길을 고르는 순간부터, Osol / 다음 길은, 당신의 취향으로.
Actions: Android로 시작하기 → download.html#android; iPhone으로 시작하기 → download.html#ios.
Availability beside actions: 지금은 베타로 함께 달리고 있어요. Android는 APK로, iPhone은 초대받은 계정으로 시작할 수 있어요.

## Direct route / guidance exploration · 2026-11-25

Overrides repeated public example/reconstruction notices above: keep detailed sourcing inside “이 경로는 어떻게 골랐나요?”; visible map attribution remains. Film phases: 길을 만나고 / 내 방식으로 준비하고. Route comparison: 경치 경로보다2.0km 덜, 약3분 덜.

Guidance labels: 길을 골랐다면, 달려볼까요? / 미포에서 일광까지 / 안내 재생 / 안내 불러오는 중 / 안내 다시 불러오기 / 일시정지 / 이어서 재생 / 다시 재생 / 안내 살펴보기 / 이전 안내 / 다음 안내 / 경로 진행 / 처음으로 / 주행 미리보기 / 안내 재생 중 / 남은 거리 / 일광해수욕장 도착 / 마음에 드는 길을 앱에서 만나세요.
Failure: 안내를 불러오지 못했어요 / 다시 눌러 불러올 수 있어요.
Reduced motion feedback: 이전 안내와 다음 안내, 경로 진행으로 길을 살펴보세요.
Turn text comes unchanged from retained actual routing instructions; remaining distance derives from response distance and geographic progress. No dummy/recording/saving/microphone/connection notices or fake success toast. No new legal policy promises.
