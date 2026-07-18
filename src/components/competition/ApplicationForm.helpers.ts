export const currentApplicantGithub = "jnu-oss-1";

export type TeamMode = "create" | "join";

export type ApplicationDraft = {
  readonly teamName: string;
  readonly githubIds: string;
  readonly summary: string;
  readonly teamMode: TeamMode;
  readonly joinCode: string;
};

type StoredApplicationDraft = {
  readonly teamName?: unknown;
  readonly githubIds?: unknown;
  readonly summary?: unknown;
  readonly teamMode?: unknown;
  readonly joinCode?: unknown;
};

export const initialApplicationDraft: ApplicationDraft = {
  teamName: "해커톤 새싹 팀",
  githubIds: "jnu-alpha, jnu-beta",
  summary: "전남대학교 학생들이 교과/비교과 활동에서 만든 OSS 산출물을 저장소로 공개합니다.",
  teamMode: "create",
  joinCode: "OSS-2026",
};

export function loadApplicationDraft(competitionId: string): ApplicationDraft {
  if (typeof window === "undefined") return initialApplicationDraft;
  const storedDraft = window.localStorage.getItem(applicationDraftKey(competitionId));
  if (storedDraft === null) return initialApplicationDraft;

  try {
    return parseApplicationDraft(JSON.parse(storedDraft));
  } catch (error) {
    console.warn("Failed to restore application draft", error);
    return initialApplicationDraft;
  }
}

export function saveApplicationDraft(competitionId: string, draft: ApplicationDraft): void {
  window.localStorage.setItem(applicationDraftKey(competitionId), JSON.stringify(draft));
}

export function clearApplicationDraft(competitionId: string): void {
  window.localStorage.removeItem(applicationDraftKey(competitionId));
}

export function parseGithubIds(value: string): readonly string[] {
  return value
    .split(",")
    .map((githubId) => githubId.trim())
    .filter(Boolean);
}

export function includeApplicantGithub(githubIds: readonly string[]): readonly string[] {
  if (githubIds.includes(currentApplicantGithub)) return githubIds;
  return [currentApplicantGithub, ...githubIds];
}

export function parseTeamSizeRange(
  value: string,
): { readonly min: number; readonly max: number } | undefined {
  const match = /(\d+)\D+(\d+)/.exec(value);
  if (match === null) return undefined;
  const min = Number(match[1]);
  const max = Number(match[2]);
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) return undefined;
  return { min, max };
}

function applicationDraftKey(competitionId: string): string {
  return `jnu-oss-demo-application-draft-${competitionId}`;
}

function parseApplicationDraft(value: unknown): ApplicationDraft {
  if (!isStoredApplicationDraft(value)) return initialApplicationDraft;
  const teamMode = value.teamMode === "join" ? "join" : "create";
  return {
    teamName: stringOrDefault(value.teamName, initialApplicationDraft.teamName),
    githubIds: stringOrDefault(value.githubIds, initialApplicationDraft.githubIds),
    summary: stringOrDefault(value.summary, initialApplicationDraft.summary),
    teamMode,
    joinCode: stringOrDefault(value.joinCode, initialApplicationDraft.joinCode),
  };
}

function isStoredApplicationDraft(value: unknown): value is StoredApplicationDraft {
  return typeof value === "object" && value !== null;
}

function stringOrDefault(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}
