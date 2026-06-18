import type { FormTheme } from "../schema";

export const FORM_THEME_PRESETS: ReadonlyArray<FormTheme> = [
  {
    presetId: "lab",
    primaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    emoji: "🧪",
    borderRadius: "md",
    fontFamily: "sans",
    spacing: "normal",
    pattern: "dots",
  },
  {
    presetId: "minimal",
    primaryColor: "#0f172a",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    emoji: "📋",
    borderRadius: "none",
    fontFamily: "sans",
    spacing: "compact",
    pattern: "none",
  },
  {
    presetId: "playful",
    primaryColor: "#ec4899",
    backgroundColor: "#fef3c7",
    textColor: "#7c2d12",
    emoji: "🎨",
    borderRadius: "full",
    fontFamily: "sans",
    spacing: "relaxed",
    pattern: "waves",
  },
  {
    presetId: "dark",
    primaryColor: "#60a5fa",
    backgroundColor: "#0f172a",
    textColor: "#f1f5f9",
    emoji: "🌙",
    borderRadius: "lg",
    fontFamily: "sans",
    spacing: "normal",
    pattern: "grid",
  },
  {
    presetId: "academic",
    primaryColor: "#7c3aed",
    backgroundColor: "#faf5ff",
    textColor: "#1e1b4b",
    emoji: "📚",
    borderRadius: "sm",
    fontFamily: "serif",
    spacing: "relaxed",
    pattern: "none",
  },
  {
    presetId: "tropical",
    primaryColor: "#10b981",
    backgroundColor: "#ecfdf5",
    textColor: "#064e3b",
    emoji: "🌴",
    borderRadius: "xl",
    fontFamily: "sans",
    spacing: "normal",
    pattern: "dots",
  },
];

export function getPresetById(id: string): FormTheme | undefined {
  return FORM_THEME_PRESETS.find((preset) => preset.presetId === id);
}
