export type SetupStepId = "role" | "profile" | "github" | "consent" | "start";

export type GithubPreference = "import" | "later";

export type StudentStartChoice = "program" | "existing";

export const studentStartDestinations = {
  program: "/competitions?status=open",
  existing: "/student/dashboard",
} as const satisfies Record<StudentStartChoice, string>;

export const githubPreferenceOptions = [
  {
    id: "import",
    title: "GitHub 기록 불러오기",
    description: "기존 저장소나 활동 기록을 기준으로 이어갈 수 있는지 먼저 확인합니다.",
  },
  {
    id: "later",
    title: "나중에 직접 입력하기",
    description: "지금은 계정 기록을 불러오지 않고, 필요한 시점에 GitHub ID를 직접 제출합니다.",
  },
] as const satisfies readonly {
  readonly id: GithubPreference;
  readonly title: string;
  readonly description: string;
}[];

export const studentStartChoiceOptions = [
  {
    id: "program",
    label: "새 프로그램",
    title: "접수 중인 프로그램 보기",
    description: "신청할 항목이 있을 때 프로그램 목록으로 이동합니다.",
  },
  {
    id: "existing",
    label: "진행 중인 활동",
    title: "내 활동과 저장소 상태 확인",
    description: "이미 신청했거나 불러온 활동을 이어서 관리합니다.",
  },
] as const satisfies readonly {
  readonly id: StudentStartChoice;
  readonly label: string;
  readonly title: string;
  readonly description: string;
}[];

export type SetupStep = {
  readonly id: SetupStepId;
  readonly label: string;
  readonly description: string;
};

export type SetupReadiness = {
  readonly roleConfirmed: boolean;
  readonly profileConfirmed: boolean;
  readonly githubConfirmed: boolean;
  readonly consented: boolean;
  readonly startSelected: boolean;
};

export type CurrentStepReadiness = {
  readonly roleConfirmed: boolean;
  readonly profileIsReady: boolean;
  readonly githubIsReady: boolean;
  readonly consented: boolean;
  readonly startSelected: boolean;
};

type SetupReachability = Omit<SetupReadiness, "startSelected">;

export const setupSteps = [
  {
    id: "role",
    label: "역할 확인",
    description: "학생 화면에서 첫 참여 설정을 진행합니다.",
  },
  {
    id: "profile",
    label: "기본 정보",
    description: "신청 화면에 사용할 이름과 소속을 확인합니다.",
  },
  {
    id: "github",
    label: "GitHub 연결",
    description: "저장소 초대에 쓸 GitHub ID를 확인합니다.",
  },
  {
    id: "consent",
    label: "정보 이용 동의",
    description: "신청과 저장소 안내에 필요한 정보 이용에 동의합니다.",
  },
  {
    id: "start",
    label: "다음 화면 선택",
    description: "이어갈 화면을 고릅니다.",
  },
] as const satisfies readonly SetupStep[];

export const githubIdPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export function isCurrentStepReady(step: SetupStepId, readiness: CurrentStepReadiness): boolean {
  switch (step) {
    case "role":
      return true;
    case "profile":
      return readiness.profileIsReady;
    case "github":
      return readiness.githubIsReady;
    case "consent":
      return readiness.consented;
    case "start":
      return readiness.startSelected;
    default:
      return assertNever(step);
  }
}

export function isSetupStepComplete(step: SetupStepId, readiness: SetupReadiness): boolean {
  switch (step) {
    case "role":
      return readiness.roleConfirmed;
    case "profile":
      return readiness.profileConfirmed;
    case "github":
      return readiness.githubConfirmed;
    case "consent":
      return readiness.consented;
    case "start":
      return readiness.startSelected;
    default:
      return assertNever(step);
  }
}

export function isSetupStepReachable(step: SetupStepId, readiness: SetupReachability): boolean {
  switch (step) {
    case "role":
      return true;
    case "profile":
      return readiness.roleConfirmed;
    case "github":
      return readiness.roleConfirmed && readiness.profileConfirmed;
    case "consent":
      return readiness.roleConfirmed && readiness.profileConfirmed && readiness.githubConfirmed;
    case "start":
      return (
        readiness.roleConfirmed &&
        readiness.profileConfirmed &&
        readiness.githubConfirmed &&
        readiness.consented
      );
    default:
      return assertNever(step);
  }
}

export function actionLabelForStep(step: SetupStepId): string {
  switch (step) {
    case "role":
      return "학생 역할로 계속";
    case "profile":
      return "기본 정보 저장하고 계속";
    case "github":
      return "GitHub 정보 확인하고 계속";
    case "consent":
      return "참여 시작 선택으로 계속";
    case "start":
      return "선택한 화면으로 이동";
    default:
      return assertNever(step);
  }
}

export function previousStepFor(step: SetupStepId): SetupStepId | undefined {
  switch (step) {
    case "role":
      return undefined;
    case "profile":
      return "role";
    case "github":
      return "profile";
    case "consent":
      return "github";
    case "start":
      return "consent";
    default:
      return assertNever(step);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unexpected setup step: ${value}`);
}
