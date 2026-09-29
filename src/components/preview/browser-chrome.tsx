"use client";

import { ALargeSmall, BookType, Laptop, Smartphone } from "lucide-react";
import { useUIStore, type ViewportSize } from "@/store/ui-store";
import { useTypographyStore } from "@/store/typography-store";
import { templateList } from "./templates/template-registry";

const VIEWPORTS: { value: ViewportSize; label: string; icon: typeof Laptop }[] = [
  { value: "scale", label: "Type scale", icon: ALargeSmall },
  { value: "style", label: "Specimen", icon: BookType },
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "mobile", label: "Mobile", icon: Smartphone },
];

interface BrowserChromeProps {
  children: React.ReactNode;
}

export function BrowserChrome({ children }: BrowserChromeProps) {
  const viewport = useUIStore((s) => s.viewport);
  const setViewport = useUIStore((s) => s.setViewport);
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const pageBg = useTypographyStore((s) => s.backgroundColor);
  const pageFg = useTypographyStore((s) => s.bodyGroup.color);
  const isScale = viewport === "scale" || viewport === "style";
  const staticTab = VIEWPORTS.find((v) => v.value === viewport);
  const StaticIcon = staticTab?.icon;

  return (
    <div
      className="mx-auto transition-all duration-300"
      // Same frame width in every view so switching views never jumps
      style={{ width: "100%", minWidth: isScale ? undefined : 1024 }}
    >
      <div
        className="overflow-hidden rounded-lg shadow-md border border-border"
        // Template views sit on the user's page colours; the active tab matches them.
        style={
          isScale
            ? undefined
            : ({ "--pv-tab-bg": pageBg, "--pv-tab-fg": pageFg } as React.CSSProperties)
        }
      >
        {/* Title bar: traffic lights + viewport toggle */}
        <div className="flex items-center gap-3 bg-muted px-3 py-1.5">
          <div className="hidden sm:flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-0.5 rounded-full bg-background px-1.5 py-0.5">
            {VIEWPORTS.map(({ value, label, icon: Icon }, i) => (
              <span key={value} className="flex items-center">
                {i === 2 && <span className="mx-1 h-4 w-px bg-border" />}
                <button
                  type="button"
                  onClick={() => setViewport(value)}
                  title={label}
                  aria-label={label}
                  aria-pressed={viewport === value}
                  className={`rounded-full p-1.5 transition-colors ${
                    viewport === value
                      ? "text-foreground"
                      : "text-muted-foreground/50 hover:text-muted-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* Tab strip */}
        <div className="pv-tabstrip" role={isScale ? undefined : "tablist"}>
          {isScale ? (
            staticTab &&
            StaticIcon && (
              <div className="pv-tab pv-tab-static" data-active="true">
                <StaticIcon className="size-3.5" />
                <span>{staticTab.label}</span>
              </div>
            )
          ) : (
            templateList.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                title={name}
                onClick={() => setActiveTab(id)}
                className="pv-tab"
                data-active={activeTab === id ? "true" : undefined}
              >
                <Icon className="size-3.5" />
                <span>{name}</span>
              </button>
            ))
          )}
        </div>
        {/* Content area */}
        <div className="bg-background">{children}</div>
      </div>
    </div>
  );
}
