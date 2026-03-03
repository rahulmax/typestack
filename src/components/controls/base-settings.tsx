"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScaleRatioSelect } from "./scale-ratio-select";
import { useTypographyStore } from "@/store/typography-store";

export function BaseSettings() {
  const baseFontSize = useTypographyStore((s) => s.baseFontSize);
  const setBaseFontSize = useTypographyStore((s) => s.setBaseFontSize);
  const sampleText = useTypographyStore((s) => s.sampleText);
  const setSampleText = useTypographyStore((s) => s.setSampleText);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Base Settings</h3>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Base Font Size: {baseFontSize}px
        </Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[baseFontSize]}
            onValueChange={([v]) => setBaseFontSize(v)}
            min={10}
            max={24}
            step={1}
            className="flex-1"
          />
          <Input
            type="number"
            value={baseFontSize}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 8 && v <= 32) setBaseFontSize(v);
            }}
            className="w-16"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Scale Ratio</Label>
        <ScaleRatioSelect />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Sample Text</Label>
        <Input
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
        />
      </div>
    </div>
  );
}
