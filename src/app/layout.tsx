import { Link, Outlet } from "react-router-dom";
import { FlaskConical, Search } from "lucide-react";
import { ThemeToggle } from "@/features/settings/components/ThemeToggle";
import { useCommandPaletteStore } from "@/features/command-palette/store";

export function AppLayout() {
  const openPalette = useCommandPaletteStore((state) => state.open);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-surface border-b border-border">
        <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg">
            <FlaskConical size={24} />
            <span>FormLab</span>
          </Link>
          <ul className="flex items-center gap-4">
            <li>
              <Link
                to="/"
                className="text-text hover:text-primary font-medium transition-colors"
              >
                Mis formularios
              </Link>
            </li>
            <li>
              <Link
                to="/builder"
                className="text-text hover:text-primary font-medium transition-colors"
              >
                Crear formulario
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={openPalette}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-text-muted transition-colors hover:text-text hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Abrir paleta de comandos"
              >
                <Search size={14} />
                <kbd className="hidden text-xs sm:inline">⌘K</kbd>
              </button>
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border py-4 text-center text-sm text-text-muted">
        <p>IntegrarTEC — Proyecto Integrador React 2026</p>
      </footer>
    </div>
  );
}
