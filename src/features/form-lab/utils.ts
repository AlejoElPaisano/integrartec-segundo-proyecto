import type { FormField, FieldRule } from "./schema";

export function createFieldRule(
  type: FieldRule["type"],
  value?: string,
  message?: string
): FieldRule {
  return {
    id: crypto.randomUUID(),
    type,
    value,
    message,
  };
}

export function createFormField(
  label: string,
  type: FormField["type"] = "text",
  rules: FieldRule[] = []
): FormField {
  return {
    id: crypto.randomUUID(),
    label,
    type,
    rules,
    placeholder: `Ingresá ${label.toLowerCase()}`,
  };
}

export function formatFieldType(type: FormField["type"]): string {
  const labels: Record<FormField["type"], string> = {
    text: "Texto",
    email: "Correo electrónico",
    number: "Número",
    password: "Contraseña",
    textarea: "Texto largo",
    date: "Fecha",
  };
  return labels[type] ?? type;
}

export function formatRuleType(type: FieldRule["type"]): string {
  const labels: Record<FieldRule["type"], string> = {
    required: "Requerido",
    min: "Mínimo",
    max: "Máximo",
    email: "Email válido",
    regex: "Expresión regular",
  };
  return labels[type] ?? type;
}

export function getDefaultRuleValue(type: FieldRule["type"]): string {
  switch (type) {
    case "min":
      return "1";
    case "max":
      return "100";
    case "regex":
      return ".*";
    default:
      return "";
  }
}
