import { Check, Circle } from "lucide-react";

export type StudentJourneyStage =
  | "consent"
  | "dashboard"
  | "program"
  | "application"
  | "repository";

type StudentJourneyProps = {
  readonly current: StudentJourneyStage;
};

const journeySteps = [
  {
    id: "consent",
    label: "로그인과 동의",
    description: "학생 화면 접근과 GitHub 활동 정보 이용 동의",
  },
  {
    id: "dashboard",
    label: "현재 상태 확인",
    description: "이미 신청한 팀, 배정 저장소, 보완 요청 확인",
  },
  {
    id: "program",
    label: "프로그램 선택",
    description: "목록 신청, 외부 프로그램 등록, 진행 중 활동 연결 중 선택",
  },
  {
    id: "application",
    label: "팀 정보 제출",
    description: "팀명과 GitHub ID를 제출하거나 기존 저장소를 연결",
  },
  {
    id: "repository",
    label: "저장소 시작",
    description: "신규 배정 또는 기존 GitHub 저장소 확인",
  },
] as const satisfies readonly {
  readonly id: StudentJourneyStage;
  readonly label: string;
  readonly description: string;
}[];

const journeyStepIndex: Record<StudentJourneyStage, number> = {
  consent: 0,
  dashboard: 1,
  program: 2,
  application: 3,
  repository: 4,
};

export function StudentJourney({ current }: StudentJourneyProps) {
  const currentIndex = journeyStepIndex[current];

  return (
    <nav className="student-journey" aria-label="학생 시작 흐름">
      <div className="student-journey-heading">
        <div>
          <p className="section-kicker">학생 참여 경로</p>
          <h2>내 상황에 맞는 참여 방법</h2>
          <p>
            기본 경로는 사업단 프로그램을 선택해 신청하는 방식입니다. 이미 활동 중이거나 목록에 없는
            외부 프로그램이면 GitHub 저장소를 먼저 연결해 등록할 수 있습니다.
          </p>
        </div>
        <span>현재 위치 {currentIndex + 1}</span>
      </div>
      <ol>
        {journeySteps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <li
              aria-current={isCurrent ? "step" : undefined}
              className={isCurrent ? "is-current" : undefined}
              key={step.id}
            >
              <span className="journey-marker" aria-hidden="true">
                {isComplete ? <Check size={14} /> : <Circle size={12} />}
              </span>
              <span>
                <strong>{step.label}</strong>
                <small>{isComplete ? "확인됨" : isCurrent ? "현재 화면" : step.description}</small>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="journey-options" aria-label="학생 참여 대체 경로">
        <article>
          <strong>기존 GitHub가 있으면</strong>
          <span>저장소 URL과 팀 GitHub ID를 제출해서 기존 활동을 연결합니다.</span>
        </article>
        <article>
          <strong>외부 프로그램이면</strong>
          <span>목록에 없는 활동을 직접 등록하고 검토 큐에 올립니다.</span>
        </article>
        <article>
          <strong>이미 진행 중이면</strong>
          <span>프로그램 선택을 건너뛰고 진행 중 활동/저장소 기준으로 상태를 만듭니다.</span>
        </article>
      </div>
    </nav>
  );
}
