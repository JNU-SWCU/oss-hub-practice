import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FileText,
  Github,
  Plus,
  Send,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Call, StudentApplicationInput } from "../../domain";
import { useUnsavedChangesWarning } from "../CompliancePrimitives";
import {
  clearApplicationDraft,
  includeApplicantGithub,
  initialApplicationDraft,
  loadApplicationDraft,
  parseGithubIds,
  parseTeamSizeRange,
  saveApplicationDraft,
} from "./ApplicationForm.helpers";
import type { TeamMode } from "./ApplicationForm.helpers";
import type { Navigate } from "./shared";

type ApplicationFormProps = {
  readonly competition: Call;
  readonly onApply: (input: StudentApplicationInput) => boolean;
  readonly onNavigate: Navigate;
};

export function ApplicationForm({ competition, onApply, onNavigate }: ApplicationFormProps) {
  const [savedDraft] = useState(() => loadApplicationDraft(competition.id));
  const [teamName, setTeamName] = useState<string>(savedDraft.teamName);
  const [githubIds, setGithubIds] = useState<string>(savedDraft.githubIds);
  const [summary, setSummary] = useState<string>(savedDraft.summary);
  const [teamMode, setTeamMode] = useState<TeamMode>(savedDraft.teamMode);
  const [joinCode, setJoinCode] = useState<string>(savedDraft.joinCode);
  const [error, setError] = useState("");
  const previewIds = includeApplicantGithub(parseGithubIds(githubIds));
  const hasUnsavedApplicationDraft =
    teamName !== initialApplicationDraft.teamName ||
    githubIds !== initialApplicationDraft.githubIds ||
    summary !== initialApplicationDraft.summary ||
    teamMode !== initialApplicationDraft.teamMode ||
    joinCode !== initialApplicationDraft.joinCode;
  useUnsavedChangesWarning(hasUnsavedApplicationDraft);

  useEffect(() => {
    saveApplicationDraft(competition.id, { teamName, githubIds, summary, teamMode, joinCode });
  }, [competition.id, githubIds, joinCode, summary, teamMode, teamName]);

  function handleSubmit(): void {
    const teammateIds = parseGithubIds(githubIds);
    const parsedIds = includeApplicantGithub(teammateIds);
    if (teammateIds.length === 0) {
      setError("팀원 GitHub ID를 1개 이상 입력하세요.");
      return;
    }
    const invalidId = teammateIds.find((value) => !/^[a-zA-Z0-9-]{1,39}$/.test(value));
    if (invalidId !== undefined) {
      setError(`GitHub ID 형식을 확인하세요: ${invalidId}`);
      return;
    }
    if (teamName.trim().length === 0 || summary.trim().length === 0) {
      setError("팀 이름과 작품 설명을 입력해야 합니다.");
      return;
    }
    if (teamMode === "join" && joinCode.trim().length === 0) {
      setError("기존 팀에 합류하려면 참여코드를 입력해야 합니다.");
      return;
    }
    const teamSizeRange = parseTeamSizeRange(competition.teamSize);
    if (teamSizeRange !== undefined) {
      const memberCount = parsedIds.length;
      if (memberCount < teamSizeRange.min || memberCount > teamSizeRange.max) {
        setError(
          `${competition.teamSize} 기준에 맞게 팀원을 입력하세요. 현재 ${memberCount}명입니다.`,
        );
        return;
      }
    }
    setError("");
    const submitted = onApply({
      competitionId: competition.id,
      teamName,
      githubIds: parsedIds,
      teamMode,
      joinCode: teamMode === "join" ? joinCode.trim() : undefined,
    });
    if (!submitted) {
      setError("현재 접수 가능한 프로그램이 아닙니다.");
      return;
    }
    clearApplicationDraft(competition.id);
    onNavigate("/student/dashboard");
  }

  return (
    <main className="page-shell student-flow-page">
      <button
        className="text-link"
        type="button"
        onClick={() => onNavigate(`/competitions/${competition.id}`)}
      >
        <ArrowLeft size={16} />
        상세로 돌아가기
      </button>
      <section className="form-status-grid">
        <form className="form-panel" onSubmit={(event) => event.preventDefault()}>
          <p className="section-kicker">신청 1/3 - 팀 구성 2/3 - 저장소 준비 3/3</p>
          <h1>{competition.title} 참여 공간 만들기</h1>
          <ol className="application-step-list" aria-label="신청 진행 단계">
            <li>
              <strong>1/3 신청 정보</strong>
              <span>기본 정보와 교직원 추가 질문을 확인합니다.</span>
            </li>
            <li>
              <strong>2/3 팀 구성</strong>
              <span>팀 생성 또는 참여코드 합류와 인원 범위를 점검합니다.</span>
            </li>
            <li>
              <strong>3/3 저장소 준비</strong>
              <span>승인 후 JNU-SWCU 저장소 초대 대기 상태로 전환됩니다.</span>
            </li>
          </ol>
          <div className="readonly-grid" aria-label="신청자 기본 정보">
            <Info label="이름" value="전남학생 1" />
            <Info label="학번" value="20260001" />
            <Info label="이메일" value="student1@jnu.ac.kr" />
            <Info label="휴대전화" value="010-3401-8801" />
            <Info label="교직원 추가 항목" value="참여 동기, 공개 동의 확인" />
            <Info label="팀 인원 기준" value={competition.teamSize} />
          </div>
          <section className="project-workspace-card" aria-label="프로젝트 공간 미리보기">
            <div>
              <span>GitHub workspace</span>
              <h2>{teamName.trim().length > 0 ? teamName : "새 프로젝트 공간"}</h2>
              <p>팀원을 초대하고, 승인 후 JNU-SWCU 저장소와 연결할 공간입니다.</p>
            </div>
            <div className="invite-list" aria-label="초대할 팀원">
              {previewIds.map((githubId) => (
                <span className="invite-chip" key={githubId}>
                  <Github size={14} />
                  {githubId}
                </span>
              ))}
              <span className="invite-chip invite-chip-empty">
                <Plus size={14} />
                팀원 추가
              </span>
            </div>
          </section>
          <label>
            <span>팀 이름</span>
            <input value={teamName} onChange={(event) => setTeamName(event.target.value)} />
            <small>프로젝트 공간 이름으로 사용됩니다.</small>
          </label>
          <fieldset className="choice-fieldset">
            <legend>팀 구성 방식</legend>
            <label>
              <input
                type="radio"
                name="team-mode"
                checked={teamMode === "create"}
                onChange={() => setTeamMode("create")}
              />
              새 팀 만들기
            </label>
            <label>
              <input
                type="radio"
                name="team-mode"
                checked={teamMode === "join"}
                onChange={() => setTeamMode("join")}
              />
              참여코드로 합류
            </label>
          </fieldset>
          <label>
            <span>참여코드</span>
            <input value={joinCode} onChange={(event) => setJoinCode(event.target.value)} />
            <small>기존 팀에 합류할 때 교직원 또는 팀장이 공유한 코드를 확인합니다.</small>
          </label>
          <label>
            <span>팀원 GitHub ID</span>
            <input value={githubIds} onChange={(event) => setGithubIds(event.target.value)} />
            <small>신청자 본인은 자동 포함됩니다. 초대할 팀원을 쉼표로 구분합니다.</small>
          </label>
          <label>
            <span>작품 설명 및 참여 동기</span>
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
          </label>
          <div className="file-row">
            <UserPlus size={18} />
            <span>
              생성하면 팀원 초대 요청과 JNU-SWCU 저장소 연결 대기 상태가 함께 만들어집니다.
            </span>
          </div>
          {error.length > 0 ? <p className="error-text">{error}</p> : null}
          <button className="primary-action" type="button" onClick={handleSubmit}>
            <Send size={18} />
            프로젝트 공간 만들기
          </button>
        </form>
        <aside className="status-column">
          <article className="status-card success">
            <CheckCircle2 size={20} />
            <span>대회</span>
            <strong>{competition.title}</strong>
            <p>{competition.deadline}까지 접수 중</p>
          </article>
          <article className="status-card">
            <FileText size={20} />
            <span>개인정보 제공 동의서</span>
            <strong>파일 제출 예정</strong>
            <p>데모에서는 실제 파일 업로드 없이 제출 항목만 표시합니다.</p>
          </article>
          <article className="status-card">
            <ClipboardList size={20} />
            <span>신청폼 계약</span>
            <strong>필수 + 교직원 추가 항목</strong>
            <p>팀 인원, 참여코드, 공개 동의 항목을 화면에서 확인합니다.</p>
          </article>
        </aside>
      </section>
    </main>
  );
}

function Info({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
