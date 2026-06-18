import type {
  FormTheme,
  BorderRadius,
  FontFamily,
  Spacing,
  Pattern,
} from "./schema";

export const DEFAULT_THEME: FormTheme = {
  presetId: "default",
  primaryColor: "#3b82f6",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  emoji: "🧪",
  borderRadius: "md",
  fontFamily: "sans",
  spacing: "normal",
  pattern: "none",
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
  };
  return map[font];
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
  };
  return map[pattern];
}

export function applyThemeToCssVars(
  theme: FormTheme,
  root: HTMLElement | null = typeof document !== "undefined"
    ? document.documentElement
    : null
): void {
  if (!root) return;
  root.style.setProperty("--form-primary", theme.primaryColor);
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
  root.style.removeProperty("--form-bg");
  root.style.removeProperty("--form-text");
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
];

export const EMOJI_OPTIONS: ReadonlyArray<string> = [
  "🧪", "🔬", "📋", "🎨", "📝", "📊", "🚀", "✨",
  "🦄", "🌈", "🌟", "🎯", "📚", "🧠", "💡", "🔥",
  "🌙", "☀️", "🌴", "🍕", "🎵", "🎮", "⚡", "🌸",
];
