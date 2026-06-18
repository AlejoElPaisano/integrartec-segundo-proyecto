import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { isValidHexColor, normalizeHexColor } from "@/features/form-theme/utils";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isValidHexColor(value) ? value : "#000000"}
          onChange={(e) => onChange(normalizeHexColor(e.target.value))}
          className="h-9 w-12 cursor-pointer rounded border border-border bg-surface"
          aria-label={`${label} (selector de color)`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(normalizeHexColor(e.target.value))}
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="#3b82f6"
          maxLength={7}
        />
      </div>
    </div>
  );
}

export function ThemeColorPicker() {
  const { theme, updateField } = useFormTheme();

  return (
    <div className="space-y-4">
      <ColorField
        label="Color primario"
        value={theme.primaryColor}
        onChange={(value) => updateField("primaryColor", value)}
      />
      <ColorField
        label="Color de fondo"
        value={theme.backgroundColor}
        onChange={(value) => updateField("backgroundColor", value)}
      />
      <ColorField
        label="Color de texto"
        value={theme.textColor}
        onChange={(value) => updateField("textColor", value)}
      />
    </div>
  );
}
