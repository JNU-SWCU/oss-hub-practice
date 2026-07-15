import {
  ArrowRight,
  ClipboardCheck,
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
    description: "비로그인 상태에서 공개 프로그램, 공개 저장소, 활동 현황만 확인합니다.",
    role: "public",
    action: "공개 현황 보기",
  },
  {
    icon: Trophy,
    title: "학생 온보딩과 신청",
    description:
      "GitHub 로그인, 개인정보 동의, 프로그램 탐색, 신청서/팀 확정, Repo 초대와 제출까지 이어집니다.",
    role: "student",
    action: "학생 흐름 시작",
  },
  {
    icon: LayoutDashboard,
    title: "교직원 운영 흐름",
    description:
      "프로그램 생성, 신청 검토, 팀 x 마일스톤 매트릭스, 보완 요청, 승인과 리마인더를 관리합니다.",
    role: "staff",
    action: "운영 화면 보기",
  },
  {
    icon: ShieldCheck,
    title: "관리자",
    description: "역할/allowlist, 감사 로그, GitHub API 상태를 별도 콘솔에서 확인합니다.",
    role: "admin",
    action: "관리자 화면 보기",
  },
] as const;

const flowSteps = [
  ["01", "Landing", "비로그인 사용자는 서비스 안내와 공개 아카이브로 이동합니다."],
  [
    "02",
    "GitHub Login",
    "학생은 최초 로그인 뒤 개인정보/GitHub 활동 이용 동의 게이트를 통과합니다.",
  ],
  ["03", "Student Dashboard", "전체 마감 타임라인과 내 신청/저장소/마일스톤 상태를 확인합니다."],
  ["04", "Program Detail", "프로그램 상세에서 신청서, 팀 구성, 자료, 마일스톤을 확인합니다."],
  ["05", "Staff Ops", "교직원은 신청자, 팀별 제출 상태, 검토 메모, 리마인더를 운영합니다."],
  ["06", "Public Archive", "승인되어 공개 전환된 팀만 외부 공개 화면에 노출됩니다."],
] as const;

const gates = [
  {
    title: "8/15 Intake",
    description:
      "프로그램 생성, 신청서, 팀 구성, 동의 상태까지 검증합니다. Repo 자동화는 제외합니다.",
  },
  {
    title: "8/27 Full-loop",
    description: "Repo 초대, 마일스톤 제출, 활동 대시보드, 공개 전환 흐름까지 연결합니다.",
  },
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
          최종 IA는 학생 신청 흐름과 교직원 운영 흐름을 같은 프로그램/팀/마일스톤 데이터 위에서
          연결합니다. 공개 화면은 승인된 저장소와 활동 현황만 보여줍니다.
        </p>
      </header>

      <section className="ia-flow" aria-labelledby="flow-title">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">핵심 화면 흐름</p>
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

      <section className="ia-gate-grid" aria-label="구현 게이트">
        {gates.map((gate) => (
          <article key={gate.title}>
            <ClipboardCheck aria-hidden="true" size={20} />
            <h2>{gate.title}</h2>
            <p>{gate.description}</p>
          </article>
        ))}
      </section>

      <section className="ia-boundary" aria-labelledby="boundary-title">
        <div>
          <p className="section-kicker">공개 범위</p>
          <h2 id="boundary-title">공개 화면과 운영 화면을 분리합니다</h2>
          <p>
            외부 방문자는 공개 프로그램과 공개 저장소만 볼 수 있습니다. 학생 신청 정보, 내부 검토
            메모, 학번과 연락처는 역할 기반 운영 화면에서만 다룹니다.
          </p>
          <section className="ia-boundary-map" aria-label="화면 접근 범위">
            <section>
              <h3>공개</h3>
              <p>외부 방문자, 공개 프로그램, 공개 저장소, 활동 현황</p>
            </section>
            <section>
              <h3>운영</h3>
              <p>학생, 교직원, 관리자, 신청서, 검토 메모, 사용자 정보</p>
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
