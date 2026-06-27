import { z } from "zod";

const themeModeSchema = z.enum(["light", "dark", "system"]);

export type ThemeMode = z.infer<typeof themeModeSchema>;
