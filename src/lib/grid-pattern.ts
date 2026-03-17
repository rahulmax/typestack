import type { GridPatternType } from "@/store/ui-store";
import { isBgDark } from "./color-utils";

/**
 * Returns an inline SVG data-URL for the chosen grid pattern.
 * Stroke/fill adapts to light vs dark backgrounds.
 */
export function getGridPatternUrl(
  pattern: GridPatternType,
  backgroundColor: string,
  rotation: number = 0,
  opacity: number = 100,
  spacing: number = 0
): string | null {
  if (pattern === null) return null;

  const dark = isBgDark(backgroundColor);
  const a = opacity / 100;
  const stroke = dark ? `rgba(255,255,255,${0.07 * a})` : `rgba(0,0,0,${0.06 * a})`;
  const fill = dark ? `rgba(255,255,255,${0.07 * a})` : `rgba(0,0,0,${0.06 * a})`;

  let inner: string;
  let w: number;
  let h: number;

  switch (pattern) {
    case "square":
      w = 40; h = 40;
      inner = `<rect width="40" height="40" fill="none" stroke="${stroke}" stroke-width="1"/>`;
      break;
    case "dots":
      w = 24; h = 24;
      inner = `<circle cx="12" cy="12" r="1.5" fill="${fill}"/>`;
      break;
    case "plus":
      w = 32; h = 32;
      inner = `<path d="M16 10v12M10 16h12" stroke="${stroke}" stroke-width="1" fill="none"/>`;
      break;
    case "tallrect":
      w = 28; h = 48;
      inner = `<rect width="28" height="48" fill="none" stroke="${stroke}" stroke-width="1"/>`;
      break;
    case "diagonal":
      w = 16; h = 16;
      inner = `<path d="M-4 4l8-8M0 16l16-16M12 20l8-8" stroke="${stroke}" stroke-width="1" fill="none"/>`;
      break;
    case "crosshatch":
      w = 16; h = 16;
      inner = `<path d="M-4 4l8-8M0 16l16-16M12 20l8-8M20 4l-8-8M16 16L0-0M4 20l-8-8" stroke="${stroke}" stroke-width="1" fill="none"/>`;
      break;
    case "hlines":
      w = 16; h = 12;
      inner = `<line x1="0" y1="11.5" x2="16" y2="11.5" stroke="${stroke}" stroke-width="1"/>`;
      break;
    case "diamond":
      w = 32; h = 32;
      inner = `<path d="M16 0l16 16-16 16L0 16z" fill="none" stroke="${stroke}" stroke-width="1"/>`;
      break;
  }

  const sw = w + spacing;
  const sh = h + spacing;
  const ox = spacing / 2;
  const oy = spacing / 2;
  const transform = rotation !== 0
    ? ` transform="translate(${ox},${oy}) rotate(${rotation} ${w / 2} ${h / 2})"`
    : spacing !== 0 ? ` transform="translate(${ox},${oy})"` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}"><g${transform}>${inner}</g></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
