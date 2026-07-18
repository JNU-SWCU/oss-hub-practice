import { expect, test } from "@playwright/test";
import { completeStudentSetup, enterStudentApplication } from "./student-flow";

test("service guide maps the contest flow and opens public status without a persona", async ({
  page,
}) => {
  await page.goto("/information");

  await expect(page.getByRole("heading", { name: "JNU OSS Platform 이용 구조" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "대회에서 공개 자산까지" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "역할별 시작점" })).toBeVisible();

  await page.getByRole("button", { name: "공개 현황 보기" }).click();
  await expect(page).toHaveURL(/\/public\/dashboard/);
  await expect(
    page.getByRole("heading", { name: "전남대학교 OSS 대회와 저장소 자산" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "프로그램", exact: true }).click();
  await expect(page).toHaveURL(/\/competitions/);
  await expect(page.getByText("내부 운영")).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "대회 현황 요약" }).getByText("40건"),
  ).toBeVisible();

  await page.evaluate(() => {
    window.history.pushState(null, "", "/competitions/call-2");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("heading", { name: "화면을 찾을 수 없습니다" })).toBeVisible();
});

test("browser history restores the persona before returning to its role route", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^교직원/ }).click();
  await page.getByRole("button", { name: "서비스 안내" }).click();
  await page.getByRole("button", { name: "공개 현황 보기" }).click();

  await page.goBack();
  await expect(page.getByRole("heading", { name: "JNU OSS Platform 이용 구조" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "교직원 공모 운영 및 검토" })).toBeVisible();
});

test("information guide explains the final IA gates and role flows", async ({ page }) => {
  await page.goto("/information");

  await expect(page.getByRole("heading", { name: "학생 온보딩과 신청" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "교직원 운영 흐름" })).toBeVisible();
  await expect(page.getByText("8/15 Intake")).toBeVisible();
  await expect(page.getByText("8/27 Full-loop")).toBeVisible();
});

test("student dashboard shows IA deadline timeline and milestone checklist", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^학생/ }).click();
  await completeStudentSetup(page);

  await expect(page.getByRole("heading", { name: "전체 마감 타임라인" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "학생 시작 흐름" })).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "내 활동 목록에서 팀과 저장소를 관리합니다" }),
  ).toBeVisible();
  await expect(
    page.getByLabel("나르샤 OSS 팀원 GitHub ID").getByText("jnu-oss-1", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("나르샤-oss-main")).toBeVisible();
  await expect(page.getByText("github.com/JNU-SWCU/나르샤-oss-main")).toBeVisible();
  await expect(page.getByRole("heading", { name: "마일스톤 체크리스트" })).toBeVisible();
  const checklist = page.getByRole("table", { name: "학생 마일스톤 체크리스트" });
  await expect(checklist.getByRole("cell", { name: "신청서/팀 확정" })).toBeVisible();
  await expect(checklist.getByRole("cell", { name: "Repo 초대" })).toBeVisible();
});

test("staff operations include milestone matrix and reminder digest", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^교직원/ }).click();

  await expect(page.getByText("프론트엔드 시연 모드입니다.")).toBeVisible();
  await expect(page.getByLabel("운영 기간")).toBeVisible();
  await expect(page.getByLabel("팀 인원")).toBeVisible();
  await expect(page.getByLabel("신청폼 항목")).toBeVisible();
  await expect(page.getByText("마일스톤 설정")).toBeVisible();
  await expect(page.getByLabel("제출물 유형")).toBeVisible();
  await expect(page.getByLabel("알림 설정")).toBeVisible();
  await expect(page.getByRole("heading", { name: "팀 x 마일스톤 매트릭스" })).toBeVisible();
  await expect(page.getByRole("table", { name: "팀별 마일스톤 제출 매트릭스" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "리마인더 이메일" })).toBeVisible();
  await expect(page.getByText("마감 3일 전", { exact: true })).toBeVisible();
});

