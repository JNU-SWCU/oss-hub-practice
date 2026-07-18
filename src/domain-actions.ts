import type {
  ActivityEvent,
  DemoState,
  ManagedUser,
  ProgramDraftInput,
  ProgramMilestone,
  Repository,
  StudentApplicationInput,
  Team,
  TeamMilestoneSubmission,
} from "./domain-types";
import { createAudit } from "./domain-utils";

export function submitStudentApplication(
  state: DemoState,
  input: StudentApplicationInput,
): DemoState {
  const competition = state.calls.find((call) => call.id === input.competitionId);
  if (competition === undefined || competition.status !== "open") return state;

  const cleanName = input.teamName.trim() || "새 OSS 팀";
  const members = input.githubIds.filter((githubId) => githubId.trim().length > 0);
  const newTeamId = `team-${state.teams.length + 1}`;
  const repositorySlug = `${competition.id}-${newTeamId}`;
  const newTeam: Team = {
    id: newTeamId,
    name: cleanName,
    competitionId: competition.id,
    contest: competition.title,
    repo: `github.com/jnu-sojoong/${repositorySlug}`,
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
    name: repositorySlug,
    url: `github.com/jnu-sojoong/${repositorySlug}`,
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
  const newSubmissions = state.milestones
    .filter((milestone) => milestone.competitionId === competition.id)
    .map((milestone) => createSubmissionForNewTeam(newTeam.id, milestone));

  return {
    ...state,
    teams: [newTeam, ...state.teams],
    repositories: [newRepo, ...state.repositories],
    submissions: [...newSubmissions, ...state.submissions],
    activity: [newActivity, ...state.activity],
    calls: state.calls.map((call) =>
      call.id === competition.id ? { ...call, teamCount: call.teamCount + 1 } : call,
    ),
    audit: [createAudit("student", "submitted application", cleanName), ...state.audit],
  };
}

export function createProgramDraft(state: DemoState, input: ProgramDraftInput): DemoState {
  const cleanTitle = input.title.trim() || "신규 사업단 프로그램";
  const categories = input.category
    .map((category) => category.trim())
    .filter((category) => category.length > 0);
  const newCall = {
    id: `call-${state.calls.length + 1}`,
    title: cleanTitle,
    summary: `${cleanTitle} 참여 팀을 모집하고 GitHub 저장소, 규칙, 제출 현황을 한 화면에서 관리합니다.`,
    host: input.host.trim() || "전남대학교 소프트웨어중심대학사업단",
    category: categories.length > 0 ? categories : ["OSS"],
    period: `2026-07-14 - ${input.deadline}`,
    deadline: input.deadline,
    teamSize: "2-4명",
    eligibility: "전남대학교 재학생",
    outputType: input.outputType.trim() || "공개 저장소",
    reviewBasis: "신청서, GitHub ID, README, 라이선스, 활동 로그",
    visibility: "internal",
    status: "upcoming",
    teamCount: 0,
    materials: ["참가 안내", "규칙/평가표", "저장소 템플릿"],
  } satisfies DemoState["calls"][number];
  const intakeMilestone: ProgramMilestone = {
    id: `${newCall.id}-intake`,
    competitionId: newCall.id,
    name: "신청서/팀 확정",
    dueDate: input.deadline,
    deliverableType: "text",
    guide: "팀 이름, 팀원 GitHub ID, 동의 상태를 확정합니다.",
    gate: "intake",
  };
  return {
    ...state,
    calls: [newCall, ...state.calls],
    milestones: [intakeMilestone, ...state.milestones],
    audit: [createAudit("staff", "created program draft", cleanTitle), ...state.audit],
  };
}

export function approveTeam(state: DemoState, teamId: string): DemoState {
  const target = state.teams.find((team) => team.id === teamId);
  return updateTeam(
    state,
    teamId,
    (team) => ({ ...team, status: "provisioned", correctionReason: undefined }),
    createAudit("staff", "approved and provisioned repo", target?.name ?? teamId),
  );
}

export function requestTeamCorrection(state: DemoState, teamId: string, reason: string): DemoState {
  const target = state.teams.find((team) => team.id === teamId);
  return updateTeam(
    state,
    teamId,
    (team) => ({ ...team, status: "correction", correctionReason: reason }),
    createAudit("staff", "requested correction", target?.name ?? teamId),
  );
}

export function publishTeamAsset(state: DemoState, teamId: string): DemoState {
  const target = state.teams.find((team) => team.id === teamId);
  const nextState = updateTeam(
    state,
    teamId,
    (team) => ({ ...team, status: "published", reportState: "submitted" }),
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

function createSubmissionForNewTeam(
  teamId: string,
  milestone: ProgramMilestone,
): TeamMilestoneSubmission {
  return {
    id: `${teamId}-${milestone.id}`,
    teamId,
    milestoneId: milestone.id,
    status: milestone.gate === "intake" ? "submitted" : "not-started",
    submittedAt: milestone.gate === "intake" ? "2026-08-20" : undefined,
  };
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
