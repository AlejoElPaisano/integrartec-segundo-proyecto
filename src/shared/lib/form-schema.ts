import { z } from "zod";
import { formThemeSchema } from "@/shared/lib/form-theme-schema";

const fieldTypeSchema = z.enum([
  "text",
  "email",
  "number",
  "password",
  "textarea",
  "date",
]);

export const fieldRuleSchema = z.object({
  id: z.string(),
  type: z.enum(["required", "min", "max", "email", "regex"]),
  value: z.string().optional(),
  message: z.string().optional(),
});

export const formFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  type: fieldTypeSchema,
  rules: z.array(fieldRuleSchema),
  placeholder: z.string().optional(),
});

export const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  fields: z.array(formFieldSchema),
  createdAt: z.iso.datetime(),
  theme: formThemeSchema.optional(),
});

export type FieldType = z.infer<typeof fieldTypeSchema>;
export type FieldRule = z.infer<typeof fieldRuleSchema>;
export type FormField = z.infer<typeof formFieldSchema>;
export type Form = z.infer<typeof formSchema>;
