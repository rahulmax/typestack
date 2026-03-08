"use client";

import { ALargeSmall, Laptop, Tablet, Smartphone } from "lucide-react";
import { useUIStore, type ViewportSize } from "@/store/ui-store";

const VIEWPORTS: { value: ViewportSize; icon: typeof Laptop }[] = [
  { value: "scale", icon: ALargeSmall },
  { value: "laptop", icon: Laptop },
  { value: "tablet", icon: Tablet },
  { value: "mobile", icon: Smartphone },
];

interface BrowserChromeProps {
  children: React.ReactNode;
  tablet?: boolean;
}

export function BrowserChrome({ children, tablet }: BrowserChromeProps) {
  const viewport = useUIStore((s) => s.viewport);
  const setViewport = useUIStore((s) => s.setViewport);

  return (
    <div
      className="mx-auto transition-all duration-300"
      style={tablet ? { width: 768 } : viewport === "laptop" ? { minWidth: 1024, width: "100%" } : { width: "100%" }}
    >
      <div className="overflow-hidden rounded-lg shadow-md border border-border">
        {/* Title bar */}
        <div className="flex items-center gap-2 bg-muted px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          {/* Viewport toggle */}
          <div className="mx-auto flex items-center gap-0.5 rounded-full bg-background px-2 py-1">
            {VIEWPORTS.map(({ value, icon: Icon }, i) => (
              <span key={value} className="flex items-center">
                {i === 1 && <span className="mx-1 h-4 w-px bg-border" />}
                <button
                  type="button"
                  onClick={() => setViewport(value)}
                  className={`rounded-full p-2 transition-colors ${
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
          {/* Spacer to balance the dots */}
          <div className="w-[42px]" />
        </div>
        {/* Content area */}
        <div className="bg-background">{children}</div>
      </div>
    </div>
  );
}
