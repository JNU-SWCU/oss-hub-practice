# PROJECT KNOWLEDGE BASE

**Generated:** 2026-07-10
**Commit:** cf45d26
**Branch:** main

## OVERVIEW

JNU OSS Hub is transitioning from the preserved root Vite React prototype to a
pnpm workspace with `front/` (Next.js App Router) and `backend/` (NestJS + Prisma).
The new packages are initialized as architecture boundaries; product domains and
business controllers remain deferred until the PRD vocabulary is confirmed.

## STRUCTURE

```text
jnu-oss-hub/
├── src/                         # React app, mock domain model, fixtures, styles
├── front/                       # Next.js package: app, features, shared
├── backend/                     # NestJS package: modules, database, common, prisma
│   ├── components/              # Route screens and shared navigation shell
│   └── components/competition/  # Competition listing, detail, form, public dashboard pieces
├── tests/e2e/                   # Playwright smoke coverage for demo flows
├── docs/                        # Craft docs ontology; do not map as code
├── index.html                   # Vite root document with #root
└── package.json                 # pnpm scripts and Vite/React/Vitest/Biome toolchain
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| App mount | `src/main.tsx` | Creates the React root and renders `App`. |
| State/history flow | `src/App.tsx` | Owns persona, route, metric, in-memory `DemoState`, and history navigation. |
| Mock route dispatch | `src/components/AppRoutes.tsx` | Switches public, student, staff, admin, competition, and not-found views. |
| Shared chrome | `src/components/AppShell.tsx` | Top navigation, role labels, and role landing paths. |
| Domain rules/data | `src/domain.ts`, `src/domain-types.ts`, `src/domain-utils.ts`, `src/demo-fixtures.ts` | Keep mutations and fixture shape here before touching UI. |
| Competition UI | `src/components/competition/` | Parent `src/components/AGENTS.md` covers this nested boundary. |
| Styling | `src/styles.css` | Single stylesheet for the SPA. |
| Verification | `src/domain.test.ts`, `tests/e2e/` | Unit domain checks plus Playwright demo smoke tests. |

## CODE MAP

Centrality unmeasured in this run; codegraph/LSP was unavailable, so the map uses explore/ast-grep fallback evidence.

| Symbol | Type | Location | Refs | Role |
|--------|------|----------|------|------|
| `App` | React component | `src/App.tsx` | entry-owned | Holds route/persona/demo state and passes handlers into the route layer. |
| `readRoute` / `replaceRoute` | functions | `src/App.tsx` | internal | Normalizes `/` to `/login` and syncs browser history. |
| `AppRoutes` | React component | `src/components/AppRoutes.tsx` | called by `App` | Mock path dispatcher; enforces persona gates before rendering screens. |
| `competitionIdFromPath` / `findCompetition` | functions | `src/components/AppRoutes.tsx` | internal | Extracts competition detail/apply targets from mock URLs. |
| `AppShell` | React component | `src/components/AppShell.tsx` | called by `App` | Shared topbar, navigation, persona chip, and logout/persona change action. |
| `landingByRole` | constant | `src/components/AppShell.tsx` | called by `App` and shell | Single source for persona landing routes. |
| `createInitialState` and domain mutators | functions | `src/domain.ts` | app handlers/tests | Produce and update the demo state without a server. |
| `DemoState`, `RoleId`, `MetricId` | types | `src/domain-types.ts` | app/domain/components | Shared TypeScript contract for the mock workflow. |

## CURRENT-PROJECT CONVENTIONS

- Use `pnpm` scripts; the lockfile and workspace file are already present.
- Keep user-facing Korean copy stable unless the task is explicitly content work.
- Prefer domain helpers in `src/domain.ts` over ad hoc component-side mutation.
- Keep persona route behavior compatible with the current mock `window.history` flow.
- Keep TypeScript domain types close to `src/domain-types.ts`; UI files should consume them.
- Treat `src/components/competition/` as covered by `src/components/AGENTS.md` unless it gains separate conventions.

## ANTI-PATTERNS (THIS PROJECT)

- Do not add product domains, controllers, auth, jobs, or schema models before the PRD names them.
- Do not import Prisma outside `backend/src/database/prisma/` or expose backend secrets to `front/`.
- Do not add a second `front/app` or `front/pages` root beside `front/src/app`.
- Do not move mock state out of `App` or fixture/domain files just to satisfy a local UI change.
- Do not create `src/components/competition/AGENTS.md`; parent coverage is sufficient for the current score.
- Do not rewrite docs, tests, configs, or the managed Development Flow block during cartography-only work.

## COMMANDS

```bash
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm check
pnpm test:e2e
pnpm lint
```

## DOCS & DECISIONS

- Architecture map: [`docs/architecture.md`](docs/architecture.md)
- Decision records (explicit-only): [`docs/decisions/`](docs/decisions/) — index in [`docs/decisions/README.md`](docs/decisions/README.md)
- Active plans: [`docs/exec-plan/active/`](docs/exec-plan/active/) · Research: [`docs/research/`](docs/research/) · Rules: [`docs/rules/`](docs/rules/)

## NOTES

- Repository is dirty on `main`; do not commit cartography changes from this task.
- `dist/` and Playwright reports may exist locally, but they are not the source map.
- The managed Development Flow block below is Craft-owned and must stay byte-for-byte intact unless a Craft flow migration explicitly replaces it.

<!-- BEGIN CRAFT-SKILLS INIT DEVELOPMENT FLOW -->
## Development Flow Recipe

Use an issue-driven loop for all repository work:

1. Open or select one GitHub issue describing the change.
2. Never commit directly on `main`. Use a worktree when you need isolation: `git wt <name>` creates (or reuses) a named worktree off the default branch. Reuse a small fixed pool (e.g. `lane-1`~`lane-3`) rather than making a new one per issue.
3. Plan first for non-trivial work: write the intended change, affected files, verification, and rollback note before editing.
4. Fan out into small PRs when a change spans unrelated domains, mixes assets with logic, or needs independent review lanes.
5. Attach review evidence to each PR: tests or checks run, screenshots/transcripts for user-facing behavior, and the issue or planning links that justify the change.
6. Merge only after review. If the user explicitly asks to record a durable decision, hand off to the `document` skill and use `docs/decisions/` as the destination.

Conventions agents must follow:

- Keep each change scoped to its issue. When work — planning, a requirements interview, or implementation — surfaces an out-of-scope problem (a new topic, unrelated bug, or follow-up idea beyond the current issue), open a new GitHub issue for it with one Type label instead of expanding the current change.
- Plan before editing non-trivial code.
- Prefer fan-out PRs over broad mixed-purpose PRs.
- Include review evidence before requesting/performing review.
- Do not merge before review.
- Do not create or require ADRs unless the user explicitly asks for ADRs.
<!-- END CRAFT-SKILLS INIT DEVELOPMENT FLOW -->
