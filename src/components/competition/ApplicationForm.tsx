import { ArrowLeft, CheckCircle2, FileText, Github, Send } from "lucide-react";
import { useState } from "react";
import type { Call, StudentApplicationInput } from "../../domain";
import type { Navigate } from "./shared";

type ApplicationFormProps = {
  readonly competition: Call;
  readonly onApply: (input: StudentApplicationInput) => void;
  readonly onNavigate: Navigate;
};

export function ApplicationForm({ competition, onApply, onNavigate }: ApplicationFormProps) {
  const [teamName, setTeamName] = useState("해커톤 새싹 팀");
  const [githubIds, setGithubIds] = useState("jnu-alpha, jnu-beta");
  const [summary, setSummary] = useState(
    "전남대학교 학생들이 교과/비교과 활동에서 만든 OSS 산출물을 저장소로 공개합니다.",
  );
  const [error, setError] = useState("");

  function handleSubmit(): void {
    const parsedIds = githubIds
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    if (parsedIds.length === 0) {
      setError("팀원 GitHub ID를 1개 이상 입력하세요.");
      return;
    }
    const invalidId = parsedIds.find((value) => !/^[a-zA-Z0-9-]{1,39}$/.test(value));
    if (invalidId !== undefined) {
      setError(`GitHub ID 형식을 확인하세요: ${invalidId}`);
      return;
    }
    if (teamName.trim().length === 0 || summary.trim().length === 0) {
      setError("팀 이름과 작품 설명을 입력해야 합니다.");
      return;
    }
    setError("");
    onApply({ competitionId: competition.id, teamName, githubIds: parsedIds });
    onNavigate("/student/dashboard");
  }

  return (
    <main className="page-shell">
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
          <p className="section-kicker">학생 신청서</p>
          <h1>{competition.title} 신청</h1>
          <div className="readonly-grid" aria-label="신청자 기본 정보">
            <Info label="이름" value="전남학생 1" />
            <Info label="학번" value="20260001" />
            <Info label="이메일" value="student1@jnu.ac.kr" />
            <Info label="휴대전화" value="010-3401-8801" />
          </div>
          <label>
            <span>팀 이름</span>
            <input value={teamName} onChange={(event) => setTeamName(event.target.value)} />
          </label>
          <label>
            <span>팀원 GitHub ID</span>
            <input value={githubIds} onChange={(event) => setGithubIds(event.target.value)} />
            <small>쉼표로 구분합니다. 예: jnu-alpha, jnu-beta</small>
          </label>
          <label>
            <span>작품 설명</span>
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
          </label>
          <div className="file-row">
            <Github size={18} />
            <span>제출 시 GitHub ID 형식을 확인하고 팀 저장소 배정 대기 상태를 만듭니다.</span>
          </div>
          {error.length > 0 ? <p className="error-text">{error}</p> : null}
          <button className="primary-action" type="button" onClick={handleSubmit}>
            <Send size={18} />
            신청서 제출
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
