import type { ReactNode } from "react";
import type { DemoState, ManagedUser } from "../domain";
import type { ConfirmRequest } from "./CompliancePrimitives";
import { parseUserRole } from "./admin-workspace-labels";

export type PendingUserAction =
  | { readonly kind: "pause"; readonly userId: string }
  | { readonly kind: "restore"; readonly userId: string };

export type UserRoleFilter = ManagedUser["role"] | "all";

export function parseUserRoleFilter(value: string): UserRoleFilter {
  const parsedRole = parseUserRole(value);
  return parsedRole ?? "all";
}

export function pendingUserActionRequest(
  action: PendingUserAction | undefined,
  state: DemoState,
): ConfirmRequest | undefined {
  if (action === undefined) return undefined;
  const userName = state.users.find((user) => user.id === action.userId)?.name ?? "선택한 사용자";
  switch (action.kind) {
    case "pause":
      return {
        title: `${userName} 비활성화`,
        description: "이 사용자는 복구 전까지 역할별 화면 접근이 제한된 상태로 표시됩니다.",
        confirmLabel: "비활성화",
        tone: "danger",
      };
    case "restore":
      return {
        title: `${userName} 복구`,
        description: "복구하면 사용자 목록에서 활성 상태로 다시 표시됩니다.",
        confirmLabel: "복구",
        tone: "warning",
      };
    default:
      return assertNever(action);
  }
}

type MetricCardProps = {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
};

export function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <div className="metric-card">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected admin action: ${value}`);
}
