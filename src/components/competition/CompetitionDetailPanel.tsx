import { ClipboardList, FileText, Github, ListChecks, Trophy } from "lucide-react";
import type { Call, MetricId, ProgramMilestone, Team, TeamMilestoneSubmission } from "../../domain";
import { Leaderboard } from "../Leaderboard";
import { MilestoneTracker, PanelTitle, TeamTable } from "./CompetitionDetailPanel.sections";
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
