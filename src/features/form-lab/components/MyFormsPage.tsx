import { useState } from "react";
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
  Folder,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Modal } from "@/shared/components/ui/Modal";
import { useConfirmDialog } from "@/shared/hooks/useConfirmDialog";
import { useFormLabStore } from "@/features/form-lab/store";
import { useToast } from "@/features/notifications/hooks/useToast";
import {
  serializeForm,
  toSafeFilename,
  extractAllTags,
  sortLabel,
} from "@/features/form-lab/utils";
import type { SortKey } from "@/features/form-lab/utils";
import { downloadTextFile } from "@/features/form-lab/dom-helpers";
import { cn, cssVars } from "@/shared/lib/helpers";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { ImportFormModal } from "./ImportFormModal";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useCollectionStore } from "@/features/collections/store";
import { getCollectionColorClasses, filterAndSortForms } from "@/features/collections/utils";
import { CollectionSelect } from "@/features/collections/components/CollectionSelect";
import { NewCollectionModal } from "@/features/collections/components/NewCollectionModal";

export function MyFormsPage() {
  const forms = useFormLabStore((state) => state.forms);
  const removeForm = useFormLabStore((state) => state.removeForm);
  const duplicateForm = useFormLabStore((state) => state.duplicateForm);
  const addForm = useFormLabStore((state) => state.addForm);
  const navigate = useNavigate();
  const { confirm, confirmProps } = useConfirmDialog();
  const { success: showSuccess, error: showError } = useToast();

  const collections = useCollectionStore((state) => state.collections);
  const addCollection = useCollectionStore((state) => state.addCollection);
  const removeCollection = useCollectionStore((state) => state.removeCollection);
  const removeFormFromAllCollections = useCollectionStore((state) => state.removeFormFromAllCollections);
  const removeFormFromCollection = useCollectionStore((state) => state.removeFormFromCollection);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false);

  // Collect all unique tags across all forms
  const allTags = extractAllTags(forms);

  const filtered = filterAndSortForms(forms, {
    searchQuery,
    activeTag,
    activeCollectionId,
    collections,
    sortBy,
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
            className="form-anim-stagger mb-6 flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-up"
            style={cssVars({ "--anim-delay": "80ms" })}
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

      {/* Colecciones filter chips */}
      {(collections.length > 0 || forms.length > 0) && (
        <nav
          aria-label="Filtrar por colección"
          className="form-anim-stagger mb-3 flex flex-wrap items-center gap-2 animate-fade-up select-none"
          style={cssVars({ "--anim-delay": "100ms" })}
        >
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Folder size={12} aria-hidden="true" />
            Colecciones:
          </span>
          <button
            type="button"
            onClick={() => setActiveCollectionId(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeCollectionId === null
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-surface text-text-muted hover:border-primary/50"
            }`}
          >
            Todas
          </button>
          {collections.map((col) => {
            const isSelected = activeCollectionId === col.id;
            const colorClasses = getCollectionColorClasses(col.color);
            return (
              <div
                key={col.id}
                className="group relative flex items-center gap-1"
              >
                <button
                  type="button"
                  onClick={() => setActiveCollectionId(isSelected ? null : col.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    isSelected
                      ? cn(colorClasses.border, colorClasses.bg, colorClasses.text)
                      : "border-border bg-surface text-text-muted hover:border-primary/50"
                  )}
                >
                  <Folder
                    size={11}
                    className={cn(
                      "shrink-0",
                      isSelected ? colorClasses.text : "text-text-muted"
                    )}
                  />
                  <span>{col.name}</span>
                  <span className="text-[10px] opacity-60">({col.formIds.length})</span>
                </button>
                {/* Botón de eliminar colección */}
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const confirmed = await confirm({
                      title: "Eliminar colección",
                      message: `¿Eliminar la colección "${col.name}"? Los formularios no se eliminarán.`,
                      confirmLabel: "Eliminar",
                      isDangerous: true,
                    });
                    if (confirmed) {
                      if (activeCollectionId === col.id) setActiveCollectionId(null);
                      removeCollection(col.id);
                      showSuccess(`Se eliminó la colección "${col.name}"`);
                    }
                  }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-white opacity-0 hover:bg-danger/90 hover:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 shadow-sm transition-all text-[8px]"
                  aria-label={`Eliminar colección ${col.name}`}
                  title="Eliminar colección"
                >
                  ✕
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setIsNewCollectionOpen(true)}
            className="flex items-center gap-1 rounded-full border border-dashed border-border bg-surface/30 px-3 py-1 text-xs font-medium text-text-muted hover:border-primary/50 hover:text-primary transition-colors"
          >
            <FolderPlus size={11} />
            <span>Nueva colección</span>
          </button>
        </nav>
      )}

      {/* Tag filter chips */}
      {allTags.length > 0 && (
        <nav
          aria-label="Filtrar por etiqueta"
          className="form-anim-stagger mb-4 flex flex-wrap items-center gap-2 animate-fade-up"
          style={cssVars({ "--anim-delay": "120ms" })}
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
            className="form-anim-stagger animate-fade-up"
            style={cssVars({ "--anim-delay": "160ms" })}
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
          <section className="animate-fade-up py-4">
            <EmptyState
              emoji="🔍"
              title="Sin resultados"
              description={
                activeTag
                  ? `No hay formularios con la etiqueta "${activeTag}".`
                  : `No hay formularios que coincidan con "${searchQuery}".`
              }
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTag(null);
                  }}
                >
                  Limpiar filtros
                </Button>
              }
              size="lg"
            />
          </section>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((form, index) => (
              <li
                key={form.id}
                className="form-anim-stagger animate-fade-up"
                style={cssVars({ "--anim-delay": `${(index + 2) * 60}ms` })}
              >
                <Card className="group h-full p-0 card-lift">
                  {/* Color accent bar from theme */}
                  <div
                    className="h-1 rounded-t-xl bg-gradient-to-r from-[var(--card-accent-start)] to-[var(--card-accent-end)]"
                    style={cssVars({
                      "--card-accent-start": form.theme?.primaryColor ?? "var(--color-primary)",
                      "--card-accent-end": form.theme?.accentColor ?? "#8b5cf6",
                    })}
                  />
                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl bg-[var(--card-icon-bg)] text-[var(--card-icon-color)]"
                          style={cssVars({
                            "--card-icon-bg": form.theme
                              ? `${form.theme.primaryColor}18`
                              : "rgba(59,130,246,0.1)",
                            "--card-icon-color": form.theme?.primaryColor ?? "var(--color-primary)",
                          })}
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

                    {/* Colecciones Badges */}
                    {collections.filter((c) => c.formIds.includes(form.id)).length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5 select-none animate-fade-in">
                        {collections
                          .filter((c) => c.formIds.includes(form.id))
                          .map((col) => {
                            const colorClasses = getCollectionColorClasses(col.color);
                            return (
                              <span
                                key={col.id}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors",
                                  colorClasses.bg,
                                  colorClasses.text,
                                  colorClasses.border
                                )}
                              >
                                <Folder size={10} />
                                <span>{col.name}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFormFromCollection(col.id, form.id);
                                    showSuccess(`Se quitó de la colección "${col.name}"`);
                                  }}
                                  className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 transition-colors cursor-pointer"
                                  aria-label={`Quitar formulario de la colección ${col.name}`}
                                  title="Quitar de colección"
                                >
                                  ✕
                                </button>
                              </span>
                            );
                          })}
                      </div>
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
                      <CollectionSelect
                        formId={form.id}
                        align="right"
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Asignar a colecciones"
                            aria-label={`Asignar a colecciones ${form.name}`}
                          >
                            <Folder size={14} className="text-text-muted" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const ok = downloadTextFile({
                            filename: toSafeFilename(form.name),
                            content: serializeForm(form),
                          });
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
                          if (confirmed) {
                            removeForm(form.id);
                            removeFormFromAllCollections(form.id);
                          }
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

      <NewCollectionModal
        isOpen={isNewCollectionOpen}
        onClose={() => setIsNewCollectionOpen(false)}
        onCreate={(name, color) => {
          addCollection(name, color);
          showSuccess(`Colección "${name}" creada`);
        }}
      />
    </main>
  );
}
