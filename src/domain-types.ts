export const roleIds = ["public", "student", "staff", "admin"] as const;
export type RoleId = (typeof roleIds)[number];

export const metricIds = ["activity", "commits", "prs", "stars", "repos"] as const;
export type MetricId = (typeof metricIds)[number];

export const competitionStatuses = [
  "open",
  "upcoming",
  "active",
  "reviewing",
  "closed",
  "always",
] as const;
export type CompetitionStatus = (typeof competitionStatuses)[number];

export const teamStatuses = ["submitted", "correction", "provisioned", "published"] as const;
export type TeamStatus = (typeof teamStatuses)[number];

export const userRoles = ["student", "staff", "admin"] as const;
export type UserRole = (typeof userRoles)[number];

export const milestoneStatuses = [
  "not-started",
  "ready",
  "submitted",
  "needs-revision",
  "approved",
] as const;
export type MilestoneStatus = (typeof milestoneStatuses)[number];

export const deliverableTypes = ["file", "text", "repo-tag", "release"] as const;
export type DeliverableType = (typeof deliverableTypes)[number];

export const programGates = ["intake", "full-loop"] as const;
export type ProgramGate = (typeof programGates)[number];

export type Student = {
  readonly id: string;
  readonly name: string;
  readonly studentNo: string;
  readonly github: string;
  readonly email: string;
  readonly phone: string;
  readonly commits: number;
  readonly prs: number;
  readonly stars: number;
  readonly repos: number;
  readonly lastActive: string;
};

export type Team = {
  readonly id: string;
  readonly name: string;
  readonly competitionId: string;
  readonly contest: string;
  readonly repo: string;
  readonly members: readonly string[];
  readonly status: TeamStatus;
  readonly commits: number;
  readonly prs: number;
  readonly stars: number;
  readonly repos: number;
  readonly lastActive: string;
  readonly reportState: "not-started" | "draft" | "submitted";
  readonly consentState: "missing" | "uploaded";
  readonly correctionReason?: string | undefined;
};

export type Repository = {
  readonly id: string;
  readonly teamId: string;
  readonly competitionId: string;
  readonly name: string;
  readonly url: string;
  readonly visibility: "private" | "public";
  readonly license: string;
  readonly language: string;
  readonly lastPushed: string;
};

export type ProgramMilestone = {
  readonly id: string;
  readonly competitionId: string;
  readonly name: string;
  readonly dueDate: string;
  readonly deliverableType: DeliverableType;
  readonly guide: string;
  readonly gate: ProgramGate;
};

export type TeamMilestoneSubmission = {
  readonly id: string;
  readonly teamId: string;
  readonly milestoneId: string;
  readonly status: MilestoneStatus;
  readonly submittedAt?: string | undefined;
  readonly reviewerNote?: string | undefined;
};

export type ManagedUser = {
  readonly id: string;
  readonly name: string;
  readonly role: UserRole;
  readonly status: "active" | "paused" | "graduated";
  readonly github: string;
  readonly lastSeen: string;
};

export type Call = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly host: string;
  readonly category: readonly string[];
  readonly period: string;
  readonly deadline: string;
  readonly teamSize: string;
  readonly eligibility: string;
  readonly outputType: string;
  readonly reviewBasis: string;
  readonly visibility: "public" | "internal";
  readonly status: CompetitionStatus;
  readonly teamCount: number;
  readonly materials: readonly string[];
};

export type ActivityEvent = {
  readonly id: string;
  readonly teamId: string;
  readonly competitionId: string;
  readonly actorGithub: string;
  readonly kind: "commit" | "pull_request" | "issue" | "review" | "publish";
  readonly count: number;
  readonly occurredAt: string;
};

export type AuditEvent = {
  readonly id: string;
  readonly actor: string;
  readonly action: string;
  readonly target: string;
  readonly time: string;
};

export type DemoState = {
  readonly students: readonly Student[];
  readonly teams: readonly Team[];
  readonly repositories: readonly Repository[];
  readonly milestones: readonly ProgramMilestone[];
  readonly submissions: readonly TeamMilestoneSubmission[];
  readonly users: readonly ManagedUser[];
  readonly calls: readonly Call[];
  readonly activity: readonly ActivityEvent[];
  readonly audit: readonly AuditEvent[];
  readonly apiMode: "normal" | "warning" | "incident";
};

export type StudentApplicationInput = {
  readonly competitionId: string;
  readonly teamName: string;
  readonly githubIds: readonly string[];
};

export type ProgramDraftInput = {
  readonly title: string;
  readonly host: string;
  readonly category: readonly string[];
  readonly deadline: string;
  readonly outputType: string;
};
