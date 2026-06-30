import { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Upload,
  FileText,
  LayoutTemplate,
  Search,
  SlidersHorizontal,
  Tag,
  Folder,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "./ui/Card";
import { Modal } from "./ui/Modal";
import { useConfirmDialog } from "../hooks/useConfirmDialog";
import { useFormLabStore } from "@/features/form-lab/store";
import { useToast } from "@/shared/hooks/useToast";
import {
  extractAllTags,
} from "@/features/form-lab/utils";
import { sortLabel } from "@/shared/lib/sort";
import type { SortKey } from "@/shared/lib/sort";
import { cn, cssVars } from "@/shared/lib/helpers";
import { EmptyState } from "./ui/EmptyState";
import { ImportFormModal } from "./ImportFormModal";
import { FormCard } from "./FormCard";
import { useCollectionStore } from "@/features/collections/store";
import { getCollectionColorClasses, filterAndSortForms } from "@/features/collections/utils";
import type { Collection } from "@/features/collections/types";
import { NewCollectionModal } from "@/features/collections/components/NewCollectionModal";

interface CollectionFilterBarProps {
  collections: Collection[];
  activeCollectionId: string | null;
  onActiveCollectionChange: (id: string | null) => void;
  onRemoveCollection: (id: string) => void;
  onNewCollection: () => void;
  confirm: (opts: { title: string; message: string; confirmLabel: string; isDangerous: boolean }) => Promise<boolean>;
  showSuccess: (msg: string) => void;
}

function CollectionFilterBar({
  collections,
  activeCollectionId,
  onActiveCollectionChange,
  onRemoveCollection,
  onNewCollection,
  confirm,
  showSuccess,
}: CollectionFilterBarProps) {
  return (
    <nav
      aria-label="Filtrar por colecciÃ³n"
      className="form-anim-stagger mb-3 flex flex-wrap items-center gap-2 animate-fade-up select-none"
      style={cssVars({ "--anim-delay": "100ms" })}
    >
      <span className="flex items-center gap-1 text-xs text-text-muted">
        <Folder size={12} aria-hidden="true" />
        Colecciones:
      </span>
      <button
        type="button"
        onClick={() => onActiveCollectionChange(null)}
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
              onClick={() => onActiveCollectionChange(isSelected ? null : col.id)}
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
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                const confirmed = await confirm({
                  title: "Eliminar colecciÃ³n",
                  message: `Â¿Eliminar la colecciÃ³n "${col.name}"? Los formularios no se eliminarÃ¡n.`,
                  confirmLabel: "Eliminar",
                  isDangerous: true,
                });
                if (confirmed) {
                  if (activeCollectionId === col.id) onActiveCollectionChange(null);
                  onRemoveCollection(col.id);
                  showSuccess(`Se eliminÃ³ la colecciÃ³n "${col.name}"`);
                }
              }}
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-white opacity-0 hover:bg-danger/90 hover:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 shadow-sm transition-all text-[8px]"
              aria-label={`Eliminar colecciÃ³n ${col.name}`}
              title="Eliminar colecciÃ³n"
            >
              âœ•
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onNewCollection}
        className="flex items-center gap-1 rounded-full border border-dashed border-border bg-surface/30 px-3 py-1 text-xs font-medium text-text-muted hover:border-primary/50 hover:text-primary transition-colors"
      >
        <FolderPlus size={11} />
        <span>Nueva colecciÃ³n</span>
      </button>
    </nav>
  );
}

interface TagFilterBarProps {
  allTags: string[];
  activeTag: string | null;
  onActiveTagChange: (tag: string | null) => void;
}

function TagFilterBar({ allTags, activeTag, onActiveTagChange }: TagFilterBarProps) {
  return (
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
        onClick={() => onActiveTagChange(null)}
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
          onClick={() => onActiveTagChange(activeTag === tag ? null : tag)}
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
  );
}

interface FormSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortKey;
  onSortChange: (value: SortKey) => void;
}

function FormSearchBar({ searchQuery, onSearchChange, sortBy, onSortChange }: FormSearchBarProps) {
  return (
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
          onChange={(e) => onSearchChange(e.target.value)}
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
          onChange={(e) => onSortChange(e.target.value as SortKey)}
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
  );
}

type FilterState = {
  searchQuery: string;
  sortBy: SortKey;
  activeTag: string | null;
  activeCollectionId: string | null;
};

