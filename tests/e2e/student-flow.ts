import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export type StudentSetupGithubMode = "import" | "later";
export type StudentSetupStartChoice = "program" | "existing";

type CompleteStudentSetupOptions = {
  readonly githubMode?: StudentSetupGithubMode;
  readonly startChoice?: StudentSetupStartChoice;
};

const startChoiceNames = {
  program: /접수 중인 프로그램 보기/,
  existing: /내 활동과 저장소 상태 확인/,
} as const satisfies Record<StudentSetupStartChoice, RegExp>;

export async function completeStudentSetup(
  page: Page,
  options: CompleteStudentSetupOptions = {},
): Promise<void> {
  const githubMode = options.githubMode ?? "import";
  const startChoice = options.startChoice ?? "existing";

  await expect(page).toHaveURL(/\/student\/setup/);
  await expect(
    page.getByRole("heading", { name: "대시보드에 들어가기 전에 필요한 정보만 확인합니다" }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "첫 참여 설정 진행" })).toContainText(
    "역할 확인",
  );

  await page.getByRole("button", { name: "학생 역할로 계속" }).click();
  await page.getByLabel("이름").fill("학생 시연 사용자");
  await page.getByLabel("소속/학과").fill("컴퓨터정보통신공학과");
  await page.getByRole("button", { name: "기본 정보 저장하고 계속" }).click();

  if (githubMode === "later") {
    await page.getByRole("radio", { name: /나중에 직접 입력하기/ }).check();
  } else {
    await page.getByRole("radio", { name: /GitHub 기록 불러오기/ }).check();
    await page.getByLabel("GitHub ID", { exact: true }).fill("jnu-student");
    await page.getByLabel("GitHub ID를 확인했습니다").check();
  }

  await page.getByRole("button", { name: "GitHub 정보 확인하고 계속" }).click();
  await expect(page.getByRole("button", { name: "참여 시작 선택으로 계속" })).toBeDisabled();
  await page.getByLabel("개인정보 수집과 GitHub 활동 이용에 동의합니다").check();
  await expect(page.getByRole("button", { name: "참여 시작 선택으로 계속" })).toBeEnabled();
  await page.getByRole("button", { name: "참여 시작 선택으로 계속" }).click();

  await expect(page.getByRole("button", { name: "선택한 화면으로 이동" })).toBeDisabled();
  await page.getByRole("radio", { name: startChoiceNames[startChoice] }).check();
  await expect(page.getByRole("button", { name: "선택한 화면으로 이동" })).toBeEnabled();
  await page.getByRole("button", { name: "선택한 화면으로 이동" }).click();
}

export async function enterStudentApplication(page: Page): Promise<void> {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "JNU OSS Platform" })).toBeVisible();
  await page.getByRole("button", { name: /^학생/ }).click();
  await completeStudentSetup(page);

  await expect(page).toHaveURL(/\/student\/dashboard/);
  await expect(page.getByRole("heading", { name: "내 활동과 저장소 현황" })).toBeVisible();
  await page.getByRole("button", { name: "새 프로그램 둘러보기" }).click();
  await expect(page).toHaveURL(/\/competitions/);
  await expect(page.getByRole("heading", { name: "프로그램 찾기" })).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "상세/신청" }).first().click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { name: "2026 OSS 해커톤" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "학생 시작 흐름" })).toHaveCount(0);
  await page.getByRole("button", { name: "이 프로그램 신청하기" }).click();
  await expect(
    page.getByRole("heading", { name: "2026 OSS 해커톤 참여 공간 만들기" }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "학생 시작 흐름" })).toHaveCount(0);
}
