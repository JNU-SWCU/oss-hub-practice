import { expect, test } from "@playwright/test";

async function enterStudentApplication(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "JNU OSS Platform" })).toBeVisible();
  await page.getByRole("button", { name: /^학생/ }).click();

  await expect(page).toHaveURL(/\/consent/);
  await expect(page.getByRole("heading", { name: "활동 정보 이용에 동의해 주세요" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "학생 시작 흐름" })).toContainText(
    "로그인과 동의",
  );
  await expect(page.getByRole("button", { name: "동의하고 내 대시보드로" })).toBeDisabled();
  await page.getByLabel("개인정보 수집과 GitHub 활동 이용에 동의합니다").check();
  await expect(page.getByRole("button", { name: "동의하고 내 대시보드로" })).toBeEnabled();
  await page.getByRole("button", { name: "동의하고 내 대시보드로" }).click();

  await expect(page).toHaveURL(/\/student\/dashboard/);
  await expect(page.getByRole("heading", { name: "내 신청과 저장소 배정 상태" })).toBeVisible();
  await page.getByRole("button", { name: "참여할 프로그램 둘러보기" }).click();
  await expect(page).toHaveURL(/\/competitions/);
  await expect(
    page.getByRole("heading", { name: "대회 접수와 GitHub 저장소 자산화" }),
  ).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "상세/신청" }).first().click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { name: "2026 OSS 해커톤" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "학생 시작 흐름" })).toContainText(
    "프로그램 선택",
  );
  await page.getByRole("button", { name: "신청서 작성" }).click();
  await expect(page.getByRole("heading", { name: "2026 OSS 해커톤 신청" })).toBeVisible();
}

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
  await page.getByLabel("개인정보 수집과 GitHub 활동 이용에 동의합니다").check();
  await page.getByRole("button", { name: "동의하고 내 대시보드로" }).click();

  await expect(page.getByRole("heading", { name: "전체 마감 타임라인" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "마일스톤 체크리스트" })).toBeVisible();
  const checklist = page.getByRole("table", { name: "학생 마일스톤 체크리스트" });
  await expect(checklist.getByRole("cell", { name: "신청서/팀 확정" })).toBeVisible();
  await expect(checklist.getByRole("cell", { name: "Repo 초대" })).toBeVisible();
});

test("staff operations include milestone matrix and reminder digest", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^교직원/ }).click();

  await expect(page.getByRole("heading", { name: "팀 x 마일스톤 매트릭스" })).toBeVisible();
  await expect(page.getByRole("table", { name: "팀별 마일스톤 제출 매트릭스" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "리마인더 이메일" })).toBeVisible();
  await expect(page.getByText("마감 3일 전", { exact: true })).toBeVisible();
});

test("role state survives reload, reset clears it, and admin includes staff screens", async ({
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
});

test("login-first student application appears in staff review and becomes provisioned", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);

  await enterStudentApplication(page);
  await page.getByLabel("팀 이름").fill("테스트 비전 팀");
  await page.getByLabel("팀원 GitHub ID").fill("jnu-alpha, jnu-beta");
  await page.getByRole("button", { name: "신청서 제출" }).click();
  await expect(
    page.getByRole("navigation", { name: "학생 시작 흐름" }).locator('[aria-current="step"]'),
  ).toContainText("저장소 시작");
  await expect(page.getByRole("heading", { name: "내 신청과 저장소 배정 상태" })).toBeVisible();
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
  await expect(reviewRow.getByText("저장소 배정 완료")).toBeVisible();

  await page.getByRole("button", { name: "역할 바꾸기" }).click();
  await page.getByRole("button", { name: /^학생/ }).click();
  await expect(
    page.getByRole("navigation", { name: "학생 시작 흐름" }).locator('[aria-current="step"]'),
  ).toContainText("저장소 시작");
  await expect(
    page.getByRole("table", { name: "학생 신청 이력" }).getByText("저장소 배정 완료"),
  ).toBeVisible();
});

test("student consent is invariant, stable in history, and reused in the tab", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^학생/ }).click();

  await page.locator(".consent-form").evaluate((form) => (form as HTMLFormElement).requestSubmit());
  await expect(page).toHaveURL(/\/consent/);
  await expect(page.getByRole("button", { name: "동의하고 내 대시보드로" })).toBeDisabled();

  await page.getByLabel("개인정보 수집과 GitHub 활동 이용에 동의합니다").check();
  await page.getByRole("button", { name: "동의하고 내 대시보드로" }).click();
  await expect(page).toHaveURL(/\/student\/dashboard/);

  await page.goBack();
  await expect(page).toHaveURL(/\/student\/dashboard/);
  await expect(page.getByRole("heading", { name: "내 신청과 저장소 배정 상태" })).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\/student\/dashboard/);

  await page.getByRole("button", { name: "역할 바꾸기" }).click();
  await page.getByRole("button", { name: /^학생/ }).click();
  await expect(page).toHaveURL(/\/student\/dashboard/);
});

test("closed programs cannot create a false repository-stage outcome", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /^학생/ }).click();
  await page.getByLabel("개인정보 수집과 GitHub 활동 이용에 동의합니다").check();
  await page.getByRole("button", { name: "동의하고 내 대시보드로" }).click();

  await page.evaluate(() => {
    window.history.pushState(null, "", "/competitions/call-6/apply");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("heading", { name: "신청할 수 없는 프로그램입니다" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /신청$/ })).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "학생 시작 흐름" }).locator('[aria-current="step"]'),
  ).toContainText("프로그램 선택");
});

test("student application rejects malformed GitHub IDs before submission", async ({ page }) => {
  await enterStudentApplication(page);
  await page.getByLabel("팀 이름").fill("잘못된 아이디 팀");
  await page.getByLabel("팀원 GitHub ID").fill("jnu-alpha, invalid handle");
  await page.getByRole("button", { name: "신청서 제출" }).click();

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
  await page.getByRole("button", { name: "신청서 제출" }).click();

  await expect(page.getByText("팀원 GitHub ID를 1개 이상 입력하세요.")).toBeVisible();
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
