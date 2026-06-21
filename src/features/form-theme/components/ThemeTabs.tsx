import { useRef, useEffect, useState } from "react";
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
  variant?: "pills" | "segmented" | "underline";
}

export function ThemeTabs({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
  size = "md",
  variant = "segmented",
}: ThemeTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeButton = container.querySelector<HTMLButtonElement>(
      `[data-tab-id="${activeTab}"]`
    );
    if (!activeButton) return;

    setIndicatorStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
    });
  }, [activeTab, tabs]);

  return (
    <nav
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "relative flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin",
        variant === "segmented" &&
          "rounded-2xl border border-border/60 bg-surface/80 p-1 shadow-inner",
        variant === "pills" && "gap-2",
        variant === "underline" && "border-b border-border"
      )}
      ref={containerRef}
    >
      {variant === "segmented" && (
        <div
          className="absolute top-1 h-[calc(100%-8px)] rounded-xl bg-primary shadow-sm transition-all duration-300 ease-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          aria-hidden="true"
        />
      )}

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
              "relative z-10 flex shrink-0 items-center justify-center gap-1.5 rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              size === "sm" && "px-2.5 py-1.5 text-xs",
              size === "md" && "px-3 py-2 text-xs sm:text-sm",
              variant === "segmented" && [
                "w-full",
                isActive ? "text-white" : "text-text-muted hover:text-text",
              ],
              variant === "pills" && [
                "border",
                isActive
                  ? "border-primary/50 bg-primary text-white shadow-md shadow-primary/25"
                  : "border-border bg-surface text-text-muted hover:border-primary/40 hover:text-text",
              ],
              variant === "underline" && [
                "rounded-none rounded-t-lg border-b-2 border-transparent px-3 py-2.5",
                isActive
                  ? "border-primary text-primary"
                  : "text-text-muted hover:text-text",
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
                  className={cn(
                    variant === "segmented" && isActive && "text-white"
                  )}
                />
              ))}
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
