import { Link, Outlet, useLocation } from "react-router-dom";
import { FlaskConical, Search, FolderOpen } from "lucide-react";
import { ThemeToggle } from "@/features/settings/components/ThemeToggle";
import { CommandPalette } from "@/features/command-palette/components/CommandPalette";
import { useCommandPaletteStore } from "@/features/command-palette/store";
import { useKeyboardShortcut } from "@/shared/hooks/useKeyboardShortcut";
import { useFormLabStore } from "@/features/form-lab/store";
import { cn } from "@/shared/lib/helpers";

interface NavLinkProps {
  to: string;
  label: string;
  isActive: boolean;
}

function NavLink({ to, label, isActive }: NavLinkProps) {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "text-primary bg-primary/10"
            : "text-text-muted hover:text-text hover:bg-surface"
        )}
      >
        {label}
      </Link>
    </li>
  );
}

export function AppLayout() {
  const openPalette = useCommandPaletteStore((state) => state.open);
  const togglePalette = useCommandPaletteStore((state) => state.toggle);
  const formCount = useFormLabStore((state) => state.forms.length);
  const location = useLocation();
  useKeyboardShortcut("k", togglePalette, { metaKey: true });
  useKeyboardShortcut("k", togglePalette, { ctrlKey: true });

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 glass-nav border-b border-border/50">
        <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-primary font-bold text-lg group"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition-transform group-hover:scale-110">
              <FlaskConical size={18} />
            </span>
            <span className="bg-gradient-to-r from-primary to-[#8b5cf6] bg-clip-text text-transparent">
              FormLab
            </span>
          </Link>
          <ul className="flex items-center gap-1">
            <NavLink to="/" label="Inicio" isActive={isActive("/")} />
            <li>
              <Link
                to="/forms"
                className={cn(
                  "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive("/forms")
                    ? "text-primary bg-primary/10"
                    : "text-text-muted hover:text-text hover:bg-surface"
                )}
              >
                <FolderOpen size={14} />
                Mis formularios
                {formCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white px-1">
                    {formCount}
                  </span>
                )}
              </Link>
            </li>
            <NavLink
              to="/builder"
              label="Crear"
              isActive={isActive("/builder")}
            />
            <li className="ml-1">
              <button
                type="button"
                onClick={openPalette}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-2.5 py-1.5 text-sm text-text-muted transition-colors hover:text-text hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Abrir paleta de comandos"
              >
                <Search size={14} />
                <kbd className="hidden text-xs opacity-60 sm:inline">⌘K</kbd>
              </button>
            </li>
            <li className="ml-1">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/50 py-6 text-center">
        <p className="text-sm text-text-muted">
          <span className="opacity-60">Hecho con</span>{" "}
          <span className="text-primary">♥</span>{" "}
          <span className="opacity-60">por el equipo de</span>{" "}
          <span className="font-semibold text-text">IntegrarTEC</span>{" "}
          <span className="opacity-60">— Proyecto Integrador React 2026</span>
        </p>
      </footer>

      <CommandPalette />
    </div>
  );
}
