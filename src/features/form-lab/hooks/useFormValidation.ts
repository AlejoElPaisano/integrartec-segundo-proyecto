import { useCallback, useEffect, useMemo, useState } from "react";
import type { Form, FormField } from "../schema";
import { validateField } from "../utils";

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

export function useFormValidation(form: Form | null | undefined) {
  const [fieldsState, setFieldsState] = useState<Record<string, FieldState>>({});

  const validateFieldRules = useCallback((value: string, field: FormField): string | null => {
    return validateField(value, field.rules, field.type);
  }, []);

  const resetFieldsState = useCallback(() => {
    setFieldsState({});
  }, []);

  useEffect(() => {
    resetFieldsState();
  }, [form?.id, resetFieldsState]);

  const handleFieldChange = useCallback((fieldId: string, value: string, field: FormField) => {
    const error = validateFieldRules(value, field);
    const status: FieldValidationStatus = error ? "invalid" : value.trim() ? "valid" : "idle";

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
        const isActive = Boolean(state?.isDirty || currentValue.trim());

        if (!isActive) return null;

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
    resetFieldsState,
  };
}