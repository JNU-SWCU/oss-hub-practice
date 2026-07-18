import { PlusCircle, Settings2 } from "lucide-react";
import type { DemoState } from "../domain";
import { programStatusLabel } from "./StaffWorkspace.helpers";

type StaffProgramOpsProps = {
  readonly state: DemoState;
  readonly selectedProgramId: string;
  readonly programTitle: string;
  readonly period: string;
  readonly deadline: string;
  readonly teamSize: string;
  readonly categoryText: string;
  readonly outputType: string;
  readonly applicationFields: string;
  readonly milestoneName: string;
  readonly milestoneDueDate: string;
  readonly deliverableType: string;
  readonly reminderPolicy: string;
  readonly onSelectedProgramChange: (programId: string) => void;
  readonly onProgramTitleChange: (value: string) => void;
  readonly onPeriodChange: (value: string) => void;
  readonly onDeadlineChange: (value: string) => void;
  readonly onTeamSizeChange: (value: string) => void;
  readonly onCategoryTextChange: (value: string) => void;
  readonly onOutputTypeChange: (value: string) => void;
  readonly onApplicationFieldsChange: (value: string) => void;
  readonly onMilestoneNameChange: (value: string) => void;
  readonly onMilestoneDueDateChange: (value: string) => void;
  readonly onDeliverableTypeChange: (value: string) => void;
  readonly onReminderPolicyChange: (value: string) => void;
  readonly onCreateProgram: () => void;
};

export function StaffProgramOps({
  state,
  selectedProgramId,
  programTitle,
  period,
  deadline,
  teamSize,
  categoryText,
  outputType,
  applicationFields,
  milestoneName,
  milestoneDueDate,
  deliverableType,
  reminderPolicy,
  onSelectedProgramChange,
  onProgramTitleChange,
  onPeriodChange,
  onDeadlineChange,
  onTeamSizeChange,
  onCategoryTextChange,
  onOutputTypeChange,
  onApplicationFieldsChange,
  onMilestoneNameChange,
  onMilestoneDueDateChange,
  onDeliverableTypeChange,
  onReminderPolicyChange,
  onCreateProgram,
}: StaffProgramOpsProps) {
  const selectedProgram =
    state.calls.find((call) => call.id === selectedProgramId) ?? state.calls[0];
  return (
    <section className="program-ops-grid span-wide" aria-label="사업단 프로그램 생성과 관리">
      <form className="form-panel" onSubmit={(event) => event.preventDefault()}>
        <p className="section-kicker">
          <PlusCircle size={15} />
          프로그램 생성
        </p>
        <h3>새 사업단 프로그램 초안</h3>
        <label>
          <span>프로그램명</span>
          <input
            value={programTitle}
            onChange={(event) => onProgramTitleChange(event.target.value)}
          />
        </label>
        <label>
          <span>운영 기간</span>
          <input value={period} onChange={(event) => onPeriodChange(event.target.value)} />
        </label>
        <label>
          <span>마감일</span>
          <input value={deadline} onChange={(event) => onDeadlineChange(event.target.value)} />
        </label>
        <label>
          <span>팀 인원</span>
          <input value={teamSize} onChange={(event) => onTeamSizeChange(event.target.value)} />
          <small>예: 2-4명. 학생 신청 단계에서 같은 기준을 보여줍니다.</small>
        </label>
        <label>
          <span>카테고리</span>
          <input
            value={categoryText}
            onChange={(event) => onCategoryTextChange(event.target.value)}
          />
          <small>쉼표로 구분합니다. 예: 배포, GitHub, Vercel</small>
        </label>
        <label>
          <span>산출물</span>
          <input value={outputType} onChange={(event) => onOutputTypeChange(event.target.value)} />
        </label>
        <label>
          <span>신청폼 항목</span>
          <input
            value={applicationFields}
            onChange={(event) => onApplicationFieldsChange(event.target.value)}
          />
          <small>기본 항목 외에 교직원이 추가로 확인할 질문입니다.</small>
        </label>
        <fieldset className="choice-fieldset">
          <legend>마일스톤 설정</legend>
          <label>
            <span>마일스톤명</span>
            <input
              value={milestoneName}
              onChange={(event) => onMilestoneNameChange(event.target.value)}
            />
          </label>
          <label>
            <span>제출 마감</span>
            <input
              value={milestoneDueDate}
              onChange={(event) => onMilestoneDueDateChange(event.target.value)}
            />
          </label>
          <label>
            <span>제출물 유형</span>
            <select
              value={deliverableType}
              onChange={(event) => onDeliverableTypeChange(event.target.value)}
            >
              <option value="repo-tag">저장소 태그</option>
              <option value="release">GitHub Release</option>
              <option value="file">파일</option>
              <option value="text">텍스트</option>
            </select>
          </label>
        </fieldset>
        <label>
          <span>알림 설정</span>
          <input
            value={reminderPolicy}
            onChange={(event) => onReminderPolicyChange(event.target.value)}
          />
          <small>마감 알림 메일 정책을 시연 데이터로 기록합니다.</small>
        </label>
        <button className="primary-action" type="button" onClick={onCreateProgram}>
          <PlusCircle size={18} />
          프로그램 초안 만들기
        </button>
      </form>
      <div className="table-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">
              <Settings2 size={15} />
              프로그램 관리
            </p>
            <h3>운영 프로그램 현황</h3>
            <p>초안은 예정 상태로 추가되고, 학생/외부인 화면의 프로그램 카드에도 반영됩니다.</p>
          </div>
          <label className="select-field">
            <span>운영 대회 선택</span>
            <select
              value={selectedProgram?.id ?? ""}
              onChange={(event) => onSelectedProgramChange(event.target.value)}
            >
              {state.calls.map((call) => (
                <option value={call.id} key={call.id}>
                  {call.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="table-scroll">
          <table aria-label="교직원 프로그램 관리 목록">
            <thead>
              <tr>
                <th>프로그램</th>
                <th>상태</th>
                <th>마감</th>
                <th>신청 팀</th>
                <th>공개 범위</th>
              </tr>
            </thead>
            <tbody>
              {state.calls.slice(0, 6).map((call) => (
                <tr key={call.id}>
                  <td data-label="프로그램">{call.title}</td>
                  <td data-label="상태">{programStatusLabel(call.status)}</td>
                  <td data-label="마감">{call.deadline}</td>
                  <td data-label="신청 팀">{call.teamCount}팀</td>
                  <td data-label="공개 범위">
                    {call.visibility === "public" ? "공개" : "내부 운영"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
