import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Copy, Check, Code2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { serializeForm } from "@/features/form-lab/utils";
import type { Form } from "@/features/form-lab/schema";

interface JsonPreviewModalProps {
  form: Form;
  isOpen: boolean;
  onClose: () => void;
}

export function JsonPreviewModal({ form, isOpen, onClose }: JsonPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  const json = serializeForm(form);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore if clipboard unavailable
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="json-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
        onClick={onClose}
      />
      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-2xl animate-[fadeIn_150ms_ease-out]">
        <div className="flex items-center justify-between">
          <h2
            id="json-modal-title"
            className="flex items-center gap-2 text-lg font-semibold text-text"
          >
            <Code2 size={20} className="text-primary" aria-hidden="true" />
            Vista de código
            <span className="text-sm font-normal text-text-muted">— {form.name}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-text transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-text-muted">
          Así modela Zod los datos de tu formulario. Este JSON es lo que se
          guarda y valida internamente.
        </p>

        <div className="relative">
          <pre
            className="max-h-[50vh] overflow-auto rounded-lg bg-[#0f172a] p-4 text-xs leading-relaxed text-[#e2e8f0] font-mono"
            tabIndex={0}
            aria-label="JSON del formulario"
          >
            <code>{json}</code>
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/20"
            aria-label="Copiar JSON al portapapeles"
          >
            {copied ? (
              <>
                <Check size={12} />
                Copiado
              </>
            ) : (
              <>
                <Copy size={12} />
                Copiar
              </>
            )}
          </button>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
