# Compose, Nginx, Jenkins

초기 구현에서는 운영 서버의 외부 노출을 Nginx로 한정합니다.

```text
Internet -> Nginx :443 -> front :3000
                     -> backend :4000 -> Supabase/Postgres
GitHub Actions CI -> Jenkins webhook -> image registry -> Docker Compose
```

Jenkins credential에는 registry, GitHub read token, SSH deploy key를 별도로
등록합니다. 서버의 `.env`는 Git에 두지 않습니다. 배포 job은 commit SHA를
입력받고, image pull, migration deploy, compose restart, health check, rollback
순서를 로그로 남깁니다.
