/**
 * Helpers de DOM con side effects para el feature settings.
 *
 * Toda función que toque `document` o `window` vive aquí, fuera de
 * `utils.ts` (que debe permanecer puro según la skill §4).
 */

export type ResolvedTheme = "light" | "dark";

/**
 * Aplica o remueve la clase `dark` en `document.documentElement` según
 * el tema resuelto. Es el único punto del feature que escribe sobre el DOM.
 */
export function applyThemeToDocument(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
