import type {
  ActivityEvent,
  Call,
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

function createMilestones(calls: readonly Call[]): readonly ProgramMilestone[] {
  return calls.flatMap((call): readonly ProgramMilestone[] => {
    const isFullLoop =
      call.id === "call-1" || call.id === "call-4" || call.id === "call-8" || call.id === "call-10";
    const intakeMilestones: readonly ProgramMilestone[] = [
      milestone(
        call.id,
        "intake",
        "신청서/팀 확정",
        "2026-08-15",
        "text",
        "팀 이름, 팀원 GitHub ID, 동의 상태를 확정합니다.",
      ),
    ];
    if (!isFullLoop) return intakeMilestones;
    return [
      ...intakeMilestones,
      milestone(
        call.id,
        "repo",
        "Repo 초대",
        "2026-08-27",
        "repo-tag",
        "GitHub 저장소 초대와 기본 README 상태를 확인합니다.",
      ),
      milestone(
        call.id,
        "final",
        "최종 산출물",
        "2026-08-29",
        "release",
        "README, 라이선스, 제출 URL을 최종 검토합니다.",
      ),
    ];
  });
}

function milestone(
  competitionId: string,
  slug: string,
  name: string,
  dueDate: string,
  deliverableType: ProgramMilestone["deliverableType"],
  guide: string,
): ProgramMilestone {
  return {
    id: `${competitionId}-${slug}`,
    competitionId,
    name,
    dueDate,
    deliverableType,
    guide,
    gate: slug === "intake" ? "intake" : "full-loop",
  };
}

function createCompetitions(): readonly Call[] {
  return [
    call("call-1", "2026 OSS 해커톤", "open", "2026-08-20", 18, ["OSS", "해커톤", "GitHub"]),
    call("call-2", "캡스톤 GitHub 자산화", "open", "2026-09-12", 11, ["캡스톤", "문서화"]),
    call("call-3", "AI 모델 서비스 챌린지", "upcoming", "2026-10-05", 0, ["AI", "서비스"]),
    call("call-4", "공개 SW 기여 챌린지", "active", "2026-07-30", 22, ["기여", "PR"]),
    call("call-5", "보안 취약점 분석 대회", "reviewing", "2026-07-15", 9, ["보안", "리뷰"]),
    call("call-6", "지역 문제 데이터톤", "closed", "2026-06-20", 16, ["데이터", "분석"]),
    call("call-7", "오픈소스 문서 번역 스프린트", "always", "상시", 7, ["문서", "상시"]),
    call("call-8", "클라우드 네이티브 실습 리그", "open", "2026-08-31", 13, ["클라우드", "DevOps"]),
    call("call-9", "OSS UI 접근성 개선전", "upcoming", "2026-11-01", 0, ["접근성", "프론트엔드"]),
    call("call-10", "전남 데이터 시각화 경진대회", "active", "2026-08-08", 14, [
      "데이터",
      "시각화",
    ]),
    call("call-11", "2025 공개 SW 기여 아카이브", "closed", "2025-12-20", 24, ["아카이브", "기여"]),
    call("call-12", "연구실 OSS 홍보전", "always", "상시", 6, ["교육", "홍보"]),
  ];
}

function call(
  id: string,
  title: string,
  status: Call["status"],
  deadline: string,
  teamCount: number,
  category: readonly string[],
): Call {
  const isExternalProgram = id === "call-2";
  return {
    id,
    title,
    summary: `${title} 참여 팀을 모집하고 GitHub 저장소, 규칙, 제출 현황을 한 화면에서 관리합니다.`,
    host: isExternalProgram ? "전남대학교 SW산학협력센터" : "전남대학교 소프트웨어중심대학사업단",
    category,
    period: status === "always" ? "상시 운영" : `2026-07-06 - ${deadline}`,
    deadline,
    teamSize: id === "call-7" || id === "call-12" ? "개인 가능" : "2-4명",
    eligibility: isExternalProgram ? "캡스톤 참여 학생" : "전남대학교 재학생",
    outputType: category.includes("데이터") ? "분석 리포트" : "공개 저장소",
    reviewBasis: "신청서, GitHub ID, README, 라이선스, 활동 로그",
    visibility: id === "call-2" || id === "call-5" ? "internal" : "public",
    status,
    teamCount,
    materials: ["참가 안내", "규칙/평가표", "저장소 템플릿"],
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
team-3|캡스톤 리눅스 랩|call-2|캡스톤 GitHub 자산화|jnu-oss-2,jnu-oss-18|248|24|18|5|published
team-4|AI README 평가단|call-4|공개 SW 기여 챌린지|jnu-oss-5,jnu-oss-8|210|19|16|2|correction
team-5|오픈캠퍼스 맵|call-1|2026 OSS 해커톤|jnu-oss-6,jnu-oss-9|196|17|13|2|submitted
team-6|클라우드 항해단|call-8|클라우드 네이티브 실습 리그|jnu-oss-10,jnu-oss-11|188|16|11|2|provisioned
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

function createActivity(teams: readonly Team[]): readonly ActivityEvent[] {
  return Array.from({ length: 120 }, (_, index): ActivityEvent => {
    const team = teams[index % teams.length];
    const fallback = teams[0];
    const selectedTeam = team ?? fallback;
    const actorGithub = selectedTeam?.members[index % selectedTeam.members.length] ?? "jnu-oss-1";
    return {
      id: `activity-${index + 1}`,
      teamId: selectedTeam?.id ?? "team-1",
      competitionId: selectedTeam?.competitionId ?? "call-1",
      actorGithub,
      kind: activityKind(index),
      count: 1 + (index % 9),
      occurredAt: `2026-07-${String(1 + (index % 28)).padStart(2, "0")}`,
    };
  });
}

function activityKind(index: number): ActivityEvent["kind"] {
  const kinds: readonly ActivityEvent["kind"][] = [
    "commit",
    "pull_request",
    "issue",
    "review",
    "publish",
  ];
  return kinds[index % kinds.length] ?? "commit";
}
