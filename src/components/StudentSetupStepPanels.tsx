import { CheckCircle2, Github, Route, ShieldCheck, UserRound } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import {
  githubIdPattern,
  githubPreferenceOptions,
  studentStartChoiceOptions,
} from "./StudentSetupPage.model";
import type { GithubPreference, SetupStepId, StudentStartChoice } from "./StudentSetupPage.model";

type StudentSetupStepPanelsProps = {
  readonly currentStep: SetupStepId;
  readonly displayName: string;
  readonly affiliation: string;
  readonly githubId: string;
  readonly githubConfirmed: boolean;
  readonly githubPreference: GithubPreference;
  readonly consented: boolean;
  readonly startChoice: StudentStartChoice | undefined;
  readonly profileIsReady: boolean;
  readonly setDisplayName: Dispatch<SetStateAction<string>>;
  readonly setAffiliation: Dispatch<SetStateAction<string>>;
  readonly setProfileConfirmed: Dispatch<SetStateAction<boolean>>;
  readonly setGithubId: Dispatch<SetStateAction<string>>;
  readonly setGithubConfirmed: Dispatch<SetStateAction<boolean>>;
  readonly setGithubStepConfirmed: Dispatch<SetStateAction<boolean>>;
  readonly setGithubPreference: Dispatch<SetStateAction<GithubPreference>>;
  readonly setConsented: Dispatch<SetStateAction<boolean>>;
  readonly setStartChoice: Dispatch<SetStateAction<StudentStartChoice | undefined>>;
};

export function StudentSetupStepPanels(input: StudentSetupStepPanelsProps) {
  switch (input.currentStep) {
    case "role":
      return <RoleStepPanel />;
    case "profile":
      return <ProfileStepPanel input={input} />;
    case "github":
      return <GithubStepPanel input={input} />;
    case "consent":
      return <ConsentStepPanel input={input} />;
    case "start":
      return <StartStepPanel input={input} />;
    default:
      return assertNever(input.currentStep);
  }
}

function RoleStepPanel() {
  return (
    <div className="setup-step-content">
      <UserRound size={24} aria-hidden="true" />
      <div>
        <p className="section-kicker">1단계</p>
        <h2>학생 역할로 진행합니다</h2>
        <p>
          이 설정은 학생 persona에서만 보입니다. 교직원, 관리자, 외부인은 각자 역할 화면으로 바로
          들어가고 이 단계를 거치지 않습니다.
        </p>
      </div>
      <div className="setup-readonly-row">
        <span>현재 역할</span>
        <strong>학생</strong>
      </div>
    </div>
  );
}

function ProfileStepPanel({ input }: { readonly input: StudentSetupStepPanelsProps }) {
  return (
    <div className="setup-step-content">
      <UserRound size={24} aria-hidden="true" />
      <div>
        <p className="section-kicker">2단계</p>
        <h2>신청서에 표시할 기본 정보를 확인합니다</h2>
        <p>민감한 개인정보는 받지 않고, 화면 시연에 필요한 이름과 소속만 사용합니다.</p>
      </div>
      <label className="setup-field">
        <span>이름</span>
        <input
          value={input.displayName}
          onChange={(event) => {
            input.setDisplayName(event.target.value);
            input.setProfileConfirmed(false);
          }}
        />
      </label>
      <label className="setup-field">
        <span>소속/학과</span>
        <input
          value={input.affiliation}
          onChange={(event) => {
            input.setAffiliation(event.target.value);
            input.setProfileConfirmed(false);
          }}
        />
      </label>
      {!input.profileIsReady ? (
        <p className="setup-error">이름과 소속을 모두 입력해 주세요.</p>
      ) : null}
    </div>
  );
}

