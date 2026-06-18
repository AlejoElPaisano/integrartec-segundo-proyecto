import { Link, Outlet } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import { ThemeToggle } from "@/features/settings/components/ThemeToggle";

export function AppLayout() {
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
