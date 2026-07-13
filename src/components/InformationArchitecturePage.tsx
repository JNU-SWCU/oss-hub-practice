import {
  ArrowRight,
  FolderGit2,
  LayoutDashboard,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";
import type { RoleId } from "../domain";

type InformationArchitecturePageProps = {
  readonly onEnterRole: (role: RoleId) => void;
  readonly onNavigate: (path: string) => void;
};

const journeys = [
  {
    icon: UserRound,
    title: "외부 방문자",
    description: "공개 대회와 공개 전환된 저장소 자산, 활동 현황을 확인합니다.",
    role: "public",
    action: "공개 현황 보기",
  },
  {
    icon: Trophy,
    title: "학생",
    description: "대회를 찾고 팀 GitHub ID를 제출한 뒤 신청과 저장소 배정 상태를 확인합니다.",
    role: "student",
    action: "대회 센터 보기",
  },
  {
    icon: LayoutDashboard,
    title: "교직원",
    description: "접수된 신청을 검토하고 팀별 저장소 배정과 공개 전환을 관리합니다.",
    role: "staff",
    action: "검토 큐 보기",
  },
  {
    icon: ShieldCheck,
    title: "시스템 관리자",
    description: "사용자 상태와 GitHub API 운영 상태를 별도로 관리합니다.",
    role: "admin",
    action: "관리자 화면 보기",
  },
] as const;

const flowSteps = [
  ["01", "대회 탐색", "대회 목록에서 주제, 일정, 산출물을 확인합니다."],
  ["02", "팀 신청", "학생이 팀명과 GitHub ID를 제출합니다."],
  ["03", "운영 검토", "교직원이 신청을 검토하고 저장소를 배정합니다."],
  ["04", "공개 전환", "공개 전환된 자산이 공개 현황과 리더보드로 연결됩니다."],
] as const;

export function InformationArchitecturePage({
  onEnterRole,
  onNavigate,
}: InformationArchitecturePageProps) {
  return (
    <main className="page-shell information-page">
      <header className="page-header">
        <p className="section-kicker">서비스 안내</p>
        <h1>JNU OSS Platform 이용 구조</h1>
        <p>
          대회를 중심으로 신청, 검토, GitHub 저장소 배정, 공개 자산화를 하나의 흐름으로 연결합니다.
        </p>
      </header>

      <section className="ia-flow" aria-labelledby="flow-title">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">핵심 흐름</p>
            <h2 id="flow-title">대회에서 공개 자산까지</h2>
          </div>
          <FolderGit2 aria-hidden="true" size={24} />
        </div>
        <ol>
          {flowSteps.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="competition-section" aria-labelledby="journey-title">
        <div className="section-title">
          <LayoutDashboard aria-hidden="true" size={18} />
          <h2 id="journey-title">역할별 시작점</h2>
          <span>4개 역할</span>
        </div>
        <div className="ia-journey-grid">
          {journeys.map(({ icon: Icon, title, description, role, action }) => (
            <article className="ia-journey-card" key={title}>
              <Icon aria-hidden="true" size={22} />
              <h3>{title}</h3>
              <p>{description}</p>
              <button
                className="ghost-action compact"
                type="button"
                onClick={() => onEnterRole(role)}
              >
                {action}
                <ArrowRight aria-hidden="true" size={15} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="ia-boundary" aria-labelledby="boundary-title">
        <div>
          <p className="section-kicker">공개 범위</p>
          <h2 id="boundary-title">공개 화면과 운영 화면을 분리합니다</h2>
          <p>
            외부 방문자는 공개 대회와 공개 저장소만 볼 수 있습니다. 학생 신청 정보, 내부 검토 메모,
            학번과 연락처는 역할 기반 운영 화면에서만 다룹니다.
          </p>
          <section className="ia-boundary-map" aria-label="화면 접근 범위">
            <section>
              <h3>공개</h3>
              <p>외부 방문자 · 공개 대회 · 공개 저장소 · 활동 현황</p>
            </section>
            <section>
              <h3>운영</h3>
              <p>학생 · 교직원 · 관리자 · 신청서 · 검토 메모 · 사용자 정보</p>
            </section>
          </section>
        </div>
        <button className="primary-action" type="button" onClick={() => onNavigate("/login")}>
          역할 선택으로 이동
          <ArrowRight aria-hidden="true" size={16} />
        </button>
      </section>
    </main>
  );
}
