import type { TypographyConfig, TypographyElement } from "@/types/typography";
import { computeScale, computeMobileScale, isExported } from "./scale";
import { hexToOklchString } from "./color-utils";
import { HEADING_ELEMENTS, DISPLAY_ELEMENTS } from "@/types/typography";
import { buildFontFaces, buildFontImports, getFontStack } from "./fonts";

function isHeadingLike(element: string): boolean {
  return (
    HEADING_ELEMENTS.includes(element as TypographyElement) ||
    DISPLAY_ELEMENTS.includes(element as TypographyElement)
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

function elementSelector(element: string): string {
  if (element.startsWith("display-") || element === "eyebrow") return `.${element}`;
  return element;
}

/**
 * Generates a Tailwind v4 CSS theme block with @theme tokens.
 * Each `--text-*` token carries its own line-height, tracking and weight, so
 * `text-h1` is a complete utility; `@layer base` styles the bare elements and
 * swaps the sizes below the mobile breakpoint. Layered, so utilities still win.
 */
export function generateTailwindCSS(config: TypographyConfig, enabledElements?: Record<string, boolean>): string {
  const desktop = computeScale(config).filter(s => isExported(s.element, enabledElements));
  const mobile = computeMobileScale(config).filter(s => isExported(s.element, enabledElements));
  const lines: string[] = [];

  const families = collectFontFamilies(config, desktop);
  const imports = buildFontImports(families);
  if (imports.length) {
    lines.push("/* Font imports go above @import \"tailwindcss\". */");
    lines.push(...imports);
    lines.push("");
  }
  // Rules, not imports: these stay below @import "tailwindcss" with the theme.
  const faces = buildFontFaces(families);
  if (faces.length) lines.push(...faces, "");
  lines.push("@theme {");
  lines.push(`  --font-heading: ${getFontStack(config.headingsGroup.fontFamily)};`);
  lines.push(`  --font-body: ${getFontStack(config.bodyGroup.fontFamily)};`);

  for (const style of desktop) {
    lines.push("");
    lines.push(`  --text-${style.element}: ${style.fontSizeRem.toFixed(4)}rem;`);
    lines.push(`  --text-${style.element}--line-height: ${style.lineHeight};`);
    lines.push(`  --text-${style.element}--letter-spacing: ${style.letterSpacing}em;`);
    lines.push(`  --text-${style.element}--font-weight: ${style.fontWeight};`);
  }
  lines.push("}");
  lines.push("");

  lines.push("@layer base {");
  for (const style of desktop) {
    const family = isHeadingLike(style.element) ? "heading" : "body";
    lines.push(`  ${elementSelector(style.element)} {`);
    lines.push(`    font-family: var(--font-${family});`);
    lines.push(`    font-size: var(--text-${style.element});`);
    lines.push(`    font-weight: var(--text-${style.element}--font-weight);`);
    lines.push(`    line-height: var(--text-${style.element}--line-height);`);
    lines.push(`    letter-spacing: var(--text-${style.element}--letter-spacing);`);
    lines.push(`    word-spacing: ${style.wordSpacing}em;`);
    lines.push(`    color: ${hexToOklchString(style.color)};`);
    if (style.textTransform !== "none") {
      lines.push(`    text-transform: ${style.textTransform};`);
    }
    lines.push("  }");
    lines.push("");
  }

  lines.push(`  @media (max-width: ${config.mobile.breakpointWidth - 1}px) {`);
  lines.push("    :root {");
  for (const style of mobile) {
    lines.push(`      --text-${style.element}: ${style.fontSizeRem.toFixed(4)}rem;`);
  }
  lines.push("    }");
  lines.push("  }");
  lines.push("}");

  return lines.join("\n");
}

/**
 * Generates a Tailwind v3 theme extension object (JS/JSON).
 */
export function generateTailwindConfig(config: TypographyConfig, enabledElements?: Record<string, boolean>): string {
  const desktop = computeScale(config).filter(s => isExported(s.element, enabledElements));

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
      heading: getFontStack(config.headingsGroup.fontFamily).split(", "),
      body: getFontStack(config.bodyGroup.fontFamily).split(", "),
    },
    fontSize,
  };

  // Line comments: the font lines carry block comments of their own, and one
  // block comment cannot hold another.
  const families = collectFontFamilies(config, desktop)
  const fontCss = [...buildFontImports(families), ...buildFontFaces(families)].join("\n")
  const importComment = fontCss
    ? `// Add to your global CSS:\n${fontCss.replace(/^/gm, "// ")}\n\n`
    : ""

  return `${importComment}// tailwind.config.js — theme.extend\n${JSON.stringify(themeExtend, null, 2)}`;
}
