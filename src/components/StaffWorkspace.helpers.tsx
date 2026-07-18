import type { ReactNode } from "react";
import type { DemoState } from "../domain";
import type { ConfirmRequest } from "./CompliancePrimitives";

export const initialProgramDraft = {
  title: "OSS 실전 배포 챌린지",
  period: "2026-09-01 - 2026-09-20",
  deadline: "2026-09-20",
  teamSize: "2-4명",
  categoryText: "배포, GitHub, Vercel",
  outputType: "Vercel 배포 URL",
  applicationFields: "참여 동기, 공개 동의, 팀 소개",
  milestoneName: "최종 산출물 제출",
  milestoneDueDate: "2026-09-18",
  deliverableType: "repo-tag",
  reminderPolicy: "마감 3일 전 미제출 팀 요약 이메일",
} as const;

export type PendingStaffAction =
  | { readonly kind: "approve"; readonly teamId: string }
  | { readonly kind: "correction"; readonly teamId: string }
  | { readonly kind: "publish"; readonly teamId: string };

export function pendingActionRequest(
  action: PendingStaffAction | undefined,
  state: DemoState,
): ConfirmRequest | undefined {
  if (action === undefined) return undefined;
  const teamName = state.teams.find((team) => team.id === action.teamId)?.name ?? "선택한 팀";
  switch (action.kind) {
    case "approve":
      return {
        title: `${teamName} 승인`,
        description: "승인하면 학생 대시보드에 저장소 배정 완료 상태로 표시됩니다.",
        confirmLabel: "승인",
        tone: "warning",
      };
    case "correction":
      return {
        title: `${teamName} 보완 요청`,
        description: "학생 화면에 보완 요청 문구가 표시됩니다.",
        confirmLabel: "보완 요청",
        tone: "warning",
      };
    case "publish":
      return {
        title: `${teamName} 공개 전환`,
        description: "공개 아카이브와 리더보드에 팀과 저장소 활동이 노출됩니다.",
        confirmLabel: "공개 전환",
        tone: "danger",
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

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: "접수 완료",
    correction: "보완 요청",
    provisioned: "저장소 배정 완료",
    published: "공개 자산",
  };
  return labels[status] ?? status;
}

export function reportStateLabel(status: string): string {
  const labels: Record<string, string> = {
    "not-started": "미작성",
    draft: "작성 중",
    submitted: "제출 완료",
  };
  return labels[status] ?? status;
}

export function consentStateLabel(status: string): string {
  const labels: Record<string, string> = {
    missing: "미제출",
    uploaded: "업로드 완료",
  };
  return labels[status] ?? status;
}

export function programStatusLabel(status: DemoState["calls"][number]["status"]): string {
  const labels: Record<DemoState["calls"][number]["status"], string> = {
    open: "접수중",
    upcoming: "예정",
    active: "진행중",
    reviewing: "검토중",
    closed: "종료",
    always: "상시",
  };
  return labels[status];
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected staff action: ${value}`);
}
