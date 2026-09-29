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

function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** Step from one hue toward another along the shorter arc. */
function mixHue(from: number, to: number, t: number): number {
  const d = ((to - from + 540) % 360) - 180;
  return (from + d * t + 360) % 360;
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

export type IllustrationRole =
  | "ink"
  | "primary"
  | "secondary"
  | "accent"
  | "highlight"
  | "surface";

export type IllustrationTones = Record<IllustrationRole, Oklch>;

/** Below this OKLCH chroma a colour is treated as neutral (no usable hue). */
const CHROMATIC = 0.03;

/**
 * Derive the illustration palette from the page's own colours, in OKLCH.
 * Deterministic: the same page colours always give the same palette.
 *
 * The SVGs are ink line-art with a few flat fills, so each role gets a job:
 *
 * ink       – outlines, hair, solid garments. The body text colour itself,
 *             pushed to 4.5:1 only if the user picked something weaker.
 * primary   – large fills. Light pages take the fg hue so drawings echo the
 *             type; dark pages take the bg hue lifted toward the ink (light
 *             text colours go dull at mid lightness). Neutral pages stay
 *             monochrome.
 * secondary – the other large fills. The page's other hue when it is 60°+
 *             away, else a split-complement (strong hue) or a 45° step.
 *             Never within 40° of a coloured ink, so fills don't melt into
 *             the outlines drawn over them.
 * accent    – small marks (sparkles, dots). Fg hue when it stays clean,
 *             pushed inkward until tiny shapes clear 3:1 against the page.
 * highlight – glints drawn on top of ink and fills. Paper side of the page,
 *             ≥3:1 against the ink.
 * surface   – a quiet bg→primary tint for glows and backdrops.
 *
 * Fills sit between page and ink (about a third of the way on light pages,
 * lifted to a floor on dark ones), must lift off the page and let ink lines
 * read on top, and are pulled at least ΔE 0.1 apart. Hues that turn to mud
 * at fill lightness (dark yellows, limes, oranges) are skipped, or placed
 * above a light page as peach/cream instead. Chroma follows the page's
 * vividness, is capped by lightness, and is gamut-mapped into sRGB.
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
  const ink = oklchContrast(inkIn, bg) >= 4.5
    ? inkIn
    : nudge(inkIn, dir, (t) => oklchContrast(t, bg) >= 4.5);
  const gap = Math.abs(ink.l - bg.l);
  const at = (t: number) => bg.l + dir * gap * t;
  const darkPage = dir > 0;
  // On dark pages the ink is often only mid-light (orange, teal), which would
  // drag fills down into murk. Keep them lifted; hue keeps them off the ink.
  const fillL = (t: number) =>
    darkPage ? Math.max(at(t), Math.min(0.45 + 0.45 * t, at(0.85))) : at(t);

  const fgHue = fg.c >= CHROMATIC ? fg.h : null;
  const bgHue = bg.c >= CHROMATIC ? bg.h : null;
  const neutral = fg.c >= bg.c ? fg : bg;

  let tP = darkPage ? 0.6 : 0.36;
  let tS = darkPage ? 0.46 : 0.24;

  // Primary: on light pages the fg hue, so drawings echo the type. On dark
  // pages the text is a light colour that loses its character at mid
  // lightness, so the bg hue lifted toward the ink leads instead. Either way
  // a hue that turns to mud at fill lightness gives way to the other.
  const clean = (h: number | null, t: number): h is number =>
    h !== null && !isMuddy(h, fillL(t));
  const [first, second] = darkPage ? [bgHue, fgHue] : [fgHue, bgHue];
  let pH: number | null = clean(first, tP) ? first : clean(second, tP) ? second : first ?? second;
  // A vivid page gets vivid fills, whichever colour lent the hue
  const vivid = Math.max(fg.c, bg.c);
  const primaryC = pH === null ? neutral.c : Math.min(Math.max(0.04 + 0.6 * vivid, 0.06), 0.15);
  // Still muddy (an orange or mustard page with dark text): on a light page
  // lift the fill above the page instead, where warm hues turn to clean
  // peach and cream. Failing that, turn the hue the way a painter would:
  // toward amber or toward green, whichever is closer.
  const outside = !darkPage && pH !== null && isMuddy(pH, fillL(tP)) && bg.l <= 0.8;
  if (pH !== null && !outside) pH = unmuddy(pH, fillL(tP));

  // Secondary: the page's other hue when it sits far enough away; otherwise
  // a wide analogous step (a split-complement when the one hue is strong
  // enough to carry it). Candidates that turn to mud, or that would melt into
  // the ink outlines drawn over them, are skipped.
  let sH: number | null = null;
  const secondaryC = pH === null ? neutral.c : primaryC * 0.8;
  if (pH !== null) {
    const base = pH;
    const other = base === fgHue ? bgHue : fgHue;
    const away = (h: number) => Math.min(hueDistance(h, fg.h), hueDistance(h, bg.h));
    const candidates: number[] = [];
    if (other !== null && hueDistance(base, other) >= 60) candidates.push(mixHue(other, base, 0.2));
    for (const step of primaryC >= 0.1 ? [150, 45] : [45]) {
      candidates.push(...[(base + step) % 360, (base + 360 - step) % 360].sort((x, y) => away(y) - away(x)));
    }
    const nearInk = (h: number) => ink.c >= CHROMATIC && hueDistance(h, ink.h) < 40;
    sH = candidates.find((h) => !isMuddy(h, fillL(tS)) && !nearInk(h)) ?? base;
  }

  // Neutral palettes stay monochrome (keeping whatever faint tint they have),
  // so the fills need more lightness spread to read as two tones.
  if (pH === null) {
    tP = darkPage ? 0.72 : 0.5;
    tS = darkPage ? 0.4 : 0.22;
  }
  pH ??= neutral.h;
  sH ??= neutral.h;
  const fillOk = (t: Oklch) => oklchContrast(t, bg) >= 1.25 || deltaEOk(t, bg) >= 0.12;
  const inkReads = (t: Oklch) => oklchContrast(t, ink) >= 2 || deltaEOk(t, ink) >= 0.15;

  // Each fill must lift off the page and still let ink lines read on top
  let primary = tone(outside ? bg.l + 0.15 : fillL(tP), primaryC, pH);
  let secondary = tone(fillL(tS), secondaryC, sH);
  primary = nudge(primary, outside ? -dir : dir, fillOk);
  secondary = nudge(secondary, dir, fillOk);
  if (!outside) primary = nudge(primary, -dir, (t) => inkReads(t) || !fillOk(t));
  secondary = nudge(secondary, -dir, (t) => inkReads(t) || !fillOk(t));

  // Then pull the two fills apart: secondary backs off toward the page while
  // it still lifts off it, then primary moves inkward while ink still reads
  const MIN_FILL_DE = 0.1;
  for (let i = 0; i < 50 && deltaEOk(primary, secondary) < MIN_FILL_DE; i++) {
    const s2 = tone(secondary.l - dir * 0.01, secondaryC, sH);
    const p2 = tone(primary.l + dir * 0.01, primaryC, pH);
    if (fillOk(s2)) secondary = s2;
    else if (!outside && inkReads(p2)) primary = p2;
    else break;
  }

  // Small marks carry the text colour's hue whenever it stays clean
  const tA = darkPage ? 0.62 : 0.5;
  const aH = clean(fgHue, tA) ? fgHue : pH;
  const accent = nudge(
    tone(at(tA), primaryC * 1.15, aH),
    dir,
    (t) => oklchContrast(t, bg) >= 3
  );

  const highlight = nudge(
    tone(darkPage ? Math.min(bg.l, 0.24) : Math.max(bg.l, 0.93), Math.min(primaryC, 0.03), pH),
    -dir,
    (t) => oklchContrast(t, ink) >= 3
  );

  const surface = gamutMap(mixOklab(bg, primary, 0.14));

  return { ink, primary, secondary, accent, highlight, surface };
}

export type IllustrationPalette = Record<IllustrationRole, string>;

/** CSS `oklch()` strings for each illustration role. */
export function computeIllustrationPalette(
  backgroundColor: string,
  foregroundColor: string,
  inkColor: string = foregroundColor
): IllustrationPalette {
  const tones = computeIllustrationTones(backgroundColor, foregroundColor, inkColor);
  const out = {} as IllustrationPalette;
  for (const role of Object.keys(tones) as IllustrationRole[]) {
    const { l, c, h } = tones[role];
    out[role] = oklchToString(l, c, h);
  }
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
