import type { AuditEvent } from "./domain-types";

export function createAudit(actor: string, action: string, target: string): AuditEvent {
  const id = slugify(`${actor}-${action}-${target}`).slice(0, 80);
  return {
    id,
    actor,
    action,
    target,
    time: "2026-07-06 19:00",
  };
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^\w가-힣-]/g, "")
    .replaceAll("--", "-");
}
