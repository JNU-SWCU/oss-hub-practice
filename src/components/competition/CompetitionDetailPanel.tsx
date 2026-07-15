import { ClipboardList, FileText, Github, ListChecks, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import {
  type Call,
  type MetricId,
  type ProgramMilestone,
  type Team,
  type TeamMilestoneSubmission,
  milestoneStatusLabel,
  submissionForMilestone,
} from "../../domain";
import { Leaderboard } from "../Leaderboard";
import { PublishedAssets } from "./shared";

export type DetailTab = "overview" | "apply" | "milestones" | "repos" | "leaderboard" | "materials";

export const detailTabs: readonly { readonly id: DetailTab; readonly label: string }[] = [
  { id: "overview", label: "개요" },
  { id: "apply", label: "신청/팀" },
  { id: "milestones", label: "마일스톤" },
  { id: "repos", label: "저장소" },
  { id: "leaderboard", label: "리더보드" },
  { id: "materials", label: "자료" },
];

export const publicDetailTabs: readonly { readonly id: DetailTab; readonly label: string }[] = [
  { id: "overview", label: "개요" },
  { id: "repos", label: "저장소" },
  { id: "leaderboard", label: "리더보드" },
  { id: "materials", label: "자료" },
];

type CompetitionDetailPanelProps = {
  readonly activeTab: DetailTab;
  readonly competition: Call;
  readonly competitionTeams: readonly Team[];
  readonly milestones: readonly ProgramMilestone[];
  readonly submissions: readonly TeamMilestoneSubmission[];
  readonly publicTeams: readonly Team[];
  readonly metric: MetricId;
  readonly onMetricChange: (metric: MetricId) => void;
  readonly audience: "public" | "internal";
};

export function CompetitionDetailPanel({
  activeTab,
  competition,
  competitionTeams,
  milestones,
  submissions,
  publicTeams,
  metric,
  onMetricChange,
  audience,
}: CompetitionDetailPanelProps) {
  const visibleTeams = audience === "public" ? publicTeams : competitionTeams;
  if (activeTab === "leaderboard") {
    return (
      <Leaderboard
        teams={visibleTeams}
        metric={metric}
        onMetricChange={onMetricChange}
        publicOnly={audience === "public"}
      />
    );
  }
  if (activeTab === "repos") {
    return (
      <section className="table-panel">
        <PanelTitle
          icon={<Github size={18} />}
          title="GitHub 저장소 자산"
          description="팀별 repo 배정 상태와 공개 전환된 산출물을 확인합니다."
        />
        <PublishedAssets teams={publicTeams} />
        <TeamTable teams={visibleTeams} audience={audience} />
      </section>
    );
  }
  if (activeTab === "milestones") {
    return (
      <section className="table-panel">
        <PanelTitle
          icon={<ListChecks size={18} />}
          title="마일스톤 제출 흐름"
          description="학생은 마감별 제출 상태를 확인하고, 교직원은 같은 데이터를 검토 매트릭스로 봅니다."
        />
        <MilestoneTracker milestones={milestones} teams={visibleTeams} submissions={submissions} />
      </section>
    );
  }
  if (activeTab === "apply") {
    return (
      <section className="table-panel">
        <PanelTitle
          icon={<ClipboardList size={18} />}
          title="신청 팀 현황"
          description="신청서는 팀 이름과 팀원 GitHub ID를 기준으로 생성되고, 승인 후 repo 배정 상태로 이동합니다."
        />
        <TeamTable teams={visibleTeams} audience={audience} />
      </section>
    );
  }
  if (activeTab === "materials") {
    return (
      <section className="materials-panel" aria-label="대회 자료">
        <PanelTitle
          icon={<FileText size={18} />}
          title="자료와 규칙"
          description="데모에서는 실제 파일 다운로드 없이 필요한 자료 항목만 표시합니다."
        />
        <div className="materials-grid">
          {competition.materials.map((material) => (
            <article key={material}>
              <FileText size={18} />
              <strong>{material}</strong>
              <span>{audience === "public" ? "공개 안내 자료" : competition.reviewBasis}</span>
            </article>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section className="table-panel">
      {audience === "public" ? (
        <>
          <PanelTitle
            icon={<Trophy size={18} />}
            title="공개 자산 개요"
            description="외부인은 공개 전환된 저장소와 활동 리더보드만 확인합니다."
          />
          <PublishedAssets teams={publicTeams} />
        </>
      ) : (
        <>
          <PanelTitle
            icon={<Trophy size={18} />}
            title="운영 개요"
            description="대회별 접수, 산출물, 자산화 공개 단계를 한 화면에서 확인합니다."
          />
          <div className="lifecycle-rail" aria-label="운영 단계">
            {["접수", "검토", "저장소 배정", "공개 자산화"].map((step, index) => (
              <article key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function MilestoneTracker({
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

function PanelTitle({
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

function TeamTable({
  teams,
  audience,
}: {
  readonly teams: readonly Team[];
  readonly audience: "public" | "internal";
}) {
  if (teams.length === 0) return <p className="empty-state">아직 연결된 팀이 없습니다.</p>;
  if (audience === "public") {
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

function teamStatusLabel(status: Team["status"]): string {
  const labels: Record<Team["status"], string> = {
    submitted: "접수 완료",
    correction: "보완 요청",
    provisioned: "저장소 배정 완료",
    published: "공개 자산",
  };
  return labels[status];
}
