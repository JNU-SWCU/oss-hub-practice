import { Check, Circle } from "lucide-react";
import { useState } from "react";
import {
  actionLabelForStep,
  githubIdPattern,
  isCurrentStepReady,
  isSetupStepComplete,
  isSetupStepReachable,
  previousStepFor,
  setupSteps,
} from "./StudentSetupPage.model";
import type { GithubPreference, SetupStepId, StudentStartChoice } from "./StudentSetupPage.model";
import { StudentSetupStepPanels } from "./StudentSetupStepPanels";

type StudentSetupPageProps = {
  readonly onComplete: (choice: StudentStartChoice) => void;
};

export function StudentSetupPage({ onComplete }: StudentSetupPageProps) {
  const [currentStep, setCurrentStep] = useState<SetupStepId>("role");
  const [roleConfirmed, setRoleConfirmed] = useState(false);
  const [displayName, setDisplayName] = useState("학생 시연 사용자");
  const [affiliation, setAffiliation] = useState("컴퓨터정보통신공학과");
  const [profileConfirmed, setProfileConfirmed] = useState(false);
  const [githubId, setGithubId] = useState("jnu-student");
  const [githubConfirmed, setGithubConfirmed] = useState(false);
  const [githubPreference, setGithubPreference] = useState<GithubPreference>("import");
  const [githubStepConfirmed, setGithubStepConfirmed] = useState(false);
  const [consented, setConsented] = useState(false);
  const [startChoice, setStartChoice] = useState<StudentStartChoice | undefined>(undefined);

  const profileIsReady = displayName.trim().length > 0 && affiliation.trim().length > 0;
  const githubIsReady =
    githubPreference === "later" || (githubIdPattern.test(githubId.trim()) && githubConfirmed);
  const currentStepIsReady = isCurrentStepReady(currentStep, {
    roleConfirmed,
    profileIsReady,
    githubIsReady,
    consented,
    startSelected: startChoice !== undefined,
  });

  function moveNext(): void {
    switch (currentStep) {
      case "role":
        setRoleConfirmed(true);
        setCurrentStep("profile");
        return;
      case "profile":
        if (profileIsReady) {
          setProfileConfirmed(true);
          setCurrentStep("github");
        }
        return;
      case "github":
        if (githubIsReady) {
          setGithubStepConfirmed(true);
          setCurrentStep("consent");
        }
        return;
      case "consent":
        if (consented) setCurrentStep("start");
        return;
      case "start":
        if (startChoice !== undefined) onComplete(startChoice);
        return;
      default:
        assertNever(currentStep);
    }
  }

  function movePrevious(): void {
    const previousStep = previousStepFor(currentStep);
    if (previousStep !== undefined) setCurrentStep(previousStep);
  }

  return (
    <main className="page-shell student-flow-page student-setup-page">
      <header className="setup-header">
        <p className="section-kicker">학생 전용 첫 참여 설정</p>
        <h1>대시보드에 들어가기 전에 필요한 정보만 확인합니다</h1>
        <p>
          실제 가입 절차가 아니라 practice repo 시연을 위한 준비 화면입니다. 역할, 기본 정보, GitHub
          기록 사용 방식, 정보 이용 동의를 정리한 뒤 이어서 확인할 화면을 직접 고릅니다.
        </p>
      </header>

      <section className="setup-layout">
        <nav className="setup-stepper" aria-label="첫 참여 설정 진행">
          <ol>
            {setupSteps.map((step) => {
              const isCurrent = step.id === currentStep;
              const isComplete = isSetupStepComplete(step.id, {
                roleConfirmed,
                profileConfirmed,
                githubConfirmed: githubStepConfirmed,
                consented,
                startSelected: startChoice !== undefined,
              });
              const isReachable = isSetupStepReachable(step.id, {
                roleConfirmed,
                profileConfirmed,
                githubConfirmed: githubStepConfirmed,
                consented,
              });
              return (
                <li className={isCurrent ? "is-current" : undefined} key={step.id}>
                  <button
                    type="button"
                    aria-current={isCurrent ? "step" : undefined}
                    disabled={!isReachable}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <span className="setup-step-marker" aria-hidden="true">
                      {isComplete ? <Check size={14} /> : <Circle size={12} />}
                    </span>
                    <span>
                      <strong>{step.label}</strong>
                      <small>{isComplete ? "확인됨" : step.description}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <section className="setup-panel" aria-live="polite">
          <StudentSetupStepPanels
            currentStep={currentStep}
            displayName={displayName}
            affiliation={affiliation}
            githubId={githubId}
            githubConfirmed={githubConfirmed}
            githubPreference={githubPreference}
            consented={consented}
            startChoice={startChoice}
            profileIsReady={profileIsReady}
            setDisplayName={setDisplayName}
            setAffiliation={setAffiliation}
            setProfileConfirmed={setProfileConfirmed}
            setGithubId={setGithubId}
            setGithubConfirmed={setGithubConfirmed}
            setGithubStepConfirmed={setGithubStepConfirmed}
            setGithubPreference={setGithubPreference}
            setConsented={setConsented}
            setStartChoice={setStartChoice}
          />

          <div className="setup-actions">
            <button
              className="ghost-action"
              type="button"
              onClick={movePrevious}
              disabled={currentStep === "role"}
            >
              이전 단계
            </button>
            <button
              className="primary-action"
              type="button"
              onClick={moveNext}
              disabled={!currentStepIsReady}
            >
              {actionLabelForStep(currentStep)}
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

function assertNever(value: never): never {
  throw new Error(`Unexpected setup step: ${value}`);
}
