import type { TypographyConfig } from "@/types/typography";
import { computeScale } from "./scale";
import { HEADING_ELEMENTS } from "@/types/typography";

export function generateTokensStudioJSON(config: TypographyConfig): string {
  const desktop = computeScale(config);

  const tokens: Record<string, unknown> = {
    typography: {
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
      fontSizes: {} as Record<string, unknown>,
      fontWeights: {} as Record<string, unknown>,
      lineHeights: {} as Record<string, unknown>,
      letterSpacing: {} as Record<string, unknown>,
      composition: {} as Record<string, unknown>,
    },
  };

  const sizes = tokens.typography as Record<string, Record<string, unknown>>;

  for (const style of desktop) {
    sizes.fontSizes[style.element] = {
      value: `${style.fontSizeRem.toFixed(4)}rem`,
      type: "fontSizes",
    };

    sizes.fontWeights[style.element] = {
      value: style.fontWeight,
      type: "fontWeights",
    };

    sizes.lineHeights[style.element] = {
      value: `${(style.lineHeight * 100).toFixed(0)}%`,
      type: "lineHeights",
    };

    sizes.letterSpacing[style.element] = {
      value: `${style.letterSpacing}em`,
      type: "letterSpacing",
    };

    sizes.composition[style.element] = {
      value: {
        fontFamily: HEADING_ELEMENTS.includes(style.element)
          ? "{typography.fontFamilies.heading}"
          : "{typography.fontFamilies.body}",
        fontSize: `{typography.fontSizes.${style.element}}`,
        fontWeight: `{typography.fontWeights.${style.element}}`,
        lineHeight: `{typography.lineHeights.${style.element}}`,
        letterSpacing: `{typography.letterSpacing.${style.element}}`,
      },
      type: "typography",
    };
  }

  return JSON.stringify(tokens, null, 2);
}
