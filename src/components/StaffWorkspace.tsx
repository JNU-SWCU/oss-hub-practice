import { BarChart3, Check, ClipboardList, FileCheck2, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import type { DemoState } from "../domain";

type StaffWorkspaceProps = {
  readonly state: DemoState;
  readonly onApproveTeam: (teamId: string) => void;
  readonly onRequestCorrection: (teamId: string, reason: string) => void;
  readonly onPublishTeam: (teamId: string) => void;
};

export function StaffWorkspace({
  state,
  onApproveTeam,
  onRequestCorrection,
  onPublishTeam,
}: StaffWorkspaceProps) {
  const reviewTargets = state.teams.filter(
    (team) =>
      team.status === "submitted" || team.status === "correction" || team.status === "provisioned",
  );
  return (
    <div className="workspace-grid">
      <div className="workspace-intro">
        <p className="section-kicker">교직원 운영</p>
        <h2>교직원 공모 운영 및 검토</h2>
        <p>
          교직원은 대회 접수 현황, 동의서/보고서 제출 상태, 저장소 배정 상태, 자산화 후보를 한 번에
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
                <th>동의서</th>
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
                  <td data-label="동의서">{consentStateLabel(team.consentState)}</td>
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
                          "팀원 GitHub ID와 동의서 metadata를 다시 확인하세요.",
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
