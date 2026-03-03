export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  category: string;
}

export interface GoogleFontsApiResponse {
  kind: string;
  items: GoogleFont[];
}

export type FontCategory = "serif" | "sans-serif" | "display" | "monospace" | "handwriting";

export const FONT_CATEGORIES: FontCategory[] = [
  "sans-serif",
  "serif",
  "display",
  "monospace",
  "handwriting",
];
