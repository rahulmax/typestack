import type { TypographyConfig, TypographyElement, ElementOverride } from "@/types/typography";
import { ALL_ELEMENTS } from "@/types/typography";

/**
 * Bounds for every control whose range is narrower than the values a stored
 * config might carry. The sliders and normalizeConfig both read these, so a
 * control can never display a value its own track cannot reach.
 */
export const BASE_FONT_SIZE_RANGE: [number, number] = [8, 24];
export const MOBILE_BASE_FONT_SIZE_RANGE: [number, number] = [10, 20];
export const HEADINGS_LETTER_SPACING_RANGE: [number, number] = [-0.08, 0.1];
export const BODY_LETTER_SPACING_RANGE: [number, number] = [-0.05, 0.1];
export const ELEMENT_LETTER_SPACING_RANGE: [number, number] = [-0.08, 0.15];

const emptyOverride: ElementOverride = { isOverridden: false };

function clamp(value: unknown, [min, max]: [number, number], fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function buildOverrides(): Record<TypographyElement, ElementOverride> {
  const result = {} as Record<TypographyElement, ElementOverride>;
  for (const el of ALL_ELEMENTS) {
    result[el] = { ...emptyOverride };
  }
  return result;
}

/**
 * Merge a partial/stale config with defaults so every field is guaranteed present.
 * Used when loading configs from API, URL params, or persisted storage.
 */
export function normalizeConfig(raw: Record<string, unknown>): TypographyConfig {
  const headingsGroup = { ...DEFAULT_CONFIG.headingsGroup, ...(raw.headingsGroup as object) };
  const bodyGroup = { ...DEFAULT_CONFIG.bodyGroup, ...(raw.bodyGroup as object) };
  const mobile = { ...DEFAULT_CONFIG.mobile, ...(raw.mobile as object) };

  return {
    ...DEFAULT_CONFIG,
    ...raw,
    baseFontSize: clamp(raw.baseFontSize, BASE_FONT_SIZE_RANGE, DEFAULT_CONFIG.baseFontSize),
    headingsGroup: {
      ...headingsGroup,
      letterSpacing: clamp(
        headingsGroup.letterSpacing,
        HEADINGS_LETTER_SPACING_RANGE,
        DEFAULT_CONFIG.headingsGroup.letterSpacing
      ),
    },
    bodyGroup: {
      ...bodyGroup,
      letterSpacing: clamp(
        bodyGroup.letterSpacing,
        BODY_LETTER_SPACING_RANGE,
        DEFAULT_CONFIG.bodyGroup.letterSpacing
      ),
    },
    mobile: {
      ...mobile,
      baseFontSize: clamp(
        mobile.baseFontSize,
        MOBILE_BASE_FONT_SIZE_RANGE,
        DEFAULT_CONFIG.mobile.baseFontSize
      ),
    },
    overrides: normalizeOverrides(raw.overrides),
  };
}

function normalizeOverrides(raw: unknown): Record<TypographyElement, ElementOverride> {
  const merged = { ...DEFAULT_CONFIG.overrides, ...(raw as object) } as Record<
    TypographyElement,
    ElementOverride
  >;
  const result = {} as Record<TypographyElement, ElementOverride>;
  for (const element of ALL_ELEMENTS) {
    const override = merged[element] ?? { ...emptyOverride };
    result[element] =
      override.letterSpacing === undefined
        ? override
        : {
            ...override,
            letterSpacing: clamp(
              override.letterSpacing,
              ELEMENT_LETTER_SPACING_RANGE,
              override.letterSpacing
            ),
          };
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
    color: "#2e2e2e",
  },
  bodyGroup: {
    fontFamily: "Inter",
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
    wordSpacing: 0,
    color: "#3a3a3a",
  },
  overrides: buildOverrides(),
  mobile: {
    baseFontSize: 15,
    scaleRatio: 1.15,
    breakpointWidth: 768,
  },
  backgroundColor: "#f5f5f5",
  sampleText: "The quick brown fox jumps over the lazy dog",
};
