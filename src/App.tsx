import { useEffect, useMemo, useState } from "react";
import {
  hasRoleHistoryState,
  isPublicVisitorRoute,
  readRoute,
  replaceRoute,
  roleFromHistoryState,
} from "./app-routing";
import type { Route } from "./app-routing";
import { AppRoutes } from "./components/AppRoutes";
import { AppShell, landingByRole } from "./components/AppShell";
import { InformationArchitecturePage } from "./components/InformationArchitecturePage";
import { LoginPage } from "./components/LoginPage";
import {
  type StudentStartChoice,
  studentStartDestinations,
} from "./components/StudentSetupPage.model";
import {
  clearStoredDemoState,
  readStoredDemoState,
  writeStoredDemoState,
} from "./demo-state-storage";
import {
  addManagedUser,
  approveTeam,
  createInitialState,
  createProgramDraft,
  publicTeams,
  publishTeamAsset,
  requestTeamCorrection,
  setApiMode,
  submitStudentApplication,
  updateManagedUserStatus,
} from "./domain";
import type {
  DemoState,
  ManagedUser,
  MetricId,
  ProgramDraftInput,
  RoleId,
  StudentApplicationInput,
} from "./domain";

const legacyStudentConsentKey = "jnu-oss-demo-student-consent";
const studentSetupKey = "jnu-oss-demo-student-setup";

export function App() {
  const [route, setRoute] = useState<Route>(() => readRoute());
  const [role, setRole] = useState<RoleId | undefined>(() => roleFromHistoryState(history.state));
  const [hasCompletedStudentSetup, setHasCompletedStudentSetup] = useState(
    () =>
      window.sessionStorage.getItem(studentSetupKey) === "accepted" ||
      window.sessionStorage.getItem(legacyStudentConsentKey) === "accepted",
  );
  const [state, setState] = useState<DemoState>(() => readStoredDemoState(createInitialState()));
  const [metric, setMetric] = useState<MetricId>("activity");
  const publishedTeams = useMemo(() => publicTeams(state.teams), [state.teams]);
  const loginSummary = useMemo(
    () => ({
      totalPrograms: state.calls.length,
      openPrograms: state.calls.filter((call) => call.status === "open").length,
      reviewQueue: state.teams.filter(
        (team) =>
          team.status === "submitted" ||
          team.status === "correction" ||
          team.status === "provisioned",
      ).length,
      publishedAssets: publishedTeams.length,
    }),
    [publishedTeams.length, state.calls, state.teams],
  );

  useEffect(() => {
    if (window.location.pathname === "/") {
      replaceRoute("/login");
      setRoute(readRoute());
    }

    function handlePopState(event: PopStateEvent): void {
      if (hasRoleHistoryState(event.state)) setRole(roleFromHistoryState(event.state));
      setRoute(readRoute());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (role !== "student" || route.path === "/login") return;
    const requiredRoute = hasCompletedStudentSetup ? "/student/dashboard" : "/student/setup";
    const needsSetup = !hasCompletedStudentSetup && route.path !== "/student/setup";
    const revisitsCompletedSetup =
      hasCompletedStudentSetup && (route.path === "/student/setup" || route.path === "/consent");
    if (needsSetup || revisitsCompletedSetup) {
      replaceRoute(requiredRoute, role);
      setRoute(readRoute());
    }
  }, [hasCompletedStudentSetup, role, route.path]);

  useEffect(() => {
    writeStoredDemoState(state);
  }, [state]);

  function navigate(path: string, nextRole?: RoleId | null): void {
    const historicRole = nextRole === undefined ? role : (nextRole ?? undefined);
    window.history.pushState({ role: historicRole ?? null }, "", path);
    window.scrollTo({ top: 0, left: 0 });
    setRoute(readRoute());
  }

  function enterRole(nextRole: RoleId): void {
    setRole(nextRole);
    navigate(
      nextRole === "student" && !hasCompletedStudentSetup
        ? "/student/setup"
        : landingByRole[nextRole],
      nextRole,
    );
  }

  function handleReset(): void {
    setState(createInitialState());
    clearStoredDemoState();
    setRole(undefined);
    setHasCompletedStudentSetup(false);
    window.sessionStorage.removeItem(studentSetupKey);
    window.sessionStorage.removeItem(legacyStudentConsentKey);
    setMetric("activity");
    navigate("/login", null);
  }

  function handleStudentApply(input: StudentApplicationInput): boolean {
    const nextState = submitStudentApplication(state, input);
    if (nextState === state) return false;
    setState(nextState);
    return true;
  }

  function handleStudentSetupComplete(choice: StudentStartChoice): void {
    window.sessionStorage.setItem(studentSetupKey, "accepted");
    setHasCompletedStudentSetup(true);
    navigate(studentStartDestinations[choice]);
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

  function handleCreateProgramDraft(input: ProgramDraftInput): void {
    setState((current) => createProgramDraft(current, input));
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
    return (
      <LoginPage
        notice={route.reason}
        summary={loginSummary}
        onLogin={enterRole}
        onReset={handleReset}
        onNavigate={navigate}
      />
    );
  }

  if (route.path === "/information") {
    const informationPage = (
      <InformationArchitecturePage onEnterRole={enterRole} onNavigate={navigate} />
    );
    return role === undefined ? (
      informationPage
    ) : (
      <AppShell role={role} onNavigate={navigate}>
        {informationPage}
      </AppShell>
    );
  }

  const effectiveRole = role ?? (isPublicVisitorRoute(route.path) ? "public" : undefined);

  if (effectiveRole === undefined) {
    return (
      <LoginPage
        notice="먼저 역할을 선택해야 접근할 수 있습니다."
        summary={loginSummary}
        onLogin={enterRole}
        onReset={handleReset}
        onNavigate={navigate}
      />
    );
  }

  return (
    <AppShell role={effectiveRole} onNavigate={navigate}>
      <AppRoutes
        route={route.path}
        role={effectiveRole}
        state={state}
        metric={metric}
        publishedTeams={publishedTeams}
        hasCompletedStudentSetup={hasCompletedStudentSetup}
        onMetricChange={setMetric}
        onNavigate={navigate}
        onStudentApply={handleStudentApply}
        onStudentSetupComplete={handleStudentSetupComplete}
        onApproveTeam={handleApproveTeam}
        onRequestCorrection={handleRequestCorrection}
        onPublishTeam={handlePublishTeam}
        onCreateProgramDraft={handleCreateProgramDraft}
        onAddUser={handleAddUser}
        onUpdateUserStatus={handleUpdateUserStatus}
        onSetApiMode={(apiMode) => setState((current) => setApiMode(current, apiMode))}
      />
    </AppShell>
  );
}
