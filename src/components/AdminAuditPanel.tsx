import type { DemoState } from "../domain";
import { auditActionLabel, auditActorLabel, auditTargetLabel } from "./admin-workspace-labels";

type AdminAuditPanelProps = {
  readonly audit: DemoState["audit"];
};

export function AdminAuditPanel({ audit }: AdminAuditPanelProps) {
  return (
    <div className="table-panel span-wide">
      <div className="panel-heading">
        <div>
          <h3>감사 로그</h3>
          <p>사용자, 검토, API 상태 변경이 최근 순서로 남습니다.</p>
        </div>
      </div>
      <div className="audit-list" aria-label="감사 로그">
        {audit.slice(0, 6).map((event, index) => (
          <article className="audit-item" key={`${event.id}-${index}`}>
            <strong>{auditActionLabel(event.action)}</strong>
            <span>{auditTargetLabel(event.target)}</span>
            <small>
              {auditActorLabel(event.actor)} · {event.time}
            </small>
          </article>
        ))}
      </div>
    </div>
  );
}
