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
  { id: "consent", label: "로그인과 동의" },
  { id: "dashboard", label: "내 대시보드" },
  { id: "program", label: "프로그램 선택" },
  { id: "application", label: "신청과 팀" },
  { id: "repository", label: "저장소 시작" },
] as const satisfies readonly { readonly id: StudentJourneyStage; readonly label: string }[];

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
        <p className="section-kicker">학생 시작 흐름</p>
        <span>
          {currentIndex + 1}/{journeySteps.length}
        </span>
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
                <small>{isComplete ? "완료" : isCurrent ? "현재 단계" : "다음 단계"}</small>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
