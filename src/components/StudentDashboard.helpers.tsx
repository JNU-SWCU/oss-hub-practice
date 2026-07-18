import type { DemoState, ProgramMilestone } from "../domain";

export function gateLabel(gate: ProgramMilestone["gate"]): string {
  switch (gate) {
    case "intake":
      return "8/15 Intake";
    case "full-loop":
      return "8/27 Full-loop";
  }
}

export function dDayText(deadline: string): string {
  const parsed = Date.parse(`${deadline}T00:00:00+09:00`);
  if (Number.isNaN(parsed)) return "상시";
  const demoToday = Date.parse("2026-07-15T00:00:00+09:00");
  const diffDays = Math.ceil((parsed - demoToday) / 86_400_000);
  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-day";
  return `D+${Math.abs(diffDays)}`;
}

export function ProgressStep({
  label,
  value,
  isActive,
}: {
  readonly label: string;
  readonly value: string;
  readonly isActive: boolean;
}) {
  return (
    <article className={isActive ? "is-active" : ""}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export function RepositoryAddress({ value }: { readonly value: string }) {
  const boundary = value.lastIndexOf("/") + 1;
  return (
    <>
      <span className="repository-prefix">{value.slice(0, boundary)}</span>
      <span className="repository-slug">{value.slice(boundary)}</span>
    </>
  );
}

export function statusText(status: DemoState["teams"][number]["status"]): string {
  switch (status) {
    case "submitted":
      return "접수 완료";
    case "correction":
      return "보완 요청";
    case "provisioned":
      return "저장소 배정 완료";
    case "published":
      return "공개 자산";
  }
}
