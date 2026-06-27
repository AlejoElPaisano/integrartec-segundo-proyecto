import { z } from "zod";

const toastTypeSchema = z.enum(["success", "error", "warning", "info"]);

const toastSchema = z.object({
  id: z.string(),
  type: toastTypeSchema,
  message: z.string().min(1),
  duration: z.number().positive(),
});

export type ToastType = z.infer<typeof toastTypeSchema>;
export type Toast = z.infer<typeof toastSchema>;
