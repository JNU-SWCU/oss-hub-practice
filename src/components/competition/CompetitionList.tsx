import { CalendarDays, ListFilter, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type Call,
  type CompetitionStatus,
  type DemoState,
  type RoleId,
  competitionStatuses,
} from "../../domain";
import { CompetitionCard, type Navigate, PageHeader, SectionTitle, statusLabel } from "./shared";

type StatusFilter = CompetitionStatus | "all";
type SortKey = "deadline" | "teams" | "status";

type CompetitionListProps = {
  readonly state: DemoState;
  readonly persona: RoleId;
  readonly onNavigate: Navigate;
};

const filterOptions: readonly StatusFilter[] = ["all", ...competitionStatuses];

export function CompetitionList({ state, persona, onNavigate }: CompetitionListProps) {
  const params = new URLSearchParams(window.location.search);
  const status = parseStatusFilter(params.get("status"));
  const sort = parseSortKey(params.get("sort"));
  const query = params.get("q") ?? "";
  const [searchText, setSearchText] = useState(query);

  useEffect(() => setSearchText(query), [query]);

  const filteredCalls = useMemo(
    () => sortCalls(filterCalls(state.calls, status, query), sort),
    [query, sort, state.calls, status],
  );
  const openCount = state.calls.filter((call) => call.status === "open").length;
  const assetCount = state.teams.filter((team) => team.status === "published").length;

  function updateQuery(
    next: Partial<{ readonly status: StatusFilter; readonly q: string; readonly sort: SortKey }>,
  ): void {
    const nextStatus = next.status ?? status;
    const nextQuery = next.q ?? query;
    const nextSort = next.sort ?? sort;
    const nextParams = new URLSearchParams();
    if (nextStatus !== "all") nextParams.set("status", nextStatus);
    if (nextQuery.trim().length > 0) nextParams.set("q", nextQuery.trim());
    if (nextSort !== "deadline") nextParams.set("sort", nextSort);
    const search = nextParams.toString();
    onNavigate(search.length > 0 ? `/competitions?${search}` : "/competitions");
  }

  return (
    <main className="page-shell">
      <PageHeader
        kicker="대회 센터"
        title="대회 접수와 GitHub 저장소 자산화"
        description="공지성 안내는 사업단 홈페이지가 맡고, 이 화면은 대회 신청, 팀 GitHub ID 수합, 저장소 배정, 공개 자산 확인 흐름을 담당합니다."
      />
      <section className="portal-summary" aria-label="대회 현황 요약">
        <SummaryItem label="전체 대회" value={`${state.calls.length}건`} />
        <SummaryItem label="접수 중" value={`${openCount}건`} />
        <SummaryItem label="공개 자산" value={`${assetCount}팀`} />
        <SummaryItem label="활동 이벤트" value={`${state.activity.length}건`} />
      </section>
      <section className="portal-toolbar" aria-label="대회 검색과 필터">
        <div className="filter-pills">
          {filterOptions.map((option) => (
            <button
              className={status === option ? "segmented is-active" : "segmented"}
              type="button"
              key={option}
              aria-pressed={status === option}
              onClick={() => updateQuery({ status: option })}
            >
              {option === "all" ? "전체" : statusLabel(option)}
            </button>
          ))}
        </div>
        <form
          className="search-row"
          onSubmit={(event) => {
            event.preventDefault();
            updateQuery({ q: searchText });
          }}
        >
          <label>
            <Search size={16} />
            <span className="visually-hidden">대회 검색</span>
            <input
              value={searchText}
              placeholder="대회명, 태그, 산출물 검색"
              onChange={(event) => setSearchText(event.target.value)}
            />
          </label>
          <label className="select-field">
            <SlidersHorizontal size={16} />
            <span>정렬</span>
            <select
              value={sort}
              onChange={(event) => updateQuery({ sort: parseSortKey(event.target.value) })}
            >
              <option value="deadline">마감순</option>
              <option value="teams">신청 많은순</option>
              <option value="status">상태순</option>
            </select>
          </label>
          <button className="primary-action compact" type="submit">
            적용
          </button>
        </form>
      </section>
      <section className="competition-section" aria-label="대회 카드 목록">
        <SectionTitle
          icon={status === "all" ? <CalendarDays size={18} /> : <ListFilter size={18} />}
          title={status === "all" ? "전체 대회" : `${statusLabel(status)} 대회`}
          count={`${filteredCalls.length}건`}
        />
        {filteredCalls.length > 0 ? (
          <div className="competition-grid challenge-grid">
            {filteredCalls.map((call) => (
              <CompetitionCard
                call={call}
                key={call.id}
                persona={persona}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">조건에 맞는 대회가 없습니다.</p>
        )}
      </section>
    </main>
  );
}

function SummaryItem({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function filterCalls(calls: readonly Call[], status: StatusFilter, query: string): readonly Call[] {
  const cleanQuery = query.trim().toLowerCase();
  return calls.filter((call) => {
    const statusMatches = status === "all" || call.status === status;
    const queryMatches =
      cleanQuery.length === 0 ||
      [call.title, call.summary, call.outputType, ...call.category].some((value) =>
        value.toLowerCase().includes(cleanQuery),
      );
    return statusMatches && queryMatches;
  });
}

function sortCalls(calls: readonly Call[], sort: SortKey): readonly Call[] {
  return [...calls].sort((left, right) => {
    if (sort === "teams") return right.teamCount - left.teamCount;
    if (sort === "status") return left.status.localeCompare(right.status, "ko-KR");
    return left.deadline.localeCompare(right.deadline, "ko-KR");
  });
}

function parseStatusFilter(value: string | null): StatusFilter {
  return competitionStatuses.find((status) => status === value) ?? "all";
}

function parseSortKey(value: string | null): SortKey {
  return value === "teams" || value === "status" ? value : "deadline";
}
