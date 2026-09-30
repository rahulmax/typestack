import type { TypographyConfig, TypographyElement, ResolvedElementStyle } from "@/types/typography";
import { computeScale, computeMobileScale } from "./scale";
import { HEADING_ELEMENTS, DISPLAY_ELEMENTS } from "@/types/typography";
import { computeIllustrationPalette, hexToOklch, hexToOklchString } from "./color-utils";
import { buildFontImports, getFontStack } from "./fonts";

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

function collectFontFamilies(config: TypographyConfig, styles: ResolvedElementStyle[]): Map<string, Set<number>> {
  const families = new Map<string, Set<number>>()
  for (const style of styles) {
    const family = isHeadingLike(style.element)
      ? config.headingsGroup.fontFamily
      : config.bodyGroup.fontFamily
    if (!families.has(family)) families.set(family, new Set())
    families.get(family)!.add(style.fontWeight)
  }
  return families
}

export function generateCSS(config: TypographyConfig): string {
  const desktop = computeScale(config).filter(s => !DISPLAY_ELEMENTS.includes(s.element as TypographyElement));
  const mobile = computeMobileScale(config).filter(s => !DISPLAY_ELEMENTS.includes(s.element as TypographyElement));

  const lines: string[] = [];

  lines.push(...buildFontImports(collectFontFamilies(config, desktop)));
  lines.push("");
  lines.push(":root {");
  lines.push(`  --ts-base-size: ${config.baseFontSize}px;`);
  lines.push(`  --ts-scale-ratio: ${config.scaleRatio};`);
  lines.push(`  --ts-font-heading: ${getFontStack(config.headingsGroup.fontFamily)};`);
  lines.push(`  --ts-font-body: ${getFontStack(config.bodyGroup.fontFamily)};`);

  for (const style of desktop) {
    lines.push(`  --ts-${style.element}: ${style.fontSizeRem.toFixed(4)}rem;`);
  }

  lines.push("}");
  lines.push("");

  for (const style of desktop) {
    lines.push(elementStyleToCSS(style));
    lines.push("");
  }

  lines.push(`@media (max-width: ${config.mobile.breakpointWidth - 1}px) {`);
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
  lines.push(`body { background: ${hexToOklchString(config.backgroundColor)}; color: ${hexToOklchString(config.bodyGroup.color)}; padding: 2rem; font-family: ${getFontStack(config.bodyGroup.fontFamily)}; }`);
  lines.push(`a, a:visited, a:hover, a:active { color: inherit; text-decoration: underline; }`);
  lines.push(`.ill svg path:not([fill]), .ill svg circle:not([fill]), .ill svg rect:not([fill]), .ill svg polygon:not([fill]), .ill svg ellipse:not([fill]) { fill: var(--ill-ink, currentColor); }`);
  const hc = config.headingsGroup.color;
  const ill = computeIllustrationPalette(config.backgroundColor, hc, config.bodyGroup.color);
  // On mid-lightness pages the primary sits too close to the page, so the glow reads as a dull disc.
  // Fade it out from full strength at L <= 0.25 / >= 0.75 to nothing between 0.4 and 0.6.
  const glowStrength = Math.min(1, Math.max(0, (Math.abs(hexToOklch(config.backgroundColor).l - 0.5) - 0.1) / 0.15));
  const glow = (pct: number) => `color-mix(in oklab, var(--ill-primary) ${Math.round(pct * glowStrength * 10) / 10}%, transparent)`;
  lines.push(`#ill-hero { position: relative; overflow: visible; }`);
  if (glowStrength > 0) {
    lines.push(`#ill-hero::before {`);
    lines.push(`  content: "";`);
    lines.push(`  position: absolute;`);
    lines.push(`  inset: 10%;`);
    lines.push(`  border-radius: 50%;`);
    lines.push(`  background: radial-gradient(circle, ${glow(26)} 0%, ${glow(18)} 15%, ${glow(10)} 30%, ${glow(4)} 50%, transparent 70%);`);
    lines.push(`  filter: blur(30px);`);
    lines.push(`  pointer-events: none;`);
    lines.push(`  z-index: 0;`);
    lines.push(`}`);
  }
  lines.push(`#ill-hero > * { position: relative; z-index: 1; }`);
  const illVars = Object.entries(ill).map(([role, value]) => `--ill-${role}: ${value};`).join(" ");
  // --tone-* / --scene-tone-* are the pre-role names, kept as aliases for templates that still use them
  lines.push(`:root { --bg-color: ${hexToOklchString(config.backgroundColor)}; --fg-color: ${hexToOklchString(config.bodyGroup.color)}; --tone-base: ${hexToOklchString(hc)}; ${illVars} --tone-1: var(--ill-primary); --tone-2: var(--ill-secondary); --scene-tone-1: var(--ill-primary); --scene-tone-2: var(--ill-secondary); --scene-tone-3: var(--ill-highlight); }`);
  lines.push("");

  for (const style of desktop) {
    const family = isHeadingLike(style.element)
      ? config.headingsGroup.fontFamily
      : config.bodyGroup.fontFamily;
    const selector = elementSelector(style.element);
    lines.push(`${selector} {`);
    lines.push(`  font-size: ${style.fontSizeRem.toFixed(4)}rem;`);
    lines.push(`  font-family: ${getFontStack(family)};`);
    lines.push(`  font-weight: ${style.fontWeight};`);
    lines.push(`  line-height: ${style.lineHeight};`);
    lines.push(`  letter-spacing: ${style.letterSpacing}em;`);
    lines.push(`  word-spacing: ${style.wordSpacing}em;`);
    lines.push(`  color: ${hexToOklchString(style.color)};`);
    lines.push(`  text-transform: ${style.textTransform};`);
    lines.push("}");
    lines.push("");
  }

  if (config.scaleRatio >= 1.414) {
    lines.push(`#hero { display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important; max-width: 100% !important; padding: 5rem 1.5rem 5rem !important; }`);
    lines.push(`#hero > div:first-child { max-width: 900px; }`);
    lines.push(`#hero p { margin-left: auto !important; margin-right: auto !important; }`);
    lines.push(`#hero > div:first-child > div:last-child { justify-content: center; }`);
    lines.push(`#ill-hero { display: none !important; }`);
    lines.push("");
  } else if (config.scaleRatio > 1.2) {
    lines.push(`#hero { grid-template-columns: 1.4fr 0.6fr !important; gap: 2rem !important; }`);
    lines.push("");
  } else if (config.scaleRatio > 1.125) {
    lines.push(`#ill-hero { transform: scale(0.85); transform-origin: center center; }`);
    lines.push("");
  }

  lines.push(`@media (max-width: ${config.mobile.breakpointWidth - 1}px) {`);
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
