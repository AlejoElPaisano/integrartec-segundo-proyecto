import type { ThemeMode } from "./schema";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(mode: ThemeMode, systemTheme: "light" | "dark"): "light" | "dark" {
  return mode === "system" ? systemTheme : mode;
}

export function applyThemeToDocument(resolved: "light" | "dark"): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function nextThemeMode(mode: ThemeMode): ThemeMode {
  const order: ThemeMode[] = ["light", "dark", "system"];
  const index = order.indexOf(mode);
  return order[(index + 1) % order.length] as ThemeMode;
}

export function themeModeLabel(mode: ThemeMode): string {
  const labels: Record<ThemeMode, string> = {
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
  };
  return labels[mode] ?? mode;
}
