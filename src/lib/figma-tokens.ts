import type { TypographyConfig } from "@/types/typography";
import { computeScale, isExported } from "./scale";
import { DISPLAY_ELEMENTS, HEADING_ELEMENTS } from "@/types/typography";
import { getFontLabel } from "./fonts";

/**
 * Tokens Studio reads letter-spacing as px, rem or % of the font size, and
 * drops em. Figma's percent is the CSS em times 100.
 */
function percentLetterSpacing(em: number): string {
  return `${parseFloat((em * 100).toFixed(2))}%`;
}

export function generateTokensStudioJSON(config: TypographyConfig, enabledElements?: Record<string, boolean>): string {
  const desktop = computeScale(config).filter(s => isExported(s.element, enabledElements));

  const fontSizes: Record<string, unknown> = {};
  const fontWeights: Record<string, unknown> = {};
  const lineHeights: Record<string, unknown> = {};
  const letterSpacing: Record<string, unknown> = {};
  const textCase: Record<string, unknown> = {};
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
      value: percentLetterSpacing(style.letterSpacing),
      type: "letterSpacing",
    };

    textCase[style.element] = {
      value: style.textTransform,
      type: "textCase",
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
        textCase: `{textCase.${style.element}}`,
      },
      type: "typography",
    };
  }

  const tokens = {
    fontFamilies: {
      heading: {
        value: getFontLabel(config.headingsGroup.fontFamily),
        type: "fontFamilies",
      },
      body: {
        value: getFontLabel(config.bodyGroup.fontFamily),
        type: "fontFamilies",
      },
    },
    fontSizes,
    fontWeights,
    lineHeights,
    letterSpacing,
    textCase,
    typography,
  };

  return JSON.stringify(tokens, null, 2);
}
