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
  { name: "Abril Fatface + Lato", headingFont: "Abril Fatface", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, fg: "#3a2a1e", bg: "#e8a06a", category: "editorial" },
  { name: "Fugaz One + Work Sans", headingFont: "Fugaz One", headingWeight: 400, bodyFont: "Work Sans", bodyWeight: 400, fg: "#c8c8d8", bg: "#2b2b5a", category: "creative" },
  { name: "Space Mono + Plus Jakarta Sans", headingFont: "Space Mono", headingWeight: 700, bodyFont: "Plus Jakarta Sans", bodyWeight: 400, fg: "#e0ddd8", bg: "#1b2838", category: "tech" },
  { name: "Grand Hotel + Lato", headingFont: "Grand Hotel", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, fg: "#5a3a1b", bg: "#e8d8c5", category: "elegant" },
  { name: "Raleway + Merriweather", headingFont: "Raleway", headingWeight: 700, bodyFont: "Merriweather", bodyWeight: 400, fg: "#2b3a4a", bg: "#e8d5be", category: "professional" },
  { name: "Chonburi + Domine", headingFont: "Chonburi", headingWeight: 400, bodyFont: "Domine", bodyWeight: 400, fg: "#2b5a5a", bg: "#f0ebe0", category: "editorial" },
  { name: "Inter + Krub", headingFont: "Inter", headingWeight: 700, bodyFont: "Krub", bodyWeight: 400, fg: "#2b2b2b", bg: "#f0ede8", category: "modern" },
  { name: "Oswald + Source Serif 4", headingFont: "Oswald", headingWeight: 700, bodyFont: "Source Serif 4", bodyWeight: 400, fg: "#f0ede8", bg: "#38404a", category: "editorial" },
  { name: "Arima Madurai + Mulish", headingFont: "Arima Madurai", headingWeight: 700, bodyFont: "Mulish", bodyWeight: 400, fg: "#f0e8ea", bg: "#5a2b4a", category: "creative" },
  { name: "Nunito + Lora", headingFont: "Nunito", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, fg: "#e8d8c5", bg: "#6b4a2b", category: "warm" },
  { name: "Ultra + Slabo 27px", headingFont: "Ultra", headingWeight: 400, bodyFont: "Slabo 27px", bodyWeight: 400, fg: "#f5f0e8", bg: "#c85a3a", category: "bold" },
  { name: "Arvo + Lato", headingFont: "Arvo", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, fg: "#1b2838", bg: "#8abbd4", category: "professional" },
  { name: "Unica One + Crimson Text", headingFont: "Unica One", headingWeight: 400, bodyFont: "Crimson Text", bodyWeight: 400, fg: "#d4a843", bg: "#2a5a5a", category: "luxury" },
  { name: "Cinzel + Fauna One", headingFont: "Cinzel", headingWeight: 700, bodyFont: "Fauna One", bodyWeight: 400, fg: "#e8d8c5", bg: "#5a6b3a", category: "heritage" },
  { name: "Yeseva One + Josefin Sans", headingFont: "Yeseva One", headingWeight: 400, bodyFont: "Josefin Sans", bodyWeight: 400, fg: "#e8d8c5", bg: "#1b3a3a", category: "elegant" },
  { name: "Sacramento + Alice", headingFont: "Sacramento", headingWeight: 400, bodyFont: "Alice", bodyWeight: 400, fg: "#e8d5b5", bg: "#3a2b1b", category: "romantic" },
  { name: "Roboto + Lora", headingFont: "Roboto", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, fg: "#2b2b2b", bg: "#ffffff", category: "professional" },
  { name: "Montserrat + Karla", headingFont: "Montserrat", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, fg: "#e8d8c5", bg: "#4a5a2b", category: "modern" },
  { name: "Fjalla One + Cantarell", headingFont: "Fjalla One", headingWeight: 400, bodyFont: "Cantarell", bodyWeight: 400, fg: "#f0ede8", bg: "#5a7a8a", category: "bold" },
  { name: "Source Sans Pro + Alegreya", headingFont: "Source Sans Pro", headingWeight: 700, bodyFont: "Alegreya", bodyWeight: 400, fg: "#2b2b1e", bg: "#d4a843", category: "editorial" },
  { name: "Stint Ultra Expanded + Pontano Sans", headingFont: "Stint Ultra Expanded", headingWeight: 400, bodyFont: "Pontano Sans", bodyWeight: 400, fg: "#f0ede8", bg: "#6b8090", category: "unique" },
  { name: "Ubuntu + Rokkitt", headingFont: "Ubuntu", headingWeight: 700, bodyFont: "Rokkitt", bodyWeight: 400, fg: "#eae7e0", bg: "#3d7a8a", category: "tech" },
  { name: "Nunito + PT Sans", headingFont: "Nunito", headingWeight: 700, bodyFont: "PT Sans", bodyWeight: 400, fg: "#e8a88a", bg: "#6b2b4a", category: "friendly" },
  { name: "DotGothic16 + Space Mono", headingFont: "DotGothic16", headingWeight: 400, bodyFont: "Space Mono", bodyWeight: 400, fg: "#d4a843", bg: "#2e2e2c", category: "retro" },
  { name: "Playfair Display + Lato", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, fg: "#2b3a4a", bg: "#f0ebe0", category: "luxury" },
  { name: "Quicksand Bold + Quicksand", headingFont: "Quicksand", headingWeight: 700, bodyFont: "Quicksand", bodyWeight: 400, fg: "#f0ede8", bg: "#3d7a8a", category: "playful" },
  { name: "Syne + Inter", headingFont: "Syne", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#c8c8d8", bg: "#2b2b5a", category: "tech" },
  { name: "Yellowtail + Rethink Sans", headingFont: "Yellowtail", headingWeight: 400, bodyFont: "Rethink Sans", bodyWeight: 400, fg: "#5a3a1b", bg: "#e8d5be", category: "retro" },
  { name: "Rufina + Average Sans", headingFont: "Rufina", headingWeight: 700, bodyFont: "Average Sans", bodyWeight: 400, fg: "#2b5a5a", bg: "#f0ede8", category: "editorial" },
  { name: "Poiret One + Montserrat", headingFont: "Poiret One", headingWeight: 400, bodyFont: "Montserrat", bodyWeight: 400, fg: "#d4a843", bg: "#1b2838", category: "luxury" },
  { name: "Sintony + Poppins", headingFont: "Sintony", headingWeight: 700, bodyFont: "Poppins", bodyWeight: 400, fg: "#1b2838", bg: "#8abbd4", category: "modern" },
  { name: "Philosopher + Mulish", headingFont: "Philosopher", headingWeight: 700, bodyFont: "Mulish", bodyWeight: 400, fg: "#e8d8c5", bg: "#3a2b1b", category: "literary" },
  { name: "Cardo + Hind", headingFont: "Cardo", headingWeight: 700, bodyFont: "Hind", bodyWeight: 400, fg: "#3a2a1e", bg: "#e8d8c5", category: "heritage" },
  { name: "Bubblegum Sans + Open Sans", headingFont: "Bubblegum Sans", headingWeight: 400, bodyFont: "Open Sans", bodyWeight: 400, fg: "#f5f0e8", bg: "#c85a3a", category: "playful" },
  { name: "Archivo Narrow + Tenor Sans", headingFont: "Archivo Narrow", headingWeight: 700, bodyFont: "Tenor Sans", bodyWeight: 400, fg: "#eae7e0", bg: "#38404a", category: "corporate" },
  { name: "Rethink Sans + Spectral", headingFont: "Rethink Sans", headingWeight: 700, bodyFont: "Spectral", bodyWeight: 400, fg: "#e8d8c5", bg: "#5a6b3a", category: "professional" },
  { name: "Crimson Pro + DM Sans", headingFont: "Crimson Pro", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, fg: "#e8d5b5", bg: "#6b4a2b", category: "editorial" },
  { name: "Young Serif + Instrument Sans", headingFont: "Young Serif", headingWeight: 400, bodyFont: "Instrument Sans", bodyWeight: 400, fg: "#2b2b1e", bg: "#d4a843", category: "creative" },
  { name: "Instrument Sans + Geist", headingFont: "Instrument Sans", headingWeight: 600, bodyFont: "Geist", bodyWeight: 400, fg: "#e0ddd8", bg: "#1b2838", category: "minimal" },
];

export function buildPresetConfig(preset: PresetDef): TypographyConfig {
  return {
    ...DEFAULT_CONFIG,
    headingsGroup: {
      ...DEFAULT_CONFIG.headingsGroup,
      fontFamily: preset.headingFont,
      fontWeight: preset.headingWeight,
      color: preset.fg,
    },
    bodyGroup: {
      ...DEFAULT_CONFIG.bodyGroup,
      fontFamily: preset.bodyFont,
      fontWeight: preset.bodyWeight,
      color: preset.fg,
    },
    backgroundColor: preset.bg,
  };
}

export { PRESETS };
export type { PresetDef };
