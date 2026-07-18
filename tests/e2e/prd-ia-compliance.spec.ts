import { expect, test } from "@playwright/test";
import { completeStudentSetup, enterStudentApplication } from "./student-flow";

test("student can submit a milestone from the dashboard checklist", async ({ page }) => {
  await enterStudentApplication(page);
  await page.getByLabel("팀 이름").fill("제출 액션 팀");
  await page.getByLabel("팀원 GitHub ID").fill("jnu-action");
  await page.getByRole("button", { name: "프로젝트 공간 만들기" }).click();

  const checklist = page.getByRole("table", { name: "학생 마일스톤 체크리스트" });
  const finalRow = checklist.getByRole("row").filter({ hasText: "최종 산출물" });
  await expect(finalRow.getByRole("cell", { name: "대기" })).toBeVisible();

  await finalRow.getByRole("button", { name: "제출 관리" }).click();
  await expect(page.getByText("최종 산출물을 제출 상태로 표시했습니다.")).toBeVisible();
  await expect(finalRow.getByRole("cell", { name: "제출 완료" })).toBeVisible();
});

test("public archive opens directly without selecting a role", async ({ page }) => {
  await page.goto("/public/dashboard");

  await expect(
    page.getByRole("heading", { name: "전남대학교 OSS 대회와 저장소 자산" }),
  ).toBeVisible();
  await expect(page.getByText("먼저 역할을 선택해야 접근할 수 있습니다.")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "공개 아카이브" })).toBeVisible();
});

test("student program list prioritizes open programs before archived ones", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^학생/ }).click();
  await completeStudentSetup(page, { startChoice: "program" });

  await page.getByRole("button", { name: "전체" }).click();
  const firstCard = page.locator(".competition-card").first();
  await expect(firstCard.getByRole("heading", { name: "2026 OSS 해커톤" })).toBeVisible();
  await expect(firstCard.getByRole("button", { name: "상세/신청" })).toBeVisible();
});

test("student dashboard shows multiple activities before project detail", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^학생/ }).click();
  await completeStudentSetup(page, { startChoice: "existing" });

  await expect(page.getByRole("heading", { name: "내 활동과 저장소 현황" })).toBeVisible();
  const activityList = page.locator(".student-activity-list");
  await expect(activityList.getByRole("button")).toHaveCount(3);
  await expect(activityList.getByRole("button", { name: /나르샤 OSS/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await activityList.getByRole("button", { name: /클라우드 항해단/ }).click();
  await expect(page.getByRole("heading", { name: "클라우드 항해단", exact: true })).toBeVisible();
  await expect(page.getByText("클라우드-항해단-main")).toBeVisible();
});

test("program and public lists expose state, search, filter, and sort controls", async ({
  page,
}) => {
  await page.goto("/competitions?state=loading");
  await expect(page.getByText("프로그램 목록을 불러오는 중입니다")).toBeVisible();

  await page.goto("/competitions?state=error");
  await expect(page.getByText("프로그램 목록을 불러오지 못했습니다")).toBeVisible();
  await page.getByRole("button", { name: "다시 시도" }).click();
  await expect(page).toHaveURL(/\/competitions$/);

  await page.goto("/login");
  await page.getByRole("button", { name: /^외부인/ }).click();
  await expect(page.getByRole("region", { name: "공개 아카이브 검색과 필터" })).toBeVisible();
  await page.getByPlaceholder("공개 대회명, 태그, 저장소 검색").fill("데이터톤");
  await expect(page.getByRole("heading", { name: "지역 문제 데이터톤" })).toBeVisible();
  await page.getByRole("button", { name: "접수중" }).click();
  await expect(page.getByText("조건에 맞는 공개 대회가 없습니다")).toBeVisible();
});
