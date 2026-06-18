import { useCommandPaletteStore } from "@/features/command-palette/store";

export function useCommandPalette() {
  const isOpen = useCommandPaletteStore((state) => state.isOpen);
  const open = useCommandPaletteStore((state) => state.open);
  const close = useCommandPaletteStore((state) => state.close);
  const toggle = useCommandPaletteStore((state) => state.toggle);

  return { isOpen, open, close, toggle } as const;
}
