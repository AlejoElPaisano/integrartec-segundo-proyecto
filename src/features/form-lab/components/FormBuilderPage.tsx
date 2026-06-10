import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { FormMetadataCard } from "./FormMetadataCard";
import { FieldList } from "./FieldList";
import { useFormLabStore } from "@/features/form-lab/store";
import { formSchema } from "@/features/form-lab/schema";
import type { Form, FormField } from "@/features/form-lab/schema";

export function FormBuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formId = searchParams.get("id");

  const forms = useFormLabStore((state) => state.forms);
  const addForm = useFormLabStore((state) => state.addForm);
  const updateForm = useFormLabStore((state) => state.updateForm);
  const existingForm = formId ? forms.find((f) => f.id === formId) : null;

  const [fields, setFields] = useState<FormField[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ name: string; description?: string }>({ name: "", description: "" });

  useEffect(() => {
    if (existingForm) {
      setMetadata({
        name: existingForm.name,
        description: existingForm.description ?? "",
      });
      setFields(existingForm.fields);
    }
  }, [existingForm]);

  const handleSave = () => {
    setSaveError(null);

    const formData: Form = {
      id: existingForm?.id ?? crypto.randomUUID(),
      name: metadata.name,
      description: metadata.description,
      fields,
      createdAt: existingForm?.createdAt ?? new Date().toISOString(),
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">
            {existingForm ? "Editar formulario" : "Crear formulario"}
          </h1>
        </div>

        <div className="space-y-6">
          <FormMetadataCard
            value={metadata}
            onChange={setMetadata}
          />

          <FieldList fields={fields} onChange={setFields} />

          {saveError && (
            <Card className="p-4 border-danger">
              <p className="text-danger text-sm">{saveError}</p>
            </Card>
          )}

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={!isFormNameValid}
            >
              <Save size={18} />
              {existingForm ? "Guardar cambios" : "Guardar formulario"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
