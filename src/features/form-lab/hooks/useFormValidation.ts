import { useState, useCallback, useMemo } from "react";
import type { Form, FormField } from "../schema";

export type FieldValidationStatus = "idle" | "valid" | "invalid" | "pending";

interface FieldState {
  value: string;
  status: FieldValidationStatus;
  error: string | null;
  isDirty: boolean;
}

interface ActiveErrorSummary {
  fieldId: string;
  label: string;
  error: string;
}

export function useFormValidation(form: Form | null) {
  const [fieldsState, setFieldsState] = useState<Record<string, FieldState>>({});

  const validateFieldRules = useCallback((value: string, field: FormField): string | null => {
    if (!field.rules || field.rules.length === 0) return null;

    for (const rule of field.rules) {
      if (rule.type === "required" && (!value || value.trim() === "")) {
        return rule.message || "Este campo es requerido.";
      }
      if (rule.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return rule.message || "Email inválido.";
      }
      if (rule.type === "min" && rule.value && value.length < Number(rule.value)) {
        return rule.message || `Mínimo ${rule.value} caracteres.`;
      }
      if (rule.type === "max" && rule.value && value.length > Number(rule.value)) {
        return rule.message || `Máximo ${rule.value} caracteres.`;
      }
      if (rule.type === "regex" && value && rule.value) {
        try {
          const rx = new RegExp(String(rule.value));
          if (!rx.test(value)) return rule.message || "Formato inválido.";
        } catch {
          return "Configuración de regla inválida.";
        }
      }
    }
    return null;
  }, []);

  const handleFieldChange = useCallback((fieldId: string, value: string, field: FormField) => {

    const error = validateFieldRules(value, field);
    const status: FieldValidationStatus = error ? "invalid" : value ? "valid" : "idle";

    setFieldsState((prev) => ({
      ...prev,
      [fieldId]: {
        value,
        error,
        status,
        isDirty: true, 
      },
    }));
  }, [validateFieldRules]);

  const errorsSummary = useMemo((): ActiveErrorSummary[] => {
    if (!form) return [];
    
    return form.fields
      .map((field) => {
        const state = fieldsState[field.id];

        const currentValue = state ? state.value : "";
        const error = state ? state.error : validateFieldRules(currentValue, field);

        if (error) {
          return {
            fieldId: field.id,
            label: field.label,
            error,
          };
        }
        return null;
      })
      .filter((item): item is ActiveErrorSummary => item !== null);
  }, [form, fieldsState, validateFieldRules]);

  const isFormValid = errorsSummary.length === 0;

  return {
    fieldsState,
    errorsSummary,
    isFormValid,
    handleFieldChange,
  };
}