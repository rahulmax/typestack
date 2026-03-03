import type { TypographyConfig, ResolvedElementStyle } from "@/types/typography";
import { computeScale, computeMobileScale } from "./scale";
import { ALL_ELEMENTS, HEADING_ELEMENTS } from "@/types/typography";

function elementStyleToCSS(style: ResolvedElementStyle): string {
  const lines = [
    `  font-size: var(--ts-${style.element});`,
    `  font-family: var(--ts-font-${HEADING_ELEMENTS.includes(style.element) ? "heading" : "body"});`,
    `  font-weight: ${style.fontWeight};`,
    `  line-height: ${style.lineHeight};`,
    `  letter-spacing: ${style.letterSpacing}em;`,
    `  word-spacing: ${style.wordSpacing}em;`,
    `  color: ${style.color};`,
    `  text-transform: ${style.textTransform};`,
  ];
  return `${style.element} {\n${lines.join("\n")}\n}`;
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
  lines.push(`body { background: ${config.backgroundColor}; color: ${config.bodyGroup.color}; padding: 2rem; font-family: '${config.bodyGroup.fontFamily}', sans-serif; }`);
  // Tone variables for SVG illustrations
  const hc = config.headingsGroup.color;
  lines.push(`:root { --tone-1: ${hc}; --tone-2: color-mix(in srgb, ${hc} 60%, ${config.backgroundColor}); }`);
  lines.push("");

  for (const style of desktop) {
    const family = HEADING_ELEMENTS.includes(style.element)
      ? config.headingsGroup.fontFamily
      : config.bodyGroup.fontFamily;
    lines.push(`${style.element} {`);
    lines.push(`  font-size: ${style.fontSizeRem.toFixed(4)}rem;`);
    lines.push(`  font-family: '${family}', sans-serif;`);
    lines.push(`  font-weight: ${style.fontWeight};`);
    lines.push(`  line-height: ${style.lineHeight};`);
    lines.push(`  letter-spacing: ${style.letterSpacing}em;`);
    lines.push(`  word-spacing: ${style.wordSpacing}em;`);
    lines.push(`  color: ${style.color};`);
    lines.push(`  text-transform: ${style.textTransform};`);
    lines.push("}");
    lines.push("");
  }

  lines.push(`@media (max-width: ${config.mobile.breakpointWidth}px) {`);
  for (const style of mobile) {
    lines.push(`  ${style.element} {`);
    lines.push(`    font-size: ${style.fontSizeRem.toFixed(4)}rem;`);
    lines.push(`  }`);
  }
  lines.push("}");

  return lines.join("\n");
}
