# `oss-hub-practice`

`oss-hub-practice`는 `oss-hub`의 초기 아키텍처와 문서 구성을 기준으로 학생이
fork한 뒤 직접 배포하는 연습 저장소입니다. 제품 데이터와 운영 secret은 복사하지
않습니다.

## Student path

이 가이드는 practice 저장소(Vercel serverless + Supabase 오버레이가 적용된 상태)를 기준으로 합니다.
원본 `oss-hub`의 baseline은 SQLite 기반이며 이 가이드로 배포할 수 없습니다.

1. **Fork**: GitHub에서 `JNU-SWCU/oss-hub-practice`를 자신의 계정으로 fork합니다. fork에는 원본의
   secret과 collaborator가 이전되지 않으므로 아래 단계에서 직접 등록합니다.
2. **Vercel 프로젝트 3개 생성**: Vercel에서 fork한 저장소를 세 번 import합니다.
   - demo 프로젝트: Root Directory를 비워 저장소 루트를 사용합니다. 현재 디자이너가 검토할
     Vite mock demo가 이 프로젝트에 배포됩니다.
   - front 프로젝트: Root Directory를 `front`로 지정합니다. 아직 domain-empty scaffold입니다.
   - backend 프로젝트: Root Directory를 `backend`로 지정합니다. NestJS API가 하나의 Vercel
     Function으로 배포됩니다.
   - 세 프로젝트 모두 Settings → Environment Variables에 `ENABLE_EXPERIMENTAL_COREPACK=1`을
     추가하고(루트 `package.json`의 `pnpm@10.34.5` 핀을 Vercel이 사용하게 함), Settings →
     General → Node.js Version을 `22.x`로 선택합니다.
   - 확인: 첫 배포 build log에서 pnpm `10.34.5`와 Node `22`가 사용되는지 봅니다. 다른 버전이
     보이면 Corepack 변수나 Node 설정이 누락된 것입니다.
3. **Supabase 환경 분리**: Preview 전용 project와 Production 전용 project를 각각 만들고,
   각 Dashboard의 Connect에서 두 연결 문자열을 복사합니다. 실제 운영 데이터나 credential을
   Preview project와 공유하지 않습니다.
   - transaction pooler(포트 `6543`): 최소 권한 runtime role용. `pgbouncer=true`와
     `sslmode=require`를 query parameter로 지정합니다. 이 role에는 DDL 권한을 주지 않고 실제
     application schema/table에 필요한 권한만 부여합니다.
   - direct/session(포트 `5432`): 별도 migrator role의 `prisma migrate deploy` 전용입니다.
     `sslmode=require`를 지정하고 보호된 마이그레이션 환경에만 둡니다.
4. **환경 변수 등록**:
   - backend Vercel 프로젝트: Preview project의 pooler URL은 **Preview scope**에, Production
     project의 pooler URL은 **Production scope**에 각각 `DATABASE_URL`로 등록합니다. All
     Environments scope로 database credential을 공유하지 않습니다.
   - backend Preview Deployment Protection을 켠 뒤 Preview `DATABASE_URL`을 등록합니다.
   - `DIRECT_URL`은 마이그레이션 전용이므로 **Vercel에 등록하지 않습니다** — 로컬 또는
     보호된 마이그레이션 환경에만 둡니다.
   - `DATABASE_URL`은 반드시 pooler(포트 `6543`, `pgbouncer=true`, `sslmode=require`) 형식이어야
     하며, 그렇지 않으면 backend가 기동 시점에 명시적으로 거부합니다.
   - demo와 front Vercel 프로젝트: 현재는 등록할 환경 변수가 없습니다. front→backend API 연결(공개
     변수명, CORS 규칙)은 첫 API 소비 기능이 생길 때 결정하는 것으로 **명시적으로 연기**되어
     있으며, 그 전까지 front preview는 backend와 독립적으로 동작합니다. DB 관련 secret은
     어떤 경우에도 front에 두지 않습니다.
   - backend 변수 이름과 형식은 `backend/.env.example`을 기준으로 합니다.
5. **CI 통과**: PR을 열면 GitHub Actions가 아래 12개 명령을 순서대로 실행합니다. 실패한 스텝은
   저장소 루트에서 같은 명령으로 로컬 재현합니다.
   1. `pnpm install --frozen-lockfile`
   2. `DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" pnpm --filter ./backend db:generate`
      (generate는 DB 접속 없이 동작하며, 형식만 유효한 비밀 아닌 placeholder면 충분합니다)
   3. `DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" pnpm --filter ./backend exec prisma validate`
   4. `pnpm lint`
   5. `pnpm test`
   6. `pnpm build`
   7. `pnpm workspace:lint`
   8. `pnpm workspace:typecheck`
   9. `pnpm --filter ./backend test`
   10. `pnpm workspace:build`
   11. `pnpm exec playwright install --with-deps chromium`
   12. `pnpm test:e2e`
   작은 PR 하나에 Designer 또는 Tech Lead quest의 검증 결과를 기록합니다.
6. **Preview 확인**: 세 preview deployment를 각각 엽니다.
   - demo: `/login` 직접 접속 후 역할 선택 화면이 보이고 학생 → 대회 → 신청 흐름이 동작합니다.
   - front: 초기 Next.js 페이지가 렌더링됩니다.
   - backend: 존재하지 않는 경로가 NestJS 404 JSON으로 응답하면 함수가 기동한 것입니다.
   하나라도 build에 실패하면 2단계의 Root Directory와 toolchain 설정부터 다시 확인합니다.
7. **Production과 rollback**: PR Preview에서 검증한 뒤 `main`을 production으로 승격합니다. 회귀가
   확인되면 Vercel Deployments에서 마지막 정상 deployment를 Instant Rollback 대상으로 선택하고,
   원인 수정은 새 PR로 진행합니다. database migration은 application rollback과 별도로 검토합니다.

## Must not

- production token, database credential, 개인 access token을 fork에 복사하지 않습니다.
- Supabase service role key를 browser 환경변수로 노출하지 않습니다.
- `migrate dev`를 production DB에 실행하지 않습니다.
- 원본 저장소의 secret이나 collaborator를 fork로 자동 이전한다고 가정하지 않습니다.

## Divergence from oss-hub

이 practice 오버레이를 처음 만든 역사적 seed SHA는 `94ba8c6305a87a89afaf9efa19fe09d1792f49fa`입니다. 현재 `origin/main`과의 실제 공통 기준은 Git 기록으로 확인하며 이 값은 동기화 기준으로 사용하지 않습니다.

| Ownership | Scope | Synchronization rule |
| --- | --- | --- |
| Shared invariant | `front/src`, backend module boundaries, root `DESIGN.md`, onboarding, `AGENTS.md` managed blocks | 명시적인 cherry-pick으로만 동기화합니다. |
| oss-hub owned | Self-hosted deployment history, SQLite Prisma baseline, pnpm 11 | practice 배포 경로에는 포함하지 않으며 명시적인 cherry-pick 없이 동기화하지 않습니다. |
| practice owned | 세 Vercel config, backend handler, Postgres Prisma, pnpm `10.34.5`/Node `22` pin, backend Vitest, practice CI/guide | oss-hub로 역전파하지 않습니다. |

practice 저장소에는 Vercel에서 실행되는 파일만 유지하며 별도 container/server 배포 예제는 두지 않습니다.
