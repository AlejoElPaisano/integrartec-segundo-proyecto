import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CSSProperties } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Tipo que permite pasar CSS custom properties (--*) en `style`.
 * React 19 todavía no las acepta directamente en `CSSProperties`.
 */
export type StyleWithVars = CSSProperties & Record<`--${string}`, string>;

/**
 * Helper para construir un objeto `style` con CSS custom properties
 * sin necesidad de hacer cast manual en cada uso.
 *
 * @example
 *   <div style={cssVars({ "--anim-delay": "100ms" })} className="form-anim-stagger" />
 */
export function cssVars(vars: Record<`--${string}`, string>): StyleWithVars {
  return vars as StyleWithVars;
}
