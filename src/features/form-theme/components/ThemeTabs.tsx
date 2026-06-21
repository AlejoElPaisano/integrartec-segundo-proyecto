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
  size?: "sm" | "md";
  variant?: "pills" | "underline";
}

export function ThemeTabs({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
  size = "md",
  variant = "pills",
}: ThemeTabsProps) {
  return (
    <nav
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin",
        variant === "underline" && "border-b border-border"
      )}
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
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              size === "sm" && "px-2.5 py-1.5 text-xs",
              size === "md" && "px-3.5 py-2 text-xs sm:text-sm",
              variant === "pills" && [
                "border",
                isActive
                  ? "border-primary/50 bg-primary text-white shadow-md shadow-primary/25"
                  : "border-border bg-surface text-text-muted hover:border-primary/40 hover:text-text hover:bg-surface/80",
              ],
              variant === "underline" && [
                "rounded-none rounded-t-lg border-b-2 border-transparent px-3 py-2.5",
                isActive
                  ? "border-primary text-primary bg-primary/5"
                  : "text-text-muted hover:text-text hover:bg-surface/50",
              ]
            )}
          >
            {Icon &&
              (isStringIcon ? (
                <span className="text-base leading-none" aria-hidden="true">
                  {Icon}
                </span>
              ) : (
                <Icon
                  size={size === "sm" ? 12 : 14}
                  aria-hidden="true"
                  className={cn(isActive && "text-white")}
                />
              ))}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
