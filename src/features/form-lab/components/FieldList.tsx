import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";
import { createFormField } from "@/features/form-lab/utils";
import { FieldItem } from "./FieldItem";
import type { FormField } from "@/features/form-lab/schema";

interface FieldListProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export function FieldList({ fields, onChange }: FieldListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      onChange(arrayMove(fields, oldIndex, newIndex));
    }
  };

  const handleAddField = () => {
    const newField = createFormField(`Campo ${fields.length + 1}`);
    onChange([...fields, newField]);
  };

  const handleUpdateField = (updated: FormField) => {
    onChange(fields.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleRemoveField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Campos</h2>
        <Button size="sm" onClick={handleAddField}>
          <Plus size={16} />
          Agregar campo
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-text-muted text-center py-8">
          No hay campos todavía. Agregá uno para empezar.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-3">
              {fields.map((field) => (
                <FieldItem
                  key={field.id}
                  field={field}
                  onUpdate={handleUpdateField}
                  onRemove={handleRemoveField}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </Card>
  );
}
