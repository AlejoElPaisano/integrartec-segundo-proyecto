import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import {
  fontFamilyClass,
  headingFontFamilyClass,
  patternToClass,
  radiusToClass,
  spacingClass,
  titleAlignmentClass,
  submitAnimationClass,
  cardStyleClass,
  backgroundImageStyle,
  backgroundImageLayerStyle,
  backgroundOverlayStyle,
  shadowClass,
  hasEmoji,
  getFormBorderRadius,
  getInputBorderRadius,
  getButtonBorderRadius,
  getLogoBorderRadius,
  formBorderDataAttrs,
} from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";

export function LiveThemePreview() {
  const { theme } = useFormTheme();

  const containerStyle = backgroundImageStyle(theme);
  const imageLayerStyle = backgroundImageLayerStyle(theme);
  const overlayStyle = backgroundOverlayStyle(theme);
  const hasBackgroundImage = Boolean(theme.backgroundImage);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface/20 p-5">
      <div
        className={cn(
          "relative p-4 sm:p-6 overflow-hidden form-border-dynamic",
          radiusToClass(getFormBorderRadius(theme)),
          shadowClass(theme.shadow),
          patternToClass(theme.pattern)
        )}
        {...formBorderDataAttrs(theme)}
        style={{
          ...containerStyle,
          ...formBorderDataAttrs(theme).style,
        }}
      >
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            cardStyleClass(theme.cardStyle)
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
        {hasBackgroundImage && theme.backgroundOverlay && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={overlayStyle}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10">
          <header
            className={cn(
              "mb-5 flex flex-col",
              theme.titleAlignment === "center"
                ? "items-center text-center"
                : theme.titleAlignment === "right"
                  ? "items-end text-right"
                  : "items-start text-left"
            )}
          >
            <h3
              className={cn(
                "flex items-center gap-2 text-lg font-semibold form-themed-text",
                headingFontFamilyClass(theme.headingFontFamily),
                titleAlignmentClass(theme.titleAlignment)
              )}
            >
              {theme.logoImage && (
                <img
                  src={theme.logoImage}
                  alt=""
                  className={cn(
                    "h-7 w-auto object-contain shrink-0",
                    radiusToClass(getLogoBorderRadius(theme))
                  )}
                />
              )}
              {hasEmoji(theme) && (
                <span aria-hidden="true" className="shrink-0">{theme.emoji}</span>
              )}
              <span>Mi formulario</span>
            </h3>
            <p
              className={cn(
                "text-xs opacity-70 form-themed-text",
                titleAlignmentClass(theme.titleAlignment)
              )}
            >
              Vista previa del diseño
            </p>
          </header>

          {theme.showProgressBar && (
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1 opacity-80 form-themed-text">
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
                className="mb-1 block text-xs font-medium form-themed-text"
              >
                Nombre
              </label>
              <div
                className={cn(
                  "border border-current/20 bg-white/50 px-3 py-2 text-sm",
                  radiusToClass(getInputBorderRadius(theme))
                )}
                style={{ color: "#0f172a" }}
              >
                Juan Pérez
              </div>
            </div>
            <div>
              <label
                className="mb-1 block text-xs font-medium form-themed-text"
              >
                Email
              </label>
              <div
                className={cn(
                  "border border-current/20 bg-white/50 px-3 py-2 text-sm",
                  radiusToClass(getInputBorderRadius(theme))
                )}
                style={{ color: "#0f172a" }}
              >
                juan@ejemplo.com
              </div>
            </div>
            <button
              type="button"
              className={cn(
                "self-start px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 form-themed-bg-primary",
                radiusToClass(getButtonBorderRadius(theme)),
                submitAnimationClass(theme.submitAnimation)
              )}
            >
              {theme.submitLabel || "Enviar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
