import type { DemoState } from "./domain";

const demoStateStorageKey = "jnu-oss-demo-state-v2";

type DemoStateCandidate = {
  readonly students?: unknown;
  readonly teams?: unknown;
  readonly repositories?: unknown;
  readonly milestones?: unknown;
  readonly submissions?: unknown;
  readonly users?: unknown;
  readonly calls?: unknown;
  readonly activity?: unknown;
  readonly audit?: unknown;
  readonly apiMode?: unknown;
};

export function readStoredDemoState(fallback: DemoState): DemoState {
  const rawState = window.localStorage.getItem(demoStateStorageKey);
  if (rawState === null) return fallback;
  try {
    const parsedState: unknown = JSON.parse(rawState);
    return isDemoState(parsedState) ? parsedState : fallback;
  } catch (error) {
    if (error instanceof SyntaxError) return fallback;
    throw error;
  }
}

export function writeStoredDemoState(state: DemoState): void {
  window.localStorage.setItem(demoStateStorageKey, JSON.stringify(state));
}

export function clearStoredDemoState(): void {
  window.localStorage.removeItem(demoStateStorageKey);
}

function isDemoState(value: unknown): value is DemoState {
  return (
    isRecord(value) &&
    Array.isArray(value.students) &&
    Array.isArray(value.teams) &&
    Array.isArray(value.repositories) &&
    Array.isArray(value.milestones) &&
    Array.isArray(value.submissions) &&
    Array.isArray(value.users) &&
    Array.isArray(value.calls) &&
    Array.isArray(value.activity) &&
    Array.isArray(value.audit) &&
    isApiMode(value.apiMode)
  );
}

function isRecord(value: unknown): value is DemoStateCandidate {
  return typeof value === "object" && value !== null;
}

function isApiMode(value: unknown): value is DemoState["apiMode"] {
  return value === "normal" || value === "warning" || value === "incident";
}
