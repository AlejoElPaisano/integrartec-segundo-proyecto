import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { useFormById } from "@/features/form-lab/hooks/useFormLab";
import { buildFormSchema } from "@/features/form-lab/utils";
import {
  applyThemeToCssVars,
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
  hasEmoji,
  getFormBorderRadius,
  getInputBorderRadius,
  getButtonBorderRadius,
  getLogoBorderRadius,
  borderWidthStyle,
  hasBorder,
} from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";
import { useToast } from "@/features/notifications/hooks/useToast";

export function FormPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const form = useFormById(id);
  const { success: showSuccess } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const effectiveTheme = form?.theme ?? getDefaultTheme();

  // Resolver y valores iniciales se regeneran si cambian los campos.
  // useMemo está justificado porque construir un schema Zod dinámico no es gratis.
  const resolver = useMemo(
    () => zodResolver(buildFormSchema(form?.fields ?? [])),
    [form?.fields]
  );
  const defaultValues = useMemo(
    () => Object.fromEntries((form?.fields ?? []).map((field) => [field.id, ""])),
    [form?.fields]
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Record<string, string>>({
    resolver,
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    applyThemeToCssVars(effectiveTheme);
    return () => {
      applyThemeToCssVars(getDefaultTheme());
    };
  }, [effectiveTheme]);

  useEffect(() => {
    if (!form) return;
    reset(Object.fromEntries(form.fields.map((field) => [field.id, ""])));
    setIsSuccess(false);
    // Solo se resetea cuando cambia el formulario (por id), no en cada cambio del objeto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.id, reset]);

  if (!form) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft size={16} />
              Volver
            </Button>
            <h1 className="text-2xl font-bold">Formulario no encontrado</h1>
          </div>
          <p className="text-text-muted mb-6">
            El formulario que buscás no existe o fue eliminado.
          </p>
          <Button type="button" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const values = watch();
  const progress =
    form.fields.length === 0
      ? 0
      : Math.round(
        (form.fields.filter((field) => values[field.id]?.trim().length > 0).length /
          form.fields.length) *
        100
      );

  const onSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      showSuccess(`¡${form.name} enviado con éxito!`);
    }, 800);
  };

  const handleReset = () => {
    setIsSuccess(false);
    reset(Object.fromEntries(form.fields.map((field) => [field.id, ""])));
  };

  const containerStyle = backgroundImageStyle(effectiveTheme);
  const imageLayerStyle = backgroundImageLayerStyle(effectiveTheme);
  const overlayStyle = backgroundOverlayStyle(effectiveTheme);
  const hasBackgroundImage = Boolean(effectiveTheme.backgroundImage);

  return (
    <div
      className={cn(
        "relative min-h-screen p-6",
        patternToClass(effectiveTheme.pattern)
      )}
      style={containerStyle}
    >
      {hasBackgroundImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={imageLayerStyle}
          aria-hidden="true"
        />
      )}
      {hasBackgroundImage && effectiveTheme.backgroundOverlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={overlayStyle}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "relative max-w-2xl mx-auto overflow-hidden",
          cardStyleClass(effectiveTheme.cardStyle),
          radiusToClass(getFormBorderRadius(effectiveTheme)),
          "p-8"
        )}
        style={{
          borderWidth: borderWidthStyle(effectiveTheme.borderWidth),
          borderStyle: hasBorder(effectiveTheme.borderWidth) ? "solid" : undefined,
          borderColor: hasBorder(effectiveTheme.borderWidth) ? effectiveTheme.borderColor : undefined,
        }}
      >
        <div className="flex items-center gap-4 mb-8">
          <Button
            type="button"
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
            effectiveTheme.titleAlignment === "center"
              ? "items-center text-center"
              : effectiveTheme.titleAlignment === "right"
                ? "items-end text-right"
                : "items-start text-left"
          )}
        >
          <h1
            className={cn(
              "flex items-center gap-3 text-3xl font-bold",
              fontFamilyClass(effectiveTheme.headingFontFamily),
              titleAlignmentClass(effectiveTheme.titleAlignment)
            )}
            style={{ color: effectiveTheme.textColor }}
          >
            {effectiveTheme.logoImage && (
              <img
                src={effectiveTheme.logoImage}
                alt="Logo del formulario"
                className={cn(
                  "h-9 w-auto object-contain shrink-0",
                  radiusToClass(getLogoBorderRadius(effectiveTheme))
                )}
              />
            )}
            {hasEmoji(effectiveTheme) && (
              <span aria-hidden="true" className="shrink-0">{effectiveTheme.emoji}</span>
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
            <Button type="button" variant="secondary" onClick={handleReset}>
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
              onSubmit={handleSubmit(onSubmit)}
              className={cn(
                "flex flex-col",
                spacingClass(effectiveTheme.spacing),
                fontFamilyClass(effectiveTheme.fontFamily)
              )}
            >
              {form.fields.map((field, index) => (
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
                        radiusToClass(getInputBorderRadius(effectiveTheme))
                      )}
                      placeholder={field.placeholder}
                      error={errors[field.id]?.message}
                      {...register(field.id)}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      className={cn(
                        radiusToClass(getInputBorderRadius(effectiveTheme))
                      )}
                      placeholder={field.placeholder}
                      error={errors[field.id]?.message}
                      {...register(field.id)}
                    />
                  )}
                </div>
              ))}

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
                    radiusToClass(getButtonBorderRadius(effectiveTheme)),
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
