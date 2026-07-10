import { userRoles } from "../domain";
import type { DemoState, ManagedUser } from "../domain";

export function apiModeText(mode: DemoState["apiMode"]): {
  readonly calls: string;
  readonly alert: string;
} {
  switch (mode) {
    case "normal":
      return { calls: "1,284회", alert: "없음" };
    case "warning":
      return { calls: "4,911회", alert: "2차 제한 경고" };
    case "incident":
      return { calls: "3,220회", alert: "webhook 실패" };
  }
}

export function parseUserRole(value: string): ManagedUser["role"] | undefined {
  return userRoles.find((role) => role === value);
}

export function roleLabel(role: ManagedUser["role"]): string {
  const labels: Record<ManagedUser["role"], string> = {
    student: "학생",
    staff: "교직원",
    admin: "시스템 관리자",
  };
  return labels[role];
}

export function userStatusLabel(status: ManagedUser["status"]): string {
  const labels: Record<ManagedUser["status"], string> = {
    active: "활성",
    paused: "일시 중지",
    graduated: "졸업/종료",
  };
  return labels[status];
}

export function auditActorLabel(actor: string): string {
  const labels: Record<string, string> = {
    system: "시스템",
    staff: "교직원",
    student: "학생",
    admin: "시스템 관리자",
  };
  return labels[actor] ?? actor;
}

export function auditTargetLabel(target: string): string {
  if (target === "mock data") {
    return "데모 데이터";
  }
  if (target === "GitHub API monitor") {
    return "GitHub API 관찰";
  }
  return target;
}

export function auditActionLabel(action: string): string {
  const labels: Record<string, string> = {
    seed: "데모 데이터 생성",
    "opened call": "공모 생성",
    "submitted application": "신청서 제출",
    "approved and provisioned repo": "승인 및 저장소 배정",
    "requested correction": "보완 요청",
    "published asset candidate": "자산 공개 전환",
    "created user": "사용자 생성",
  };
  if (action.startsWith("changed user status to ")) {
    return action
      .replace("changed user status to active:", "사용자 상태를 활성으로 변경:")
      .replace("changed user status to paused:", "사용자 상태를 일시 중지로 변경:")
      .replace("changed user status to graduated:", "사용자 상태를 졸업/종료로 변경:");
  }
  if (action.startsWith("set api mode ")) {
    return action
      .replace("set api mode normal", "API 상태를 정상으로 변경")
      .replace("set api mode warning", "API 상태를 요청 제한 경고로 변경")
      .replace("set api mode incident", "API 상태를 webhook 실패로 변경");
  }
  return labels[action] ?? action;
}
