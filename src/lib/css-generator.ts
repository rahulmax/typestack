import type { TypographyConfig, TypographyElement, ResolvedElementStyle } from "@/types/typography";
import { computeScale, computeMobileScale } from "./scale";
import { HEADING_ELEMENTS, DISPLAY_ELEMENTS } from "@/types/typography";
import { computeSceneTones, hexToOklchString } from "./color-utils";

function isHeadingLike(element: string): boolean {
  return (HEADING_ELEMENTS.includes(element as TypographyElement) || DISPLAY_ELEMENTS.includes(element as TypographyElement)) && element !== "eyebrow";
}

function elementSelector(element: string): string {
  if (element.startsWith("display-") || element === "eyebrow") return `.${element}`;
  return element;
}

function elementStyleToCSS(style: ResolvedElementStyle): string {
  const selector = elementSelector(style.element);
  const lines = [
    `  font-size: var(--ts-${style.element});`,
    `  font-family: var(--ts-font-${isHeadingLike(style.element) ? "heading" : "body"});`,
    `  font-weight: ${style.fontWeight};`,
    `  line-height: ${style.lineHeight};`,
    `  letter-spacing: ${style.letterSpacing}em;`,
    `  word-spacing: ${style.wordSpacing}em;`,
    `  color: ${hexToOklchString(style.color)};`,
    `  text-transform: ${style.textTransform};`,
  ];
  return `${selector} {\n${lines.join("\n")}\n}`;
}

export function generateCSS(config: TypographyConfig): string {
  const desktop = computeScale(config);
  const mobile = computeMobileScale(config);

  const lines: string[] = [];

  lines.push(":root {");
  lines.push(`  --ts-base-size: ${config.baseFontSize}px;`);
  lines.push(`  --ts-scale-ratio: ${config.scaleRatio};`);
  lines.push(`  --ts-font-heading: '${config.headingsGroup.fontFamily}', sans-serif;`);
  lines.push(`  --ts-font-body: '${config.bodyGroup.fontFamily}', sans-serif;`);

  for (const style of desktop) {
    lines.push(`  --ts-${style.element}: ${style.fontSizeRem.toFixed(4)}rem;`);
  }

  lines.push("}");
  lines.push("");

  for (const style of desktop) {
    lines.push(elementStyleToCSS(style));
    lines.push("");
  }

  lines.push(`@media (max-width: ${config.mobile.breakpointWidth}px) {`);
  lines.push("  :root {");
  lines.push(`    --ts-base-size: ${config.mobile.baseFontSize}px;`);
  lines.push(`    --ts-scale-ratio: ${config.mobile.scaleRatio};`);

  for (const style of mobile) {
    lines.push(`    --ts-${style.element}: ${style.fontSizeRem.toFixed(4)}rem;`);
  }

  lines.push("  }");
  lines.push("}");

  return lines.join("\n");
}

export function generatePreviewCSS(config: TypographyConfig): string {
  const desktop = computeScale(config);
  const mobile = computeMobileScale(config);

  const lines: string[] = [];

  lines.push("* { margin: 0; padding: 0; box-sizing: border-box; }");
  lines.push(`body { background: ${hexToOklchString(config.backgroundColor)}; color: ${hexToOklchString(config.bodyGroup.color)}; padding: 2rem; font-family: '${config.bodyGroup.fontFamily}', sans-serif; }`);
  lines.push(`a, a:visited, a:hover, a:active { color: inherit; text-decoration: underline; }`);
  lines.push(`.ill svg path:not([fill]), .ill svg circle:not([fill]), .ill svg rect:not([fill]), .ill svg polygon:not([fill]), .ill svg ellipse:not([fill]) { fill: currentColor; }`);
  const hc = config.headingsGroup.color;
  const st = computeSceneTones(config.backgroundColor, config.headingsGroup.color);
  lines.push(`:root { --bg-color: ${hexToOklchString(config.backgroundColor)}; --tone-base: ${hexToOklchString(hc)}; --tone-1: ${st.tone1}; --tone-2: ${st.tone2}; --scene-tone-1: ${st.tone1}; --scene-tone-2: ${st.tone2}; --scene-tone-3: ${st.tone3}; }`);
  lines.push("");

  for (const style of desktop) {
    const family = isHeadingLike(style.element)
      ? config.headingsGroup.fontFamily
      : config.bodyGroup.fontFamily;
    const selector = elementSelector(style.element);
    lines.push(`${selector} {`);
    lines.push(`  font-size: ${style.fontSizeRem.toFixed(4)}rem;`);
    lines.push(`  font-family: '${family}', sans-serif;`);
    lines.push(`  font-weight: ${style.fontWeight};`);
    lines.push(`  line-height: ${style.lineHeight};`);
    lines.push(`  letter-spacing: ${style.letterSpacing}em;`);
    lines.push(`  word-spacing: ${style.wordSpacing}em;`);
    lines.push(`  color: ${hexToOklchString(style.color)};`);
    lines.push(`  text-transform: ${style.textTransform};`);
    lines.push("}");
    lines.push("");
  }

  lines.push(`@media (max-width: ${config.mobile.breakpointWidth}px) {`);
  lines.push(`  body { padding: 0.75rem; }`);
  for (const style of mobile) {
    const selector = elementSelector(style.element);
    lines.push(`  ${selector} {`);
    lines.push(`    font-size: ${style.fontSizeRem.toFixed(4)}rem;`);
    lines.push(`  }`);
  }
  lines.push("}");

  return lines.join("\n");
}
