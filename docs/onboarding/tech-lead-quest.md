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
- [ ] CI 성공 뒤 Jenkins webhook 또는 polling으로 CD를 시작한다.
- [ ] Jenkins가 승인된 commit만 checkout하고 Docker image를 build/push한다.
- [ ] 서버는 image digest를 받아 `docker compose pull`과 `docker compose up -d`를 수행한다.
- [ ] migration은 release 단계에서 `prisma migrate deploy`로만 실행한다.

## Quest 3: 서버와 네트워크

- [ ] Nginx가 80/443을 받고 front/backend 내부 포트로 reverse proxy한다.
- [ ] backend와 database 포트를 인터넷에 직접 공개하지 않는다.
- [ ] SSH 포트 변경은 보조 조치일 뿐이며, key-only 로그인, root 로그인 금지,
  firewall allowlist, fail2ban 또는 equivalent, 로그 모니터링을 함께 적용한다.
- [ ] Jenkins secret, GitHub token, database URL은 서버 파일과 CI secret에만 둔다.
- [ ] rollback image와 health check 실패 시 복구 절차를 작성한다.

## Agent prompt checklist

- [ ] 환경: GitHub, Jenkins, Docker host, domain, Vercel/Supabase 중 명시
- [ ] 보안 경계와 secret 위치 명시
- [ ] 성공/실패 health check 명시
- [ ] 로그, rollback, cleanup 검증 명시
