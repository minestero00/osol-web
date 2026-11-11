# 제공자별 로그·관련 식별자 보유 조사

**내부 초안 · 2026-11-11 · 읽기 전용 확인 · 게시 문구 아님**

실제 설정, 소스 설정, 제공자 일반 문서를 구분한다. 조회 가능 기간을 제공자의 모든
내부 사본·보안 로그의 물리 파기 기간으로 확대하지 않는다. 비밀값·사용자 로그 원문은
출력하거나 이 문서에 복사하지 않았다. 계정·설정 변경은 하지 않았다.

| 대상 | 실제 확인 | 공식 자료와 적용 범위 | 남은 확인/실행 |
|---|---|---|---|
| Oracle VM의 Osol Docker 로그 | SSH로 hostname `osol-router` 및 프로젝트 디렉터리 확인. 실행 중 facade/Caddy/GraphHopper 모두 `json-file`, 빈 LogConfig. `/etc/docker/daemon.json` 없음. `/etc/logrotate.d` 목록에 Docker 전용 항목 없음. | [Docker 공식 설명](https://docs.docker.com/engine/logging/configure/)상 json-file 기본은 자동 회전 없음. 현재 검증 범위에서 기간·용량 제한이 설정됐다고 볼 증거 없음. | 실제 정리 기준 승인 후 별도 변경으로 제한/회전 및 재생성 여부 검증. 크기 제한만으로 날짜별 파기를 약속하지 않음. 외부 별도 정리 작업 존재 여부도 추가 점검. |
| VM 요청 로그 | 실제 facade command는 기본 `uvicorn api.main:app --host 0.0.0.0 --port 8080`. Caddy 운영 파일에 명시적 access log 지시어 없음. GH 소스는 request_log appenders 비움, console appender 사용. | Caddy access 로그 비활성 사실이 facade·Docker·OS 로그 부재를 뜻하지 않음. 기존 로그 원문/개인정보는 이 조사에서 조회하지 않음. | Uvicorn 요청 URL에 검색어·좌표 등이 포함되는지, 필요한 최소 로그 항목과 제거/정리 절차 검토. |
| Cloudflare Workers | 현재 main의 wrangler 설정: map-assets observability ON·sampling0.01, ITS ON·sampling1. map 소스 자체 오류는 고정 event만 출력. 실제 계정 플랜/원격 sampling/외부 로그 drain은 미조회. | [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)의 2026-11-11 문서: Free 3일 / Paid 7일. 2026-12-01 과금 체계 변경 예고가 있으므로 게시 시 재확인. | 원격 설정과 플랜 확인 후 해당 제품 로그에 한정해 기간 기재. R2·보안·계정 로그 전체에 동일 기간을 적용하지 않음. |
| Supabase | 이 프로젝트는 기존 확인상 무료 플랜. 이번 조사는 구독·로그 설정 API와 DB audit 설정을 별도 재조회하지 않음. 삭제 Edge 함수 소스는 원문 토큰/사용자 식별자/SDK 원문 오류를 자체 출력하지 않음. | [가격표](https://supabase.com/pricing): Free API/DB 로그 1일, Auth Audit 조회 1시간. [Auth Audit](https://supabase.com/docs/guides/auth/audit-logs)는 플랫폼 외부 로그와 선택적 `auth.audit_log_entries` DB 저장을 구분. [쿼리 초과](https://supabase.com/docs/guides/platform/manage-your-usage/logs-query)는 degraded 상태에서 Free 보유가 1시간으로 줄 수 있음을 설명. | 실제 플랜·로그 retention·drain 및 DB audit 저장 설정 확인. 테이블 보유를 플랫폼 조회 기간과 동일시하지 않음. |
| Resend 인증 메일 | root가 도메인 전용 SMTP·도쿄 발송·미국 계정 로그 저장·2건 전달/수신을 확인. Osol 앱은 inbound 메일을 처리하지 않으며 기존 루트 도메인 receiving ON 설정 유지. 별도 Enterprise 기간 계약 여부는 미확인. | [GDPR 설명](https://resend.com/security/gdpr/): 활성 계정 Free/Pro/Scale 이메일·로그 30일, 백업 7일. 개별 이메일 삭제 API는 없고 조기 삭제는 계정 이메일로 지원 요청. 계정 종료/삭제는 별도 보유 경로. | 적용 플랜·계약 대조 후 이메일 본문/발송 로그 30일과 백업을 구분해 고지. receiving 설정 ON만으로 Osol이 수신 내용을 수집·활용한다고 추정하지 않음. |
| LiveKit Cloud | 앱은 크루 peer RTC 음성을 사용. 실제 프로젝트 recording/egress·분석 로그 보유 설정은 미조회. | [Agent insights](https://docs.livekit.io/testing/observability/insights/)의 30일은 agent transcript/audio/log/traces용. 이를 Osol의 peer RTC 미디어·접속 로그 보유기간으로 옮겨 쓰지 않음. | 실제 프로젝트 plan·RTC analytics retention·egress/recording 설정과 계약 확인. 녹음 없음/즉시 전부 파기를 아직 단정하지 않음. |
| Firebase Cloud Messaging | 앱 소스는 FCM 사용. Osol 계정 삭제의 DB token cascade와 Firebase 설치 식별자 삭제는 다른 동작. 이 조사에서는 FID 삭제 API 호출 증거를 찾지 못함. | [Firebase 개인정보 설명](https://firebase.google.com/support/privacy): FCM은 Firebase installation ID를 처리하며 고객의 ID 삭제 API 호출 전까지 보유, 호출 후 live/backup 제거에 최대180일. 이는 메시지 본문/모든 로그 공통 기간이 아님. | 서버 token 제거를 Google-side 설치 식별자 제거로 표현하지 않음. 앱 설치 단위 ID/다른 계정 세션과의 관계 및 필요한 삭제 경로 별도 검토. |
| GitHub Pages·Gmail 지원 메일·Apple/APNs·검색 제공자 | 이번에 계정별 실제 로그/보유 설정을 확인하지 못함. Gmail 문의는 완료 후90일·월1회 수동 정리 기준을 운영자가 승인했으나 실제 정리 실행은 별도. | 기능별 실제 계약과 설정 자료 필요. 다른 제품의 보유기간을 재사용하지 않음. | 제공자별 처리 항목/기간과 운영자가 제어할 수 있는 범위 확인. |

## 다음 운영 결정

현재 가장 구체적인 설정 공백은 VM 컨테이너 로그다. 정책에 임의의 보유일을 넣기 전에
필요한 로그 항목과 날짜/용량 정리 계약을 정하고 별도 배포·기존 로그 정리까지 검증한다.
이번 조사에서는 컨테이너 재생성·로그 삭제·설정 수정·플랜 변경을 수행하지 않았다.

완료 삭제 영수증은 위 제공자 로그와 별개다. 0024의 30일 조회와 일일 purge, 실제
pg_cron 시험 성공은 모든 제공자의 인증·접속 로그가 함께 파기됐다는 증거가 아니다.