function GithubStepPanel({ input }: { readonly input: StudentSetupStepPanelsProps }) {
  const usesImport = input.githubPreference === "import";
  const githubIdIsValid = githubIdPattern.test(input.githubId.trim());

  return (
    <div className="setup-step-content">
      <Github size={24} aria-hidden="true" />
      <div>
        <p className="section-kicker">3단계</p>
        <h2>GitHub 기록을 지금 불러올지 선택합니다</h2>
        <p>
          실제 OAuth 연결은 하지 않습니다. practice 시연에서는 기존 활동을 참고할지, 나중에 직접
          입력할지만 고릅니다.
        </p>
      </div>
      <fieldset className="setup-choice-grid">
        <legend>GitHub 확인 방식</legend>
        {githubPreferenceOptions.map((option) => (
          <label className="setup-choice-card" key={option.id}>
            <input
              type="radio"
              name="github-preference"
              checked={input.githubPreference === option.id}
              onChange={() => {
                input.setGithubPreference(option.id);
                input.setGithubStepConfirmed(false);
              }}
            />
            <span>
              <strong>{option.title}</strong>
              <small>{option.description}</small>
            </span>
          </label>
        ))}
      </fieldset>
      {usesImport ? (
        <>
          <label className="setup-field">
            <span>GitHub ID</span>
            <input
              value={input.githubId}
              onChange={(event) => {
                input.setGithubId(event.target.value);
                input.setGithubStepConfirmed(false);
              }}
            />
          </label>
          <label className="setup-check">
            <input
              type="checkbox"
              checked={input.githubConfirmed}
              onChange={(event) => {
                input.setGithubConfirmed(event.target.checked);
                input.setGithubStepConfirmed(false);
              }}
            />
            <span>GitHub ID를 확인했습니다</span>
          </label>
          {!githubIdIsValid ? (
            <p className="setup-error">영문, 숫자, 하이픈만 사용하고 39자 이내로 입력해 주세요.</p>
          ) : null}
        </>
      ) : (
        <div className="setup-readonly-row">
          <span>입력 방식</span>
          <strong>필요할 때 직접 제출</strong>
        </div>
      )}
    </div>
  );
}

function ConsentStepPanel({ input }: { readonly input: StudentSetupStepPanelsProps }) {
  return (
    <div className="setup-step-content">
      <ShieldCheck size={24} aria-hidden="true" />
      <div>
        <p className="section-kicker">4단계</p>
        <h2>활동 정보 이용에 동의해 주세요</h2>
        <p>
          대회 신청, 팀 저장소 연결, 제출 현황 안내에 필요한 정보만 사용합니다. 공개 전환은 제출 후
          교직원 검토를 거쳐 별도로 진행됩니다.
        </p>
      </div>
      <label className="setup-check">
        <input
          type="checkbox"
          checked={input.consented}
          onChange={(event) => input.setConsented(event.target.checked)}
        />
        <span>개인정보 수집과 GitHub 활동 이용에 동의합니다</span>
      </label>
    </div>
  );
}

function StartStepPanel({ input }: { readonly input: StudentSetupStepPanelsProps }) {
  return (
    <div className="setup-step-content">
      <Route size={24} aria-hidden="true" />
      <div>
        <p className="section-kicker">5단계</p>
        <h2>다음에 확인할 화면을 선택합니다</h2>
        <p>
          프로그램 신청은 지금 하지 않아도 됩니다. 내 상황에 맞는 화면을 고르면 바로 이동합니다.
        </p>
      </div>
      <fieldset className="setup-choice-grid setup-start-grid">
        <legend>이동할 화면</legend>
        {studentStartChoiceOptions.map((option) => (
          <label className="setup-choice-card" key={option.id}>
            <input
              type="radio"
              name="student-start-choice"
              checked={input.startChoice === option.id}
              onChange={() => input.setStartChoice(option.id)}
            />
            <span>
              <small>{option.label}</small>
              <strong>{option.title}</strong>
              <small>{option.description}</small>
            </span>
          </label>
        ))}
      </fieldset>
      <div className="setup-readonly-row setup-start-note">
        <CheckCircle2 size={18} aria-hidden="true" />
        <strong>외부 활동은 여기서 고르지 않습니다. 필요하면 프로그램 화면에서 확인합니다.</strong>
      </div>
    </div>
  );
}

function assertNever(value: never): never {
  throw new Error(`Unexpected setup step: ${value}`);
}
