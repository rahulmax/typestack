"use client";

import { useMemo } from "react";
import { useComputedScale } from "./use-computed-scale";
import { generatePreviewCSS } from "@/lib/css-generator";
import { useUIStore } from "@/store/ui-store";
import { getGridPatternUrl } from "@/lib/grid-pattern";

export function usePreviewStyles(): string {
  const { config } = useComputedScale();
  const gridPattern = useUIStore((s) => s.gridPattern);
  const patternUrl = getGridPatternUrl(gridPattern, config.backgroundColor);

  return useMemo(() => {
    let css = generatePreviewCSS(config);
    if (patternUrl) {
      css += `\nbody { background-image: url("${patternUrl}"); background-repeat: repeat; }`;
    }
    return css;
  }, [config, patternUrl]);
}
