import { ActivitySquare, AlertTriangle, ShieldCheck, UserPlus } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { DemoState, ManagedUser } from "../domain";
import {
  apiModeText,
  auditActionLabel,
  auditActorLabel,
  auditTargetLabel,
  parseUserRole,
  roleLabel,
  userStatusLabel,
} from "./admin-workspace-labels";

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

export function AdminWorkspace({
  state,
  onAddUser,
  onUpdateUserStatus,
  onSetApiMode,
}: AdminWorkspaceProps) {
  const [name, setName] = useState("신규 교직원");
  const [role, setRole] = useState<ManagedUser["role"]>("staff");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const apiText = apiModeText(state.apiMode);

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
  }

  return (
    <div className="workspace-grid">
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
      <div className="table-panel span-wide">
        <div className="panel-heading">
          <div>
            <h3>사용자 관리</h3>
            <p>계정 삭제 대신 비활성화와 복구만 제공합니다.</p>
          </div>
          <div className="panel-controls">
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
              {state.users.map((user) => (
                <tr key={user.id}>
                  <td data-label="이름">{user.name}</td>
                  <td data-label="역할">{roleLabel(user.role)}</td>
                  <td data-label="상태">{userStatusLabel(user.status)}</td>
                  <td data-label="GitHub">{user.github}</td>
                  <td className="action-cell" data-label="작업">
                    <button
                      type="button"
                      onClick={() => onUpdateUserStatus(user.id, "paused", "데모 비활성화")}
                    >
                      비활성화
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateUserStatus(user.id, "active", "데모 복구")}
                    >
                      복구
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="table-panel span-wide">
        <div className="panel-heading">
          <div>
            <h3>감사 로그</h3>
            <p>사용자, 검토, API 상태 변경이 최근 순서로 남습니다.</p>
          </div>
        </div>
        <div className="audit-list" aria-label="감사 로그">
          {state.audit.slice(0, 6).map((event, index) => (
            <article className="audit-item" key={`${event.id}-${index}`}>
              <strong>{auditActionLabel(event.action)}</strong>
              <span>{auditTargetLabel(event.target)}</span>
              <small>
                {auditActorLabel(event.actor)} · {event.time}
              </small>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

type MetricCardProps = {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
};

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <div className="metric-card">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
