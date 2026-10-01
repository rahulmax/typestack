import type { TypographyConfig } from "@/types/typography";
import { DEFAULT_CONFIG } from "@/data/default-config";

interface PresetDef {
  name: string;
  headingFont: string;
  headingWeight: number;
  bodyFont: string;
  bodyWeight: number;
  category: string;
}

const PRESETS: PresetDef[] = [
  // ——— Editorial: serif heading + sans body, magazine/newspaper feel ———
  { name: "Playfair Display + Fira Sans", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Fira Sans", bodyWeight: 400, category: "editorial" },
  { name: "Domine + Open Sans", headingFont: "Domine", headingWeight: 700, bodyFont: "Open Sans", bodyWeight: 400, category: "editorial" },
  { name: "Neuton + Lato", headingFont: "Neuton", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, category: "editorial" },
  { name: "Oswald + Source Serif 4", headingFont: "Oswald", headingWeight: 700, bodyFont: "Source Serif 4", bodyWeight: 400, category: "editorial" },
  { name: "Crimson Pro + DM Sans", headingFont: "Crimson Pro", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, category: "editorial" },
  { name: "Young Serif + Instrument Sans", headingFont: "Young Serif", headingWeight: 400, bodyFont: "Instrument Sans", bodyWeight: 400, category: "editorial" },
  { name: "DM Serif Display + IBM Plex Sans", headingFont: "DM Serif Display", headingWeight: 400, bodyFont: "IBM Plex Sans", bodyWeight: 400, category: "editorial" },
  { name: "PT Serif + Inter", headingFont: "PT Serif", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "editorial" },
  { name: "Rethink Sans + Spectral", headingFont: "Rethink Sans", headingWeight: 700, bodyFont: "Spectral", bodyWeight: 400, category: "editorial" },
  { name: "Newsreader + Inter", headingFont: "Newsreader", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "editorial" },
  { name: "Libre Caslon Text + Libre Franklin", headingFont: "Libre Caslon Text", headingWeight: 700, bodyFont: "Libre Franklin", bodyWeight: 400, category: "editorial" },
  { name: "Oswald + EB Garamond", headingFont: "Oswald", headingWeight: 700, bodyFont: "EB Garamond", bodyWeight: 400, category: "editorial" },

  // ——— Luxury: premium, Didone, fashion-inspired ———
  { name: "Playfair Display + Lato", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, category: "luxury" },
  { name: "Playfair Display + Montserrat", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Montserrat", bodyWeight: 400, category: "luxury" },
  { name: "Bodoni Moda + DM Sans", headingFont: "Bodoni Moda", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, category: "luxury" },
  { name: "Cormorant Garamond + Fira Sans", headingFont: "Cormorant Garamond", headingWeight: 600, bodyFont: "Fira Sans", bodyWeight: 400, category: "luxury" },

  // ——— Elegant: refined, thin, sophisticated ———
  { name: "Playfair Display + Work Sans", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Work Sans", bodyWeight: 400, category: "elegant" },
  { name: "Cormorant Infant + Assistant", headingFont: "Cormorant Infant", headingWeight: 700, bodyFont: "Assistant", bodyWeight: 400, category: "elegant" },
  { name: "Instrument Serif + Instrument Sans", headingFont: "Instrument Serif", headingWeight: 400, bodyFont: "Instrument Sans", bodyWeight: 400, category: "elegant" },
  { name: "Fraunces + Epilogue", headingFont: "Fraunces", headingWeight: 700, bodyFont: "Epilogue", bodyWeight: 400, category: "elegant" },
  { name: "Lora + Merriweather", headingFont: "Lora", headingWeight: 700, bodyFont: "Merriweather", bodyWeight: 400, category: "elegant" },

  // ——— Minimal: clean, restrained, geometric sans ———
  { name: "Montserrat + Arvo", headingFont: "Montserrat", headingWeight: 700, bodyFont: "Arvo", bodyWeight: 400, category: "minimal" },
  { name: "Roboto Slab + Roboto", headingFont: "Roboto Slab", headingWeight: 700, bodyFont: "Roboto", bodyWeight: 400, category: "minimal" },
  { name: "Inter + Krub", headingFont: "Inter", headingWeight: 700, bodyFont: "Krub", bodyWeight: 400, category: "minimal" },
  { name: "Instrument Sans + Geist", headingFont: "Instrument Sans", headingWeight: 600, bodyFont: "Geist", bodyWeight: 400, category: "minimal" },
  { name: "Montserrat + Karla", headingFont: "Montserrat", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, category: "minimal" },
  { name: "Inter + DM Sans", headingFont: "Inter", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, category: "minimal" },
  { name: "Figtree", headingFont: "Figtree", headingWeight: 700, bodyFont: "Figtree", bodyWeight: 400, category: "minimal" },
  { name: "Gabarito", headingFont: "Gabarito", headingWeight: 700, bodyFont: "Gabarito", bodyWeight: 400, category: "minimal" },
  { name: "Albert Sans + DM Sans", headingFont: "Albert Sans", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, category: "minimal" },

  // ——— Tech: geometric, monospace, digital native ———
  { name: "Space Mono + Plus Jakarta Sans", headingFont: "Space Mono", headingWeight: 700, bodyFont: "Plus Jakarta Sans", bodyWeight: 400, category: "tech" },
  { name: "Syne + Inter", headingFont: "Syne", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "tech" },
  { name: "Ubuntu + Rokkitt", headingFont: "Ubuntu", headingWeight: 700, bodyFont: "Rokkitt", bodyWeight: 400, category: "tech" },
  { name: "Ubuntu + Open Sans", headingFont: "Ubuntu", headingWeight: 700, bodyFont: "Open Sans", bodyWeight: 400, category: "tech" },
  { name: "Sora", headingFont: "Sora", headingWeight: 700, bodyFont: "Sora", bodyWeight: 400, category: "tech" },
  { name: "Manrope", headingFont: "Manrope", headingWeight: 700, bodyFont: "Manrope", bodyWeight: 400, category: "tech" },
  { name: "Funnel Display + Inter", headingFont: "Funnel Display", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "tech" },
  { name: "Space Grotesk + Spectral", headingFont: "Space Grotesk", headingWeight: 700, bodyFont: "Spectral", bodyWeight: 400, category: "tech" },
  { name: "JetBrains Mono + Inter", headingFont: "JetBrains Mono", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "tech" },

  // ——— Bold: high-impact display fonts, attention-grabbing ———
  { name: "Chonburi + Domine", headingFont: "Chonburi", headingWeight: 400, bodyFont: "Domine", bodyWeight: 400, category: "bold" },
  { name: "Fjalla One + Cantarell", headingFont: "Fjalla One", headingWeight: 400, bodyFont: "Cantarell", bodyWeight: 400, category: "bold" },
  { name: "Big Shoulders Display + Manrope", headingFont: "Big Shoulders Display", headingWeight: 700, bodyFont: "Manrope", bodyWeight: 400, category: "bold" },

  // ——— Warm: slab serifs, earthy, organic ———
  { name: "Merriweather Sans + Merriweather", headingFont: "Merriweather Sans", headingWeight: 700, bodyFont: "Merriweather", bodyWeight: 400, category: "warm" },
  { name: "Rokkitt + Inter", headingFont: "Rokkitt", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "warm" },
  { name: "Zilla Slab + Inter", headingFont: "Zilla Slab", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "warm" },
  { name: "Bitter + Raleway", headingFont: "Bitter", headingWeight: 700, bodyFont: "Raleway", bodyWeight: 400, category: "warm" },
  { name: "Literata + Karla", headingFont: "Literata", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, category: "warm" },

  // ——— Heritage: classic serifs, traditional typography ———
  { name: "Cinzel + Fauna One", headingFont: "Cinzel", headingWeight: 700, bodyFont: "Fauna One", bodyWeight: 400, category: "heritage" },
  { name: "Libre Baskerville + Source Sans 3", headingFont: "Libre Baskerville", headingWeight: 700, bodyFont: "Source Sans 3", bodyWeight: 400, category: "heritage" },
  { name: "Quattrocento + Quattrocento Sans", headingFont: "Quattrocento", headingWeight: 700, bodyFont: "Quattrocento Sans", bodyWeight: 400, category: "heritage" },

  // ——— Literary: book-inspired, reading-focused ———
  { name: "Alegreya Sans + Alegreya", headingFont: "Alegreya Sans", headingWeight: 700, bodyFont: "Alegreya", bodyWeight: 400, category: "literary" },
  { name: "Lora + Montserrat", headingFont: "Lora", headingWeight: 700, bodyFont: "Montserrat", bodyWeight: 400, category: "literary" },
  { name: "Vollkorn + Lato", headingFont: "Vollkorn", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, category: "literary" },
  { name: "Spectral + Karla", headingFont: "Spectral", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, category: "literary" },

  // ——— Corporate: professional, business-safe ———
  { name: "Raleway + Merriweather", headingFont: "Raleway", headingWeight: 700, bodyFont: "Merriweather", bodyWeight: 400, category: "corporate" },
  { name: "Roboto Serif + Instrument Sans", headingFont: "Roboto Serif", headingWeight: 700, bodyFont: "Instrument Sans", bodyWeight: 400, category: "corporate" },
  { name: "Lexend + Source Serif 4", headingFont: "Lexend", headingWeight: 700, bodyFont: "Source Serif 4", bodyWeight: 400, category: "corporate" },
  { name: "Albert Sans + Lora", headingFont: "Albert Sans", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, category: "corporate" },
  { name: "Montserrat + Crimson Text", headingFont: "Montserrat", headingWeight: 700, bodyFont: "Crimson Text", bodyWeight: 400, category: "corporate" },

  // ——— Creative: artistic, unusual, boundary-pushing ———
  { name: "Bricolage Grotesque", headingFont: "Bricolage Grotesque", headingWeight: 700, bodyFont: "Bricolage Grotesque", bodyWeight: 400, category: "creative" },
  { name: "DM Serif Display + Manrope", headingFont: "DM Serif Display", headingWeight: 400, bodyFont: "Manrope", bodyWeight: 400, category: "creative" },
  { name: "Unbounded + DM Sans", headingFont: "Unbounded", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, category: "creative" },
  { name: "Fraunces + Space Grotesk", headingFont: "Fraunces", headingWeight: 700, bodyFont: "Space Grotesk", bodyWeight: 400, category: "creative" },

  // ——— Adobe Fonts: kit CSS slugs, spread across the moods above ———
  // These only appear when every family is in the kit this deployment serves,
  // so the kit must carry each slug below for its preset to show. Keep them
  // listed in scripts/adobe-kit.ts and `pnpm kit:sync` adds them.
  { name: "Freight Display Pro + Proxima Nova", headingFont: "freight-display-pro", headingWeight: 700, bodyFont: "proxima-nova", bodyWeight: 400, category: "editorial" },
  { name: "Minion Pro + Myriad Pro", headingFont: "minion-pro", headingWeight: 700, bodyFont: "myriad-pro", bodyWeight: 400, category: "editorial" },
  { name: "IvyPresto Display + Neue Haas Grotesk Text", headingFont: "ivypresto-display", headingWeight: 400, bodyFont: "neue-haas-grotesk-text", bodyWeight: 400, category: "luxury" },
  { name: "IvyMode + Sofia Pro", headingFont: "ivymode", headingWeight: 400, bodyFont: "sofia-pro", bodyWeight: 400, category: "elegant" },
  { name: "Neue Haas Grotesk Display + Neue Haas Grotesk Text", headingFont: "neue-haas-grotesk-display", headingWeight: 600, bodyFont: "neue-haas-grotesk-text", bodyWeight: 400, category: "minimal" },
  { name: "Roc Grotesk + Acumin Pro", headingFont: "roc-grotesk", headingWeight: 700, bodyFont: "acumin-pro", bodyWeight: 400, category: "tech" },
  { name: "Degular Display + Degular", headingFont: "degular-display", headingWeight: 700, bodyFont: "degular", bodyWeight: 400, category: "bold" },
  { name: "Museo Slab + Museo Sans", headingFont: "museo-slab", headingWeight: 700, bodyFont: "museo-sans", bodyWeight: 300, category: "warm" },
  { name: "Adobe Garamond Pro + Brandon Grotesque", headingFont: "adobe-garamond-pro", headingWeight: 700, bodyFont: "brandon-grotesque", bodyWeight: 400, category: "heritage" },
  { name: "Freight Big Pro + Freight Text Pro", headingFont: "freight-big-pro", headingWeight: 600, bodyFont: "freight-text-pro", bodyWeight: 400, category: "literary" },
  { name: "Proxima Nova", headingFont: "proxima-nova", headingWeight: 700, bodyFont: "proxima-nova", bodyWeight: 400, category: "corporate" },
  { name: "P22 Mackinac Pro + Futura PT", headingFont: "p22-mackinac-pro", headingWeight: 700, bodyFont: "futura-pt", bodyWeight: 400, category: "creative" },
  { name: "Termina + Le Monde Livre Std", headingFont: "termina", headingWeight: 600, bodyFont: "le-monde-livre-std", bodyWeight: 400, category: "luxury" },
  { name: "Bodoni URW + Area Normal", headingFont: "bodoni-urw", headingWeight: 700, bodyFont: "area-normal", bodyWeight: 400, category: "elegant" },
  { name: "Kepler Std Display + Articulat CF", headingFont: "kepler-std-display", headingWeight: 500, bodyFont: "articulat-cf", bodyWeight: 400, category: "editorial" },
  { name: "Orpheus Pro + Halyard Text", headingFont: "orpheuspro", headingWeight: 400, bodyFont: "halyard-text", bodyWeight: 400, category: "elegant" },
  { name: "Mrs Eaves XL Serif + Aktiv Grotesk", headingFont: "mrs-eaves-xl-serif", headingWeight: 700, bodyFont: "aktiv-grotesk", bodyWeight: 400, category: "heritage" },
  { name: "Obviously + Tablet Gothic", headingFont: "obviously", headingWeight: 600, bodyFont: "tablet-gothic", bodyWeight: 400, category: "bold" },
  { name: "DIN 2014 + Nimbus Sans", headingFont: "din-2014", headingWeight: 700, bodyFont: "nimbus-sans", bodyWeight: 400, category: "tech" },
  { name: "Eurostile + Trade Gothic Next", headingFont: "eurostile", headingWeight: 700, bodyFont: "trade-gothic-next", bodyWeight: 400, category: "tech" },
  { name: "Forma DJR Display + Input Mono", headingFont: "forma-djr-display", headingWeight: 500, bodyFont: "input-mono", bodyWeight: 400, category: "tech" },
  { name: "Halyard Display + Halyard Text", headingFont: "halyard-display", headingWeight: 600, bodyFont: "halyard-text", bodyWeight: 400, category: "minimal" },

  // ——— Adobe Fonts, second batch: pairings seen on real sites via Typewolf ———
  // Fonts are named by the kit's CSS name, which isn't always the Adobe slug:
  // Le Monde Journal Std serves as "lemonde-journal", Sweet Sans Pro's slug is
  // ss-pro. `pnpm kit:sync` warns when a preset names a family the kit lacks.
  { name: "Franklin Gothic + Freight Text Pro", headingFont: "franklin-gothic", headingWeight: 700, bodyFont: "freight-text-pro", bodyWeight: 400, category: "editorial" },
  { name: "Tablet Gothic + Coranto 2", headingFont: "tablet-gothic", headingWeight: 700, bodyFont: "coranto-2", bodyWeight: 400, category: "editorial" },
  { name: "Aktiv Grotesk + Kepler Std", headingFont: "aktiv-grotesk", headingWeight: 700, bodyFont: "kepler-std", bodyWeight: 400, category: "literary" },
  { name: "Utopia Std Display + Acumin Pro", headingFont: "utopia-std-display", headingWeight: 600, bodyFont: "acumin-pro", bodyWeight: 400, category: "editorial" },
  { name: "Le Monde Journal Std + Le Monde Sans Std", headingFont: "lemonde-journal", headingWeight: 700, bodyFont: "lemonde-sans", bodyWeight: 400, category: "editorial" },
  { name: "Kepler Std Display + Neuzeit Grotesk", headingFont: "kepler-std-display", headingWeight: 400, bodyFont: "neuzeit-grotesk", bodyWeight: 400, category: "literary" },
  { name: "Linotype Sabon + Europa", headingFont: "linotype-sabon", headingWeight: 400, bodyFont: "europa", bodyWeight: 400, category: "literary" },
  { name: "Alverata + Adelle Sans", headingFont: "alverata", headingWeight: 500, bodyFont: "adelle-sans", bodyWeight: 400, category: "literary" },
  { name: "Mencken Std Head + Franklin Gothic", headingFont: "mencken-std-head", headingWeight: 700, bodyFont: "franklin-gothic", bodyWeight: 400, category: "editorial" },
  { name: "Mrs Eaves + Neue Haas Unica", headingFont: "mrs-eaves", headingWeight: 400, bodyFont: "neue-haas-unica", bodyWeight: 400, category: "literary" },
  { name: "Freight Display Pro + Europa", headingFont: "freight-display-pro", headingWeight: 500, bodyFont: "europa", bodyWeight: 400, category: "elegant" },
  { name: "Swear Display + Degular", headingFont: "swear-display", headingWeight: 400, bodyFont: "degular", bodyWeight: 400, category: "elegant" },
  { name: "Filosofia + Questa Sans", headingFont: "filosofia", headingWeight: 400, bodyFont: "questa-sans", bodyWeight: 400, category: "elegant" },
  { name: "Warnock Pro Display + Neue Haas Unica", headingFont: "warnock-pro-display", headingWeight: 600, bodyFont: "neue-haas-unica", bodyWeight: 400, category: "elegant" },
  { name: "Ambroise Std + Futura PT", headingFont: "ambroise-std", headingWeight: 400, bodyFont: "futura-pt", bodyWeight: 400, category: "luxury" },
  { name: "Orpheus Pro + Granville", headingFont: "orpheuspro", headingWeight: 400, bodyFont: "granville", bodyWeight: 400, category: "luxury" },
  { name: "Moret + Nimbus Sans", headingFont: "moret", headingWeight: 400, bodyFont: "nimbus-sans", bodyWeight: 400, category: "elegant" },
  { name: "Bodoni URW + Brandon Grotesque", headingFont: "bodoni-urw", headingWeight: 400, bodyFont: "brandon-grotesque", bodyWeight: 400, category: "luxury" },
  { name: "Berthold Baskerville Pro + Sweet Sans Pro", headingFont: "berthold-baskerville-pro", headingWeight: 400, bodyFont: "sweet-sans-pro", bodyWeight: 500, category: "luxury" },
  { name: "Quiche Display + Quiche Sans", headingFont: "quiche-display", headingWeight: 500, bodyFont: "quiche-sans", bodyWeight: 400, category: "elegant" },
  { name: "Plantin + Gill Sans Nova", headingFont: "plantin", headingWeight: 400, bodyFont: "gill-sans-nova", bodyWeight: 400, category: "heritage" },
  { name: "DIN 2014 + Plantin", headingFont: "din-2014", headingWeight: 700, bodyFont: "plantin", bodyWeight: 400, category: "tech" },
  { name: "Adobe Caslon Pro + P22 Underground", headingFont: "adobe-caslon-pro", headingWeight: 600, bodyFont: "p22-underground", bodyWeight: 400, category: "heritage" },
  { name: "Termina + Adobe Caslon Pro", headingFont: "termina", headingWeight: 800, bodyFont: "adobe-caslon-pro", bodyWeight: 400, category: "creative" },
  { name: "Trade Gothic Next + FF Meta Serif Pro", headingFont: "trade-gothic-next", headingWeight: 700, bodyFont: "ff-meta-serif-web-pro", bodyWeight: 500, category: "corporate" },
  { name: "Cooper Black Std + Sofia Pro", headingFont: "cooper-black-std", headingWeight: 400, bodyFont: "sofia-pro", bodyWeight: 400, category: "warm" },
  { name: "Freight Big Pro + Soleil", headingFont: "freight-big-pro", headingWeight: 600, bodyFont: "soleil", bodyWeight: 400, category: "warm" },
  { name: "Chaparral Pro Display + Gibson", headingFont: "chaparral-pro-display", headingWeight: 600, bodyFont: "canada-type-gibson", bodyWeight: 400, category: "warm" },
  { name: "Calluna + Calluna Sans", headingFont: "calluna", headingWeight: 700, bodyFont: "calluna-sans", bodyWeight: 400, category: "warm" },
  { name: "ITC Avant Garde Gothic Pro + Neuzeit Grotesk", headingFont: "itc-avant-garde-gothic-pro", headingWeight: 600, bodyFont: "neuzeit-grotesk", bodyWeight: 400, category: "minimal" },
  { name: "Shift + Fort", headingFont: "shift", headingWeight: 700, bodyFont: "fort", bodyWeight: 400, category: "creative" },
  { name: "Sofia Pro + Calluna", headingFont: "sofia-pro", headingWeight: 700, bodyFont: "calluna", bodyWeight: 400, category: "warm" },
  { name: "ITC Benguiat + ITC Avant Garde Gothic Pro", headingFont: "itc-benguiat", headingWeight: 700, bodyFont: "itc-avant-garde-gothic-pro", bodyWeight: 300, category: "creative" },
  { name: "Futura PT + Adelle", headingFont: "futura-pt", headingWeight: 700, bodyFont: "adelle", bodyWeight: 400, category: "creative" },
  { name: "Bookmania + Soleil", headingFont: "bookmania", headingWeight: 700, bodyFont: "soleil", bodyWeight: 400, category: "creative" },
  { name: "Antique Olive + Degular", headingFont: "antique-olive", headingWeight: 700, bodyFont: "degular", bodyWeight: 400, category: "bold" },
  { name: "Tablet Gothic + Jubilat", headingFont: "tablet-gothic", headingWeight: 800, bodyFont: "jubilat", bodyWeight: 400, category: "bold" },
  { name: "Filosofia + Interstate", headingFont: "filosofia", headingWeight: 700, bodyFont: "interstate", bodyWeight: 400, category: "heritage" },
  { name: "Span + Sweet Sans Pro", headingFont: "span", headingWeight: 700, bodyFont: "sweet-sans-pro", bodyWeight: 500, category: "creative" },
  { name: "Roc Grotesk + Mencken Std Text", headingFont: "roc-grotesk", headingWeight: 700, bodyFont: "mencken-std-text", bodyWeight: 400, category: "bold" },

  // ——— Fontsource: families Google doesn't carry, from src/data/fontsource-fonts.ts ———
  // Weights must be ones the family ships; Bluu Next is 700 only.
  { name: "Redaction 70 + Uncut Sans", headingFont: "Redaction 70", headingWeight: 700, bodyFont: "Uncut Sans", bodyWeight: 400, category: "editorial" },
  { name: "Libre Caslon Condensed + Open Sauce Sans", headingFont: "Libre Caslon Condensed", headingWeight: 600, bodyFont: "Open Sauce Sans", bodyWeight: 400, category: "editorial" },
  { name: "Pitagon Serif + Pitagon Sans Text", headingFont: "Pitagon Serif", headingWeight: 600, bodyFont: "Pitagon Sans Text", bodyWeight: 400, category: "literary" },
  { name: "Iosevka Etoile + Adwaita Sans", headingFont: "Iosevka Etoile", headingWeight: 600, bodyFont: "Adwaita Sans", bodyWeight: 400, category: "literary" },
  { name: "Geist Sans + Iosevka Aile", headingFont: "Geist Sans", headingWeight: 600, bodyFont: "Iosevka Aile", bodyWeight: 400, category: "tech" },
  { name: "Monaspace Xenon + Monaspace Neon", headingFont: "Monaspace Xenon", headingWeight: 500, bodyFont: "Monaspace Neon", bodyWeight: 400, category: "tech" },
  { name: "Cooper Hewitt + Redaction", headingFont: "Cooper Hewitt", headingWeight: 700, bodyFont: "Redaction", bodyWeight: 400, category: "creative" },
  { name: "Apfel Grotezk + iA Writer Duo", headingFont: "Apfel Grotezk", headingWeight: 700, bodyFont: "iA Writer Duo", bodyWeight: 400, category: "creative" },
  { name: "Blackout Midnight + Commit Mono", headingFont: "Blackout Midnight", headingWeight: 400, bodyFont: "Commit Mono", bodyWeight: 400, category: "creative" },
  { name: "Metropolis + iA Writer Quattro", headingFont: "Metropolis", headingWeight: 800, bodyFont: "iA Writer Quattro", bodyWeight: 400, category: "minimal" },
  { name: "Junction + Argentum Sans", headingFont: "Junction", headingWeight: 700, bodyFont: "Argentum Sans", bodyWeight: 400, category: "minimal" },
  { name: "Norwester + DejaVu Serif", headingFont: "Norwester", headingWeight: 400, bodyFont: "DejaVu Serif", bodyWeight: 400, category: "bold" },
  { name: "Bluu Next + Clear Sans", headingFont: "Bluu Next", headingWeight: 700, bodyFont: "Clear Sans", bodyWeight: 400, category: "heritage" },
  { name: "Hauora Sans + Nebula Sans", headingFont: "Hauora Sans", headingWeight: 700, bodyFont: "Nebula Sans", bodyWeight: 400, category: "corporate" },
  { name: "Open Runde + Pretendard", headingFont: "Open Runde", headingWeight: 600, bodyFont: "Pretendard", bodyWeight: 400, category: "warm" },
  { name: "Bagnard + Bagnard Sans", headingFont: "Bagnard", headingWeight: 400, bodyFont: "Bagnard Sans", bodyWeight: 400, category: "elegant" },
  { name: "Redaction 35 + Aileron", headingFont: "Redaction 35", headingWeight: 400, bodyFont: "Aileron", bodyWeight: 400, category: "luxury" },
];

export function buildPresetConfig(preset: PresetDef): TypographyConfig {
  return {
    ...DEFAULT_CONFIG,
    headingsGroup: {
      ...DEFAULT_CONFIG.headingsGroup,
      fontFamily: preset.headingFont,
      fontWeight: preset.headingWeight,
    },
    bodyGroup: {
      ...DEFAULT_CONFIG.bodyGroup,
      fontFamily: preset.bodyFont,
      fontWeight: preset.bodyWeight,
    },
  };
}

export { PRESETS };
export type { PresetDef };
