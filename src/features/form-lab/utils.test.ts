import { describe, it, expect } from "vitest";
import {
  buildFormSchema,
  createFieldRule,
  createFormField,
  formatFieldType,
  formatRuleType,
  getDefaultRuleValue,
} from "./utils";
import type { FieldRule, FormField } from "./schema";

describe("createFieldRule", () => {
  it("generates a valid UUID id", () => {
    const rule = createFieldRule("required");
    expect(rule.id).toBeTypeOf("string");
    expect(rule.id).toHaveLength(36);
    expect(rule.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it("preserves type, value, and message", () => {
    const rule = createFieldRule("min", "5", "Mínimo 5 caracteres");
    expect(rule.type).toBe("min");
    expect(rule.value).toBe("5");
    expect(rule.message).toBe("Mínimo 5 caracteres");
  });

  it("does not mutate the inputs", () => {
    const type: FieldRule["type"] = "max";
    const value = "10";
    const message = "Máximo 10";
    const rule = createFieldRule(type, value, message);
    expect(rule).toEqual({
      id: expect.any(String),
      type: "max",
      value: "10",
      message: "Máximo 10",
    });
  });
});

describe("createFormField", () => {
  it("generates a valid UUID id", () => {
    const field = createFormField("Email");
    expect(field.id).toBeTypeOf("string");
    expect(field.id).toHaveLength(36);
  });

  it("applies the label and default text type", () => {
    const field = createFormField("Nombre");
    expect(field.label).toBe("Nombre");
    expect(field.type).toBe("text");
  });

  it("applies a custom type when provided", () => {
    const field = createFormField("Edad", "number");
    expect(field.type).toBe("number");
  });

  it("generates default placeholder from label", () => {
    const field = createFormField("Correo Electrónico");
    expect(field.placeholder).toBe("Ingresá correo electrónico");
  });

  it("accepts an empty rules array by default", () => {
    const field = createFormField("Teléfono");
    expect(field.rules).toEqual([]);
  });

  it("accepts custom rules", () => {
    const rule: FieldRule = {
      id: "test-rule-id",
      type: "required",
      message: "Requerido",
    };
    const field = createFormField("Usuario", "text", [rule]);
    expect(field.rules).toHaveLength(1);
    expect(field.rules[0].type).toBe("required");
  });
});

describe("formatFieldType", () => {
  it("maps all field types to Spanish labels", () => {
    const cases: Array<{ type: FormField["type"]; label: string }> = [
      { type: "text", label: "Texto" },
      { type: "email", label: "Correo electrónico" },
      { type: "number", label: "Número" },
      { type: "password", label: "Contraseña" },
      { type: "textarea", label: "Texto largo" },
      { type: "date", label: "Fecha" },
    ];

    for (const { type, label } of cases) {
      expect(formatFieldType(type)).toBe(label);
    }
  });

  it("returns the raw type for unknown values", () => {
    expect(formatFieldType("unknown" as FormField["type"])).toBe("unknown");
  });
});

describe("formatRuleType", () => {
  it("maps all rule types to Spanish labels", () => {
    const cases: Array<{ type: FieldRule["type"]; label: string }> = [
      { type: "required", label: "Requerido" },
      { type: "min", label: "Mínimo" },
      { type: "max", label: "Máximo" },
      { type: "email", label: "Email válido" },
      { type: "regex", label: "Expresión regular" },
    ];

    for (const { type, label } of cases) {
      expect(formatRuleType(type)).toBe(label);
    }
  });

  it("returns the raw type for unknown values", () => {
    expect(formatRuleType("unknown" as FieldRule["type"])).toBe("unknown");
  });
});

describe("getDefaultRuleValue", () => {
  it('returns "1" for min', () => {
    expect(getDefaultRuleValue("min")).toBe("1");
  });

  it('returns "100" for max', () => {
    expect(getDefaultRuleValue("max")).toBe("100");
  });

  it('returns ".*" for regex', () => {
    expect(getDefaultRuleValue("regex")).toBe(".*");
  });

  it('returns "" for required', () => {
    expect(getDefaultRuleValue("required")).toBe("");
  });

  it('returns "" for email', () => {
    expect(getDefaultRuleValue("email")).toBe("");
  });
});

describe("buildFormSchema", () => {
  it("passes when all fields satisfy their rules", () => {
    const field = createFormField("Nombre", "text", [createFieldRule("required")]);
    const schema = buildFormSchema([field]);
    expect(schema.safeParse({ [field.id]: "Juan" }).success).toBe(true);
  });

  it("fails when a required field is empty", () => {
    const field = createFormField("Nombre", "text", [createFieldRule("required")]);
    const schema = buildFormSchema([field]);
    const result = schema.safeParse({ [field.id]: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain(field.id);
    }
  });

  it("uses custom rule message", () => {
    const message = "Mínimo 3 caracteres";
    const field = createFormField("Nombre", "text", [
      createFieldRule("min", "3", message),
    ]);
    const schema = buildFormSchema([field]);
    const result = schema.safeParse({ [field.id]: "ab" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(message);
    }
  });

  it("ignores unknown keys and validates known keys", () => {
    const field = createFormField("Email", "email", [createFieldRule("email")]);
    const schema = buildFormSchema([field]);
    const result = schema.safeParse({ [field.id]: "not-an-email", extra: "ok" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain(field.id);
    }
  });
});
