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
  { name: "Source Serif Pro + Source Sans Pro", headingFont: "Source Serif Pro", headingWeight: 700, bodyFont: "Source Sans Pro", bodyWeight: 400, category: "editorial" },
  { name: "Neuton + Lato", headingFont: "Neuton", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, category: "editorial" },
  { name: "Abril Fatface + Lato", headingFont: "Abril Fatface", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, category: "editorial" },
  { name: "Oswald + Source Serif 4", headingFont: "Oswald", headingWeight: 700, bodyFont: "Source Serif 4", bodyWeight: 400, category: "editorial" },
  { name: "Source Sans Pro + Alegreya", headingFont: "Source Sans Pro", headingWeight: 700, bodyFont: "Alegreya", bodyWeight: 400, category: "editorial" },
  { name: "Rufina + Average Sans", headingFont: "Rufina", headingWeight: 700, bodyFont: "Average Sans", bodyWeight: 400, category: "editorial" },
  { name: "Crimson Pro + DM Sans", headingFont: "Crimson Pro", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, category: "editorial" },
  { name: "Young Serif + Instrument Sans", headingFont: "Young Serif", headingWeight: 400, bodyFont: "Instrument Sans", bodyWeight: 400, category: "editorial" },
  { name: "Darker Grotesque", headingFont: "Darker Grotesque", headingWeight: 700, bodyFont: "Darker Grotesque", bodyWeight: 400, category: "editorial" },
  { name: "DM Serif Display + IBM Plex Sans", headingFont: "DM Serif Display", headingWeight: 400, bodyFont: "IBM Plex Sans", bodyWeight: 400, category: "editorial" },
  { name: "PT Serif + Inter", headingFont: "PT Serif", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "editorial" },
  { name: "Rethink Sans + Spectral", headingFont: "Rethink Sans", headingWeight: 700, bodyFont: "Spectral", bodyWeight: 400, category: "editorial" },
  { name: "Newsreader + Inter", headingFont: "Newsreader", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "editorial" },
  { name: "Noto Serif Display + Be Vietnam Pro", headingFont: "Noto Serif Display", headingWeight: 700, bodyFont: "Be Vietnam Pro", bodyWeight: 400, category: "editorial" },
  { name: "Libre Caslon Text + Libre Franklin", headingFont: "Libre Caslon Text", headingWeight: 700, bodyFont: "Libre Franklin", bodyWeight: 400, category: "editorial" },

  // ——— Luxury: premium, Didone, fashion-inspired ———
  { name: "Unica One + Crimson Text", headingFont: "Unica One", headingWeight: 400, bodyFont: "Crimson Text", bodyWeight: 400, category: "luxury" },
  { name: "Playfair Display + Lato", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, category: "luxury" },
  { name: "Poiret One + Montserrat", headingFont: "Poiret One", headingWeight: 400, bodyFont: "Montserrat", bodyWeight: 400, category: "luxury" },
  { name: "Playfair Display + Montserrat", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Montserrat", bodyWeight: 400, category: "luxury" },
  { name: "Bodoni Moda + DM Sans", headingFont: "Bodoni Moda", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, category: "luxury" },
  { name: "Cormorant Garamond + Fira Sans", headingFont: "Cormorant Garamond", headingWeight: 600, bodyFont: "Fira Sans", bodyWeight: 400, category: "luxury" },

  // ——— Elegant: refined, thin, sophisticated ———
  { name: "Rosario + Crimson Text", headingFont: "Rosario", headingWeight: 700, bodyFont: "Crimson Text", bodyWeight: 400, category: "elegant" },
  { name: "Grand Hotel + Lato", headingFont: "Grand Hotel", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, category: "elegant" },
  { name: "Yeseva One + Josefin Sans", headingFont: "Yeseva One", headingWeight: 400, bodyFont: "Josefin Sans", bodyWeight: 400, category: "elegant" },
  { name: "Playfair Display + Work Sans", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Work Sans", bodyWeight: 400, category: "elegant" },
  { name: "Cormorant Infant + Assistant", headingFont: "Cormorant Infant", headingWeight: 700, bodyFont: "Assistant", bodyWeight: 400, category: "elegant" },
  { name: "Italiana + Bellota Text", headingFont: "Italiana", headingWeight: 400, bodyFont: "Bellota Text", bodyWeight: 400, category: "elegant" },
  { name: "Instrument Serif + Instrument Sans", headingFont: "Instrument Serif", headingWeight: 400, bodyFont: "Instrument Sans", bodyWeight: 400, category: "elegant" },
  { name: "Fraunces + Epilogue", headingFont: "Fraunces", headingWeight: 700, bodyFont: "Epilogue", bodyWeight: 400, category: "elegant" },

  // ——— Minimal: clean, restrained, geometric sans ———
  { name: "Montserrat + Arvo", headingFont: "Montserrat", headingWeight: 700, bodyFont: "Arvo", bodyWeight: 400, category: "minimal" },
  { name: "Roboto Slab + Roboto", headingFont: "Roboto Slab", headingWeight: 700, bodyFont: "Roboto", bodyWeight: 400, category: "minimal" },
  { name: "Inter + Krub", headingFont: "Inter", headingWeight: 700, bodyFont: "Krub", bodyWeight: 400, category: "minimal" },
  { name: "Instrument Sans + Geist", headingFont: "Instrument Sans", headingWeight: 600, bodyFont: "Geist", bodyWeight: 400, category: "minimal" },
  { name: "Montserrat + Karla", headingFont: "Montserrat", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, category: "minimal" },
  { name: "Inter + DM Sans", headingFont: "Inter", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, category: "minimal" },
  { name: "Outfit + Poppins", headingFont: "Outfit", headingWeight: 700, bodyFont: "Poppins", bodyWeight: 400, category: "minimal" },
  { name: "Figtree", headingFont: "Figtree", headingWeight: 700, bodyFont: "Figtree", bodyWeight: 400, category: "minimal" },
  { name: "Rubik", headingFont: "Rubik", headingWeight: 700, bodyFont: "Rubik", bodyWeight: 400, category: "minimal" },
  { name: "Gruppo + Comfortaa", headingFont: "Gruppo", headingWeight: 400, bodyFont: "Comfortaa", bodyWeight: 400, category: "minimal" },
  { name: "Gabarito", headingFont: "Gabarito", headingWeight: 700, bodyFont: "Gabarito", bodyWeight: 400, category: "minimal" },
  { name: "Poppins", headingFont: "Poppins", headingWeight: 700, bodyFont: "Poppins", bodyWeight: 400, category: "minimal" },
  { name: "Sintony + Poppins", headingFont: "Sintony", headingWeight: 700, bodyFont: "Poppins", bodyWeight: 400, category: "minimal" },
  { name: "Albert Sans + DM Sans", headingFont: "Albert Sans", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, category: "minimal" },

  // ——— Tech: geometric, monospace, digital native ———
  { name: "Space Mono + Plus Jakarta Sans", headingFont: "Space Mono", headingWeight: 700, bodyFont: "Plus Jakarta Sans", bodyWeight: 400, category: "tech" },
  { name: "Syne + Inter", headingFont: "Syne", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "tech" },
  { name: "Ubuntu + Rokkitt", headingFont: "Ubuntu", headingWeight: 700, bodyFont: "Rokkitt", bodyWeight: 400, category: "tech" },
  { name: "Sora", headingFont: "Sora", headingWeight: 700, bodyFont: "Sora", bodyWeight: 400, category: "tech" },
  { name: "Manrope", headingFont: "Manrope", headingWeight: 700, bodyFont: "Manrope", bodyWeight: 400, category: "tech" },
  { name: "Funnel Display + Inter", headingFont: "Funnel Display", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "tech" },
  { name: "Space Grotesk + Spectral", headingFont: "Space Grotesk", headingWeight: 700, bodyFont: "Spectral", bodyWeight: 400, category: "tech" },
  { name: "JetBrains Mono + Inter", headingFont: "JetBrains Mono", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "tech" },

  // ——— Bold: high-impact display fonts, attention-grabbing ———
  { name: "Fugaz One + Work Sans", headingFont: "Fugaz One", headingWeight: 400, bodyFont: "Work Sans", bodyWeight: 400, category: "bold" },
  { name: "Chonburi + Domine", headingFont: "Chonburi", headingWeight: 400, bodyFont: "Domine", bodyWeight: 400, category: "bold" },
  { name: "Ultra + Slabo 27px", headingFont: "Ultra", headingWeight: 400, bodyFont: "Slabo 27px", bodyWeight: 400, category: "bold" },
  { name: "Fjalla One + Cantarell", headingFont: "Fjalla One", headingWeight: 400, bodyFont: "Cantarell", bodyWeight: 400, category: "bold" },
  { name: "Passion One + Poppins", headingFont: "Passion One", headingWeight: 400, bodyFont: "Poppins", bodyWeight: 400, category: "bold" },
  { name: "Rozha One + Roboto", headingFont: "Rozha One", headingWeight: 400, bodyFont: "Roboto", bodyWeight: 400, category: "bold" },
  { name: "Lalezar + Rubik", headingFont: "Lalezar", headingWeight: 400, bodyFont: "Rubik", bodyWeight: 400, category: "bold" },
  { name: "Protest Strike + Inter", headingFont: "Protest Strike", headingWeight: 400, bodyFont: "Inter", bodyWeight: 400, category: "bold" },
  { name: "Protest Strike + Fira Sans", headingFont: "Protest Strike", headingWeight: 400, bodyFont: "Fira Sans", bodyWeight: 400, category: "bold" },
  { name: "Big Shoulders Display + Manrope", headingFont: "Big Shoulders Display", headingWeight: 700, bodyFont: "Manrope", bodyWeight: 400, category: "bold" },
  { name: "Squada One + Lato", headingFont: "Squada One", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, category: "bold" },
  { name: "Alfa Slab One + Source Sans 3", headingFont: "Alfa Slab One", headingWeight: 400, bodyFont: "Source Sans 3", bodyWeight: 400, category: "bold" },
  { name: "Shrikhand + Outfit", headingFont: "Shrikhand", headingWeight: 400, bodyFont: "Outfit", bodyWeight: 400, category: "bold" },

  // ——— Warm: slab serifs, earthy, organic ———
  { name: "Varela Round + Lora", headingFont: "Varela Round", headingWeight: 400, bodyFont: "Lora", bodyWeight: 400, category: "warm" },
  { name: "Merriweather Sans + Merriweather", headingFont: "Merriweather Sans", headingWeight: 700, bodyFont: "Merriweather", bodyWeight: 400, category: "warm" },
  { name: "Nunito + Lora", headingFont: "Nunito", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, category: "warm" },
  { name: "Rokkitt + Inter", headingFont: "Rokkitt", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "warm" },
  { name: "Zilla Slab + Inter", headingFont: "Zilla Slab", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "warm" },
  { name: "Corben + Montserrat", headingFont: "Corben", headingWeight: 700, bodyFont: "Montserrat", bodyWeight: 400, category: "warm" },
  { name: "Calistoga + Inter", headingFont: "Calistoga", headingWeight: 400, bodyFont: "Inter", bodyWeight: 400, category: "warm" },
  { name: "Bitter + Raleway", headingFont: "Bitter", headingWeight: 700, bodyFont: "Raleway", bodyWeight: 400, category: "warm" },
  { name: "Literata + Karla", headingFont: "Literata", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, category: "warm" },

  // ——— Heritage: classic serifs, traditional typography ———
  { name: "Cinzel + Fauna One", headingFont: "Cinzel", headingWeight: 700, bodyFont: "Fauna One", bodyWeight: 400, category: "heritage" },
  { name: "Cardo + Hind", headingFont: "Cardo", headingWeight: 700, bodyFont: "Hind", bodyWeight: 400, category: "heritage" },
  { name: "Goudy Bookletter 1911 + Outfit", headingFont: "Goudy Bookletter 1911", headingWeight: 400, bodyFont: "Outfit", bodyWeight: 400, category: "heritage" },
  { name: "Lancelot + Poppins", headingFont: "Lancelot", headingWeight: 400, bodyFont: "Poppins", bodyWeight: 400, category: "heritage" },
  { name: "Libre Baskerville + Source Sans 3", headingFont: "Libre Baskerville", headingWeight: 700, bodyFont: "Source Sans 3", bodyWeight: 400, category: "heritage" },
  { name: "Eczar + Gentium Book Plus", headingFont: "Eczar", headingWeight: 700, bodyFont: "Gentium Book Plus", bodyWeight: 400, category: "heritage" },

  // ——— Literary: book-inspired, reading-focused ———
  { name: "Alegreya Sans + Alegreya", headingFont: "Alegreya Sans", headingWeight: 700, bodyFont: "Alegreya", bodyWeight: 400, category: "literary" },
  { name: "Philosopher + Mulish", headingFont: "Philosopher", headingWeight: 700, bodyFont: "Mulish", bodyWeight: 400, category: "literary" },
  { name: "Lora + Montserrat", headingFont: "Lora", headingWeight: 700, bodyFont: "Montserrat", bodyWeight: 400, category: "literary" },
  { name: "Vollkorn + Lato", headingFont: "Vollkorn", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, category: "literary" },
  { name: "Spectral + Karla", headingFont: "Spectral", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, category: "literary" },

  // ——— Corporate: professional, business-safe ———
  { name: "Raleway + Merriweather", headingFont: "Raleway", headingWeight: 700, bodyFont: "Merriweather", bodyWeight: 400, category: "corporate" },
  { name: "Roboto + Lora", headingFont: "Roboto", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, category: "corporate" },
  { name: "Arvo + Lato", headingFont: "Arvo", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, category: "corporate" },
  { name: "Archivo Narrow + Tenor Sans", headingFont: "Archivo Narrow", headingWeight: 700, bodyFont: "Tenor Sans", bodyWeight: 400, category: "corporate" },
  { name: "Roboto Serif + Instrument Sans", headingFont: "Roboto Serif", headingWeight: 700, bodyFont: "Instrument Sans", bodyWeight: 400, category: "corporate" },
  { name: "Lexend + Source Serif 4", headingFont: "Lexend", headingWeight: 700, bodyFont: "Source Serif 4", bodyWeight: 400, category: "corporate" },
  { name: "Albert Sans + Lora", headingFont: "Albert Sans", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, category: "corporate" },

  // ——— Creative: artistic, unusual, boundary-pushing ———
  { name: "Arima Madurai + Mulish", headingFont: "Arima Madurai", headingWeight: 700, bodyFont: "Mulish", bodyWeight: 400, category: "creative" },
  { name: "Stint Ultra Expanded + Pontano Sans", headingFont: "Stint Ultra Expanded", headingWeight: 400, bodyFont: "Pontano Sans", bodyWeight: 400, category: "creative" },
  { name: "DotGothic16 + Space Mono", headingFont: "DotGothic16", headingWeight: 400, bodyFont: "Space Mono", bodyWeight: 400, category: "creative" },
  { name: "Bricolage Grotesque", headingFont: "Bricolage Grotesque", headingWeight: 700, bodyFont: "Bricolage Grotesque", bodyWeight: 400, category: "creative" },
  { name: "DM Serif Display + Manrope", headingFont: "DM Serif Display", headingWeight: 400, bodyFont: "Manrope", bodyWeight: 400, category: "creative" },
  { name: "Anybody + Inter", headingFont: "Anybody", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, category: "creative" },
  { name: "Tilt Warp + Inter", headingFont: "Tilt Warp", headingWeight: 400, bodyFont: "Inter", bodyWeight: 400, category: "creative" },
  { name: "Unbounded + DM Sans", headingFont: "Unbounded", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, category: "creative" },
  { name: "Fraunces + Space Grotesk", headingFont: "Fraunces", headingWeight: 700, bodyFont: "Space Grotesk", bodyWeight: 400, category: "creative" },

  // ——— Playful: fun, rounded, casual ———
  { name: "Quicksand Bold + Quicksand", headingFont: "Quicksand", headingWeight: 700, bodyFont: "Quicksand", bodyWeight: 400, category: "playful" },
  { name: "Nunito + PT Sans", headingFont: "Nunito", headingWeight: 700, bodyFont: "PT Sans", bodyWeight: 400, category: "playful" },
  { name: "Nunito", headingFont: "Nunito", headingWeight: 700, bodyFont: "Nunito", bodyWeight: 400, category: "playful" },
  { name: "Bubblegum Sans + Open Sans", headingFont: "Bubblegum Sans", headingWeight: 400, bodyFont: "Open Sans", bodyWeight: 400, category: "playful" },
  { name: "Luckiest Guy + Montserrat", headingFont: "Luckiest Guy", headingWeight: 400, bodyFont: "Montserrat", bodyWeight: 400, category: "playful" },
  { name: "Baloo 2 + Nunito", headingFont: "Baloo 2", headingWeight: 700, bodyFont: "Nunito", bodyWeight: 400, category: "playful" },
  { name: "Cherry Bomb One + Quicksand", headingFont: "Cherry Bomb One", headingWeight: 400, bodyFont: "Quicksand", bodyWeight: 400, category: "playful" },
  { name: "Parkinsans", headingFont: "Parkinsans", headingWeight: 700, bodyFont: "Parkinsans", bodyWeight: 400, category: "playful" },
  { name: "Balsamiq Sans", headingFont: "Balsamiq Sans", headingWeight: 700, bodyFont: "Balsamiq Sans", bodyWeight: 400, category: "playful" },
  { name: "Fredoka + Nunito Sans", headingFont: "Fredoka", headingWeight: 600, bodyFont: "Nunito Sans", bodyWeight: 400, category: "playful" },

  // ——— Romantic: script headings, soft, intimate ———
  { name: "Sacramento + Alice", headingFont: "Sacramento", headingWeight: 400, bodyFont: "Alice", bodyWeight: 400, category: "romantic" },
  { name: "Yellowtail + Rethink Sans", headingFont: "Yellowtail", headingWeight: 400, bodyFont: "Rethink Sans", bodyWeight: 400, category: "romantic" },
  { name: "Seaweed Script + Roboto", headingFont: "Seaweed Script", headingWeight: 400, bodyFont: "Roboto", bodyWeight: 400, category: "romantic" },
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
