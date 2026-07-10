export { createInitialState } from "./demo-fixtures";
export * from "./domain-types";

import type {
  ActivityEvent,
  DemoState,
  ManagedUser,
  MetricId,
  Repository,
  StudentApplicationInput,
  Team,
} from "./domain-types";
import { createAudit, slugify } from "./domain-utils";

export function submitStudentApplication(
  state: DemoState,
  input: StudentApplicationInput,
): DemoState {
  const competition = state.calls.find((call) => call.id === input.competitionId);
  if (competition === undefined || competition.status !== "open") {
    return state;
  }
  const cleanName = input.teamName.trim() || "새 OSS 팀";
  const members = input.githubIds.filter((githubId) => githubId.trim().length > 0);
  const newTeam: Team = {
    id: `team-${state.teams.length + 1}`,
    name: cleanName,
    competitionId: competition.id,
    contest: competition.title,
    repo: `github.com/jnu-sojoong/${slugify(cleanName)}`,
    members,
    status: "submitted",
    commits: 0,
    prs: 0,
    stars: 0,
    repos: 1,
    lastActive: "2026-08-20",
    reportState: "draft",
    consentState: "missing",
  };
  const newRepo: Repository = {
    id: `repo-${state.repositories.length + 1}-main`,
    teamId: newTeam.id,
    competitionId: competition.id,
    name: slugify(cleanName),
    url: `github.com/jnu-sojoong/${slugify(cleanName)}`,
    visibility: "private",
    license: "MIT",
    language: "TypeScript",
    lastPushed: "2026-08-20",
  };
  const newActivity: ActivityEvent = {
    id: `activity-${state.activity.length + 1}`,
    teamId: newTeam.id,
    competitionId: competition.id,
    actorGithub: members[0] ?? "jnu-new",
    kind: "review",
    count: 1,
    occurredAt: "2026-08-20",
  };
  return {
    ...state,
    teams: [newTeam, ...state.teams],
    repositories: [newRepo, ...state.repositories],
    activity: [newActivity, ...state.activity],
    calls: state.calls.map((call) =>
      call.id === competition.id ? { ...call, teamCount: call.teamCount + 1 } : call,
    ),
    audit: [createAudit("student", "submitted application", cleanName), ...state.audit],
  };
}

export function approveTeam(state: DemoState, teamId: string): DemoState {
  const target = state.teams.find((team) => team.id === teamId);
  return updateTeam(
    state,
    teamId,
    (team) => ({
      ...team,
      status: "provisioned",
      correctionReason: undefined,
    }),
    createAudit("staff", "approved and provisioned repo", target?.name ?? teamId),
  );
}

export function requestTeamCorrection(state: DemoState, teamId: string, reason: string): DemoState {
  const target = state.teams.find((team) => team.id === teamId);
  return updateTeam(
    state,
    teamId,
    (team) => ({
      ...team,
      status: "correction",
      correctionReason: reason,
    }),
    createAudit("staff", "requested correction", target?.name ?? teamId),
  );
}

export function publishTeamAsset(state: DemoState, teamId: string): DemoState {
  const target = state.teams.find((team) => team.id === teamId);
  const nextState = updateTeam(
    state,
    teamId,
    (team) => ({
      ...team,
      status: "published",
      reportState: "submitted",
    }),
    createAudit("staff", "published asset candidate", target?.name ?? teamId),
  );
  return {
    ...nextState,
    repositories: nextState.repositories.map(
      (repository): Repository =>
        repository.teamId === teamId ? { ...repository, visibility: "public" } : repository,
    ),
  };
}

export function addManagedUser(state: DemoState, user: ManagedUser): DemoState {
  return {
    ...state,
    users: [user, ...state.users],
    audit: [createAudit("admin", "created user", user.name), ...state.audit],
  };
}

export function updateManagedUserStatus(
  state: DemoState,
  userId: string,
  status: ManagedUser["status"],
  reason: string,
): DemoState {
  const target = state.users.find((user) => user.id === userId);
  return {
    ...state,
    users: state.users.map(
      (user): ManagedUser => (user.id === userId ? { ...user, status } : user),
    ),
    audit: [
      createAudit("admin", `changed user status to ${status}: ${reason}`, target?.name ?? userId),
      ...state.audit,
    ],
  };
}

export function setApiMode(state: DemoState, apiMode: DemoState["apiMode"]): DemoState {
  return {
    ...state,
    apiMode,
    audit: [createAudit("admin", `set api mode ${apiMode}`, "GitHub API monitor"), ...state.audit],
  };
}

export function leaderboardValue(team: Team, metric: MetricId): number {
  switch (metric) {
    case "activity":
      return team.commits + team.prs * 8 + team.stars * 3 + team.repos * 12;
    case "commits":
      return team.commits;
    case "prs":
      return team.prs;
    case "stars":
      return team.stars;
    case "repos":
      return team.repos;
  }
}

export function publicTeams(teams: readonly Team[]): readonly Team[] {
  return teams.filter((team) => team.status === "published");
}

export function publicRepositories(
  repositories: readonly Repository[],
  teams: readonly Team[],
): readonly Repository[] {
  const publishedTeamIds = new Set(publicTeams(teams).map((team) => team.id));
  return repositories.filter(
    (repository) => repository.visibility === "public" && publishedTeamIds.has(repository.teamId),
  );
}

function updateTeam(
  state: DemoState,
  teamId: string,
  mapper: (team: Team) => Team,
  auditEvent: DemoState["audit"][number],
): DemoState {
  return {
    ...state,
    teams: state.teams.map((team): Team => (team.id === teamId ? mapper(team) : team)),
    audit: [auditEvent, ...state.audit],
  };
}
