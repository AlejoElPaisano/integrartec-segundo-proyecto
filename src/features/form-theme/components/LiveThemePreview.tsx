import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  fontFamilyClass,
  headingFontFamilyClass,
  patternToClass,
  radiusToClass,
  spacingClass,
  logoPositionClass,
  titleAlignmentClass,
  submitAnimationClass,
  cardStyleClass,
  backgroundImageStyle,
  backgroundOverlayStyle,
  shadowClass,
  borderWidthStyle,
  hasEmoji,
} from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";

export function LiveThemePreview() {
  const { theme } = useFormTheme();

  const containerStyle = backgroundImageStyle(theme);
  const overlayStyle = backgroundOverlayStyle(theme);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border",
        patternToClass(theme.pattern)
      )}
      style={containerStyle}
    >
      {theme.backgroundImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={overlayStyle}
        />
      )}

      <div
        className={cn(
          "relative p-6",
          cardStyleClass(theme.cardStyle),
          radiusToClass(theme.borderRadius),
          shadowClass(theme.shadow)
        )}
        style={{
          borderWidth: borderWidthStyle(theme.borderWidth),
          borderStyle: theme.borderWidth !== "none" ? "solid" : undefined,
          borderColor: theme.borderWidth !== "none" ? theme.borderColor : undefined,
        }}
      >
        <header
          className={cn(
            "mb-5 flex flex-col",
            logoPositionClass(theme.logoPosition)
          )}
        >
          {theme.logoImage && (
            <img
              src={theme.logoImage}
              alt=""
              className="h-12 w-auto object-contain mb-3"
            />
          )}
          <h3
            className={cn(
              "flex items-center gap-2 text-lg font-semibold",
              headingFontFamilyClass(theme.headingFontFamily),
              titleAlignmentClass(theme.titleAlignment)
            )}
            style={{ color: theme.textColor }}
          >
            {hasEmoji(theme) && (
              <span aria-hidden="true">{theme.emoji}</span>
            )}
            <span>Mi formulario</span>
          </h3>
          <p
            className={cn(
              "text-xs opacity-70",
              titleAlignmentClass(theme.titleAlignment)
            )}
            style={{ color: theme.textColor }}
          >
            Vista previa del diseño
          </p>
        </header>

        {theme.showProgressBar && (
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-1 opacity-80">
              <span>Progreso</span>
              <span>50%</span>
            </div>
            <div className="form-progress-bar">
              <div style={{ width: "50%" }} />
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex flex-col",
            spacingClass(theme.spacing),
            fontFamilyClass(theme.fontFamily)
          )}
        >
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
              radiusToClass(theme.borderRadius),
              submitAnimationClass(theme.submitAnimation)
            )}
            style={{ backgroundColor: theme.primaryColor }}
          >
            {theme.submitLabel || "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
