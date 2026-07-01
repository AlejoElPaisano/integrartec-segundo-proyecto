/**
 * Helpers de DOM con side effects para el feature settings.
 *
 * Toda función que toque `document` o `window` vive aquí, fuera de
 * `utils.ts` (que debe permanecer puro según la skill §4).
 */

export type ResolvedTheme = "light" | "dark";

/**
 * Aplica o remueve la clase `light` en `document.documentElement` según
 * el tema resuelto. El CSS base es oscuro (Lab Nocturno), por lo que el
 * modo claro requiere la clase `.light`.
 */
export function applyThemeToDocument(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }
}
