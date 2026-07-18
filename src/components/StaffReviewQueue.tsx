import { Check, RotateCcw, Search } from "lucide-react";
import type { DemoState, Team } from "../domain";
import { DataStatePanel } from "./CompliancePrimitives";
import {
  type PendingStaffAction,
  consentStateLabel,
  reportStateLabel,
  statusLabel,
} from "./StaffWorkspace.helpers";

type StaffReviewQueueProps = {
  readonly teams: readonly Team[];
  readonly reviewQuery: string;
  readonly onReviewQueryChange: (value: string) => void;
  readonly onPendingActionChange: (action: PendingStaffAction) => void;
};

export function StaffReviewQueue({
  teams,
  reviewQuery,
  onReviewQueryChange,
  onPendingActionChange,
}: StaffReviewQueueProps) {
  const filteredReviewTargets = teams.filter((team) =>
    [team.name, team.contest, team.repo].some((value) =>
      value.toLowerCase().includes(reviewQuery.trim().toLowerCase()),
    ),
  );
  return (
    <div className="table-panel span-wide">
      <div className="panel-heading">
        <div>
          <h3>신청 검토 큐</h3>
          <p>승인하면 repo 배정 완료 상태가 되고, 보완 요청은 학생 화면에 표시됩니다.</p>
        </div>
        <label className="search-inline">
          <Search size={16} />
          <span className="visually-hidden">신청 검토 큐 검색</span>
          <input
            value={reviewQuery}
            placeholder="팀, 대회, 저장소 검색"
            onChange={(event) => onReviewQueryChange(event.target.value)}
          />
        </label>
      </div>
      {filteredReviewTargets.length > 0 ? (
        <ReviewQueueTable
          teams={filteredReviewTargets}
          onPendingActionChange={onPendingActionChange}
        />
      ) : (
        <DataStatePanel
          state="empty"
          title="조건에 맞는 검토 대상이 없습니다"
          description="검색어를 지우면 전체 검토 큐를 다시 볼 수 있습니다."
          actionLabel="검색 초기화"
          onAction={() => onReviewQueryChange("")}
        />
      )}
    </div>
  );
}

type ReviewQueueTableProps = {
  readonly teams: readonly Team[];
  readonly onPendingActionChange: (action: PendingStaffAction) => void;
};

function ReviewQueueTable({ teams, onPendingActionChange }: ReviewQueueTableProps) {
  return (
    <div className="table-scroll">
      <table aria-label="교직원 신청 검토 큐">
        <thead>
          <tr>
            <th>팀</th>
            <th>대회</th>
            <th>보고서</th>
            <th>제출 동의서</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td data-label="팀">{team.name}</td>
              <td data-label="대회">{team.contest}</td>
              <td data-label="보고서">{reportStateLabel(team.reportState)}</td>
              <td data-label="제출 동의서">{consentStateLabel(team.consentState)}</td>
              <td data-label="상태">{statusLabel(team.status)}</td>
              <td className="action-cell" data-label="작업">
                <button
                  type="button"
                  onClick={() => onPendingActionChange({ kind: "approve", teamId: team.id })}
                >
                  <Check size={15} />
                  승인
                </button>
                <button
                  type="button"
                  onClick={() => onPendingActionChange({ kind: "correction", teamId: team.id })}
                >
                  <RotateCcw size={15} />
                  보완 요청
                </button>
                <button
                  type="button"
                  onClick={() => onPendingActionChange({ kind: "publish", teamId: team.id })}
                >
                  자산 공개
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
