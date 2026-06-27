import { z } from "zod";
import {
  formSchema,
  formFieldSchema,
  fieldRuleSchema,
  type FieldType,
  type FieldRule,
  type FormField,
  type Form,
} from "@/shared/lib/form-schema";

export { formSchema, formFieldSchema, fieldRuleSchema };
export type { FieldType, FieldRule, FormField, Form };

const formTemplateIdSchema = z.enum([
  "login",
  "signup",
  "checkout",
  "contact",
  "satisfaction",
  "appointment",
  "event-registration",
  "quote-request",
  "job-application",
  "newsletter-subscription",
  "hotel-reservation",
  "course-enrollment",
  "technical-support",
  "claim-warranty",
  "donation",
  "patient-registration",
  "medical-appointment",
  "product-review",
  "service-review",
  "scholarship-application",
]);

const formTemplateCategorySchema = z.enum([
  "cuentas",
  "comercio",
  "salud",
  "educacion",
  "soporte",
  "feedback",
  "reservas",
  "servicios",
  "recursos-humanos",
]);

const formTemplateComplexitySchema = z.enum([
  "simple",
  "intermedia",
  "avanzada",
]);

const templateRuleSchema = fieldRuleSchema.omit({ id: true }).extend({
  message: z.string().min(1),
});

const templateFieldSchema = formFieldSchema
  .omit({ id: true, rules: true })
  .extend({
    rules: z.array(templateRuleSchema),
  });

export const formTemplateSchema = z.object({
  id: formTemplateIdSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  category: formTemplateCategorySchema,
  tags: z.array(z.string().min(1)).min(1),
  complexity: formTemplateComplexitySchema,
  fields: z.array(templateFieldSchema).min(1),
});

export type FormTemplate = z.infer<typeof formTemplateSchema>;
export type FormTemplateCategory = z.infer<typeof formTemplateCategorySchema>;
export type FormTemplateComplexity = z.infer<typeof formTemplateComplexitySchema>;
