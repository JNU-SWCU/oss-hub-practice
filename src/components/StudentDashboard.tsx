import { Activity, CalendarDays, Github, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { DemoState } from "../domain";
import { ProgressStep, RepositoryAddress, dDayText, statusText } from "./StudentDashboard.helpers";
import { StudentMilestoneChecklist } from "./StudentMilestoneChecklist";
import { StudentProjectWorkspace } from "./StudentProjectWorkspace";

type StudentDashboardProps = {
  readonly state: DemoState;
  readonly onNavigate: (path: string) => void;
};

export function StudentDashboard({ state, onNavigate }: StudentDashboardProps) {
  const currentStudentGithub = "jnu-oss-1";
  const ownedTeams = state.teams.filter((team) => team.members.includes(currentStudentGithub));
  const [selectedTeamId, setSelectedTeamId] = useState(ownedTeams[0]?.id);
  const primaryTeam = ownedTeams.find((team) => team.id === selectedTeamId) ?? ownedTeams[0];
  const isPublished = primaryTeam?.status === "published";
  const repositoryCount = state.repositories.filter((repository) =>
    ownedTeams.some((team) => team.id === repository.teamId),
  ).length;
  const correctionCount = ownedTeams.filter((team) => team.status === "correction").length;
  const publishedCount = ownedTeams.filter((team) => team.status === "published").length;
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
      <header className="page-header">
        <p className="section-kicker">학생 대시보드</p>
        <h1>내 활동과 저장소 현황</h1>
        <p>
          새 프로그램을 다시 고르지 않아도 내가 속한 팀, GitHub 저장소, 제출 마감 상태를 이곳에서
          이어서 관리합니다.
        </p>
        <div className="dashboard-jump-actions">
          <a className="ghost-action" href="#student-project-workspace">
            내 활동 목록 바로가기
          </a>
        </div>
      </header>
      <section className="student-status-grid">
        <article className="status-card success">
          <Github size={20} />
          <span>내 활동</span>
          <strong>{ownedTeams.length}개</strong>
          <p>프로그램별 팀과 제출 상태를 활동 목록에서 바로 선택합니다.</p>
        </article>
        <article className="status-card">
          <Activity size={20} />
          <span>연결 저장소</span>
          <strong>{repositoryCount}개</strong>
          <p className="repository-address">
            <RepositoryAddress value={primaryTeam?.repo ?? "github.com/JNU-SWCU/new-team"} />
          </p>
        </article>
        <article className={correctionCount > 0 ? "status-card warning" : "status-card"}>
          <ShieldCheck size={20} />
          <span>보완 요청</span>
          <strong>{correctionCount > 0 ? `${correctionCount}건` : "없음"}</strong>
          <p>교직원 보완 요청이 있으면 해당 활동 상세에서 먼저 확인합니다.</p>
        </article>
        <article className={isPublished ? "status-card success" : "status-card"}>
          <ShieldCheck size={20} />
          <span>공개 전환</span>
          <strong>{publishedCount}팀</strong>
          <p>공개 전환된 팀만 공개 아카이브와 리더보드에 표시됩니다.</p>
        </article>
      </section>
      <section className="progress-strip" aria-label="신청 처리 상태">
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
      <StudentProjectWorkspace
        state={state}
        teams={ownedTeams}
        primaryTeam={primaryTeam}
        currentStudentGithub={currentStudentGithub}
        onSelectTeam={setSelectedTeamId}
        onNavigate={onNavigate}
      />
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
      <StudentMilestoneChecklist
        primaryTeam={primaryTeam}
        milestones={primaryMilestones}
        submissions={primarySubmissions}
      />
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
            새 프로그램 둘러보기
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
              {ownedTeams.map((team) => (
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
