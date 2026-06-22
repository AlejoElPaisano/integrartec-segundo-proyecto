import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Save, Share2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Input, Textarea } from "@/shared/components/ui/Input";
import { useToast } from "@/features/notifications/hooks/useToast";
import { useFormLabStore } from "@/features/form-lab/store";
import {
  cloneForm,
  decodeFormFromBase64,
  formatRuleType,
} from "@/features/form-lab/utils";
import type { Form, FormField } from "@/features/form-lab/schema";
import {
  backgroundImageLayerStyle,
  backgroundImageStyle,
  backgroundOverlayStyle,
  cardStyleClass,
  fieldEntranceAnimationClass,
  fontFamilyClass,
  getDefaultTheme,
  hasEmoji,
  logoPositionClass,
  patternToClass,
  radiusToClass,
  spacingClass,
  titleAlignmentClass,
} from "@/features/form-theme/utils";
import type { FormTheme } from "@/features/form-theme/schema";
import { cn } from "@/shared/lib/helpers";

interface ReadonlyFieldProps {
  field: FormField;
  theme: FormTheme;
  index: number;
}

function ReadonlyField({ field, theme, index }: ReadonlyFieldProps) {
  const ruleLabels = field.rules.map((rule) => formatRuleType(rule.type));

  return (
    <div
      className={fieldEntranceAnimationClass(theme.fieldEntranceAnimation)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <label
        htmlFor={field.id}
        className="mb-1.5 block text-sm font-medium"
        style={{ color: theme.textColor }}
      >
        {field.label}
      </label>

      {field.type === "textarea" ? (
        <Textarea
          id={field.id}
          readOnly
          className={cn(radiusToClass(theme.borderRadius), "cursor-default")}
          placeholder={field.placeholder}
          value=""
        />
      ) : (
        <Input
          id={field.id}
          type={field.type}
          readOnly
          className={cn(radiusToClass(theme.borderRadius), "cursor-default")}
          placeholder={field.placeholder}
          value=""
        />
      )}

      {ruleLabels.length > 0 && (
        <p className="mt-1.5 text-xs opacity-70" style={{ color: theme.textColor }}>
          Reglas: {ruleLabels.join(", ")}
        </p>
      )}
    </div>
  );
}

interface SharedFormPreviewProps {
  form: Form;
}

function SharedFormPreview({ form }: SharedFormPreviewProps) {
  const theme = form.theme ?? getDefaultTheme();
  const containerStyle = backgroundImageStyle(theme);
  const imageLayerStyle = backgroundImageLayerStyle(theme);
  const overlayStyle = backgroundOverlayStyle(theme);
  const hasBackgroundImage = Boolean(theme.backgroundImage);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl border border-border p-5 sm:p-8",
        patternToClass(theme.pattern)
      )}
      style={containerStyle}
      aria-labelledby="shared-form-title"
    >
      {hasBackgroundImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={imageLayerStyle}
          aria-hidden="true"
        />
      )}
      {hasBackgroundImage && theme.backgroundOverlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={overlayStyle}
          aria-hidden="true"
        />
      )}

      <article
        className={cn(
          "relative mx-auto max-w-2xl p-6 sm:p-8",
          cardStyleClass(theme.cardStyle),
          radiusToClass(theme.borderRadius)
        )}
      >
        <header
          className={cn(
            "mb-8 flex flex-col",
            logoPositionClass(theme.logoPosition)
          )}
        >
          {theme.logoImage && (
            <img
              src={theme.logoImage}
              alt="Logo del formulario"
              className="mb-4 h-20 w-auto object-contain"
            />
          )}

          <h1
            id="shared-form-title"
            className={cn(
              "flex items-center gap-3 text-3xl font-bold",
              fontFamilyClass(theme.headingFontFamily),
              titleAlignmentClass(theme.titleAlignment)
            )}
            style={{ color: theme.textColor }}
          >
            {hasEmoji(theme) && <span aria-hidden="true">{theme.emoji}</span>}
            <span>{form.name}</span>
          </h1>

          {form.description && (
            <p
              className={cn(
                "mt-3 text-lg opacity-80",
                titleAlignmentClass(theme.titleAlignment)
              )}
              style={{ color: theme.textColor }}
            >
              {form.description}
            </p>
          )}
        </header>

        {form.fields.length === 0 ? (
          <p className="text-sm opacity-80" style={{ color: theme.textColor }}>
            Este formulario no tiene campos cargados.
          </p>
        ) : (
          <div
            className={cn(
              "flex flex-col",
              spacingClass(theme.spacing),
              fontFamilyClass(theme.fontFamily)
            )}
          >
            {form.fields.map((field, index) => (
              <ReadonlyField
                key={field.id}
                field={field}
                theme={theme}
                index={index}
              />
            ))}
          </div>
        )}
      </article>
    </section>
  );
}

export function SharePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const addForm = useFormLabStore((state) => state.addForm);
  const { success: showSuccess } = useToast();
  const encodedData = searchParams.get("data");
  const result = encodedData
    ? decodeFormFromBase64(encodedData)
    : { ok: false as const, error: "Falta el formulario compartido" };

  const handleSaveCopy = (form: Form) => {
    const copy = cloneForm(form);
    addForm(copy);
    showSuccess(`Se guardo "${copy.name}" en tus formularios`);
    navigate("/forms");
  };

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} />
              Volver
            </Button>
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
                <Share2 size={16} aria-hidden="true" />
                Formulario compartido
              </div>
              <h1 className="text-2xl font-bold text-text">
                Vista previa del enlace
              </h1>
            </div>
          </div>

          {result.ok && (
            <Button type="button" onClick={() => handleSaveCopy(result.form)}>
              <Save size={16} />
              Guardar copia
            </Button>
          )}
        </header>

        {result.ok ? (
          <SharedFormPreview form={result.form} />
        ) : (
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-danger/10 p-2 text-danger">
                <AlertCircle size={22} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text">
                  No se pudo abrir el formulario
                </h2>
                <p className="mt-1 text-sm text-text-muted">{result.error}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
