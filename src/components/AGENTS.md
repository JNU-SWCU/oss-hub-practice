# COMPONENTS CARTOGRAPHY

## OVERVIEW

`src/components/` is the React UI layer for mock route dispatch, shared shell, role workspaces, dashboards, and competition screens.

## STRUCTURE

```text
components/
├── AppRoutes.tsx              # mock path dispatcher and persona gates
├── AppShell.tsx               # topbar/nav/persona shell
├── AdminWorkspace.tsx         # managed users and API-mode controls
├── StaffWorkspace.tsx         # review, correction, publish operations
├── StudentDashboard.tsx       # student-facing application status
├── CompetitionPages.tsx       # re-exports competition page components
└── competition/               # list/detail/form/public dashboard UI pieces
```

## WHERE TO LOOK

| Task | Files | Notes |
|------|-------|-------|
| Add or change a route | `AppRoutes.tsx` | Preserve persona checks and not-found behavior. |
| Shared navigation | `AppShell.tsx` | `landingByRole` is consumed by both shell and `App.enterRole`. |
| Login/persona entry | `LoginPage.tsx` | Reset and persona selection enter through `App` handlers. |
| Admin workflow | `AdminWorkspace.tsx`, `admin-workspace-labels.ts` | Keep labels centralized in the labels file. |
| Staff workflow | `StaffWorkspace.tsx` | Calls domain handlers passed from `App`. |
| Competition pages | `CompetitionPages.tsx`, `competition/*` | Parent coverage is enough; no nested AGENTS file here. |

## CONVENTIONS

- Components receive state and callbacks from `App`; they do not own durable workflow state.
- Route-specific persona notices live beside the dispatcher in `AppRoutes.tsx`.
- Competition page exports flow through `CompetitionPages.tsx` for the dispatcher import.
- Use existing class names from `styles.css`; do not invent style systems locally.
- Keep Korean UI text consistent with neighboring screens.

## ANTI-PATTERNS

- Do not import fixtures directly into components; use `state` props from `App`.
- Do not duplicate domain mutation logic in button handlers.
- Do not move `landingByRole` away from `AppShell.tsx` without updating `App.enterRole`.
- Do not create `competition/AGENTS.md` for current scope; this file covers that UI boundary.
- Do not add React Router or context providers inside components as a local shortcut.
