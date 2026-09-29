export interface Pangram {
  label: string;
  text: string;
}

export const PANGRAMS: Pangram[] = [
  { label: "Pack my box", text: "Pack my box with five dozen liquor jugs" },
  { label: "Vexingly quick", text: "How vexingly quick daft zebras jump" },
  { label: "Boxing wizards", text: "The five boxing wizards jump quickly" },
  { label: "Sphinx of quartz", text: "Sphinx of black quartz, judge my vow" },
  { label: "Driven jocks", text: "Two driven jocks help fax my big quiz" },
  { label: "Waltz, bad nymph", text: "Waltz, bad nymph, for quick jigs vex" },
  { label: "Glib jocks", text: "Glib jocks quiz nymph to vex dwarf" },
];

/** A pangram to fall back on wherever a fixed one is needed (SSR, exports). */
export const DEFAULT_PANGRAM = PANGRAMS[0].text;

/** The old default, which older saved sessions may still carry. */
const RETIRED_DEFAULT = "The quick brown fox jumps over the lazy dog";

/** True when the text is one of ours rather than something the user typed. */
export function isStockPangram(text: string): boolean {
  return text === RETIRED_DEFAULT || PANGRAMS.some((p) => p.text === text);
}

/** A random pangram, different from `exclude` when there is another to choose. */
export function pickRandomPangram(exclude?: string): string {
  const pool = PANGRAMS.filter((p) => p.text !== exclude);
  const from = pool.length ? pool : PANGRAMS;
  return from[Math.floor(Math.random() * from.length)].text;
}
