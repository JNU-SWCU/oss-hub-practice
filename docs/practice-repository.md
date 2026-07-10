# `oss-hub-practice`

`oss-hub-practice`는 `oss-hub`의 초기 아키텍처와 문서 구성을 기준으로 학생이
fork한 뒤 직접 배포하는 연습 저장소입니다. 제품 데이터와 운영 secret은 복사하지
않습니다.

## Student path

이 가이드는 practice 저장소(Vercel serverless + Supabase 오버레이가 적용된 상태)를 기준으로 합니다.
원본 `oss-hub`의 baseline은 SQLite 기반이며 이 가이드로 배포할 수 없습니다.

1. **Fork**: GitHub에서 `JNU-SWCU/oss-hub-practice`를 자신의 계정으로 fork합니다. fork에는 원본의
   secret과 collaborator가 이전되지 않으므로 아래 단계에서 직접 등록합니다.
2. **Vercel 프로젝트 2개 생성**: Vercel에서 fork한 저장소를 두 번 import합니다.
   - front 프로젝트: Root Directory를 `front`로 지정합니다.
   - backend 프로젝트: Root Directory를 `backend`로 지정합니다.
   - 두 프로젝트 모두 Settings → Environment Variables에 `ENABLE_EXPERIMENTAL_COREPACK=1`을
     추가하고(루트 `package.json`의 `pnpm@10.34.5` 핀을 Vercel이 사용하게 함), Settings →
     General → Node.js Version을 `22.x`로 선택합니다.
   - 확인: 첫 배포 build log에서 pnpm `10.34.5`와 Node `22`가 사용되는지 봅니다. 다른 버전이
     보이면 Corepack 변수나 Node 설정이 누락된 것입니다.
3. **Supabase 프로젝트 생성**: 새 Supabase project를 만들고 Dashboard의 Connect에서 두 연결
   문자열을 복사합니다.
   - transaction pooler(포트 `6543`): 런타임용. 끝에 `?pgbouncer=true`를 붙여 사용합니다.
   - direct/session(포트 `5432`): `prisma migrate deploy` 등 마이그레이션 전용입니다.
4. **환경 변수 등록**:
   - backend Vercel 프로젝트: `DATABASE_URL` = pooler(6543, `?pgbouncer=true`) 연결 문자열만
     등록합니다. `DIRECT_URL`은 마이그레이션 전용이므로 **Vercel에 등록하지 않습니다** —
     로컬 또는 보호된 마이그레이션 환경에만 둡니다.
   - front Vercel 프로젝트: 현재는 등록할 환경 변수가 없습니다. front→backend API 연결(공개
     변수명, CORS 규칙)은 첫 API 소비 기능이 생길 때 결정하는 것으로 **명시적으로 연기**되어
     있으며, 그 전까지 front preview는 backend와 독립적으로 동작합니다. DB 관련 secret은
     어떤 경우에도 front에 두지 않습니다.
   - backend 변수 이름과 형식은 `backend/.env.example`을 기준으로 합니다.
5. **CI 통과**: PR을 열면 GitHub Actions가 아래 6개 명령을 순서대로 실행합니다. 실패한 스텝은
   저장소 루트에서 같은 명령으로 로컬 재현합니다.
   1. `pnpm install --frozen-lockfile`
   2. `DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" pnpm --filter ./backend db:generate`
      (generate는 DB 접속 없이 동작하며, 형식만 유효한 비밀 아닌 placeholder면 충분합니다)
   3. `pnpm workspace:lint`
   4. `pnpm workspace:typecheck`
   5. `pnpm --filter ./backend test`
   6. `pnpm workspace:build`
   작은 PR 하나에 Designer 또는 Tech Lead quest의 검증 결과를 기록합니다.
6. **Preview 확인**: front와 backend preview deployment를 각각 엽니다. front는 페이지가
   렌더링되면 성공, backend는 preview URL 응답(존재하지 않는 경로는 404)이 오면 함수가
   기동한 것입니다. 둘 중 하나라도 build 실패면 2단계의 toolchain 설정부터 다시 확인합니다.

루트 `vercel.json`은 레거시 Vite 프로토타입 참조용이며 배포에는 사용되지 않습니다(두 Vercel
프로젝트는 Root Directory 설정으로 동작).

## Must not

- production token, Jenkins credential, SSH private key를 fork에 복사하지 않습니다.
- Supabase service role key를 browser 환경변수로 노출하지 않습니다.
- `migrate dev`를 production DB에 실행하지 않습니다.
- 원본 저장소의 secret이나 collaborator를 fork로 자동 이전한다고 가정하지 않습니다.

## Divergence from oss-hub

이 practice 오버레이의 기준 seed SHA는 `94ba8c6305a87a89afaf9efa19fe09d1792f49fa`입니다.

| Ownership | Scope | Synchronization rule |
| --- | --- | --- |
| Shared invariant | `front/src`, backend module boundaries, root `DESIGN.md`, onboarding, `AGENTS.md` managed blocks | 명시적인 cherry-pick으로만 동기화합니다. |
| oss-hub owned | Dockerfiles, `docker-compose.yml`, `Jenkinsfile.example`, `nginx/`, SQLite Prisma, pnpm 11 | practice에서는 참조용으로만 유지하며 비활성입니다. |
| practice owned | backend `vercel.json`, handler, Postgres Prisma, pnpm `10.34.5`/Node `22` pin, backend Vitest, practice CI/guide | oss-hub로 역전파하지 않습니다. |

루트 `vercel.json`과 Docker 계열 파일은 reference-only로 유지합니다.
