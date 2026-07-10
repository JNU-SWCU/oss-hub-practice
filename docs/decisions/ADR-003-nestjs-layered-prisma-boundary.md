---
slug: ADR-003-nestjs-layered-prisma-boundary
date: 2026-07-10
author: Codex
status: Accepted
references:
  - ADR-001-monorepo-boundary
refines: []
---

# ADR-003: NestJS Layered Backend and Prisma Boundary

## Status

Accepted

## Date

2026-07-10

## Context

The backend is a greenfield NestJS service with Prisma as its persistence tool.
Nest organizes related controllers and providers through modules. The service
needs a predictable dependency direction and a single place where ORM details are
allowed to enter the application.

The product is initially CRUD and HTTP-focused. A hexagonal architecture would
add ports and adapters before a second delivery mechanism or framework-neutral
domain requires them.

## Decision

The future backend uses feature modules with a layered direction:

```text
controller -> service -> repository -> Prisma boundary
```

The visible two-depth tree below `backend/src` is:

```text
backend/src/
  modules/
    <domain>/
  database/
    prisma/
  common/
    <cross-cutting-concern>/
```

Each `modules/<domain>/` owns its Nest module, controllers, DTOs, service,
repository, and domain-facing types. Controllers map HTTP input/output only.
Services own business rules, orchestration, and transaction boundaries.
Repositories own Prisma queries and map ORM rows to domain types. The Prisma
module/client is available only through `backend/src/database/prisma/`.

The schema and migration history live under `backend/prisma/`. Generated client
output is ignored and regenerated from the schema. Frontend code never imports
Prisma, its generated client, backend database modules, or schema files.

## Alternatives considered

### Global layer-first folders

- Pros: the controller/service/repository layers are immediately visible.
- Cons: one domain's changes span global folders and module ownership becomes
  difficult to enforce.
- **Rejected:** feature modules match Nest's module boundary while retaining the
  layered dependency rule within each module.

### Hexagonal architecture from the first endpoint

- Pros: framework-independent domain and replaceable adapters.
- Cons: ports and adapters add ceremony without a current second delivery
  mechanism or persistence implementation swap.
- **Rejected:** layered architecture is the lower-cost greenfield default here;
  a later migration is possible if the domain or delivery modes justify it.

### Prisma imports in controllers/services

- Pros: less initial wiring.
- Cons: ORM details leak into transport/business code and make tests and future
  persistence changes harder.
- **Rejected:** all ORM access must stay behind the database/repository boundary.

## Consequences

### Enables

- Thin HTTP controllers and testable business services.
- Centralized Prisma lifecycle, generation, migrations, and transaction policy.
- Domain modules that can evolve without global layer sprawl.

### Costs / trade-offs

- Even simple CRUD keeps a service and repository boundary.
- Prisma mapping code is explicit rather than passing ORM rows through.

### New constraints

- A controller may not import a repository or Prisma client directly.
- A service may not accept or return HTTP framework types.
- A repository may not own the transaction boundary; the service does.

## Changelog

- 2026-07-10: initial decision

## References

- [NestJS modules](https://docs.nestjs.com/modules)
- [NestJS providers](https://docs.nestjs.com/providers)
- [Prisma Client](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [Prisma pnpm workspaces](https://www.prisma.io/docs/guides/deployment/pnpm-workspaces)
