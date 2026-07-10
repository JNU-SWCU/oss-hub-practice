import { useEffect, useMemo, useState } from "react";
import { AppRoutes } from "./components/AppRoutes";
import { AppShell, landingByRole } from "./components/AppShell";
import { LoginPage } from "./components/LoginPage";
import {
  addManagedUser,
  approveTeam,
  createInitialState,
  publicTeams,
  publishTeamAsset,
  requestTeamCorrection,
  setApiMode,
  submitStudentApplication,
  updateManagedUserStatus,
} from "./domain";
import type { DemoState, ManagedUser, MetricId, RoleId, StudentApplicationInput } from "./domain";

type Route = {
  readonly path: string;
  readonly reason: string;
};

export function App() {
  const [route, setRoute] = useState<Route>(() => readRoute());
  const [role, setRole] = useState<RoleId | undefined>(undefined);
  const [state, setState] = useState<DemoState>(() => createInitialState());
  const [metric, setMetric] = useState<MetricId>("activity");
  const publishedTeams = useMemo(() => publicTeams(state.teams), [state.teams]);

  useEffect(() => {
    if (window.location.pathname === "/") {
      replaceRoute("/login");
      setRoute(readRoute());
    }
    function handlePopState(): void {
      setRoute(readRoute());
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(path: string): void {
    window.history.pushState(null, "", path);
    setRoute(readRoute());
  }

  function enterRole(nextRole: RoleId): void {
    setRole(nextRole);
    navigate(landingByRole[nextRole]);
  }

  function handleReset(): void {
    setState(createInitialState());
    setRole(undefined);
    setMetric("activity");
    navigate("/login");
  }

  function handleStudentApply(input: StudentApplicationInput): void {
    setState((current) => submitStudentApplication(current, input));
  }

  function handleApproveTeam(teamId: string): void {
    setState((current) => approveTeam(current, teamId));
  }

  function handleRequestCorrection(teamId: string, reason: string): void {
    setState((current) => requestTeamCorrection(current, teamId, reason));
  }

  function handlePublishTeam(teamId: string): void {
    setState((current) => publishTeamAsset(current, teamId));
  }

  function handleAddUser(user: ManagedUser): void {
    setState((current) => addManagedUser(current, user));
  }

  function handleUpdateUserStatus(
    userId: string,
    status: ManagedUser["status"],
    reason: string,
  ): void {
    setState((current) => updateManagedUserStatus(current, userId, status, reason));
  }

  if (route.path === "/login") {
    return <LoginPage notice={route.reason} onLogin={enterRole} onReset={handleReset} />;
  }

  if (role === undefined) {
    return (
      <LoginPage
        notice="먼저 persona를 선택해야 하는 mock route입니다."
        onLogin={enterRole}
        onReset={handleReset}
      />
    );
  }

  return (
    <AppShell role={role} onNavigate={navigate}>
      <AppRoutes
        route={route.path}
        role={role}
        state={state}
        metric={metric}
        publishedTeams={publishedTeams}
        onMetricChange={setMetric}
        onNavigate={navigate}
        onStudentApply={handleStudentApply}
        onApproveTeam={handleApproveTeam}
        onRequestCorrection={handleRequestCorrection}
        onPublishTeam={handlePublishTeam}
        onAddUser={handleAddUser}
        onUpdateUserStatus={handleUpdateUserStatus}
        onSetApiMode={(apiMode) => setState((current) => setApiMode(current, apiMode))}
      />
    </AppShell>
  );
}

function readRoute(): Route {
  const params = new URLSearchParams(window.location.search);
  return {
    path: window.location.pathname === "/" ? "/login" : window.location.pathname,
    reason: reasonText(params.get("reason")),
  };
}

function replaceRoute(path: string): void {
  window.history.replaceState(null, "", path);
}

function reasonText(reason: string | null): string {
  if (reason === "student-required") {
    return "신청서는 학생 persona에서만 접근하는 mock route입니다.";
  }
  return "";
}
