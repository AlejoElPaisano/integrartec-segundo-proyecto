import type { ToastType, Toast } from "./schema";

export function defaultDurationForType(type: ToastType): number {
  return type === "error" ? 6000 : 4000;
}

export function createToast(
  type: ToastType,
  message: string,
  duration?: number
): Toast {
  return {
    id: crypto.randomUUID(),
    type,
    message,
    duration: duration ?? defaultDurationForType(type),
  };
}
