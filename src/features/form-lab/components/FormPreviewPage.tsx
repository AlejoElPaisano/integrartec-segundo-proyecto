import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { useFormById } from "@/features/form-lab/hooks/useFormLab";
import { applyThemeToCssVars, getDefaultTheme } from "@/features/form-theme/utils";
import { fontFamilyClass, patternToClass, radiusToClass, spacingClass } from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";

export function FormPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const form = useFormById(id);

  const effectiveTheme = form?.theme ?? getDefaultTheme();

  useEffect(() => {
    applyThemeToCssVars(effectiveTheme);
    return () => {
      applyThemeToCssVars(getDefaultTheme());
    };
  }, [effectiveTheme]);

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
    <div
      className={cn("min-h-screen p-6", patternToClass(effectiveTheme.pattern))}
      style={{
        backgroundColor: effectiveTheme.backgroundColor,
        color: effectiveTheme.textColor,
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
            Volver
          </Button>
          <h1
            className={cn(
              "flex items-center gap-2 text-2xl font-bold",
              fontFamilyClass(effectiveTheme.fontFamily)
            )}
            style={{ color: effectiveTheme.textColor }}
          >
            <span aria-hidden="true">{effectiveTheme.emoji}</span>
            {form.name}
          </h1>
        </div>

        {form.description && (
          <p
            className="mb-6 opacity-80"
            style={{ color: effectiveTheme.textColor }}
          >
            {form.description}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col", spacingClass(effectiveTheme.spacing))}>
          {form.fields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="mb-1 block text-sm font-medium"
                style={{ color: effectiveTheme.textColor }}
              >
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  className={radiusToClass(effectiveTheme.borderRadius)}
                  {...register(field.id)}
                  placeholder={field.placeholder}
                />
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  className={radiusToClass(effectiveTheme.borderRadius)}
                  {...register(field.id)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              className={radiusToClass(effectiveTheme.borderRadius)}
              style={{ backgroundColor: effectiveTheme.primaryColor }}
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
