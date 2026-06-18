import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { FORM_THEME_PRESETS } from "@/features/form-theme/presets";
import { radiusToClass, fontFamilyClass } from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";

export function ThemePresetGrid() {
  const { theme, applyPreset } = useFormTheme();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {FORM_THEME_PRESETS.map((preset) => {
        const isSelected = theme.presetId === preset.presetId;
        return (
          <button
            key={preset.presetId}
            type="button"
            onClick={() => applyPreset(preset)}
            aria-pressed={isSelected}
            className={cn(
              "group flex flex-col items-stretch overflow-hidden rounded-lg border-2 text-left transition-colors",
              isSelected
                ? "border-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            <div
              className={cn(
                "flex h-16 items-center justify-center text-2xl",
                radiusToClass(preset.borderRadius)
              )}
              style={{
                backgroundColor: preset.backgroundColor,
                color: preset.textColor,
              }}
            >
              <span>{preset.emoji}</span>
            </div>
            <div
              className={cn(
                "flex items-center justify-between px-2.5 py-2",
                fontFamilyClass(preset.fontFamily)
              )}
              style={{
                backgroundColor: preset.primaryColor,
                color: "#ffffff",
              }}
            >
              <span className="truncate text-xs font-medium">
                {preset.presetId}
              </span>
              {isSelected && (
                <span className="rounded-full bg-white/30 px-1.5 py-0.5 text-[10px]">
                  activo
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
