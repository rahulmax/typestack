import type { TypographyElement } from "@/types/typography";

export type ElementDefaults = {
  letterSpacing?: number;
  textTransform?: string;
};

/**
 * Per-element baselines applied after the group properties and before user overrides.
 *
 * These live in code rather than in DEFAULT_CONFIG.overrides because normalizeConfig
 * replaces the stored overrides map wholesale — a default placed there would only ever
 * reach first-time visitors, and could never be cleared once set.
 */
export const ELEMENT_DEFAULTS: Partial<Record<TypographyElement, ElementDefaults>> = {
  // 0.08em sits inside Butterick's 5–12% band for letterspaced caps
  eyebrow: { letterSpacing: 0.08, textTransform: "uppercase" },
};
