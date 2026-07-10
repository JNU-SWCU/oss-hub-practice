# SRC CARTOGRAPHY

## OVERVIEW

`src/` is the whole Vite SPA runtime: mount, route state, mock domain model, fixtures, components, and stylesheet.

## WHERE TO LOOK

| Task | Files | Notes |
|------|-------|-------|
| Browser entry | `main.tsx` | Mounts `App` into the Vite `#root`; no routing library is used. |
| App state | `App.tsx` | Owns `Route`, selected persona, `DemoState`, metric, and browser history sync. |
| Domain contract | `domain-types.ts` | Source of shared IDs, roles, calls, teams, users, applications, metrics. |
| Domain mutations | `domain.ts`, `domain-utils.ts` | Use these for application submit, approval, correction, publish, user status, API mode. |
| Seed data | `demo-fixtures.ts` | Demo calls, teams, managed users, announcements, and default state inputs. |
| UI boundary | `components/` | Route dispatch, shell, dashboards, admin/staff/student screens, competition UI. |
| Styling | `styles.css` | Global app styles; no CSS modules or component-local styles in current shape. |
| Unit checks | `domain.test.ts` | Focused coverage for domain behavior, not component rendering. |

## CODE MAP

| Flow | Start | End |
|------|-------|-----|
| Initial render | `main.tsx` | `App` mounts and initializes `createInitialState()`. |
| Persona entry | `App.enterRole` | `landingByRole[nextRole]` route is pushed. |
| Mock navigation | `App.navigate` | `AppRoutes` receives the current pathname. |
| Student application | `AppRoutes` apply branch | `submitStudentApplication` updates in-memory state. |
| Staff review | `StaffWorkspace` handlers | `approveTeam`, `requestTeamCorrection`, `publishTeamAsset`. |
| Admin changes | `AdminWorkspace` handlers | `addManagedUser`, `updateManagedUserStatus`, `setApiMode`. |

## CONVENTIONS

- Keep state transitions pure in domain helpers; components pass user intent and render results.
- Keep fixture edits compatible with `createInitialState()` and existing domain tests.
- Keep mock routes as plain path strings until a routing migration is explicitly requested.
- Use `readonly` props/types consistently with existing files.

## ANTI-PATTERNS

- Do not add backend calls, persistence, or auth simulation inside `src/`.
- Do not bypass `domain.ts` with component-local copies of business rules.
- Do not add a second app root, router provider, or global store for a narrow screen change.
- Do not treat `domain.test.ts` as UI coverage; use Playwright for visible flow checks.
