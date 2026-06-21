import type {
  FormTheme,
  BorderRadius,
  FontFamily,
  Spacing,
  Pattern,
  LogoPosition,
  TitleAlignment,
  SubmitAnimation,
  FieldEntranceAnimation,
  CardStyle,
} from "./schema";

export const DEFAULT_THEME: FormTheme = {
  presetId: "default",
  primaryColor: "#3b82f6",
  accentColor: "#8b5cf6",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  emoji: "🧪",
  showEmoji: true,
  borderRadius: "md",
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
};

export function getDefaultTheme(): FormTheme {
  return { ...DEFAULT_THEME };
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

export function logoPositionClass(position: LogoPosition): string {
  const map: Record<LogoPosition, string> = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };
  return map[position];
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
    flat: "bg-white/95 border border-black/10",
    elevated: "bg-white/95 shadow-2xl border border-transparent",
    glass: "bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl",
    outline: "bg-transparent border-2 border-current",
  };
  return map[style];
}

export function applyThemeToCssVars(
  theme: FormTheme,
  root: HTMLElement | null = typeof document !== "undefined"
    ? document.documentElement
    : null
): void {
  if (!root) return;
  root.style.setProperty("--form-primary", theme.primaryColor);
  root.style.setProperty("--form-accent", theme.accentColor);
  root.style.setProperty("--form-bg", theme.backgroundColor);
  root.style.setProperty("--form-text", theme.textColor);
}

export function clearThemeCssVars(
  root: HTMLElement | null = typeof document !== "undefined"
    ? document.documentElement
    : null
): void {
  if (!root) return;
  root.style.removeProperty("--form-primary");
  root.style.removeProperty("--form-accent");
  root.style.removeProperty("--form-bg");
  root.style.removeProperty("--form-text");
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isValidBase64Image(value: string): boolean {
  return value.startsWith("data:image/");
}

export function backgroundImageStyle(theme: FormTheme): React.CSSProperties {
  const style: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
  };

  if (theme.backgroundImage && isValidBase64Image(theme.backgroundImage)) {
    style.backgroundImage = `url(${theme.backgroundImage})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    style.backgroundAttachment = "fixed";
  }

  return style;
}

export function backgroundOverlayStyle(
  theme: FormTheme
): React.CSSProperties {
  if (!theme.backgroundImage || !theme.backgroundOverlay) return {};
  return { backgroundColor: theme.backgroundOverlay };
}

export const RADIUS_OPTIONS: ReadonlyArray<{
  value: BorderRadius;
  label: string;
  preview: string;
}> = [
  { value: "none", label: "Sin bordes", preview: "rounded-none" },
  { value: "sm", label: "Suave", preview: "rounded-sm" },
  { value: "md", label: "Medio", preview: "rounded-md" },
  { value: "lg", label: "Redondeado", preview: "rounded-lg" },
  { value: "xl", label: "Muy redondeado", preview: "rounded-xl" },
  { value: "full", label: "Píldora", preview: "rounded-full" },
];

export const FONT_OPTIONS: ReadonlyArray<{
  value: FontFamily;
  label: string;
}> = [
  { value: "sans", label: "Sans" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
  { value: "display", label: "Display" },
  { value: "rounded", label: "Rounded" },
];

export const SPACING_OPTIONS: ReadonlyArray<{
  value: Spacing;
  label: string;
}> = [
  { value: "compact", label: "Compacto" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Holgado" },
];

export const PATTERN_OPTIONS: ReadonlyArray<{
  value: Pattern;
  label: string;
}> = [
  { value: "none", label: "Sin patrón" },
  { value: "dots", label: "Puntos" },
  { value: "grid", label: "Cuadrícula" },
  { value: "waves", label: "Ondas" },
  { value: "checkered", label: "A cuadros" },
  { value: "stars", label: "Estrellas" },
  { value: "carbon", label: "Carbono" },
];

export const LOGO_POSITION_OPTIONS: ReadonlyArray<{
  value: LogoPosition;
  label: string;
}> = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

export const TITLE_ALIGNMENT_OPTIONS: ReadonlyArray<{
  value: TitleAlignment;
  label: string;
}> = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

export const SUBMIT_ANIMATION_OPTIONS: ReadonlyArray<{
  value: SubmitAnimation;
  label: string;
}> = [
  { value: "none", label: "Ninguna" },
  { value: "pulse", label: "Pulso" },
  { value: "shake", label: "Sacudida" },
  { value: "zoom", label: "Zoom" },
  { value: "bounce", label: "Rebote" },
  { value: "race", label: "Carrera" },
  { value: "confetti", label: "Confeti" },
  { value: "rocket", label: "Cohete" },
];

export const FIELD_ENTRANCE_ANIMATION_OPTIONS: ReadonlyArray<{
  value: FieldEntranceAnimation;
  label: string;
}> = [
  { value: "none", label: "Ninguna" },
  { value: "fade-up", label: "Aparecer arriba" },
  { value: "slide-left", label: "Deslizar izquierda" },
  { value: "scale-in", label: "Escalar" },
  { value: "race-in", label: "Carrera" },
  { value: "flip-in", label: "Voltear" },
];

export const CARD_STYLE_OPTIONS: ReadonlyArray<{
  value: CardStyle;
  label: string;
}> = [
  { value: "flat", label: "Plano" },
  { value: "elevated", label: "Elevado" },
  { value: "glass", label: "Cristal" },
  { value: "outline", label: "Contorno" },
];

export const EMOJI_OPTIONS: ReadonlyArray<string> = [
  "🧪", "🔬", "📋", "🎨", "📝", "📊", "🚀", "✨",
  "🦄", "🌈", "🌟", "🎯", "📚", "🧠", "💡", "🔥",
  "🌙", "☀️", "🌴", "🍕", "🎵", "🎮", "⚡", "🌸",
  "🏎️", "🏁", "⚽", "🏀", "🎸", "🎬", "🎁", "🎈",
];
