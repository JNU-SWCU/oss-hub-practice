import {
  BarChart3,
  Check,
  ClipboardList,
  FileCheck2,
  ListChecks,
  Mail,
  PlusCircle,
  RotateCcw,
  Settings2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  type DemoState,
  type ProgramDraftInput,
  milestoneStatusLabel,
  submissionForMilestone,
} from "../domain";

type StaffWorkspaceProps = {
  readonly state: DemoState;
  readonly onApproveTeam: (teamId: string) => void;
  readonly onRequestCorrection: (teamId: string, reason: string) => void;
  readonly onPublishTeam: (teamId: string) => void;
  readonly onCreateProgramDraft: (input: ProgramDraftInput) => void;
};

export function StaffWorkspace({
  state,
  onApproveTeam,
  onRequestCorrection,
  onPublishTeam,
  onCreateProgramDraft,
}: StaffWorkspaceProps) {
  const [programTitle, setProgramTitle] = useState("OSS 실전 배포 챌린지");
  const [deadline, setDeadline] = useState("2026-09-20");
  const [categoryText, setCategoryText] = useState("배포, GitHub, Vercel");
  const [outputType, setOutputType] = useState("Vercel 배포 URL");
  const reviewTargets = state.teams.filter(
    (team) =>
      team.status === "submitted" || team.status === "correction" || team.status === "provisioned",
  );
  const selectedProgram = state.calls[0];
  const selectedProgramTeams =
    selectedProgram === undefined
      ? []
      : state.teams.filter((team) => team.competitionId === selectedProgram.id);
  const selectedProgramMilestones =
    selectedProgram === undefined
      ? []
      : state.milestones.filter((milestone) => milestone.competitionId === selectedProgram.id);
  const blockedSubmissionCount = state.submissions.filter(
    (submission) => submission.status === "needs-revision",
  ).length;

  function handleCreateProgram(): void {
    const categories = categoryText
      .split(",")
      .map((category) => category.trim())
      .filter((category) => category.length > 0);
    onCreateProgramDraft({
      title: programTitle,
      host: "전남대학교 소프트웨어중심대학사업단",
      category: categories,
      deadline,
      outputType,
    });
  }

  return (
    <div className="workspace-grid">
      <div className="workspace-intro page-header">
        <p className="section-kicker">교직원 운영</p>
        <h2>교직원 공모 운영 및 검토</h2>
        <p>
          교직원은 대회 접수 현황, 제출 동의서/보고서 상태, 저장소 배정 상태, 자산화 후보를 한 번에
          점검합니다. 공지는 사업단 홈페이지가 담당하고, 이 화면은 접수와 GitHub 수합을 담당합니다.
        </p>
        <div className="notice-banner">
          교직원은 학교 계정 로그인을 가정합니다. 현재 화면은 프론트엔드 시연용 데이터로만
          동작합니다.
        </div>
      </div>
      <div className="metric-grid">
        <MetricCard
          icon={<ClipboardList size={18} />}
          label="총 신청 팀"
          value={`${state.calls[0]?.teamCount ?? 0}팀`}
        />
        <MetricCard
          icon={<FileCheck2 size={18} />}
          label="검토 대기"
          value={`${reviewTargets.length}건`}
        />
        <MetricCard icon={<BarChart3 size={18} />} label="자산화 후보" value="4건" />
      </div>
      <section className="program-ops-grid span-wide" aria-label="사업단 프로그램 생성과 관리">
        <form className="form-panel" onSubmit={(event) => event.preventDefault()}>
          <p className="section-kicker">
            <PlusCircle size={15} />
            프로그램 생성
          </p>
          <h3>새 사업단 프로그램 초안</h3>
          <label>
            <span>프로그램명</span>
            <input value={programTitle} onChange={(event) => setProgramTitle(event.target.value)} />
          </label>
          <label>
            <span>마감일</span>
            <input value={deadline} onChange={(event) => setDeadline(event.target.value)} />
          </label>
          <label>
            <span>카테고리</span>
            <input value={categoryText} onChange={(event) => setCategoryText(event.target.value)} />
            <small>쉼표로 구분합니다. 예: 배포, GitHub, Vercel</small>
          </label>
          <label>
            <span>산출물</span>
            <input value={outputType} onChange={(event) => setOutputType(event.target.value)} />
          </label>
          <button className="primary-action" type="button" onClick={handleCreateProgram}>
            <PlusCircle size={18} />
            프로그램 초안 만들기
          </button>
        </form>
        <div className="table-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">
                <Settings2 size={15} />
                프로그램 관리
              </p>
              <h3>운영 프로그램 현황</h3>
              <p>초안은 예정 상태로 추가되고, 학생/외부인 화면의 프로그램 카드에도 반영됩니다.</p>
            </div>
          </div>
          <div className="table-scroll">
            <table aria-label="교직원 프로그램 관리 목록">
              <thead>
                <tr>
                  <th>프로그램</th>
                  <th>상태</th>
                  <th>마감</th>
                  <th>신청 팀</th>
                  <th>공개 범위</th>
                </tr>
              </thead>
              <tbody>
                {state.calls.slice(0, 6).map((call) => (
                  <tr key={call.id}>
                    <td data-label="프로그램">{call.title}</td>
                    <td data-label="상태">{programStatusLabel(call.status)}</td>
                    <td data-label="마감">{call.deadline}</td>
                    <td data-label="신청 팀">{call.teamCount}팀</td>
                    <td data-label="공개 범위">
                      {call.visibility === "public" ? "공개" : "내부 운영"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="milestone-ops-grid span-wide" aria-label="교직원 마일스톤 운영">
        <div className="table-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">
                <ListChecks size={15} />
                제출 운영
              </p>
              <h3>팀 x 마일스톤 매트릭스</h3>
              <p>
                {selectedProgram?.title ?? "선택된 프로그램"}의 팀별 제출 상태를 한 번에 확인합니다.
              </p>
            </div>
          </div>
          <div className="table-scroll">
            <table aria-label="팀별 마일스톤 제출 매트릭스">
              <thead>
                <tr>
                  <th>팀</th>
                  {selectedProgramMilestones.map((milestone) => (
                    <th key={milestone.id}>{milestone.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedProgramTeams.map((team) => {
                  const teamSubmissions = state.submissions.filter(
                    (submission) => submission.teamId === team.id,
                  );
                  return (
                    <tr key={team.id}>
                      <td data-label="팀">{team.name}</td>
                      {selectedProgramMilestones.map((milestone) => {
                        const submission = submissionForMilestone(teamSubmissions, milestone.id);
                        return (
                          <td data-label={milestone.name} key={milestone.id}>
                            {submission === undefined
                              ? "대기"
                              : milestoneStatusLabel(submission.status)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="table-panel reminder-panel" aria-labelledby="reminder-title">
          <p className="section-kicker">
            <Mail size={15} />
            자동 알림 초안
          </p>
          <h3 id="reminder-title">리마인더 이메일</h3>
          <p>
            마감 3일 전, 마감 당일, 보완 요청 24시간 후에 학생 팀장에게 알림을 보내는 정책을 화면에
            고정했습니다.
          </p>
          <dl className="readonly-grid">
            <div>
              <span>대상 프로그램</span>
              <strong>{selectedProgram?.title ?? "미선택"}</strong>
            </div>
            <div>
              <span>보완 필요</span>
              <strong>{blockedSubmissionCount}건</strong>
            </div>
            <div>
              <span>다음 발송</span>
              <strong>마감 3일 전</strong>
            </div>
            <div>
              <span>채널</span>
              <strong>이메일</strong>
            </div>
          </dl>
        </aside>
      </section>
      <div className="table-panel span-wide">
        <div className="panel-heading">
          <div>
            <h3>신청 검토 큐</h3>
            <p>승인하면 repo 배정 완료 상태가 되고, 보완 요청은 학생 화면에 표시됩니다.</p>
          </div>
        </div>
        <div className="table-scroll">
          <table aria-label="교직원 신청 검토 큐">
            <thead>
              <tr>
                <th>팀</th>
                <th>대회</th>
                <th>보고서</th>
                <th>제출 동의서</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {reviewTargets.map((team) => (
                <tr key={team.id}>
                  <td data-label="팀">{team.name}</td>
                  <td data-label="대회">{team.contest}</td>
                  <td data-label="보고서">{reportStateLabel(team.reportState)}</td>
                  <td data-label="제출 동의서">{consentStateLabel(team.consentState)}</td>
                  <td data-label="상태">{statusLabel(team.status)}</td>
                  <td className="action-cell" data-label="작업">
                    <button type="button" onClick={() => onApproveTeam(team.id)}>
                      <Check size={15} />
                      승인
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onRequestCorrection(
                          team.id,
                          "팀원 GitHub ID와 제출 동의서 metadata를 다시 확인하세요.",
                        )
                      }
                    >
                      <RotateCcw size={15} />
                      보완 요청
                    </button>
                    <button type="button" onClick={() => onPublishTeam(team.id)}>
                      자산 공개
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type MetricCardProps = {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
};

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <div className="metric-card">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: "접수 완료",
    correction: "보완 요청",
    provisioned: "저장소 배정 완료",
    published: "공개 자산",
  };
  return labels[status] ?? status;
}

function reportStateLabel(status: string): string {
  const labels: Record<string, string> = {
    "not-started": "미작성",
    draft: "작성 중",
    submitted: "제출 완료",
  };
  return labels[status] ?? status;
}

function consentStateLabel(status: string): string {
  const labels: Record<string, string> = {
    missing: "미제출",
    uploaded: "업로드 완료",
  };
  return labels[status] ?? status;
}

function programStatusLabel(status: DemoState["calls"][number]["status"]): string {
  const labels: Record<DemoState["calls"][number]["status"], string> = {
    open: "접수중",
    upcoming: "예정",
    active: "진행중",
    reviewing: "검토중",
    closed: "종료",
    always: "상시",
  };
  return labels[status];
}
