import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/helpers";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
}

export function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  isDangerous = false,
}: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Keyboard support: ESC closes, Enter confirms
  useEffect(() => {
    if (!isOpen) return;

    // Save current active element to restore it later
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      } else if (event.key === "Enter") {
        // Prevent submitting underlying form if focus is somewhere else
        event.preventDefault();
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Focus the modal container or confirmation button for accessibility
    if (containerRef.current) {
      const focusable = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        // If dangerous, focus the cancel button first for safety,
        // otherwise focus the confirm button (usually the last button in the DOM)
        const elementToFocus = isDangerous
          ? (focusable[0] as HTMLElement) // Cancel button
          : (focusable[focusable.length - 1] as HTMLElement); // Confirm button
        elementToFocus?.focus();
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Restore focus on close
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onConfirm, onCancel, isDangerous]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity animate-[fadeIn_150ms_ease-out]"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div
        ref={containerRef}
        className={cn(
          "relative w-full max-w-md bg-surface border border-border rounded-xl shadow-xl p-6",
          "flex flex-col gap-4 animate-[fadeIn_150ms_ease-out]",
          "z-10 focus:outline-none"
        )}
        tabIndex={-1}
      >
        <div className="flex gap-4 items-start">
          <div
            className={cn(
              "p-2.5 rounded-full shrink-0",
              isDangerous
                ? "bg-danger/10 text-danger"
                : "bg-primary/10 text-primary"
            )}
          >
            {isDangerous ? <AlertTriangle size={22} /> : <Info size={22} />}
          </div>

          <div className="flex-1 space-y-1">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-text leading-6"
            >
              {title}
            </h3>
            <p id="modal-message" className="text-sm text-text-muted">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={isDangerous ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
