import { Input } from "@/shared/components/ui/Input";
import { Card } from "@/shared/components/ui/Card";
import type { FormMetadata } from "@/features/form-lab/schema";

interface FormMetadataCardProps {
  value: FormMetadata;
  onChange: (value: FormMetadata) => void;
}

export function FormMetadataCard({ value, onChange }: FormMetadataCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="form-name" className="block text-sm font-medium mb-1">
            Nombre del formulario
          </label>
          <Input
            id="form-name"
            value={value.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...value, name: e.target.value })
            }
            placeholder="Ej: Formulario de registro"
          />
        </div>
        <div>
          <label htmlFor="form-desc" className="block text-sm font-medium mb-1">
            Descripción (opcional)
          </label>
          <Input
            id="form-desc"
            value={value.description ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...value, description: e.target.value })
            }
            placeholder="Describe el propósito del formulario"
          />
        </div>
      </div>
    </Card>
  );
}
