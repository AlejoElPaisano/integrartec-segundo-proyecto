import { useFormContext } from "react-hook-form";
import { Input } from "@/shared/components/ui/Input";
import { Card } from "@/shared/components/ui/Card";
import type { Form } from "@/features/form-lab/schema";

export function FormMetadataCard() {
  const { register, formState } = useFormContext<Form>();
  const { errors } = formState;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="form-name" className="block text-sm font-medium mb-1">
            Nombre del experimento
          </label>
          <Input
            id="form-name"
            {...register("name")}
            placeholder="Ej: Formulario de registro"
            error={errors.name?.message}
          />
        </div>
        <div>
          <label htmlFor="form-desc" className="block text-sm font-medium mb-1">
            Descripción (opcional)
          </label>
          <Input
            id="form-desc"
            {...register("description")}
            placeholder="Describe el propósito del experimento"
            error={errors.description?.message}
          />
        </div>
      </div>
    </Card>
  );
}
