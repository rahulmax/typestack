import type { GridPatternType } from "@/store/ui-store";
import { isBgDark } from "./color-utils";

/**
 * Returns an inline SVG data-URL for the chosen grid pattern.
 * Stroke/fill adapts to light vs dark backgrounds.
 */
export function getGridPatternUrl(
  pattern: GridPatternType,
  backgroundColor: string
): string | null {
  if (pattern === null) return null;

  const dark = isBgDark(backgroundColor);
  const stroke = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const fill = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  let svg: string;

  switch (pattern) {
    case "square":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="none" stroke="${stroke}" stroke-width="1"/></svg>`;
      break;
    case "dots":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="1.5" fill="${fill}"/></svg>`;
      break;
    case "plus":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M16 10v12M10 16h12" stroke="${stroke}" stroke-width="1" fill="none"/></svg>`;
      break;
    case "tallrect":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="48"><rect width="28" height="48" fill="none" stroke="${stroke}" stroke-width="1"/></svg>`;
      break;
  }

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
