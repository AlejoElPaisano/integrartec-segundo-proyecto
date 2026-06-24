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
import {
  applyThemeToCssVars,
} from "@/features/form-theme/dom-helpers";
import { cn, cssVars } from "@/shared/lib/helpers";
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

  const formId = form?.id;
  useEffect(() => {
    if (!form) return;
    reset(Object.fromEntries(form.fields.map((field) => [field.id, ""])));
    setIsSuccess(false);
  }, [formId, form, reset]);

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
    <div className="relative min-h-screen p-6 bg-surface flex flex-col justify-start">
      {/* Botón de volver posicionado por fuera de la tarjeta */}
      <div className="mx-auto max-w-3xl w-full mb-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate("/forms")}
          className="shrink-0"
        >
          <ArrowLeft size={16} />
          Volver a Mis formularios
        </Button>
      </div>

      <div
        className={cn(
          "relative max-w-3xl w-full mx-auto overflow-hidden form-border-dynamic",
          radiusToClass(getFormBorderRadius(effectiveTheme)),
          shadowClass(effectiveTheme.shadow),
          patternToClass(effectiveTheme.pattern),
          "p-6 sm:p-10"
        )}
        {...formBorderDataAttrs(effectiveTheme)}
        style={{
          ...containerStyle,
          ...formBorderDataAttrs(effectiveTheme).style,
        }}
      >
        {/* Capas absolutas de fondo, la capa de cardStyleClass va al fondo por detrás */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            cardStyleClass(effectiveTheme.cardStyle)
          )}
          aria-hidden="true"
        />
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

        <div className="relative z-10">
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
                "flex items-center gap-3 text-3xl sm:text-4xl font-bold form-themed-text",
                fontFamilyClass(effectiveTheme.headingFontFamily),
                titleAlignmentClass(effectiveTheme.titleAlignment)
              )}
            >
              {effectiveTheme.logoImage && (
                <img
                  src={effectiveTheme.logoImage}
                  alt="Logo del formulario"
                  className={cn(
                    "h-9 sm:h-10 w-auto object-contain shrink-0",
                    radiusToClass(getLogoBorderRadius(effectiveTheme))
                  )}
                />
              )}
              {hasEmoji(effectiveTheme) && (
                <span aria-hidden="true" className="shrink-0">
                  {effectiveTheme.emoji}
                </span>
              )}
              <span>{form.name}</span>
            </h1>

            {form.description && (
              <p
                className={cn(
                  "mt-3 text-base opacity-80 form-themed-text",
                  titleAlignmentClass(effectiveTheme.titleAlignment)
                )}
              >
                {form.description}
              </p>
            )}
          </header>

          {isSuccess ? (
            <div
              className={cn(
                "text-center py-12 animate-[scaleIn_400ms_ease-out] form-themed-text",
                fontFamilyClass(effectiveTheme.fontFamily)
              )}
            >
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 form-themed-bg-primary"
                style={{ color: "#ffffff" }}
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
                  <div className="flex justify-between text-sm mb-2 opacity-80 form-themed-text">
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
                    className={cn(
                      fieldEntranceAnimationClass(effectiveTheme.fieldEntranceAnimation),
                      "form-anim-stagger"
                    )}
                    style={cssVars({ "--anim-delay": `${index * 80}ms` })}
                  >
                    <label
                      htmlFor={field.id}
                      className="mb-1.5 block text-sm font-medium form-themed-text"
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
                        aria-invalid={Boolean(errors[field.id])}
                        aria-describedby={
                          errors[field.id] ? `${field.id}-error` : undefined
                        }
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
                        aria-invalid={Boolean(errors[field.id])}
                        aria-describedby={
                          errors[field.id] ? `${field.id}-error` : undefined
                        }
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
                      "relative overflow-hidden form-themed-bg-primary form-themed-border-accent",
                      radiusToClass(getButtonBorderRadius(effectiveTheme)),
                      submitAnimationClass(effectiveTheme.submitAnimation)
                    )}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Enviando...
                      </span>
                    ) : (
                      effectiveTheme.submitLabel || "Enviar"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
