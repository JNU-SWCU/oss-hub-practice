import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import type { Call, RoleId, Team } from "../../domain";

export type Navigate = (path: string) => void;

export function PageHeader({
  kicker,
  title,
  description,
}: {
  readonly kicker: string;
  readonly title: string;
  readonly description: string;
}) {
  return (
    <header className="page-header">
      <p className="section-kicker">{kicker}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

export function SectionTitle({
  icon,
  title,
  count,
}: {
  readonly icon: ReactNode;
  readonly title: string;
  readonly count: string;
}) {
  return (
    <div className="section-title">
      {icon}
      <h2>{title}</h2>
      <span>{count}</span>
    </div>
  );
}

export function Fact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function CompetitionCard({
  call,
  persona,
  onNavigate,
}: {
  readonly call: Call;
  readonly persona: RoleId;
  readonly onNavigate: Navigate;
}) {
  const cta = persona === "student" && call.status === "open" ? "상세/신청" : "상세 보기";
  return (
    <article className="competition-card challenge-card">
      <div className="card-topline">
        <span className="status-pill">{statusLabel(call.status)}</span>
        <span>{call.visibility === "public" ? "공개" : "내부 운영"}</span>
      </div>
      <h2>{call.title}</h2>
      <p>{call.summary}</p>
      <div className="tag-row">
        {call.category.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <dl>
        <Fact label="마감" value={call.deadline} />
        <Fact label="신청 팀" value={`${call.teamCount}팀`} />
        <Fact label="산출물" value={call.outputType} />
      </dl>
      <button
        className="primary-action"
        type="button"
        onClick={() => onNavigate(`/competitions/${call.id}`)}
      >
        <ExternalLink size={16} />
        {cta}
      </button>
    </article>
  );
}

export function PublishedAssets({
  teams,
  limit,
}: {
  readonly teams: readonly Team[];
  readonly limit?: number;
}) {
  const visibleTeams = limit === undefined ? teams : teams.slice(0, limit);
  if (visibleTeams.length === 0) {
    return <p className="empty-state">아직 공개 전환된 저장소 자산이 없습니다.</p>;
  }
  return (
    <div className="asset-strip">
      {visibleTeams.map((team) => (
        <article className="asset-card" key={team.id}>
          <span className="status-pill">{team.contest}</span>
          <h3>{team.name}</h3>
          <p>{team.repo}</p>
          <dl>
            <Fact label="커밋" value={`${team.commits}`} />
            <Fact label="PR" value={`${team.prs}`} />
            <Fact label="스타" value={`${team.stars}`} />
          </dl>
        </article>
      ))}
    </div>
  );
}

export function statusLabel(status: Call["status"]): string {
  const labels: Record<Call["status"], string> = {
    open: "접수중",
    upcoming: "예정",
    active: "진행중",
    reviewing: "검토중",
    closed: "종료",
    always: "상시",
  };
  return labels[status];
}
