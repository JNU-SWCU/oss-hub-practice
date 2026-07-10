import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import type { RoleId } from "../domain";

export const landingByRole: Record<RoleId, string> = {
  public: "/public/dashboard",
  student: "/competitions?status=open",
  staff: "/staff/operations",
  admin: "/admin/console",
};

const roleLabels: Record<RoleId, string> = {
  public: "외부인",
  student: "학생",
  staff: "교직원",
  admin: "관리자",
};

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
          <span className="brand-mark" aria-hidden="true">
            OSS
          </span>
          <span>
            <span className="institution">전남대학교 소프트웨어중심대학사업단</span>
            <strong>JNU OSS Platform</strong>
          </span>
        </button>
        <nav className="app-nav" aria-label="주요 화면">
          <button type="button" onClick={() => onNavigate("/competitions")}>
            대회 센터
          </button>
          <button type="button" onClick={() => onNavigate("/public/dashboard")}>
            공개 현황
          </button>
          {role === "student" ? (
            <button type="button" onClick={() => onNavigate("/student/dashboard")}>
              내 신청
            </button>
          ) : null}
          {role === "staff" ? (
            <button type="button" onClick={() => onNavigate("/staff/operations")}>
              검토 큐
            </button>
          ) : null}
          {role === "admin" ? (
            <button type="button" onClick={() => onNavigate("/admin/console")}>
              관리자
            </button>
          ) : null}
        </nav>
        <div className="account-chip">
          <span>{roleLabels[role]}</span>
          <button type="button" onClick={() => onNavigate("/login")}>
            <LogOut size={15} />
            persona 변경
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
