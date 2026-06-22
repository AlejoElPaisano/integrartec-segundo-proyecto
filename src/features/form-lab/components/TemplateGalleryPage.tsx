import { useState } from "react";
import { ArrowLeft, CheckCircle2, LayoutTemplate, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { useFormLabStore } from "@/features/form-lab/store";
import {
  createFormFromTemplate,
  formTemplates,
} from "@/features/form-lab/templates";
import type { FormTemplate } from "@/features/form-lab/schema";
import {
  countTemplateRules,
  formatFieldType,
} from "@/features/form-lab/utils";

interface TemplateCardProps {
  template: FormTemplate;
  onUseTemplate: (template: FormTemplate) => void;
}

function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  const validationCount = countTemplateRules(template);

  return (
    <article aria-labelledby={`template-${template.id}`} className="h-full">
      <Card className="flex h-full flex-col p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id={`template-${template.id}`}
              className="text-lg font-semibold text-text"
            >
              {template.name}
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              {template.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-text-muted">
            <span className="rounded-full border border-border bg-background px-2 py-1">
              {template.fields.length} campos
            </span>
            <span>
              {validationCount}{" "}
              {validationCount === 1 ? "validación" : "validaciones"}
            </span>
          </div>
        </header>

        <section className="mb-5 flex-1" aria-label={`Campos de ${template.name}`}>
          <ul className="space-y-2">
            {template.fields.map((field) => (
              <li
                key={`${template.id}-${field.label}`}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex items-center gap-2 text-text">
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-success"
                    aria-hidden="true"
                  />
                  {field.label}
                </span>
                <span className="text-right text-xs text-text-muted">
                  {formatFieldType(field.type)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <Button
          className="mt-auto w-full"
          onClick={() => onUseTemplate(template)}
        >
          <Sparkles size={16} aria-hidden="true" />
          Usar plantilla
        </Button>
      </Card>
    </article>
  );
}

export function TemplateGalleryPage() {
  const addForm = useFormLabStore((state) => state.addForm);
  const setCurrentForm = useFormLabStore((state) => state.setCurrentForm);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = formTemplates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseTemplate = (template: FormTemplate) => {
    const form = createFormFromTemplate(template, {
      createId: () => crypto.randomUUID(),
      getCreatedAt: () => new Date().toISOString(),
    });

    addForm(form);
    setCurrentForm(form);
    navigate(`/builder?id=${form.id}`);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 animate-fade-up">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft size={16} aria-hidden="true" />
            Volver
          </Button>

          <div className="mt-6 flex items-start gap-4">
            <span className="rounded-lg bg-primary p-3 text-white">
              <LayoutTemplate size={28} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-text">
                Galería de plantillas
              </h1>
              <p className="mt-2 max-w-2xl text-text-muted">
                Elegí un formulario prearmado y personalizalo desde el
                constructor.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div
            className="relative mt-6 max-w-md animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar plantilla..."
              className="w-full rounded-lg border border-border bg-surface pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              aria-label="Buscar plantilla"
            />
          </div>
        </header>

        <section aria-label="Plantillas disponibles">
          {filtered.length === 0 ? (
            <EmptyState
              emoji="🔍"
              title="Sin resultados"
              description={`No encontramos plantillas que coincidan con "${searchQuery}". Probá con otro término.`}
              action={
                <Button variant="secondary" onClick={() => setSearchQuery("")}>
                  Limpiar búsqueda
                </Button>
              }
              size="lg"
            />
          ) : (
            <ul
              className="grid list-none grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              role="list"
            >
              {filtered.map((template, index) => (
                <li
                  key={template.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <TemplateCard
                    template={template}
                    onUseTemplate={handleUseTemplate}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
