import { create } from "zustand";
import type { FormTheme } from "./schema";
import { getDefaultTheme } from "./utils";

interface FormThemeState {
  currentTheme: FormTheme;
  isDrawerOpen: boolean;
  setTheme: (theme: FormTheme) => void;
  applyPreset: (preset: FormTheme) => void;
  updateField: <K extends keyof FormTheme>(key: K, value: FormTheme[K]) => void;
  updateFields: (partial: Partial<FormTheme>) => void;
  setImage: (key: "backgroundImage" | "logoImage", dataUrl: string | undefined) => void;
  resetTheme: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useFormThemeStore = create<FormThemeState>((set) => ({
  currentTheme: getDefaultTheme(),
  isDrawerOpen: false,
  setTheme: (theme) => set({ currentTheme: theme }),
  applyPreset: (preset) => set({ currentTheme: { ...preset } }),
  updateField: (key, value) =>
    set((state) => ({
      currentTheme: { ...state.currentTheme, [key]: value },
    })),
  updateFields: (partial) =>
    set((state) => ({
      currentTheme: { ...state.currentTheme, ...partial },
    })),
  setImage: (key, dataUrl) =>
    set((state) => ({
      currentTheme: { ...state.currentTheme, [key]: dataUrl },
    })),
  resetTheme: () => set({ currentTheme: getDefaultTheme() }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}));
