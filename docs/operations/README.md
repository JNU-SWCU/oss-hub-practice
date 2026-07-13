# Operations Baseline

## Delivery flow

`pull request -> GitHub Actions CI -> Vercel Preview -> review -> main -> Vercel Production`

저장소 루트, `front`, `backend`를 서로 다른 Vercel 프로젝트로 연결합니다. Preview URL에서
실제 화면과 API 응답을 검증한 뒤 production으로 승격하며, CI 결과를 Preview 검증으로 대체하지
않습니다.

## Local and production boundaries

- Local: root/front/backend의 pnpm script로 각 surface를 실행합니다.
- Production: demo와 front는 공개 웹 프로젝트, backend는 별도 Vercel Function 프로젝트입니다.
- Database: backend만 Supabase pooler의 `DATABASE_URL`을 사용하며 browser bundle에는 secret을
  넣지 않습니다.
- Prisma migration history는 커밋하고 generated client는 무시합니다.
- Preview smoke check, Vercel function logs, Instant Rollback, database backup/restore runbook을
  릴리스 조건으로 둡니다.

구체적인 프로젝트 생성, 환경 변수, 검증, rollback 절차는
[`../practice-repository.md`](../practice-repository.md)를 따릅니다.

## Security baseline

Vercel project access를 최소 권한으로 제한하고 backend Preview protection을 켭니다.
Preview와 Production은 별도 Supabase project와 scope별 `DATABASE_URL`을 사용하며, database
credential을 All Environments scope로 공유하지 않습니다. Supabase network/database 권한,
audit log, secret rotation을 함께 검토합니다. Runtime role은 TLS pooler 연결과 필요한 DML
권한만 사용하고, 별도 migrator role만 DDL 권한을 가집니다. `DIRECT_URL`은 보호된 마이그레이션
환경에만 두고 Vercel runtime에는 등록하지 않습니다.
