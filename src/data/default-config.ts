import type { TypographyConfig, TypographyElement, ElementOverride } from "@/types/typography";
import { ALL_ELEMENTS } from "@/types/typography";

const emptyOverride: ElementOverride = { isOverridden: false };

function buildOverrides(): Record<TypographyElement, ElementOverride> {
  const result = {} as Record<TypographyElement, ElementOverride>;
  for (const el of ALL_ELEMENTS) {
    result[el] = { ...emptyOverride };
  }
  return result;
}

export const DEFAULT_CONFIG: TypographyConfig = {
  baseFontSize: 16,
  scaleRatioPreset: "Minor Third",
  scaleRatio: 1.2,
  headingsGroup: {
    fontFamily: "Inter",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: -0.02,
    wordSpacing: 0,
    color: "#0a0a0a",
  },
  bodyGroup: {
    fontFamily: "Inter",
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
    wordSpacing: 0,
    color: "#171717",
  },
  overrides: buildOverrides(),
  mobile: {
    baseFontSize: 15,
    scaleRatio: 1.15,
    breakpointWidth: 768,
  },
  backgroundColor: "#ffffff",
  sampleText: "The quick brown fox jumps over the lazy dog",
};
