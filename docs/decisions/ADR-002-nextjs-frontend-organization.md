---
slug: ADR-002-nextjs-frontend-organization
date: 2026-07-10
author: Codex
status: Accepted
references:
  - ADR-001-monorepo-boundary
refines: []
---

# ADR-002: Next.js Frontend Organization

## Status

Accepted

## Date

2026-07-10

## Context

Next.js App Router defines routing through the `app` directory, but it does not
require a feature-driven directory convention. The frontend needs a structure
that keeps route composition separate from feature behavior while remaining
shallow enough to scan and migrate incrementally.

The frontend is expected to contain both public and authenticated routes. Shared
UI and transport code must not depend on a feature's private implementation.

## Decision

The future Next.js package uses a two-depth convention below `front/src`:

```text
front/src/
  app/
    (public)/
    (protected)/
  features/
    <domain>/
  shared/
    <concern>/
```

`app/` owns route segments, layouts, metadata, route handlers, and composition.
`features/<domain>/` owns domain-specific user-facing behavior. `shared/` owns
business-agnostic UI, API primitives, configuration, and cross-feature types.
Dependencies point downward: `app` may compose features and shared code;
features may use shared code; shared code never imports features or app code.

Feature-driven organization is an application decision, not a claim about a
mandatory Next.js standard. Route groups organize URLs without adding a segment;
private folders are reserved for route-local implementation details.

## Alternatives considered

### Type-based top-level folders

- Pros: familiar for small React apps and easy to start.
- Cons: components, hooks, API calls, and types for one domain become scattered.
- **Rejected:** it does not make ownership clear once the route count and domain
  count grow.

### Full Feature-Sliced Design layers

- Pros: explicit layers and import direction.
- Cons: `pages`, `widgets`, `entities`, and `features` add ceremony before the
  product has stable bounded contexts.
- **Rejected:** the two-depth `app/features/shared` contract gives the needed
  ownership with a smaller migration and review surface.

## Consequences

### Enables

- Route-aware Next.js composition without putting business logic in `app/`.
- Domain ownership for feature code and a downward dependency rule.
- Incremental migration from the preserved Vite prototype.

### Costs / trade-offs

- Some small features will have more folders than a flat component tree.
- Shared admission requires discipline and a rule-of-three check.

### New constraints

- No feature may deep-import another feature's internals.
- `shared/ui` cannot import from `features` or `app`.
- API base URL and versioning are defined once in `shared/api`.

## Changelog

- 2026-07-10: initial decision

## References

- [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js `src` folder](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)
- [Next.js route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
- [Next.js private folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders)
