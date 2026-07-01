import { z } from "zod";

// Schema interno usado para derivar el tipo ThemeMode. No se exporta porque
// el contrato público del feature es el tipo, no el schema.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const themeModeSchema = z.enum(["light", "dark", "system"]);

export type ThemeMode = z.infer<typeof themeModeSchema>;
