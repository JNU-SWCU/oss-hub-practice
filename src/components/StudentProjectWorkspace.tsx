import { ExternalLink, GitBranch, Plus, UsersRound } from "lucide-react";
import type { DemoState, Team } from "../domain";
import { RepositoryAddress, statusText } from "./StudentDashboard.helpers";

type StudentProjectWorkspaceProps = {
  readonly state: DemoState;
  readonly teams: readonly Team[];
  readonly primaryTeam: Team | undefined;
  readonly currentStudentGithub: string;
  readonly onSelectTeam: (teamId: string) => void;
  readonly onNavigate: (path: string) => void;
};

export function StudentProjectWorkspace({
  state,
  teams,
  primaryTeam,
  currentStudentGithub,
  onSelectTeam,
  onNavigate,
}: StudentProjectWorkspaceProps) {
  const currentStudent = state.students.find((student) => student.github === currentStudentGithub);
  const teamRepositories =
    primaryTeam === undefined
      ? []
      : state.repositories.filter((repository) => repository.teamId === primaryTeam.id);

  if (primaryTeam === undefined) {
    return (
      <section
        id="student-project-workspace"
        className="table-panel student-project-panel"
        aria-labelledby="student-project-title"
      >
        <div className="panel-heading">
          <div>
            <p className="section-kicker">
              <UsersRound size={15} />내 팀/프로젝트
            </p>
            <h2 id="student-project-title">아직 관리할 활동이 없습니다</h2>
            <p>
              새 프로그램을 신청하거나 기존 GitHub 저장소가 있는 활동을 연결하면 이곳에 활동 목록이
              생깁니다.
            </p>
          </div>
          <button
            className="primary-action"
            type="button"
            onClick={() => onNavigate("/competitions")}
          >
            접수 중인 프로그램 보기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="student-project-workspace"
      className="table-panel student-project-panel"
      aria-labelledby="student-project-title"
    >
      <div className="panel-heading">
        <div>
          <p className="section-kicker">
            <UsersRound size={15} />내 팀/프로젝트
          </p>
          <h2 id="student-project-title">내 활동 목록에서 팀과 저장소를 관리합니다</h2>
          <p>
            여러 프로그램에 참여 중이면 먼저 활동을 고르고, 선택한 활동의 팀원과 저장소 상태를
            아래에서 확인합니다.
          </p>
        </div>
        <button
          className="ghost-action"
          type="button"
          onClick={() => onNavigate("/competitions?status=open")}
        >
          새 프로그램 보기
        </button>
      </div>

      <div className="student-activity-list" aria-label="내 활동 목록">
        {teams.map((team) => {
          const repositories = state.repositories.filter(
            (repository) => repository.teamId === team.id,
          );
          const isSelected = team.id === primaryTeam.id;
          return (
            <button
              className={isSelected ? "student-activity-card is-selected" : "student-activity-card"}
              type="button"
              key={team.id}
              aria-pressed={isSelected}
              onClick={() => onSelectTeam(team.id)}
            >
              <span>{team.contest}</span>
              <strong>{team.name}</strong>
              <small>{statusText(team.status)}</small>
              <dl>
                <div>
                  <dt>팀원</dt>
                  <dd>{team.members.length}명</dd>
                </div>
                <div>
                  <dt>저장소</dt>
                  <dd>{repositories.length}개</dd>
                </div>
              </dl>
            </button>
          );
        })}
      </div>

      <div className="project-workspace-grid">
        <article className="project-workspace-card">
          <span>선택한 활동</span>
          <h3>{primaryTeam.name}</h3>
          <p>{primaryTeam.contest}</p>
          <dl className="workspace-meta">
            <div>
              <dt>상태</dt>
              <dd>{statusText(primaryTeam.status)}</dd>
            </div>
            <div>
              <dt>내 계정</dt>
              <dd>{currentStudent?.github ?? currentStudentGithub}</dd>
            </div>
          </dl>
        </article>

        <article className="project-workspace-card team-members-card">
          <span>팀원</span>
          <h3>초대된 GitHub ID</h3>
          <div className="invite-list" aria-label={`${primaryTeam.name} 팀원 GitHub ID`}>
            {primaryTeam.members.map((member) => (
              <span className="invite-chip" key={member}>
                <UsersRound size={14} />
                {member}
              </span>
            ))}
            <span className="invite-chip invite-chip-empty">
              <Plus size={14} />+ 팀원 추가
            </span>
          </div>
        </article>

        <article className="project-workspace-card repository-card">
          <span>저장소</span>
          <h3>연결된 GitHub 저장소</h3>
          {teamRepositories.length > 0 ? (
            <div className="repository-stack">
              {teamRepositories.map((repository) => (
                <div className="repository-row" key={repository.id}>
                  <GitBranch size={15} />
                  <p>
                    <RepositoryAddress value={repository.url} />
                  </p>
                  <small>
                    {repository.visibility === "public" ? "공개" : "비공개"} · {repository.language}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p>기존 저장소 URL을 제출하면 교직원 검토 후 이 위치에 연결 상태가 표시됩니다.</p>
          )}
        </article>

        <article className="project-workspace-card workspace-help-card">
          <span>기존 활동</span>
          <h3>프로그램 신청 없이도 이어서 관리합니다</h3>
          <p>
            이미 신청한 팀이나 기존 저장소가 있으면 이 대시보드의 활동 목록에서 바로 선택해
            확인합니다.
          </p>
          <button
            className="text-link"
            type="button"
            onClick={() => onNavigate("/public/dashboard")}
          >
            <ExternalLink size={15} />
            공개 전환된 활동 보기
          </button>
        </article>
      </div>
    </section>
  );
}
