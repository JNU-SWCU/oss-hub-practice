import { ActivitySquare, AlertTriangle, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import type { DemoState, ManagedUser } from "../domain";
import { AdminAuditPanel } from "./AdminAuditPanel";
import { AdminUserManagementPanel } from "./AdminUserManagementPanel";
import {
  MetricCard,
  type PendingUserAction,
  type UserRoleFilter,
  assertNever,
  pendingUserActionRequest,
} from "./AdminWorkspace.helpers";
import { ConfirmDialog, ToastMessage, useUnsavedChangesWarning } from "./CompliancePrimitives";
import { apiModeText, parseUserRole } from "./admin-workspace-labels";

type AdminWorkspaceProps = {
  readonly state: DemoState;
  readonly onAddUser: (user: ManagedUser) => void;
  readonly onUpdateUserStatus: (
    userId: string,
    status: ManagedUser["status"],
    reason: string,
  ) => void;
  readonly onSetApiMode: (mode: DemoState["apiMode"]) => void;
};

const initialUserDraft = {
  name: "신규 교직원",
  role: "staff",
  reason: "",
} as const satisfies {
  readonly name: string;
  readonly role: ManagedUser["role"];
  readonly reason: string;
};

export function AdminWorkspace({
  state,
  onAddUser,
  onUpdateUserStatus,
  onSetApiMode,
}: AdminWorkspaceProps) {
  const [name, setName] = useState<string>(initialUserDraft.name);
  const [role, setRole] = useState<ManagedUser["role"]>(initialUserDraft.role);
  const [reason, setReason] = useState<string>(initialUserDraft.reason);
  const [error, setError] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<UserRoleFilter>("all");
  const [pendingUserAction, setPendingUserAction] = useState<PendingUserAction | undefined>(
    undefined,
  );
  const [toast, setToast] = useState("");
  const apiText = apiModeText(state.apiMode);
  const hasUnsavedUserDraft =
    name !== initialUserDraft.name || role !== initialUserDraft.role || reason.length > 0;
  useUnsavedChangesWarning(hasUnsavedUserDraft);
  function handleCreateUser(): void {
    if (reason.trim().length === 0) {
      setError("권한 변경 사유를 입력해야 합니다.");
      return;
    }
    setError("");
    onAddUser({
      id: `user-${state.users.length + 1}`,
      name,
      role,
      status: "active",
      github: role === "staff" ? "staff-email-demo" : "jnu-new-user",
      lastSeen: "2026-07-06",
    });
    setToast(`${name} 사용자를 추가했습니다.`);
    setReason("");
  }

  function confirmPendingUserAction(): void {
    if (pendingUserAction === undefined) return;
    const user = state.users.find((candidate) => candidate.id === pendingUserAction.userId);
    switch (pendingUserAction.kind) {
      case "pause":
        onUpdateUserStatus(pendingUserAction.userId, "paused", "데모 비활성화");
        setToast(`${user?.name ?? "선택한 사용자"} 계정을 비활성화했습니다.`);
        break;
      case "restore":
        onUpdateUserStatus(pendingUserAction.userId, "active", "데모 복구");
        setToast(`${user?.name ?? "선택한 사용자"} 계정을 복구했습니다.`);
        break;
      default:
        assertNever(pendingUserAction);
    }
    setPendingUserAction(undefined);
  }

  return (
    <div className="workspace-grid">
      <ToastMessage message={toast} onDismiss={() => setToast("")} />
      <ConfirmDialog
        request={pendingUserActionRequest(pendingUserAction, state)}
        onCancel={() => setPendingUserAction(undefined)}
        onConfirm={confirmPendingUserAction}
      />
      <div className="workspace-intro">
        <p className="section-kicker">시스템 관리</p>
        <h2>시스템 관리자 운영 점검</h2>
        <p>
          시스템 관리자는 사용자 역할과 계정 상태, GitHub App/API 호출 이상치, webhook 실패 상태를
          점검합니다. 현재 화면은 실제 권한 변경이나 API 호출 없이 시연용 데이터만 갱신합니다.
        </p>
        <div className="notice-banner">합성 GitHub App/Webhook/API 데이터입니다.</div>
      </div>
      <div className="metric-grid">
        <MetricCard
          icon={<ShieldCheck size={18} />}
          label="활성 사용자"
          value={`${state.users.length}명`}
        />
        <MetricCard icon={<ActivitySquare size={18} />} label="API 호출" value={apiText.calls} />
        <MetricCard icon={<AlertTriangle size={18} />} label="이상치" value={apiText.alert} />
      </div>
      <form className="form-panel" onSubmit={(event) => event.preventDefault()}>
        <h3>사용자 생성/권한 변경</h3>
        <label>
          <span>이름</span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          <span>역할</span>
          <select
            value={role}
            onChange={(event) => {
              const selectedRole = parseUserRole(event.target.value);
              if (selectedRole !== undefined) {
                setRole(selectedRole);
              }
            }}
          >
            <option value="student">학생</option>
            <option value="staff">교직원</option>
            <option value="admin">시스템 관리자</option>
          </select>
        </label>
        <label>
          <span>변경 사유</span>
          <input value={reason} onChange={(event) => setReason(event.target.value)} />
        </label>
        {error.length > 0 ? <p className="error-text">{error}</p> : null}
        <button className="primary-action" type="button" onClick={handleCreateUser}>
          <UserPlus size={18} />
          사용자 추가
        </button>
      </form>
      <AdminUserManagementPanel
        users={state.users}
        userQuery={userQuery}
        userRoleFilter={userRoleFilter}
        onUserQueryChange={setUserQuery}
        onUserRoleFilterChange={setUserRoleFilter}
        onPendingUserActionChange={setPendingUserAction}
        onSetApiMode={onSetApiMode}
      />
      <AdminAuditPanel audit={state.audit} />
    </div>
  );
}
