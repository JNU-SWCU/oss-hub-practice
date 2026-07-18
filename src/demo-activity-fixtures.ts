import type { ActivityEvent, Team } from "./domain-types";

export function createActivity(teams: readonly Team[]): readonly ActivityEvent[] {
  return Array.from({ length: 120 }, (_, index): ActivityEvent => {
    const team = teams[index % teams.length];
    const fallback = teams[0];
    const selectedTeam = team ?? fallback;
    const actorGithub = selectedTeam?.members[index % selectedTeam.members.length] ?? "jnu-oss-1";
    return {
      id: `activity-${index + 1}`,
      teamId: selectedTeam?.id ?? "team-1",
      competitionId: selectedTeam?.competitionId ?? "call-1",
      actorGithub,
      kind: activityKind(index),
      count: 1 + (index % 9),
      occurredAt: `2026-07-${String(1 + (index % 28)).padStart(2, "0")}`,
    };
  });
}

function activityKind(index: number): ActivityEvent["kind"] {
  const kinds: readonly ActivityEvent["kind"][] = [
    "commit",
    "pull_request",
    "issue",
    "review",
    "publish",
  ];
  return kinds[index % kinds.length] ?? "commit";
}
