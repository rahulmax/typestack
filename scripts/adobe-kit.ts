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

    // Elegant and fancy: extended display grotesks, Didones, refined serifs.
    "ambroise-std",
    "area-normal",
    "articulat-cf",
    "bodoni-urw",
    "kepler-std-display",
    "le-monde-livre-std",
    "mrs-eaves-xl-serif",
    "obviously",
    "orpheus-pro",
    "termina",

    // Tech and engineered: DIN, geometric and technical grotesks, a mono.
    "aktiv-grotesk",
    "din-2014",
    "eurostile",
    "forma-djr-display",
    "halyard-display",
    "halyard-text",
    "input-mono",
    "neue-kabel",
    "nimbus-sans",
    "tablet-gothic",
    "trade-gothic-next",

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

    // The second batch of Adobe presets: pairings seen on real sites via
    // Typewolf, across editorial, luxury, heritage, warm and retro moods.
    "adelle",
    "adelle-sans",
    "adobe-caslon-pro",
    "alverata",
    "antique-olive",
    "berthold-baskerville-pro",
    "bookmania",
    "calluna",
    "calluna-sans",
    "canada-type-gibson",
    "chaparral-pro-display",
    "cooper-black-std",
    "coranto-2",
    "europa",
    "ff-meta-serif-pro",
    "filosofia",
    "fort",
    "franklin-gothic",
    "gill-sans-nova",
    "granville",
    "interstate",
    "itc-avant-garde-gothic-pro",
    "itc-benguiat",
    "jubilat",
    "kepler-std",
    "le-monde-journal-std",
    "le-monde-sans-std",
    "linotype-sabon",
    "mencken-std-head",
    "mencken-std-text",
    "moret",
    "mrs-eaves",
    "neue-haas-unica",
    "neuzeit-grotesk",
    "p22-underground",
    "plantin",
    "questa-sans",
    "quiche-display",
    "quiche-sans",
    "shift",
    "soleil",
    "span",
    "ss-pro",
    "swear-display",
    "utopia-std-display",
    "warnock-pro-display",
  ],
};
