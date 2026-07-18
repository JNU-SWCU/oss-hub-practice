import { expect, test } from "@playwright/test";

test("destructive staff and admin actions require confirmation", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^교직원/ }).click();

  const reviewRow = page
    .getByRole("table", { name: "교직원 신청 검토 큐" })
    .getByRole("row")
    .filter({ hasText: "광주 데이터 크루" });
  await reviewRow.getByRole("button", { name: "자산 공개" }).click();
  await expect(page.getByRole("dialog", { name: "광주 데이터 크루 공개 전환" })).toBeVisible();
  await page.getByRole("button", { name: "취소" }).click();
  await expect(page.getByRole("dialog", { name: "광주 데이터 크루 공개 전환" })).toHaveCount(0);

  const blockedRow = page
    .getByRole("table", { name: "교직원 신청 검토 큐" })
    .getByRole("row")
    .filter({ hasText: "AI README 평가단" });
  await expect(blockedRow.getByRole("button", { name: "자산 공개" })).toBeDisabled();
  await expect(blockedRow.getByText("공개 대기:")).toBeVisible();

  await page.getByRole("button", { name: "역할 바꾸기" }).click();
  await page.getByRole("button", { name: /^관리자/ }).click();
  const userRow = page
    .getByRole("table", { name: "시스템 관리자 사용자 관리" })
    .getByRole("row")
    .filter({ hasText: "사업단 운영자" });
  await userRow.getByRole("button", { name: "비활성화" }).click();
  await expect(page.getByRole("dialog", { name: "사업단 운영자 비활성화" })).toBeVisible();
});

test("public visitor sees published assets and leaderboard without private data", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^외부인/ }).click();

  await expect(
    page.getByRole("heading", { name: "전남대학교 OSS 대회와 저장소 자산" }),
  ).toBeVisible();
  await expect(page.getByRole("table", { name: "팀 리더보드" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "나르샤 OSS" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "캡스톤 리눅스 랩" })).toBeVisible();
  await expect(page.getByRole("button", { name: "공개 아카이브" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^공개 현황/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^활동 리더보드/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "개인 리더보드" })).toHaveCount(0);
  await expect(page.getByText("광주 데이터 크루")).toHaveCount(0);
  await expect(page.getByText("AI README 평가단")).toHaveCount(0);
  await expect(page.getByText("jnu-oss-1")).toHaveCount(0);
  await expect(page.getByText("010-")).toHaveCount(0);
  await expect(page.getByText("@jnu.ac.kr")).toHaveCount(0);
});

test("public detail hides internal teams and member GitHub IDs", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^외부인/ }).click();
  await page.getByRole("button", { name: "상세 보기" }).first().click();

  await expect(page.getByRole("button", { name: "신청/팀" })).toHaveCount(0);
  await page.getByRole("button", { name: "저장소", exact: true }).click();
  await expect(page.getByRole("table", { name: "공개 대회 저장소" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "나르샤 OSS" })).toBeVisible();
  await expect(page.getByText("광주 데이터 크루")).toHaveCount(0);
  await expect(page.getByText("jnu-oss-1")).toHaveCount(0);
  await expect(page.getByText("접수 완료")).toHaveCount(0);
});

test("role-specific direct routes are guarded by selected persona", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^외부인/ }).click();

  await page.evaluate(() => {
    window.history.pushState(null, "", "/staff/operations");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("heading", { name: "교직원 persona가 필요합니다" })).toBeVisible();

  await page.evaluate(() => {
    window.history.pushState(null, "", "/admin/console");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("heading", { name: "관리자 persona가 필요합니다" })).toBeVisible();

  await page.evaluate(() => {
    window.history.pushState(null, "", "/student/dashboard");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("heading", { name: "학생 persona가 필요합니다" })).toBeVisible();
});
