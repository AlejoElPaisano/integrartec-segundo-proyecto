import { useMemo, useState, type KeyboardEvent } from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Home, Plus, FlaskConical, Sun, Moon, Monitor } from "lucide-react";
import { useCommandPaletteStore } from "@/features/command-palette/store";
import { filterCommands } from "@/features/command-palette/utils";
import type { Command } from "@/features/command-palette/schema";
import { useThemeStore } from "@/features/settings/store";
import { useTheme } from "@/features/settings/hooks/useTheme";
import { cn } from "@/shared/lib/helpers";

const themeIconFor = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

export function CommandPalette() {
  const isOpen = useCommandPaletteStore((state) => state.isOpen);
  const close = useCommandPaletteStore((state) => state.close);
  const navigate = useNavigate();
  const { mode, cycleToNext, label: themeLabel } = useTheme();
  const toggleMode = useThemeStore((state) => state.toggleMode);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = useMemo<Command[]>(
    () => [
      {
        id: "go-home",
        label: "Ir a inicio",
        keywords: ["home", "mis formularios", "inicio"],
        icon: Home,
        action: () => navigate("/"),
      },
      {
        id: "create-form",
        label: "Crear nuevo formulario",
        keywords: ["nuevo", "builder", "crear", "formulario"],
        icon: Plus,
        action: () => navigate("/builder"),
      },
      {
        id: "go-builder",
        label: "Ir al constructor",
        keywords: ["builder", "editar", "constructor"],
        icon: FlaskConical,
        action: () => navigate("/builder"),
      },
      {
        id: "cycle-theme",
        label: `Cambiar tema (actual: ${themeLabel})`,
        keywords: ["tema", "dark", "light", "oscuro", "claro", "mode"],
        icon: themeIconFor[mode],
        action: cycleToNext,
      },
      {
        id: "toggle-theme",
        label: "Alternar tema claro/oscuro",
        keywords: ["toggle", "alternar", "theme", "tema"],
        icon: themeIconFor[mode],
        action: toggleMode,
      },
    ],
    [navigate, mode, themeLabel, cycleToNext, toggleMode]
  );

  const filtered = useMemo(
    () => filterCommands(commands, query),
    [commands, query]
  );

  const reset = () => {
    setQuery("");
    setSelectedIndex(0);
  };

  const handleClose = () => {
    close();
    reset();
  };

  const runCommand = (command: Command) => {
    command.action();
    handleClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1)
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const selected = filtered[selectedIndex];
      if (selected) runCommand(selected);
      return;
    }
  };

  if (!isOpen) return null;

  const noResults = filtered.length === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Paleta de comandos"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]"
    >
      <button
        type="button"
        aria-label="Cerrar paleta de comandos"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={18} className="text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Escribí un comando o buscá..."
            className="flex-1 bg-transparent text-text placeholder:text-text-muted focus:outline-none"
            aria-label="Buscar comando"
          />
          <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-text-muted sm:inline">
            ESC
          </kbd>
        </div>

        {noResults ? (
          <p className="px-4 py-6 text-center text-sm text-text-muted">
            No se encontraron comandos para “{query}”.
          </p>
        ) : (
          <ul role="listbox" className="max-h-80 overflow-y-auto py-2">
            {filtered.map((command, index) => {
              const Icon = command.icon;
              const isActive = index === selectedIndex;
              return (
                <li key={command.id} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => runCommand(command)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      isActive ? "bg-surface text-text" : "text-text hover:bg-surface"
                    )}
                  >
                    {Icon ? (
                      <Icon size={16} className="shrink-0 text-text-muted" />
                    ) : (
                      <span className="w-4 shrink-0" />
                    )}
                    <span className="flex-1">{command.label}</span>
                    {isActive && (
                      <CornerDownLeft
                        size={14}
                        className="shrink-0 text-text-muted"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
