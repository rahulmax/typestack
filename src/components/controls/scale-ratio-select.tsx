"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SCALE_RATIO_PRESETS } from "@/data/scale-ratios";
import { useTypographyStore } from "@/store/typography-store";

export function ScaleRatioSelect() {
  const scaleRatioPreset = useTypographyStore((s) => s.scaleRatioPreset);
  const scaleRatio = useTypographyStore((s) => s.scaleRatio);
  const setScaleRatio = useTypographyStore((s) => s.setScaleRatio);
  const setScaleRatioPreset = useTypographyStore((s) => s.setScaleRatioPreset);

  const handlePresetChange = (value: string) => {
    if (value === "Custom") {
      setScaleRatioPreset("Custom");
      return;
    }
    const preset = SCALE_RATIO_PRESETS.find((p) => p.name === value);
    if (preset) {
      setScaleRatio(preset.value);
    }
  };

  const handleCustomChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 1 && num < 3) {
      setScaleRatio(num);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Select value={scaleRatioPreset} onValueChange={handlePresetChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select scale" />
        </SelectTrigger>
        <SelectContent>
          {SCALE_RATIO_PRESETS.map((preset) => (
            <SelectItem key={preset.name} value={preset.name}>
              {preset.name} — {preset.value}
            </SelectItem>
          ))}
          <SelectItem value="Custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      {scaleRatioPreset === "Custom" && (
        <Input
          type="number"
          step={0.001}
          min={1.001}
          max={2.999}
          value={scaleRatio}
          onChange={(e) => handleCustomChange(e.target.value)}
          className="w-full"
        />
      )}
    </div>
  );
}
