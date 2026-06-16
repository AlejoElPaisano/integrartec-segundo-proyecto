import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Form } from "./schema";

interface FormLabState {
  forms: Form[];
  currentForm: Form | null;
  addForm: (form: Form) => void;
  removeForm: (id: string) => void;
  setCurrentForm: (form: Form | null) => void;
  updateForm: (form: Form) => void;
  getFormById: (id: string) => Form | undefined;
}

export const useFormLabStore = create<FormLabState>()(
  persist(
    (set, get) => ({
      forms: [],
      currentForm: null,
      addForm: (form) =>
        set((state) => ({
          forms: [...state.forms, form],
        })),
      removeForm: (id) =>
        set((state) => ({
          forms: state.forms.filter((f) => f.id !== id),
        })),
      setCurrentForm: (form) => set({ currentForm: form }),
      updateForm: (form) =>
        set((state) => ({
          forms: state.forms.map((f) => (f.id === form.id ? form : f)),
        })),
      getFormById: (id) => get().forms.find((f) => f.id === id),
    }),
    {
      name: "form-lab-storage",
    }
  )
);
