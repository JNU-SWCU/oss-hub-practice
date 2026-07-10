import { Github, GraduationCap, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import type { RoleId } from "../domain";

type LoginPageProps = {
  readonly notice: string;
  readonly onLogin: (role: RoleId) => void;
  readonly onReset: () => void;
};

export function LoginPage({ notice, onLogin, onReset }: LoginPageProps) {
  return (
    <main className="login-screen">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="brand-mark" aria-hidden="true">
            OSS
          </span>
          <div>
            <p className="institution">전남대학교 소프트웨어중심대학사업단</p>
            <h1 id="login-title">JNU OSS Platform</h1>
          </div>
        </div>
        <p className="login-summary">
          GitHub 계정과 교내 역할을 기준으로 대회 신청, 검토, 공개 자산 현황을 확인하는 프론트엔드
          시연 화면입니다.
        </p>
        {notice.length > 0 ? <div className="notice-banner">{notice}</div> : null}
        <div className="oauth-card" aria-label="GitHub OAuth mock login">
          <p className="section-kicker">GitHub OAuth</p>
          <button className="github-login" type="button" onClick={() => onLogin("student")}>
            <Github size={20} />
            GitHub로 계속하기
          </button>
          <p>
            실제 OAuth 이동은 생략하고, 학생이 GitHub 계정으로 로그인하는 흐름을 버튼으로
            재현합니다.
          </p>
        </div>
        <div className="persona-grid" aria-label="persona branches">
          <button type="button" onClick={() => onLogin("public")}>
            <UserRound size={18} />
            <span>외부인</span>
            <small>공개 대회와 published repo만 보기</small>
          </button>
          <button type="button" onClick={() => onLogin("student")}>
            <GraduationCap size={18} />
            <span>학생</span>
            <small>대회 선택 후 신청서 작성</small>
          </button>
          <button type="button" onClick={() => onLogin("staff")}>
            <UsersRound size={18} />
            <span>교직원</span>
            <small>신청 검토와 repo 배정 운영</small>
          </button>
          <button type="button" onClick={() => onLogin("admin")}>
            <ShieldCheck size={18} />
            <span>관리자</span>
            <small>사용자와 GitHub API health 관리</small>
          </button>
        </div>
        <button className="ghost-action compact" type="button" onClick={onReset}>
          시연 데이터 초기화
        </button>
      </section>
    </main>
  );
}
