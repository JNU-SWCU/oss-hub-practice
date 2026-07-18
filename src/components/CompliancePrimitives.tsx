import { AlertTriangle, CheckCircle2, LoaderCircle, RefreshCcw } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

export type ConfirmRequest = {
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly tone?: "warning" | "danger";
};

type ConfirmDialogProps = {
  readonly request: ConfirmRequest | undefined;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  readonly children?: ReactNode;
};

export function ConfirmDialog({ request, onCancel, onConfirm, children }: ConfirmDialogProps) {
  if (request === undefined) return null;
  const toneClass = request.tone === "danger" ? "is-danger" : "is-warning";
  return (
    <div className="dialog-backdrop" role="presentation">
      <dialog className={`confirm-dialog ${toneClass}`} aria-label={request.title} open>
        <AlertTriangle size={22} />
        <div>
          <h2>{request.title}</h2>
          <p>{request.description}</p>
        </div>
        {children}
        <div className="dialog-actions">
          <button className="ghost-action" type="button" onClick={onCancel}>
            취소
          </button>
          <button className="primary-action" type="button" onClick={onConfirm}>
            {request.confirmLabel}
          </button>
        </div>
      </dialog>
    </div>
  );
}

type ToastMessageProps = {
  readonly message: string;
  readonly onDismiss: () => void;
};

export function ToastMessage({ message, onDismiss }: ToastMessageProps) {
  if (message.length === 0) return null;
  return (
    <output className="toast-message">
      <CheckCircle2 size={18} />
      <span>{message}</span>
      <button type="button" onClick={onDismiss}>
        닫기
      </button>
    </output>
  );
}

export type DataStateKind = "loading" | "empty" | "error" | "success";

type DataStatePanelProps = {
  readonly state: DataStateKind;
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
};

export function DataStatePanel({
  state,
  title,
  description,
  actionLabel,
  onAction,
}: DataStatePanelProps) {
  const icon = state === "loading" ? <LoaderCircle size={18} /> : stateIcon(state);
  return (
    <div className={`data-state-panel is-${state}`}>
      {icon}
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      {actionLabel !== undefined && onAction !== undefined ? (
        <button className="ghost-action compact" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function useUnsavedChangesWarning(hasUnsavedChanges: boolean): void {
  useEffect(() => {
    if (!hasUnsavedChanges) return undefined;
    function handleBeforeUnload(event: BeforeUnloadEvent): void {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);
}

function stateIcon(state: Exclude<DataStateKind, "loading">) {
  switch (state) {
    case "empty":
      return <RefreshCcw size={18} />;
    case "error":
      return <AlertTriangle size={18} />;
    case "success":
      return <CheckCircle2 size={18} />;
    default:
      return assertNever(state);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unexpected data state: ${value}`);
}
