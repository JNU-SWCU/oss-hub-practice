import { ArrowLeft, FileText } from "lucide-react";
import type { Call, MetricId, RoleId, Team } from "../../domain";
import { StudentJourney } from "../StudentJourney";
import {
  CompetitionDetailPanel,
  type DetailTab,
  detailTabs,
  publicDetailTabs,
} from "./CompetitionDetailPanel";
import { Fact, type Navigate, statusLabel } from "./shared";

type CompetitionDetailProps = {
  readonly competition: Call;
  readonly role: RoleId;
  readonly teams: readonly Team[];
  readonly metric: MetricId;
  readonly onMetricChange: (metric: MetricId) => void;
  readonly onNavigate: Navigate;
};

export function CompetitionDetail({
  competition,
  role,
  teams,
  metric,
  onMetricChange,
  onNavigate,
}: CompetitionDetailProps) {
  const availableTabs = role === "public" ? publicDetailTabs : detailTabs;
  const activeTab = parseTab(new URLSearchParams(window.location.search).get("tab"), availableTabs);
  const competitionTeams = teams.filter((team) => team.competitionId === competition.id);
  const publicTeams = competitionTeams.filter((team) => team.status === "published");

  return (
    <main className={role === "student" ? "page-shell student-flow-page" : "page-shell"}>
      {role === "student" ? <StudentJourney current="program" /> : null}
      <button className="text-link" type="button" onClick={() => onNavigate("/competitions")}>
        <ArrowLeft size={16} />
        대회 센터
      </button>
      <section className="detail-grid">
        <article className="detail-main">
          <span className="status-pill">{statusLabel(competition.status)}</span>
          <h1>{competition.title}</h1>
          <p>{competition.summary}</p>
          <div className="tag-row">
            {competition.category.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <dl className="facts-grid">
            <Fact label="주관" value={competition.host} />
            <Fact label="기간" value={competition.period} />
            <Fact label="신청 마감" value={competition.deadline} />
            <Fact label="팀 구성" value={competition.teamSize} />
            <Fact label="지원 대상" value={competition.eligibility} />
            <Fact label="신청 팀" value={`${competition.teamCount}팀`} />
          </dl>
        </article>
        <aside className="action-panel" aria-label="역할별 다음 작업">
          <h2>다음 작업</h2>
          <p>{actionDescription(role, competition.status)}</p>
          {role === "student" && competition.status === "open" ? (
            <button
              className="primary-action"
              type="button"
              onClick={() => onNavigate(`/competitions/${competition.id}/apply`)}
            >
              <FileText size={18} />
              신청서 작성
            </button>
          ) : null}
          {role === "staff" ? (
            <button
              className="primary-action"
              type="button"
              onClick={() => onNavigate("/staff/operations")}
            >
              검토 큐 열기
            </button>
          ) : null}
          {role === "admin" ? (
            <button
              className="primary-action"
              type="button"
              onClick={() => onNavigate("/admin/console")}
            >
              관리자 콘솔
            </button>
          ) : null}
          {role === "public" ? (
            <button
              className="ghost-action"
              type="button"
              onClick={() => onNavigate("/public/dashboard")}
            >
              공개 리더보드
            </button>
          ) : null}
        </aside>
      </section>
      <nav className="tab-rail" aria-label="대회 상세 탭">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "segmented is-active" : "segmented"}
            type="button"
            onClick={() => onNavigate(`/competitions/${competition.id}?tab=${tab.id}`)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <CompetitionDetailPanel
        activeTab={activeTab}
        competition={competition}
        competitionTeams={competitionTeams}
        publicTeams={publicTeams}
        metric={metric}
        onMetricChange={onMetricChange}
        audience={role === "public" ? "public" : "internal"}
      />
    </main>
  );
}

function parseTab(
  value: string | null,
  availableTabs: readonly { readonly id: DetailTab; readonly label: string }[],
): DetailTab {
  return availableTabs.find((tab) => tab.id === value)?.id ?? "overview";
}

function actionDescription(role: RoleId, status: Call["status"]): string {
  if (role === "student") {
    return status === "open"
      ? "신청서를 작성하면 팀 GitHub ID 수합과 repo 배정 대기가 시작됩니다."
      : "현재 상태에서는 신규 신청을 받지 않습니다.";
  }
  if (role === "staff")
    return "교직원은 신청자 수, 검토 큐, repo 배정, 공개 전환 상태를 관리합니다.";
  if (role === "admin")
    return "관리자는 사용자 권한과 GitHub API 호출 상태를 별도 콘솔에서 점검합니다.";
  return "외부인은 공개 대회, 공개 저장소, 활동 리더보드만 볼 수 있습니다.";
}
