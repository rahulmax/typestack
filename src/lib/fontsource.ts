import type { FontOption, FontsourceFamily } from "@/types/fonts";
import { FONTSOURCE_FONTS } from "@/data/fontsource-fonts";

/**
 * Fontsource ships each family as an npm package with one stylesheet per
 * weight and style, whose `url()`s are relative to the stylesheet. jsDelivr
 * serves the package as-is, so the same URL works as a `<link>` here, in the
 * preview iframe, and as an `@import` in exported CSS. Versions are pinned so
 * an export never changes under a finished design.
 */
const NPM_CDN = "https://cdn.jsdelivr.net/npm/@fontsource";

const BY_FAMILY = new Map(FONTSOURCE_FONTS.map((f) => [f.family, f]));

/** The curated list excludes every Google name, so this is a plain lookup. */
export function isFontsourceFamily(family: string): boolean {
  return BY_FAMILY.has(family);
}

export function getFontsourceFamily(family: string): FontsourceFamily | undefined {
  return BY_FAMILY.get(family);
}

/** A family's page on Fontsource, with its downloads and install notes. */
export function getFontsourcePageUrl(family: string): string | undefined {
  const font = BY_FAMILY.get(family);
  return font && `https://fontsource.org/fonts/${font.id}`;
}

export const FONTSOURCE_OPTIONS: FontOption[] = FONTSOURCE_FONTS.map((f) => ({
  family: f.family,
  label: f.family,
  category: f.category,
  source: "fontsource",
  weights: f.weights,
}));

/**
 * The face a browser renders for a weight the family may not have, per CSS
 * font matching: 400-500 look up to 500 first, lighter weights look lighter
 * first, heavier weights look heavier first.
 */
export function matchWeight(available: number[], weight: number): number {
  if (available.includes(weight)) return weight;
  const sorted = [...available].sort((a, b) => a - b);
  const lighter = sorted.filter((w) => w < weight).reverse();
  const heavier = sorted.filter((w) => w > weight);
  if (weight >= 400 && weight <= 500) {
    const upTo500 = heavier.filter((w) => w <= 500);
    return upTo500[0] ?? lighter[0] ?? heavier[0];
  }
  if (weight < 400) return lighter[0] ?? heavier[0];
  return heavier[0] ?? lighter[0];
}

/**
 * The faces a request actually needs. A design at 600 on a 400/700 family
 * renders the 700, so that is the file to fetch and to export.
 */
function servedWeights(font: FontsourceFamily, requested: number[]): number[] {
  return [...new Set(requested.map((w) => matchWeight(font.weights, w)))].sort((a, b) => a - b);
}

function stylesheetUrl(font: FontsourceFamily, file: string): string {
  return `${NPM_CDN}/${font.id}@${font.version}/${file}.css`;
}

/** One stylesheet per served weight, plus its italic where the family has one. */
export function getFontsourceCssUrls(family: string, weights: number[] = [400, 700]): string[] {
  const font = BY_FAMILY.get(family);
  if (!font) return [];
  return servedWeights(font, weights).flatMap((w) =>
    font.italic
      ? [stylesheetUrl(font, String(w)), stylesheetUrl(font, `${w}-italic`)]
      : [stylesheetUrl(font, String(w))],
  );
}

function injectStylesheet(url: string): void {
  const id = `fs-${url.slice(NPM_CDN.length + 1).replace(/[^a-z0-9-]/gi, "-")}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

/** Just the regular face: enough to draw the family's name in the picker. */
export function loadFontsourcePreview(family: string): void {
  const font = BY_FAMILY.get(family);
  if (!font) return;
  injectStylesheet(stylesheetUrl(font, String(servedWeights(font, [400])[0])));
}

export function loadFontsourceFull(family: string, weights?: number[]): void {
  for (const url of getFontsourceCssUrls(family, weights)) injectStylesheet(url);
}

/**
 * `@import` lines for exported CSS: the same pinned jsDelivr stylesheets, which
 * need no account or allowlist. The comment points at the self-hosted route.
 */
export function buildFontsourceImports(family: string, weights: number[]): string[] {
  const font = BY_FAMILY.get(family);
  if (!font) return [];
  return [
    `/* ${family} from Fontsource. To self-host, install @fontsource/${font.id}@${font.version} and import the same files from it. */`,
    ...getFontsourceCssUrls(family, weights).map((url) => `@import url('${url}');`),
  ];
}
