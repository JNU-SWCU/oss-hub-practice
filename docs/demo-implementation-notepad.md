# Demo Implementation Notepad

## Objective

JNU OSS Platform을 실제 백엔드 없이 클릭 가능한 frontend-only mock demo로 구현한다. 사용자는 외부 방문자, 학생, 교직원, 시스템 관리자 역할을 선택해 PRD의 핵심 흐름을 확인한다.

## Decisions

- Next.js 설치가 네트워크 타임아웃으로 불안정해 Vercel 배포 가능한 Vite + React + TypeScript로 전환했다.
- 실제 로그인, GitHub API, 파일 업로드, OAuth, DB, webhook은 구현하지 않고 UI 상태 전이와 mock data로 표현했다.
- 공개 화면은 `published` 팀만 보여준다. `provisioned` 팀은 저장소 배정 완료 상태일 뿐 공개 자산은 아니므로 공개 projection에서 제외했다.
- 리더보드는 평가가 아니라 활동량 스냅샷이다. FORCE, 소중 마일리지, 성적, 수상 결정과 연결하지 않는다.
- 학생/교직원/관리자 화면은 한국어-first 운영 용어를 사용한다.
- 도메인 코드는 types, fixtures, utils, transitions로 분리해 후속 백엔드 연결 시 책임 경계를 유지한다.

## Current Deployment

- Production alias: https://jnu-oss-hub.vercel.app
- Latest deployment URL: https://jnu-oss-23riit6wb-goberosmus-projects.vercel.app
- Local preview: http://127.0.0.1:4173

## Evidence

- `pnpm typecheck`: PASS
- `pnpm test`: PASS, 5 tests
- `pnpm lint`: PASS
- `pnpm build`: PASS
- `pnpm test:e2e`: PASS, 12 tests
- `pnpm check`: PASS
- Live smoke: PASS

## Gate Review Fixes

- 공개 자산 count/repo/card 불일치 수정.
- active 역할 상태에 `aria-pressed`와 `선택됨` 배지 추가.
- OSS 관찰 지표 카드 추가: 활동성, 협업성, 지속성, 저장소 준비도, 자산화 준비도.
- 교직원 보고서/동의서 상태를 한국어로 변경.
- 관리자 역할/상태/API alert/감사 로그를 한국어로 변경.
- `src/domain.ts` oversized module 및 긴 파라미터 리스트를 제거하기 위해 도메인 모듈 분리.
- `src/components/AdminWorkspace.tsx` pure LOC 초과를 제거하기 위해 관리자 라벨/파서 로직을 `src/components/admin-workspace-labels.ts`로 분리.
