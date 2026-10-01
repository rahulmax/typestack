import type { FontOption, FoundryFace, FoundryFamily } from "@/types/fonts";
import { FOUNDRY_FONTS } from "@/data/foundry-fonts";
import { matchWeight } from "./fontsource";

/**
 * Open-licensed families served from their foundries' own repositories.
 * jsDelivr serves any public GitHub repo or npm package at a pinned commit or
 * version, so the foundry's own woff2 files are the webfonts, untouched. The
 * repos ship no stylesheet, so the `@font-face` rules are written here, and the
 * same rules serve the app, the preview iframe and exported CSS.
 */
const CDN = "https://cdn.jsdelivr.net";

const BY_FAMILY = new Map(FOUNDRY_FONTS.map((f) => [f.family, f]));

/** The curated list excludes every Google and Fontsource name, so this is a plain lookup. */
export function isFoundryFamily(family: string): boolean {
  return BY_FAMILY.has(family);
}

export function getFoundryFamily(family: string): FoundryFamily | undefined {
  return BY_FAMILY.get(family);
}

function uprightWeights(font: FoundryFamily): number[] {
  return font.faces.filter((f) => f.style === "normal").map((f) => f.weight);
}

export const FOUNDRY_OPTIONS: FontOption[] = FOUNDRY_FONTS.map((f) => ({
  family: f.family,
  label: f.family,
  category: f.category,
  source: "foundry",
  weights: uprightWeights(f),
  foundry: f.foundry,
}));

/**
 * The faces a request actually needs: for each weight, the upright the browser
 * would render and the italic it would pair with it, where the family has one.
 */
function servedFaces(font: FoundryFamily, requested: number[]): FoundryFace[] {
  const served = new Set<FoundryFace>();
  for (const style of ["normal", "italic"] as const) {
    const faces = font.faces.filter((f) => f.style === style);
    if (faces.length === 0) continue;
    const weights = faces.map((f) => f.weight);
    for (const weight of requested) {
      const match = matchWeight(weights, weight);
      served.add(faces.find((f) => f.weight === match)!);
    }
  }
  return font.faces.filter((f) => served.has(f));
}

function fontFace(font: FoundryFamily, face: FoundryFace): string {
  return [
    "@font-face {",
    `  font-family: '${font.family}';`,
    `  font-style: ${face.style};`,
    `  font-weight: ${face.weight};`,
    "  font-display: swap;",
    `  src: url('${CDN}/${font.pkg}/${face.path}') format('woff2');`,
    "}",
  ].join("\n");
}

/** `@font-face` rules for a family: every face, or just those the weights call for. */
export function buildFoundryFontFaces(family: string, weights?: number[]): string[] {
  const font = BY_FAMILY.get(family);
  if (!font) return [];
  const faces = weights ? servedFaces(font, weights) : font.faces;
  return faces.map((face) => fontFace(font, face));
}

/**
 * The family's rules as a stylesheet URL, for the preview iframe, which takes
 * its fonts as `<link>`s. A data URL keeps the rules in one place.
 */
export function getFoundryCssUrl(family: string, weights?: number[]): string | undefined {
  const rules = buildFoundryFontFaces(family, weights);
  if (rules.length === 0) return undefined;
  return `data:text/css;charset=utf-8,${encodeURIComponent(rules.join("\n"))}`;
}

/**
 * Declares every face of the family. A browser only fetches the faces a page
 * sets text in, so one call covers both the picker row and the full design.
 */
export function loadFoundryFont(family: string): void {
  const id = `foundry-${family.replace(/[^a-z0-9]/gi, "-")}`;
  if (document.getElementById(id)) return;

  const rules = buildFoundryFontFaces(family);
  if (rules.length === 0) return;

  const style = document.createElement("style");
  style.id = id;
  style.textContent = rules.join("\n");
  document.head.appendChild(style);
}

/** The family's page at its foundry, with the downloads and the licence. */
export function getFoundryPageUrl(family: string): string | undefined {
  return BY_FAMILY.get(family)?.page;
}

/**
 * `@font-face` rules for exported CSS: the same pinned files the preview
 * renders, credited to the foundry. The comment points at the self-hosted route.
 */
export function buildFoundryExport(family: string, weights: number[]): string[] {
  const font = BY_FAMILY.get(family);
  if (!font) return [];
  return [
    `/* ${family} by ${font.foundry} (${font.license}), served from the foundry's own files. To self-host, download it from ${font.page} */`,
    ...buildFoundryFontFaces(family, weights),
  ];
}
