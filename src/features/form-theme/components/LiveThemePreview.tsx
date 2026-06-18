import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  fontFamilyClass,
  patternToClass,
  radiusToClass,
  spacingClass,
} from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";

export function LiveThemePreview() {
  const { theme } = useFormTheme();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border",
        patternToClass(theme.pattern)
      )}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      <div className="p-6">
        <div
          className={cn(
            "mb-4 flex items-center gap-3 border-b border-current/10 pb-3",
            fontFamilyClass(theme.fontFamily)
          )}
        >
          <span className="text-3xl" aria-hidden="true">
            {theme.emoji}
          </span>
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: theme.textColor }}
            >
              Mi formulario
            </h3>
            <p
              className="text-xs opacity-70"
              style={{ color: theme.textColor }}
            >
              Vista previa del diseño
            </p>
          </div>
        </div>

        <div className={cn("flex flex-col", spacingClass(theme.spacing))}>
          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{ color: theme.textColor }}
            >
              Nombre
            </label>
            <div
              className={cn(
                "border border-current/20 bg-white/50 px-3 py-2 text-sm",
                radiusToClass(theme.borderRadius)
              )}
              style={{ color: "#0f172a" }}
            >
              Juan Pérez
            </div>
          </div>
          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{ color: theme.textColor }}
            >
              Email
            </label>
            <div
              className={cn(
                "border border-current/20 bg-white/50 px-3 py-2 text-sm",
                radiusToClass(theme.borderRadius)
              )}
              style={{ color: "#0f172a" }}
            >
              juan@ejemplo.com
            </div>
          </div>
          <button
            type="button"
            className={cn(
              "self-start px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90",
              radiusToClass(theme.borderRadius)
            )}
            style={{ backgroundColor: theme.primaryColor }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
