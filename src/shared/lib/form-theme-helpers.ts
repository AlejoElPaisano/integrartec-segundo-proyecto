import type {
  FormTheme,
  BorderRadius,
  FontFamily,
  Spacing,
  Pattern,
  TitleAlignment,
  SubmitAnimation,
  FieldEntranceAnimation,
  CardStyle,
  FormShadow,
  BorderWidth,
} from "@/shared/lib/form-theme-schema";

export const DEFAULT_THEME: FormTheme = {
  presetId: "default",
  primaryColor: "#3b82f6",
  accentColor: "#8b5cf6",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  emoji: "🧪",
  borderRadius: "md",
  borderRadiusForm: "md",
  borderRadiusInput: "md",
  borderRadiusButton: "md",
  borderRadiusLogo: "none",
  fontFamily: "sans",
  headingFontFamily: "sans",
  spacing: "normal",
  pattern: "none",
  logoPosition: "left",
  titleAlignment: "left",
  submitAnimation: "none",
  fieldEntranceAnimation: "none",
  submitLabel: "Enviar",
  cardStyle: "flat",
  showProgressBar: false,
  shadow: "md",
  borderWidth: "thin",
  borderColor: "#e2e8f0",
  backgroundOpacity: 100,
  backgroundImage: undefined,
  backgroundOverlay: undefined,
  logoImage: undefined,
  backgroundGradient: undefined,
  showEmoji: undefined,
};

export function getDefaultTheme(): FormTheme {
  return { ...DEFAULT_THEME };
}

export function hasEmoji(theme: FormTheme): boolean {
  return theme.emoji.trim().length > 0;
}

export function mergeTheme(
  base: FormTheme,
  override: Partial<FormTheme>
): FormTheme {
  return { ...base, ...override };
}

export function radiusToClass(radius: BorderRadius): string {
  const map: Record<BorderRadius, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };
  return map[radius];
}

export function getFormBorderRadius(theme: FormTheme): BorderRadius {
  return theme.borderRadiusForm ?? theme.borderRadius ?? "md";
}

export function getInputBorderRadius(theme: FormTheme): BorderRadius {
  return theme.borderRadiusInput ?? theme.borderRadius ?? "md";
}

export function getButtonBorderRadius(theme: FormTheme): BorderRadius {
  return theme.borderRadiusButton ?? theme.borderRadius ?? "md";
}

export function getLogoBorderRadius(theme: FormTheme): BorderRadius {
  return theme.borderRadiusLogo ?? "none";
}

export function fontFamilyClass(font: FontFamily): string {
  const map: Record<FontFamily, string> = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
    display: "font-display",
    rounded: "font-rounded",
  };
  return map[font];
}

export function headingFontFamilyClass(font: FontFamily): string {
  return fontFamilyClass(font);
}

export function spacingClass(spacing: Spacing): string {
  const map: Record<Spacing, string> = {
    compact: "space-y-3",
    normal: "space-y-6",
    relaxed: "space-y-10",
  };
  return map[spacing];
}

export function patternToClass(pattern: Pattern): string {
  const map: Record<Pattern, string> = {
    none: "",
    dots: "form-pattern-dots",
    grid: "form-pattern-grid",
    waves: "form-pattern-waves",
    checkered: "form-pattern-checkered",
    stars: "form-pattern-stars",
    carbon: "form-pattern-carbon",
  };
  return map[pattern];
}

export function titleAlignmentClass(alignment: TitleAlignment): string {
  const map: Record<TitleAlignment, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  return map[alignment];
}

export function submitAnimationClass(animation: SubmitAnimation): string {
  const map: Record<SubmitAnimation, string> = {
    none: "",
    pulse: "form-submit-pulse",
    shake: "form-submit-shake",
    zoom: "form-submit-zoom",
    race: "form-submit-race",
    bounce: "form-submit-bounce",
    confetti: "form-submit-confetti",
    rocket: "form-submit-rocket",
  };
  return map[animation];
}

export function fieldEntranceAnimationClass(
  animation: FieldEntranceAnimation
): string {
  const map: Record<FieldEntranceAnimation, string> = {
    none: "",
    "fade-up": "form-field-fade-up",
    "slide-left": "form-field-slide-left",
    "scale-in": "form-field-scale-in",
    "race-in": "form-field-race-in",
    "flip-in": "form-field-flip-in",
  };
  return map[animation];
}

export function cardStyleClass(style: CardStyle): string {
  const map: Record<CardStyle, string> = {
    flat: "bg-white/80 border border-black/10",
    elevated: "bg-white/80 shadow-2xl border border-transparent",
    glass: "bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl",
    outline: "bg-white/50 border-2 border-[color:var(--form-text,#1c1917)]",
  };
  return map[style];
}

export function shadowClass(shadow: FormShadow): string {
  const map: Record<FormShadow, string> = {
    none: "form-shadow-none",
    sm: "form-shadow-sm",
    md: "form-shadow-md",
    lg: "form-shadow-lg",
    xl: "form-shadow-xl",
    "2xl": "form-shadow-2xl",
  };
  return map[shadow];
}

export function borderWidthStyle(width: BorderWidth): string {
  if (typeof width === "number") {
    return `${width}px`;
  }
  const map: Record<Exclude<BorderWidth, number>, string> = {
    none: "0px",
    thin: "1px",
    medium: "2px",
    thick: "3px",
  };
  return map[width] || "0px";
}

export function borderWidthToNumber(width?: BorderWidth): number {
  if (typeof width === "number") return width;
  if (!width || width === "none") return 0;
  const map: Record<string, number> = {
    thin: 1,
    medium: 2,
    thick: 3,
  };
  return map[width] || 0;
}

export function hasBorder(width?: BorderWidth): boolean {
  if (!width || width === "none" || width === 0) return false;
  return true;
}

export function isValidHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

export function normalizeHexColor(value: string): string {
  if (!isValidHexColor(value)) return DEFAULT_THEME.primaryColor;
  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return value.toLowerCase();
}

/**
 * Atributos `data-*` para delegar el borde dinámico a CSS
 * (clase `.form-border-dynamic` en `index.css`).
 * Sustituye al `style={{ borderWidth/Color/Style }}` inline.
 */
export function formBorderDataAttrs(theme: FormTheme): {
  "data-border-w": string;
  "data-has-border": "true" | "false";
  style: React.CSSProperties & Record<`--${string}`, string>;
} {
  return {
    "data-border-w": String(borderWidthToNumber(theme.borderWidth)),
    "data-has-border": hasBorder(theme.borderWidth) ? "true" : "false",
    style: { "--form-border-color": theme.borderColor || "#e2e8f0" },
  };
}
