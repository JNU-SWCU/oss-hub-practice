# Operations Baseline

## Delivery flow

`pull request -> GitHub Actions CI -> protected main -> Jenkins webhook ->
Docker build/push -> server pull -> docker compose up -> health check -> Nginx`

Jenkins는 배포만 담당하고 CI 결과를 대체하지 않습니다. 이미지에는 commit
SHA 또는 digest를 붙이고, 서버는 mutable `latest`만으로 배포하지 않습니다.

## Local and production boundaries

- Local: `docker compose`로 front/backend를 실행하고 Supabase 또는 local DB를 선택합니다.
- Production: Nginx만 외부에 공개하고 application/database network는 내부에 둡니다.
- Prisma migration history는 커밋하고 generated client와 local SQLite 파일은 무시합니다.
- health check, structured logs, rollback image, backup/restore runbook을 릴리스 조건으로 둡니다.

## Security baseline

SSH 포트 변경만으로 보안을 판단하지 않습니다. key-only 인증, root login 금지,
최소 권한 사용자, firewall allowlist, 자동 차단, 패치, 로그 감사, secret rotation을
함께 설정하고 실제 접속/차단을 검증합니다.
