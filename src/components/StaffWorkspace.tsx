import { BarChart3, ClipboardList, FileCheck2 } from "lucide-react";
import { useState } from "react";
import type { DemoState, ProgramDraftInput } from "../domain";
import { ConfirmDialog, ToastMessage, useUnsavedChangesWarning } from "./CompliancePrimitives";
import { StaffMilestoneOps } from "./StaffMilestoneOps";
import { StaffProgramOps } from "./StaffProgramOps";
import { StaffReviewQueue } from "./StaffReviewQueue";
import {
  MetricCard,
  type PendingStaffAction,
  assertNever,
  initialProgramDraft,
  pendingActionRequest,
} from "./StaffWorkspace.helpers";

type StaffWorkspaceProps = {
  readonly state: DemoState;
  readonly onApproveTeam: (teamId: string) => void;
  readonly onRequestCorrection: (teamId: string, reason: string) => void;
  readonly onPublishTeam: (teamId: string) => void;
  readonly onCreateProgramDraft: (input: ProgramDraftInput) => void;
};

export function StaffWorkspace({
  state,
  onApproveTeam,
  onRequestCorrection,
  onPublishTeam,
  onCreateProgramDraft,
}: StaffWorkspaceProps) {
  const [programTitle, setProgramTitle] = useState<string>(initialProgramDraft.title);
  const [period, setPeriod] = useState<string>(initialProgramDraft.period);
  const [deadline, setDeadline] = useState<string>(initialProgramDraft.deadline);
  const [teamSize, setTeamSize] = useState<string>(initialProgramDraft.teamSize);
  const [categoryText, setCategoryText] = useState<string>(initialProgramDraft.categoryText);
  const [outputType, setOutputType] = useState<string>(initialProgramDraft.outputType);
  const [applicationFields, setApplicationFields] = useState<string>(
    initialProgramDraft.applicationFields,
  );
  const [milestoneName, setMilestoneName] = useState<string>(initialProgramDraft.milestoneName);
  const [milestoneDueDate, setMilestoneDueDate] = useState<string>(
    initialProgramDraft.milestoneDueDate,
  );
  const [deliverableType, setDeliverableType] = useState<string>(
    initialProgramDraft.deliverableType,
  );
  const [reminderPolicy, setReminderPolicy] = useState<string>(initialProgramDraft.reminderPolicy);
  const [selectedProgramId, setSelectedProgramId] = useState(state.calls[0]?.id ?? "");
  const [reviewQuery, setReviewQuery] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingStaffAction | undefined>(undefined);
  const [correctionReason, setCorrectionReason] = useState("GitHub ID와 제출 동의서를 확인하세요.");
  const [toast, setToast] = useState("");
  const hasUnsavedProgramDraft =
    programTitle !== initialProgramDraft.title ||
    period !== initialProgramDraft.period ||
    deadline !== initialProgramDraft.deadline ||
    teamSize !== initialProgramDraft.teamSize ||
    categoryText !== initialProgramDraft.categoryText ||
    outputType !== initialProgramDraft.outputType ||
    applicationFields !== initialProgramDraft.applicationFields ||
    milestoneName !== initialProgramDraft.milestoneName ||
    milestoneDueDate !== initialProgramDraft.milestoneDueDate ||
    deliverableType !== initialProgramDraft.deliverableType ||
    reminderPolicy !== initialProgramDraft.reminderPolicy;
  useUnsavedChangesWarning(hasUnsavedProgramDraft);
  const reviewTargets = state.teams.filter(
    (team) =>
      team.status === "submitted" || team.status === "correction" || team.status === "provisioned",
  );

  function handleCreateProgram(): void {
    const categories = categoryText
      .split(",")
      .map((category) => category.trim())
      .filter((category) => category.length > 0);
    onCreateProgramDraft({
      title: programTitle,
      host: "전남대학교 소프트웨어중심대학사업단",
      category: categories,
      period,
      deadline,
      teamSize,
      outputType,
      applicationFields: applicationFields
        .split(",")
        .map((field) => field.trim())
        .filter((field) => field.length > 0),
      milestoneName,
      milestoneDueDate,
      deliverableType,
      reminderPolicy,
    });
    setToast("프로그램 초안을 만들었습니다.");
  }

  function handlePendingActionChange(action: PendingStaffAction): void {
    if (action.kind === "correction") {
      setCorrectionReason("GitHub ID와 제출 동의서를 확인하세요.");
    }
    setPendingAction(action);
  }

  function confirmPendingAction(): void {
    if (pendingAction === undefined) return;
    const team = state.teams.find((candidate) => candidate.id === pendingAction.teamId);
    switch (pendingAction.kind) {
      case "approve":
        onApproveTeam(pendingAction.teamId);
        setToast(`${team?.name ?? "선택한 팀"}을 승인했습니다.`);
        break;
      case "correction":
        if (correctionReason.trim().length === 0) {
          setToast("보완 요청 사유를 입력해야 합니다.");
          return;
        }
        onRequestCorrection(pendingAction.teamId, correctionReason);
        setToast(`${team?.name ?? "선택한 팀"}에 보완 요청을 보냈습니다.`);
        break;
      case "publish":
        onPublishTeam(pendingAction.teamId);
        setToast(`${team?.name ?? "선택한 팀"}을 공개 자산으로 전환했습니다.`);
        break;
      default:
        assertNever(pendingAction);
    }
    setPendingAction(undefined);
  }

  return (
    <div className="workspace-grid">
      <ToastMessage message={toast} onDismiss={() => setToast("")} />
      <ConfirmDialog
        request={pendingActionRequest(pendingAction, state)}
        onCancel={() => setPendingAction(undefined)}
        onConfirm={confirmPendingAction}
      >
        {pendingAction?.kind === "correction" ? (
          <label className="dialog-field">
            <span>보완 요청 사유</span>
            <textarea
              value={correctionReason}
              onChange={(event) => setCorrectionReason(event.target.value)}
            />
          </label>
        ) : null}
      </ConfirmDialog>
      <div className="workspace-intro page-header">
        <p className="section-kicker">교직원 운영</p>
        <h2>교직원 공모 운영 및 검토</h2>
        <p>
          교직원은 대회 접수 현황, 제출 동의서/보고서 상태, 저장소 배정 상태, 자산화 후보를 한 번에
          점검합니다. 공지는 사업단 홈페이지가 담당하고, 이 화면은 접수와 GitHub 수합을 담당합니다.
        </p>
        <div className="notice-banner">
          교직원은 학교 계정 로그인을 가정합니다. 현재 화면은 프론트엔드 시연용 데이터로만
          동작합니다.
        </div>
      </div>
      <div className="metric-grid">
        <MetricCard
          icon={<ClipboardList size={18} />}
          label="총 신청 팀"
          value={`${state.calls[0]?.teamCount ?? 0}팀`}
        />
        <MetricCard
          icon={<FileCheck2 size={18} />}
          label="검토 대기"
          value={`${reviewTargets.length}건`}
        />
        <MetricCard icon={<BarChart3 size={18} />} label="자산화 후보" value="4건" />
      </div>
      <StaffProgramOps
        state={state}
        selectedProgramId={selectedProgramId}
        programTitle={programTitle}
        period={period}
        deadline={deadline}
        teamSize={teamSize}
        categoryText={categoryText}
        outputType={outputType}
        applicationFields={applicationFields}
        milestoneName={milestoneName}
        milestoneDueDate={milestoneDueDate}
        deliverableType={deliverableType}
        reminderPolicy={reminderPolicy}
        onSelectedProgramChange={setSelectedProgramId}
        onProgramTitleChange={setProgramTitle}
        onPeriodChange={setPeriod}
        onDeadlineChange={setDeadline}
        onTeamSizeChange={setTeamSize}
        onCategoryTextChange={setCategoryText}
        onOutputTypeChange={setOutputType}
        onApplicationFieldsChange={setApplicationFields}
        onMilestoneNameChange={setMilestoneName}
        onMilestoneDueDateChange={setMilestoneDueDate}
        onDeliverableTypeChange={setDeliverableType}
        onReminderPolicyChange={setReminderPolicy}
        onCreateProgram={handleCreateProgram}
      />
      <StaffMilestoneOps state={state} selectedProgramId={selectedProgramId} />
      <StaffReviewQueue
        teams={reviewTargets}
        reviewQuery={reviewQuery}
        onReviewQueryChange={setReviewQuery}
        onPendingActionChange={handlePendingActionChange}
      />
    </div>
  );
}
