"use client";

import { useEffect } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { resolveFontMetrics } from "@/lib/font-metrics";
import { computeAutoBalance } from "@/lib/auto-balance";
import { ALL_ELEMENTS, HEADING_ELEMENTS, DISPLAY_ELEMENTS, BODY_ELEMENTS, SCALE_POSITIONS } from "@/types/typography";
import type { AutoBalanceValues, TypographyElement } from "@/types/typography";

function isHeadingLike(el: TypographyElement): boolean {
  return HEADING_ELEMENTS.includes(el) || DISPLAY_ELEMENTS.includes(el);
}

/**
 * Keeps line height, tracking and word spacing balanced per element while a
 * group's auto key is on. Auto owns an element until it is edited by hand:
 * its overrides carry `auto`, so the split survives a reload or a saved stack.
 */
export function useAutoBalance() {
  const autoBalanceHeadings = useTypographyStore((s) => s.autoBalanceHeadings);
  const autoBalanceBody = useTypographyStore((s) => s.autoBalanceBody);
  const headingFont = useTypographyStore((s) => s.headingsGroup.fontFamily);
  const bodyFont = useTypographyStore((s) => s.bodyGroup.fontFamily);
  const headingWeight = useTypographyStore((s) => s.headingsGroup.fontWeight);
  const bodyWeight = useTypographyStore((s) => s.bodyGroup.fontWeight);
  const baseFontSize = useTypographyStore((s) => s.baseFontSize);
  const scaleRatio = useTypographyStore((s) => s.scaleRatio);
  const overrides = useTypographyStore((s) => s.overrides);
  const applyAutoBalance = useTypographyStore((s) => s.applyAutoBalance);

  // Reruns on its own writes. The second pass finds nothing to change and stops.
  useEffect(() => {
    let cancelled = false;

    async function apply() {
      const [headingMetrics, bodyMetrics] = await Promise.all([
        resolveFontMetrics(headingFont),
        resolveFontMetrics(bodyFont),
      ]);

      if (cancelled) return;

      const updates: Partial<Record<TypographyElement, AutoBalanceValues | null>> = {};

      for (const element of ALL_ELEMENTS) {
        // Eyebrow has its own baseline styles; skip auto-balance
        if (element === "eyebrow") continue;

        const isBody = BODY_ELEMENTS.includes(element);
        const isHeading = isHeadingLike(element);
        const existing = overrides[element];

        // Group's auto key is off: hand back whatever auto had set
        if (isHeading ? !autoBalanceHeadings : !autoBalanceBody) {
          if (existing?.auto) updates[element] = null;
          continue;
        }

        // Set by hand: leave it alone
        if (existing?.isOverridden && !existing.auto) continue;

        const metrics = isHeading ? headingMetrics : bodyMetrics;
        const baseWeight = isHeading ? headingWeight : bodyWeight;
        const fontSize = baseFontSize * Math.pow(scaleRatio, SCALE_POSITIONS[element]);
        const isUppercase = existing?.textTransform === "uppercase";

        const balanced = computeAutoBalance(
          metrics,
          fontSize,
          baseFontSize,
          scaleRatio,
          false,
          isUppercase,
          baseWeight,
          isBody,
        );

        const unchanged =
          existing?.auto &&
          existing.lineHeight === balanced.lineHeight &&
          existing.letterSpacing === balanced.letterSpacing &&
          existing.wordSpacing === balanced.wordSpacing;
        if (unchanged) continue;

        updates[element] = {
          lineHeight: balanced.lineHeight,
          letterSpacing: balanced.letterSpacing,
          wordSpacing: balanced.wordSpacing,
        };
      }

      if (Object.keys(updates).length === 0) return;

      // Auto's writes follow from a change the user made. They are not a change
      // of their own: no undo step, and a stack just loaded stays clean.
      const { pause, resume } = useTypographyStore.temporal.getState();
      const wasDirty = useUIStore.getState().isDirty;
      pause();
      applyAutoBalance(updates);
      resume();
      if (!wasDirty) useUIStore.getState().setDirty(false);
    }

    apply();

    return () => { cancelled = true; };
  }, [
    autoBalanceHeadings,
    autoBalanceBody,
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    baseFontSize,
    scaleRatio,
    overrides,
    applyAutoBalance,
  ]);
}
