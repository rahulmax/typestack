"use client";

import { useComputedScale } from "@/hooks/use-computed-scale";
import type { ResolvedElementStyle } from "@/types/typography";
import { generateElementCSS } from "@/lib/css-generator";
import { isExported } from "@/lib/scale";
import { useTypographyStore } from "@/store/typography-store";
import { toast } from "sonner";

export function CopyElementCSS() {
  const { desktop, config } = useComputedScale();
  const enabledElements = useTypographyStore((s) => s.enabledElements);

  const visibleStyles = desktop.filter((s) => isExported(s.element, enabledElements));

  const handleCopy = (style: ResolvedElementStyle) => {
    navigator.clipboard.writeText(generateElementCSS(style, config));
    toast.success(`${style.element} CSS copied`);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Per-Element CSS</span>
      <div className="flex flex-wrap gap-2">
        {visibleStyles.map((style) => (
          <button
            key={style.element}
            type="button"
            className="hw-btn text-xs"
            style={{ height: 28, padding: '0 10px' }}
            onClick={() => handleCopy(style)}
          >
            {style.element}
          </button>
        ))}
      </div>
    </div>
  );
}
