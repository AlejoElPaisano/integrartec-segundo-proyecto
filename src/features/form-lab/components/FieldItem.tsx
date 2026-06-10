import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { cn } from "@/shared/lib/helpers";
import type { FormField } from "@/features/form-lab/schema";

interface FieldItemProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onRemove: (id: string) => void;
}

export function FieldItem({ field, onUpdate, onRemove }: FieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 border border-border rounded-lg bg-white",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="p-1 text-text-muted hover:text-text cursor-grab active:cursor-grabbing"
        aria-label="Reordenar campo"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Label
          </label>
          <Input
            value={field.label}
            onChange={(e) =>
              onUpdate({ ...field, label: e.target.value })
            }
            placeholder="Nombre del campo"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Tipo
          </label>
          <select
            value={field.type}
            onChange={(e) =>
              onUpdate({
                ...field,
                type: e.target.value as FormField["type"],
              })
            }
            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="text">Texto</option>
            <option value="email">Correo electrónico</option>
            <option value="number">Número</option>
            <option value="password">Contraseña</option>
            <option value="textarea">Texto largo</option>
            <option value="date">Fecha</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Placeholder
          </label>
          <Input
            value={field.placeholder ?? ""}
            onChange={(e) =>
              onUpdate({ ...field, placeholder: e.target.value })
            }
            placeholder="Placeholder opcional"
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(field.id)}
        aria-label="Eliminar campo"
      >
        <Trash2 size={16} className="text-danger" />
      </Button>
    </li>
  );
}
