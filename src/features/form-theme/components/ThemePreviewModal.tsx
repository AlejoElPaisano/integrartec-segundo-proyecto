import { useEffect, useMemo, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { validateField } from "@/features/form-lab/utils";
import type { FormField } from "@/features/form-lab/schema";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
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
  shadowClass,
  borderWidthStyle,
  hasEmoji,
} from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";

interface ThemePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formName: string;
  formDescription?: string;
  fields: FormField[];
}

export function ThemePreviewModal({
  isOpen,
  onClose,
  formName,
  formDescription,
  fields,
}: ThemePreviewModalProps) {
  const { theme } = useFormTheme();
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setValues({});
      setTouched({});
      setIsSuccess(false);
      applyThemeToCssVars(getDefaultTheme());
      return;
    }
    applyThemeToCssVars(theme);
    return () => {
      applyThemeToCssVars(getDefaultTheme());
    };
  }, [isOpen, theme]);

  const errors = useMemo(() => {
    const result: Record<string, string | null> = {};
    for (const field of fields) {
      result[field.id] = validateField(values[field.id] ?? "", field.rules);
    }
    return result;
  }, [fields, values]);

  if (!isOpen) return null;

  const handleChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {};
    for (const field of fields) allTouched[field.id] = true;
    setTouched(allTouched);

    const hasErrors = fields.some((field) => errors[field.id] !== null);
    if (!hasErrors) setIsSuccess(true);
  };

  const containerStyle = backgroundImageStyle(theme);
  const overlayStyle = backgroundOverlayStyle(theme);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vista previa ampliada del formulario"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Cerrar vista previa"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
      />

      <div
        className={cn(
          "relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-[scaleIn_250ms_ease-out]",
          patternToClass(theme.pattern)
        )}
        style={containerStyle}
      >
        {theme.backgroundImage && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={overlayStyle}
          />
        )}

        <div
          className={cn(
            "relative p-6 sm:p-10",
            cardStyleClass(theme.cardStyle),
            radiusToClass(theme.borderRadius),
            shadowClass(theme.shadow)
          )}
          style={{
            borderWidth: borderWidthStyle(theme.borderWidth),
            borderStyle: theme.borderWidth !== "none" ? "solid" : undefined,
            borderColor:
              theme.borderWidth !== "none" ? theme.borderColor : undefined,
          }}
        >
          <div className="absolute right-4 top-4 z-10">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={18} />
              Cerrar
            </Button>
          </div>

          <header
            className={cn(
              "mb-8 flex flex-col",
              logoPositionClass(theme.logoPosition)
            )}
          >
            {theme.logoImage && (
              <img
                src={theme.logoImage}
                alt=""
                className="h-16 w-auto object-contain mb-4"
              />
            )}
            <h1
              className={cn(
                "flex items-center gap-3 text-3xl sm:text-4xl font-bold",
                fontFamilyClass(theme.headingFontFamily),
                titleAlignmentClass(theme.titleAlignment)
              )}
              style={{ color: theme.textColor }}
            >
              {hasEmoji(theme) && (
                <span aria-hidden="true">{theme.emoji}</span>
              )}
              <span>{formName || "Mi formulario"}</span>
            </h1>
            {formDescription && (
              <p
                className={cn(
                  "mt-3 text-base opacity-80",
                  titleAlignmentClass(theme.titleAlignment)
                )}
                style={{ color: theme.textColor }}
              >
                {formDescription}
              </p>
            )}
          </header>

          {isSuccess ? (
            <div
              className="py-12 text-center animate-[scaleIn_400ms_ease-out]"
              style={{ color: theme.textColor }}
            >
              <div
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: "#ffffff",
                }}
              >
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold">¡Listo!</h2>
              <p className="mt-2 opacity-80">
                Gracias por completar el formulario.
              </p>
              <Button
                variant="secondary"
                className="mt-6"
                onClick={() => setIsSuccess(false)}
              >
                Completar de nuevo
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={cn(
                "flex flex-col",
                spacingClass(theme.spacing),
                fontFamilyClass(theme.fontFamily)
              )}
            >
              {fields.map((field, index) => {
                const value = values[field.id] ?? "";
                const error = touched[field.id] ? errors[field.id] : null;
                const isValid =
                  touched[field.id] &&
                  error === null &&
                  value.trim().length > 0;

                return (
                  <div
                    key={field.id}
                    className={fieldEntranceAnimationClass(
                      theme.fieldEntranceAnimation
                    )}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <label
                      htmlFor={`preview-${field.id}`}
                      className="mb-1.5 block text-sm font-medium"
                      style={{ color: theme.textColor }}
                    >
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={`preview-${field.id}`}
                        className={cn(
                          radiusToClass(theme.borderRadius),
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
                            ? theme.primaryColor
                            : undefined,
                        }}
                      />
                    ) : (
                      <Input
                        id={`preview-${field.id}`}
                        type={field.type}
                        className={cn(
                          radiusToClass(theme.borderRadius),
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
                            ? theme.primaryColor
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
                  theme.titleAlignment === "center"
                    ? "justify-center"
                    : theme.titleAlignment === "right"
                    ? "justify-end"
                    : "justify-end"
                )}
              >
                <Button
                  type="submit"
                  size="lg"
                  className={cn(
                    radiusToClass(theme.borderRadius),
                    submitAnimationClass(theme.submitAnimation)
                  )}
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {theme.submitLabel || "Enviar"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
