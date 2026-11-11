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
