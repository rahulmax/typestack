"use client";

import { ALargeSmall, BookType, Minus, Plus, Smartphone, type LucideIcon } from "lucide-react";
import { useUIStore, ZOOM_LEVELS, type PreviewTab } from "@/store/ui-store";
import { useTypographyStore } from "@/store/typography-store";
import { templateList } from "./templates/template-registry";

// Type scale and Specimen are drawn by React; the rest are template pages.
export const REACT_TABS: PreviewTab[] = ["scale", "specimen"];

const TABS: { id: PreviewTab; name: string; icon: LucideIcon }[] = [
  { id: "scale", name: "Type scale", icon: ALargeSmall },
  { id: "specimen", name: "Specimen", icon: BookType },
  ...templateList.map(({ id, name, icon }) => ({ id, name, icon })),
];

interface BrowserChromeProps {
  children: React.ReactNode;
}

export function BrowserChrome({ children }: BrowserChromeProps) {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const phone = useUIStore((s) => s.phone);
  const togglePhone = useUIStore((s) => s.togglePhone);
  const zoom = useUIStore((s) => s.zoom);
  const stepZoom = useUIStore((s) => s.stepZoom);
  const resetZoom = useUIStore((s) => s.resetZoom);
  const pageBg = useTypographyStore((s) => s.backgroundColor);
  const pageFg = useTypographyStore((s) => s.bodyGroup.color);
  const isPage = !REACT_TABS.includes(activeTab);

  return (
    <div
      className="mx-auto transition-all duration-300"
      // Same frame width on every tab so switching never jumps
      style={{ width: "100%", minWidth: 1024 }}
    >
      <div
        className="overflow-hidden rounded-lg shadow-md border border-border"
        // The active tab takes the user's page colours so it merges into the page below
        style={{ "--pv-tab-bg": pageBg, "--pv-tab-fg": pageFg } as React.CSSProperties}
      >
        <div className="pv-tabstrip">
          <div className="pv-chrome-lead">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
          </div>
          <div className="pv-tabs" role="tablist">
            {TABS.map(({ id, name, icon: Icon }) => (
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
            ))}
          </div>
          <div className="pv-chrome-lead">
            {/* Zoom is for the pages; on the React tabs it keeps its space so the tabs never resize */}
            <div
              className={`flex items-center rounded-full bg-background px-1 py-0.5 ${isPage ? "" : "invisible"}`}
              aria-hidden={!isPage}
            >
                <button
                  type="button"
                  onClick={() => stepZoom(-1)}
                  disabled={zoom <= ZOOM_LEVELS[0]}
                  aria-label="Zoom out"
                  title="Zoom out"
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                >
                  <Minus className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  aria-label="Reset zoom"
                  title="Reset to 100%"
                  className="w-10 font-mono text-[11px] tabular-nums text-muted-foreground transition-colors hover:text-foreground"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => stepZoom(1)}
                  disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                  aria-label="Zoom in"
                  title="Zoom in"
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                >
                  <Plus className="size-3.5" />
                </button>
            </div>
            <div className="flex items-center rounded-full bg-background px-1 py-0.5">
              <button
                type="button"
                onClick={togglePhone}
                title={phone ? "Hide phone" : "Show phone"}
                aria-label="Phone preview"
                aria-pressed={phone}
                className={`pv-phone-toggle rounded-full p-1.5 transition-colors ${
                  phone ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
                }`}
                data-on={phone ? "true" : undefined}
              >
                <Smartphone className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-background">{children}</div>
      </div>
    </div>
  );
}
