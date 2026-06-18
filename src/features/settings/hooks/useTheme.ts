import { useEffect, useState } from "react";
import { useThemeStore } from "@/features/settings/store";
import {
  applyThemeToDocument,
  getSystemTheme,
  resolveTheme,
  nextThemeMode,
  themeModeLabel,
} from "@/features/settings/utils";

export function useTheme() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
    getSystemTheme()
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const resolved = resolveTheme(mode, systemTheme);

  useEffect(() => {
    applyThemeToDocument(resolved);
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
