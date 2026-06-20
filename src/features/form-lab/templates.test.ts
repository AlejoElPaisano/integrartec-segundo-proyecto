import { describe, expect, it } from "vitest";
import {
  formSchema,
  formTemplateSchema,
  type FormTemplate,
} from "@/features/form-lab/schema";
import {
  createFormFromTemplate,
  formTemplates,
} from "@/features/form-lab/templates";
import { countTemplateRules } from "@/features/form-lab/utils";

const CREATED_AT = "2026-06-19T12:00:00.000Z";
const TEMPLATE_IDS: FormTemplate["id"][] = [
  "login",
  "signup",
  "checkout",
  "contact",
  "satisfaction",
  "appointment",
  "event-registration",
  "quote-request",
  "job-application",
];

function createSequentialIdGenerator() {
  let sequence = 0;
  return () => `test-id-${++sequence}`;
}

describe("formTemplates", () => {
  it("provides the nine expected templates", () => {
    expect(formTemplates.map((template) => template.id)).toEqual(TEMPLATE_IDS);
  });

  it("includes the required template categories", () => {
    expect(formTemplates.map((template) => template.id)).toEqual(
      expect.arrayContaining(["login", "signup", "checkout"])
    );
  });

  it("provides complete display information for every template", () => {
    formTemplates.forEach((template) => {
      expect(template.name.trim().length).toBeGreaterThan(0);
      expect(template.description.trim().length).toBeGreaterThan(0);
      expect(template.fields.length).toBeGreaterThan(0);
      expect(formTemplateSchema.safeParse(template).success).toBe(true);
      expect(countTemplateRules(template)).toBeGreaterThan(0);
    });
  });

  it.each(["login", "signup", "checkout"] as const)(
    "provides configured validation rules for %s",
    (templateId) => {
      const template = formTemplates.find(({ id }) => id === templateId);
      const rules = template?.fields.flatMap((field) => field.rules) ?? [];

      expect(template).toBeDefined();
      expect(rules.length).toBeGreaterThan(0);
      expect(rules.some((rule) => rule.type === "required")).toBe(true);
    }
  );

  it("covers every rule type supported by the D2 contract", () => {
    const ruleTypes = formTemplates.flatMap((template) =>
      template.fields.flatMap((field) =>
        field.rules.map((rule) => rule.type)
      )
    );

    expect(new Set(ruleTypes)).toEqual(
      new Set(["required", "min", "max", "email", "regex"])
    );
  });
});

describe("createFormFromTemplate", () => {
  it.each(formTemplates)("creates a valid form from $name", (template) => {
    const form = createFormFromTemplate(template, {
      createId: createSequentialIdGenerator(),
      getCreatedAt: () => CREATED_AT,
    });

    expect(formSchema.safeParse(form).success).toBe(true);
    expect(form.createdAt).toBe(CREATED_AT);
  });

  it("creates a different id for the form, fields, and rules", () => {
    const form = createFormFromTemplate(formTemplates[0]!, {
      createId: createSequentialIdGenerator(),
      getCreatedAt: () => CREATED_AT,
    });
    const ids = [
      form.id,
      ...form.fields.flatMap((field) => [
        field.id,
        ...field.rules.map((rule) => rule.id),
      ]),
    ];

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("creates fresh ids on every import", () => {
    const createId = createSequentialIdGenerator();
    const dependencies = {
      createId,
      getCreatedAt: () => CREATED_AT,
    };

    const firstForm = createFormFromTemplate(formTemplates[0]!, dependencies);
    const secondForm = createFormFromTemplate(formTemplates[0]!, dependencies);

    const firstIds = [
      firstForm.id,
      ...firstForm.fields.flatMap((field) => [
        field.id,
        ...field.rules.map((rule) => rule.id),
      ]),
    ];
    const secondIds = [
      secondForm.id,
      ...secondForm.fields.flatMap((field) => [
        field.id,
        ...field.rules.map((rule) => rule.id),
      ]),
    ];

    expect(firstIds.every((id) => !secondIds.includes(id))).toBe(true);
  });

  it("does not mutate the selected template", () => {
    const template = formTemplates[0]!;
    const snapshot = structuredClone(template);

    createFormFromTemplate(template, {
      createId: createSequentialIdGenerator(),
      getCreatedAt: () => CREATED_AT,
    });

    expect(template).toEqual(snapshot);
  });

  it("preserves rule types, values, and messages", () => {
    const template = formTemplates.find(({ id }) => id === "checkout")!;
    const form = createFormFromTemplate(template, {
      createId: createSequentialIdGenerator(),
      getCreatedAt: () => CREATED_AT,
    });
    const sourceRules = template.fields.flatMap((field) =>
      field.rules.map(({ type, value, message }) => ({ type, value, message }))
    );
    const createdRules = form.fields.flatMap((field) =>
      field.rules.map(({ type, value, message }) => ({ type, value, message }))
    );

    expect(createdRules).toEqual(sourceRules);
  });
});
