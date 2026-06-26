import { describe, expect, it } from "vitest";
import type { Form, FormField } from "../schema";
import { validateField } from "../utils";
import {
  buildErrorsSummary,
  resolveFieldStatus,
  shouldResetFieldStates,
} from "./useFormValidation";

function createFormFixture(): Form {
  return {
    id: "form-1",
    name: "Formulario de prueba",
    description: "Prueba de validación",
    tags: [],
    fields: [
      {
        id: "name",
        label: "Nombre",
        type: "text",
        rules: [
          {
            id: "rule-required",
            type: "required",
            message: "Este campo es requerido.",
          },
        ],
        placeholder: "Ingresá tu nombre",
      },
      {
        id: "email",
        label: "Email",
        type: "text",
        rules: [
          {
            id: "rule-email",
            type: "email",
            message: "Ingresá un email válido.",
          },
        ],
        placeholder: "tuemail@ejemplo.com",
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    theme: undefined,
  };
}

describe("useFormValidation", () => {
  it("mantiene el estado inicial en idle para un campo vacío y sin interacción", () => {
    const status = resolveFieldStatus({
      value: "",
      isValidating: false,
      error: null,
      isDirty: false,
    });

    expect(status).toBe("idle");
  });

  it("pasa a pending mientras la validación está en curso", () => {
    const status = resolveFieldStatus({
      value: "",
      isValidating: true,
      error: null,
      isDirty: true,
    });

    expect(status).toBe("pending");
  });

  it("marca como invalid cuando una regla falla y expone el mensaje correspondiente", () => {
    const form = createFormFixture();
    const field = form.fields[0];
    const error = validateField("", field.rules, field.type);
    const status = resolveFieldStatus({
      value: "",
      isValidating: false,
      error,
      isDirty: true,
    });

    expect(status).toBe("invalid");
    expect(error).toBe("Este campo es requerido.");
  });

  it("marca como valid cuando la regla se cumple y limpia el error", () => {
    const form = createFormFixture();
    const field = form.fields[0];
    const error = validateField("Juan", field.rules, field.type);
    const status = resolveFieldStatus({
      value: "Juan",
      isValidating: false,
      error,
      isDirty: true,
    });

    expect(status).toBe("valid");
    expect(error).toBeNull();
  });

  it("agrupa solo los campos que quedaron en estado invalid en el resumen de errores", () => {
    const form = createFormFixture();
    const validateFieldRules = (value: string, field: FormField) =>
      validateField(value, field.rules, field.type);

    const fieldsState = {
      name: {
        value: "",
        error: "Este campo es requerido.",
        status: "invalid" as const,
        isDirty: true,
      },
      email: {
        value: "usuario@dominio.com",
        error: null,
        status: "valid" as const,
        isDirty: true,
      },
      bio: {
        value: "",
        error: null,
        status: "idle" as const,
        isDirty: false,
      },
    };

    const summary = buildErrorsSummary(form, fieldsState, validateFieldRules);

    expect(summary).toHaveLength(1);
    expect(summary[0]?.fieldId).toBe("name");
    expect(summary[0]?.error).toBe("Este campo es requerido.");
  });

  it("reinicia el estado cuando cambia el id del formulario", () => {
    expect(shouldResetFieldStates("form-1", "form-2")).toBe(true);
    expect(shouldResetFieldStates("form-1", "form-1")).toBe(false);
  });
});
