import { ListChecks, Mail } from "lucide-react";
import { type DemoState, milestoneStatusLabel, submissionForMilestone } from "../domain";

type StaffMilestoneOpsProps = {
  readonly state: DemoState;
  readonly selectedProgramId: string;
};

export function StaffMilestoneOps({ state, selectedProgramId }: StaffMilestoneOpsProps) {
  const selectedProgram = state.calls.find((call) => call.id === selectedProgramId) ?? state.calls[0];
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

  return (
    <section className="milestone-ops-grid span-wide" aria-label="교직원 마일스톤 운영">
      <div className="table-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">
              <ListChecks size={15} />
              제출 운영
            </p>
            <h3>팀 x 마일스톤 매트릭스</h3>
            <p>{selectedProgram?.title ?? "선택된 프로그램"}의 팀별 제출 상태를 한 번에 확인합니다.</p>
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
                          {submission === undefined ? "대기" : milestoneStatusLabel(submission.status)}
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
  );
}
