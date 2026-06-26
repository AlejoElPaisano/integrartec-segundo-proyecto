import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export function shouldResetFieldStates(
  previousFormId: string | null | undefined,
  nextFormId: string | null | undefined
): boolean {
  return previousFormId !== nextFormId;
}

export function resolveFieldStatus({
  value,
  isValidating,
  error,
  isDirty,
}: {
  value: string;
  isValidating: boolean;
  error: string | null;
  isDirty: boolean;
}): FieldValidationStatus {
  if (isValidating) return "pending";
  if (!isDirty && !value.trim()) return "idle";
  return error ? "invalid" : value.trim() ? "valid" : "idle";
}

export function buildErrorsSummary(
  form: Form | null | undefined,
  fieldsState: Record<string, FieldState>,
  validateFieldRules: (value: string, field: FormField) => string | null
): ActiveErrorSummary[] {
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
}

export function useFormValidation(
  form: Form | null | undefined,
  isValidating = false
) {
  const [fieldsState, setFieldsState] = useState<Record<string, FieldState>>({});
  const previousFormIdRef = useRef<string | null | undefined>(form?.id);

  const validateFieldRules = useCallback((value: string, field: FormField): string | null => {
    return validateField(value, field.rules, field.type);
  }, []);

  const resetFieldsState = useCallback(() => {
    setFieldsState({});
  }, []);

  useEffect(() => {
    if (shouldResetFieldStates(previousFormIdRef.current, form?.id)) {
      resetFieldsState();
    }
    previousFormIdRef.current = form?.id;
  }, [form?.id, resetFieldsState]);

  useEffect(() => {
    if (!form) return;

    setFieldsState((prev) => {
      const next = { ...prev };

      for (const field of form.fields) {
        const currentState = next[field.id];
        if (!currentState?.isDirty) continue;

        if (isValidating) {
          next[field.id] = {
            ...currentState,
            status: "pending",
          };
          continue;
        }

        const error = validateFieldRules(currentState.value, field);
        next[field.id] = {
          ...currentState,
          error,
          status: resolveFieldStatus({
            value: currentState.value,
            isValidating,
            error,
            isDirty: currentState.isDirty,
          }),
        };
      }

      return next;
    });
  }, [form, isValidating, validateFieldRules]);

  const handleFieldChange = useCallback((fieldId: string, value: string, field: FormField) => {
    const error = validateFieldRules(value, field);
    const status = resolveFieldStatus({
      value,
      isValidating,
      error,
      isDirty: true,
    });

    setFieldsState((prev) => ({
      ...prev,
      [fieldId]: {
        value,
        error,
        status,
        isDirty: true,
      },
    }));
  }, [isValidating, validateFieldRules]);

  const errorsSummary = useMemo((): ActiveErrorSummary[] => {
    return buildErrorsSummary(form, fieldsState, validateFieldRules);
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