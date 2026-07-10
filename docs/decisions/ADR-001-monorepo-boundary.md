---
slug: ADR-001-monorepo-boundary
date: 2026-07-10
author: Codex
status: Accepted
references:
  - docs/architecture.md
refines: []
---

# ADR-001: Monorepo Boundary and Migration Staging

## Status

Accepted

## Date

2026-07-10

## Context

The current product repository is `/jnu-oss-hub`, a Vite React SPA with its own
Git history, package manifest, lockfile, tests, and agent guidance. The parent
workspace is not a Git repository and contains another independent frontend
repository, `oss-platform-mock-up`. Treating the parent as the product root would
mix repository boundaries and make the current application harder to verify.

The desired direction is one repository containing a Next.js frontend and a
NestJS backend using Prisma. The current Vite application must remain usable
while that migration is designed and approved.

## Decision

`jnu-oss-hub` is the future monorepo boundary. The target package names are
`front/` and `backend/`, but this initialization does not create or register
those runtime packages. The current root Vite application remains the active
legacy/prototype surface until a separate migration plan is approved.

The sibling `oss-platform-mock-up` repository and the parent workspace docs remain
outside this boundary.

## Alternatives considered

### Initialize the parent workspace

- Pros: both frontend repositories would appear under one directory.
- Cons: the parent has no Git/package boundary and contains unrelated artifacts.
- **Rejected:** it would combine independent repositories and make ownership,
  history, and verification ambiguous.

### Migrate the Vite app into `front/` immediately

- Pros: the desired directory shape would exist at once.
- Cons: it changes the workspace manifest, lockfile, scripts, and source paths in
  one step before the Next.js application contract is implemented.
- **Rejected:** it is a separate migration with a larger rollback surface than
  this documentation/init task.

## Consequences

### Enables

- A clear repository boundary for future `front/` and `backend/` packages.
- A reversible migration path that preserves current frontend verification.
- Independent Git history for the sibling prototype.

### Costs / trade-offs

- The requested monorepo folder shape is documented before it is physically
  registered as a workspace.
- The current root Vite layout temporarily coexists with the future target.

### New constraints

- A migration PR must update workspace manifests, lockfiles, scripts, and source
  paths together.
- No new backend or frontend package may silently import from the legacy root
  `src/` tree.

## Changelog

- 2026-07-10: initial decision

## References

- [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Prisma pnpm workspaces](https://www.prisma.io/docs/guides/deployment/pnpm-workspaces)
