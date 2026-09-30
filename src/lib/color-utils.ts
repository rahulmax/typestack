import { ILLUSTRATION_PACKS, ILLUSTRATION_TONES, type IllustrationSourceTone } from "./illustration-packs";

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (h < 60) {
    r1 = c;
    g1 = x;
  } else if (h < 120) {
    r1 = x;
    g1 = c;
  } else if (h < 180) {
    g1 = c;
    b1 = x;
  } else if (h < 240) {
    g1 = x;
    b1 = c;
  } else if (h < 300) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  const l1 = relativeLuminance(...rgb1);
  const l2 = relativeLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3
    ? h.split("").map((c) => parseInt(c + c, 16))
    : [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)].map((c) => parseInt(c, 16));
  return [n[0], n[1], n[2]];
}

export function isBgDark(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  // Simple perceived brightness
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  return clamped <= 0.0031308
    ? clamped * 12.92
    : 1.055 * clamped ** (1 / 2.4) - 0.055;
}

export function hexToOklch(hex: string): { l: number; c: number; h: number } {
  const [r, g, b] = hexToRgb(hex);
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const lc = Math.cbrt(l_);
  const mc = Math.cbrt(m_);
  const sc = Math.cbrt(s_);

  const L = 0.2104542553 * lc + 0.7936177850 * mc - 0.0040720468 * sc;
  const a = 1.9779984951 * lc - 2.4285922050 * mc + 0.4505937099 * sc;
  const bLab = 0.0259040371 * lc + 0.7827717662 * mc - 0.8086757660 * sc;

  const C = Math.sqrt(a * a + bLab * bLab);
  let H = (Math.atan2(bLab, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return { l: L, c: C, h: C < 0.0001 ? 0 : H };
}

export function oklchToHex(l: number, c: number, h: number): string {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const bLab = c * Math.sin(hRad);

  const lc = l + 0.3963377774 * a + 0.2158037573 * bLab;
  const mc = l - 0.1055613458 * a - 0.0638541728 * bLab;
  const sc = l - 0.0894841775 * a - 1.2914855480 * bLab;

  const l_ = lc * lc * lc;
  const m_ = mc * mc * mc;
  const s_ = sc * sc * sc;

  const lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  const r = Math.round(linearToSrgb(lr) * 255);
  const g = Math.round(linearToSrgb(lg) * 255);
  const b = Math.round(linearToSrgb(lb) * 255);

  return rgbToHex(
    Math.max(0, Math.min(255, r)),
    Math.max(0, Math.min(255, g)),
    Math.max(0, Math.min(255, b))
  );
}

export function hexToOklchString(hex: string): string {
  const { l, c, h } = hexToOklch(hex);
  return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${h.toFixed(2)})`;
}

function oklchToLinearRgb(
  L: number,
  C: number,
  H: number
): [number, number, number] {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const bLab = C * Math.sin(hRad);

  const lc = L + 0.3963377774 * a + 0.2158037573 * bLab;
  const mc = L - 0.1055613458 * a - 0.0638541728 * bLab;
  const sc = L - 0.0894841775 * a - 1.2914855480 * bLab;

  const l_ = lc * lc * lc;
  const m_ = mc * mc * mc;
  const s_ = sc * sc * sc;

  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_,
  ];
}

function oklchToRgb(
  L: number,
  C: number,
  H: number
): [number, number, number] {
  const [lr, lg, lb] = oklchToLinearRgb(L, C, H);
  return [
    Math.max(0, Math.min(255, Math.round(linearToSrgb(lr) * 255))),
    Math.max(0, Math.min(255, Math.round(linearToSrgb(lg) * 255))),
    Math.max(0, Math.min(255, Math.round(linearToSrgb(lb) * 255))),
  ];
}

function oklchToString(l: number, c: number, h: number): string {
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
}

export type Oklch = { l: number; c: number; h: number };

export function isInSrgbGamut({ l, c, h }: Oklch): boolean {
  return oklchToLinearRgb(l, c, h).every((v) => v >= -0.0005 && v <= 1.0005);
}

/** Largest chroma ≤ the requested one that fits sRGB, keeping L and hue. */
function gamutMap(lch: Oklch): Oklch {
  const l = Math.max(0, Math.min(1, lch.l));
  if (isInSrgbGamut({ ...lch, l })) return { ...lch, l };
  let lo = 0;
  let hi = lch.c;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (isInSrgbGamut({ l, c: mid, h: lch.h })) lo = mid;
    else hi = mid;
  }
  return { l, c: lo, h: lch.h };
}

export function oklchContrast(a: Oklch, b: Oklch): number {
  return contrastRatio(oklchToRgb(a.l, a.c, a.h), oklchToRgb(b.l, b.c, b.h));
}

/** Euclidean distance in OKLab. ~0.02 is a just-noticeable difference. */
export function deltaEOk(a: Oklch, b: Oklch): number {
  const ah = (a.h * Math.PI) / 180;
  const bh = (b.h * Math.PI) / 180;
  const da = a.c * Math.cos(ah) - b.c * Math.cos(bh);
  const db = a.c * Math.sin(ah) - b.c * Math.sin(bh);
  return Math.sqrt((a.l - b.l) ** 2 + da * da + db * db);
}

/** Straight-line mix in OKLab, so tints never swing through a third hue. */
function mixOklab(a: Oklch, b: Oklch, t: number): Oklch {
  const ah = (a.h * Math.PI) / 180;
  const bh = (b.h * Math.PI) / 180;
  const x = a.c * Math.cos(ah) * (1 - t) + b.c * Math.cos(bh) * t;
  const y = a.c * Math.sin(ah) * (1 - t) + b.c * Math.sin(bh) * t;
  const c = Math.sqrt(x * x + y * y);
  const h = c < 0.0001 ? a.h : ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  return { l: a.l * (1 - t) + b.l * t, c, h };
}

/** Chroma headroom shrinks toward black and white so fills never go neon. */
function chromaCap(l: number): number {
  return 0.16 * 4 * l * (1 - l);
}

function tone(l: number, c: number, h: number): Oklch {
  const lc = Math.max(0, Math.min(1, l));
  return gamutMap({ l: lc, c: Math.min(c, chromaCap(lc)), h });
}

/** Walk lightness in `dir` until `test` passes or lightness runs out. */
function nudge(lch: Oklch, dir: number, test: (t: Oklch) => boolean, limit = 1): Oklch {
  let result = lch;
  for (let i = 0; i < 100 && !test(result); i++) {
    const l = result.l + dir * 0.01;
    if (l < 0 || l > 1 || Math.abs(l - lch.l) > limit) break;
    result = tone(l, lch.c, lch.h);
  }
  return result;
}

const cuspCache = new Map<number, number>();

/** Lightness at which a hue reaches its most saturated in-gamut colour. */
function cuspLightness(h: number): number {
  const key = Math.round(h) % 360;
  const cached = cuspCache.get(key);
  if (cached !== undefined) return cached;
  let best = 0.5;
  let bestC = 0;
  for (let l = 0.3; l <= 0.99; l += 0.01) {
    const { c } = gamutMap({ l, c: 0.4, h: key });
    if (c > bestC) {
      bestC = c;
      best = l;
    }
  }
  cuspCache.set(key, best);
  return best;
}

/**
 * Yellows, limes and golds only look clean near their (very light) cusp.
 * Pulled much darker they read as olive, khaki or brown. Other hues darken
 * gracefully, so this only bites from orange (browns) through lime.
 */
function isMuddy(h: number, l: number): boolean {
  const band = h < 35 || h > 140 ? 0 : h < 60 ? (h - 35) / 25 : h > 120 ? (140 - h) / 20 : 1;
  return band * Math.max(0, cuspLightness(h) - l) > 0.08;
}

/** Rotate a muddy hue the shortest way out of the mud band at this lightness. */
function unmuddy(h: number, l: number): number {
  for (let step = 5; step <= 90; step += 5) {
    const warm = (h + 360 - step) % 360;
    if (!isMuddy(warm, l)) return warm;
    const cool = (h + step) % 360;
    if (!isMuddy(cool, l)) return cool;
  }
  return h;
}

/** Roles every illustration shares. Source surfaces and colours add one var each, per pack. */
export type IllustrationRole = "line" | "mass" | "dot" | "paper" | "glint" | "surface" | "glow";

export const ILLUSTRATION_ROLES: IllustrationRole[] = ["line", "mass", "dot", "paper", "glint", "surface", "glow"];

export type IllustrationTones = Record<string, Oklch>;

/** Below this OKLCH chroma a colour is treated as neutral (no usable hue). */
const CHROMATIC = 0.03;

/** Lightness span of the packs' source colours, so each lands at the same relative spot. */
const SOURCE_L = { lo: 0.5, hi: 0.9 };
/** Lightness span of the packs' light neutrals (#d6d6d6 up to white). */
const SURFACE_T = { lo: 0.85, hi: 1 };

/**
 * Generate the illustration palette from the page's own colours, in OKLCH.
 * Deterministic: the same page colours always give the same palette.
 *
 * The drawings are dark ink on light paper with a few flat colours. The
 * importer (scripts/build-illustrations.mjs) tagged every element with what
 * it is, so the palette can be rebuilt for any page without turning the
 * drawing into its negative:
 *
 * line    – outlines. The body text colour, pushed to 4.5:1 only if weak.
 * mass    – solid ink (hair, shoes, bushes). On light pages it is the line
 *           colour, as drawn. On dark pages the lines go light but masses
 *           stay the darkest tone in the figure: a deep tint of the page
 *           hue, just clear of the page. Never a bright blob.
 * dot     – stipple shading. Same rule: shading stays dark on dark pages.
 * paper   – white inside outlines, i.e. the figure's body. Always the page.
 * glint   – white laid over colour. Stays lighter than the colour under it.
 * surface – light neutral fills. On light pages they keep their source
 *           lightness between line and page. On dark pages they lift off
 *           the page in the same order: lighter source, lighter lift.
 * colours – each pack keeps its own hue harmony, rotated so its most-used
 *           colour lands on the page hue. Chroma follows how vivid the page
 *           is (neutral pages go monochrome). Lightness keeps the source
 *           order: on light pages as drawn, on dark pages inside a band
 *           that clears the masses and still lets light lines read on top.
 *
 * The page hue comes from the heading colour on light pages and from the
 * page itself on dark ones (light text colours go dull at fill lightness).
 */
export function computeIllustrationTones(
  backgroundColor: string,
  foregroundColor: string,
  inkColor: string = foregroundColor
): IllustrationTones {
  const bg = hexToOklch(backgroundColor);
  const fg = hexToOklch(foregroundColor);
  const inkIn = hexToOklch(inkColor);

  // +1: ink is lighter than the page (dark page); −1: a light page
  const dir = inkIn.l > bg.l || (inkIn.l === bg.l && bg.l < 0.5) ? 1 : -1;
  const darkPage = dir > 0;
  const line = oklchContrast(inkIn, bg) >= 4.5
    ? inkIn
    : nudge(inkIn, dir, (t) => oklchContrast(t, bg) >= 4.5);

  const fgHue = fg.c >= CHROMATIC ? fg.h : null;
  const bgHue = bg.c >= CHROMATIC ? bg.h : null;
  const anchor = darkPage ? bgHue ?? fgHue : fgHue ?? bgHue;
  const vivid = Math.max(fg.c, bg.c);
  // Share of the source chroma the colours keep: none on neutral pages,
  // at least 40% once the page has a hue, all of it on vivid pages
  const chromaScale = anchor === null ? 0 : Math.min(1, Math.max(0.4, 0.4 + (vivid - 0.03) * 6));
  const hueOr = (h: number) => anchor ?? h;

  const fillOk = (t: Oklch) => oklchContrast(t, bg) >= 1.25 || deltaEOk(t, bg) >= 0.12;
  const lineReads = (t: Oklch) => oklchContrast(t, line) >= 2 || deltaEOk(t, line) >= 0.15;

  // Ink that is not a line. Light pages: as drawn. Dark pages: the darkest
  // tone in the figure, a deep page-hue tint that still clears the page.
  const deepC = Math.min(0.06, 0.02 + 0.06 * chromaScale);
  const deep = (contrast: number) =>
    nudge(tone(bg.l + 0.04, anchor === null ? Math.min(bg.c, 0.02) : deepC, hueOr(bg.h)), 1, (t) => oklchContrast(t, bg) >= contrast);
  // Colour band on dark pages: above the masses, below where light lines stop reading
  const bandHi = nudge(tone(line.l, 0, line.h), -1, (t) => oklchContrast(t, line) >= 2.2).l;
  // A mid-light line (orange, teal) leaves little room, so masses give way first:
  // they may sink to 1.6:1 against the page, but never above the colours
  let mass = darkPage ? deep(2.2) : line;
  if (darkPage && mass.l > bandHi - 0.08) {
    const floor = deep(1.6);
    mass = floor.l >= bandHi - 0.08 ? floor : tone(bandHi - 0.08, mass.c, mass.h);
  }
  let dot = darkPage ? deep(1.8) : line;
  if (dot.l > mass.l) dot = mass;
  const bandLo = Math.min(mass.l + 0.1, bandHi);
  const aboveMass = (t: Oklch) => !darkPage || t.l >= mass.l + 0.03;
  const u = (l: number) => Math.min(1, Math.max(0, (l - SOURCE_L.lo) / (SOURCE_L.hi - SOURCE_L.lo)));

  const colourFor = (src: Oklch, rotation: number): Oklch => {
    const h = anchor === null ? src.h : (src.h + rotation + 360) % 360;
    const c = src.c * chromaScale;
    const l = darkPage ? bandLo + (bandHi - bandLo) * u(src.l) : line.l + (bg.l - line.l) * src.l;
    let t = tone(l, c, isMuddy(h, l) ? unmuddy(h, l) : h);
    t = nudge(t, dir, fillOk);
    if (!lineReads(t)) t = nudge(t, -dir, (x) => lineReads(x) || !fillOk(x) || !aboveMass(x));
    // The nudges move lightness, which can walk a warm hue back into mud.
    // Checked with a little margin, since this is the last word.
    const m = t.l - 0.03;
    return isMuddy(t.h, m) ? tone(t.l, c, unmuddy(t.h, m)) : t;
  };

  const surfaceFor = (src: Oklch): Oklch => {
    const t = Math.min(1, Math.max(SURFACE_T.lo, src.l));
    const c = Math.min(bg.c, 0.03);
    // Light pages: between line and page, as drawn. Dark pages: lighter
    // sources lift further, so shading stays darker than what it shades.
    const l = darkPage
      ? bg.l + 0.05 + (t - SURFACE_T.lo)
      : line.l + (bg.l - line.l) * t;
    return tone(l, c, bg.h);
  };

  const tones: IllustrationTones = {
    line,
    mass,
    dot,
    paper: bg,
    glint: darkPage ? gamutMap(mixOklab(line, bg, 0.08)) : bg,
  };

  for (const pack of ILLUSTRATION_PACKS) {
    const own = ILLUSTRATION_TONES.filter((t) => t.pack === pack.id);
    const colours = own.filter((t) => t.kind === "colour");
    const lead = colours.reduce<IllustrationSourceTone | null>((a, b) => (!a || b.uses > a.uses ? b : a), null);
    const rotation = lead && anchor !== null ? anchor - lead.h : 0;
    for (const t of own) {
      tones[t.id] = t.kind === "colour" ? colourFor(t, rotation) : surfaceFor(t);
    }
  }

  // Backdrop tint and hero glow, from a mid colour on the page hue
  const glow = colourFor({ l: 0.7, c: 0.14, h: hueOr(bg.h) }, 0);
  tones.glow = glow;
  tones.surface = gamutMap(mixOklab(bg, glow, 0.14));

  return tones;
}

export type IllustrationPalette = Record<string, string>;

/** CSS `oklch()` strings keyed by var name (without `--ill-`). */
export function computeIllustrationPalette(
  backgroundColor: string,
  foregroundColor: string,
  inkColor: string = foregroundColor
): IllustrationPalette {
  const tones = computeIllustrationTones(backgroundColor, foregroundColor, inkColor);
  const out: IllustrationPalette = {};
  for (const [key, { l, c, h }] of Object.entries(tones)) out[key] = oklchToString(l, c, h);
  return out;
}

export function generateRandomColorPair(preferDarkBg = false): { fg: string; bg: string } {
  const MAX_ATTEMPTS = 200;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const hue1 = Math.random() * 360;
    const sat1 = 10 + Math.random() * 90;
    const lit1 = Math.random() * 100;

    const hue2 = Math.random() * 360;
    const sat2 = 10 + Math.random() * 90;
    const lit2 = Math.random() * 100;

    const rgb1 = hslToRgb(hue1, sat1, lit1);
    const rgb2 = hslToRgb(hue2, sat2, lit2);

    const ratio = contrastRatio(rgb1, rgb2);
    if (ratio >= 4.5) {
      const lum1 = relativeLuminance(...rgb1);
      const lum2 = relativeLuminance(...rgb2);
      const dark = lum1 < lum2 ? rgb1 : rgb2;
      const light = lum1 < lum2 ? rgb2 : rgb1;

      return preferDarkBg
        ? { fg: rgbToHex(...light), bg: rgbToHex(...dark) }
        : { fg: rgbToHex(...dark), bg: rgbToHex(...light) };
    }
  }

  return preferDarkBg
    ? { fg: "#e8e8f0", bg: "#1a1a2e" }
    : { fg: "#1a1a2e", bg: "#e8e8f0" };
}
