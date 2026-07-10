# Demo Review Report

## Verdict

PASS with mock-demo scope. The implementation satisfies the frontend-only demonstration goal and does not claim production GitHub/OAuth/file-upload behavior.

## Scope Reviewed

- Role mock login and role-specific workspaces.
- Public-safe OSS asset projection.
- Student application and GitHub ID validation flow.
- Staff review, correction, approval, and asset-publication mock flow.
- Admin user/status/API observability mock flow.
- Kaggle-style leaderboard and OSS indicator dashboard.
- PRD additions documentation.

## Code Quality Review

| Area | Result | Evidence |
| --- | --- | --- |
| Type safety | PASS | `pnpm typecheck` exits 0; no `as any`, `@ts-ignore`, or `@ts-expect-error` introduced |
| Module size | PASS | Largest source/test files after cleanup: `src/demo-fixtures.ts` 237, `src/components/competition/CompetitionDetailPanel.tsx` 217, `src/components/AdminWorkspace.tsx` 193, `src/components/Leaderboard.tsx` 191, `src/domain.ts` 185 pure LOC |
| Long parameter lists | PASS | Seed team creation now uses typed object records and no helper takes more than 5 parameters |
| Public projection | PASS | `publicTeams()` returns only `published` teams |
| Korean-first UI | PASS | Staff/admin statuses, roles, audit actions, and API alerts render Korean labels |
| Regression coverage | PASS | Unit and E2E tests cover state transitions, public projection, invalid GitHub ID, and privacy redaction |
| Type assertion escape hatches | PASS | `rg "as (MetricId\|ManagedUser\|any)\|@ts-ignore\|@ts-expect-error" src tests` returns no matches |

## Remove-AI-Slops Pass

Behavior lock was already green before cleanup: `pnpm test`, `pnpm build`, and `pnpm test:e2e` passed. Cleanup then focused on the gate findings.

| File | Cleanup |
| --- | --- |
| `src/domain.ts` | Split types, fixture seed data, utility helpers, and state transitions into separate modules |
| `src/demo-fixtures.ts` | Isolated seed data and object-based team fixture creation |
| `src/domain-types.ts` | Isolated domain type contracts used by UI and transitions |
| `src/domain-utils.ts` | Isolated slug/audit helpers shared by fixture and transition code |
| `src/components/AdminWorkspace.tsx` | Split admin labels, API text, and union parsers into `src/components/admin-workspace-labels.ts` so the workspace component stays below the source-size ceiling |
| `src/components/admin-workspace-labels.ts` | Isolated Korean admin labels and safe union parser helpers |

No functional behavior was intentionally changed during this cleanup except the already reviewed public projection policy: public mode only shows `published` assets.

## Overfit / Slop Criteria

| Criterion | Production code result | Test code result |
| --- | --- | --- |
| Obvious comments | PASS: comments are limited to documents; source code avoids section-divider narration | PASS: tests describe behavior in test names instead of comments |
| Over-defensive code | PASS: UI guards are at user-input boundaries only; select values use union parsers, not assertions | PASS: invalid GitHub handle path is an adversarial E2E case, not duplicated implementation checks |
| Excessive complexity | PASS: domain code split by responsibility; no source file exceeds 250 pure LOC; no helper has more than 5 parameters | PASS: E2E tests use direct user flows and avoid helper abstraction for the protected scenarios |
| Needless abstraction | PASS: modules map to real concepts: domain types, fixtures, utils, transitions, role workspaces | PASS: no custom test framework or fixture factory was added |
| Boundary violations | PASS: UI components call state transition functions; fixture creation is outside components | PASS: tests exercise the browser surface and public domain functions without reaching into private helpers |
| Dead code/debug leftovers | PASS: `rg "console\\.log|debugger|TODO|FIXME" src tests` has no shipped debug leftovers | PASS: tests do not contain skipped or focused cases |
| Duplication | PASS: repeated status labeling is intentionally local to role-specific presentation; shared business rules stay in domain modules | PASS: scenario setup is explicit because there are only three E2E cases |
| Performance equivalence | PASS: mock dataset is fixed at 30 students, 12 teams, 18 repositories, and 120 activity events; no unnecessary nested scans on user-scale data | PASS: no performance-heavy tests or network waits beyond Playwright `networkidle` smoke |
| Behavior coverage | PASS: unit tests cover transitions and public projection; E2E covers role flow, validation, approval, privacy | PASS: desktop and mobile Playwright projects run every E2E case |
| Oversized modules | PASS: every `src/*.ts`, `src/*.tsx`, `src/components/*.ts`, `src/components/*.tsx`, and `tests/e2e/*.ts` source/test file is below 250 pure LOC; largest is `src/demo-fixtures.ts` at 237 | PASS: E2E remains focused on route and privacy contracts |

## Security Review

This is a frontend-only mock with no backend, database, file storage, OAuth, GitHub API token, webhook receiver, or secret-bearing environment variable. Public mode was explicitly tested to hide phone numbers, emails, student numbers, consent data, and internal review state. Remaining security work is production-scope, not demo-scope: real auth, RBAC, upload scanning, CORS, CSRF/session policy, audit retention, and GitHub webhook signature verification.

## Remaining Risks

- Vercel deployment is suitable for demo/preview. It is not a final production deployment architecture for the 사업단 homepage.
- The current data is deterministic mock data, not a backend contract.
- GitHub org/repo automation is represented as UI state only.