type FilterAction =
  | { type: "setSearchQuery"; value: string }
  | { type: "setSortBy"; value: SortKey }
  | { type: "setActiveTag"; value: string | null }
  | { type: "setActiveCollectionId"; value: string | null }
  | { type: "clearFilters" };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "setSearchQuery":
      return { ...state, searchQuery: action.value };
    case "setSortBy":
      return { ...state, sortBy: action.value };
    case "setActiveTag":
      return { ...state, activeTag: action.value };
    case "setActiveCollectionId":
      return { ...state, activeCollectionId: action.value };
    case "clearFilters":
      return { ...state, searchQuery: "", activeTag: null };
  }
}

export function MyFormsPage() {
  const forms = useFormLabStore((state) => state.forms);
  const removeForm = useFormLabStore((state) => state.removeForm);
  const duplicateForm = useFormLabStore((state) => state.duplicateForm);
  const addForm = useFormLabStore((state) => state.addForm);
  const navigate = useNavigate();
  const { confirm, confirmProps } = useConfirmDialog();
  const { success: showSuccess } = useToast();

  const collections = useCollectionStore((state) => state.collections);
  const addCollection = useCollectionStore((state) => state.addCollection);
  const removeCollection = useCollectionStore((state) => state.removeCollection);
  const removeFormFromAllCollections = useCollectionStore((state) => state.removeFormFromAllCollections);
  const removeFormFromCollection = useCollectionStore((state) => state.removeFormFromCollection);

  const [filter, dispatch] = useReducer(filterReducer, {
    searchQuery: "",
    sortBy: "newest" as SortKey,
    activeTag: null,
    activeCollectionId: null,
  });
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false);

  // Collect all unique tags across all forms
  const allTags = extractAllTags(forms);

  const filtered = filterAndSortForms(forms, {
    searchQuery: filter.searchQuery,
    activeTag: filter.activeTag,
    activeCollectionId: filter.activeCollectionId,
    collections,
    sortBy: filter.sortBy,
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
                  ? "TodavÃ­a no tenÃ©s formularios guardados"
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
          <FormSearchBar
            searchQuery={filter.searchQuery}
            onSearchChange={(v) => dispatch({ type: "setSearchQuery", value: v })}
            sortBy={filter.sortBy}
            onSortChange={(v) => dispatch({ type: "setSortBy", value: v })}
          />
        )}

      {(collections.length > 0 || forms.length > 0) && (
        <CollectionFilterBar
          collections={collections}
          activeCollectionId={filter.activeCollectionId}
          onActiveCollectionChange={(v) => dispatch({ type: "setActiveCollectionId", value: v })}
          onRemoveCollection={removeCollection}
          onNewCollection={() => setIsNewCollectionOpen(true)}
          confirm={confirm}
          showSuccess={showSuccess}
        />
      )}

      {allTags.length > 0 && (
        <TagFilterBar
          allTags={allTags}
          activeTag={filter.activeTag}
          onActiveTagChange={(v) => dispatch({ type: "setActiveTag", value: v })}
        />
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
                  Â¡Es hora de crear tu primer formulario!
                </h2>
                <p className="text-text-muted max-w-md mx-auto">
                  ElegÃ­ empezar desde cero o usÃ¡ una de las plantillas prearmadas para arrancar rÃ¡pido.
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
              emoji="ðŸ”"
              title="Sin resultados"
              description={
                filter.activeTag
                  ? `No hay formularios con la etiqueta "${filter.activeTag}".`
                  : `No hay formularios que coincidan con "${filter.searchQuery}".`
              }
              action={
                <Button
                  variant="secondary"
                  onClick={() => dispatch({ type: "clearFilters" })}
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
              <FormCard
                key={form.id}
                form={form}
                activeTag={filter.activeTag}
                onTagClick={(v) => dispatch({ type: "setActiveTag", value: v })}
                collections={collections}
                onRemoveFromCollection={removeFormFromCollection}
                onRemoveForm={removeForm}
                onRemoveFormFromAllCollections={removeFormFromAllCollections}
                onDuplicateForm={duplicateForm}
                index={index}
              />
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
          showSuccess(`Se importÃ³ "${form.name}"`);
        }}
      />

      <NewCollectionModal
        isOpen={isNewCollectionOpen}
        onClose={() => setIsNewCollectionOpen(false)}
        onCreate={(name, color) => {
          addCollection(name, color);
          showSuccess(`ColecciÃ³n "${name}" creada`);
        }}
      />
    </main>
  );
}
