import { useEffect, useRef } from "react";
import { useFormThemeStore } from "@/features/form-theme/store";
import { getDefaultTheme } from "@/features/form-theme/utils";
import { applyThemeToCssVars } from "@/features/form-theme/dom-helpers";
import type { FormTheme } from "@/features/form-theme/schema";

interface UseFormThemeOptions {
  initialTheme?: FormTheme;
  applyToDocument?: boolean;
}

function themeKey(theme: FormTheme | undefined): string | undefined {
  if (!theme) return undefined;
  return `${theme.presetId}-${theme.primaryColor}-${theme.backgroundColor}-${theme.textColor}`;
}

export function useFormTheme(options: UseFormThemeOptions = {}) {
  const { initialTheme, applyToDocument = false } = options;
  const currentTheme = useFormThemeStore((state) => state.currentTheme);
  const isDrawerOpen = useFormThemeStore((state) => state.isDrawerOpen);
  const setTheme = useFormThemeStore((state) => state.setTheme);
  const applyPreset = useFormThemeStore((state) => state.applyPreset);
  const updateField = useFormThemeStore((state) => state.updateField);
  const updateFields = useFormThemeStore((state) => state.updateFields);
  const setImage = useFormThemeStore((state) => state.setImage);
  const resetTheme = useFormThemeStore((state) => state.resetTheme);
  const openDrawer = useFormThemeStore((state) => state.openDrawer);
  const closeDrawer = useFormThemeStore((state) => state.closeDrawer);
  const toggleDrawer = useFormThemeStore((state) => state.toggleDrawer);
  const userPresets = useFormThemeStore((state) => state.userPresets);
  const saveAsPreset = useFormThemeStore((state) => state.saveAsPreset);
  const removeUserPreset = useFormThemeStore((state) => state.removeUserPreset);

  const lastInitialKey = useRef<string | undefined>(undefined);

  useEffect(() => {
    const key = themeKey(initialTheme);
    if (key === lastInitialKey.current) return;
    lastInitialKey.current = key;

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
    isDrawerOpen,
    setTheme,
    applyPreset,
    updateField,
    updateFields,
    setImage,
    resetTheme,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    userPresets,
    saveAsPreset,
    removeUserPreset,
    effectiveTheme: currentTheme ?? getDefaultTheme(),
  } as const;
}
