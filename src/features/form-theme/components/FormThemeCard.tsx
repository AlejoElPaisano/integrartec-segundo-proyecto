import { Palette } from "lucide-react";
import { Card } from "@/shared/components/ui/Card";
import { ThemePresetGrid } from "./ThemePresetGrid";
import { ThemeColorPicker } from "./ThemeColorPicker";
import { ThemeStylePicker } from "./ThemeStylePicker";
import { ThemePatternPicker } from "./ThemePatternPicker";
import { ThemeEmojiPicker } from "./ThemeEmojiPicker";

export function FormThemeCard() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Palette size={18} className="text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Diseño del formulario</h2>
      </div>
      <p className="mb-6 text-sm text-text-muted">
        Elegí un preset o personalizá colores, emoji, tipografía y patrón. El
        preview se actualiza en vivo.
      </p>

      <section className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text">Presets</h3>
          <ThemePresetGrid />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-text">Emoji / Sticker</h3>
          <ThemeEmojiPicker />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-text">Colores</h3>
          <ThemeColorPicker />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-text">Estilo</h3>
          <ThemeStylePicker />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-text">Fondo</h3>
          <ThemePatternPicker />
        </div>
      </section>
    </Card>
  );
}
