"use client";

import { useEffect, useRef } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { resolveFontMetrics } from "@/lib/font-metrics";
import { computeAutoBalance } from "@/lib/auto-balance";
import { hexToOklch } from "@/lib/color-utils";
import { ALL_ELEMENTS, HEADING_ELEMENTS, DISPLAY_ELEMENTS, BODY_ELEMENTS, SCALE_POSITIONS } from "@/types/typography";
import type { TypographyElement } from "@/types/typography";

function isHeadingLike(el: TypographyElement): boolean {
  return HEADING_ELEMENTS.includes(el) || DISPLAY_ELEMENTS.includes(el);
}

export function useAutoBalance() {
  const autoBalance = useTypographyStore((s) => s.autoBalance);
  const headingFont = useTypographyStore((s) => s.headingsGroup.fontFamily);
  const bodyFont = useTypographyStore((s) => s.bodyGroup.fontFamily);
  const headingWeight = useTypographyStore((s) => s.headingsGroup.fontWeight);
  const bodyWeight = useTypographyStore((s) => s.bodyGroup.fontWeight);
  const baseFontSize = useTypographyStore((s) => s.baseFontSize);
  const scaleRatio = useTypographyStore((s) => s.scaleRatio);
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);
  const overrides = useTypographyStore((s) => s.overrides);
  const setElementOverride = useTypographyStore((s) => s.setElementOverride);
  const clearElementOverride = useTypographyStore((s) => s.clearElementOverride);

  // Track which elements we auto-balanced (vs manually overridden)
  const autoBalancedRef = useRef<Set<TypographyElement>>(new Set());

  useEffect(() => {
    if (!autoBalance) {
      // Clear only elements we auto-balanced (not manual overrides)
      for (const el of autoBalancedRef.current) {
        clearElementOverride(el);
      }
      autoBalancedRef.current.clear();
      return;
    }

    let cancelled = false;

    async function apply() {
      const [headingMetrics, bodyMetrics] = await Promise.all([
        resolveFontMetrics(headingFont),
        resolveFontMetrics(bodyFont),
      ]);

      if (cancelled) return;

      const isDarkMode = hexToOklch(backgroundColor).l <= 0.4;
      const newAutoBalanced = new Set<TypographyElement>();

      for (const element of ALL_ELEMENTS) {
        // Skip elements with manual overrides (user set before auto-balance)
        const existing = overrides[element];
        if (existing?.isOverridden && !autoBalancedRef.current.has(element)) {
          continue;
        }

        const isBody = BODY_ELEMENTS.includes(element);
        const metrics = isHeadingLike(element) ? headingMetrics : bodyMetrics;
        const baseWeight = isHeadingLike(element) ? headingWeight : bodyWeight;
        const fontSize = baseFontSize * Math.pow(scaleRatio, SCALE_POSITIONS[element]);
        const isUppercase = existing?.textTransform === "uppercase";

        const balanced = computeAutoBalance(
          metrics,
          fontSize,
          baseFontSize,
          scaleRatio,
          isDarkMode,
          isUppercase,
          baseWeight,
          isBody,
        );

        setElementOverride(element, {
          lineHeight: balanced.lineHeight,
          letterSpacing: balanced.letterSpacing,
          wordSpacing: balanced.wordSpacing,
          fontWeight: balanced.suggestedWeight,
        });

        newAutoBalanced.add(element);
      }

      autoBalancedRef.current = newAutoBalanced;
    }

    apply();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    autoBalance,
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    baseFontSize,
    scaleRatio,
    backgroundColor,
  ]);
}
