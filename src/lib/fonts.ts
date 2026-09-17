import type { FontCategory } from "@/types/google-fonts";
import type { FontOption } from "@/types/fonts";
import { POPULAR_FONTS } from "@/data/popular-fonts";
import {
  fetchGoogleFonts,
  loadFontPreview as loadGooglePreview,
  loadFontFull as loadGoogleFull,
  getFontLinkUrl as getGoogleLinkUrl,
  buildGoogleImport,
} from "./google-fonts";
import {
  ADOBE_KIT_PLACEHOLDER,
  fetchAdobeKit,
  getKitCssUrl,
  getLoadedKit,
  isAdobeFamily,
  isKitResolved,
  isKitSlug,
  labelFromSlug,
  loadAdobeKitCSS,
} from "./adobe-fonts";

const GOOGLE_CATEGORIES = new Map(POPULAR_FONTS.map((f) => [f.family, f.category]));

function toFontOption(family: string, variants: string[], category: string): FontOption {
  const weights = [...new Set(variants.map((v) => Number(v.replace("italic", "")) || 400))];
  return {
    family,
    label: family,
    category: category as FontCategory,
    source: "google",
    weights: weights.sort((a, b) => a - b),
  };
}

/**
 * Every font the picker can offer. Adobe families lead: they are a deliberate,
 * curated set the user licensed, where the Google list is a catalog to browse.
 */
export async function fetchFontOptions(): Promise<FontOption[]> {
  const [kit, google] = await Promise.all([fetchAdobeKit(), fetchGoogleFonts()]);
  if (kit) loadAdobeKitCSS();

  const googleOptions = google.map((f) => toFontOption(f.family, f.variants, f.category));
  return kit ? [...kit.families, ...googleOptions] : googleOptions;
}

export function filterFontsByCategory(
  fonts: FontOption[],
  category: FontCategory | "all",
): FontOption[] {
  if (category === "all") return fonts;
  return fonts.filter((f) => f.category === category);
}

/**
 * Adobe families need no work: the root layout already carries the kit
 * stylesheet, and one kit covers every family in it. Until the kit resolves we
 * can't tell the two sources apart, so we wait rather than fire a Google
 * request for a slug Google has never heard of.
 */
function whenSourceKnown(family: string, loadFromGoogle: () => void): void {
  if (isAdobeFamily(family)) return;
  if (!isKitResolved()) {
    fetchAdobeKit().then(() => {
      if (!isAdobeFamily(family)) loadFromGoogle();
    });
    return;
  }
  loadFromGoogle();
}

export function loadFontPreview(family: string): void {
  whenSourceKnown(family, () => loadGooglePreview(family));
}

export function loadFontFull(family: string, weights?: number[]): void {
  whenSourceKnown(family, () => loadGoogleFull(family, weights));
}

/**
 * Stylesheet URLs for the preview iframe, which has its own document head. The
 * kit URL is included whenever one is configured: it is a single cached request
 * that covers every kit family, so the iframe never has to resolve sources.
 */
export function getFontLinkUrls(families: string[], weights: number[]): string[] {
  const urls = new Set<string>();
  const kitUrl = getKitCssUrl();
  if (kitUrl) urls.add(kitUrl);
  for (const family of families) {
    if (!isAdobeFamily(family)) urls.add(getGoogleLinkUrl(family, weights));
  }
  return [...urls];
}

export function getFontCategory(family: string): FontCategory {
  const adobe = getLoadedKit()?.families.find((f) => f.family === family);
  if (adobe) return adobe.category;
  return (GOOGLE_CATEGORIES.get(family) as FontCategory) ?? "sans-serif";
}

/** Our categories that aren't CSS generic families, mapped to the nearest one that is. */
const CSS_GENERICS: Record<FontCategory, string> = {
  "sans-serif": "sans-serif",
  serif: "serif",
  monospace: "monospace",
  handwriting: "cursive",
  display: "sans-serif",
};

/** A CSS font stack whose generic fallback matches the family's own category. */
export function getFontStack(family: string): string {
  return `'${family}', ${CSS_GENERICS[getFontCategory(family)]}`;
}

/** The name a designer reads, and the name a desktop-synced font has in Figma or Pencil. */
export function getFontLabel(family: string): string {
  return isKitSlug(family) ? labelFromSlug(family) : family;
}

/**
 * Whether this app can actually render a family. A kit family only renders when
 * it is in the kit this deployment serves; anything else falls through to
 * Google, as before.
 */
export function canRenderFamily(family: string): boolean {
  return !isKitSlug(family) || isAdobeFamily(family);
}

/** Settles once kit membership is known, so `canRenderFamily` answers truthfully. */
export async function resolveFontSources(): Promise<void> {
  await fetchAdobeKit();
}

/**
 * `@import` lines for exported CSS. Adobe families collapse to one commented
 * placeholder: a web project only serves to its own allowlisted domains, so the
 * consumer must point this at a kit of their own.
 */
export function buildFontImports(families: Map<string, Set<number>>): string[] {
  const lines: string[] = [];
  let hasAdobe = false;

  for (const [family, weights] of families) {
    if (isAdobeFamily(family)) {
      hasAdobe = true;
      continue;
    }
    lines.push(buildGoogleImport(family, [...weights].sort((a, b) => a - b)));
  }

  if (hasAdobe) {
    const adobeFamilies = [...families.keys()].filter(isAdobeFamily);
    lines.unshift(
      `/* Adobe Fonts (${adobeFamilies.join(", ")}) -- replace ${ADOBE_KIT_PLACEHOLDER} with your own`,
      `   web project kit ID from https://fonts.adobe.com/my_fonts#web_projects-section.`,
      `   A kit only serves the domains on its own allowlist, so it can't be shared. */`,
      `@import url('https://use.typekit.net/${ADOBE_KIT_PLACEHOLDER}.css');`,
    );
  }

  return lines;
}
