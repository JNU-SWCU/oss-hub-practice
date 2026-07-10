import { BarChart3, FolderGit2, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import type { Call, MetricId, Team } from "../../domain";
import { Leaderboard } from "../Leaderboard";
import { CompetitionCard, type Navigate, PageHeader, PublishedAssets } from "./shared";

type PublicDashboardProps = {
  readonly calls: readonly Call[];
  readonly teams: readonly Team[];
  readonly metric: MetricId;
  readonly onMetricChange: (metric: MetricId) => void;
  readonly onNavigate: Navigate;
};

export function PublicDashboard({
  calls,
  teams,
  metric,
  onMetricChange,
  onNavigate,
}: PublicDashboardProps) {
  const visibleCalls = calls.filter((call) => call.visibility === "public").slice(0, 8);
  return (
    <main className="page-shell">
      <PageHeader
        kicker="공개 현황"
        title="전남대학교 OSS 대회와 저장소 자산"
        description="외부 방문자는 공개 대회, 공개 전환된 저장소, 활동 리더보드만 확인합니다. 연락처, 학번, 동의서, 내부 검토 메모는 표시하지 않습니다."
      />
      <section className="portal-summary" aria-label="공개 현황 요약">
        <SummaryItem
          icon={<Trophy size={18} />}
          label="공개 대회"
          value={`${visibleCalls.length}건`}
        />
        <SummaryItem
          icon={<FolderGit2 size={18} />}
          label="공개 저장소"
          value={`${teams.reduce((sum, team) => sum + team.repos, 0)}개`}
        />
        <SummaryItem icon={<BarChart3 size={18} />} label="공개 팀" value={`${teams.length}팀`} />
      </section>
      <section className="competition-section" aria-label="공개 대회">
        <div className="section-title">
          <Trophy size={18} />
          <h2>공개 대회</h2>
          <span>{visibleCalls.length}건</span>
        </div>
        <div className="competition-grid challenge-grid compact-grid">
          {visibleCalls.map((call) => (
            <CompetitionCard call={call} key={call.id} persona="public" onNavigate={onNavigate} />
          ))}
        </div>
      </section>
      <section className="table-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">저장소 갤러리</p>
            <h2>공개 repo 자산</h2>
            <p>대회를 클릭하면 해당 대회에 연결된 팀과 repo 흐름을 확인할 수 있습니다.</p>
          </div>
        </div>
        <PublishedAssets teams={teams} />
      </section>
      <Leaderboard teams={teams} metric={metric} onMetricChange={onMetricChange} publicOnly />
    </main>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
}) {
  return (
    <article>
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
