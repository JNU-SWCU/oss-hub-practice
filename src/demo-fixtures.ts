import { createActivity } from "./demo-activity-fixtures";
import { createCompetitions, createMilestones } from "./demo-program-fixtures";
import type {
  DemoState,
  ManagedUser,
  MilestoneStatus,
  ProgramMilestone,
  Repository,
  Student,
  Team,
  TeamMilestoneSubmission,
  TeamStatus,
} from "./domain-types";
import { createAudit, slugify } from "./domain-utils";

type SeedTeamInput = {
  readonly id: string;
  readonly name: string;
  readonly competitionId: string;
  readonly contest: string;
  readonly members: readonly string[];
  readonly commits: number;
  readonly prs: number;
  readonly stars: number;
  readonly repos: number;
  readonly status: TeamStatus;
};

export function createInitialState(): DemoState {
  const students = createStudents();
  const calls = createCompetitions();
  const teams = createTeams();
  const milestones = createMilestones(calls);
  return {
    students,
    teams,
    repositories: createRepositories(teams),
    milestones,
    submissions: createSubmissions(teams, milestones),
    users: createManagedUsers(students),
    calls,
    activity: createActivity(teams),
    audit: [
      createAudit("system", "seed", "dense challenge portal fixtures"),
      createAudit("staff", "opened call", "2026 OSS 해커톤"),
      createAudit("admin", "set api mode normal", "GitHub API monitor"),
    ],
    apiMode: "normal",
  };
}

function createStudents(): readonly Student[] {
  return Array.from({ length: 30 }, (_, index): Student => {
    const number = index + 1;
    return {
      id: `stu-${number}`,
      name: `전남학생 ${number}`,
      studentNo: `20${26 - (number % 4)}${String(number).padStart(4, "0")}`,
      github: `jnu-oss-${number}`,
      email: `student${number}@jnu.ac.kr`,
      phone: `010-${String(3400 + number).padStart(4, "0")}-${String(8800 + number).padStart(4, "0")}`,
      commits: 28 + number * 7,
      prs: 3 + (number % 9),
      stars: number % 6,
      repos: 1 + (number % 5),
      lastActive: `2026-0${1 + (number % 6)}-${String(10 + (number % 18)).padStart(2, "0")}`,
    };
  });
}

function createManagedUsers(students: readonly Student[]): readonly ManagedUser[] {
  const staff: readonly ManagedUser[] = [
    user("staff-1", "사업단 운영자", "staff", "active", "jnu-staff-ops"),
    user("staff-2", "산학 검토자", "staff", "active", "jnu-reviewer"),
    user("admin-1", "시스템 관리자", "admin", "active", "jnu-admin"),
  ];
  return [...staff, ...students.slice(0, 12).map(studentUser)];
}

function studentUser(student: Student): ManagedUser {
  return user(`user-${student.id}`, student.name, "student", "active", student.github);
}

function user(
  id: string,
  name: string,
  role: ManagedUser["role"],
  status: ManagedUser["status"],
  github: string,
): ManagedUser {
  return { id, name, role, status, github, lastSeen: "2026-07-06" };
}

function createTeams(): readonly Team[] {
  return TEAM_ROWS.trim()
    .split("\n")
    .map((row) => {
      const fields = row.split("|");
      return createTeam({
        id: field(fields, 0),
        name: field(fields, 1),
        competitionId: field(fields, 2),
        contest: field(fields, 3),
        members: field(fields, 4)
          .split(",")
          .map((member) => member.trim())
          .filter((member) => member.length > 0),
        commits: numberField(fields, 5),
        prs: numberField(fields, 6),
        stars: numberField(fields, 7),
        repos: numberField(fields, 8),
        status: teamStatus(field(fields, 9)),
      });
    });
}

