import type { FontCategory } from "./google-fonts";

/** Where a family's webfont files come from. */
export type FontSource = "google" | "adobe";

/**
 * A font the picker can offer, normalized across sources. Google families are
 * title-cased with spaces ("Proxima Nova"); Adobe families are the kit's CSS
 * slug ("proxima-nova"), so the two namespaces never collide and a family
 * string alone is enough to resolve its source.
 */
export interface FontOption {
  family: string;
  /** Human-readable name for display. The family string stays the CSS identifier. */
  label: string;
  category: FontCategory;
  source: FontSource;
  /** Weights the source can actually serve, ascending. */
  weights: number[];
}

/** One @font-face in an Adobe web project kit. */
export interface AdobeFace {
  family: string;
  weight: number;
  style: "normal" | "italic";
  /** Kit URL template, with a `{format}` placeholder and a query template. */
  src: string;
  primer: string;
}

/** The parsed contents of an Adobe Fonts web project. */
export interface AdobeKit {
  id: string;
  families: FontOption[];
  faces: AdobeFace[];
}
