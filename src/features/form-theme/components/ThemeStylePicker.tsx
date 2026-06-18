import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  FONT_OPTIONS,
  RADIUS_OPTIONS,
  SPACING_OPTIONS,
  radiusToClass,
} from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";
import type { BorderRadius, FontFamily, Spacing } from "@/features/form-theme/schema";

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
    <div className="space-y-4">
      <RadioGroup<BorderRadius>
        legend="Radio de bordes"
        options={RADIUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        value={theme.borderRadius}
        onChange={(value) => updateField("borderRadius", value)}
      />
      <div>
        <span className="block text-xs font-medium text-text-muted mb-1">
          Vista previa
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
        legend="Tipografía"
        options={FONT_OPTIONS}
        value={theme.fontFamily}
        onChange={(value) => updateField("fontFamily", value)}
      />
      <RadioGroup<Spacing>
        legend="Espaciado"
        options={SPACING_OPTIONS}
        value={theme.spacing}
        onChange={(value) => updateField("spacing", value)}
      />
    </div>
  );
}
