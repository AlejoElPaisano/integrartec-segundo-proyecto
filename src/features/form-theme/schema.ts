export type BorderRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";

export type FontFamily = "sans" | "serif" | "mono";

export type Spacing = "compact" | "normal" | "relaxed";

export type Pattern = "none" | "dots" | "grid" | "waves";

export interface FormTheme {
  presetId: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  emoji: string;
  borderRadius: BorderRadius;
  fontFamily: FontFamily;
  spacing: Spacing;
  pattern: Pattern;
}
