import { cn } from "@/shared/lib/helpers";
import type { LucideIcon } from "lucide-react";

export interface ThemeTab {
  id: string;
  label: string;
  icon?: LucideIcon | string;
}

interface ThemeTabsProps {
  tabs: ReadonlyArray<ThemeTab>;
  activeTab: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  columns?: 3 | 4 | 5;
}

export function ThemeTabs({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
  columns = 4,
}: ThemeTabsProps) {
  const colClass = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };

  return (
    <nav
      role="tablist"
      aria-label={ariaLabel}
      className={cn("grid gap-2", colClass[columns])}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        const isStringIcon = typeof Icon === "string";

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            data-tab-id={tab.id}
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
              isActive
                ? "border-primary/40 bg-primary text-white shadow-md shadow-primary/25"
                : "border-border bg-surface/60 text-text-muted hover:border-primary/40 hover:bg-surface hover:text-text"
            )}
          >
            {Icon &&
              (isStringIcon ? (
                <span className="text-xl leading-none" aria-hidden="true">
                  {Icon}
                </span>
              ) : (
                <Icon
                  size={20}
                  aria-hidden="true"
                  className={cn(isActive && "text-white")}
                />
              ))}
            <span className="leading-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
