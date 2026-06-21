import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  FONT_OPTIONS,
  RADIUS_OPTIONS,
  SPACING_OPTIONS,
  CARD_STYLE_OPTIONS,
  LOGO_POSITION_OPTIONS,
  TITLE_ALIGNMENT_OPTIONS,
  SHADOW_OPTIONS,
  BORDER_WIDTH_OPTIONS,
  radiusToClass,
  shadowClass,
} from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";
import { Input } from "@/shared/components/ui/Input";
import { isValidHexColor, normalizeHexColor } from "@/features/form-theme/utils";
import type {
  BorderRadius,
  FontFamily,
  Spacing,
  CardStyle,
  LogoPosition,
  TitleAlignment,
  BorderWidth,
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
      <legend className="block text-xs font-medium text-text-muted mb-1.5">
        {legend}
      </legend>
      <div role="radiogroup" className="flex flex-wrap gap-1.5">
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
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150",
                isSelected
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
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
      {/* Border radius with visual preview */}
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

      {/* NEW: Shadow */}
      <fieldset>
        <legend className="block text-xs font-medium text-text-muted mb-1.5">
          Sombra del formulario
        </legend>
        <div className="grid grid-cols-3 gap-1.5">
          {SHADOW_OPTIONS.map((option) => {
            const isSelected = theme.shadow === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateField("shadow", option.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-2 text-xs transition-all duration-150",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-surface text-text hover:border-primary/50"
                )}
              >
                <div
                  className={cn(
                    "h-5 w-8 rounded bg-primary/80",
                    shadowClass(option.value)
                  )}
                />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* NEW: Border width */}
      <RadioGroup<BorderWidth>
        legend="Grosor del borde"
        options={BORDER_WIDTH_OPTIONS}
        value={theme.borderWidth}
        onChange={(value) => updateField("borderWidth", value)}
      />

      {/* NEW: Border color */}
      {theme.borderWidth !== "none" && (
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Color del borde
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={isValidHexColor(theme.borderColor) ? theme.borderColor : "#e2e8f0"}
              onChange={(e) => updateField("borderColor", normalizeHexColor(e.target.value))}
              className="h-9 w-12 cursor-pointer rounded border border-border bg-surface"
              aria-label="Color del borde (selector)"
            />
            <input
              type="text"
              value={theme.borderColor}
              onChange={(e) => updateField("borderColor", e.target.value)}
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="#e2e8f0"
              maxLength={7}
            />
          </div>
        </div>
      )}

      {/* NEW: Background opacity */}
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">
          Opacidad del fondo — {theme.backgroundOpacity ?? 100}%
        </label>
        <input
          type="range"
          min={20}
          max={100}
          step={5}
          value={theme.backgroundOpacity ?? 100}
          onChange={(e) => updateField("backgroundOpacity", Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Opacidad del fondo"
        />
      </div>

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
