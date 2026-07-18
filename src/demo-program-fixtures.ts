import type { Call, ProgramMilestone } from "./domain-types";

export function createMilestones(calls: readonly Call[]): readonly ProgramMilestone[] {
  return calls.flatMap((call): readonly ProgramMilestone[] => {
    const isFullLoop =
      call.id === "call-1" || call.id === "call-4" || call.id === "call-8" || call.id === "call-10";
    const intakeMilestones: readonly ProgramMilestone[] = [
      milestone(
        call.id,
        "intake",
        "신청서/팀 확정",
        "2026-08-15",
        "text",
        "팀 이름, 팀원 GitHub ID, 동의 상태를 확정합니다.",
      ),
    ];
    if (!isFullLoop) return intakeMilestones;
    return [
      ...intakeMilestones,
      milestone(
        call.id,
        "repo",
        "Repo 초대",
        "2026-08-27",
        "repo-tag",
        "GitHub 저장소 초대와 기본 README 상태를 확인합니다.",
      ),
      milestone(
        call.id,
        "final",
        "최종 산출물",
        "2026-08-29",
        "release",
        "README, 라이선스, 제출 URL을 최종 검토합니다.",
      ),
    ];
  });
}

export function createCompetitions(): readonly Call[] {
  return [
    call("call-1", "2026 OSS 해커톤", "open", "2026-08-20", 18, ["OSS", "해커톤", "GitHub"]),
    call("call-2", "캡스톤 GitHub 자산화", "open", "2026-09-12", 11, ["캡스톤", "문서화"]),
    call("call-3", "AI 모델 서비스 챌린지", "upcoming", "2026-10-05", 0, ["AI", "서비스"]),
    call("call-4", "공개 SW 기여 챌린지", "active", "2026-07-30", 22, ["기여", "PR"]),
    call("call-5", "보안 취약점 분석 대회", "reviewing", "2026-07-15", 9, ["보안", "리뷰"]),
    call("call-6", "지역 문제 데이터톤", "closed", "2026-06-20", 16, ["데이터", "분석"]),
    call("call-7", "오픈소스 문서 번역 스프린트", "always", "상시", 7, ["문서", "상시"]),
    call("call-8", "클라우드 네이티브 실습 리그", "open", "2026-08-31", 13, ["클라우드", "DevOps"]),
    call("call-9", "OSS UI 접근성 개선전", "upcoming", "2026-11-01", 0, ["접근성", "프론트엔드"]),
    call("call-10", "전남 데이터 시각화 경진대회", "active", "2026-08-08", 14, [
      "데이터",
      "시각화",
    ]),
    call("call-11", "2025 공개 SW 기여 아카이브", "closed", "2025-12-20", 24, ["아카이브", "기여"]),
    call("call-12", "연구실 OSS 홍보전", "always", "상시", 6, ["교육", "홍보"]),
  ];
}

function milestone(
  competitionId: string,
  slug: string,
  name: string,
  dueDate: string,
  deliverableType: ProgramMilestone["deliverableType"],
  guide: string,
): ProgramMilestone {
  return {
    id: `${competitionId}-${slug}`,
    competitionId,
    name,
    dueDate,
    deliverableType,
    guide,
    gate: slug === "intake" ? "intake" : "full-loop",
  };
}

function call(
  id: string,
  title: string,
  status: Call["status"],
  deadline: string,
  teamCount: number,
  category: readonly string[],
): Call {
  const isExternalProgram = id === "call-2";
  return {
    id,
    title,
    summary: `${title} 참여 팀을 모집하고 GitHub 저장소, 규칙, 제출 현황을 한 화면에서 관리합니다.`,
    host: isExternalProgram ? "전남대학교 SW산학협력센터" : "전남대학교 소프트웨어중심대학사업단",
    category,
    period: status === "always" ? "상시 운영" : `2026-07-06 - ${deadline}`,
    deadline,
    teamSize: id === "call-7" || id === "call-12" ? "개인 가능" : "2-4명",
    eligibility: isExternalProgram ? "캡스톤 참여 학생" : "전남대학교 재학생",
    outputType: category.includes("데이터") ? "분석 리포트" : "공개 저장소",
    reviewBasis: "신청서, GitHub ID, README, 라이선스, 활동 로그",
    visibility: id === "call-2" || id === "call-5" ? "internal" : "public",
    status,
    teamCount,
    materials: ["참가 안내", "규칙/평가표", "저장소 템플릿"],
  };
}
