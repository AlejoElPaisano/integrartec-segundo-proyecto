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
