import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { useFormLabStore } from "@/features/form-lab/store";

export function FormPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const forms = useFormLabStore((state) => state.forms);
  const form = forms.find((f) => f.id === id);

  const { register, handleSubmit } = useForm<Record<string, string>>();

  if (!form) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft size={16} />
              Volver
            </Button>
            <h1 className="text-2xl font-bold">Formulario no encontrado</h1>
          </div>
          <p className="text-text-muted mb-6">
            El formulario que buscás no existe o fue eliminado.
          </p>
          <Button onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: Record<string, string>) => {
    console.log("Formulario enviado:", data);
    // TODO: Integrar con toast de D1-polish y validación de D2/D3/D4
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">{form.name}</h1>
        </div>

        {form.description && (
          <p className="text-text-muted mb-6">{form.description}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium mb-1"
              >
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  {...register(field.id)}
                  placeholder={field.placeholder}
                />
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  {...register(field.id)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
