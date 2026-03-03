"use client";

import { useMemo } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { computeScale, computeMobileScale } from "@/lib/scale";
import type { ResolvedElementStyle, TypographyConfig } from "@/types/typography";

function getConfig(store: ReturnType<typeof useTypographyStore.getState>): TypographyConfig {
  return {
    baseFontSize: store.baseFontSize,
    scaleRatioPreset: store.scaleRatioPreset,
    scaleRatio: store.scaleRatio,
    headingsGroup: store.headingsGroup,
    bodyGroup: store.bodyGroup,
    overrides: store.overrides,
    mobile: store.mobile,
    backgroundColor: store.backgroundColor,
    sampleText: store.sampleText,
  };
}

export function useComputedScale(): {
  desktop: ResolvedElementStyle[];
  mobile: ResolvedElementStyle[];
  config: TypographyConfig;
} {
  const store = useTypographyStore();
  const config = getConfig(store);

  const desktop = useMemo(() => computeScale(config), [config]);
  const mobile = useMemo(() => computeMobileScale(config), [config]);

  return { desktop, mobile, config };
}
