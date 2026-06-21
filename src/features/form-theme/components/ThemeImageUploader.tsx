import { useRef } from "react";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/helpers";
import { fileToBase64 } from "@/features/form-theme/utils";

interface ThemeImageUploaderProps {
  label: string;
  imageUrl?: string;
  onChange: (dataUrl: string | undefined) => void;
  aspectRatio?: "square" | "wide" | "auto";
}

export function ThemeImageUploader({
  label,
  imageUrl,
  onChange,
  aspectRatio = "auto",
}: ThemeImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToBase64(file);
      onChange(dataUrl);
    } catch {
      // Silently ignore failed reads
    }
  };

  const aspectClass = {
    square: "aspect-square",
    wide: "aspect-video",
    auto: "aspect-auto max-h-32",
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">{label}</label>

      {imageUrl ? (
        <div className="relative group">
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border border-border",
              aspectClass[aspectRatio]
            )}
          >
            <img
              src={imageUrl}
              alt={label}
              className="h-full w-full object-contain"
            />
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onChange(undefined)}
            className="absolute right-2 top-2 opacity-90 transition-opacity group-hover:opacity-100"
          >
            <X size={14} />
            Quitar
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-surface p-6 text-text-muted transition-colors hover:border-primary hover:text-primary"
        >
          <ImageIcon size={28} />
          <span className="text-sm font-medium">Subir imagen</span>
          <span className="text-xs opacity-70">
            JPG, PNG o GIF (se guarda en el navegador)
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
