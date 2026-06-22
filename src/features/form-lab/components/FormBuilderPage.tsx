import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
  Palette,
  Eye,
  Sparkles,
  Maximize2,
  Share2,
  Code2,
  Undo2,
  Redo2,
  BarChart2,
  Tag,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { FormMetadataCard } from "./FormMetadataCard";
import { FieldList } from "./FieldList";
import { FormStatsCard } from "./FormStatsCard";
import { FormTagsInput } from "./FormTagsInput";
import { JsonPreviewModal } from "./JsonPreviewModal";
import { useFormLabStore } from "@/features/form-lab/store";
import { useFormById } from "@/features/form-lab/hooks/useFormLab";
import { useHistory } from "@/features/form-lab/hooks/useHistory";
import { formSchema, type Form, type FormField } from "@/features/form-lab/schema";
import { encodeFormToBase64 } from "@/features/form-lab/utils";
import { ThemeDrawer } from "@/features/form-theme/components/ThemeDrawer";
import { LiveThemePreview } from "@/features/form-theme/components/LiveThemePreview";
import { ThemePreviewModal } from "@/features/form-theme/components/ThemePreviewModal";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { useToast } from "@/features/notifications/hooks/useToast";
import { useKeyboardShortcut } from "@/shared/hooks/useKeyboardShortcut";
import { TourOverlay } from "@/features/onboarding/components/TourOverlay";
import { cn } from "@/shared/lib/helpers";

const AUTO_SAVE_DELAY_MS = 2000;

function createEmptyForm(): Form {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    tags: [],
    fields: [],
    createdAt: new Date().toISOString(),
    theme: undefined,
  };
}

type SidebarTab = "preview" | "stats";

