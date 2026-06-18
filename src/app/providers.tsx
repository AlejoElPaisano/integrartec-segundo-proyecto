import type { PropsWithChildren } from "react";
import { useTheme } from "@/features/settings/hooks/useTheme";
import { ToastContainer } from "@/features/notifications/components/ToastContainer";

export function AppProviders({ children }: PropsWithChildren) {
  useTheme();
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
