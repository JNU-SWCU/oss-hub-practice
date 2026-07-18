import { useEffect, useMemo, useState } from "react";
import type { DemoState, RoleId } from "../../domain";
import { DataStatePanel } from "../CompliancePrimitives";
import {
  CompetitionSectionTitle,
  CompetitionSummary,
  CompetitionToolbar,
  type SortKey,
  type StatusFilter,
  StudentEntryOptions,
  filterCalls,
  parseDataState,
  parseSortKey,
  parseStatusFilter,
  sortCalls,
} from "./CompetitionList.helpers";
import { CompetitionCard, type Navigate, PageHeader } from "./shared";

type CompetitionListProps = {
  readonly state: DemoState;
  readonly persona: RoleId;
  readonly onNavigate: Navigate;
};

export function CompetitionList({ state, persona, onNavigate }: CompetitionListProps) {
  const params = new URLSearchParams(window.location.search);
  const status = parseStatusFilter(params.get("status"));
  const sort = parseSortKey(params.get("sort"));
  const query = params.get("q") ?? "";
  const dataState = parseDataState(params.get("state"));
  const [searchText, setSearchText] = useState(query);
  const visibleCalls =
    persona === "public" ? state.calls.filter((call) => call.visibility === "public") : state.calls;
  const publishedTeamIds = new Set(
    state.teams.filter((team) => team.status === "published").map((team) => team.id),
  );
  const visibleActivityCount =
    persona === "public"
      ? state.activity.filter((activity) => publishedTeamIds.has(activity.teamId)).length
      : state.activity.length;

  useEffect(() => setSearchText(query), [query]);

  const filteredCalls = useMemo(
    () => sortCalls(filterCalls(visibleCalls, status, query), sort, persona),
    [persona, query, sort, status, visibleCalls],
  );
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
    <main className={persona === "student" ? "page-shell student-flow-page" : "page-shell"}>
      <PageHeader
        kicker="대회 센터"
        title="프로그램 찾기"
        description="새로 신청할 프로그램을 둘러보는 화면입니다. 이미 참여 중인 팀과 저장소는 내 대시보드에서 관리합니다."
      />
      {persona === "student" ? (
        <StudentEntryOptions onNavigate={onNavigate} onQueryChange={updateQuery} />
      ) : null}
      {dataState === "loading" ? (
        <DataStatePanel
          state="loading"
          title="프로그램 목록을 불러오는 중입니다"
          description="검색, 필터, 정렬 기준에 맞는 프로그램을 준비하고 있습니다."
        />
      ) : null}
      {dataState === "error" ? (
        <DataStatePanel
          state="error"
          title="프로그램 목록을 불러오지 못했습니다"
          description="네트워크 또는 GitHub 연동 상태를 확인한 뒤 다시 시도하세요."
          actionLabel="다시 시도"
          onAction={() => updateQuery({})}
        />
      ) : null}
      {dataState === "success" ? (
        <DataStatePanel
          state="success"
          title="프로그램 목록을 불러왔습니다"
          description="검색, 필터, 정렬 기준을 바꾸면 목록이 즉시 갱신됩니다."
        />
      ) : null}
      <CompetitionSummary
        visibleCalls={visibleCalls}
        assetCount={assetCount}
        visibleActivityCount={visibleActivityCount}
      />
      <CompetitionToolbar
        status={status}
        sort={sort}
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onQueryChange={updateQuery}
      />
      <section className="competition-section" aria-label="대회 카드 목록">
        <CompetitionSectionTitle status={status} count={filteredCalls.length} />
        {filteredCalls.length > 0 && dataState !== "loading" && dataState !== "error" ? (
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
        ) : dataState === "loading" || dataState === "error" ? (
          <div className="state-skeleton-grid" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <DataStatePanel
            state="empty"
            title="조건에 맞는 대회가 없습니다"
            description="검색어를 줄이거나 전체 필터로 돌아가세요."
            actionLabel="전체 보기"
            onAction={() => updateQuery({ status: "all", q: "" })}
          />
        )}
      </section>
    </main>
  );
}
