import { z } from "zod";

export const themeModeSchema = z.enum(["light", "dark", "system"]);

export type ThemeMode = z.infer<typeof themeModeSchema>;

export const themeSettingsSchema = z.object({
  mode: themeModeSchema,
});

export type ThemeSettings = z.infer<typeof themeSettingsSchema>;
