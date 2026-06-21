import { Play, Sparkles, Zap, MousePointerClick } from "lucide-react";
import { cn } from "@/shared/lib/helpers";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  SUBMIT_ANIMATION_OPTIONS,
  FIELD_ENTRANCE_ANIMATION_OPTIONS,
} from "@/features/form-theme/utils";

const submitIcons: Record<string, typeof Play> = {
  none: MousePointerClick,
  pulse: Play,
  shake: Zap,
  zoom: Sparkles,
  bounce: Play,
  race: Zap,
  confetti: Sparkles,
  rocket: Sparkles,
};

export function ThemeAnimationPicker() {
  const { theme, updateField } = useFormTheme();

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-3 text-sm font-semibold text-text">
          Animación del botón de enviar
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {SUBMIT_ANIMATION_OPTIONS.map((option) => {
            const Icon = submitIcons[option.value];
            const isActive = theme.submitAnimation === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField("submitAnimation", option.value)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-surface text-text hover:border-primary/50"
                )}
              >
                <Icon size={16} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-text">
          Animación de entrada de los campos
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {FIELD_ENTRANCE_ANIMATION_OPTIONS.map((option) => {
            const isActive = theme.fieldEntranceAnimation === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  updateField("fieldEntranceAnimation", option.value)
                }
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-surface text-text hover:border-primary/50"
                )}
              >
                <span>{option.label}</span>
                {isActive && <Sparkles size={14} />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
