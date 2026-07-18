import type { DemoState, MilestoneStatus } from "./domain-types";

const completedMilestoneStatuses = new Set<MilestoneStatus>(["submitted", "approved"]);

export type PublishReadiness = {
  readonly canPublish: boolean;
  readonly reasons: readonly string[];
};

export function teamPublishReadiness(state: DemoState, teamId: string): PublishReadiness {
  const target = state.teams.find((team) => team.id === teamId);
  if (target === undefined) {
    return { canPublish: false, reasons: ["팀을 찾을 수 없음"] };
  }

  const reasons: string[] = [];
  const repositories = state.repositories.filter((repository) => repository.teamId === teamId);
  const requiredMilestones = state.milestones.filter(
    (milestone) => milestone.competitionId === target.competitionId,
  );
  const submissionsByMilestone = new Map(
    state.submissions
      .filter((submission) => submission.teamId === teamId)
      .map((submission) => [submission.milestoneId, submission]),
  );

  if (target.status !== "provisioned") reasons.push("승인/저장소 배정 필요");
  if (repositories.length === 0) reasons.push("JNU-SWCU 저장소 준비 필요");
  if (target.consentState !== "uploaded") reasons.push("공개 동의서 업로드 필요");
  if (target.reportState !== "submitted") reasons.push("최종 보고서 제출 필요");
  if (requiredMilestones.length === 0) reasons.push("마일스톤 계약 필요");
  if (
    requiredMilestones.some((milestone) => {
      const submission = submissionsByMilestone.get(milestone.id);
      return submission === undefined || !completedMilestoneStatuses.has(submission.status);
    })
  ) {
    reasons.push("필수 마일스톤 제출 완료 필요");
  }

  return { canPublish: reasons.length === 0, reasons };
}
