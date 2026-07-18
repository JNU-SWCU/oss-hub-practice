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

type NavGroup = {
  readonly label: string;
  readonly path: string;
};

const navGroups: readonly NavGroup[] = [
  {
    label: "프로그램",
    path: "/competitions",
  },
  {
    label: "공개 아카이브",
    path: "/public/dashboard",
  },
  {
    label: "서비스 안내",
    path: "/information",
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
            <button type="button" key={group.label} onClick={() => onNavigate(group.path)}>
              {group.label}
            </button>
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
      <div className="demo-mode-banner" role="note">
        프론트엔드 시연 모드입니다. 실제 GitHub OAuth와 서버 DB 없이 브라우저에 데모 상태를
        저장합니다.
      </div>
      {children}
    </div>
  );
}
