import { expect, test } from "@playwright/test";
import { completeStudentSetup } from "./student-flow";

test("student setup can start by browsing open programs", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^학생/ }).click();
  await completeStudentSetup(page, { startChoice: "program" });

  await expect(page).toHaveURL(/\/competitions\?status=open/);
  await expect(page.getByRole("heading", { name: "프로그램 찾기" })).toBeVisible();
});

test("student setup can skip GitHub import and manage existing activity", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^학생/ }).click();
  await completeStudentSetup(page, { githubMode: "later", startChoice: "existing" });

  await expect(page).toHaveURL(/\/student\/dashboard/);
  await expect(page.getByRole("heading", { name: "내 활동과 저장소 현황" })).toBeVisible();
});

test("student setup keeps external activity as supporting guidance", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^학생/ }).click();
  await expect(page).toHaveURL(/\/student\/setup/);
  await page.getByRole("button", { name: "학생 역할로 계속" }).click();
  await page.getByRole("button", { name: "기본 정보 저장하고 계속" }).click();
  await page.getByLabel("GitHub ID를 확인했습니다").check();
  await page.getByRole("button", { name: "GitHub 정보 확인하고 계속" }).click();
  await page.getByLabel("개인정보 수집과 GitHub 활동 이용에 동의합니다").check();
  await page.getByRole("button", { name: "참여 시작 선택으로 계속" }).click();

  await expect(page.getByRole("radio", { name: /접수 중인 프로그램 보기/ })).toBeVisible();
  await expect(page.getByRole("radio", { name: /내 활동과 저장소 상태 확인/ })).toBeVisible();
  await expect(page.getByRole("radio", { name: /외부 활동/ })).toHaveCount(0);
  await expect(page.getByText(/프로그램 화면에서 확인/)).toBeVisible();
});
