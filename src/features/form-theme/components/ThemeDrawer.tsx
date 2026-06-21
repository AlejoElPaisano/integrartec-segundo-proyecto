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
  Save,
} from "lucide-react";
import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { ThemePresetGrid } from "./ThemePresetGrid";
import { ThemeColorPicker } from "./ThemeColorPicker";
import { ThemeEmojiPicker } from "./ThemeEmojiPicker";
import { ThemeStylePicker } from "./ThemeStylePicker";
import { ThemePatternPicker } from "./ThemePatternPicker";
import { ThemeImageUploader } from "./ThemeImageUploader";
import { ThemeAnimationPicker } from "./ThemeAnimationPicker";
import { ThemeTabs } from "./ThemeTabs";
import type { ThemeTab } from "./ThemeTabs";

type TabId = "presets" | "colors" | "emoji" | "style" | "pattern" | "images" | "animations";

const TABS: ReadonlyArray<ThemeTab> = [
  { id: "presets", label: "Presets", icon: Palette },
  { id: "colors", label: "Colores", icon: Pipette },
  { id: "emoji", label: "Emoji", icon: Smile },
  { id: "style", label: "Estilo", icon: Square },
  { id: "pattern", label: "Fondo", icon: Layers },
  { id: "images", label: "Imágenes", icon: ImageIcon },
  { id: "animations", label: "Animar", icon: Sparkles },
];

export function ThemeDrawer() {
  const { isDrawerOpen, closeDrawer, theme, setImage, saveAsPreset } = useFormTheme();
  const [activeTab, setActiveTab] = useState<TabId>("presets");
  const [isSaving, setIsSaving] = useState(false);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (isSaving) {
          setIsSaving(false);
        } else {
          closeDrawer();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen, closeDrawer, isSaving]);

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    saveAsPreset(presetName.trim());
    setPresetName("");
    setIsSaving(false);
  };

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
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
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

        <div className="border-b border-border bg-surface/50 px-4 py-3">
          <ThemeTabs
            tabs={TABS}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
            ariaLabel="Secciones de diseño"
            size="sm"
            variant="pills"
          />
        </div>

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

        <footer className="flex flex-col gap-3 border-t border-border bg-surface/50 px-5 py-3">
          {/* Save as preset modal */}
          {isSaving ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Nombre de la plantilla..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSavePreset();
                  if (e.key === "Escape") setIsSaving(false);
                }}
              />
              <button
                type="button"
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsSaving(false)}
                className="rounded-lg px-2 py-2 text-sm text-text-muted hover:text-text"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <p className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Check size={14} className="text-success" aria-hidden="true" />
                  Auto-guardado
                </p>
                <button
                  type="button"
                  onClick={() => setIsSaving(true)}
                  className="flex items-center gap-1 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  <Save size={12} />
                  Guardar plantilla
                </button>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Listo
              </button>
            </div>
          )}
        </footer>
      </aside>
    </div>
  );
}
