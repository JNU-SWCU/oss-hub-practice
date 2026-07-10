# Architecture

## Status

This document separates the current implementation from the approved future target.
Current state: the repository remains a Vite React SPA. This run does not migrate
source code, install Next.js/NestJS, create a database, or register new workspaces.
The future target is a single repository with `front/` and `backend/` packages.

The decisions are recorded in:

- [ADR-001: Monorepo Boundary and Migration Staging](decisions/ADR-001-monorepo-boundary.md)
- [ADR-002: Next.js Frontend Organization](decisions/ADR-002-nextjs-frontend-organization.md)
- [ADR-003: NestJS Layered Backend and Prisma Boundary](decisions/ADR-003-nestjs-layered-prisma-boundary.md)

## Target Repository Shape

```text
front/
  src/
    app/
      (public)/
      (protected)/
    features/
      <domain>/
    shared/
      ui/
      lib/
      api/
      config/
      types/
backend/
  src/
    modules/
      <domain>/
    database/
      prisma/
    common/
      <cross-cutting-concern>/
  prisma/
    schema.prisma
    migrations/
  test/
docs/
```

The tree intentionally fixes only the first two levels below each `src/`:
`src/<area>/<owner>`. Deeper files are allowed inside the owning module, but a
new top-level area needs an ADR or an update to the relevant ADR. This keeps the
tree scannable without forcing a full Feature-Sliced Design stack on day one.

`front/` and `backend/` are target package boundaries, not active packages yet.
Until a separate migration plan is executed, the existing root Vite files remain
the active application and the sibling `oss-platform-mock-up` repository remains
outside this repository.

## Frontend Target

The future `front/` app uses Next.js App Router. Next.js does not mandate
feature-driven folders; this is an application convention chosen for ownership
and route composition.

| Folder | Responsibility |
| --- | --- |
| `front/` | Owns the future Next.js frontend package. |
| `front/src/app/` | Owns route segments, layouts, metadata, route handlers, route groups, and composition. It must not own domain logic. |
| `front/src/features/` | Owns user-facing use cases grouped by domain. A feature owns its UI behavior and transport calls; another feature cannot import its internals. |
| `front/src/features/<domain>/` | Owns UI and client behavior for one explicitly named bounded domain. |
| `front/src/shared/` | Owns business-agnostic UI, API client primitives, configuration, types, and utilities admitted by a rule of three. |
| `front/src/shared/ui/` | Owns reusable primitives and composed UI with no feature imports. |
| `front/src/shared/api/` | Owns the single API boundary, base URL, version prefix, and server/client transport policy. |
| `front/src/shared/config/` | Owns validated public configuration. Secrets never enter client bundles. |
| `front/src/shared/types/` | Owns cross-feature contracts that are not domain behavior. |
| `front/docs/` | Owns frontend-specific design and implementation notes before frontend UI code is added. |

Route groups such as `(public)` and `(protected)` organize routing only and do
not become URL segments. Private folders beginning with `_` are reserved for
route-local implementation details.

## Backend Target

The future `backend/` app uses module-first NestJS with a layered dependency
direction inside each domain module:

```text
controller -> service -> repository -> Prisma boundary
```

| Folder | Responsibility |
| --- | --- |
| `backend/` | Owns the future NestJS backend package. |
| `backend/src/modules/` | Owns bounded backend modules. |
| `backend/src/modules/<domain>/` | Owns the module, controller, DTOs, service, repository, and domain-facing types for one backend domain. |
| `backend/src/database/` | Owns backend database integration only. |
| `backend/src/database/prisma/` | Provides the Nest Prisma module and Prisma Client boundary. |
| `backend/src/common/` | Owns cross-cutting guards, filters, pipes, and interceptors. |
| `backend/prisma/schema.prisma` | Owns the Prisma schema when the backend is implemented. |
| `backend/prisma/migrations/` | Owns Prisma migrations when migrations are introduced. |
| `backend/test/` | Owns backend tests. |

Controllers map HTTP DTOs and call services. Services own business rules,
orchestration, and transaction boundaries. Repositories own persistence and map
Prisma rows to domain types. Nest module exports are the public interfaces
between backend domains.

Prisma is backend-only. Frontend code must not import Prisma, generated Prisma
Client, backend database modules, or database schema files. Generated client
output is ignored and regenerated from the schema.

Global `backend/src/controllers`, `backend/src/services`, and
`backend/src/repositories` are rejected as the target layout. Controllers,
services, and repository providers live inside `backend/src/modules/<domain>/`.

## Cross-Cutting Policies

| Concern | Responsibility |
| --- | --- |
| repo root | Owns current Vite SPA files until migration and future workspace configuration when explicitly implemented. |
| `front/` | Future Next.js package; no runtime code is created in this initialization. |
| `backend/` | Future NestJS package; no API, database, or Prisma runtime is created in this initialization. |
| `docs/` | Owns architecture records, plans, research, and decision records. |
| `.env*` | Local secrets are ignored at root and package paths; only `.env.example` variants are trackable. |
| `backend/prisma/migrations/` | Migration history is committed; local databases and generated client output are not. |

The current Vite app is a preserved legacy/prototype surface, not evidence that
the future Next.js structure has already been implemented. A migration must be a
separate scoped change that moves the app, changes workspace manifests, and
updates the regression baseline together.
