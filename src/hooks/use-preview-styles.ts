"use client";

import { useMemo } from "react";
import { useComputedScale } from "./use-computed-scale";
import { generatePreviewCSS } from "@/lib/css-generator";
import { useUIStore } from "@/store/ui-store";
import { getGridPatternUrl } from "@/lib/grid-pattern";

export function usePreviewStyles(): string {
  const { config } = useComputedScale();
  const gridPattern = useUIStore((s) => s.gridPattern);
  const patternRotation = useUIStore((s) => s.patternRotation);
  const patternScale = useUIStore((s) => s.patternScale);
  const patternOpacity = useUIStore((s) => s.patternOpacity);
  const patternSpacing = useUIStore((s) => s.patternSpacing);
  const patternUrl = getGridPatternUrl(gridPattern, config.backgroundColor, patternRotation, patternOpacity, patternSpacing);

  return useMemo(() => {
    let css = generatePreviewCSS(config);
    if (patternUrl) {
      const scaleStr = patternScale !== 1 ? ` background-size: ${patternScale * 100}%;` : '';
      css += `\nbody { background-image: url("${patternUrl}"); background-repeat: repeat;${scaleStr} }`;
    }
    return css;
  }, [config, patternUrl, patternScale]);
}
