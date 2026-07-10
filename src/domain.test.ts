import { describe, expect, it } from "vitest";
import {
  addManagedUser,
  approveTeam,
  createInitialState,
  publicRepositories,
  publicTeams,
  publishTeamAsset,
  submitStudentApplication,
} from "./domain";

describe("demo state transitions", () => {
  it("ships dense deterministic portal fixtures", () => {
    const state = createInitialState();

    expect(state.calls).toHaveLength(12);
    expect(state.students).toHaveLength(30);
    expect(state.teams).toHaveLength(12);
    expect(state.repositories).toHaveLength(18);
    expect(state.activity).toHaveLength(120);
    expect(state.audit[0]?.id).toBe("system-seed-dense-challenge-portal-fixtures");
  });

  it("adds a submitted team when a student applies", () => {
    const state = createInitialState();

    const next = submitStudentApplication(state, {
      competitionId: "call-1",
      teamName: "테스트 비전 팀",
      githubIds: ["jnu-alpha", "jnu-beta"],
    });

    expect(next.teams[0]?.name).toBe("테스트 비전 팀");
    expect(next.teams[0]?.status).toBe("submitted");
    expect(next.repositories[0]?.teamId).toBe(next.teams[0]?.id);
    expect(next.activity[0]?.teamId).toBe(next.teams[0]?.id);
    expect(next.calls[0]?.teamCount).toBe((state.calls[0]?.teamCount ?? 0) + 1);
  });

  it("keeps only published teams in public projection", () => {
    const state = createInitialState();

    const projected = publicTeams(state.teams);
    const publicRepos = publicRepositories(state.repositories, state.teams);

    expect(projected.every((team) => team.status === "published")).toBe(true);
    expect(publicRepos.every((repo) => repo.visibility === "public")).toBe(true);
    expect(projected.map((team) => team.name)).not.toContain("광주 데이터 크루");
    expect(publicRepos.map((repo) => repo.teamId)).not.toContain("team-2");
  });

  it("updates staff approval and admin user actions without mutating previous state", () => {
    const state = createInitialState();
    const approved = approveTeam(state, "team-5");
    const withUser = addManagedUser(approved, {
      id: "user-new",
      name: "신규 교직원",
      role: "staff",
      status: "active",
      github: "staff-new",
      lastSeen: "2026-07-06",
    });

    expect(approved.teams.find((team) => team.id === "team-5")?.status).toBe("provisioned");
    expect(state.teams.find((team) => team.id === "team-5")?.status).toBe("submitted");
    expect(withUser.users[0]?.role).toBe("staff");
  });

  it("publishes repository visibility with the team asset", () => {
    const state = createInitialState();
    const published = publishTeamAsset(state, "team-2");
    const teamRepos = published.repositories.filter((repo) => repo.teamId === "team-2");

    expect(published.teams.find((team) => team.id === "team-2")?.status).toBe("published");
    expect(teamRepos.every((repo) => repo.visibility === "public")).toBe(true);
    expect(
      publicRepositories(published.repositories, published.teams).map((repo) => repo.teamId),
    ).toContain("team-2");
  });
});
