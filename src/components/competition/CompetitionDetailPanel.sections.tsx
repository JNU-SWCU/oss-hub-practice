import type { ReactNode } from "react";
import {
  type ProgramMilestone,
  type Team,
  type TeamMilestoneSubmission,
  milestoneStatusLabel,
  submissionForMilestone,
} from "../../domain";

export function MilestoneTracker({
  milestones,
  teams,
  submissions,
}: {
  readonly milestones: readonly ProgramMilestone[];
  readonly teams: readonly Team[];
  readonly submissions: readonly TeamMilestoneSubmission[];
}) {
  if (milestones.length === 0) return <p className="empty-state">아직 마일스톤이 없습니다.</p>;
  return (
    <div className="milestone-panel">
      <ol className="milestone-list" aria-label="대회 마일스톤">
        {milestones.map((milestone) => (
          <li key={milestone.id}>
            <span>{milestone.gate === "intake" ? "Intake" : "Full-loop"}</span>
            <strong>{milestone.name}</strong>
            <small>
              {milestone.dueDate} · {deliverableLabel(milestone.deliverableType)}
            </small>
            <p>{milestone.guide}</p>
          </li>
        ))}
      </ol>
      <div className="table-scroll">
        <table aria-label="대회 마일스톤 제출 현황">
          <thead>
            <tr>
              <th>팀</th>
              {milestones.map((milestone) => (
                <th key={milestone.id}>{milestone.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => {
              const teamSubmissions = submissions.filter(
                (submission) => submission.teamId === team.id,
              );
              return (
                <tr key={team.id}>
                  <td data-label="팀">{team.name}</td>
                  {milestones.map((milestone) => {
                    const submission = submissionForMilestone(teamSubmissions, milestone.id);
                    return (
                      <td data-label={milestone.name} key={milestone.id}>
                        {submission === undefined
                          ? "대기"
                          : milestoneStatusLabel(submission.status)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PanelTitle({
  icon,
  title,
  description,
}: {
  readonly icon: ReactNode;
  readonly title: string;
  readonly description: string;
}) {
  return (
    <div className="panel-heading">
      <div>
        <p className="section-kicker">{icon} 대회 상세</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function TeamTable({
  teams,
  audience,
}: {
  readonly teams: readonly Team[];
  readonly audience: "public" | "internal";
}) {
  if (teams.length === 0) return <p className="empty-state">아직 연결된 팀이 없습니다.</p>;
  if (audience === "public") return <PublicTeamTable teams={teams} />;
  return <InternalTeamTable teams={teams} />;
}

function PublicTeamTable({ teams }: { readonly teams: readonly Team[] }) {
  return (
    <div className="table-scroll">
      <table aria-label="공개 대회 저장소">
        <thead>
          <tr>
            <th>팀</th>
            <th>저장소</th>
            <th>커밋</th>
            <th>PR</th>
            <th>스타</th>
            <th>최근 활동</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td data-label="팀">{team.name}</td>
              <td data-label="저장소">{team.repo}</td>
              <td data-label="커밋">{team.commits}</td>
              <td data-label="PR">{team.prs}</td>
              <td data-label="스타">{team.stars}</td>
              <td data-label="최근 활동">{team.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InternalTeamTable({ teams }: { readonly teams: readonly Team[] }) {
  return (
    <div className="table-scroll">
      <table aria-label="대회 팀과 저장소">
        <thead>
          <tr>
            <th>팀</th>
            <th>GitHub ID</th>
            <th>상태</th>
            <th>저장소</th>
            <th>최근 활동</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td data-label="팀">{team.name}</td>
              <td data-label="GitHub ID">{team.members.join(", ")}</td>
              <td data-label="상태">{teamStatusLabel(team.status)}</td>
              <td data-label="저장소">{team.repo}</td>
              <td data-label="최근 활동">{team.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function deliverableLabel(type: ProgramMilestone["deliverableType"]): string {
  switch (type) {
    case "file":
      return "파일";
    case "text":
      return "텍스트";
    case "repo-tag":
      return "Repo 태그";
    case "release":
      return "Release";
  }
}

function teamStatusLabel(status: Team["status"]): string {
  const labels: Record<Team["status"], string> = {
    submitted: "접수 완료",
    correction: "보완 요청",
    provisioned: "저장소 배정 완료",
    published: "공개 자산",
  };
  return labels[status];
}
