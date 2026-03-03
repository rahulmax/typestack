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
  { name: "Abril Fatface + Lato", headingFont: "Abril Fatface", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, fg: "#1a1a1a", bg: "#5cff8a", category: "editorial" },
  { name: "Fugaz One + Work Sans", headingFont: "Fugaz One", headingWeight: 400, bodyFont: "Work Sans", bodyWeight: 400, fg: "#ffffff", bg: "#2d2d6b", category: "creative" },
  { name: "Space Mono + Plus Jakarta Sans", headingFont: "Space Mono", headingWeight: 700, bodyFont: "Plus Jakarta Sans", bodyWeight: 400, fg: "#e8e8e8", bg: "#1a1a2e", category: "tech" },
  { name: "Grand Hotel + Lato", headingFont: "Grand Hotel", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, fg: "#3d2c2c", bg: "#fdf0e2", category: "elegant" },
  { name: "Raleway + Merriweather", headingFont: "Raleway", headingWeight: 700, bodyFont: "Merriweather", bodyWeight: 400, fg: "#2c3e50", bg: "#ecf0f1", category: "professional" },
  { name: "Chonburi + Domine", headingFont: "Chonburi", headingWeight: 400, bodyFont: "Domine", bodyWeight: 400, fg: "#1b1b1b", bg: "#f5e6ca", category: "editorial" },
  { name: "Inter + Krub", headingFont: "Inter", headingWeight: 700, bodyFont: "Krub", bodyWeight: 400, fg: "#1a1a1a", bg: "#f0f4f8", category: "modern" },
  { name: "Oswald + Source Serif 4", headingFont: "Oswald", headingWeight: 700, bodyFont: "Source Serif 4", bodyWeight: 400, fg: "#ffffff", bg: "#0d1b2a", category: "editorial" },
  { name: "Arima Madurai + Mulish", headingFont: "Arima Madurai", headingWeight: 700, bodyFont: "Mulish", bodyWeight: 400, fg: "#2e1a47", bg: "#f3e8ff", category: "creative" },
  { name: "Nunito + Lora", headingFont: "Nunito", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, fg: "#1a1a1a", bg: "#faf7f2", category: "warm" },
  { name: "Ultra + Slabo 27px", headingFont: "Ultra", headingWeight: 400, bodyFont: "Slabo 27px", bodyWeight: 400, fg: "#ffffff", bg: "#b91c1c", category: "bold" },
  { name: "Arvo + Lato", headingFont: "Arvo", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, fg: "#1e293b", bg: "#f1f5f9", category: "professional" },
  { name: "Unica One + Crimson Text", headingFont: "Unica One", headingWeight: 400, bodyFont: "Crimson Text", bodyWeight: 400, fg: "#d4af37", bg: "#1a1a2e", category: "luxury" },
  { name: "Cinzel + Fauna One", headingFont: "Cinzel", headingWeight: 700, bodyFont: "Fauna One", bodyWeight: 400, fg: "#dbccb5", bg: "#b5684c", category: "heritage" },
  { name: "Yeseva One + Josefin Sans", headingFont: "Yeseva One", headingWeight: 400, bodyFont: "Josefin Sans", bodyWeight: 400, fg: "#dba988", bg: "#162c3a", category: "elegant" },
  { name: "Sacramento + Alice", headingFont: "Sacramento", headingWeight: 400, bodyFont: "Alice", bodyWeight: 400, fg: "#4a3728", bg: "#fff5eb", category: "romantic" },
  { name: "Roboto + Lora", headingFont: "Roboto", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, fg: "#212121", bg: "#fafafa", category: "professional" },
  { name: "Montserrat + Karla", headingFont: "Montserrat", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, fg: "#1a1a1a", bg: "#e8f5e9", category: "modern" },
  { name: "Fjalla One + Cantarell", headingFont: "Fjalla One", headingWeight: 400, bodyFont: "Cantarell", bodyWeight: 400, fg: "#ffffff", bg: "#37474f", category: "bold" },
  { name: "Source Sans Pro + Alegreya", headingFont: "Source Sans Pro", headingWeight: 700, bodyFont: "Alegreya", bodyWeight: 400, fg: "#263238", bg: "#fff8e1", category: "editorial" },
  { name: "Stint Ultra Expanded + Pontano Sans", headingFont: "Stint Ultra Expanded", headingWeight: 400, bodyFont: "Pontano Sans", bodyWeight: 400, fg: "#1b1b1b", bg: "#e0e7ee", category: "unique" },
  { name: "Ubuntu + Rokkitt", headingFont: "Ubuntu", headingWeight: 700, bodyFont: "Rokkitt", bodyWeight: 400, fg: "#ffffff", bg: "#e65100", category: "tech" },
  { name: "Nunito + PT Sans", headingFont: "Nunito", headingWeight: 700, bodyFont: "PT Sans", bodyWeight: 400, fg: "#333333", bg: "#f9f9f9", category: "friendly" },
  { name: "DotGothic16 + Space Mono", headingFont: "DotGothic16", headingWeight: 400, bodyFont: "Space Mono", bodyWeight: 400, fg: "#00ff41", bg: "#0a0a0a", category: "retro" },
  { name: "Playfair Display + Lato", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, fg: "#1a1a1a", bg: "#f5f0eb", category: "luxury" },
  { name: "Quicksand Bold + Quicksand", headingFont: "Quicksand", headingWeight: 700, bodyFont: "Quicksand", bodyWeight: 400, fg: "#5b4a8a", bg: "#f0edf6", category: "playful" },
  { name: "Syne + Inter", headingFont: "Syne", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#ffffff", bg: "#0f172a", category: "tech" },
  { name: "Yellowtail + Rethink Sans", headingFont: "Yellowtail", headingWeight: 400, bodyFont: "Rethink Sans", bodyWeight: 400, fg: "#7c2d12", bg: "#fef3c7", category: "retro" },
  { name: "Rufina + Average Sans", headingFont: "Rufina", headingWeight: 700, bodyFont: "Average Sans", bodyWeight: 400, fg: "#1e293b", bg: "#f8fafc", category: "editorial" },
  { name: "Poiret One + Montserrat", headingFont: "Poiret One", headingWeight: 400, bodyFont: "Montserrat", bodyWeight: 400, fg: "#d4af37", bg: "#1c1c1c", category: "luxury" },
  { name: "Sintony + Poppins", headingFont: "Sintony", headingWeight: 700, bodyFont: "Poppins", bodyWeight: 400, fg: "#1a1a1a", bg: "#e3f2fd", category: "modern" },
  { name: "Philosopher + Mulish", headingFont: "Philosopher", headingWeight: 700, bodyFont: "Mulish", bodyWeight: 400, fg: "#2c3e50", bg: "#fdf2e9", category: "literary" },
  { name: "Cardo + Hind", headingFont: "Cardo", headingWeight: 700, bodyFont: "Hind", bodyWeight: 400, fg: "#3e2723", bg: "#efebe9", category: "heritage" },
  { name: "Bubblegum Sans + Open Sans", headingFont: "Bubblegum Sans", headingWeight: 400, bodyFont: "Open Sans", bodyWeight: 400, fg: "#ffffff", bg: "#e91e63", category: "playful" },
  { name: "Archivo Narrow + Tenor Sans", headingFont: "Archivo Narrow", headingWeight: 700, bodyFont: "Tenor Sans", bodyWeight: 400, fg: "#1a1a1a", bg: "#f5f5f5", category: "corporate" },
  { name: "Rethink Sans + Spectral", headingFont: "Rethink Sans", headingWeight: 700, bodyFont: "Spectral", bodyWeight: 400, fg: "#1e293b", bg: "#f0fdf4", category: "professional" },
  { name: "Crimson Pro + DM Sans", headingFont: "Crimson Pro", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, fg: "#7f1d1d", bg: "#fef2f2", category: "editorial" },
  { name: "Young Serif + Instrument Sans", headingFont: "Young Serif", headingWeight: 400, bodyFont: "Instrument Sans", bodyWeight: 400, fg: "#1a1a1a", bg: "#fef9c3", category: "creative" },
  { name: "Instrument Sans + Geist", headingFont: "Instrument Sans", headingWeight: 600, bodyFont: "Geist", bodyWeight: 400, fg: "#e2e8f0", bg: "#0f172a", category: "minimal" },
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
