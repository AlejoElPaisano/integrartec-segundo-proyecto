import { useEffect, useRef, useState } from "react";
import type { Form, FormField } from "../schema";
import {
  buildErrorsSummary,
  checkFormValidity,
  resolveFieldStatus,
  shouldResetFieldStates,
  validateFieldRules,
  type FieldState,
} from "../utils";

export type { ActiveErrorSummary, FieldValidationStatus } from "../utils";

export function useFormValidation(
  form: Form | null | undefined,
  isValidating = false
) {
  const [fieldsState, setFieldsState] = useState<Record<string, FieldState>>({});
  const previousFormIdRef = useRef<string | null | undefined>(form?.id);

  const resetFieldsState = () => setFieldsState({});

  useEffect(() => {
    if (shouldResetFieldStates(previousFormIdRef.current, form?.id)) {
      setFieldsState({});
    }
    previousFormIdRef.current = form?.id;
  }, [form?.id]);

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
  }, [form, isValidating]);

  const handleFieldChange = (fieldId: string, value: string, field: FormField) => {
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
  };

  const errorsSummary = buildErrorsSummary(form, fieldsState);
  const isFormValid = checkFormValidity(form, fieldsState);

  return {
    fieldsState,
    errorsSummary,
    isFormValid,
    handleFieldChange,
    resetFieldsState,
  };
}
