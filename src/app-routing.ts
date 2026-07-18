import type { RoleId } from "./domain";

export type Route = {
  readonly path: string;
  readonly reason: string;
};

export function readRoute(): Route {
  const params = new URLSearchParams(window.location.search);
  return {
    path: window.location.pathname === "/" ? "/login" : window.location.pathname,
    reason: reasonText(params.get("reason")),
  };
}

export function replaceRoute(path: string, role?: RoleId): void {
  window.history.replaceState(role === undefined ? null : { role }, "", path);
}

export function isPublicVisitorRoute(path: string): boolean {
  return (
    path === "/public/dashboard" ||
    path === "/competitions" ||
    (path.startsWith("/competitions/") && !path.endsWith("/apply"))
  );
}

export function roleFromHistoryState(state: unknown): RoleId | undefined {
  if (typeof state !== "object" || state === null || !("role" in state)) return undefined;
  return isRoleId(state.role) ? state.role : undefined;
}

export function hasRoleHistoryState(state: unknown): boolean {
  return typeof state === "object" && state !== null && "role" in state;
}

function reasonText(reason: string | null): string {
  if (reason === "student-required") {
    return "신청서는 학생 역할에서만 접근할 수 있습니다.";
  }
  return "";
}

function isRoleId(value: unknown): value is RoleId {
  return value === "public" || value === "student" || value === "staff" || value === "admin";
}
