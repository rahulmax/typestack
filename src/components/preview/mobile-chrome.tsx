"use client";

import { ALargeSmall, Laptop, Tablet, Smartphone } from "lucide-react";
import { useUIStore, type ViewportSize } from "@/store/ui-store";
import { useTypographyStore } from "@/store/typography-store";
import { isBgDark } from "@/lib/color-utils";

const VIEWPORTS: { value: ViewportSize; icon: typeof Laptop }[] = [
  { value: "scale", icon: ALargeSmall },
  { value: "laptop", icon: Laptop },
  { value: "tablet", icon: Tablet },
  { value: "mobile", icon: Smartphone },
];

interface MobileChromeProps {
  children: React.ReactNode;
}

export function MobileChrome({ children }: MobileChromeProps) {
  const viewport = useUIStore((s) => s.viewport);
  const setViewport = useUIStore((s) => s.setViewport);
  const bgColor = useTypographyStore((s) => s.backgroundColor);
  const dark = isBgDark(bgColor);

  return (
    <div className="flex h-full items-start justify-center pt-2">
      <div
        className="relative flex flex-col overflow-hidden rounded-t-[40px] border-[3px] border-b-0 border-border shadow-lg"
        style={{ width: 375, maxWidth: "100%", height: "calc(100% - 0.5rem)", backgroundColor: bgColor }}
      >
        {/* Dynamic island area — overlays content */}
        <div className="relative z-10 flex items-center justify-center py-1.5">
          <div
            className="flex items-center gap-0.5 rounded-full px-2 py-1"
            style={{ backgroundColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}
          >
            {VIEWPORTS.map(({ value, icon: Icon }, i) => (
              <span key={value} className="flex items-center">
                {i === 1 && <span className="mx-1 h-4 w-px" style={{ backgroundColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" }} />}
                <button
                  type="button"
                  onClick={() => setViewport(value)}
                  className="rounded-full p-2 transition-colors"
                  style={{
                    color: viewport === value
                      ? (dark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)")
                      : (dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)"),
                  }}
                >
                  <Icon className="size-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
