import { CalendarDays, ListFilter, Search, SlidersHorizontal } from "lucide-react";
import {
  type Call,
  type CompetitionStatus,
  type RoleId,
  competitionStatuses,
} from "../../domain";
import type { DataStateKind } from "../CompliancePrimitives";
import { type Navigate, SectionTitle, statusLabel } from "./shared";

export type StatusFilter = CompetitionStatus | "all";
export type SortKey = "deadline" | "teams" | "status";

export const filterOptions: readonly StatusFilter[] = ["all", ...competitionStatuses];

type StudentEntryOptionsProps = {
  readonly onNavigate: Navigate;
  readonly onQueryChange: (next: Partial<{ readonly status: StatusFilter; readonly q: string }>) => void;
};

export function StudentEntryOptions({ onNavigate, onQueryChange }: StudentEntryOptionsProps) {
  return (
    <section className="student-entry-options" aria-label="학생 프로그램 진입 안내">
      <article>
        <span>새로 신청</span>
        <h2>접수 중인 프로그램 보기</h2>
        <p>접수 중인 프로그램을 보고 신청할 항목이 있을 때 선택합니다.</p>
        <button type="button" onClick={() => onQueryChange({ status: "open" })}>
          접수 중 프로그램 보기
        </button>
      </article>
      <article>
        <span>내 활동</span>
        <h2>내 활동 목록으로 돌아가기</h2>
        <p>이미 참여 중인 팀, GitHub 저장소, 제출 상태는 대시보드에서 이어서 확인합니다.</p>
        <button type="button" onClick={() => onNavigate("/student/dashboard")}>
          내 대시보드 보기
        </button>
      </article>
      <aside className="student-entry-support">
        <div>
          <span>선택 사항</span>
          <h2>목록에 없는 활동은 필요할 때만 살펴봅니다</h2>
          <p>외부 해커톤, 동아리, 수업 프로젝트는 프로그램 신청과 별개로 검색해서 확인합니다.</p>
        </div>
        <button type="button" onClick={() => onQueryChange({ q: "외부 프로그램" })}>
          외부 활동 살펴보기
        </button>
      </aside>
    </section>
  );
}

type CompetitionSummaryProps = {
  readonly visibleCalls: readonly Call[];
  readonly assetCount: number;
  readonly visibleActivityCount: number;
};

export function CompetitionSummary({
  visibleCalls,
  assetCount,
  visibleActivityCount,
}: CompetitionSummaryProps) {
  const openCount = visibleCalls.filter((call) => call.status === "open").length;
  return (
    <section className="portal-summary" aria-label="대회 현황 요약">
      <SummaryItem label="전체 대회" value={`${visibleCalls.length}건`} />
      <SummaryItem label="접수 중" value={`${openCount}건`} />
      <SummaryItem label="공개 자산" value={`${assetCount}팀`} />
      <SummaryItem label="활동 이벤트" value={`${visibleActivityCount}건`} />
    </section>
  );
}

type CompetitionToolbarProps = {
  readonly status: StatusFilter;
  readonly sort: SortKey;
  readonly searchText: string;
  readonly onSearchTextChange: (value: string) => void;
  readonly onQueryChange: (
    next: Partial<{ readonly status: StatusFilter; readonly q: string; readonly sort: SortKey }>,
  ) => void;
};

export function CompetitionToolbar({
  status,
  sort,
  searchText,
  onSearchTextChange,
  onQueryChange,
}: CompetitionToolbarProps) {
  return (
    <section className="portal-toolbar" aria-label="대회 검색과 필터">
      <div className="filter-pills">
        {filterOptions.map((option) => (
          <button
            className={status === option ? "segmented is-active" : "segmented"}
            type="button"
            key={option}
            aria-pressed={status === option}
            onClick={() => onQueryChange({ status: option })}
          >
            {option === "all" ? "전체" : statusLabel(option)}
          </button>
        ))}
      </div>
      <form
        className="search-row"
        onSubmit={(event) => {
          event.preventDefault();
          onQueryChange({ q: searchText });
        }}
      >
        <label>
          <Search size={16} />
          <span className="visually-hidden">대회 검색</span>
          <input
            value={searchText}
            placeholder="대회명, 태그, 산출물 검색"
            onChange={(event) => onSearchTextChange(event.target.value)}
          />
        </label>
        <label className="select-field">
          <SlidersHorizontal size={16} />
          <span>정렬</span>
          <select value={sort} onChange={(event) => onQueryChange({ sort: parseSortKey(event.target.value) })}>
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
  );
}

type CompetitionSectionTitleProps = {
  readonly status: StatusFilter;
  readonly count: number;
};

export function CompetitionSectionTitle({ status, count }: CompetitionSectionTitleProps) {
  return (
    <SectionTitle
      icon={status === "all" ? <CalendarDays size={18} /> : <ListFilter size={18} />}
      title={status === "all" ? "전체 대회" : `${statusLabel(status)} 대회`}
      count={`${count}건`}
    />
  );
}

export function filterCalls(calls: readonly Call[], status: StatusFilter, query: string): readonly Call[] {
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

export function sortCalls(calls: readonly Call[], sort: SortKey, persona: RoleId): readonly Call[] {
  return [...calls].sort((left, right) => {
    if (sort === "teams") return right.teamCount - left.teamCount;
    if (sort === "status") return left.status.localeCompare(right.status, "ko-KR");
    if (persona === "student") {
      const priorityDifference = studentStatusPriority(left.status) - studentStatusPriority(right.status);
      if (priorityDifference !== 0) return priorityDifference;
    }
    return left.deadline.localeCompare(right.deadline, "ko-KR");
  });
}

export function parseStatusFilter(value: string | null): StatusFilter {
  return competitionStatuses.find((status) => status === value) ?? "all";
}

export function parseSortKey(value: string | null): SortKey {
  return value === "teams" || value === "status" ? value : "deadline";
}

export function parseDataState(value: string | null): DataStateKind | "ready" {
  if (value === "loading" || value === "error" || value === "success") return value;
  return "ready";
}

function SummaryItem({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function studentStatusPriority(status: CompetitionStatus): number {
  const priorities: Record<CompetitionStatus, number> = {
    open: 0,
    always: 1,
    active: 2,
    upcoming: 3,
    reviewing: 4,
    closed: 5,
  };
  return priorities[status];
}
