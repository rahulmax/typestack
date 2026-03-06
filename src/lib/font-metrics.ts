import type { Font } from "opentype.js";
import { FONT_METRICS_TABLE } from "@/data/font-metrics-table";
import { parse as parseFont } from "opentype.js";

export interface FontMetrics {
  unitsPerEm: number;
  xHeight: number;     // normalized 0-1 (xHeight / unitsPerEm)
  capHeight: number;    // normalized 0-1
  ascender: number;     // normalized 0-1
  descender: number;    // normalized 0-1 (negative value)
}

// Fallback metrics by Google Fonts category
const CATEGORY_FALLBACKS: Record<string, FontMetrics> = {
  "sans-serif": { unitsPerEm: 1000, xHeight: 0.52, capHeight: 0.72, ascender: 0.93, descender: -0.24 },
  serif:        { unitsPerEm: 1000, xHeight: 0.46, capHeight: 0.68, ascender: 0.90, descender: -0.22 },
  display:      { unitsPerEm: 1000, xHeight: 0.50, capHeight: 0.70, ascender: 0.92, descender: -0.23 },
  monospace:    { unitsPerEm: 1000, xHeight: 0.54, capHeight: 0.73, ascender: 0.93, descender: -0.25 },
  handwriting:  { unitsPerEm: 1000, xHeight: 0.44, capHeight: 0.66, ascender: 0.88, descender: -0.26 },
};

const DEFAULT_FALLBACK = CATEGORY_FALLBACKS["sans-serif"];

// Session cache
const metricsCache = new Map<string, FontMetrics>();

export function extractMetricsFromFont(font: Font): FontMetrics {
  const upm = font.unitsPerEm;
  const os2 = font.tables.os2;
  const xH = os2?.sxHeight ?? upm * 0.52;
  const capH = os2?.sCapHeight ?? upm * 0.72;
  const asc = os2?.sTypoAscender ?? font.ascender;
  const desc = os2?.sTypoDescender ?? font.descender;

  return {
    unitsPerEm: upm,
    xHeight: xH / upm,
    capHeight: capH / upm,
    ascender: asc / upm,
    descender: desc / upm,
  };
}

export function getCachedMetrics(fontFamily: string): FontMetrics | undefined {
  return metricsCache.get(fontFamily);
}

export function setCachedMetrics(fontFamily: string, metrics: FontMetrics): void {
  metricsCache.set(fontFamily, metrics);
}

export function getFallbackMetrics(category?: string): FontMetrics {
  return CATEGORY_FALLBACKS[category || "sans-serif"] || DEFAULT_FALLBACK;
}

export async function resolveFontMetrics(
  fontFamily: string,
  category?: string,
): Promise<FontMetrics> {
  // 1. Session cache
  const cached = getCachedMetrics(fontFamily);
  if (cached) return cached;

  // 2. Bundled table
  const bundled = FONT_METRICS_TABLE[fontFamily];
  if (bundled) {
    setCachedMetrics(fontFamily, bundled);
    return bundled;
  }

  // 3. Runtime parse from Google Fonts
  try {
    const metrics = await fetchAndParseFont(fontFamily);
    setCachedMetrics(fontFamily, metrics);
    return metrics;
  } catch {
    // 4. Category fallback
    const fallback = getFallbackMetrics(category);
    setCachedMetrics(fontFamily, fallback);
    return fallback;
  }
}

async function fetchAndParseFont(fontFamily: string): Promise<FontMetrics> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400&display=swap`;
  const cssRes = await fetch(cssUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
  });
  const cssText = await cssRes.text();

  const woff2Match = cssText.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
  if (!woff2Match) throw new Error(`No woff2 URL found for ${fontFamily}`);

  const fontRes = await fetch(woff2Match[1]);
  const buffer = await fontRes.arrayBuffer();
  const font = parseFont(buffer);

  return extractMetricsFromFont(font);
}
