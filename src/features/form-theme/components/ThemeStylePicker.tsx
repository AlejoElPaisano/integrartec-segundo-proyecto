import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  FONT_OPTIONS,
  RADIUS_OPTIONS,
  SPACING_OPTIONS,
  CARD_STYLE_OPTIONS,
  LOGO_POSITION_OPTIONS,
  TITLE_ALIGNMENT_OPTIONS,
  radiusToClass,
} from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";
import { Input } from "@/shared/components/ui/Input";
import type {
  BorderRadius,
  FontFamily,
  Spacing,
  CardStyle,
  LogoPosition,
  TitleAlignment,
} from "@/features/form-theme/schema";

interface RadioGroupProps<T extends string> {
  legend: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

function RadioGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: RadioGroupProps<T>) {
  return (
    <fieldset>
      <legend className="block text-xs font-medium text-text-muted mb-1">
        {legend}
      </legend>
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surface text-text hover:border-primary/50"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ThemeStylePicker() {
  const { theme, updateField } = useFormTheme();

  return (
    <div className="space-y-5">
      <RadioGroup<BorderRadius>
        legend="Radio de bordes"
        options={RADIUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        value={theme.borderRadius}
        onChange={(value) => updateField("borderRadius", value)}
      />
      <div>
        <span className="block text-xs font-medium text-text-muted mb-1">
          Vista previa del borde
        </span>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-9 w-16 border border-border bg-primary",
              radiusToClass(theme.borderRadius)
            )}
          />
          <span className="text-xs text-text-muted">{theme.borderRadius}</span>
        </div>
      </div>

      <RadioGroup<FontFamily>
        legend="Tipografía del cuerpo"
        options={FONT_OPTIONS}
        value={theme.fontFamily}
        onChange={(value) => updateField("fontFamily", value)}
      />

      <RadioGroup<FontFamily>
        legend="Tipografía de títulos"
        options={FONT_OPTIONS}
        value={theme.headingFontFamily}
        onChange={(value) => updateField("headingFontFamily", value)}
      />

      <RadioGroup<Spacing>
        legend="Espaciado entre campos"
        options={SPACING_OPTIONS}
        value={theme.spacing}
        onChange={(value) => updateField("spacing", value)}
      />

      <RadioGroup<CardStyle>
        legend="Estilo del contenedor"
        options={CARD_STYLE_OPTIONS}
        value={theme.cardStyle}
        onChange={(value) => updateField("cardStyle", value)}
      />

      <RadioGroup<LogoPosition>
        legend="Posición del logo"
        options={LOGO_POSITION_OPTIONS}
        value={theme.logoPosition}
        onChange={(value) => updateField("logoPosition", value)}
      />

      <RadioGroup<TitleAlignment>
        legend="Alineación del título"
        options={TITLE_ALIGNMENT_OPTIONS}
        value={theme.titleAlignment}
        onChange={(value) => updateField("titleAlignment", value)}
      />

      <div>
        <label
          htmlFor="submit-label"
          className="block text-xs font-medium text-text-muted mb-1"
        >
          Texto del botón de enviar
        </label>
        <Input
          id="submit-label"
          value={theme.submitLabel}
          onChange={(e) => updateField("submitLabel", e.target.value)}
          placeholder="Enviar"
        />
      </div>

      <fieldset>
        <legend className="block text-xs font-medium text-text-muted mb-1">
          Opciones extra
        </legend>
        <label className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3 text-sm text-text cursor-pointer hover:border-primary/50 transition-colors">
          <input
            type="checkbox"
            checked={theme.showProgressBar}
            onChange={(e) => updateField("showProgressBar", e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Mostrar barra de progreso
        </label>
      </fieldset>
    </div>
  );
}
