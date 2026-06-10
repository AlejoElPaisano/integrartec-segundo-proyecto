import { useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { useFormLabStore } from "@/features/form-lab/store";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function HomePage() {
  const forms = useFormLabStore((state) => state.forms);
  const removeForm = useFormLabStore((state) => state.removeForm);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Laboratorio de Validación de Formularios
          </h1>
          <p className="text-lg text-text-muted mb-8">
            Creá formularios dinámicos con reglas de validación combinables y
            observá cómo responden en tiempo real.
          </p>
          <Button size="lg" onClick={() => navigate("/builder")}>
            <Plus size={20} />
            Crear nuevo formulario
          </Button>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Formularios guardados
          </h2>

          {forms.length === 0 ? (
            <Card className="p-6 text-center text-text-muted">
              <FileText size={48} className="mx-auto mb-4 text-border" />
              <p>Todavía no hay formularios guardados.</p>
              <p className="mt-2">
                Empezá creando uno desde el botón de arriba.
              </p>
            </Card>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forms.map((form) => (
                <li key={form.id}>
                  <Card className="p-5 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-text">
                        {form.name}
                      </h3>
                      <span className="text-xs text-text-muted bg-surface px-2 py-1 rounded-full">
                        {form.fields.length} {form.fields.length === 1 ? "campo" : "campos"}
                      </span>
                    </div>

                    {form.description && (
                      <p className="text-sm text-text-muted mb-3 line-clamp-2">
                        {form.description}
                      </p>
                    )}

                    <p className="text-xs text-text-muted mb-4">
                      Creado{" "}
                      {formatDistanceToNow(new Date(form.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>

                    <div className="mt-auto flex items-center gap-2">
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
                        onClick={() => removeForm(form.id)}
                      >
                        <Trash2 size={14} className="text-danger" />
                      </Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
