import type { GoogleFont, GoogleFontsApiResponse, FontCategory } from "@/types/google-fonts";
import { POPULAR_FONTS } from "@/data/popular-fonts";

const METADATA_URL = "https://www.googleapis.com/webfonts/v1/webfonts";

let cachedFonts: GoogleFont[] | null = null;

export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  if (cachedFonts) return cachedFonts;

  // Try API if key is set, otherwise use bundled list
  const key = typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY
    : undefined;

  if (key) {
    try {
      const params = new URLSearchParams({ sort: "popularity", key });
      const res = await fetch(`${METADATA_URL}?${params}`);
      if (res.ok) {
        const data: GoogleFontsApiResponse = await res.json();
        cachedFonts = data.items;
        return cachedFonts;
      }
    } catch {
      // Fall through to bundled list
    }
  }

  cachedFonts = POPULAR_FONTS;
  return cachedFonts;
}

export function filterFontsByCategory(
  fonts: GoogleFont[],
  category: FontCategory | "all"
): GoogleFont[] {
  if (category === "all") return fonts;
  return fonts.filter((f) => f.category === category);
}

export function loadFontPreview(family: string): void {
  const id = `gf-preview-${family.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&text=${encodeURIComponent(family)}&display=swap`;
  document.head.appendChild(link);
}

export function loadFontFull(family: string, weights: number[] = [400, 700]): void {
  const id = `gf-full-${family.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;

  const weightStr = weights.map((w) => `0,${w};1,${w}`).join(";");
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${weightStr}&display=swap`;
  document.head.appendChild(link);
}

export function getFontLinkUrl(family: string, weights: number[] = [400, 700]): string {
  const weightStr = weights.map((w) => `0,${w};1,${w}`).join(";");
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${weightStr}&display=swap`;
}

export function buildFontImports(families: Map<string, Set<number>>): string[] {
  const imports: string[] = []
  for (const [family, weights] of families) {
    const sorted = [...weights].sort((a, b) => a - b)
    const wghtList = sorted.map((w) => `0,${w};1,${w}`).join(";")
    imports.push(
      `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${wghtList}&display=swap');`
    )
  }
  return imports
}
