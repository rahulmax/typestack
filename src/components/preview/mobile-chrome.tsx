"use client";

import { useTypographyStore } from "@/store/typography-store";
import { isBgDark } from "@/lib/color-utils";

interface MobileChromeProps {
  children: React.ReactNode;
}

// Device frame only: the desktop chrome's toggle and tabs drive the content.
export function MobileChrome({ children }: MobileChromeProps) {
  const bgColor = useTypographyStore((s) => s.backgroundColor);
  const dark = isBgDark(bgColor);

  return (
    <div className="flex h-full flex-col items-center gap-2 pt-2">
      <div className="flex items-center gap-1.5">
        <span className="hw-selector-led" />
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60"
          style={{ fontFamily: "var(--font-host-grotesk), system-ui, sans-serif" }}
        >
          Scale set in Mobile Settings
        </span>
      </div>
      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[40px] border-[3px] border-b-0 border-border shadow-[0_24px_60px_-8px_rgba(0,0,0,0.45),0_8px_20px_rgba(0,0,0,0.25)]"
        style={{ width: 375, maxWidth: "100%", backgroundColor: bgColor }}
      >
        {/* Dynamic island, overlaying the page */}
        <div
          className="pointer-events-none absolute left-1/2 top-2 z-10 h-[22px] w-[84px] -translate-x-1/2 rounded-full"
          style={{ backgroundColor: dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.85)" }}
        />
        {/* Status bar spacer so page content starts below the island */}
        <div className="h-8 shrink-0" />
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
