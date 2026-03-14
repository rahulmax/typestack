import type { TypographyConfig, TypographyElement } from "@/types/typography";
import { computeScale } from "./scale";
import { HEADING_ELEMENTS, DISPLAY_ELEMENTS } from "@/types/typography";
import { buildFontImports } from "./google-fonts";

function isHeadingLike(element: string): boolean {
  return (
    HEADING_ELEMENTS.includes(element as any) ||
    DISPLAY_ELEMENTS.includes(element as any)
  );
}

function collectFontFamilies(config: TypographyConfig, styles: { element: string; fontWeight: number }[]): Map<string, Set<number>> {
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

/**
 * Generates a Tailwind v4 CSS theme block with @theme tokens.
 * Compatible with tweakcn and Tailwind CSS v4's native CSS config.
 */
export function generateTailwindCSS(config: TypographyConfig): string {
  const desktop = computeScale(config).filter(s => !DISPLAY_ELEMENTS.includes(s.element as TypographyElement));
  const lines: string[] = [];

  lines.push(...buildFontImports(collectFontFamilies(config, desktop)));
  lines.push("");
  lines.push("@theme {");
  lines.push(`  --font-heading: '${config.headingsGroup.fontFamily}', sans-serif;`);
  lines.push(`  --font-body: '${config.bodyGroup.fontFamily}', sans-serif;`);
  lines.push("");

  for (const style of desktop) {
    lines.push(`  --text-${style.element}: ${style.fontSizeRem.toFixed(4)}rem;`);
  }
  lines.push("");

  for (const style of desktop) {
    const lh = style.lineHeight;
    const ls = style.letterSpacing;
    lines.push(`  --text-${style.element}--line-height: ${lh};`);
    lines.push(`  --text-${style.element}--letter-spacing: ${ls}em;`);
  }
  lines.push("}");

  lines.push("");
  lines.push("/* Utility classes */");

  for (const style of desktop) {
    const family = isHeadingLike(style.element) ? "heading" : "body";
    lines.push(`.text-${style.element} {`);
    lines.push(`  font-size: var(--text-${style.element});`);
    lines.push(`  line-height: var(--text-${style.element}--line-height);`);
    lines.push(`  letter-spacing: var(--text-${style.element}--letter-spacing);`);
    lines.push(`  font-family: var(--font-${family});`);
    lines.push(`  font-weight: ${style.fontWeight};`);
    if (style.textTransform !== "none") {
      lines.push(`  text-transform: ${style.textTransform};`);
    }
    lines.push("}");
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Generates a Tailwind v3 theme extension object (JS/JSON).
 */
export function generateTailwindConfig(config: TypographyConfig): string {
  const desktop = computeScale(config).filter(s => !DISPLAY_ELEMENTS.includes(s.element as TypographyElement));

  const fontSize: Record<string, [string, Record<string, string>]> = {};

  for (const style of desktop) {
    fontSize[style.element] = [
      `${style.fontSizeRem.toFixed(4)}rem`,
      {
        lineHeight: String(style.lineHeight),
        letterSpacing: `${style.letterSpacing}em`,
        fontWeight: String(style.fontWeight),
      },
    ];
  }

  const themeExtend = {
    fontFamily: {
      heading: [`'${config.headingsGroup.fontFamily}'`, "sans-serif"],
      body: [`'${config.bodyGroup.fontFamily}'`, "sans-serif"],
    },
    fontSize,
  };

  const imports = buildFontImports(collectFontFamilies(config, desktop))
  const importComment = imports.length
    ? `/* Add to your global CSS:\n${imports.join("\n")}\n*/\n\n`
    : ""

  return `${importComment}// tailwind.config.js — theme.extend\n${JSON.stringify(themeExtend, null, 2)}`;
}
