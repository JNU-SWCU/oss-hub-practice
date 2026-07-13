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

const studentConsentKey = "jnu-oss-demo-student-consent";

export function App() {
  const [route, setRoute] = useState<Route>(() => readRoute());
  const [role, setRole] = useState<RoleId | undefined>(undefined);
  const [hasConsented, setHasConsented] = useState(
    () => window.sessionStorage.getItem(studentConsentKey) === "accepted",
  );
  const [hasApplied, setHasApplied] = useState(false);
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

  useEffect(() => {
    if (role !== "student" || route.path === "/login") return;
    const requiredRoute = hasConsented ? "/student/dashboard" : "/consent";
    const needsConsent = !hasConsented && route.path !== "/consent";
    const revisitsCompletedConsent = hasConsented && route.path === "/consent";
    if (needsConsent || revisitsCompletedConsent) {
      replaceRoute(requiredRoute);
      setRoute(readRoute());
    }
  }, [hasConsented, role, route.path]);

  function navigate(path: string): void {
    window.history.pushState(null, "", path);
    window.scrollTo({ top: 0, left: 0 });
    setRoute(readRoute());
  }

  function enterRole(nextRole: RoleId): void {
    setRole(nextRole);
    navigate(nextRole === "student" && !hasConsented ? "/consent" : landingByRole[nextRole]);
  }

  function handleReset(): void {
    setState(createInitialState());
    setRole(undefined);
    setHasConsented(false);
    window.sessionStorage.removeItem(studentConsentKey);
    setHasApplied(false);
    setMetric("activity");
    navigate("/login");
  }

  function handleStudentApply(input: StudentApplicationInput): boolean {
    const nextState = submitStudentApplication(state, input);
    if (nextState === state) return false;
    setState(nextState);
    setHasApplied(true);
    return true;
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
        hasConsented={hasConsented}
        hasApplied={hasApplied}
        onMetricChange={setMetric}
        onNavigate={navigate}
        onStudentApply={handleStudentApply}
        onConsent={() => {
          window.sessionStorage.setItem(studentConsentKey, "accepted");
          setHasConsented(true);
          navigate("/student/dashboard");
        }}
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