const TEAM_ROWS = `
team-1|나르샤 OSS|call-1|2026 OSS 해커톤|jnu-oss-1,jnu-oss-7,jnu-oss-12|316|42|31|4|published
team-2|광주 데이터 크루|call-1|2026 OSS 해커톤|jnu-oss-3,jnu-oss-4,jnu-oss-14|284|35|27|3|provisioned
team-3|캡스톤 리눅스 랩|call-2|캡스톤 GitHub 자산화|jnu-oss-1,jnu-oss-2,jnu-oss-18|248|24|18|5|published
team-4|AI README 평가단|call-4|공개 SW 기여 챌린지|jnu-oss-5,jnu-oss-8|210|19|16|2|correction
team-5|오픈캠퍼스 맵|call-1|2026 OSS 해커톤|jnu-oss-6,jnu-oss-9|196|17|13|2|submitted
team-6|클라우드 항해단|call-8|클라우드 네이티브 실습 리그|jnu-oss-1,jnu-oss-10,jnu-oss-11|188|16|11|2|provisioned
team-7|접근성 연구소|call-9|OSS UI 접근성 개선전|jnu-oss-13,jnu-oss-15|142|12|9|1|submitted
team-8|전남 데이터로|call-10|전남 데이터 시각화 경진대회|jnu-oss-16,jnu-oss-17|164|15|8|2|published
team-9|보안 리뷰어스|call-5|보안 취약점 분석 대회|jnu-oss-19,jnu-oss-20|133|11|7|1|correction
team-10|번역 스프린터|call-7|오픈소스 문서 번역 스프린트|jnu-oss-21|120|9|6|1|published
team-11|연구실 홍보단|call-12|연구실 OSS 홍보전|jnu-oss-22,jnu-oss-23|98|7|5|1|provisioned
team-12|모델 서비스로|call-3|AI 모델 서비스 챌린지|jnu-oss-24,jnu-oss-25|76|6|4|1|submitted
`;

function field(fields: readonly string[], index: number): string {
  return fields[index] ?? "";
}

function numberField(fields: readonly string[], index: number): number {
  return Number.parseInt(field(fields, index), 10);
}

function teamStatus(value: string): TeamStatus {
  switch (value) {
    case "correction":
    case "provisioned":
    case "published":
    case "submitted":
      return value;
    default:
      return "submitted";
  }
}

function createTeam(input: SeedTeamInput): Team {
  return {
    ...input,
    repo: `github.com/jnu-sojoong/${slugify(input.name)}`,
    lastActive: "2026-07-02",
    reportState: input.status === "published" ? "submitted" : "draft",
    consentState: input.status === "submitted" ? "missing" : "uploaded",
  };
}

function createRepositories(teams: readonly Team[]): readonly Repository[] {
  return teams.flatMap((team, index) => {
    const primary = repo(team, index, "main", team.status === "published" ? "public" : "private");
    const docs = repo(team, index + 40, "docs", team.status === "published" ? "public" : "private");
    return index < 6 ? [primary, docs] : [primary];
  });
}

function createSubmissions(
  teams: readonly Team[],
  milestones: readonly ProgramMilestone[],
): readonly TeamMilestoneSubmission[] {
  return teams.flatMap((team) =>
    milestones
      .filter((milestoneItem) => milestoneItem.competitionId === team.competitionId)
      .map((milestoneItem) => submission(team, milestoneItem)),
  );
}

function submission(team: Team, milestoneItem: ProgramMilestone): TeamMilestoneSubmission {
  const status = submissionStatus(team.status, milestoneItem.id);
  return {
    id: `${team.id}-${milestoneItem.id}`,
    teamId: team.id,
    milestoneId: milestoneItem.id,
    status,
    submittedAt:
      status === "submitted" || status === "approved" || status === "needs-revision"
        ? team.lastActive
        : undefined,
    reviewerNote:
      status === "needs-revision" ? "README와 라이선스 항목을 보완해 주세요." : undefined,
  };
}

function submissionStatus(teamStatus: TeamStatus, milestoneId: string): MilestoneStatus {
  if (milestoneId.endsWith("-intake")) {
    if (teamStatus === "submitted") return "submitted";
    if (teamStatus === "correction") return "needs-revision";
    return "approved";
  }
  if (milestoneId.endsWith("-repo")) {
    if (teamStatus === "published" || teamStatus === "provisioned") return "approved";
    if (teamStatus === "correction") return "needs-revision";
    return "ready";
  }
  if (teamStatus === "published") return "approved";
  if (teamStatus === "provisioned") return "submitted";
  if (teamStatus === "correction") return "needs-revision";
  return "not-started";
}

function repo(
  team: Team,
  index: number,
  suffix: string,
  visibility: Repository["visibility"],
): Repository {
  const name = `${slugify(team.name)}-${suffix}`;
  return {
    id: `repo-${index + 1}-${suffix}`,
    teamId: team.id,
    competitionId: team.competitionId,
    name,
    url: `github.com/jnu-sojoong/${name}`,
    visibility,
    license: index % 2 === 0 ? "MIT" : "Apache-2.0",
    language: index % 3 === 0 ? "TypeScript" : "Python",
    lastPushed: `2026-07-${String(10 + (index % 15)).padStart(2, "0")}`,
  };
}
