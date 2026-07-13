import type {
  Call,
  DemoState,
  ManagedUser,
  MetricId,
  RoleId,
  StudentApplicationInput,
} from "../domain";
import { AdminWorkspace } from "./AdminWorkspace";
import {
  ApplicationForm,
  CompetitionDetail,
  CompetitionList,
  PublicDashboard,
} from "./CompetitionPages";
import { ConsentPage } from "./ConsentPage";
import { StaffWorkspace } from "./StaffWorkspace";
import { StudentDashboard } from "./StudentDashboard";
import { StudentJourney } from "./StudentJourney";

type AppRoutesProps = {
  readonly route: string;
  readonly role: RoleId;
  readonly state: DemoState;
  readonly metric: MetricId;
  readonly publishedTeams: readonly DemoState["teams"][number][];
  readonly hasConsented: boolean;
  readonly hasApplied: boolean;
  readonly onMetricChange: (metric: MetricId) => void;
  readonly onNavigate: (path: string) => void;
  readonly onStudentApply: (input: StudentApplicationInput) => boolean;
  readonly onConsent: () => void;
  readonly onApproveTeam: (teamId: string) => void;
  readonly onRequestCorrection: (teamId: string, reason: string) => void;
  readonly onPublishTeam: (teamId: string) => void;
  readonly onAddUser: (user: ManagedUser) => void;
  readonly onUpdateUserStatus: (
    userId: string,
    status: ManagedUser["status"],
    reason: string,
  ) => void;
  readonly onSetApiMode: (mode: DemoState["apiMode"]) => void;
};

export function AppRoutes(input: AppRoutesProps) {
  const competitionId = competitionIdFromPath(input.route);
  const competition = findCompetition(input.state.calls, competitionId);

  if (input.role === "student" && !input.hasConsented) {
    return <ConsentPage onConsent={input.onConsent} />;
  }

  if (input.role === "student" && input.route === "/consent") {
    return (
      <StudentDashboard
        state={input.state}
        hasApplied={input.hasApplied}
        onNavigate={input.onNavigate}
      />
    );
  }

  if (input.route === "/public/dashboard") {
    return (
      <PublicDashboard
        calls={input.state.calls}
        teams={input.publishedTeams}
        metric={input.metric}
        onMetricChange={input.onMetricChange}
        onNavigate={input.onNavigate}
      />
    );
  }

  if (input.route === "/competitions") {
    return (
      <CompetitionList state={input.state} persona={input.role} onNavigate={input.onNavigate} />
    );
  }

  if (input.route === "/student/dashboard") {
    if (input.role !== "student") {
      return <RoleRequiredNotice roleLabel="학생" onNavigate={input.onNavigate} />;
    }
    return (
      <StudentDashboard
        state={input.state}
        hasApplied={input.hasApplied}
        onNavigate={input.onNavigate}
      />
    );
  }

  if (input.route === "/staff/operations") {
    if (input.role !== "staff") {
      return <RoleRequiredNotice roleLabel="교직원" onNavigate={input.onNavigate} />;
    }
    return (
      <main className="page-shell">
        <StaffWorkspace
          state={input.state}
          onApproveTeam={input.onApproveTeam}
          onRequestCorrection={input.onRequestCorrection}
          onPublishTeam={input.onPublishTeam}
        />
      </main>
    );
  }

  if (input.route === "/admin/console") {
    if (input.role !== "admin") {
      return <RoleRequiredNotice roleLabel="관리자" onNavigate={input.onNavigate} />;
    }
    return (
      <main className="page-shell">
        <AdminWorkspace
          state={input.state}
          onAddUser={input.onAddUser}
          onUpdateUserStatus={input.onUpdateUserStatus}
          onSetApiMode={input.onSetApiMode}
        />
      </main>
    );
  }

  if (input.route.endsWith("/apply") && competition !== undefined) {
    if (input.role !== "student") {
      return <StudentRequiredNotice onNavigate={input.onNavigate} />;
    }
    if (competition.status !== "open") {
      return (
        <main className="page-shell student-flow-page">
          <StudentJourney current="program" />
          <section className="not-found-panel">
            <h1>신청할 수 없는 프로그램입니다</h1>
            <p>접수 중인 프로그램을 선택해 신청서를 작성해 주세요.</p>
            <button
              className="primary-action"
              type="button"
              onClick={() => input.onNavigate("/competitions")}
            >
              프로그램 목록으로 이동
            </button>
          </section>
        </main>
      );
    }
    return (
      <ApplicationForm
        competition={competition}
        onApply={input.onStudentApply}
        onNavigate={input.onNavigate}
      />
    );
  }

  if (competition !== undefined) {
    return (
      <CompetitionDetail
        competition={competition}
        role={input.role}
        teams={input.state.teams}
        metric={input.metric}
        onMetricChange={input.onMetricChange}
        onNavigate={input.onNavigate}
      />
    );
  }

  return <NotFoundNotice onNavigate={input.onNavigate} />;
}

function StudentRequiredNotice({ onNavigate }: { readonly onNavigate: (path: string) => void }) {
  return (
    <main className="page-shell">
      <section className="not-found-panel">
        <h1>학생 persona가 필요합니다</h1>
        <p>신청서는 학생 persona에서만 접근하는 mock route입니다.</p>
        <button className="primary-action" type="button" onClick={() => onNavigate("/login")}>
          로그인으로 이동
        </button>
      </section>
    </main>
  );
}

function RoleRequiredNotice({
  roleLabel,
  onNavigate,
}: {
  readonly roleLabel: string;
  readonly onNavigate: (path: string) => void;
}) {
  return (
    <main className="page-shell">
      <section className="not-found-panel">
        <h1>{roleLabel} persona가 필요합니다</h1>
        <p>이 화면은 {roleLabel} persona에서만 접근하는 시연 route입니다.</p>
        <button className="primary-action" type="button" onClick={() => onNavigate("/login")}>
          로그인으로 이동
        </button>
      </section>
    </main>
  );
}

function NotFoundNotice({ onNavigate }: { readonly onNavigate: (path: string) => void }) {
  return (
    <main className="page-shell">
      <section className="not-found-panel">
        <h1>화면을 찾을 수 없습니다</h1>
        <p>mock route가 없거나 로그인 persona가 맞지 않습니다.</p>
        <button
          className="primary-action"
          type="button"
          onClick={() => onNavigate("/competitions")}
        >
          대회 목록으로 이동
        </button>
      </section>
    </main>
  );
}

function competitionIdFromPath(path: string): string | undefined {
  const parts = path.split("/").filter(Boolean);
  return parts[0] === "competitions" ? parts[1] : undefined;
}

function findCompetition(
  calls: readonly Call[],
  competitionId: string | undefined,
): Call | undefined {
  if (competitionId === undefined) return undefined;
  return calls.find((call) => call.id === competitionId);
}
