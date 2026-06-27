export {
  DEFAULT_THEME,
  getDefaultTheme,
  hasEmoji,
  mergeTheme,
  radiusToClass,
  getFormBorderRadius,
  getInputBorderRadius,
  getButtonBorderRadius,
  getLogoBorderRadius,
  fontFamilyClass,
  headingFontFamilyClass,
  spacingClass,
  patternToClass,
  titleAlignmentClass,
  submitAnimationClass,
  fieldEntranceAnimationClass,
  cardStyleClass,
  shadowClass,
  borderWidthStyle,
  borderWidthToNumber,
  hasBorder,
  isValidHexColor,
  normalizeHexColor,
  formBorderDataAttrs,
} from "@/shared/lib/form-theme-helpers";

import type {
  BorderRadius,
  FontFamily,
  Spacing,
  Pattern,
  LogoPosition,
  TitleAlignment,
  SubmitAnimation,
  FieldEntranceAnimation,
  CardStyle,
  FormShadow,
  EmojiCategory,
} from "./schema";

/* ─── Option arrays ─── */

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

export const SHADOW_OPTIONS: ReadonlyArray<{
  value: FormShadow;
  label: string;
}> = [
  { value: "none", label: "Sin sombra" },
  { value: "sm", label: "Sutil" },
  { value: "md", label: "Media" },
  { value: "lg", label: "Grande" },
  { value: "xl", label: "Extra grande" },
  { value: "2xl", label: "Dramática" },
];

export const COLOR_PALETTE_PRESETS: ReadonlyArray<{
  name: string;
  primary: string;
  accent: string;
  bg: string;
  text: string;
}> = [
  { name: "Ocean", primary: "#0ea5e9", accent: "#6366f1", bg: "#f0f9ff", text: "#0c4a6e" },
  { name: "Sunset", primary: "#f97316", accent: "#ef4444", bg: "#fff7ed", text: "#7c2d12" },
  { name: "Forest", primary: "#16a34a", accent: "#059669", bg: "#f0fdf4", text: "#14532d" },
  { name: "Berry", primary: "#d946ef", accent: "#a855f7", bg: "#fdf4ff", text: "#581c87" },
  { name: "Midnight", primary: "#60a5fa", accent: "#a78bfa", bg: "#0f172a", text: "#f1f5f9" },
  { name: "Coral", primary: "#fb7185", accent: "#f472b6", bg: "#fff1f2", text: "#881337" },
  { name: "Mint", primary: "#2dd4bf", accent: "#34d399", bg: "#f0fdfa", text: "#134e4a" },
  { name: "Slate", primary: "#475569", accent: "#64748b", bg: "#f8fafc", text: "#0f172a" },
];

/* ─── Emoji categories ─── */

export const EMOJI_CATEGORIES: ReadonlyArray<EmojiCategory> = [
  {
    id: "popular",
    label: "⭐ Populares",
    emojis: [
      "🧪", "🔬", "📋", "🎨", "📝", "📊", "🚀", "✨",
      "🦄", "🌈", "🌟", "🎯", "📚", "🧠", "💡", "🔥",
    ],
  },
  {
    id: "faces",
    label: "😀 Caras",
    emojis: [
      "😀", "😎", "🤩", "😍", "🥳", "🤓", "😇", "🤔",
      "😏", "🙃", "😜", "🤗", "😂", "💀", "👻", "🤖",
    ],
  },
  {
    id: "nature",
    label: "🌿 Naturaleza",
    emojis: [
      "🌴", "🌸", "🌺", "🍀", "🌻", "🌊", "🏔️", "🌙",
      "☀️", "⭐", "🌈", "🔥", "❄️", "⚡", "🌍", "🍂",
    ],
  },
  {
    id: "food",
    label: "🍕 Comida",
    emojis: [
      "🍕", "🍔", "🍟", "🌮", "🍦", "🎂", "🍩", "☕",
      "🍷", "🍺", "🥐", "🍿", "🥑", "🍣", "🧁", "🍫",
    ],
  },
  {
    id: "activities",
    label: "⚽ Actividades",
    emojis: [
      "⚽", "🏀", "🎾", "🏈", "🎮", "🎸", "🎬", "🎵",
      "🎭", "🎪", "🏎️", "🏁", "🎤", "🎲", "🎯", "🏆",
    ],
  },
  {
    id: "travel",
    label: "✈️ Viajes",
    emojis: [
      "✈️", "🚀", "🚗", "🚂", "⛵", "🏖️", "🗽", "🗼",
      "🏰", "⛺", "🌋", "🎡", "🗺️", "🧳", "🚁", "🛸",
    ],
  },
  {
    id: "objects",
    label: "💎 Objetos",
    emojis: [
      "💎", "💰", "🎁", "🎈", "🎀", "🏅", "🏷️", "📎",
      "✏️", "🔑", "💌", "📦", "🔔", "🎊", "🧲", "🔮",
    ],
  },
  {
    id: "symbols",
    label: "💜 Símbolos",
    emojis: [
      "❤️", "💜", "💙", "💚", "💛", "🧡", "🤍", "🖤",
      "✅", "❌", "⭕", "💯", "🔷", "🔶", "♻️", "⚠️",
    ],
  },
];

/** Flat array of all emojis for backwards compat */
export const EMOJI_OPTIONS: ReadonlyArray<string> =
  EMOJI_CATEGORIES.flatMap((cat) => cat.emojis);

export const SUBMIT_PREVIEW_CLASS: Record<SubmitAnimation, string> = {
  none: "",
  pulse: "anim-preview-pulse",
  shake: "anim-preview-shake",
  zoom: "anim-preview-zoom",
  bounce: "anim-preview-bounce",
  race: "anim-preview-race",
  confetti: "anim-preview-confetti",
  rocket: "anim-preview-rocket",
};

export const FIELD_PREVIEW_CLASS: Record<FieldEntranceAnimation, string> = {
  none: "",
  "fade-up": "anim-preview-fade-up",
  "slide-left": "anim-preview-slide-left",
  "scale-in": "anim-preview-scale-in",
  "race-in": "anim-preview-race-in",
  "flip-in": "anim-preview-flip-in",
};

export const PRESET_NAMES: Record<string, string> = {
  lab: "Laboratorio",
  minimal: "Minimal",
  playful: "Juguetón",
  dark: "Oscuro",
  academic: "Académico",
  tropical: "Tropical",
  racing: "Fórmula 1",
  party: "Fiesta",
  neon: "Neón",
  sunset: "Atardecer",
  ocean: "Océano",
  retro: "Retro",
  cyberpunk: "Cyberpunk",
  nature: "Naturaleza",
  elegant: "Elegante",
};

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
