# Backend Guidance

- This package is NestJS module-first.
- Keep bounded contexts in `src/modules/<domain>` and use
  `controller -> service -> repository -> Prisma boundary`.
- Only `src/database/prisma` owns Prisma Client lifecycle and generated-client imports.
- `src/common` is for cross-cutting concerns, not product behavior.
- Do not add domain modules until the PRD vocabulary and ownership are confirmed.
