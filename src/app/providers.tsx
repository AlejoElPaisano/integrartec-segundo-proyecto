import type { PropsWithChildren } from "react";
import { useTheme } from "@/features/settings/hooks/useTheme";
import { ToastContainer } from "@/features/notifications/components/ToastContainer";
import { ErrorBoundary } from "@/shared/components/ui/ErrorBoundary";
import { ErrorFallback } from "@/features/error-pages/components/ErrorFallback";

export function AppProviders({ children }: PropsWithChildren) {
  useTheme();

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {children}
      <ToastContainer />
    </ErrorBoundary>
  );
}
