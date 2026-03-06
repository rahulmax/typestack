import type { GridPattern } from "@/store/ui-store";
import { isBgDark } from "./color-utils";

export function getGridPatternUrl(
  pattern: GridPattern,
  backgroundColor: string
): string | null {
  if (pattern === null) return null;
  const variant = isBgDark(backgroundColor) ? "dark" : "light";
  return `/grids/v3-grid-${pattern}-${variant}.png`;
}
