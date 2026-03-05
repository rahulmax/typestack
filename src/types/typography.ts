export type TypographyElement = "display-1" | "display-2" | "display-3" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "eyebrow" | "small";

export const DISPLAY_ELEMENTS: TypographyElement[] = ["display-1", "display-2", "display-3"];
export const HEADING_ELEMENTS: TypographyElement[] = ["h1", "h2", "h3", "h4", "h5", "h6"];
export const BODY_ELEMENTS: TypographyElement[] = ["p", "eyebrow", "small"];
export const ALL_ELEMENTS: TypographyElement[] = [...DISPLAY_ELEMENTS, ...HEADING_ELEMENTS, ...BODY_ELEMENTS];

/** Elements that are off by default and require the user to enable them. */
export const OPTIONAL_ELEMENTS: TypographyElement[] = ["display-1", "display-2", "display-3"];

export const SCALE_POSITIONS: Record<TypographyElement, number> = {
  "display-1": 9,
  "display-2": 8,
  "display-3": 7,
  h1: 6,
  h2: 5,
  h3: 4,
  h4: 3,
  h5: 2,
  h6: 1,
  p: 0,
  eyebrow: -0.5,
  small: -1,
};

export interface GroupProperties {
  fontFamily: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number; // em
  wordSpacing: number; // em
  color: string; // hex
}

export interface ElementOverride extends Partial<GroupProperties> {
  isOverridden: boolean;
  textTransform?: string; // "none" | "uppercase"
}

export interface MobileConfig {
  baseFontSize: number;
  scaleRatio: number;
  breakpointWidth: number;
}

export interface ScaleRatioPreset {
  name: string;
  value: number;
  label: string;
}

export interface TypographyConfig {
  baseFontSize: number; // px (desktop)
  scaleRatioPreset: string; // preset name or "custom"
  scaleRatio: number;
  headingsGroup: GroupProperties;
  bodyGroup: GroupProperties;
  overrides: Record<TypographyElement, ElementOverride>;
  mobile: MobileConfig;
  backgroundColor: string;
  sampleText: string;
}

export interface ResolvedElementStyle {
  element: TypographyElement;
  fontSize: number; // px
  fontSizeRem: number; // rem
  fontFamily: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  color: string;
  textTransform: string;
}
