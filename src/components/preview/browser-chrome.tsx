"use client";

import { Laptop, Tablet, Smartphone } from "lucide-react";
import { useUIStore, type ViewportSize } from "@/store/ui-store";

const VIEWPORTS: { value: ViewportSize; icon: typeof Laptop }[] = [
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
      style={tablet ? { width: 768 } : { minWidth: 1280, width: "100%" }}
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
          <div className="mx-auto flex items-center gap-1 rounded-full bg-background px-3 py-1.5">
            {VIEWPORTS.map(({ value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setViewport(value)}
                className={`rounded-full p-1 transition-colors ${
                  viewport === value
                    ? "text-foreground"
                    : "text-muted-foreground/50 hover:text-muted-foreground"
                }`}
              >
                <Icon className="size-3" />
              </button>
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
