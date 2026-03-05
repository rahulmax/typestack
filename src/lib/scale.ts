import type {
  TypographyConfig,
  TypographyElement,
  ResolvedElementStyle,
  GroupProperties,
} from "@/types/typography";
import { SCALE_POSITIONS, ALL_ELEMENTS, HEADING_ELEMENTS, DISPLAY_ELEMENTS } from "@/types/typography";

function isHeadingOrDisplay(element: TypographyElement): boolean {
  return HEADING_ELEMENTS.includes(element) || DISPLAY_ELEMENTS.includes(element);
}

export function computeFontSize(
  baseFontSize: number,
  scaleRatio: number,
  element: TypographyElement
): number {
  const position = SCALE_POSITIONS[element];
  return baseFontSize * Math.pow(scaleRatio, position);
}

export function resolveElementStyles(
  element: TypographyElement,
  config: TypographyConfig
): ResolvedElementStyle {
  const group: GroupProperties = isHeadingOrDisplay(element)
    ? config.headingsGroup
    : config.bodyGroup;

  const fontSize = computeFontSize(
    config.baseFontSize,
    config.scaleRatio,
    element
  );

  const resolved: ResolvedElementStyle = {
    element,
    fontSize,
    fontSizeRem: fontSize / 16,
    fontFamily: group.fontFamily,
    fontWeight: group.fontWeight,
    lineHeight: group.lineHeight,
    letterSpacing: group.letterSpacing,
    wordSpacing: group.wordSpacing,
    color: group.color,
    textTransform: "none",
  };

  // Eyebrow baseline: always uppercase with ample letter-spacing
  if (element === "eyebrow") {
    resolved.textTransform = "uppercase";
    resolved.letterSpacing = 0.2;
  }

  const override = config.overrides[element];
  if (override?.isOverridden) {
    if (override.fontFamily !== undefined) resolved.fontFamily = override.fontFamily;
    if (override.fontWeight !== undefined) resolved.fontWeight = override.fontWeight;
    if (override.lineHeight !== undefined) resolved.lineHeight = override.lineHeight;
    if (override.letterSpacing !== undefined) resolved.letterSpacing = override.letterSpacing;
    if (override.wordSpacing !== undefined) resolved.wordSpacing = override.wordSpacing;
    if (override.color !== undefined) resolved.color = override.color;
    if (override.textTransform !== undefined) resolved.textTransform = override.textTransform;
  }

  return resolved;
}

export function computeScale(config: TypographyConfig): ResolvedElementStyle[] {
  return ALL_ELEMENTS.map((el) => resolveElementStyles(el, config));
}

export function resolveElementStylesMobile(
  element: TypographyElement,
  config: TypographyConfig
): ResolvedElementStyle {
  const group: GroupProperties = isHeadingOrDisplay(element)
    ? config.headingsGroup
    : config.bodyGroup;

  const fontSize = computeFontSize(
    config.mobile.baseFontSize,
    config.mobile.scaleRatio,
    element
  );

  const resolved: ResolvedElementStyle = {
    element,
    fontSize,
    fontSizeRem: fontSize / 16,
    fontFamily: group.fontFamily,
    fontWeight: group.fontWeight,
    lineHeight: group.lineHeight,
    letterSpacing: group.letterSpacing,
    wordSpacing: group.wordSpacing,
    color: group.color,
    textTransform: "none",
  };

  if (element === "eyebrow") {
    resolved.textTransform = "uppercase";
    resolved.letterSpacing = 0.2;
  }

  const override = config.overrides[element];
  if (override?.isOverridden) {
    if (override.fontFamily !== undefined) resolved.fontFamily = override.fontFamily;
    if (override.fontWeight !== undefined) resolved.fontWeight = override.fontWeight;
    if (override.lineHeight !== undefined) resolved.lineHeight = override.lineHeight;
    if (override.letterSpacing !== undefined) resolved.letterSpacing = override.letterSpacing;
    if (override.wordSpacing !== undefined) resolved.wordSpacing = override.wordSpacing;
    if (override.color !== undefined) resolved.color = override.color;
    if (override.textTransform !== undefined) resolved.textTransform = override.textTransform;
  }

  return resolved;
}

export function computeMobileScale(
  config: TypographyConfig
): ResolvedElementStyle[] {
  return ALL_ELEMENTS.map((el) => resolveElementStylesMobile(el, config));
}
