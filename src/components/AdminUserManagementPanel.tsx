import { Search } from "lucide-react";
import type { ManagedUser } from "../domain";
import {
  type PendingUserAction,
  type UserRoleFilter,
  parseUserRoleFilter,
} from "./AdminWorkspace.helpers";
import { DataStatePanel } from "./CompliancePrimitives";
import { roleLabel, userStatusLabel } from "./admin-workspace-labels";

type AdminUserManagementPanelProps = {
  readonly users: readonly ManagedUser[];
  readonly userQuery: string;
  readonly userRoleFilter: UserRoleFilter;
  readonly onUserQueryChange: (value: string) => void;
  readonly onUserRoleFilterChange: (value: UserRoleFilter) => void;
  readonly onPendingUserActionChange: (action: PendingUserAction) => void;
  readonly onSetApiMode: (mode: "normal" | "warning" | "incident") => void;
};

export function AdminUserManagementPanel({
  users,
  userQuery,
  userRoleFilter,
  onUserQueryChange,
  onUserRoleFilterChange,
  onPendingUserActionChange,
  onSetApiMode,
}: AdminUserManagementPanelProps) {
  const visibleUsers = users.filter((user) => {
    const roleMatches = userRoleFilter === "all" || user.role === userRoleFilter;
    const queryMatches =
      userQuery.trim().length === 0 ||
      [user.name, user.github, roleLabel(user.role), userStatusLabel(user.status)].some((value) =>
        value.toLowerCase().includes(userQuery.trim().toLowerCase()),
      );
    return roleMatches && queryMatches;
  });

  return (
    <div className="table-panel span-wide">
      <div className="panel-heading">
        <div>
          <h3>사용자 관리</h3>
          <p>계정 삭제 대신 비활성화와 복구만 제공합니다.</p>
        </div>
        <div className="panel-controls">
          <label className="search-inline">
            <Search size={16} />
            <span className="visually-hidden">사용자 검색</span>
            <input
              value={userQuery}
              placeholder="이름, GitHub, 상태 검색"
              onChange={(event) => onUserQueryChange(event.target.value)}
            />
          </label>
          <label className="select-field">
            <span>역할</span>
            <select
              value={userRoleFilter}
              onChange={(event) => onUserRoleFilterChange(parseUserRoleFilter(event.target.value))}
            >
              <option value="all">전체</option>
              <option value="student">학생</option>
              <option value="staff">교직원</option>
              <option value="admin">관리자</option>
            </select>
          </label>
          <button className="segmented" type="button" onClick={() => onSetApiMode("normal")}>
            정상
          </button>
          <button className="segmented" type="button" onClick={() => onSetApiMode("warning")}>
            요청 제한 경고
          </button>
          <button className="segmented" type="button" onClick={() => onSetApiMode("incident")}>
            webhook 실패
          </button>
        </div>
      </div>
      {visibleUsers.length > 0 ? (
        <AdminUserTable
          users={visibleUsers}
          onPendingUserActionChange={onPendingUserActionChange}
        />
      ) : (
        <DataStatePanel
          state="empty"
          title="조건에 맞는 사용자가 없습니다"
          description="검색어나 역할 필터를 초기화하면 전체 사용자를 다시 볼 수 있습니다."
          actionLabel="필터 초기화"
          onAction={() => {
            onUserQueryChange("");
            onUserRoleFilterChange("all");
          }}
        />
      )}
    </div>
  );
}

type AdminUserTableProps = {
  readonly users: readonly ManagedUser[];
  readonly onPendingUserActionChange: (action: PendingUserAction) => void;
};

function AdminUserTable({ users, onPendingUserActionChange }: AdminUserTableProps) {
  return (
    <div className="table-scroll">
      <table aria-label="시스템 관리자 사용자 관리">
        <thead>
          <tr>
            <th>이름</th>
            <th>역할</th>
            <th>상태</th>
            <th>GitHub</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td data-label="이름">{user.name}</td>
              <td data-label="역할">{roleLabel(user.role)}</td>
              <td data-label="상태">{userStatusLabel(user.status)}</td>
              <td data-label="GitHub">{user.github}</td>
              <td className="action-cell" data-label="작업">
                <button
                  type="button"
                  onClick={() => onPendingUserActionChange({ kind: "pause", userId: user.id })}
                >
                  비활성화
                </button>
                <button
                  type="button"
                  onClick={() => onPendingUserActionChange({ kind: "restore", userId: user.id })}
                >
                  복구
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
