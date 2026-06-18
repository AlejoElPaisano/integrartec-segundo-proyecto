import { create } from "zustand";
import type { FormTheme } from "./schema";
import { getDefaultTheme } from "./utils";

interface FormThemeState {
  currentTheme: FormTheme;
  setTheme: (theme: FormTheme) => void;
  applyPreset: (preset: FormTheme) => void;
  updateField: <K extends keyof FormTheme>(key: K, value: FormTheme[K]) => void;
  resetTheme: () => void;
}

export const useFormThemeStore = create<FormThemeState>((set) => ({
  currentTheme: getDefaultTheme(),
  setTheme: (theme) => set({ currentTheme: theme }),
  applyPreset: (preset) => set({ currentTheme: { ...preset } }),
  updateField: (key, value) =>
    set((state) => ({
      currentTheme: { ...state.currentTheme, [key]: value },
    })),
  resetTheme: () => set({ currentTheme: getDefaultTheme() }),
}));
