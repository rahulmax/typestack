import type { TypographyConfig } from "@/types/typography";
import { computeScale } from "./scale";
import { DISPLAY_ELEMENTS, HEADING_ELEMENTS } from "@/types/typography";

export function generateTokensStudioJSON(config: TypographyConfig): string {
  const desktop = computeScale(config);

  const fontSizes: Record<string, unknown> = {};
  const fontWeights: Record<string, unknown> = {};
  const lineHeights: Record<string, unknown> = {};
  const letterSpacing: Record<string, unknown> = {};
  const typography: Record<string, unknown> = {};

  for (const style of desktop) {
    fontSizes[style.element] = {
      value: `${style.fontSizeRem.toFixed(4)}rem`,
      type: "fontSizes",
    };

    fontWeights[style.element] = {
      value: String(style.fontWeight),
      type: "fontWeights",
    };

    lineHeights[style.element] = {
      value: `${(style.lineHeight * 100).toFixed(0)}%`,
      type: "lineHeights",
    };

    letterSpacing[style.element] = {
      value: `${style.letterSpacing}em`,
      type: "letterSpacing",
    };

    const isHeading =
      HEADING_ELEMENTS.includes(style.element) ||
      DISPLAY_ELEMENTS.includes(style.element);

    typography[style.element] = {
      value: {
        fontFamily: isHeading
          ? "{fontFamilies.heading}"
          : "{fontFamilies.body}",
        fontSize: `{fontSizes.${style.element}}`,
        fontWeight: `{fontWeights.${style.element}}`,
        lineHeight: `{lineHeights.${style.element}}`,
        letterSpacing: `{letterSpacing.${style.element}}`,
      },
      type: "typography",
    };
  }

  const tokens = {
    fontFamilies: {
      heading: {
        value: config.headingsGroup.fontFamily,
        type: "fontFamilies",
      },
      body: {
        value: config.bodyGroup.fontFamily,
        type: "fontFamilies",
      },
    },
    fontSizes,
    fontWeights,
    lineHeights,
    letterSpacing,
    typography,
  };

  return JSON.stringify(tokens, null, 2);
}
