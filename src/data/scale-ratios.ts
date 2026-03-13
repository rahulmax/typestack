import type { ScaleRatioPreset } from "@/types/typography";

export const SCALE_RATIO_PRESETS: ScaleRatioPreset[] = [
  { name: "Minor Second", value: 1.067, label: "m2" },
  { name: "Major Second", value: 1.125, label: "M2" },
  { name: "Minor Third", value: 1.2, label: "m3" },
  { name: "Major Third", value: 1.25, label: "M3" },
{ name: "Perfect Fourth", value: 1.333, label: "P4" },
  { name: "Augmented Fourth", value: 1.414, label: "A4" },
  { name: "Perfect Fifth", value: 1.5, label: "P5" },
  { name: "Golden Ratio", value: 1.618, label: "φ" },
];

export function findPresetByValue(value: number): ScaleRatioPreset | undefined {
  return SCALE_RATIO_PRESETS.find(
    (p) => Math.abs(p.value - value) < 0.001
  );
}
