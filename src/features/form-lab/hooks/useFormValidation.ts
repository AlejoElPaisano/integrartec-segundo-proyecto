import { useMemo } from "react";
import type { Form } from "../schema";
import {
  buildErrorsSummary,
  checkFormValidity,
  resolveFieldStatus,
  validateFieldRules,
  type FieldState,
} from "../utils";

export type { ActiveErrorSummary, FieldValidationStatus } from "../utils";

interface UseFormValidationOptions {
  values: Record<string, string | undefined>;
  touchedFields: Record<string, boolean | undefined>;
  isValidating: boolean;
}

export function useFormValidation(
  form: Form | null | undefined,
  { values, touchedFields, isValidating }: UseFormValidationOptions
) {
  const fieldsState = useMemo<Record<string, FieldState>>(() => {
    const next: Record<string, FieldState> = {};
    if (!form) return next;

    for (const field of form.fields) {
      const value = values[field.id] ?? "";
      const isDirty = Boolean(touchedFields[field.id]);

      // Only show validation state for touched fields or when the form is being validated.
      if (!isDirty && !isValidating) continue;

      const error = validateFieldRules(value, field);
      next[field.id] = {
        value,
        isDirty,
        error,
        status: resolveFieldStatus({
          value,
          isValidating,
          error,
          isDirty,
        }),
      };
    }

    return next;
  }, [form, values, touchedFields, isValidating]);

  const errorsSummary = useMemo(
    () => buildErrorsSummary(form, fieldsState),
    [form, fieldsState]
  );
  const isFormValid = useMemo(
    () => checkFormValidity(form, fieldsState),
    [form, fieldsState]
  );

  return {
    fieldsState,
    errorsSummary,
    isFormValid,
  };
}
