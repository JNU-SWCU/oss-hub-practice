import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import type { RoleId } from "../domain";

export const landingByRole: Record<RoleId, string> = {
  public: "/public/dashboard",
  student: "/student/dashboard",
  staff: "/staff/operations",
  admin: "/admin/console",
};

const roleLabels: Record<RoleId, string> = {
  public: "외부인",
  student: "학생",
  staff: "교직원",
  admin: "관리자",
};

type NavItem = {
  readonly label: string;
  readonly path: string;
  readonly description: string;
};

type NavGroup = {
  readonly label: string;
  readonly path: string;
  readonly items: readonly NavItem[];
};

const navGroups: readonly NavGroup[] = [
  {
    label: "프로그램",
    path: "/competitions",
    items: [
      {
        label: "전체 프로그램",
        path: "/competitions",
        description: "접수 중인 사업단 프로그램을 확인합니다.",
      },
      {
        label: "공개 대회",
        path: "/public/dashboard",
        description: "외부 공개 상태인 대회와 저장소를 봅니다.",
      },
    ],
  },
  {
    label: "공개 아카이브",
    path: "/public/dashboard",
    items: [
      {
        label: "공개 현황",
        path: "/public/dashboard",
        description: "공개 전환된 팀과 저장소만 확인합니다.",
      },
      {
        label: "활동 리더보드",
        path: "/public/dashboard",
        description: "커밋, PR, 저장소 활동량을 비교합니다.",
      },
    ],
  },
  {
    label: "서비스 안내",
    path: "/information",
    items: [
      {
        label: "이용 구조",
        path: "/information",
        description: "역할별 시작점과 화면 흐름을 봅니다.",
      },
      {
        label: "역할 선택",
        path: "/login",
        description: "학생, 교직원, 외부 방문자로 다시 들어갑니다.",
      },
    ],
  },
];

type AppShellProps = {
  readonly role: RoleId;
  readonly children: ReactNode;
  readonly onNavigate: (path: string) => void;
};

export function AppShell({ role, children, onNavigate }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand-block brand-button"
          type="button"
          onClick={() => onNavigate(landingByRole[role])}
        >
          <span>
            <span className="institution">전남대학교 소프트웨어중심대학사업단</span>
            <strong>Program Archive</strong>
          </span>
        </button>
        <nav className="app-nav" aria-label="주요 화면">
          {navGroups.map((group) => (
            <div className="nav-menu" key={group.label}>
              <button type="button" onClick={() => onNavigate(group.path)}>
                {group.label}
              </button>
              <div className="nav-dropdown">
                {group.items.map((item) => (
                  <button type="button" key={item.label} onClick={() => onNavigate(item.path)}>
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {role === "student" ? (
            <button
              className="nav-direct"
              type="button"
              onClick={() => onNavigate("/student/dashboard")}
            >
              내 대시보드
            </button>
          ) : null}
          {role === "staff" || role === "admin" ? (
            <button
              className="nav-direct"
              type="button"
              onClick={() => onNavigate("/staff/operations")}
            >
              검토 큐
            </button>
          ) : null}
          {role === "admin" ? (
            <button
              className="nav-direct"
              type="button"
              onClick={() => onNavigate("/admin/console")}
            >
              관리자
            </button>
          ) : null}
        </nav>
        <div className="account-chip">
          <span>{roleLabels[role]} 시연</span>
          <button type="button" onClick={() => onNavigate("/login")}>
            <LogOut size={15} />
            역할 바꾸기
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
