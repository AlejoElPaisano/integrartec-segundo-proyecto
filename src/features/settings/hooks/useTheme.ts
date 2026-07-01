import { useEffect } from "react";
import { useThemeStore } from "@/features/settings/store";
import { useSystemTheme } from "@/features/settings/hooks/useSystemTheme";
import {
  resolveTheme,
  nextThemeMode,
  themeModeLabel,
} from "@/features/settings/utils";
import { applyThemeToDocument } from "@/features/settings/dom-helpers";

export function useTheme() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  const systemTheme = useSystemTheme();

  const resolved = resolveTheme(mode, systemTheme);

  useEffect(() => {
    const previous = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    applyThemeToDocument(resolved);
    return () => applyThemeToDocument(previous);
  }, [resolved]);

  return {
    mode,
    resolved,
    setMode,
    toggleMode,
    cycleToNext: () => setMode(nextThemeMode(mode)),
    label: themeModeLabel(mode),
  } as const;
}
