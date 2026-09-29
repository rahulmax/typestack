/**
 * The families the Adobe Fonts web project should serve. `pnpm kit:sync` makes
 * the kit match this file, so add families here rather than on fonts.adobe.com.
 *
 * A family is its slug from the fonts.adobe.com URL ("sofia-pro") or its name
 * ("Sofia Pro"). Pass an object to give one family its own styles.
 */

export type KitFamilyEntry = string | { family: string; variations: string[] };

export interface AdobeKitConfig {
  /**
   * Styles as font variation descriptions: `n4` is upright 400, `i7` italic 700.
   * Styles a family lacks are skipped, except that a missing italic falls back
   * to the family's nearest one -- Museo has no 400, so `i4` becomes `i3`.
   */
  variations: string[];
  families: KitFamilyEntry[];
}

export const ADOBE_KIT: AdobeKitConfig = {
  // Every upright weight for the weight controls, plus one italic for quotes.
  variations: ["n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "i4"],

  families: [
    "manifold-extd-cf",

    // Used by the Adobe presets in src/db/seed-presets.ts, which only show when
    // every family they name is in the kit.
    "acumin-pro",
    "adobe-garamond-pro",
    "brandon-grotesque",
    "degular",
    "degular-display",
    "freight-big-pro",
    "freight-display-pro",
    "freight-text-pro",
    "futura-pt",
    "ivymode",
    "ivypresto-display",
    "minion-pro",
    "museo-sans",
    "museo-slab",
    "myriad-pro",
    "neue-haas-grotesk-display",
    "neue-haas-grotesk-text",
    "p22-mackinac-pro",
    "proxima-nova",
    "roc-grotesk",
    "sofia-pro",
  ],
};
