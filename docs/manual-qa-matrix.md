# Manual QA Matrix

검증 대상: JNU OSS Platform frontend-only mock demo

배포 URL: https://jnu-oss-hub.vercel.app

로컬 URL: http://127.0.0.1:4173

## 실행 환경

| 항목 | 값 |
| --- | --- |
| 앱 유형 | Vite + React + TypeScript frontend-only mock |
| 인증 | 실제 로그인 없음, 역할 선택 mock |
| 데이터 | TypeScript seed fixture |
| 검증일 | 2026-07-06 |

## 수동 QA 시나리오

| ID | 우선순위 | 시나리오 | 기대 결과 | 결과 |
| --- | --- | --- | --- | --- |
| QA-01 | P0 | 외부 공개 보기로 진입 | 공개 OSS 현황, 공개 자산, 공개 repo 2개, 팀 리더보드가 보인다 | PASS |
| QA-02 | P0 | 공개 화면 개인정보 검색 | 전화번호, 이메일, 학번, 동의서, 내부 검토 메모가 보이지 않는다 | PASS |
| QA-03 | P0 | 학생으로 보기 선택 | 학생 신청 및 저장소 배정 흐름이 보이고 학생 버튼에 `선택됨` 배지가 보인다 | PASS |
| QA-04 | P0 | 학생 신청서 제출 | 새 팀이 접수 완료 상태로 바뀌고 교직원 검토 큐에 반영된다 | PASS |
| QA-05 | P0 | 잘못된 GitHub ID 입력 | 잘못된 handle은 제출 전에 한국어 오류로 차단된다 | PASS |
| QA-06 | P0 | 교직원 승인 | 검토 큐에서 승인하면 저장소 배정 완료 상태가 된다 | PASS |
| QA-07 | P1 | 교직원 보완 요청 | 보완 요청 action과 한국어 보고서/동의서 상태가 보인다 | PASS |
| QA-08 | P1 | 관리자 사용자 생성 | 변경 사유가 없으면 차단되고, 사유 입력 후 사용자 추가가 가능하다 | PASS |
| QA-09 | P1 | 관리자 API 상태 전환 | 정상, 요청 제한 경고, webhook 실패 상태가 한국어로 표시된다 | PASS |
| QA-10 | P1 | 리더보드 지표 변경 | 종합 활동량, commit, PR, star, repo 기준으로 정렬 UI가 유지된다 | PASS |
| QA-11 | P1 | OSS 관찰 지표 확인 | 활동성, 협업성, 지속성, 저장소 준비도, 자산화 준비도 카드가 보인다 | PASS |
| QA-12 | P1 | 모바일 412px 확인 | 테이블이 카드형으로 바뀌고 한국어 텍스트가 겹치지 않는다 | PASS |

## 자동 검증

| 명령 | 결과 |
| --- | --- |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS, 5 tests |
| `pnpm lint` | PASS |
| `pnpm build` | PASS |
| `pnpm test:e2e` | PASS, 12 tests on desktop/mobile |
| `pnpm check` | PASS |

## 라이브 Smoke

Playwright로 https://jnu-oss-hub.vercel.app 에서 다음을 확인했습니다.

- `JNU OSS Platform` heading visible.
- 공개 repo count is `2개`.
- `광주 데이터 크루`는 공개 화면에 없음.
- `010-`, `@jnu.ac.kr`는 공개 화면에 없음.
- 학생 역할 전환 후 `aria-pressed=true`, `선택됨` 배지, 학생 신청 heading visible.
