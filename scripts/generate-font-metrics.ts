/**
 * generate-font-metrics.ts
 *
 * Fetches Google Fonts woff files, parses them with opentype.js,
 * and writes a pre-computed metrics table to src/data/font-metrics-table.ts.
 *
 * Usage:  npx tsx scripts/generate-font-metrics.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import opentype from "opentype.js";
import { PRESETS } from "../src/db/seed-presets";

// ---------------------------------------------------------------------------
// 1. Collect unique font names from seed presets
// ---------------------------------------------------------------------------

const presetFonts = new Set<string>();
for (const p of PRESETS) {
  presetFonts.add(p.headingFont);
  presetFonts.add(p.bodyFont);
}

// ---------------------------------------------------------------------------
// 2. Additional popular Google Fonts
// ---------------------------------------------------------------------------

const EXTRA_FONTS = [
  "Roboto",
  "Open Sans",
  "Noto Sans",
  "Poppins",
  "Lato",
  "Inter",
  "Montserrat",
  "Source Sans Pro",
  "Oswald",
  "Raleway",
  "PT Sans",
  "Ubuntu",
  "Merriweather",
  "Playfair Display",
  "Nunito",
  "Rubik",
  "Work Sans",
  "Fira Sans",
  "Barlow",
  "DM Sans",
  "Manrope",
  "Outfit",
  "Lexend",
  "Geist",
  "Libre Baskerville",
  "IBM Plex Sans",
  "IBM Plex Serif",
  "Bitter",
  "Noto Serif",
  "PT Serif",
  "EB Garamond",
  "Cormorant Garamond",
  "Vollkorn",
  "Libre Franklin",
  "Josefin Sans",
];

const allFonts = new Set<string>([...presetFonts, ...EXTRA_FONTS]);

// ---------------------------------------------------------------------------
// 3. Fetch + parse helpers
// ---------------------------------------------------------------------------

interface FontMetrics {
  unitsPerEm: number;
  xHeight: number;
  capHeight: number;
  ascender: number;
  descender: number;
}

// Use an older Firefox User-Agent with CSS v1 API to get woff format.
// opentype.js v1.x can parse woff and ttf but NOT woff2.
const WOFF_USER_AGENT =
  "Mozilla/5.0 (Windows NT 6.1; rv:38.0) Gecko/20100101 Firefox/38.0";

async function fetchFontUrl(fontName: string): Promise<string | null> {
  // Strategy 1: CSS v1 API with old Firefox UA -> gets woff
  const cssV1Url = `https://fonts.googleapis.com/css?family=${encodeURIComponent(fontName)}:400&display=swap`;
  const cssRes = await fetch(cssV1Url, {
    headers: { "User-Agent": WOFF_USER_AGENT },
  });

  if (!cssRes.ok) {
    return null;
  }

  const cssText = await cssRes.text();

  // Extract font URL (may or may not have extension)
  const fontUrls = [...cssText.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)];
  if (fontUrls.length === 0) {
    return null;
  }

  // Use the last URL (typically the latin subset or the only one)
  return fontUrls[fontUrls.length - 1][1];
}

async function fetchMetrics(fontName: string): Promise<FontMetrics | null> {
  try {
    const fontUrl = await fetchFontUrl(fontName);
    if (!fontUrl) {
      console.warn(`  [WARN] No font URL found for "${fontName}"`);
      return null;
    }

    // Fetch binary font data
    const fontRes = await fetch(fontUrl);
    if (!fontRes.ok) {
      console.warn(`  [WARN] Font fetch failed for "${fontName}" (${fontRes.status})`);
      return null;
    }

    const arrayBuffer = await fontRes.arrayBuffer();

    // Parse with opentype.js
    const font = opentype.parse(arrayBuffer);

    // Extract metrics (same logic as extractMetricsFromFont)
    const upm = font.unitsPerEm;
    const os2 = font.tables.os2;
    const xH = os2?.sxHeight ?? upm * 0.52;
    const capH = os2?.sCapHeight ?? upm * 0.72;
    const asc = os2?.sTypoAscender ?? font.ascender;
    const desc = os2?.sTypoDescender ?? font.descender;

    return {
      unitsPerEm: upm,
      xHeight: Math.round((xH / upm) * 1000) / 1000,
      capHeight: Math.round((capH / upm) * 1000) / 1000,
      ascender: Math.round((asc / upm) * 1000) / 1000,
      descender: Math.round((desc / upm) * 1000) / 1000,
    };
  } catch (err) {
    console.warn(`  [WARN] Error processing "${fontName}":`, (err as Error).message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 4. Main
// ---------------------------------------------------------------------------

async function main() {
  const sortedFonts = [...allFonts].sort((a, b) => a.localeCompare(b));
  console.log(`Generating metrics for ${sortedFonts.length} fonts...\n`);

  const results = new Map<string, FontMetrics>();

  for (const fontName of sortedFonts) {
    process.stdout.write(`  Fetching "${fontName}"...`);
    const metrics = await fetchMetrics(fontName);
    if (metrics) {
      results.set(fontName, metrics);
      console.log(` OK`);
    } else {
      console.log(` SKIPPED`);
    }
  }

  console.log(`\nSuccessfully extracted metrics for ${results.size}/${sortedFonts.length} fonts.`);

  // Build output file content
  const entries = [...results.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, m]) => {
      return `  "${name}": { unitsPerEm: ${m.unitsPerEm}, xHeight: ${m.xHeight}, capHeight: ${m.capHeight}, ascender: ${m.ascender}, descender: ${m.descender} },`;
    })
    .join("\n");

  const output = `import type { FontMetrics } from "@/lib/font-metrics";

export const FONT_METRICS_TABLE: Record<string, FontMetrics> = {
${entries}
};
`;

  const outPath = path.resolve(__dirname, "../src/data/font-metrics-table.ts");
  fs.writeFileSync(outPath, output, "utf-8");
  console.log(`\nWritten to ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
