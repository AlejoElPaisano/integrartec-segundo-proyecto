import type { PropsWithChildren } from "react";
import { useTheme } from "@/features/settings/hooks/useTheme";

export function AppProviders({ children }: PropsWithChildren) {
  useTheme();
  return children;
}
