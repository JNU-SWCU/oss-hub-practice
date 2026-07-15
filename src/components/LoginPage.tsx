import {
  GraduationCap,
  LayoutGrid,
  RotateCcw,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import type { RoleId } from "../domain";

type LoginSummary = {
  readonly totalPrograms: number;
  readonly openPrograms: number;
  readonly reviewQueue: number;
  readonly publishedAssets: number;
};

type LoginPageProps = {
  readonly notice: string;
  readonly summary: LoginSummary;
  readonly onLogin: (role: RoleId) => void;
  readonly onReset: () => void;
  readonly onNavigate: (path: string) => void;
};

type RoleChoice = {
  readonly role: RoleId;
  readonly icon: ReactNode;
  readonly title: string;
  readonly description: string;
};

const mainRoleChoices = [
  {
    role: "student",
    icon: <GraduationCap size={22} />,
    title: "학생으로 로그인",
    description: "프로그램 신청과 저장소 배정 상태 확인",
  },
  {
    role: "staff",
    icon: <UsersRound size={22} />,
    title: "교직원으로 로그인",
    description: "신청 검토, 보완 요청, 공개 전환 관리",
  },
] as const satisfies readonly RoleChoice[];

const supportRoleChoices = [
  {
    role: "public",
    icon: <UserRound size={16} />,
    title: "외부인 방문자",
    description: "공개 현황 보기",
  },
  {
    role: "admin",
    icon: <ShieldCheck size={16} />,
    title: "관리자",
    description: "권한과 감사 로그",
  },
] as const satisfies readonly RoleChoice[];

export function LoginPage({ notice, summary, onLogin, onReset, onNavigate }: LoginPageProps) {
  return (
    <main className="login-screen">
      <section className="login-minimal-page" aria-labelledby="login-title">
        <header className="login-minimal-nav">
          <button className="login-wordmark" type="button" onClick={() => onNavigate("/login")}>
            <span>JNU OSS Hub</span>
          </button>
          <div className="login-nav-actions">
            <button
              className="login-nav-link"
              type="button"
              onClick={() => onNavigate("/information")}
            >
              <LayoutGrid size={16} />
              화면 구조
            </button>
            <button className="login-nav-button" type="button" onClick={onReset}>
              <RotateCcw size={16} />
              시연 데이터 초기화
            </button>
          </div>
        </header>

        <div className="login-stage">
          <div className="login-side-doodles" aria-hidden="true">
            <span className="doodle-square" />
            <span className="doodle-circle" />
            <span className="doodle-line" />
          </div>

          <section className="auth-card" aria-labelledby="login-title">
            <p className="auth-kicker">전남대학교 소프트웨어중심대학사업단</p>
            <h1 id="login-title">JNU OSS Platform</h1>
            <p className="auth-description">
              본인 역할을 선택하면 필요한 화면으로 바로 이동합니다.
            </p>

            <section className="service-intro" aria-label="서비스 소개">
              <strong>OSS 프로그램 운영 플랫폼</strong>
              <span>
                사업단 프로그램 신청부터 GitHub 저장소 배정, 활동 검토, 공개 아카이브 전환까지 한
                화면에서 관리합니다.
              </span>
            </section>

            {notice.length > 0 ? <div className="notice-banner">{notice}</div> : null}

            <div className="role-login-list" aria-label="역할 선택">
              {mainRoleChoices.map((choice) => (
                <RoleLoginButton key={choice.role} choice={choice} onLogin={onLogin} />
              ))}
            </div>

            <div className="auth-divider">
              <span>보조 화면</span>
            </div>

            <div className="support-login-list" aria-label="보조 역할 선택">
              {supportRoleChoices.map((choice) => (
                <button
                  className="support-role-button"
                  type="button"
                  key={choice.role}
                  onClick={() => onLogin(choice.role)}
                >
                  {choice.icon}
                  <span>{choice.title}</span>
                </button>
              ))}
            </div>

            <p className="auth-status-line">
              <span>운영 프로그램 {summary.totalPrograms}건</span>
              <span>접수 중 {summary.openPrograms}건</span>
              <span>검토 대기 {summary.reviewQueue}건</span>
              <span>공개 자산 {summary.publishedAssets}개</span>
            </p>
          </section>

          <LoginIllustration />
        </div>

        <footer className="login-minimal-footer">
          <span>OSS 프로그램 신청, 검토, 공개 저장소 현황 관리</span>
          <span>2026 JNU SW-Centered University</span>
        </footer>
      </section>
    </main>
  );
}

function RoleLoginButton({
  choice,
  onLogin,
}: {
  readonly choice: RoleChoice;
  readonly onLogin: (role: RoleId) => void;
}) {
  return (
    <button className="role-login-button" type="button" onClick={() => onLogin(choice.role)}>
      <span className="role-login-icon">{choice.icon}</span>
      <span>
        <strong>{choice.title}</strong>
        <small>{choice.description}</small>
      </span>
    </button>
  );
}

function LoginIllustration() {
  return (
    <aside className="login-illustration" aria-hidden="true">
      <svg viewBox="0 0 360 360">
        <title>로그인 화면 장식 일러스트</title>
        <path d="M38 275h284" />
        <path d="M244 111c20 8 32 26 32 48v116" />
        <path d="M225 104c13-17 42-12 48 8 5 18-10 35-29 33" />
        <path d="M210 168c31 4 55 26 64 58" />
        <path d="M196 195c20 18 42 26 70 25" />
        <path d="M204 275v-72c0-18 13-33 31-36" />
        <path d="M126 152h74v52h-74z" />
        <path d="M139 170h48" />
        <path d="M139 187h30" />
        <path d="M103 275v-86h66v86" />
        <path d="M104 214h65" />
        <path d="M85 111c12-8 26-8 38 0" />
        <path d="M71 128c22-18 48-18 70 0" />
        <path d="M289 87c12 5 24 5 36 0" />
        <path d="M292 233c15-11 31-11 46 0" />
        <circle cx="76" cy="187" r="15" />
        <path d="M72 187h8" />
        <path d="M76 183v8" />
        <path d="M61 238h35v37H61z" />
        <path d="M67 247h23" />
        <path d="M67 257h17" />
      </svg>
    </aside>
  );
}
