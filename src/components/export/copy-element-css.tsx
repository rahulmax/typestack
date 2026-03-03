"use client";

import { Button } from "@/components/ui/button";
import { useComputedScale } from "@/hooks/use-computed-scale";
import { HEADING_ELEMENTS } from "@/types/typography";
import type { ResolvedElementStyle } from "@/types/typography";
import { toast } from "sonner";

function elementToCSS(style: ResolvedElementStyle, headingFont: string, bodyFont: string): string {
  const family = HEADING_ELEMENTS.includes(style.element) ? headingFont : bodyFont;
  return `${style.element} {
  font-size: ${style.fontSizeRem.toFixed(4)}rem;
  font-family: '${family}', sans-serif;
  font-weight: ${style.fontWeight};
  line-height: ${style.lineHeight};
  letter-spacing: ${style.letterSpacing}em;
  word-spacing: ${style.wordSpacing}em;
  color: ${style.color};
}`;
}

export function CopyElementCSS() {
  const { desktop, config } = useComputedScale();

  const handleCopy = (style: ResolvedElementStyle) => {
    const css = elementToCSS(
      style,
      config.headingsGroup.fontFamily,
      config.bodyGroup.fontFamily
    );
    navigator.clipboard.writeText(css);
    toast.success(`${style.element} CSS copied`);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Per-Element CSS</span>
      <div className="flex flex-wrap gap-2">
        {desktop.map((style) => (
          <Button
            key={style.element}
            variant="outline"
            size="sm"
            className="font-mono text-xs"
            onClick={() => handleCopy(style)}
          >
            {style.element}
          </Button>
        ))}
      </div>
    </div>
  );
}
