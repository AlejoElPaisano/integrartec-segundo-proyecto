import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FileUp, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { parseForm } from "@/features/form-lab/utils";
import type { Form } from "@/features/form-lab/schema";

interface ImportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (form: Form) => void;
}

export function ImportFormModal({
  isOpen,
  onClose,
  onImport,
}: ImportFormModalProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setText("");
      setError(null);
      return;
    }
    const id = window.setTimeout(() => textareaRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImport = () => {
    const result = parseForm(text);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onImport(result.form);
    onClose();
  };

  const handleFile = async (file: File) => {
    try {
      const content = await file.text();
      setText(content);
      setError(null);
    } catch {
      setError("No se pudo leer el archivo seleccionado");
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-[fadeIn_150ms_ease-out]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-xl animate-[fadeIn_150ms_ease-out]">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2.5 text-primary">
            <FileUp size={22} aria-hidden="true" />
          </div>
          <div>
            <h3
              id="import-modal-title"
              className="text-lg font-semibold text-text"
            >
              Importar formulario
            </h3>
            <p className="text-sm text-text-muted">
              Pegá el JSON del formulario o cargá un archivo .json exportado
              previamente.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="sr-only">Contenido JSON del formulario</span>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError(null);
              }}
              rows={10}
              placeholder='{"name":"Mi formulario","fields":[...]}'
              className="w-full resize-y rounded-lg border border-border bg-background p-3 font-mono text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              aria-describedby={error ? "import-error" : undefined}
            />
          </label>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/json,.json";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (file) handleFile(file);
                };
                input.click();
              }}
            >
              Cargar archivo
            </Button>
            <span className="text-xs text-text-muted">
              El formulario se importa con ids nuevos.
            </span>
          </div>

          {error && (
            <div
              id="import-error"
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={text.trim().length === 0}
          >
            Importar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
