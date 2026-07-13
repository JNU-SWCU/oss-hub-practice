# Tech Lead Quest

## Quest 1: GitHub API 연결 구조

- [ ] 브라우저가 GitHub token을 직접 보지 않는 이유를 설명한다.
- [ ] `front -> backend API -> GitHub API` 흐름과 실패 응답을 그린다.
- [ ] backend module, service, repository, GitHub client adapter의 책임을 나눈다.
- [ ] 최소 권한 token, secret 저장소, rate limit, pagination, retry 정책을 기록한다.
- [ ] GitHub 계정과 학생을 어떻게 연관지을지(username 등록 또는 OAuth 등 계정 매핑 전략)를 기록한다.
- [ ] 학생 활동 데이터의 수집 범위(commit, PR, review)와 GitHub API rate limit 영향을 기록한다.

## Quest 2: CI/CD

- [ ] GitHub Actions에서 install, lint, typecheck, test, build를 실행한다.
- [ ] root, `front`, `backend`를 별도 Vercel 프로젝트로 연결하고 Root Directory 차이를 설명한다.
- [ ] PR마다 세 Preview deployment를 확인하고 CI 결과와 함께 검토한다.
- [ ] 승인된 `main` commit만 production alias로 승격한다.
- [ ] migration은 release 단계에서 `prisma migrate deploy`로만 실행한다.

## Quest 3: Runtime과 network boundary

- [ ] browser에는 database secret이나 GitHub token을 노출하지 않는다.
- [ ] Preview와 Production에 별도 Supabase project와 scope별 pooler `DATABASE_URL`을 등록하고
  migration용 `DIRECT_URL`을 Vercel runtime에서 분리한다.
- [ ] Runtime role은 `sslmode=require`와 최소 DML 권한만 사용하고 migrator role과 분리한다.
- [ ] backend Preview protection을 켜고 Vercel project member 권한을 검토한다.
- [ ] Vercel Function log에서 cold start, 4xx, 5xx를 확인하는 방법을 기록한다.
- [ ] 마지막 정상 deployment로 Instant Rollback하고 후속 수정 PR을 만드는 절차를 작성한다.

## Agent prompt checklist

- [ ] 환경: GitHub, Vercel project와 Root Directory, Supabase project, domain 중 명시
- [ ] 보안 경계와 secret 위치 명시
- [ ] 성공/실패 health check 명시
- [ ] Preview smoke check, function log, rollback 검증 명시
