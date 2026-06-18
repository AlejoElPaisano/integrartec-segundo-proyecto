import { useEffect } from "react";
import { useFormThemeStore } from "@/features/form-theme/store";
import { applyThemeToCssVars, getDefaultTheme } from "@/features/form-theme/utils";
import type { FormTheme } from "@/features/form-theme/schema";

interface UseFormThemeOptions {
  initialTheme?: FormTheme;
  applyToDocument?: boolean;
}

export function useFormTheme(options: UseFormThemeOptions = {}) {
  const { initialTheme, applyToDocument = false } = options;
  const currentTheme = useFormThemeStore((state) => state.currentTheme);
  const setTheme = useFormThemeStore((state) => state.setTheme);
  const applyPreset = useFormThemeStore((state) => state.applyPreset);
  const updateField = useFormThemeStore((state) => state.updateField);
  const resetTheme = useFormThemeStore((state) => state.resetTheme);

  useEffect(() => {
    if (initialTheme) {
      setTheme(initialTheme);
    } else {
      resetTheme();
    }
  }, [initialTheme, setTheme, resetTheme]);

  useEffect(() => {
    if (!applyToDocument) return;
    applyThemeToCssVars(currentTheme);
  }, [currentTheme, applyToDocument]);

  return {
    theme: currentTheme,
    setTheme,
    applyPreset,
    updateField,
    resetTheme,
    effectiveTheme: currentTheme ?? getDefaultTheme(),
  } as const;
}
