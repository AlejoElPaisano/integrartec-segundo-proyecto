import { useFormTheme } from "@/features/form-theme/hooks/useFormTheme";
import { EMOJI_OPTIONS } from "@/features/form-theme/utils";
import { cn } from "@/shared/lib/helpers";

export function ThemeEmojiPicker() {
  const { theme, updateField } = useFormTheme();

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3 text-sm text-text cursor-pointer hover:border-primary/50 transition-colors">
        <input
          type="checkbox"
          checked={theme.showEmoji}
          onChange={(e) => updateField("showEmoji", e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        Mostrar emoji junto al título
      </label>

      {theme.showEmoji && (
        <>
          <div>
            <label
              htmlFor="theme-emoji-input"
              className="block text-xs font-medium text-text-muted mb-1"
            >
              Emoji libre
            </label>
            <input
              id="theme-emoji-input"
              type="text"
              value={theme.emoji}
              onChange={(e) => updateField("emoji", e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="🧪"
              maxLength={4}
            />
          </div>
          <div
            role="radiogroup"
            aria-label="Emojis predefinidos"
            className="grid grid-cols-8 gap-1.5"
          >
            {EMOJI_OPTIONS.map((emoji) => {
              const isSelected = theme.emoji === emoji;
              return (
                <button
                  key={emoji}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => updateField("emoji", emoji)}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-lg border text-lg transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface hover:border-primary/50"
                  )}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
