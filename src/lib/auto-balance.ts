import type { FontMetrics } from "./font-metrics";

export interface BalancedValues {
  lineHeight: number;
  letterSpacing: number;  // em
  wordSpacing: number;    // em
  suggestedWeight: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function computeAutoBalance(
  metrics: FontMetrics,
  fontSize: number,
  baseFontSize: number,
  scaleRatio: number,
  isDarkMode: boolean,
  isUppercase: boolean,
  baseWeight: number,
  isBody: boolean,
): BalancedValues {
  const sizeRatio = fontSize / baseFontSize;

  // --- Line-height ---
  // Inversely proportional to size, adjusted by x-height
  const rawLH = 1 + (0.6 / Math.max(sizeRatio, 0.5));
  const xHeightAdjust = metrics.xHeight * 0.15;
  let lineHeight: number;
  if (isBody) {
    lineHeight = clamp(rawLH + xHeightAdjust, 1.4, 1.8);
  } else {
    // Headings get progressively tighter as size increases
    // Display sizes (sizeRatio > 4) can go as low as 0.9
    const headingLH = rawLH + xHeightAdjust - 0.04 * Math.max(0, sizeRatio - 2);
    const minLH = sizeRatio > 4 ? 0.9 : sizeRatio > 2 ? 0.95 : 1.0;
    lineHeight = clamp(headingLH, minLH, 1.25);
  }

  // --- Letter-spacing ---
  // Negative for large text, loosened for small text
  // Cap-height ratio adjusts: wider caps need more tracking
  const capRatio = metrics.capHeight / 0.7;
  let letterSpacing = -0.02 * Math.log2(Math.max(sizeRatio, 0.25)) * capRatio;

  // Extra tightening for wide scale ratios
  if (scaleRatio > 1.333 && sizeRatio > 2) {
    letterSpacing -= 0.005;
  }

  // Uppercase compensation
  if (isUppercase) {
    letterSpacing += 0.04 * metrics.capHeight;
  }

  letterSpacing = clamp(letterSpacing, -0.05, 0.05);

  // --- Word-spacing ---
  const wordSpacing = clamp(
    -0.01 * Math.max(0, Math.log2(sizeRatio) - 1),
    -0.03,
    0,
  );

  // --- Font-weight optical adjustment ---
  const weightDelta = isDarkMode ? -100 : 0;
  const suggestedWeight = clamp(baseWeight + weightDelta, 100, 900);

  return {
    lineHeight: Math.round(lineHeight * 100) / 100,
    letterSpacing: Math.round(letterSpacing * 1000) / 1000,
    wordSpacing: Math.round(wordSpacing * 1000) / 1000,
    suggestedWeight,
  };
}
