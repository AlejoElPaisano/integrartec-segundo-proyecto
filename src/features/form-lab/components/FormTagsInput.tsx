import { useState, useRef, type KeyboardEvent } from "react";
import { X, Tag } from "lucide-react";
import { cn } from "@/shared/lib/helpers";

interface FormTagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
}

const TAG_COLORS: ReadonlyArray<string> = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
];

/** Assigns a deterministic color to a tag based on its content */
function tagColorClass(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) & 0xffffffff;
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

/** Normalizes a tag: lowercase, trim, collapse spaces */
function normalizeTag(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "-");
}

export function FormTagsInput({
  tags,
  onChange,
  maxTags = 8,
  placeholder = "Agregar etiqueta y presionar Enter",
}: FormTagsInputProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = normalizeTag(raw);
    if (!tag || tags.includes(tag) || tags.length >= maxTags) return;
    onChange([...tags, tag]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && draft.trim()) {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      role="group"
      aria-label="Etiquetas del formulario"
      className="flex min-h-[2.5rem] flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-colors cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.length === 0 && draft === "" && (
        <span className="flex items-center gap-1 text-sm text-text-muted select-none">
          <Tag size={14} />
        </span>
      )}
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
            tagColorClass(tag)
          )}
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="rounded hover:opacity-70 transition-opacity"
            aria-label={`Eliminar etiqueta ${tag}`}
          >
            <X size={10} />
          </button>
        </span>
      ))}
      {tags.length < maxTags && (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (draft.trim()) addTag(draft);
          }}
          className="min-w-[8rem] flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
          placeholder={tags.length === 0 ? placeholder : ""}
          aria-label="Nueva etiqueta"
        />
      )}
      {tags.length > 0 && (
        <span className="ml-auto text-xs text-text-muted opacity-60">
          {tags.length}/{maxTags}
        </span>
      )}
    </div>
  );
}
