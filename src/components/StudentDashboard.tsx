import { Activity, CalendarDays, Github, ListChecks, ShieldCheck } from "lucide-react";
import {
  type DemoState,
  type ProgramMilestone,
  milestoneStatusLabel,
  submissionForMilestone,
} from "../domain";
import { StudentJourney } from "./StudentJourney";

type StudentDashboardProps = {
  readonly state: DemoState;
  readonly hasApplied: boolean;
  readonly onNavigate: (path: string) => void;
};

export function StudentDashboard({ state, hasApplied, onNavigate }: StudentDashboardProps) {
  const currentStudentGithub = "jnu-oss-1";
  const latest = state.teams[0];
  const ownedTeams = state.teams.filter((team) => team.members.includes(currentStudentGithub));
  const applications =
    latest === undefined
      ? ownedTeams
      : [latest, ...ownedTeams.filter((team) => team.id !== latest.id)];
  const primaryTeam = applications[0];
  const isPublished = primaryTeam?.status === "published";
  const timelineCalls = state.calls
    .filter(
      (call) => call.status === "open" || call.status === "upcoming" || call.status === "active",
    )
    .slice(0, 4);
  const primaryMilestones =
    primaryTeam === undefined
      ? []
      : state.milestones.filter(
          (milestone) => milestone.competitionId === primaryTeam.competitionId,
        );
  const primarySubmissions =
    primaryTeam === undefined
      ? []
      : state.submissions.filter((submission) => submission.teamId === primaryTeam.id);

  return (
    <main className="page-shell student-flow-page">
      <StudentJourney current={hasApplied ? "repository" : "dashboard"} />
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
          <p className="repository-address">
            <RepositoryAddress value={latest?.repo ?? "github.com/jnu-sojoong/new-team"} />
          </p>
        </article>
        <article className="status-card warning">
          <ShieldCheck size={20} />
          <span>초대 상태</span>
          <strong>GitHub ID 검증 완료</strong>
          <p>팀원 초대는 GitHub ID 형식 검증을 통과한 상태로 표시됩니다.</p>
        </article>
        <article className={isPublished ? "status-card success" : "status-card"}>
          <ShieldCheck size={20} />
          <span>공개 전환</span>
          <strong>{isPublished ? "공개 완료" : "대기"}</strong>
          <p>공개 전환된 팀만 공개 아카이브와 리더보드에 표시됩니다.</p>
        </article>
      </section>
      <section className="progress-strip" aria-label="학생 프로그램 진행 단계">
        <ProgressStep
          label="신청"
          value={primaryTeam === undefined ? "대기" : "완료"}
          isActive={primaryTeam !== undefined}
        />
        <ProgressStep
          label="교직원 검토"
          value={primaryTeam?.status === "correction" ? "보완 요청" : "검토 중"}
          isActive={primaryTeam?.status === "submitted" || primaryTeam?.status === "correction"}
        />
        <ProgressStep
          label="저장소 배정"
          value={
            primaryTeam?.status === "provisioned" || primaryTeam?.status === "published"
              ? "완료"
              : "대기"
          }
          isActive={primaryTeam?.status === "provisioned" || primaryTeam?.status === "published"}
        />
        <ProgressStep
          label="공개 자산화"
          value={primaryTeam?.status === "published" ? "공개" : "대기"}
          isActive={primaryTeam?.status === "published"}
        />
      </section>
      {primaryTeam?.correctionReason !== undefined ? (
        <div className="notice-banner correction-banner">
          보완 요청: {primaryTeam.correctionReason}
        </div>
      ) : null}
      <section className="table-panel timeline-panel" aria-labelledby="student-timeline-title">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">
              <CalendarDays size={15} />
              IA 마감 흐름
            </p>
            <h2 id="student-timeline-title">전체 마감 타임라인</h2>
            <p>접수 중이거나 예정된 프로그램을 D-day 기준으로 확인합니다.</p>
          </div>
        </div>
        <div className="deadline-grid">
          {timelineCalls.map((call) => (
            <article key={call.id}>
              <span>{dDayText(call.deadline)}</span>
              <strong>{call.title}</strong>
              <small>
                {call.deadline} · {call.teamSize}
              </small>
            </article>
          ))}
        </div>
      </section>
      <section className="table-panel" aria-labelledby="student-milestone-title">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">
              <ListChecks size={15} />내 제출 상태
            </p>
            <h2 id="student-milestone-title">마일스톤 체크리스트</h2>
            <p>신청서, Repo 초대, 최종 제출까지 내 팀의 현재 위치를 확인합니다.</p>
          </div>
        </div>
        {primaryTeam === undefined ? (
          <p className="empty-state">
            아직 신청한 팀이 없습니다. 프로그램 상세에서 신청을 시작하세요.
          </p>
        ) : (
          <div className="table-scroll">
            <table aria-label="학생 마일스톤 체크리스트">
              <thead>
                <tr>
                  <th>마일스톤</th>
                  <th>게이트</th>
                  <th>마감</th>
                  <th>상태</th>
                  <th>가이드</th>
                </tr>
              </thead>
              <tbody>
                {primaryMilestones.map((milestone) => {
                  const submission = submissionForMilestone(primarySubmissions, milestone.id);
                  return (
                    <tr key={milestone.id}>
                      <td data-label="마일스톤">{milestone.name}</td>
                      <td data-label="게이트">{gateLabel(milestone.gate)}</td>
                      <td data-label="마감">{milestone.dueDate}</td>
                      <td data-label="상태">
                        {submission === undefined
                          ? "대기"
                          : milestoneStatusLabel(submission.status)}
                      </td>
                      <td data-label="가이드">{milestone.guide}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
            참여할 프로그램 둘러보기
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

function gateLabel(gate: ProgramMilestone["gate"]): string {
  switch (gate) {
    case "intake":
      return "8/15 Intake";
    case "full-loop":
      return "8/27 Full-loop";
  }
}

function dDayText(deadline: string): string {
  const parsed = Date.parse(`${deadline}T00:00:00+09:00`);
  if (Number.isNaN(parsed)) return "상시";
  const demoToday = Date.parse("2026-07-15T00:00:00+09:00");
  const diffDays = Math.ceil((parsed - demoToday) / 86_400_000);
  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-day";
  return `D+${Math.abs(diffDays)}`;
}

function ProgressStep({
  label,
  value,
  isActive,
}: {
  readonly label: string;
  readonly value: string;
  readonly isActive: boolean;
}) {
  return (
    <article className={isActive ? "is-active" : ""}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function RepositoryAddress({ value }: { readonly value: string }) {
  const boundary = value.lastIndexOf("/") + 1;
  return (
    <>
      <span className="repository-prefix">{value.slice(0, boundary)}</span>
      <span className="repository-slug">{value.slice(boundary)}</span>
    </>
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
