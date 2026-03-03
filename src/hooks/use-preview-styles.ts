"use client";

import { useMemo } from "react";
import { useComputedScale } from "./use-computed-scale";
import { generatePreviewCSS } from "@/lib/css-generator";

export function usePreviewStyles(): string {
  const { config } = useComputedScale();
  return useMemo(() => generatePreviewCSS(config), [config]);
}
