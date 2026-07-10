import { Activity, Github, ShieldCheck } from "lucide-react";
import { type DemoState, leaderboardValue } from "../domain";

type StudentDashboardProps = {
  readonly state: DemoState;
  readonly onNavigate: (path: string) => void;
};

export function StudentDashboard({ state, onNavigate }: StudentDashboardProps) {
  const currentStudentGithub = "jnu-oss-1";
  const latest = state.teams[0];
  const ownedTeams = state.teams.filter((team) => team.members.includes(currentStudentGithub));
  const applications =
    latest === undefined
      ? ownedTeams
      : [latest, ...ownedTeams.filter((team) => team.id !== latest.id)];
  const rankedTeams = [...state.teams].sort(
    (left, right) => leaderboardValue(right, "activity") - leaderboardValue(left, "activity"),
  );
  const primaryTeam = applications[0];
  const activityRank =
    primaryTeam === undefined
      ? undefined
      : rankedTeams.findIndex((team) => team.id === primaryTeam.id) + 1;

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="section-kicker">학생 대시보드</p>
        <h1>내 신청과 저장소 배정 상태</h1>
        <p>
          신청 후 교직원 검토 큐에 반영되고, 승인되면 팀 GitHub 저장소가 배정된 상태로 표시됩니다.
        </p>
      </header>
      <section className="student-status-grid">
        <article className="status-card success">
          <Github size={20} />
          <span>최근 신청</span>
          <strong>{latest?.name ?? "신청 없음"}</strong>
          <p>
            {latest !== undefined
              ? statusText(latest.status)
              : "대회 상세에서 신청서를 작성하세요."}
          </p>
        </article>
        <article className="status-card">
          <Activity size={20} />
          <span>저장소</span>
          <strong>
            {latest?.status === "provisioned" || latest?.status === "published"
              ? "배정 완료"
              : "대기"}
          </strong>
          <p>{latest?.repo ?? "github.com/jnu-sojoong/new-team"}</p>
        </article>
        <article className="status-card warning">
          <ShieldCheck size={20} />
          <span>초대 상태</span>
          <strong>GitHub ID 검증 완료</strong>
          <p>팀원 초대는 GitHub ID 형식 검증을 통과한 상태로 표시됩니다.</p>
        </article>
        <article className="status-card">
          <Activity size={20} />
          <span>내 활동 순위</span>
          <strong>{activityRank === undefined ? "집계 전" : `#${activityRank}`}</strong>
          <p>
            커밋 {primaryTeam?.commits ?? 0}, PR {primaryTeam?.prs ?? 0}, 스타{" "}
            {primaryTeam?.stars ?? 0}, 저장소 {primaryTeam?.repos ?? 0}
          </p>
        </article>
      </section>
      <div className="table-panel">
        <div className="panel-heading">
          <div>
            <h2>신청 이력</h2>
            <p>보완 요청이 있으면 상세 신청서로 돌아가 다시 제출합니다.</p>
          </div>
          <button
            className="primary-action"
            type="button"
            onClick={() => onNavigate("/competitions")}
          >
            대회 선택
          </button>
        </div>
        <div className="table-scroll">
          <table aria-label="학생 신청 이력">
            <thead>
              <tr>
                <th>팀</th>
                <th>대회</th>
                <th>상태</th>
                <th>저장소</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((team) => (
                <tr key={team.id}>
                  <td data-label="팀">{team.name}</td>
                  <td data-label="대회">{team.contest}</td>
                  <td data-label="상태">{statusText(team.status)}</td>
                  <td data-label="저장소">{team.repo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function statusText(status: DemoState["teams"][number]["status"]): string {
  switch (status) {
    case "submitted":
      return "접수 완료";
    case "correction":
      return "보완 요청";
    case "provisioned":
      return "저장소 배정 완료";
    case "published":
      return "공개 자산";
  }
}
