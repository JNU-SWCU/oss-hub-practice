import type {
  DemoState,
  MetricId,
  ProgramMilestone,
  Repository,
  Team,
  TeamMilestoneSubmission,
} from "./domain-types";

export function leaderboardValue(team: Team, metric: MetricId): number {
  switch (metric) {
    case "activity":
      return team.commits + team.prs * 8 + team.stars * 3 + team.repos * 12;
    case "commits":
      return team.commits;
    case "prs":
      return team.prs;
    case "stars":
      return team.stars;
    case "repos":
      return team.repos;
  }
}

export function publicTeams(teams: readonly Team[]): readonly Team[] {
  return teams.filter((team) => team.status === "published");
}

export function publicRepositories(
  repositories: readonly Repository[],
  teams: readonly Team[],
): readonly Repository[] {
  const publishedTeamIds = new Set(publicTeams(teams).map((team) => team.id));
  return repositories.filter(
    (repository) => repository.visibility === "public" && publishedTeamIds.has(repository.teamId),
  );
}

export function milestonesForCompetition(
  state: DemoState,
  competitionId: string,
): readonly ProgramMilestone[] {
  return state.milestones.filter((milestone) => milestone.competitionId === competitionId);
}

export function submissionsForTeam(
  state: DemoState,
  teamId: string,
): readonly TeamMilestoneSubmission[] {
  return state.submissions.filter((submission) => submission.teamId === teamId);
}

export function submissionForMilestone(
  submissions: readonly TeamMilestoneSubmission[],
  milestoneId: string,
): TeamMilestoneSubmission | undefined {
  return submissions.find((submission) => submission.milestoneId === milestoneId);
}

export function milestoneStatusLabel(status: TeamMilestoneSubmission["status"]): string {
  switch (status) {
    case "not-started":
      return "대기";
    case "ready":
      return "준비 중";
    case "submitted":
      return "제출";
    case "needs-revision":
      return "보완";
    case "approved":
      return "승인";
  }
}
