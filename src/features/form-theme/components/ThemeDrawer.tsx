import { useEffect, useState } from "react";
import {
  X,
  Palette,
  Pipette,
  Smile,
  Square,
  Layers,
  Check,
  Eye,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import { cn } from "@/shared/lib/helpers";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { ThemePresetGrid } from "./ThemePresetGrid";
import { ThemeColorPicker } from "./ThemeColorPicker";
import { ThemeEmojiPicker } from "./ThemeEmojiPicker";
import { ThemeStylePicker } from "./ThemeStylePicker";
import { ThemePatternPicker } from "./ThemePatternPicker";
import { ThemeImageUploader } from "./ThemeImageUploader";
import { ThemeAnimationPicker } from "./ThemeAnimationPicker";

type TabId = "presets" | "colors" | "emoji" | "style" | "pattern" | "images" | "animations";

interface TabDef {
  id: TabId;
  label: string;
  icon: typeof Palette;
}

const TABS: ReadonlyArray<TabDef> = [
  { id: "presets", label: "Presets", icon: Palette },
  { id: "colors", label: "Colores", icon: Pipette },
  { id: "emoji", label: "Emoji", icon: Smile },
  { id: "style", label: "Estilo", icon: Square },
  { id: "pattern", label: "Fondo", icon: Layers },
  { id: "images", label: "Imágenes", icon: ImageIcon },
  { id: "animations", label: "Animar", icon: Sparkles },
];

export function ThemeDrawer() {
  const { isDrawerOpen, closeDrawer, theme, setImage } = useFormTheme();
  const [activeTab, setActiveTab] = useState<TabId>("presets");

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Personalizar el diseño del formulario"
      className="fixed inset-0 z-40"
    >
      <button
        type="button"
        aria-label="Cerrar panel de diseño"
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/10 animate-[fadeIn_150ms_ease-out]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-background/95 shadow-2xl backdrop-blur-sm animate-[slideInRight_200ms_ease-out]">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Palette size={18} className="text-primary" aria-hidden="true" />
              Personalizar diseño
            </h2>
            <p className="flex items-center gap-1 text-xs text-text-muted">
              <Eye size={12} aria-hidden="true" />
              Vista previa al lado
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface hover:text-text focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </header>

        <nav
          role="tablist"
          aria-label="Secciones de diseño"
          className="flex border-b border-border bg-surface/50 overflow-x-auto"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[4rem]",
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted hover:text-text"
                )}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              id={`tabpanel-${tab.id}`}
              role="tabpanel"
              hidden={activeTab !== tab.id}
              className="space-y-4"
            >
              {tab.id === "presets" && (
                <>
                  <p className="text-sm text-text-muted">
                    Empezá con un preset temático y personalizalo después.
                  </p>
                  <ThemePresetGrid />
                </>
              )}
              {tab.id === "colors" && <ThemeColorPicker />}
              {tab.id === "emoji" && <ThemeEmojiPicker />}
              {tab.id === "style" && <ThemeStylePicker />}
              {tab.id === "pattern" && (
                <>
                  <p className="text-sm text-text-muted">
                    Elegí un patrón de fondo para la vista previa.
                  </p>
                  <ThemePatternPicker />
                </>
              )}
              {tab.id === "images" && (
                <div className="space-y-5">
                  <ThemeImageUploader
                    label="Imagen de fondo"
                    imageUrl={theme.backgroundImage}
                    onChange={(dataUrl) => setImage("backgroundImage", dataUrl)}
                    aspectRatio="wide"
                  />
                  <ThemeImageUploader
                    label="Logo del formulario"
                    imageUrl={theme.logoImage}
                    onChange={(dataUrl) => setImage("logoImage", dataUrl)}
                    aspectRatio="auto"
                  />
                  {theme.backgroundImage && (
                    <label className="block text-xs font-medium text-text-muted mb-1">
                      Ajustá el overlay en la pestaña Colores para mejorar la legibilidad.
                    </label>
                  )}
                </div>
              )}
              {tab.id === "animations" && <ThemeAnimationPicker />}
            </div>
          ))}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border bg-surface/50 px-5 py-3">
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <Check size={14} className="text-success" aria-hidden="true" />
            Guardado automáticamente
          </p>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Listo
          </button>
        </footer>
      </aside>
    </div>
  );
}
