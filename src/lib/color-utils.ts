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

function contrastRatio(
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

function blendRgb(
  from: [number, number, number],
  to: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(from[0] + (to[0] - from[0]) * t),
    Math.round(from[1] + (to[1] - from[1]) * t),
    Math.round(from[2] + (to[2] - from[2]) * t),
  ];
}

function oklchToRgb(
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

  const lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  return [
    Math.max(0, Math.min(255, Math.round(linearToSrgb(lr) * 255))),
    Math.max(0, Math.min(255, Math.round(linearToSrgb(lg) * 255))),
    Math.max(0, Math.min(255, Math.round(linearToSrgb(lb) * 255))),
  ];
}

function oklchToString(l: number, c: number, h: number): string {
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
}

function ensureContrast(
  lch: { l: number; c: number; h: number },
  bgRgb: [number, number, number],
  isDark: boolean,
  minCR: number
): { l: number; c: number; h: number } {
  const result = { ...lch };
  for (let i = 0; i < 100; i++) {
    const rgb = oklchToRgb(result.l, result.c, result.h);
    if (contrastRatio(rgb, bgRgb) >= minCR) return result;
    result.l += isDark ? 0.01 : -0.01;
    result.l = Math.max(0, Math.min(1, result.l));
  }
  return result;
}

/**
 * Compute three SVG fill tones derived from the foreground color, using
 * analogous hue shifts in OKLCH. Each tone is contrast-verified against
 * the background at a minimum 1.3:1 ratio.
 *
 * tone1 – outlines/strokes (foreground-derived)
 * tone2 – accent (+30° hue shift)
 * tone3 – accent (−30° hue shift)
 */
export function computeSceneTones(
  backgroundColor: string,
  foregroundColor: string
): {
  tone1: string;
  tone2: string;
  tone3: string;
} {
  const bgRgb = hexToRgb(backgroundColor);
  const bgLum = relativeLuminance(...bgRgb);
  const isDark = bgLum <= 0.4;

  const fg = hexToOklch(foregroundColor);
  const bg = hexToOklch(backgroundColor);

  const MIN_CR = 1.3;

  let t1: { l: number; c: number; h: number };
  let t2: { l: number; c: number; h: number };
  let t3: { l: number; c: number; h: number };

  if (isDark) {
    t1 = { l: Math.max(fg.l, 0.85), c: Math.max(fg.c, 0.04), h: fg.h };
    const accentL = Math.max(fg.l * 0.8, 0.65);
    const accentC = Math.max(fg.c * 0.7, 0.05);
    t2 = { l: accentL, c: accentC, h: (fg.h + 30) % 360 };
    t3 = { l: accentL, c: accentC, h: (fg.h - 30 + 360) % 360 };
  } else {
    const subtleL = fg.l + (bg.l - fg.l) * 0.5;
    const subtleC = fg.c * 0.5;
    t1 = { l: subtleL, c: subtleC, h: fg.h };
    t2 = { l: subtleL, c: subtleC * 0.8, h: (fg.h + 30) % 360 };
    t3 = { l: subtleL, c: subtleC * 0.8, h: (fg.h - 30 + 360) % 360 };
  }

  t1 = ensureContrast(t1, bgRgb, isDark, MIN_CR);
  t2 = ensureContrast(t2, bgRgb, isDark, MIN_CR);
  t3 = ensureContrast(t3, bgRgb, isDark, MIN_CR);

  return {
    tone1: oklchToString(t1.l, t1.c, t1.h),
    tone2: oklchToString(t2.l, t2.c, t2.h),
    tone3: oklchToString(t3.l, t3.c, t3.h),
  };
}

export function generateRandomColorPair(): { fg: string; bg: string } {
  const MAX_ATTEMPTS = 50;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const hue = Math.random() * 360;
    const chroma = 0.05 + Math.random() * 0.10;

    const lightL = 0.85 + Math.random() * 0.10;
    const darkL = 0.15 + Math.random() * 0.15;

    const lightHex = oklchToHex(lightL, chroma, hue);
    const darkHex = oklchToHex(darkL, chroma, hue);

    const lightRgb = hexToRgb(lightHex);
    const darkRgb = hexToRgb(darkHex);

    const ratio = contrastRatio(lightRgb, darkRgb);
    if (ratio >= 4.5) {
      if (Math.random() > 0.5) {
        return { fg: darkHex, bg: lightHex };
      } else {
        return { fg: lightHex, bg: darkHex };
      }
    }
  }

  return { fg: "#1a1a2e", bg: "#e8e8f0" };
}
