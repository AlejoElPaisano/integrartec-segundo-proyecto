import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Download,
  Upload,
  FileText,
  LayoutTemplate,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Modal } from "@/shared/components/ui/Modal";
import { useConfirmDialog } from "@/shared/hooks/useConfirmDialog";
import { useFormLabStore } from "@/features/form-lab/store";
import { useToast } from "@/features/notifications/hooks/useToast";
import {
  downloadTextFile,
  serializeForm,
  toSafeFilename,
} from "@/features/form-lab/utils";
import { ImportFormModal } from "./ImportFormModal";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type SortKey = "newest" | "oldest" | "name" | "fields";

function sortLabel(key: SortKey): string {
  const map: Record<SortKey, string> = {
    newest: "Más recientes",
    oldest: "Más antiguos",
    name: "Nombre A-Z",
    fields: "Más campos",
  };
  return map[key];
}

export function MyFormsPage() {
  const forms = useFormLabStore((state) => state.forms);
  const removeForm = useFormLabStore((state) => state.removeForm);
  const duplicateForm = useFormLabStore((state) => state.duplicateForm);
  const addForm = useFormLabStore((state) => state.addForm);
  const navigate = useNavigate();
  const { confirm, confirmProps } = useConfirmDialog();
  const { success: showSuccess, error: showError } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Collect all unique tags across all forms
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const form of forms) {
      for (const tag of form.tags ?? []) set.add(tag);
    }
    return Array.from(set).sort();
  }, [forms]);

  const filtered = forms
    .filter((form) => {
      const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = activeTag === null || (form.tags ?? []).includes(activeTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "fields":
          return b.fields.length - a.fields.length;
        default:
          return 0;
      }
    });

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 animate-fade-up">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text">Mis formularios</h1>
              <p className="mt-1 text-text-muted">
                {forms.length === 0
                  ? "Todavía no tenés formularios guardados"
                  : `${forms.length} formulario${forms.length === 1 ? "" : "s"} guardado${forms.length === 1 ? "" : "s"}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsImportOpen(true)}
              >
                <Upload size={16} />
                Importar
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/templates")}
              >
                <LayoutTemplate size={16} />
                Plantillas
              </Button>
              <Button onClick={() => navigate("/builder")}>
                <Plus size={16} />
                Nuevo formulario
              </Button>
            </div>
          </div>
        </header>

        {forms.length > 0 && (
          <section
            className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar formulario..."
                className="w-full rounded-lg border border-border bg-surface pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                aria-label="Buscar formulario"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                size={14}
                className="text-text-muted"
                aria-hidden="true"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Ordenar formularios"
              >
                {(["newest", "oldest", "name", "fields"] as const).map((key) => (
                  <option key={key} value={key}>
                    {sortLabel(key)}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )}

      {/* Tag filter chips */}
      {allTags.length > 0 && (
        <nav
          aria-label="Filtrar por etiqueta"
          className="mb-4 flex flex-wrap items-center gap-2 animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Tag size={12} aria-hidden="true" />
            Filtrar:
          </span>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeTag === null
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-surface text-text-muted hover:border-primary/50"
            }`}
          >
            Todos
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surface text-text-muted hover:border-primary/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </nav>
      )}

        {filtered.length === 0 && forms.length === 0 ? (
          <section
            className="animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            <Card className="relative overflow-hidden p-10 text-center">
              <div className="absolute inset-0 hero-gradient opacity-50" />
              <div className="relative">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-float">
                  <FileText size={40} aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-text mb-2">
                  ¡Es hora de crear tu primer formulario!
                </h2>
                <p className="text-text-muted max-w-md mx-auto">
                  Elegí empezar desde cero o usá una de las plantillas prearmadas para arrancar rápido.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button size="lg" onClick={() => navigate("/builder")}>
                    <Plus size={18} />
                    Crear formulario
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/templates")}
                  >
                    <LayoutTemplate size={18} />
                    Ver plantillas
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        ) : filtered.length === 0 ? (
          <section className="animate-fade-up py-16 text-center">
            <Search
              size={40}
              className="mx-auto mb-4 text-text-muted opacity-40"
              aria-hidden="true"
            />
            <p className="text-lg font-medium text-text">
              No se encontraron resultados
            </p>
            <p className="mt-1 text-text-muted">
              Probá con otro término de búsqueda
            </p>
          </section>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((form, index) => (
              <li
                key={form.id}
                className="animate-fade-up"
                style={{ animationDelay: `${(index + 2) * 60}ms` }}
              >
                <Card className="group h-full p-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                  {/* Color accent bar from theme */}
                  <div
                    className="h-1 rounded-t-xl"
                    style={{
                      background: form.theme
                        ? `linear-gradient(90deg, ${form.theme.primaryColor}, ${form.theme.accentColor})`
                        : "linear-gradient(90deg, var(--color-primary), #8b5cf6)",
                    }}
                  />
                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                          style={{
                            backgroundColor: form.theme
                              ? `${form.theme.primaryColor}18`
                              : "rgba(59,130,246,0.1)",
                            color: form.theme?.primaryColor ?? "var(--color-primary)",
                          }}
                        >
                          {form.theme?.emoji || "🧪"}
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-text">
                            {form.name}
                          </h3>
                          <p className="text-xs text-text-muted">
                            Creado{" "}
                            {formatDistanceToNow(new Date(form.createdAt), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-text-muted border border-border">
                        {form.fields.length}{" "}
                        {form.fields.length === 1 ? "campo" : "campos"}
                      </span>
                    </div>

                    {form.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-text-muted">
                        {form.description}
                      </p>
                    )}

                    {/* Tags */}
                    {(form.tags ?? []).length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {(form.tags ?? []).map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                              activeTag === tag
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-surface text-text-muted hover:border-primary/50"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/preview/${form.id}`)}
                      >
                        <Eye size={14} />
                        Previsualizar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/builder?id=${form.id}`)}
                      >
                        <Pencil size={14} />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const ok = downloadTextFile(
                            toSafeFilename(form.name),
                            serializeForm(form)
                          );
                          if (ok) showSuccess(`Se exportó "${form.name}"`);
                          else showError("No se pudo descargar el archivo");
                        }}
                        aria-label={`Exportar formulario ${form.name}`}
                      >
                        <Download size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          duplicateForm(form.id);
                          showSuccess(`Se duplicó "${form.name}"`);
                        }}
                        aria-label={`Duplicar formulario ${form.name}`}
                      >
                        <Copy size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const confirmed = await confirm({
                            title: "Eliminar formulario",
                            message: `¿Eliminar el formulario "${form.name}"? Esta acción no se puede deshacer.`,
                            confirmLabel: "Eliminar",
                            isDangerous: true,
                          });
                          if (confirmed) removeForm(form.id);
                        }}
                        aria-label={`Eliminar formulario ${form.name}`}
                      >
                        <Trash2 size={14} className="text-danger" />
                      </Button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/preview/${form.id}`)}
                    className="flex w-full items-center justify-center gap-1 border-t border-border bg-surface/50 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-surface"
                  >
                    Abrir formulario
                    <ArrowRight size={14} />
                  </button>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Modal {...confirmProps} />
      <ImportFormModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={(form) => {
          addForm(form);
          showSuccess(`Se importó "${form.name}"`);
        }}
      />
    </main>
  );
}