test("role state survives reload, reset restores initial state, and admin includes staff screens", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^관리자/ }).click();
  await page.getByRole("button", { name: "검토 큐" }).click();
  await expect(page.getByRole("heading", { name: "교직원 공모 운영 및 검토" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "교직원 공모 운영 및 검토" })).toBeVisible();
  await page.getByRole("button", { name: "서비스 안내" }).click();
  await expect(page.getByRole("navigation", { name: "주요 화면" })).toBeVisible();
  await expect(page.getByText("관리자 시연")).toBeVisible();

  await page.getByRole("button", { name: "역할 바꾸기" }).click();
  await page.getByRole("button", { name: "시연 데이터 초기화" }).click();
  await expect.poll(() => page.evaluate(() => window.history.state)).toEqual({ role: null });
  await page.reload();
  await expect(page.getByRole("heading", { name: "JNU OSS Platform" })).toBeVisible();
  await expect(
    page.evaluate(() => JSON.parse(window.localStorage.getItem("jnu-oss-demo-state-v2") ?? "{}")),
  ).resolves.toHaveProperty("calls");
});

test("login-first student application appears in staff review and becomes provisioned", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);

  await enterStudentApplication(page);
  await expect(page.getByText("1/3 신청 정보")).toBeVisible();
  await expect(page.getByText("2/3 팀 구성")).toBeVisible();
  await expect(page.getByText("3/3 저장소 준비")).toBeVisible();
  await expect(page.getByRole("textbox", { name: /참여코드/ })).toBeVisible();
  await expect(page.getByText("팀 인원 기준")).toBeVisible();
  await page.getByLabel("팀 이름").fill("테스트 비전 팀");
  await page.getByLabel("팀원 GitHub ID").fill("jnu-alpha, jnu-beta");
  await page.getByRole("button", { name: "프로젝트 공간 만들기" }).click();
  await expect(page.getByRole("navigation", { name: "학생 시작 흐름" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "내 활동과 저장소 현황" })).toBeVisible();
  await expect(
    page.getByRole("region", { name: "신청 처리 상태" }).getByText("저장소 배정"),
  ).toBeVisible();
  await expect(
    page.getByLabel("테스트 비전 팀 팀원 GitHub ID").getByText("jnu-alpha"),
  ).toBeVisible();
  await expect(
    page.getByLabel("테스트 비전 팀 팀원 GitHub ID").getByText("jnu-beta"),
  ).toBeVisible();
  await expect(
    page.getByRole("table", { name: "학생 신청 이력" }).getByText("테스트 비전 팀"),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("table", { name: "학생 신청 이력" }).getByText("테스트 비전 팀"),
  ).toBeVisible();

  await page.getByRole("button", { name: "역할 바꾸기" }).click();
  await page.getByRole("button", { name: /^교직원/ }).click();
  await expect(page.getByRole("heading", { name: "교직원 공모 운영 및 검토" })).toBeVisible();

  const reviewTable = page.getByRole("table", { name: "교직원 신청 검토 큐" });
  const reviewRow = reviewTable.getByRole("row").filter({ hasText: "테스트 비전 팀" });
  await expect(reviewRow).toBeVisible();
  await reviewRow.getByRole("button", { name: "승인", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "테스트 비전 팀 승인" })).toBeVisible();
  await page
    .getByRole("dialog", { name: "테스트 비전 팀 승인" })
    .getByRole("button", { name: "승인" })
    .click();
  await expect(reviewRow.getByText("저장소 배정 완료")).toBeVisible();

  await page.getByRole("button", { name: "역할 바꾸기" }).click();
  await page.getByRole("button", { name: /^학생/ }).click();
  await expect(page.getByRole("navigation", { name: "학생 시작 흐름" })).toHaveCount(0);
  await expect(
    page
      .getByRole("table", { name: "학생 신청 이력" })
      .getByRole("row")
      .filter({ hasText: "테스트 비전 팀" })
      .getByText("저장소 배정 완료"),
  ).toBeVisible();
});

