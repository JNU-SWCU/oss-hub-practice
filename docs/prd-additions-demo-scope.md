# PRD 기반 데모 추가 범위

이 문서는 기존 PRD에 명시되지 않았거나 이후 대화에서 추가된 frontend-only mock demo 범위를 정리합니다. 현재 데모는 실제 운영 시스템이 아니라 Vercel Preview에서 제품 흐름을 빠르게 확인하기 위한 클릭 가능한 화면입니다.

## 추가된 데모 범위

- `/login` 우선 진입: `/`는 `/login`으로 이동하고, 첫 화면은 GitHub OAuth 스타일의 mock login과 외부인, 학생, 교직원, 관리자 persona 버튼을 제공합니다. 실제 GitHub OAuth, 학교 이메일 인증, SSO, 세션, RBAC는 구현하지 않습니다.
- 대회 중심 정보 구조: 화면 흐름은 랜딩 페이지가 아니라 대회 목록, 대회 상세, 학생 신청서, 학생 대시보드, 교직원 운영, 관리자 콘솔, 공개 대시보드로 나뉩니다. 공지는 소중단 홈페이지가 담당하고 이 데모는 접수와 GitHub repo 수합 책임만 표현합니다.
- DACON식 대회 목록/상세 mock: 접수 중 대회와 지난 대회를 격자 카드로 보여주고, 상세 화면에서 일정, 팀 구성, 검토 기준, 자료/규칙, published repo assets, 역할별 다음 작업을 확인합니다.
- Kaggle식 리더보드: 팀 리더보드를 기본 탭으로 두고 개인 리더보드를 보조 탭으로 제공합니다. 지표 선택, 순위, repo/commit/PR/star 수, snapshot timestamp, CSV 내보내기 placeholder를 제공합니다.
- OSS 활동 지표 대시보드: 활동성, 협업성, 지속성, 저장소 준비도, 자산화 준비도를 관찰 지표로 표시합니다. 단일 FORCE 점수, 마일리지, 성적, 수상 결정으로 표현하지 않습니다.
- 학생 신청 CRUD mock: 학생은 대회 상세에서 별도 신청서 화면으로 이동해 팀 이름과 팀원 GitHub ID를 입력합니다. valid GitHub ID는 org invitation/repo assignment mock으로 처리하고, invalid GitHub handle은 제출 전에 실패로 표시합니다. 파일 업로드는 실제 파일 저장 없이 metadata 문구만 표시합니다.
- 교직원 운영 CRUD mock: 신청 팀 검토, 보완 요청, 승인, 저장소 배정 완료, 자산 공개 전환을 mock 상태 전이로 제공합니다. 공지는 소중단 홈페이지가 담당하고 이 demo는 접수와 GitHub 수합 책임만 표현합니다.
- 시스템 관리자 CRUD mock: 사용자 생성, 역할 선택, 상태 변경, hard delete 없는 비활성화/복구, 감사 로그 성격의 action history를 제공합니다.
- GitHub API 관찰 mock: API 호출량, secondary limit 경고, webhook 실패와 회복 상태를 합성 데이터로 보여줍니다. 실제 GitHub App, API route, webhook receiver는 없습니다.
- persona 변경: 실제 로그인 없이 `/login`으로 돌아가 persona를 바꿀 수 있으며, 이때 mock 상태는 유지됩니다. 별도의 `데모 데이터 초기화` 버튼만 전체 상태를 초기화합니다.
- 한국어-first 운영 표기: 교직원/관리자 화면의 상태, 역할, 보고서, 동의서, 감사 로그 action은 raw enum이 아니라 한국어 운영 용어로 표시합니다.

## 공개/비공개 데이터 경계

공개 화면에는 `published` 상태로 공개 전환된 팀의 팀명, 대회명, 공개 repo 링크, 공개 활동량만 표시합니다. `submitted`, `correction`, `provisioned` 상태의 신청/검토/저장소 배정 정보는 내부 운영 화면에만 표시합니다. 학번, 전화번호, 이메일, 개인정보 제공 동의서, 내부 검토 메모, role/lifecycle 상태, private repo metadata는 공개 화면에서 표시하지 않습니다.

## 이번 데모에서 제외한 것

- 실제 GitHub org 생성, repo transfer, GitHub App 설치, OAuth, webhook, API polling.
- 실제 파일 업로드, 개인정보 제공 동의서 저장, 보고서 보관, 증빙 패키지 생성.
- FORCE 지수 재산정, 소중 마일리지 자동 계산, 성적/수상/평가 자동화.
- production self-hosting, DB migration, 백업/복구, 운영자 실명 권한 체계.

## PRD 반영 메모

정식 PRD에는 위 항목을 `Demo / Prototype Scope` 또는 `Out of Scope for MVP Demo`로 분리하는 편이 좋습니다. 특히 리더보드는 학생 역량을 단정하는 점수가 아니라 GitHub 활동량 스냅샷으로 설명해야 하며, 관리자 API 관찰 화면은 운영 요구사항 후보이지 MVP production 약속이 아닙니다.
