import { BarChart3, FolderGit2, Search, SlidersHorizontal, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { Call, CompetitionStatus, MetricId, Team } from "../../domain";
import { competitionStatuses } from "../../domain";
import { DataStatePanel } from "../CompliancePrimitives";
import { Leaderboard } from "../Leaderboard";
import { CompetitionCard, type Navigate, PageHeader, PublishedAssets } from "./shared";

type PublicDashboardProps = {
  readonly calls: readonly Call[];
  readonly teams: readonly Team[];
  readonly metric: MetricId;
  readonly onMetricChange: (metric: MetricId) => void;
  readonly onNavigate: Navigate;
};

type PublicStatusFilter = CompetitionStatus | "all";
type PublicSortKey = "deadline" | "teams" | "status";

export function PublicDashboard({
  calls,
  teams,
  metric,
  onMetricChange,
  onNavigate,
}: PublicDashboardProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PublicStatusFilter>("all");
  const [sort, setSort] = useState<PublicSortKey>("deadline");
  const visibleCalls = useMemo(
    () => sortPublicCalls(filterPublicCalls(calls, statusFilter, query), sort, teams).slice(0, 8),
    [calls, query, sort, statusFilter, teams],
  );
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
      <DataStatePanel
        state="success"
        title="공개 데이터를 불러왔습니다"
        description="공개 전환된 대회와 저장소만 검색, 필터, 정렬합니다."
      />
      <section className="portal-toolbar" aria-label="공개 아카이브 검색과 필터">
        <div className="filter-pills">
          <button
            className={statusFilter === "all" ? "segmented is-active" : "segmented"}
            type="button"
            aria-pressed={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            전체
          </button>
          {competitionStatuses.map((status) => (
            <button
              className={statusFilter === status ? "segmented is-active" : "segmented"}
              type="button"
              aria-pressed={statusFilter === status}
              key={status}
              onClick={() => setStatusFilter(status)}
            >
              {publicStatusLabel(status)}
            </button>
          ))}
        </div>
        <div className="search-row">
          <label>
            <Search size={16} />
            <span className="visually-hidden">공개 대회 검색</span>
            <input
              value={query}
              placeholder="공개 대회명, 태그, 저장소 검색"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="select-field">
            <SlidersHorizontal size={16} />
            <span>정렬</span>
            <select value={sort} onChange={(event) => setSort(parsePublicSort(event.target.value))}>
              <option value="deadline">마감순</option>
              <option value="teams">신청 많은순</option>
              <option value="status">상태순</option>
            </select>
          </label>
        </div>
      </section>
      <section className="competition-section" aria-label="공개 대회">
        <div className="section-title">
          <Trophy size={18} />
          <h2>공개 대회</h2>
          <span>{visibleCalls.length}건</span>
        </div>
        {visibleCalls.length > 0 ? (
          <div className="competition-grid challenge-grid compact-grid">
            {visibleCalls.map((call) => (
              <CompetitionCard call={call} key={call.id} persona="public" onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <DataStatePanel
            state="empty"
            title="조건에 맞는 공개 대회가 없습니다"
            description="검색어를 줄이거나 전체 필터로 돌아가세요."
            actionLabel="전체 보기"
            onAction={() => {
              setQuery("");
              setStatusFilter("all");
            }}
          />
        )}
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

function filterPublicCalls(
  calls: readonly Call[],
  status: PublicStatusFilter,
  query: string,
): readonly Call[] {
  const cleanQuery = query.trim().toLowerCase();
  return calls.filter((call) => {
    const visibilityMatches = call.visibility === "public";
    const statusMatches = status === "all" || call.status === status;
    const queryMatches =
      cleanQuery.length === 0 ||
      [call.title, call.summary, call.outputType, ...call.category].some((value) =>
        value.toLowerCase().includes(cleanQuery),
      );
    return visibilityMatches && statusMatches && queryMatches;
  });
}

function sortPublicCalls(
  calls: readonly Call[],
  sort: PublicSortKey,
  teams: readonly Team[],
): readonly Call[] {
  return [...calls].sort((left, right) => {
    const prominence = publicProminence(right, teams) - publicProminence(left, teams);
    if (prominence !== 0) return prominence;
    switch (sort) {
      case "deadline":
        return left.deadline.localeCompare(right.deadline, "ko-KR");
      case "teams":
        return right.teamCount - left.teamCount;
      case "status":
        return left.status.localeCompare(right.status, "ko-KR");
      default:
        return assertNever(sort);
    }
  });
}

function publicProminence(call: Call, teams: readonly Team[]): number {
  const publishedTeamCount = teams.filter(
    (team) => team.competitionId === call.id && team.status === "published",
  ).length;
  return publishedTeamCount * 10 + statusPriority(call.status);
}

function statusPriority(status: CompetitionStatus): number {
  const priorities: Record<CompetitionStatus, number> = {
    open: 5,
    active: 4,
    always: 3,
    reviewing: 2,
    upcoming: 1,
    closed: 0,
  };
  return priorities[status];
}

function parsePublicSort(value: string): PublicSortKey {
  return value === "teams" || value === "status" ? value : "deadline";
}

function publicStatusLabel(status: CompetitionStatus): string {
  const labels: Record<CompetitionStatus, string> = {
    open: "접수중",
    upcoming: "예정",
    active: "진행중",
    reviewing: "검토중",
    closed: "종료",
    always: "상시",
  };
  return labels[status];
}

function assertNever(value: never): never {
  throw new Error(`Unexpected public sort: ${value}`);
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
