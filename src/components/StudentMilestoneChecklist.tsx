import { ListChecks } from "lucide-react";
import { useState } from "react";
import type { ProgramMilestone, Team, TeamMilestoneSubmission } from "../domain";
import { milestoneStatusLabel, submissionForMilestone } from "../domain";
import { gateLabel } from "./StudentDashboard.helpers";

type StudentMilestoneChecklistProps = {
  readonly primaryTeam: Team | undefined;
  readonly milestones: readonly ProgramMilestone[];
  readonly submissions: readonly TeamMilestoneSubmission[];
};

export function StudentMilestoneChecklist({
  primaryTeam,
  milestones,
  submissions,
}: StudentMilestoneChecklistProps) {
  const [submittedMilestoneIds, setSubmittedMilestoneIds] = useState<readonly string[]>([]);
  const [confirmation, setConfirmation] = useState("");

  function markSubmitted(milestone: ProgramMilestone): void {
    if (!submittedMilestoneIds.includes(milestone.id)) {
      setSubmittedMilestoneIds([...submittedMilestoneIds, milestone.id]);
    }
    setConfirmation(`${milestone.name}을 제출 상태로 표시했습니다.`);
  }

  return (
    <section className="table-panel" aria-labelledby="student-milestone-title">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">
            <ListChecks size={15} />내 제출 상태
          </p>
          <h2 id="student-milestone-title">마일스톤 체크리스트</h2>
          <p>신청서, Repo 초대, 최종 제출까지 내 팀의 현재 위치를 확인합니다.</p>
        </div>
      </div>
      {confirmation.length > 0 ? <p className="notice-banner compact">{confirmation}</p> : null}
      {primaryTeam === undefined ? (
        <p className="empty-state">
          아직 신청한 팀이 없습니다. 프로그램 상세에서 신청을 시작하세요.
        </p>
      ) : (
        <div className="table-scroll">
          <table aria-label="학생 마일스톤 체크리스트">
            <thead>
              <tr>
                <th>마일스톤</th>
                <th>게이트</th>
                <th>마감</th>
                <th>상태</th>
                <th>가이드</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((milestone) => {
                const submission = submissionForMilestone(submissions, milestone.id);
                const isLocallySubmitted = submittedMilestoneIds.includes(milestone.id);
                return (
                  <tr key={milestone.id}>
                    <td data-label="마일스톤">{milestone.name}</td>
                    <td data-label="게이트">{gateLabel(milestone.gate)}</td>
                    <td data-label="마감">{milestone.dueDate}</td>
                    <td data-label="상태">
                      {isLocallySubmitted ? "제출 완료" : submissionStatusText(submission)}
                    </td>
                    <td data-label="가이드">{milestone.guide}</td>
                    <td className="action-cell" data-label="작업">
                      <button type="button" onClick={() => markSubmitted(milestone)}>
                        제출 관리
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function submissionStatusText(submission: TeamMilestoneSubmission | undefined): string {
  return submission === undefined ? "대기" : milestoneStatusLabel(submission.status);
}
