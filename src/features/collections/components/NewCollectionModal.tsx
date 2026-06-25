import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";
import { z } from "zod";
import { Button } from "@/shared/components/ui/Button";
import { newCollectionFormSchema, collectionColorSchema } from "../schema";
import { cn } from "@/shared/lib/helpers";

type FormData = z.infer<typeof newCollectionFormSchema>;

const COLOR_LABELS: Record<z.infer<typeof collectionColorSchema>, string> = {
  blue: "Azul",
  violet: "Violeta",
  emerald: "Esmeralda",
  amber: "Ámbar",
  pink: "Rosa",
  slate: "Gris",
};

interface NewCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, color: z.infer<typeof collectionColorSchema>) => void;
}

export function NewCollectionModal({ isOpen, onClose, onCreate }: NewCollectionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(newCollectionFormSchema),
    defaultValues: { name: "", color: "slate" },
    mode: "onChange",
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (!isOpen) {
      reset({ name: "", color: "slate" });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: FormData) => {
    onCreate(data.name, data.color);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-collection-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-[scaleIn_200ms_ease-out]">
        <h3
          id="new-collection-title"
          className="text-lg font-bold text-text mb-4 flex items-center gap-2"
        >
          <FolderPlus className="text-primary" size={20} aria-hidden="true" />
          Crear nueva colección
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="col-name"
              className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"
            >
              Nombre
            </label>
            <input
              id="col-name"
              type="text"
              {...register("name")}
              placeholder="Ej: Formularios de Venta, Soporte..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-danger" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <span className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
              Color de carpeta
            </span>
            <div className="flex gap-3">
              {collectionColorSchema.options.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue("color", color, { shouldValidate: true })}
                    aria-pressed={isSelected}
                    aria-label={`Color ${COLOR_LABELS[color]}${isSelected ? " (seleccionado)" : ""}`}
                    className={cn(
                      "h-7 w-7 rounded-full transition-transform focus:outline-none focus:ring-2 focus:ring-primary/40 hover:scale-110 cursor-pointer",
                      getColorBgClass(color),
                      isSelected && "ring-2 ring-primary ring-offset-2 dark:ring-offset-surface"
                    )}
                    title={COLOR_LABELS[color]}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid}>
              Crear colección
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getColorBgClass(color: z.infer<typeof collectionColorSchema>): string {
  const map: Record<z.infer<typeof collectionColorSchema>, string> = {
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    pink: "bg-pink-500",
    slate: "bg-slate-500",
  };
  return map[color];
}
