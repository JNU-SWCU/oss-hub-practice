import { describe, expect, it } from "vitest";
import {
  addManagedUser,
  approveTeam,
  createInitialState,
  createProgramDraft,
  milestonesForCompetition,
  publicRepositories,
  publicTeams,
  publishTeamAsset,
  submissionsForTeam,
  submitStudentApplication,
} from "./domain";

describe("demo state transitions", () => {
  it("ships dense deterministic portal fixtures", () => {
    const state = createInitialState();

    expect(state.calls).toHaveLength(12);
    expect(state.students).toHaveLength(30);
    expect(state.teams).toHaveLength(12);
    expect(state.repositories).toHaveLength(18);
    expect(state.milestones.length).toBeGreaterThan(12);
    expect(state.submissions.length).toBeGreaterThan(state.teams.length);
    expect(state.activity).toHaveLength(120);
    expect(state.audit[0]?.id).toBe("system-seed-dense-challenge-portal-fixtures");
  });

  it("adds a submitted team and intake submission when a student applies", () => {
    const state = createInitialState();

    const next = submitStudentApplication(state, {
      competitionId: "call-1",
      teamName: "테스트 비전 팀",
      githubIds: ["jnu-alpha", "jnu-beta"],
      teamMode: "create",
    });

    expect(next.teams[0]?.name).toBe("테스트 비전 팀");
    expect(next.teams[0]?.status).toBe("submitted");
    expect(next.teams[0]?.repo).toBe("github.com/JNU-SWCU/call-1-team-13");
    expect(next.repositories[0]?.teamId).toBe(next.teams[0]?.id);
    expect(next.repositories[0]?.name).toBe("call-1-team-13");
    expect(next.activity[0]?.teamId).toBe(next.teams[0]?.id);
    expect(next.calls[0]?.teamCount).toBe((state.calls[0]?.teamCount ?? 0) + 1);
    expect(submissionsForTeam(next, next.teams[0]?.id ?? "")[0]?.status).toBe("submitted");
  });

  it("records join-code applications in team data and audit trail", () => {
    const state = createInitialState();

    const next = submitStudentApplication(state, {
      competitionId: "call-1",
      teamName: "참여코드 합류 팀",
      githubIds: ["jnu-alpha", "jnu-beta"],
      teamMode: "join",
      joinCode: "OSS-2026",
    });

    expect(next.teams[0]?.joinCode).toBe("OSS-2026");
    expect(next.audit[0]?.action).toBe("joined with code");
    expect(next.audit[0]?.target).toContain("OSS-2026");
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

  it("adds a staff-created program draft to the call and milestone lists", () => {
    const state = createInitialState();

    const next = createProgramDraft(state, {
      title: "OSS 실전 배포 챌린지",
      host: "전남대학교 소프트웨어중심대학사업단",
      category: ["배포", "GitHub", "Vercel"],
      period: "2026-09-01 - 2026-09-20",
      deadline: "2026-09-20",
      teamSize: "2-4명",
      outputType: "Vercel 배포 URL",
      applicationFields: ["참여 동기", "공개 동의", "팀 소개"],
      milestoneName: "최종 산출물 제출",
      milestoneDueDate: "2026-09-18",
      deliverableType: "repo-tag",
      reminderPolicy: "마감 3일 전 미제출 팀 요약 이메일",
    });

    expect(next.calls).toHaveLength(state.calls.length + 1);
    expect(next.calls[0]?.title).toBe("OSS 실전 배포 챌린지");
    expect(next.calls[0]?.status).toBe("upcoming");
    expect(next.calls[0]?.visibility).toBe("internal");
    expect(milestonesForCompetition(next, next.calls[0]?.id ?? "")[0]?.name).toBe("신청서/팀 확정");
    expect(milestonesForCompetition(next, next.calls[0]?.id ?? "")[1]?.name).toBe(
      "최종 산출물 제출",
    );
    expect(next.audit[0]?.action).toBe("created program draft");
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
