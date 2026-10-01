import type { ResolvedElementStyle, TypographyConfig } from "@/types/typography";
import { computeScale, computeMobileScale, isExported } from "./scale";
import { hexToRgb } from "./color-utils";
import { getFontLabel } from "./fonts";

/**
 * Figma variables in the W3C design-token (DTCG) format, for Figma's native
 * variable import. Figma reads one file per mode, so the scale ships as two
 * files, Desktop and Mobile, that import as two modes of one collection.
 *
 * Figma's import only takes px dimensions and ignores DTCG `fontWeight`
 * tokens, so everything is px and weights are plain numbers.
 */

export type FigmaVariablesMode = "Desktop" | "Mobile";

type FigmaScope =
  | "FONT_FAMILY"
  | "FONT_SIZE"
  | "LINE_HEIGHT"
  | "LETTER_SPACING"
  | "FONT_WEIGHT"
  | "TEXT_FILL"
  | "FRAME_FILL";

interface Token {
  $type: "dimension" | "number" | "fontFamily" | "color";
  $value: unknown;
  $extensions: { "com.figma.scopes": FigmaScope[] };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function px(value: number, scope: FigmaScope): Token {
  return {
    $type: "dimension",
    $value: { value: round(value), unit: "px" },
    $extensions: { "com.figma.scopes": [scope] },
  };
}

function color(hex: string, scope: FigmaScope): Token {
  const rgb = hexToRgb(hex);
  return {
    $type: "color",
    $value: {
      colorSpace: "srgb",
      components: rgb.map((c) => Math.round((c / 255) * 10000) / 10000),
      alpha: 1,
      hex: `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`,
    },
    $extensions: { "com.figma.scopes": [scope] },
  };
}

function fontFamily(family: string): Token {
  return {
    $type: "fontFamily",
    $value: getFontLabel(family),
    $extensions: { "com.figma.scopes": ["FONT_FAMILY"] },
  };
}

function byElement(
  styles: ResolvedElementStyle[],
  token: (style: ResolvedElementStyle) => Token,
): Record<string, Token> {
  return Object.fromEntries(styles.map((s) => [s.element, token(s)]));
}

export function generateFigmaVariables(
  config: TypographyConfig,
  mode: FigmaVariablesMode,
  enabledElements?: Record<string, boolean>,
): string {
  const scale = mode === "Desktop" ? computeScale(config) : computeMobileScale(config);
  const styles = scale.filter((s) => isExported(s.element, enabledElements));

  const tokens = {
    "font-family": {
      heading: fontFamily(config.headingsGroup.fontFamily),
      body: fontFamily(config.bodyGroup.fontFamily),
    },
    "font-size": byElement(styles, (s) => px(s.fontSize, "FONT_SIZE")),
    // Figma binds line height and tracking in px, not as multipliers or em.
    "line-height": byElement(styles, (s) => px(s.fontSize * s.lineHeight, "LINE_HEIGHT")),
    "letter-spacing": byElement(styles, (s) => px(s.fontSize * s.letterSpacing, "LETTER_SPACING")),
    "font-weight": byElement(styles, (s) => ({
      $type: "number",
      $value: s.fontWeight,
      $extensions: { "com.figma.scopes": ["FONT_WEIGHT"] },
    })),
    color: {
      heading: color(config.headingsGroup.color, "TEXT_FILL"),
      body: color(config.bodyGroup.color, "TEXT_FILL"),
      background: color(config.backgroundColor, "FRAME_FILL"),
    },
  };

  return JSON.stringify(tokens, null, 2);
}

