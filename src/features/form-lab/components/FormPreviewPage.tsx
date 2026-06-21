import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { useFormById } from "@/features/form-lab/hooks/useFormLab";
import { validateField } from "@/features/form-lab/utils";
import {
  applyThemeToCssVars,
  getDefaultTheme,
  backgroundImageStyle,
  backgroundOverlayStyle,
  fontFamilyClass,
  patternToClass,
  radiusToClass,
  spacingClass,
  logoPositionClass,
  titleAlignmentClass,
  submitAnimationClass,
  fieldEntranceAnimationClass,
  cardStyleClass,
} from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";
import { useToast } from "@/features/notifications/hooks/useToast";

export function FormPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const form = useFormById(id);
  const { error: showError, success: showSuccess } = useToast();

  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const effectiveTheme = form?.theme ?? getDefaultTheme();

  useEffect(() => {
    applyThemeToCssVars(effectiveTheme);
    return () => {
      applyThemeToCssVars(getDefaultTheme());
    };
  }, [effectiveTheme]);

  useEffect(() => {
    if (!form) return;
    const initial: Record<string, string> = {};
    for (const field of form.fields) {
      initial[field.id] = "";
    }
    setValues(initial);
    setTouched({});
    setIsSuccess(false);
  }, [form]);

  const progress = useMemo(() => {
    if (!form || form.fields.length === 0) return 0;
    const filled = form.fields.filter(
      (field) => values[field.id]?.trim().length > 0
    ).length;
    return Math.round((filled / form.fields.length) * 100);
  }, [form, values]);

  const errors = useMemo(() => {
    const result: Record<string, string | null> = {};
    if (!form) return result;
    for (const field of form.fields) {
      const value = values[field.id] ?? "";
      result[field.id] = validateField(value, field.rules);
    }
    return result;
  }, [form, values]);

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

  const handleChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const allTouched: Record<string, boolean> = {};
    for (const field of form.fields) {
      allTouched[field.id] = true;
    }
    setTouched(allTouched);

    const hasErrors = form.fields.some(
      (field) => errors[field.id] !== null
    );

    if (hasErrors) {
      showError("Revisá los campos marcados en rojo");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      showSuccess(`¡${form.name} enviado con éxito!`);
    }, 800);
  };

  const containerStyle = backgroundImageStyle(effectiveTheme);
  const overlayStyle = backgroundOverlayStyle(effectiveTheme);

  return (
    <div
      className={cn(
        "relative min-h-screen p-6",
        patternToClass(effectiveTheme.pattern)
      )}
      style={containerStyle}
    >
      {effectiveTheme.backgroundImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={overlayStyle}
        />
      )}

      <div
        className={cn(
          "relative max-w-2xl mx-auto",
          cardStyleClass(effectiveTheme.cardStyle),
          radiusToClass(effectiveTheme.borderRadius),
          "p-8"
        )}
      >
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft size={16} />
            Volver
          </Button>
        </div>

        <header
          className={cn(
            "mb-8 flex flex-col",
            logoPositionClass(effectiveTheme.logoPosition)
          )}
        >
          {effectiveTheme.logoImage && (
            <img
              src={effectiveTheme.logoImage}
              alt="Logo del formulario"
              className="h-20 w-auto object-contain mb-4"
            />
          )}

          <h1
            className={cn(
              "flex items-center gap-3 text-3xl font-bold",
              fontFamilyClass(effectiveTheme.headingFontFamily),
              titleAlignmentClass(effectiveTheme.titleAlignment)
            )}
            style={{ color: effectiveTheme.textColor }}
          >
            {effectiveTheme.showEmoji && (
              <span aria-hidden="true">{effectiveTheme.emoji}</span>
            )}
            <span>{form.name}</span>
          </h1>

          {form.description && (
            <p
              className={cn(
                "mt-3 text-lg opacity-80",
                titleAlignmentClass(effectiveTheme.titleAlignment)
              )}
              style={{ color: effectiveTheme.textColor }}
            >
              {form.description}
            </p>
          )}
        </header>

        {isSuccess ? (
          <div
            className={cn(
              "text-center py-12 animate-[scaleIn_400ms_ease-out]",
              fontFamilyClass(effectiveTheme.fontFamily)
            )}
            style={{ color: effectiveTheme.textColor }}
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{
                backgroundColor: effectiveTheme.primaryColor,
                color: "#ffffff",
              }}
            >
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Listo!</h2>
            <p className="opacity-80 mb-6">
              Gracias por completar {form.name}.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setIsSuccess(false);
                setValues({});
                setTouched({});
              }}
            >
              Completar de nuevo
            </Button>
          </div>
        ) : (
          <>
            {effectiveTheme.showProgressBar && (
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2 opacity-80">
                  <span>Progreso</span>
                  <span>{progress}%</span>
                </div>
                <div className="form-progress-bar">
                  <div style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={cn(
                "flex flex-col",
                spacingClass(effectiveTheme.spacing),
                fontFamilyClass(effectiveTheme.fontFamily)
              )}
            >
              {form.fields.map((field, index) => {
                const value = values[field.id] ?? "";
                const error = touched[field.id] ? errors[field.id] : null;
                const isValid =
                  touched[field.id] && error === null && value.trim().length > 0;

                return (
                  <div
                    key={field.id}
                    className={fieldEntranceAnimationClass(
                      effectiveTheme.fieldEntranceAnimation
                    )}
                    style={{
                      animationDelay: `${index * 80}ms`,
                    }}
                  >
                    <label
                      htmlFor={field.id}
                      className="mb-1.5 block text-sm font-medium"
                      style={{ color: effectiveTheme.textColor }}
                    >
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        className={cn(
                          radiusToClass(effectiveTheme.borderRadius),
                          error && "border-danger focus:ring-danger",
                          isValid && "border-success focus:ring-success"
                        )}
                        value={value}
                        onChange={(e) =>
                          handleChange(field.id, e.target.value)
                        }
                        placeholder={field.placeholder}
                        style={{
                          borderColor: error
                            ? "var(--color-danger)"
                            : isValid
                            ? effectiveTheme.primaryColor
                            : undefined,
                        }}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        className={cn(
                          radiusToClass(effectiveTheme.borderRadius),
                          error && "border-danger focus:ring-danger",
                          isValid && "border-success focus:ring-success"
                        )}
                        value={value}
                        onChange={(e) =>
                          handleChange(field.id, e.target.value)
                        }
                        placeholder={field.placeholder}
                        style={{
                          borderColor: error
                            ? "var(--color-danger)"
                            : isValid
                            ? effectiveTheme.primaryColor
                            : undefined,
                        }}
                      />
                    )}
                    {error && (
                      <p className="mt-1.5 text-sm text-danger">{error}</p>
                    )}
                  </div>
                );
              })}

              <div
                className={cn(
                  "flex pt-4",
                  effectiveTheme.titleAlignment === "center"
                    ? "justify-center"
                    : effectiveTheme.titleAlignment === "right"
                    ? "justify-end"
                    : "justify-end"
                )}
              >
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className={cn(
                    "relative overflow-hidden",
                    radiusToClass(effectiveTheme.borderRadius),
                    submitAnimationClass(effectiveTheme.submitAnimation)
                  )}
                  style={{
                    backgroundColor: effectiveTheme.primaryColor,
                    borderColor: effectiveTheme.accentColor,
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Enviando...
                    </span>
                  ) : (
                    effectiveTheme.submitLabel
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
