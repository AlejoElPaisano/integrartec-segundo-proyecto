import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { buildFormSchema } from "@/features/form-lab/utils";
import type { FormField } from "@/features/form-lab/schema";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  getDefaultTheme,
  backgroundImageStyle,
  backgroundImageLayerStyle,
  backgroundOverlayStyle,
  fontFamilyClass,
  patternToClass,
  radiusToClass,
  spacingClass,
  titleAlignmentClass,
  submitAnimationClass,
  fieldEntranceAnimationClass,
  cardStyleClass,
  shadowClass,
  hasEmoji,
  getFormBorderRadius,
  getInputBorderRadius,
  getButtonBorderRadius,
  getLogoBorderRadius,
  formBorderDataAttrs,
} from "@/features/form-theme/utils";
import { applyThemeToCssVars } from "@/features/form-theme/dom-helpers";
import { cn, cssVars } from "@/shared/lib/helpers";

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
  const [isSuccess, setIsSuccess] = useState(false);

  // Resolver y valores iniciales se regeneran si cambian los campos.
  // useMemo está justificado porque construir un schema Zod dinámico no es gratis.
  const resolver = useMemo(
    () => zodResolver(buildFormSchema(fields)),
    [fields]
  );
  const defaultValues = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.id, ""])),
    [fields]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, string>>({
    resolver,
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues);
      setIsSuccess(false);
      applyThemeToCssVars(getDefaultTheme());
      return;
    }
    applyThemeToCssVars(theme);
    return () => {
      applyThemeToCssVars(getDefaultTheme());
    };
  }, [isOpen, theme, reset, defaultValues]);

  if (!isOpen) return null;

  const onSubmit = () => {
    setIsSuccess(true);
  };

  const containerStyle = backgroundImageStyle(theme);
  const imageLayerStyle = backgroundImageLayerStyle(theme);
  const overlayStyle = backgroundOverlayStyle(theme);
  const hasBackgroundImage = Boolean(theme.backgroundImage);

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
        {hasBackgroundImage && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={imageLayerStyle}
            aria-hidden="true"
          />
        )}
        {hasBackgroundImage && theme.backgroundOverlay && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={overlayStyle}
            aria-hidden="true"
          />
        )}

        <div
          className={cn(
            "relative p-6 sm:p-10 overflow-hidden form-border-dynamic",
            cardStyleClass(theme.cardStyle),
            radiusToClass(getFormBorderRadius(theme)),
            shadowClass(theme.shadow)
          )}
          {...formBorderDataAttrs(theme)}
        >
          <div className="absolute right-4 top-4 z-10">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              <X size={18} />
              Cerrar
            </Button>
          </div>

          <header
            className={cn(
              "mb-8 flex flex-col",
              theme.titleAlignment === "center"
                ? "items-center text-center"
                : theme.titleAlignment === "right"
                  ? "items-end text-right"
                  : "items-start text-left"
            )}
          >
            <h1
              className={cn(
                "flex items-center gap-3 text-3xl sm:text-4xl font-bold form-themed-text",
                fontFamilyClass(theme.headingFontFamily),
                titleAlignmentClass(theme.titleAlignment)
              )}
            >
              {theme.logoImage && (
                <img
                  src={theme.logoImage}
                  alt=""
                  className={cn(
                    "h-9 sm:h-10 w-auto object-contain shrink-0",
                    radiusToClass(getLogoBorderRadius(theme))
                  )}
                />
              )}
              {hasEmoji(theme) && (
                <span aria-hidden="true" className="shrink-0">{theme.emoji}</span>
              )}
              <span>{formName || "Mi formulario"}</span>
            </h1>
            {formDescription && (
              <p
                className={cn(
                  "mt-3 text-base opacity-80 form-themed-text",
                  titleAlignmentClass(theme.titleAlignment)
                )}
              >
                {formDescription}
              </p>
            )}
          </header>

          {isSuccess ? (
            <div
              className="py-12 text-center animate-[scaleIn_400ms_ease-out] form-themed-text"
            >
              <div
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full form-themed-bg-primary"
                style={{ color: "#ffffff" }}
              >
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold">¡Listo!</h2>
              <p className="mt-2 opacity-80">
                Gracias por completar el formulario.
              </p>
              <Button
                type="button"
                variant="secondary"
                className="mt-6"
                onClick={() => {
                  setIsSuccess(false);
                  reset(defaultValues);
                }}
              >
                Completar de nuevo
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={cn(
                "flex flex-col",
                spacingClass(theme.spacing),
                fontFamilyClass(theme.fontFamily)
              )}
            >
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    fieldEntranceAnimationClass(theme.fieldEntranceAnimation),
                    "form-anim-stagger"
                  )}
                  style={cssVars({ "--anim-delay": `${index * 80}ms` })}
                >
                  <label
                    htmlFor={`preview-${field.id}`}
                    className="mb-1.5 block text-sm font-medium form-themed-text"
                  >
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={`preview-${field.id}`}
                      className={cn(radiusToClass(getInputBorderRadius(theme)))}
                      placeholder={field.placeholder}
                      error={errors[field.id]?.message}
                      aria-invalid={Boolean(errors[field.id])}
                      aria-describedby={
                        errors[field.id]
                          ? `preview-${field.id}-error`
                          : undefined
                      }
                      {...register(field.id)}
                    />
                  ) : (
                    <Input
                      id={`preview-${field.id}`}
                      type={field.type}
                      className={cn(radiusToClass(getInputBorderRadius(theme)))}
                      placeholder={field.placeholder}
                      error={errors[field.id]?.message}
                      aria-invalid={Boolean(errors[field.id])}
                      aria-describedby={
                        errors[field.id]
                          ? `preview-${field.id}-error`
                          : undefined
                      }
                      {...register(field.id)}
                    />
                  )}
                </div>
              ))}

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
                    "form-themed-bg-primary",
                    radiusToClass(getButtonBorderRadius(theme)),
                    submitAnimationClass(theme.submitAnimation)
                  )}
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