export function FormBuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formId = searchParams.get("id");

  const addForm = useFormLabStore((state) => state.addForm);
  const updateForm = useFormLabStore((state) => state.updateForm);
  const existingForm = useFormById(formId ?? undefined);
  const { success: showSuccess, error: showError } = useToast();

  const { theme, isDrawerOpen, openDrawer } = useFormTheme({
    initialTheme: existingForm?.theme,
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("preview");

  // Auto-save indicator
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saved" | "unsaved">("idle");
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Undo/redo
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methods = useForm<Form, any, Form>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: existingForm ?? createEmptyForm(),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { handleSubmit, watch, setValue, reset, getValues, formState } = methods;
  const name = watch("name");
  const fields = watch("fields") ?? [];
  const tags = watch("tags") ?? [];

  useEffect(() => {
    if (!existingForm) return;
    reset(existingForm);
    history.clearHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingForm?.id, reset]);

  // Auto-save: debounce changes and save if form has a name
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setAutoSaveStatus("unsaved");
    autoSaveTimerRef.current = setTimeout(() => {
      const current = getValues();
      if (!current.name?.trim()) return;
      const formData: Form = { ...current, theme };
      if (existingForm) {
        updateForm(formData);
        setAutoSaveStatus("saved");
      }
    }, AUTO_SAVE_DELAY_MS);
  }, [existingForm, getValues, theme, updateForm]);

  // Watch changes for auto-save (existing forms only)
  useEffect(() => {
    if (!existingForm) return;
    const subscription = methods.watch(() => scheduleAutoSave());
    return () => {
      subscription.unsubscribe();
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [existingForm, methods, scheduleAutoSave]);

  const handleFieldsChange = (updatedFields: FormField[]) => {
    // Push current state to history before changing
    history.pushHistory({ ...getValues(), fields, theme });
    setValue("fields", updatedFields, { shouldValidate: false });
  };

  const handleUndo = useCallback(() => {
    const current: Form = { ...getValues(), fields, theme };
    const prev = history.undo(current);
    if (!prev) return;
    reset(prev);
  }, [history, getValues, fields, theme, reset]);

  const handleRedo = useCallback(() => {
    const current: Form = { ...getValues(), fields, theme };
    const next = history.redo(current);
    if (!next) return;
    reset(next);
  }, [history, getValues, fields, theme, reset]);

  const onSubmit = (values: Form) => {
    const formData: Form = { ...values, theme };
    if (existingForm) {
      updateForm(formData);
    } else {
      addForm(formData);
    }
    showSuccess(existingForm ? "Formulario actualizado" : "Formulario guardado");
    navigate("/forms");
  };

  const isFormNameValid = name.trim().length > 0;

  const handleShare = async () => {
    const shareableForm: Form = { ...getValues(), theme };
    const shareUrl = new URL("/share", window.location.origin);
    shareUrl.searchParams.set("data", encodeFormToBase64(shareableForm));

    if (!navigator.clipboard) {
      showError("No se pudo acceder al portapapeles");
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl.toString());
      showSuccess("Enlace copiado al portapapeles");
    } catch {
      showError("No se pudo copiar el enlace");
    }
  };

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────
  // Cmd/Ctrl+S → save
  useKeyboardShortcut("s", () => {
    if (isFormNameValid) handleSubmit(onSubmit)();
  }, { metaKey: true });
  useKeyboardShortcut("s", () => {
    if (isFormNameValid) handleSubmit(onSubmit)();
  }, { ctrlKey: true });

  // Cmd/Ctrl+E → open preview
  useKeyboardShortcut("e", () => setIsPreviewOpen(true), { metaKey: true });
  useKeyboardShortcut("e", () => setIsPreviewOpen(true), { ctrlKey: true });

  // Cmd/Ctrl+Z → undo
  useKeyboardShortcut("z", handleUndo, { metaKey: true });
  useKeyboardShortcut("z", handleUndo, { ctrlKey: true });

  // Cmd/Ctrl+Shift+Z → redo
  useKeyboardShortcut("z", handleRedo, { metaKey: true, shiftKey: true });
  useKeyboardShortcut("z", handleRedo, { ctrlKey: true, shiftKey: true });

  // Cmd+Shift+J → JSON view
  useKeyboardShortcut("j", () => setIsJsonOpen(true), { metaKey: true, shiftKey: true });
  useKeyboardShortcut("j", () => setIsJsonOpen(true), { ctrlKey: true, shiftKey: true });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/forms")}>
                <ArrowLeft size={16} />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-bold text-text sm:text-2xl">
                  {existingForm ? "Editar formulario" : "Crear formulario"}
                </h1>
                {/* Auto-save indicator (only for existing forms) */}
                {existingForm && (
                  <p
                    className={cn(
                      "text-xs transition-colors",
                      autoSaveStatus === "saved" && "text-success",
                      autoSaveStatus === "unsaved" && "text-text-muted",
                      autoSaveStatus === "idle" && "text-transparent"
                    )}
                    aria-live="polite"
                  >
                    {autoSaveStatus === "saved" && "✓ Auto-guardado"}
                    {autoSaveStatus === "unsaved" && "Cambios sin guardar..."}
                    {autoSaveStatus === "idle" && "—"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Undo/Redo */}
              <div className="flex items-center rounded-lg border border-border bg-surface">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!history.canUndo}
                  className="flex h-9 w-9 items-center justify-center rounded-l-lg text-text-muted transition-colors hover:bg-background hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Deshacer (Ctrl+Z)"
                  title="Deshacer (Ctrl+Z)"
                >
                  <Undo2 size={15} />
                </button>
                <div className="h-5 w-px bg-border" aria-hidden="true" />
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={!history.canRedo}
                  className="flex h-9 w-9 items-center justify-center rounded-r-lg text-text-muted transition-colors hover:bg-background hover:text-text disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Rehacer (Ctrl+Shift+Z)"
                  title="Rehacer (Ctrl+Shift+Z)"
                >
                  <Redo2 size={15} />
                </button>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsJsonOpen(true)}
                title="Ver JSON (Ctrl+Shift+J)"
              >
                <Code2 size={15} />
                <span className="hidden sm:inline">Ver JSON</span>
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={openDrawer}
                className="gap-2 border-2 border-primary/20 hover:border-primary/40"
              >
                <Palette size={16} />
                <span className="hidden sm:inline">Personalizar diseño</span>
                <span className="sm:hidden">Diseño</span>
                <Sparkles size={14} className="text-primary" />
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleShare}
                disabled={!isFormNameValid}
                title="Compartir"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Compartir</span>
              </Button>

              <Button
                type="submit"
                disabled={!isFormNameValid}
                title="Guardar (Ctrl+S)"
              >
                <Save size={16} />
                Guardar
              </Button>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
            {/* Main column */}
            <div className="space-y-6">
              <FormMetadataCard />

              {/* Tags */}
              <Card className="p-6">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
                  <Tag size={15} className="text-text-muted" />
                  Etiquetas
                </label>
                <FormTagsInput
                  tags={tags}
                  onChange={(newTags) =>
                    setValue("tags", newTags, { shouldValidate: false })
                  }
                />
                <p className="mt-1.5 text-xs text-text-muted">
                  Presioná Enter o coma para agregar. Sirven para filtrar en "Mis formularios".
                </p>
              </Card>

              <FieldList fields={fields} onChange={handleFieldsChange} />

              {Object.keys(formState.errors).length > 0 && (
                <Card className="border-danger p-4">
                  <p className="text-sm text-danger">
                    Revisá los campos antes de guardar. Asegurate de que todos
                    los campos tengan un label y que el nombre del formulario no
                    esté vacío.
                  </p>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-6 h-fit space-y-4">
              {/* Sidebar tabs */}
              <div
                role="tablist"
                className="flex gap-1 rounded-lg border border-border bg-surface p-1"
                aria-label="Opciones del panel lateral"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={sidebarTab === "preview"}
                  onClick={() => setSidebarTab("preview")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors",
                    sidebarTab === "preview"
                      ? "bg-background text-text shadow-sm"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  <Eye size={14} />
                  Diseño
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={sidebarTab === "stats"}
                  onClick={() => setSidebarTab("stats")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors",
                    sidebarTab === "stats"
                      ? "bg-background text-text shadow-sm"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  <BarChart2 size={14} />
                  Estadísticas
                </button>
              </div>

              {sidebarTab === "preview" && (
                <section aria-labelledby="preview-heading">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h2
                      id="preview-heading"
                      className="text-sm font-semibold text-text-muted"
                    >
                      Vista previa en vivo
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPreviewOpen(true)}
                      className="gap-1 text-xs"
                      title="Ampliar (Ctrl+E)"
                    >
                      <Maximize2 size={14} />
                      Ampliar
                    </Button>
                  </div>
                  <LiveThemePreview />

                  <Card className="mt-4 p-4 text-sm text-text-muted">
                    <p className="flex items-start gap-2">
                      <Sparkles size={15} className="mt-0.5 shrink-0 text-primary" />
                      <span>
                        Tip: elegí un preset temático, subí imágenes y agregá
                        animaciones al botón de enviar desde el panel de diseño.
                      </span>
                    </p>
                  </Card>
                </section>
              )}

              {sidebarTab === "stats" && (
                <section aria-labelledby="stats-heading">
                  <h2
                    id="stats-heading"
                    className="mb-3 text-sm font-semibold text-text-muted"
                  >
                    Estadísticas del formulario
                  </h2>
                  <Card className="p-4">
                    <FormStatsCard fields={fields} />
                  </Card>
                </section>
              )}
            </aside>
          </div>
        </div>

        {/* Overlay when drawer is open (desktop) */}
        {isDrawerOpen && (
          <div
            className="fixed inset-y-0 left-0 z-30 hidden xl:flex"
            style={{ right: "28rem" }}
            aria-hidden="true"
          >
            <div className="flex h-full w-full items-center justify-center bg-black/20 p-8 backdrop-blur-md">
              <div className="w-full max-w-2xl animate-[scaleIn_250ms_ease-out]">
                <div className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-white/90">
                  <Eye size={16} aria-hidden="true" />
                  <span>Vista previa en vivo</span>
                </div>
                <LiveThemePreview />
              </div>
            </div>
          </div>
        )}
      </form>

      <ThemeDrawer />

      <ThemePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formName={name}
        formDescription={watch("description")}
        fields={fields}
      />

      <JsonPreviewModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        form={{ ...getValues(), theme }}
      />

      <TourOverlay />
    </FormProvider>
  );
}
