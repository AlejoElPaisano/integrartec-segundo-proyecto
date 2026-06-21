import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Palette, Eye, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { FormMetadataCard } from "./FormMetadataCard";
import { FieldList } from "./FieldList";
import { useFormLabStore } from "@/features/form-lab/store";
import { useFormById } from "@/features/form-lab/hooks/useFormLab";
import { formSchema } from "@/features/form-lab/schema";
import type { Form, FormField } from "@/features/form-lab/schema";
import { ThemeDrawer } from "@/features/form-theme/components/ThemeDrawer";
import { LiveThemePreview } from "@/features/form-theme/components/LiveThemePreview";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";

export function FormBuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formId = searchParams.get("id");

  const addForm = useFormLabStore((state) => state.addForm);
  const updateForm = useFormLabStore((state) => state.updateForm);
  const existingForm = useFormById(formId ?? undefined);

  const { theme, openDrawer } = useFormTheme({
    initialTheme: existingForm?.theme,
  });

  const [fields, setFields] = useState<FormField[]>(existingForm?.fields ?? []);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ name: string; description?: string }>({
    name: existingForm?.name ?? "",
    description: existingForm?.description ?? "",
  });

  const handleSave = () => {
    setSaveError(null);

    const formData: Form = {
      id: existingForm?.id ?? crypto.randomUUID(),
      name: metadata.name,
      description: metadata.description,
      fields,
      createdAt: existingForm?.createdAt ?? new Date().toISOString(),
      theme,
    };

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const issues = result.error.issues;
      setSaveError(
        "Error de validación: " + issues.map((issue: { message: string }) => issue.message).join(", ")
      );
      return;
    }

    if (existingForm) {
      updateForm(result.data);
    } else {
      addForm(result.data);
    }

    navigate("/");
  };

  const isFormNameValid = metadata.name.trim().length > 0;

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft size={16} />
              Volver
            </Button>
            <h1 className="text-2xl font-bold">
              {existingForm ? "Editar formulario" : "Crear formulario"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
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
              onClick={handleSave}
              disabled={!isFormNameValid}
            >
              <Save size={16} />
              {existingForm ? "Guardar" : "Guardar"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <FormMetadataCard
              value={metadata}
              onChange={setMetadata}
            />
            <FieldList fields={fields} onChange={setFields} />

            {saveError && (
              <Card className="border-danger p-4">
                <p className="text-sm text-danger">{saveError}</p>
              </Card>
            )}
          </div>

          <aside className="lg:sticky lg:top-6 h-fit space-y-4">
            <section aria-labelledby="preview-heading">
              <div className="mb-3 flex items-center gap-2">
                <Eye size={16} className="text-text-muted" aria-hidden="true" />
                <h2
                  id="preview-heading"
                  className="text-sm font-semibold text-text-muted"
                >
                  Vista previa en vivo
                </h2>
              </div>
              <LiveThemePreview />
            </section>

            <Card className="p-4 text-sm text-text-muted">
              <p className="flex items-start gap-2">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  Tip: abrí el panel de diseño para elegir un preset temático,
                  subir imágenes y agregar animaciones al botón de enviar.
                </span>
              </p>
            </Card>
          </aside>
        </div>
      </div>

      <ThemeDrawer />
    </div>
  );
}
