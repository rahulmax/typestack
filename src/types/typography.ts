export type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "small";

export const HEADING_ELEMENTS: TypographyElement[] = ["h1", "h2", "h3", "h4", "h5", "h6"];
export const BODY_ELEMENTS: TypographyElement[] = ["p", "small"];
export const ALL_ELEMENTS: TypographyElement[] = [...HEADING_ELEMENTS, ...BODY_ELEMENTS];

export const SCALE_POSITIONS: Record<TypographyElement, number> = {
  h1: 6,
  h2: 5,
  h3: 4,
  h4: 3,
  h5: 2,
  h6: 1,
  p: 0,
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
