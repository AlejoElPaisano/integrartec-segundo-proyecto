import { useEffect, useRef } from "react";
import { useFormThemeStore } from "@/features/form-theme/store";
import { getDefaultTheme } from "@/features/form-theme/utils";
import { applyThemeToCssVars } from "@/features/form-theme/dom-helpers";
import type { FormTheme } from "@/features/form-theme/schema";

interface UseFormThemeOptions {
  initialTheme?: FormTheme;
  applyToDocument?: boolean;
  formId?: string | null;
}

export function useFormTheme(options: UseFormThemeOptions = {}) {
  const { initialTheme, applyToDocument = false, formId } = options;
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

  const lastFormId = useRef<string | null | undefined>(undefined);
  const hasLoadedTheme = useRef<boolean>(false);

  useEffect(() => {
    // Only manage theme initialization/reset if formId is explicitly provided (string or null).
    // This distinguishes the main form builder from other components that just read/edit the current theme.
    if (formId === undefined) return;

    const isNewForm = formId === null;
    const formChanged = lastFormId.current !== formId;

    if (formChanged) {
      lastFormId.current = formId;
      hasLoadedTheme.current = false;
    }

    if (isNewForm) {
      if (!hasLoadedTheme.current) {
        resetTheme();
        hasLoadedTheme.current = true;
      }
    } else {
      if (initialTheme && !hasLoadedTheme.current) {
        setTheme(initialTheme);
        hasLoadedTheme.current = true;
      }
    }
  }, [formId, initialTheme, setTheme, resetTheme]);

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
