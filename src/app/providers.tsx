import type { PropsWithChildren } from "react";
import { useTheme } from "@/features/settings/hooks/useTheme";
import { ToastContainer } from "@/features/notifications/components/ToastContainer";
import { CommandPalette } from "@/features/command-palette/components/CommandPalette";
import { useCommandPaletteStore } from "@/features/command-palette/store";
import { useKeyboardShortcut } from "@/shared/hooks/useKeyboardShortcut";

export function AppProviders({ children }: PropsWithChildren) {
  useTheme();
  const toggle = useCommandPaletteStore((state) => state.toggle);
  useKeyboardShortcut("k", toggle, { metaKey: true });
  useKeyboardShortcut("k", toggle, { ctrlKey: true });

  return (
    <>
      {children}
      <ToastContainer />
      <CommandPalette />
    </>
  );
}
