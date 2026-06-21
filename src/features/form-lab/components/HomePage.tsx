import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  FileText,
  LayoutTemplate,
  Sparkles,
  Zap,
  Palette,
  ShieldCheck,
  MousePointerClick,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { Modal } from "@/shared/components/ui/Modal";
import { useConfirmDialog } from "@/shared/hooks/useConfirmDialog";
import { useFormLabStore } from "@/features/form-lab/store";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const FEATURES = [
  {
    icon: Palette,
    title: "Diseño totalmente libre",
    description:
      "Colores, fuentes, imágenes, animaciones y presets temáticos para que cada formulario tenga su propia personalidad.",
  },
  {
    icon: ShieldCheck,
    title: "Reglas combinables",
    description:
      "Agregá validaciones por campo y combiná required, min, max, email y regex para entender la validación a fondo.",
  },
  {
    icon: MousePointerClick,
    title: "Respuesta en tiempo real",
    description:
      "Botón animado, indicadores visuales y feedback inmediato mientras completás cada campo.",
  },
  {
    icon: Zap,
    title: "Experiencia inmersiva",
    description:
      "Desde un formulario de F1 con banderas a cuadros hasta una fiesta con confeti: el límite lo ponés vos.",
  },
] as const;

export function HomePage() {
  const forms = useFormLabStore((state) => state.forms);
  const removeForm = useFormLabStore((state) => state.removeForm);
  const navigate = useNavigate();
  const { confirm, confirmProps } = useConfirmDialog();

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden px-6 pb-16 pt-12 hero-gradient">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in">
              <Sparkles size={16} />
              <span>Laboratorio de validación de formularios</span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-text sm:text-6xl">
              Creá formularios con{" "}
              <span className="relative inline-block text-primary">
                personalidad
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C50 2 250 2 298 8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="text-primary/40"
                  />
                </svg>
              </span>
            </h1>

            <p className="mb-10 max-w-2xl text-lg text-text-muted sm:text-xl">
              Diseñá formularios únicos con reglas de validación combinables,
              animaciones temáticas y una experiencia de usuario que destaca.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("/builder")}
                className="min-w-[14rem] animate-float"
              >
                <Plus size={20} />
                Crear formulario
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/templates")}
                className="min-w-[14rem]"
              >
                <LayoutTemplate size={20} />
                Explorar plantillas
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-text-muted">
              <span className="rounded-full bg-surface px-3 py-1 shadow-sm">
                🎨 Personalizable al 100%
              </span>
              <span className="rounded-full bg-surface px-3 py-1 shadow-sm">
                ⚡ Validación en tiempo real
              </span>
              <span className="rounded-full bg-surface px-3 py-1 shadow-sm">
                🏎️ Animaciones temáticas
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-text sm:text-3xl">
              Todo lo que necesitás para entender validación
            </h2>
            <p className="mt-3 text-text-muted">
              Una herramienta que va más allá de los creadores de formularios clásicos.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group p-5 transition-transform hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-semibold text-text">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-muted">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text">
                Tus formularios
              </h2>
              <p className="mt-1 text-text-muted">
                {forms.length === 0
                  ? "Todavía no tenés formularios guardados"
                  : `Tenés ${forms.length} formulario${forms.length === 1 ? "" : "s"} guardado${forms.length === 1 ? "" : "s"}`}
              </p>
            </div>
            {forms.length > 0 && (
              <Button size="sm" onClick={() => navigate("/builder")}>
                <Plus size={16} />
                Nuevo
              </Button>
            )}
          </div>

          {forms.length === 0 ? (
            <Card className="relative overflow-hidden p-8 text-center">
              <div className="absolute inset-0 hero-gradient opacity-50" />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary animate-float">
                  <FileText size={32} aria-hidden="true" />
                </div>
                <p className="text-lg font-medium text-text">
                  ¡Es hora de crear tu primer formulario!
                </p>
                <p className="mt-2 text-text-muted">
                  Elegí empezar desde cero o usá una de las plantillas prearmadas.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button onClick={() => navigate("/builder")}>
                    <Plus size={18} />
                    Crear formulario
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/templates")}
                  >
                    <LayoutTemplate size={18} />
                    Ver plantillas
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {forms.map((form) => (
                <li key={form.id}>
                  <Card className="group h-full p-0 transition-shadow hover:shadow-lg">
                    <div className="p-5">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                            {form.theme?.emoji ?? "🧪"}
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
                        <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-text-muted">
                          {form.fields.length}{" "}
                          {form.fields.length === 1 ? "campo" : "campos"}
                        </span>
                      </div>

                      {form.description && (
                        <p className="mb-4 line-clamp-2 text-sm text-text-muted">
                          {form.description}
                        </p>
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
      </section>
      <Modal {...confirmProps} />
    </main>
  );
}
