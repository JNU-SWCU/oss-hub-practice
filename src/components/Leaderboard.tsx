import { Download, SlidersHorizontal } from "lucide-react";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { leaderboardValue, metricIds } from "../domain";
import type { MetricId, Team } from "../domain";

const metricLabels: Record<MetricId, string> = {
  activity: "종합 활동량",
  commits: "커밋",
  prs: "PR",
  stars: "스타",
  repos: "저장소",
};

type LeaderboardProps = {
  readonly teams: readonly Team[];
  readonly metric: MetricId;
  readonly onMetricChange: (metric: MetricId) => void;
  readonly publicOnly: boolean;
};

export function Leaderboard({ teams, metric, onMetricChange, publicOnly }: LeaderboardProps) {
  const [tab, setTab] = useState<"team" | "student">("team");
  const activeTab = publicOnly ? "team" : tab;
  const rows = useMemo(
    () =>
      [...teams]
        .sort((left, right) => leaderboardValue(right, metric) - leaderboardValue(left, metric))
        .map((team, index) => ({ team, rank: index + 1, score: leaderboardValue(team, metric) })),
    [metric, teams],
  );
  const indicators = useMemo(() => createIndicators(teams), [teams]);

  return (
    <div className="table-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">순위 현황</p>
          <h2>OSS 활동 리더보드</h2>
          <p>
            GitHub 활동량 스냅샷이며 공식 평가/마일리지/FORCE 점수가 아닙니다. 기준 시각: 2026-07-06
            19:00 KST, 연간 초기화: 2026-12-31 23:59 KST.
          </p>
        </div>
        <div className="panel-controls">
          <button
            className={activeTab === "team" ? "segmented is-active" : "segmented"}
            type="button"
            onClick={() => setTab("team")}
          >
            팀 리더보드
          </button>
          {!publicOnly && (
            <button
              className={activeTab === "student" ? "segmented is-active" : "segmented"}
              type="button"
              onClick={() => setTab("student")}
            >
              개인 리더보드
            </button>
          )}
          <label className="select-field">
            <SlidersHorizontal size={16} />
            <span>지표</span>
            <select
              value={metric}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                const selectedMetric = parseMetricId(event.target.value);
                if (selectedMetric !== undefined) {
                  onMetricChange(selectedMetric);
                }
              }}
            >
              {Object.entries(metricLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="indicator-grid" aria-label="OSS 활동 관찰 지표">
        {indicators.map((indicator) => (
          <article className="indicator-card" key={indicator.label}>
            <span>{indicator.label}</span>
            <strong>{indicator.value}</strong>
            <small>{indicator.description}</small>
            <div className="indicator-meter" aria-hidden="true">
              <span style={{ inlineSize: `${indicator.percent}%` }} />
            </div>
          </article>
        ))}
      </div>

      <div className="table-scroll">
        <table aria-label={activeTab === "team" ? "팀 리더보드" : "개인 리더보드"}>
          <thead>
            <tr>
              <th>순위</th>
              <th>{activeTab === "team" ? "팀/프로젝트" : "대표 GitHub ID"}</th>
              <th>선택 지표</th>
              <th>커밋</th>
              <th>PR</th>
              <th>스타</th>
              <th>저장소</th>
              <th>최근 활동</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ team, rank, score }) => (
              <tr key={`${activeTab}-${team.id}`}>
                <td data-label="순위">
                  <strong>#{rank}</strong>
                  <span className={rank < 4 ? "rank-delta positive" : "rank-delta"}>
                    +{4 - rank}
                  </span>
                </td>
                <td data-label={activeTab === "team" ? "팀/프로젝트" : "대표 GitHub ID"}>
                  <span className="name-stack">
                    <strong>
                      {activeTab === "team" ? team.name : (team.members[0] ?? "jnu-oss")}
                    </strong>
                    <small>{publicOnly ? team.repo : `${team.contest} · ${team.repo}`}</small>
                  </span>
                </td>
                <td data-label="선택 지표">{score.toLocaleString("ko-KR")}</td>
                <td data-label="커밋">{team.commits}</td>
                <td data-label="PR">{team.prs}</td>
                <td data-label="스타">{team.stars}</td>
                <td data-label="저장소">{team.repos}</td>
                <td data-label="최근 활동">{team.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="ghost-action compact" type="button">
        <Download size={16} />
        CSV 내보내기
      </button>
    </div>
  );
}

function parseMetricId(value: string): MetricId | undefined {
  return metricIds.find((metric) => metric === value);
}

function createIndicators(teams: readonly Team[]): readonly {
  readonly label: string;
  readonly value: string;
  readonly description: string;
  readonly percent: number;
}[] {
  const totalCommits = teams.reduce((sum, team) => sum + team.commits, 0);
  const totalPrs = teams.reduce((sum, team) => sum + team.prs, 0);
  const totalRepos = teams.reduce((sum, team) => sum + team.repos, 0);
  const publishedCount = teams.filter((team) => team.status === "published").length;
  const denominator = Math.max(teams.length, 1);

  return [
    {
      label: "활동성",
      value: `${totalCommits.toLocaleString("ko-KR")} 커밋`,
      description: "선택 범위의 총 커밋",
      percent: clampPercent(totalCommits / 14),
    },
    {
      label: "협업성",
      value: `${totalPrs.toLocaleString("ko-KR")} PR`,
      description: "팀 단위 PR 흐름",
      percent: clampPercent(totalPrs * 2),
    },
    {
      label: "지속성",
      value: `${teams.filter((team) => team.lastActive >= "2026-07-01").length}팀`,
      description: "최근 활동 팀",
      percent: clampPercent(
        (teams.filter((team) => team.lastActive >= "2026-07-01").length / denominator) * 100,
      ),
    },
    {
      label: "저장소 준비도",
      value: `${totalRepos} repo`,
      description: "자산화 대상 저장소",
      percent: clampPercent(totalRepos * 12),
    },
    {
      label: "자산화 준비도",
      value: `${publishedCount}/${teams.length}팀`,
      description: "공개 전환 완료 비율",
      percent: clampPercent((publishedCount / denominator) * 100),
    },
  ];
}

function clampPercent(value: number): number {
  return Math.max(8, Math.min(100, Math.round(value)));
}
