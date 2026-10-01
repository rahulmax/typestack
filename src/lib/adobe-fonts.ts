import type { FontCategory } from "@/types/google-fonts";
import type { AdobeFace, AdobeKit, FontOption } from "@/types/fonts";

const KIT_HOST = "https://use.typekit.net";

/**
 * Placeholder emitted in exported CSS. An Adobe web project only serves fonts
 * to the domains on its own allowlist, so an export can never point at the
 * kit TypeStax previews with -- the consumer has to supply their own.
 */
export const ADOBE_KIT_PLACEHOLDER = "YOUR_KIT_ID";

/** Kit IDs are public by nature: they ship in the HTML of every site using them. */
export function getKitId(): string | undefined {
  return process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID || undefined;
}

/**
 * Kit families are CSS slugs ("proxima-nova"); Google families are title-cased
 * names ("Proxima Nova"). The shape alone says which namespace a family is in,
 * before -- or without -- a kit ever loading.
 */
export function isKitSlug(family: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(family);
}

/** Families whose real names title-casing can't reach, keyed by slug. */
const KNOWN_LABELS: Record<string, string> = {
  ivymode: "IvyMode",
  "mrs-eaves-xl-serif": "Mrs Eaves XL Serif",
  "ivypresto-display": "IvyPresto Display",
  "ivypresto-text": "IvyPresto Text",
  // CSS names that stray from the family name.
  "canada-type-gibson": "Gibson",
  "ff-meta-serif-web-pro": "FF Meta Serif Pro",
  "lemonde-journal": "Le Monde Journal Std",
  "lemonde-sans": "Le Monde Sans Std",
  orpheuspro: "Orpheus Pro",
};

/** Foundry and format tokens that Adobe's own family names keep in capitals. */
const UPPERCASE_TOKENS = new Set(["cf", "din", "djr", "ff", "itc", "lt", "p22", "pt", "urw"]);

/**
 * Kits identify families by CSS slug only -- the display names live behind the
 * account API, which needs a secret we can't ship. Title-casing the slug gets
 * "sofia-pro" to "Sofia Pro" and "futura-pt" to "Futura PT", which is what a
 * designer expects to read and what desktop-synced fonts are named in Figma.
 */
