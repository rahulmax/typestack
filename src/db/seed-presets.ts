import type { TypographyConfig } from "@/types/typography";
import { DEFAULT_CONFIG } from "@/data/default-config";

interface PresetDef {
  name: string;
  headingFont: string;
  headingWeight: number;
  bodyFont: string;
  bodyWeight: number;
  fg: string;
  bg: string;
  category: string;
}

const PRESETS: PresetDef[] = [
  // ——— Editorial: serif heading + sans body, magazine/newspaper feel ———
  { name: "Abril Fatface + Lato", headingFont: "Abril Fatface", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, fg: "#3a2a1e", bg: "#e8a06a", category: "editorial" },
  { name: "Oswald + Source Serif 4", headingFont: "Oswald", headingWeight: 700, bodyFont: "Source Serif 4", bodyWeight: 400, fg: "#f0ede8", bg: "#38404a", category: "editorial" },
  { name: "Source Sans Pro + Alegreya", headingFont: "Source Sans Pro", headingWeight: 700, bodyFont: "Alegreya", bodyWeight: 400, fg: "#2b2b1e", bg: "#d4a843", category: "editorial" },
  { name: "Rufina + Average Sans", headingFont: "Rufina", headingWeight: 700, bodyFont: "Average Sans", bodyWeight: 400, fg: "#2b5a5a", bg: "#f0ede8", category: "editorial" },
  { name: "Crimson Pro + DM Sans", headingFont: "Crimson Pro", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, fg: "#e8d5b5", bg: "#6b4a2b", category: "editorial" },
  { name: "Young Serif + Instrument Sans", headingFont: "Young Serif", headingWeight: 400, bodyFont: "Instrument Sans", bodyWeight: 400, fg: "#2b2b1e", bg: "#d4a843", category: "editorial" },
  { name: "Darker Grotesque", headingFont: "Darker Grotesque", headingWeight: 700, bodyFont: "Darker Grotesque", bodyWeight: 400, fg: "#e8dcc8", bg: "#5a3a20", category: "editorial" },
  { name: "DM Serif Display + IBM Plex Sans", headingFont: "DM Serif Display", headingWeight: 400, bodyFont: "IBM Plex Sans", bodyWeight: 400, fg: "#e8a050", bg: "#792418", category: "editorial" },
  { name: "PT Serif + Inter", headingFont: "PT Serif", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#1a1a18", bg: "#e8c840", category: "editorial" },
  { name: "Rethink Sans + Spectral", headingFont: "Rethink Sans", headingWeight: 700, bodyFont: "Spectral", bodyWeight: 400, fg: "#e8d8c5", bg: "#4e5e32", category: "editorial" },
  { name: "Newsreader + Inter", headingFont: "Newsreader", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#2b2520", bg: "#f0e8da", category: "editorial" },
  { name: "Noto Serif Display + Be Vietnam Pro", headingFont: "Noto Serif Display", headingWeight: 700, bodyFont: "Be Vietnam Pro", bodyWeight: 400, fg: "#e8d8c5", bg: "#3a4a5a", category: "editorial" },
  { name: "Libre Caslon Text + Libre Franklin", headingFont: "Libre Caslon Text", headingWeight: 700, bodyFont: "Libre Franklin", bodyWeight: 400, fg: "#2a1e15", bg: "#f0e8da", category: "editorial" },

  // ——— Luxury: premium, Didone, fashion-inspired ———
  { name: "Unica One + Crimson Text", headingFont: "Unica One", headingWeight: 400, bodyFont: "Crimson Text", bodyWeight: 400, fg: "#d4a843", bg: "#214747", category: "luxury" },
  { name: "Playfair Display + Lato", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, fg: "#2b3a4a", bg: "#f0ebe0", category: "luxury" },
  { name: "Poiret One + Montserrat", headingFont: "Poiret One", headingWeight: 400, bodyFont: "Montserrat", bodyWeight: 400, fg: "#d4a843", bg: "#1b2838", category: "luxury" },
  { name: "Playfair Display + Montserrat", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Montserrat", bodyWeight: 400, fg: "#ffffff", bg: "#3d7a8a", category: "luxury" },
  { name: "Bodoni Moda + DM Sans", headingFont: "Bodoni Moda", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, fg: "#d4b896", bg: "#1a1a1a", category: "luxury" },
  { name: "Cormorant Garamond + Fira Sans", headingFont: "Cormorant Garamond", headingWeight: 600, bodyFont: "Fira Sans", bodyWeight: 400, fg: "#e8dcc8", bg: "#1a1a2e", category: "luxury" },

  // ——— Elegant: refined, thin, sophisticated ———
  { name: "Grand Hotel + Lato", headingFont: "Grand Hotel", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, fg: "#5a3a1b", bg: "#e8d8c5", category: "elegant" },
  { name: "Yeseva One + Josefin Sans", headingFont: "Yeseva One", headingWeight: 400, bodyFont: "Josefin Sans", bodyWeight: 400, fg: "#e8d8c5", bg: "#1b3a3a", category: "elegant" },
  { name: "Playfair Display + Work Sans", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Work Sans", bodyWeight: 400, fg: "#2a5a68", bg: "#f0ebe0", category: "elegant" },
  { name: "Cormorant Infant + Assistant", headingFont: "Cormorant Infant", headingWeight: 700, bodyFont: "Assistant", bodyWeight: 400, fg: "#d4a870", bg: "#762437", category: "elegant" },
  { name: "Italiana + Bellota Text", headingFont: "Italiana", headingWeight: 400, bodyFont: "Bellota Text", bodyWeight: 400, fg: "#c0785a", bg: "#15242c", category: "elegant" },
  { name: "Instrument Serif + Instrument Sans", headingFont: "Instrument Serif", headingWeight: 400, bodyFont: "Instrument Sans", bodyWeight: 400, fg: "#2a2a28", bg: "#f0ece5", category: "elegant" },
  { name: "Fraunces + Epilogue", headingFont: "Fraunces", headingWeight: 700, bodyFont: "Epilogue", bodyWeight: 400, fg: "#f0e8ea", bg: "#5a3858", category: "elegant" },

  // ——— Minimal: clean, restrained, geometric sans ———
  { name: "Inter + Krub", headingFont: "Inter", headingWeight: 700, bodyFont: "Krub", bodyWeight: 400, fg: "#2b2b2b", bg: "#f0ede8", category: "minimal" },
  { name: "Instrument Sans + Geist", headingFont: "Instrument Sans", headingWeight: 600, bodyFont: "Geist", bodyWeight: 400, fg: "#e0ddd8", bg: "#1b2838", category: "minimal" },
  { name: "Montserrat + Karla", headingFont: "Montserrat", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, fg: "#e8d8c5", bg: "#4a5a2b", category: "minimal" },
  { name: "Inter + DM Sans", headingFont: "Inter", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, fg: "#e8e0d0", bg: "#546474", category: "minimal" },
  { name: "Outfit + Poppins", headingFont: "Outfit", headingWeight: 700, bodyFont: "Poppins", bodyWeight: 400, fg: "#e0e0d8", bg: "#4a4a48", category: "minimal" },
  { name: "Figtree", headingFont: "Figtree", headingWeight: 700, bodyFont: "Figtree", bodyWeight: 400, fg: "#ffffff", bg: "#4a6fa5", category: "minimal" },
  { name: "Rubik", headingFont: "Rubik", headingWeight: 700, bodyFont: "Rubik", bodyWeight: 400, fg: "#1a2a4a", bg: "#a0c0d8", category: "minimal" },
  { name: "Gruppo + Comfortaa", headingFont: "Gruppo", headingWeight: 400, bodyFont: "Comfortaa", bodyWeight: 400, fg: "#5a5535", bg: "#f0ebe0", category: "minimal" },
  { name: "Gabarito", headingFont: "Gabarito", headingWeight: 700, bodyFont: "Gabarito", bodyWeight: 400, fg: "#3a2a50", bg: "#eae0d0", category: "minimal" },
  { name: "Poppins", headingFont: "Poppins", headingWeight: 700, bodyFont: "Poppins", bodyWeight: 400, fg: "#2b2b2b", bg: "#c8a040", category: "minimal" },
  { name: "Sintony + Poppins", headingFont: "Sintony", headingWeight: 700, bodyFont: "Poppins", bodyWeight: 400, fg: "#1b2838", bg: "#8abbd4", category: "minimal" },
  { name: "Albert Sans + DM Sans", headingFont: "Albert Sans", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, fg: "#1a2838", bg: "#e8eef5", category: "minimal" },

  // ——— Tech: geometric, monospace, digital native ———
  { name: "Space Mono + Plus Jakarta Sans", headingFont: "Space Mono", headingWeight: 700, bodyFont: "Plus Jakarta Sans", bodyWeight: 400, fg: "#e0ddd8", bg: "#1b2838", category: "tech" },
  { name: "Syne + Inter", headingFont: "Syne", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#c8c8d8", bg: "#2b2b5a", category: "tech" },
  { name: "Ubuntu + Rokkitt", headingFont: "Ubuntu", headingWeight: 700, bodyFont: "Rokkitt", bodyWeight: 400, fg: "#eae7e0", bg: "#376e7d", category: "tech" },
  { name: "Sora", headingFont: "Sora", headingWeight: 700, bodyFont: "Sora", bodyWeight: 400, fg: "#e0ddd5", bg: "#2a3038", category: "tech" },
  { name: "Manrope", headingFont: "Manrope", headingWeight: 700, bodyFont: "Manrope", bodyWeight: 400, fg: "#c8b050", bg: "#1a2a4a", category: "tech" },
  { name: "Funnel Display + Inter", headingFont: "Funnel Display", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#c8b050", bg: "#1a2a4a", category: "tech" },
  { name: "Space Grotesk + Spectral", headingFont: "Space Grotesk", headingWeight: 700, bodyFont: "Spectral", bodyWeight: 400, fg: "#e0e5ea", bg: "#1a2430", category: "tech" },
  { name: "JetBrains Mono + Inter", headingFont: "JetBrains Mono", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#a8d8a0", bg: "#1a1e24", category: "tech" },

  // ——— Bold: high-impact display fonts, attention-grabbing ———
  { name: "Fugaz One + Work Sans", headingFont: "Fugaz One", headingWeight: 400, bodyFont: "Work Sans", bodyWeight: 400, fg: "#c8c8d8", bg: "#2b2b5a", category: "bold" },
  { name: "Chonburi + Domine", headingFont: "Chonburi", headingWeight: 400, bodyFont: "Domine", bodyWeight: 400, fg: "#2b5a5a", bg: "#f0ebe0", category: "bold" },
  { name: "Ultra + Slabo 27px", headingFont: "Ultra", headingWeight: 400, bodyFont: "Slabo 27px", bodyWeight: 400, fg: "#f5f0e8", bg: "#b14e32", category: "bold" },
  { name: "Fjalla One + Cantarell", headingFont: "Fjalla One", headingWeight: 400, bodyFont: "Cantarell", bodyWeight: 400, fg: "#f0ede8", bg: "#516e7d", category: "bold" },
  { name: "Passion One + Poppins", headingFont: "Passion One", headingWeight: 400, bodyFont: "Poppins", bodyWeight: 400, fg: "#e8b850", bg: "#7a3b1d", category: "bold" },
  { name: "Rozha One + Roboto", headingFont: "Rozha One", headingWeight: 400, bodyFont: "Roboto", bodyWeight: 400, fg: "#ffffff", bg: "#aa6419", category: "bold" },
  { name: "Lalezar + Rubik", headingFont: "Lalezar", headingWeight: 400, bodyFont: "Rubik", bodyWeight: 400, fg: "#ffffff", bg: "#aa6419", category: "bold" },
  { name: "Protest Strike + Inter", headingFont: "Protest Strike", headingWeight: 400, bodyFont: "Inter", bodyWeight: 400, fg: "#c8d050", bg: "#365c2c", category: "bold" },
  { name: "Protest Strike + Fira Sans", headingFont: "Protest Strike", headingWeight: 400, bodyFont: "Fira Sans", bodyWeight: 400, fg: "#e8a050", bg: "#792418", category: "bold" },
  { name: "Big Shoulders Display + Manrope", headingFont: "Big Shoulders Display", headingWeight: 700, bodyFont: "Manrope", bodyWeight: 400, fg: "#e0ddd5", bg: "#55616e", category: "bold" },
  { name: "Squada One + Lato", headingFont: "Squada One", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, fg: "#e0e0d8", bg: "#4a4a48", category: "bold" },
  { name: "Alfa Slab One + Source Sans 3", headingFont: "Alfa Slab One", headingWeight: 400, bodyFont: "Source Sans 3", bodyWeight: 400, fg: "#ffffff", bg: "#3d7a8a", category: "bold" },
  { name: "Shrikhand + Outfit", headingFont: "Shrikhand", headingWeight: 400, bodyFont: "Outfit", bodyWeight: 400, fg: "#1a1a18", bg: "#f0c840", category: "bold" },

  // ——— Warm: slab serifs, earthy, organic ———
  { name: "Nunito + Lora", headingFont: "Nunito", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, fg: "#e8d8c5", bg: "#6b4a2b", category: "warm" },
  { name: "Rokkitt + Inter", headingFont: "Rokkitt", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#c8b898", bg: "#4f492e", category: "warm" },
  { name: "Zilla Slab + Inter", headingFont: "Zilla Slab", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#e8e0d0", bg: "#6a4830", category: "warm" },
  { name: "Corben + Montserrat", headingFont: "Corben", headingWeight: 700, bodyFont: "Montserrat", bodyWeight: 400, fg: "#e8e0d0", bg: "#6a4830", category: "warm" },
  { name: "Calistoga + Inter", headingFont: "Calistoga", headingWeight: 400, bodyFont: "Inter", bodyWeight: 400, fg: "#1a2a4a", bg: "#a0c0d8", category: "warm" },
  { name: "Bitter + Raleway", headingFont: "Bitter", headingWeight: 700, bodyFont: "Raleway", bodyWeight: 400, fg: "#f0e8d8", bg: "#8a4a2e", category: "warm" },
  { name: "Literata + Karla", headingFont: "Literata", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, fg: "#2a2a28", bg: "#eae8e2", category: "warm" },

  // ——— Heritage: classic serifs, traditional typography ———
  { name: "Cinzel + Fauna One", headingFont: "Cinzel", headingWeight: 700, bodyFont: "Fauna One", bodyWeight: 400, fg: "#e8d8c5", bg: "#4e5e32", category: "heritage" },
  { name: "Cardo + Hind", headingFont: "Cardo", headingWeight: 700, bodyFont: "Hind", bodyWeight: 400, fg: "#3a2a1e", bg: "#e8d8c5", category: "heritage" },
  { name: "Goudy Bookletter 1911 + Outfit", headingFont: "Goudy Bookletter 1911", headingWeight: 400, bodyFont: "Outfit", bodyWeight: 400, fg: "#d4d0a0", bg: "#505b2b", category: "heritage" },
  { name: "Lancelot + Poppins", headingFont: "Lancelot", headingWeight: 400, bodyFont: "Poppins", bodyWeight: 400, fg: "#d4d0a0", bg: "#5a3a20", category: "heritage" },
  { name: "Libre Baskerville + Source Sans 3", headingFont: "Libre Baskerville", headingWeight: 700, bodyFont: "Source Sans 3", bodyWeight: 400, fg: "#2a1e15", bg: "#e8dcc8", category: "heritage" },
  { name: "Eczar + Gentium Book Plus", headingFont: "Eczar", headingWeight: 700, bodyFont: "Gentium Book Plus", bodyWeight: 400, fg: "#f0e8d8", bg: "#5a6830", category: "heritage" },

  // ——— Literary: book-inspired, reading-focused ———
  { name: "Philosopher + Mulish", headingFont: "Philosopher", headingWeight: 700, bodyFont: "Mulish", bodyWeight: 400, fg: "#e8d8c5", bg: "#3a2b1b", category: "literary" },
  { name: "Lora + Montserrat", headingFont: "Lora", headingWeight: 700, bodyFont: "Montserrat", bodyWeight: 400, fg: "#2a3038", bg: "#e0d8d0", category: "literary" },
  { name: "Vollkorn + Lato", headingFont: "Vollkorn", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, fg: "#3a2a1e", bg: "#f0e8d8", category: "literary" },
  { name: "Spectral + Karla", headingFont: "Spectral", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, fg: "#e8e0d8", bg: "#3a3a38", category: "literary" },

  // ——— Corporate: professional, business-safe ———
  { name: "Raleway + Merriweather", headingFont: "Raleway", headingWeight: 700, bodyFont: "Merriweather", bodyWeight: 400, fg: "#2b3a4a", bg: "#e8d5be", category: "corporate" },
  { name: "Roboto + Lora", headingFont: "Roboto", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, fg: "#2b2b2b", bg: "#ffffff", category: "corporate" },
  { name: "Arvo + Lato", headingFont: "Arvo", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, fg: "#1b2838", bg: "#8abbd4", category: "corporate" },
  { name: "Archivo Narrow + Tenor Sans", headingFont: "Archivo Narrow", headingWeight: 700, bodyFont: "Tenor Sans", bodyWeight: 400, fg: "#eae7e0", bg: "#38404a", category: "corporate" },
  { name: "Roboto Serif + Instrument Sans", headingFont: "Roboto Serif", headingWeight: 700, bodyFont: "Instrument Sans", bodyWeight: 400, fg: "#c0785a", bg: "#15242c", category: "corporate" },
  { name: "Lexend + Source Serif 4", headingFont: "Lexend", headingWeight: 700, bodyFont: "Source Serif 4", bodyWeight: 400, fg: "#1a2838", bg: "#e8eef5", category: "corporate" },
  { name: "Albert Sans + Lora", headingFont: "Albert Sans", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, fg: "#1a2a3a", bg: "#eef2f5", category: "corporate" },

  // ——— Creative: artistic, unusual, boundary-pushing ———
  { name: "Arima Madurai + Mulish", headingFont: "Arima Madurai", headingWeight: 700, bodyFont: "Mulish", bodyWeight: 400, fg: "#f0e8ea", bg: "#5a2b4a", category: "creative" },
  { name: "Stint Ultra Expanded + Pontano Sans", headingFont: "Stint Ultra Expanded", headingWeight: 400, bodyFont: "Pontano Sans", bodyWeight: 400, fg: "#f0ede8", bg: "#5a6c7a", category: "creative" },
  { name: "DotGothic16 + Space Mono", headingFont: "DotGothic16", headingWeight: 400, bodyFont: "Space Mono", bodyWeight: 400, fg: "#d4a843", bg: "#2e2e2c", category: "creative" },
  { name: "Bricolage Grotesque", headingFont: "Bricolage Grotesque", headingWeight: 700, bodyFont: "Bricolage Grotesque", bodyWeight: 400, fg: "#3a2a50", bg: "#eae0d0", category: "creative" },
  { name: "DM Serif Display + Manrope", headingFont: "DM Serif Display", headingWeight: 400, bodyFont: "Manrope", bodyWeight: 400, fg: "#5a5aaa", bg: "#ece0cc", category: "creative" },
  { name: "Anybody + Inter", headingFont: "Anybody", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#e8dcc8", bg: "#596630", category: "creative" },
  { name: "Tilt Warp + Inter", headingFont: "Tilt Warp", headingWeight: 400, bodyFont: "Inter", bodyWeight: 400, fg: "#1a1a18", bg: "#e8c840", category: "creative" },
  { name: "Unbounded + DM Sans", headingFont: "Unbounded", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, fg: "#f0f0f5", bg: "#2a3a6a", category: "creative" },
  { name: "Fraunces + Space Grotesk", headingFont: "Fraunces", headingWeight: 700, bodyFont: "Space Grotesk", bodyWeight: 400, fg: "#1a3a2e", bg: "#f5ede0", category: "creative" },

  // ——— Playful: fun, rounded, casual ———
  { name: "Quicksand Bold + Quicksand", headingFont: "Quicksand", headingWeight: 700, bodyFont: "Quicksand", bodyWeight: 400, fg: "#f0ede8", bg: "#397281", category: "playful" },
  { name: "Nunito + PT Sans", headingFont: "Nunito", headingWeight: 700, bodyFont: "PT Sans", bodyWeight: 400, fg: "#e8a88a", bg: "#6b2b4a", category: "playful" },
  { name: "Nunito", headingFont: "Nunito", headingWeight: 700, bodyFont: "Nunito", bodyWeight: 400, fg: "#ffffff", bg: "#6c7a4e", category: "playful" },
  { name: "Bubblegum Sans + Open Sans", headingFont: "Bubblegum Sans", headingWeight: 400, bodyFont: "Open Sans", bodyWeight: 400, fg: "#f5f0e8", bg: "#b14e32", category: "playful" },
  { name: "Luckiest Guy + Montserrat", headingFont: "Luckiest Guy", headingWeight: 400, bodyFont: "Montserrat", bodyWeight: 400, fg: "#e0e0d8", bg: "#9b4a25", category: "playful" },
  { name: "Baloo 2 + Nunito", headingFont: "Baloo 2", headingWeight: 700, bodyFont: "Nunito", bodyWeight: 400, fg: "#ffffff", bg: "#4a6fa5", category: "playful" },
  { name: "Cherry Bomb One + Quicksand", headingFont: "Cherry Bomb One", headingWeight: 400, bodyFont: "Quicksand", bodyWeight: 400, fg: "#e8b850", bg: "#8c2a1c", category: "playful" },
  { name: "Parkinsans", headingFont: "Parkinsans", headingWeight: 700, bodyFont: "Parkinsans", bodyWeight: 400, fg: "#c8d050", bg: "#365c2c", category: "playful" },
  { name: "Balsamiq Sans", headingFont: "Balsamiq Sans", headingWeight: 700, bodyFont: "Balsamiq Sans", bodyWeight: 400, fg: "#2a3038", bg: "#e0d8d0", category: "playful" },
  { name: "Fredoka + Nunito Sans", headingFont: "Fredoka", headingWeight: 600, bodyFont: "Nunito Sans", bodyWeight: 400, fg: "#ffffff", bg: "#e86050", category: "playful" },

  // ——— Romantic: script headings, soft, intimate ———
  { name: "Sacramento + Alice", headingFont: "Sacramento", headingWeight: 400, bodyFont: "Alice", bodyWeight: 400, fg: "#e8d5b5", bg: "#3a2b1b", category: "romantic" },
  { name: "Yellowtail + Rethink Sans", headingFont: "Yellowtail", headingWeight: 400, bodyFont: "Rethink Sans", bodyWeight: 400, fg: "#5a3a1b", bg: "#e8d5be", category: "romantic" },
  { name: "Seaweed Script + Roboto", headingFont: "Seaweed Script", headingWeight: 400, bodyFont: "Roboto", bodyWeight: 400, fg: "#a04058", bg: "#f0ebe0", category: "romantic" },
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