test("staff correction request requires a written reason in the review dialog", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^교직원/ }).click();

  const reviewTable = page.getByRole("table", { name: "교직원 신청 검토 큐" });
  const reviewRow = reviewTable.getByRole("row").filter({ hasText: "클라우드 항해단" });
  await reviewRow.getByRole("button", { name: "보완 요청" }).click();

  const dialog = page.getByRole("dialog", { name: "클라우드 항해단 보완 요청" });
  await expect(dialog.getByLabel("보완 요청 사유")).toBeVisible();
  await dialog.getByLabel("보완 요청 사유").fill("");
  await dialog.getByRole("button", { name: "보완 요청" }).click();
  await expect(page.getByText("보완 요청 사유를 입력해야 합니다.")).toBeVisible();
  await dialog
    .getByLabel("보완 요청 사유")
    .fill("README 공개 범위와 배포 URL을 다시 확인해주세요.");
  await dialog.getByRole("button", { name: "보완 요청" }).click();
  await expect(reviewRow.locator('td[data-label="상태"]')).toContainText("보완 요청");
});

test("student setup is invariant, stable in history, and reused in the tab", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^학생/ }).click();

  await expect(page).toHaveURL(/\/student\/setup/);
  await expect(page.getByRole("button", { name: "학생 역할로 계속" })).toBeEnabled();
  await completeStudentSetup(page);
  await expect(page).toHaveURL(/\/student\/dashboard/);

  await page.goBack();
  await expect(page).toHaveURL(/\/student\/dashboard/);
  await expect(page.getByRole("heading", { name: "내 활동과 저장소 현황" })).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\/student\/dashboard/);

  await page.getByRole("button", { name: "역할 바꾸기" }).click();
  await page.getByRole("button", { name: /^학생/ }).click();
  await expect(page).toHaveURL(/\/student\/dashboard/);
});

test("closed programs cannot create a false repository-stage outcome", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^학생/ }).click();
  await completeStudentSetup(page);

  await page.evaluate(() => {
    window.history.pushState(null, "", "/competitions/call-6/apply");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("heading", { name: "신청할 수 없는 프로그램입니다" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /참여 공간 만들기$/ })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "학생 시작 흐름" })).toHaveCount(0);
});

test("student application rejects malformed GitHub IDs before submission", async ({ page }) => {
  await enterStudentApplication(page);
  await page.getByLabel("팀 이름").fill("잘못된 아이디 팀");
  await page.getByLabel("팀원 GitHub ID").fill("jnu-alpha, invalid handle");
  await page.getByRole("button", { name: "프로젝트 공간 만들기" }).click();

  await expect(page.getByText("GitHub ID 형식을 확인하세요: invalid handle")).toBeVisible();

  await page.getByRole("button", { name: "역할 바꾸기" }).click();
  await page.getByRole("button", { name: /^교직원/ }).click();
  await expect(
    page.getByRole("table", { name: "교직원 신청 검토 큐" }).getByText("잘못된 아이디 팀"),
  ).toHaveCount(0);
});

test("student application requires at least one GitHub ID", async ({ page }) => {
  await enterStudentApplication(page);
  await page.getByLabel("팀 이름").fill("빈 깃허브 팀");
  await page.getByLabel("팀원 GitHub ID").fill("");
  await page.getByRole("button", { name: "프로젝트 공간 만들기" }).click();

  await expect(page.getByText("팀원 GitHub ID를 1개 이상 입력하세요.")).toBeVisible();
});

test("student application enforces configured team size bounds", async ({ page }) => {
  await enterStudentApplication(page);
  await page.getByLabel("팀 이름").fill("인원 초과 팀");
  await page.getByLabel("팀원 GitHub ID").fill("jnu-alpha, jnu-beta, jnu-gamma, jnu-delta");
  await page.getByRole("button", { name: "프로젝트 공간 만들기" }).click();

  await expect(
    page.getByText("2-4명 기준에 맞게 팀원을 입력하세요. 현재 5명입니다."),
  ).toBeVisible();
});