export function labelFromSlug(slug: string): string {
  if (KNOWN_LABELS[slug]) return KNOWN_LABELS[slug];
  return slug
    .split("-")
    .map((word) =>
      UPPERCASE_TOKENS.has(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

const ADOBE_SITE = "https://fonts.adobe.com";

/**
 * Kit slugs whose family page Adobe doesn't redirect to. Berthold Baskerville
 * has no page left, so a search is the closest thing to one.
 */
const PAGE_PATHS: Record<string, string> = {
  "area-normal": "/fonts/area",
  "berthold-baskerville-pro": "/search?query=Berthold+Baskerville",
  "ff-meta-serif-web-pro": "/fonts/ff-meta-serif",
  "lemonde-journal": "/fonts/le-monde-journal",
  "lemonde-sans": "/fonts/le-monde-sans",
  orpheuspro: "/fonts/orpheus",
};

/**
 * A family's page on Adobe Fonts, where it can be activated. Adobe redirects
 * most CSS slugs to the family they belong to ("freight-text-pro" lands on
 * "freight-text"), so the slug is the path unless it is listed above.
 */
export function getAdobeFontPageUrl(slug: string): string {
  return `${ADOBE_SITE}${PAGE_PATHS[slug] ?? `/fonts/${slug}`}`;
}

/** Maps a CSS generic family, which is all the kit tells us, onto our categories. */
function categoryFromGeneric(generic: string): FontCategory {
  switch (generic) {
    case "serif":
      return "serif";
    case "monospace":
      return "monospace";
    case "cursive":
      return "handwriting";
    case "fantasy":
      return "display";
    default:
      return "sans-serif";
  }
}

/**
 * The kit's `c` array pairs a `.tk-` helper class with the font stack it sets,
 * which is the only place the kit records a family's generic category.
 */
const FAMILY_STACK_RE = /"\\"([^"\\]+)\\",([a-z-]+)"/g;

/** Each entry of the kit's `fc` array is one @font-face. */
const FACE_RE = /"family":"([^"]+)","src":"([^"]+)","descriptors":\{([^}]*)\}/g;

export function parseKit(id: string, js: string): AdobeKit {
  const categories = new Map<string, FontCategory>();
  for (const [, family, generic] of js.matchAll(FAMILY_STACK_RE)) {
    categories.set(family, categoryFromGeneric(generic));
  }

  const faces: AdobeFace[] = [];
  const weightsByFamily = new Map<string, Set<number>>();

  for (const [, family, src, descriptors] of js.matchAll(FACE_RE)) {
    // Variable faces carry a range ("100 900"); the first number is the floor.
    const weight = Number(descriptors.match(/"weight":"(\d+)/)?.[1] ?? 400);
    const style = descriptors.includes('"style":"italic"') ? "italic" : "normal";
    const primer = descriptors.match(/"primer":"([^"]*)"/)?.[1] ?? "";

    faces.push({ family, weight, style, src, primer });
    if (!weightsByFamily.has(family)) weightsByFamily.set(family, new Set());
    weightsByFamily.get(family)!.add(weight);
  }

  const families: FontOption[] = [...weightsByFamily.keys()]
    .map((family) => ({
      family,
      label: labelFromSlug(family),
      category: categories.get(family) ?? "sans-serif",
      source: "adobe" as const,
      weights: [...weightsByFamily.get(family)!].sort((a, b) => a - b),
    }))
    .sort((a, b) => a.family.localeCompare(b.family));

  return { id, families, faces };
}

let kitPromise: Promise<AdobeKit | null> | null = null;
let loadedKit: AdobeKit | null = null;
let settled = false;

/**
 * Fetches and parses the configured web project. The kit JS is CORS-open, so
 * this needs no server proxy. Resolves to null when no kit is configured or the
 * kit is unreachable -- Adobe fonts then simply don't appear in the picker.
 */
export function fetchAdobeKit(): Promise<AdobeKit | null> {
  if (kitPromise) return kitPromise;

  const id = getKitId();
  if (!id) {
    settled = true;
    kitPromise = Promise.resolve(null);
    return kitPromise;
  }

  kitPromise = fetch(`${KIT_HOST}/${id}.js`)
    .then((res) => (res.ok ? res.text() : Promise.reject(new Error(String(res.status)))))
    .then((js) => {
      const kit = parseKit(id, js);
      // A kit that parses to nothing means the payload shape moved; treat it as
      // absent rather than surfacing an empty "Adobe Fonts" group.
      if (kit.families.length === 0) return null;
      loadedKit = kit;
      return kit;
    })
    .catch(() => null)
    .finally(() => {
      settled = true;
    });

  return kitPromise;
}

/**
 * Synchronous source check for a family. Only meaningful once the kit has
 * loaded; unknown families fall through to Google, which is the prior behavior.
 */
export function isAdobeFamily(family: string): boolean {
  return loadedKit?.families.some((f) => f.family === family) ?? false;
}

export function getLoadedKit(): AdobeKit | null {
  return loadedKit;
}

/** False while the kit request is still in flight, when family sources are unknowable. */
export function isKitResolved(): boolean {
  return !getKitId() || settled;
}

/** The whole kit is one stylesheet, so a family's weights cost no extra request. */
export function getKitCssUrl(id = getKitId()): string | undefined {
  return id ? `${KIT_HOST}/${id}.css` : undefined;
}

/** The root layout renders the kit stylesheet under this id, so injection is a no-op there. */
export const ADOBE_KIT_ELEMENT_ID = "adobe-fonts-kit";

export function loadAdobeKitCSS(): void {
  const url = getKitCssUrl();
  if (!url) return;
  if (document.getElementById(ADOBE_KIT_ELEMENT_ID)) return;

  const link = document.createElement("link");
  link.id = ADOBE_KIT_ELEMENT_ID;
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

/** Adobe's font variation description, e.g. `n4` for normal 400, `i7` for bold italic. */
function fvd(weight: number, style: "normal" | "italic"): string {
  const step = Math.min(9, Math.max(1, Math.round(weight / 100)));
  return `${style === "italic" ? "i" : "n"}${step}`;
}

/**
 * Resolves a kit face to its OpenType file. opentype.js cannot decompress
 * woff2, but Adobe serves an uncompressed `opentype` build of every face
 * (the `a` format), which parses fine -- so real metrics are available.
 */
export function getAdobeFontUrl(family: string, weight = 400): string | undefined {
  const faces = loadedKit?.faces.filter((f) => f.family === family && f.style === "normal");
  if (!faces?.length) return undefined;

  const face =
    faces.find((f) => f.weight === weight) ??
    faces.reduce((closest, f) =>
      Math.abs(f.weight - weight) < Math.abs(closest.weight - weight) ? f : closest,
    );

  const base = face.src.replace("{format}", "a").replace(/\{\?[^}]*\}$/, "");
  const params = new URLSearchParams({ fvd: fvd(face.weight, face.style), v: "3" });
  if (face.primer) params.set("primer", face.primer);
  return `${base}?${params}`;
}
