import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/shared/lib/helpers";
import type { Toast, ToastType } from "@/features/notifications/schema";

const iconFor: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const stylesFor: Record<ToastType, string> = {
  success: "border-success/40 bg-surface text-text",
  error: "border-danger/40 bg-surface text-text",
  warning: "border-warning/40 bg-surface text-text",
  info: "border-primary/40 bg-surface text-text",
};

const iconColorFor: Record<ToastType, string> = {
  success: "text-success",
  error: "text-danger",
  warning: "text-warning",
  info: "text-primary",
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = iconFor[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <li
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm",
        "animate-toast-in",
        stylesFor[toast.type]
      )}
    >
      <Icon size={18} className={cn("mt-0.5 shrink-0", iconColorFor[toast.type])} />
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-text-muted hover:text-text transition-colors"
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </li>
  );
}
