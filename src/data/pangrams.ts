export interface Pangram {
  label: string;
  text: string;
}

export const PANGRAMS: Pangram[] = [
  { label: "Quick brown fox", text: "The quick brown fox jumps over the lazy dog" },
  { label: "Pack my box", text: "Pack my box with five dozen liquor jugs" },
  { label: "Vexingly quick", text: "How vexingly quick daft zebras jump" },
  { label: "Boxing wizards", text: "The five boxing wizards jump quickly" },
  { label: "Sphinx of quartz", text: "Sphinx of black quartz, judge my vow" },
  { label: "Driven jocks", text: "Two driven jocks help fax my big quiz" },
  { label: "Waltz, bad nymph", text: "Waltz, bad nymph, for quick jigs vex" },
  { label: "Glib jocks", text: "Glib jocks quiz nymph to vex dwarf" },
];
