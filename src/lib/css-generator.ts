import type { TypographyConfig, ResolvedElementStyle } from "@/types/typography";
import { computeScale, computeMobileScale } from "./scale";
import { ALL_ELEMENTS, HEADING_ELEMENTS, DISPLAY_ELEMENTS } from "@/types/typography";
import { computeSceneTones, hexToOklchString, hexToOklch, oklchToHex } from "./color-utils";

function isHeadingLike(element: string): boolean {
  return HEADING_ELEMENTS.includes(element as any) || DISPLAY_ELEMENTS.includes(element as any);
}

function elementSelector(element: string): string {
  return element.startsWith("display-") ? `.${element}` : element;
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
  const hc = config.headingsGroup.color;
  const st = computeSceneTones(config.backgroundColor, config.headingsGroup.color);
  const fg = hexToOklch(hc);
  const isDark = hexToOklch(config.backgroundColor).l <= 0.4;
  const t1L = isDark ? Math.min(fg.l + 0.12, 1) : Math.max(fg.l - 0.1, 0);
  const t2L = isDark ? Math.min(fg.l + 0.22, 1) : Math.max(fg.l + 0.15, 0);
  const t1C = Math.max(fg.c * 1.2, 0.06);
  const t2C = Math.max(fg.c * 1.3, 0.07);
  const tone1Hex = oklchToHex(t1L, t1C, (fg.h + 30) % 360);
  const tone2Hex = oklchToHex(t2L, t2C, (fg.h - 30 + 360) % 360);
  lines.push(`:root { --bg-color: ${hexToOklchString(config.backgroundColor)}; --tone-base: ${hexToOklchString(hc)}; --tone-1: ${hexToOklchString(tone1Hex)}; --tone-2: ${hexToOklchString(tone2Hex)}; --scene-tone-1: ${st.tone1}; --scene-tone-2: ${st.tone2}; --scene-tone-3: ${st.tone3}; }`);
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
  for (const style of mobile) {
    const selector = elementSelector(style.element);
    lines.push(`  ${selector} {`);
    lines.push(`    font-size: ${style.fontSizeRem.toFixed(4)}rem;`);
    lines.push(`  }`);
  }
  lines.push("}");

  return lines.join("\n");
}
