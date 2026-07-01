import { Link, Outlet, useLocation } from "react-router-dom";
import { Search, FolderOpen } from "lucide-react";
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
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-30 glass-nav border-b border-border/50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-primary font-bold text-lg group"
          >
            <img
              src="/icons.png"
              alt="FormForge Logo"
              className="h-11 w-auto object-contain transition-transform group-hover:scale-110"
            />
            <span className="bg-gradient-to-r from-primary to-[#8b5cf6] bg-clip-text text-transparent">
              FormForge
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

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/50 bg-surface/30 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <Link to="/" className="inline-flex items-center gap-2 text-primary">
                <img
                  src="/icons.png"
                  alt="FormForge Logo"
                  className="h-9 w-auto object-contain"
                />
                <span className="font-display text-xl tracking-tight text-text">FormForge</span>
              </Link>
              <p className="text-sm text-text-muted leading-relaxed">
                Diseñá, validá y compartí formularios con reglas combinables, animaciones temáticas y estilo propio.
              </p>
            </div>

            <nav aria-label="Navegación secundaria">
              <h3 className="mb-3 text-sm font-semibold text-text">Links rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-text-muted transition-colors hover:text-primary">Inicio</Link>
                </li>
                <li>
                  <Link to="/builder" className="text-text-muted transition-colors hover:text-primary">Crear formulario</Link>
                </li>
                <li>
                  <Link to="/forms" className="text-text-muted transition-colors hover:text-primary">Mis formularios</Link>
                </li>
                <li>
                  <Link to="/templates" className="text-text-muted transition-colors hover:text-primary">Plantillas</Link>
                </li>
              </ul>
            </nav>

            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-semibold text-text">IntegrarTEC</h3>
              <p className="text-sm text-text-muted">
                Proyecto Integrador React 2026
              </p>
              <p className="font-mono text-xs text-primary/80">
                Experimentá. Validá. Repetí.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 sm:flex-row">
            <p className="text-xs text-text-muted/60">
              © 2026 FormForge. Hecho con cuidado para IntegrarTEC.
            </p>
            <div className="flex items-center gap-4 text-xs text-text-muted/60">
              <span>React 19</span>
              <span>·</span>
              <span>TypeScript</span>
              <span>·</span>
              <span>Tailwind v4</span>
            </div>
          </div>
        </div>
      </footer>

      <CommandPalette />
    </div>
  );
}
