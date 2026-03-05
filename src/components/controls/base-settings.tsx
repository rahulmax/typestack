"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScaleRatioSelect } from "./scale-ratio-select";
import { useTypographyStore } from "@/store/typography-store";

export function BaseSettings() {
  const baseFontSize = useTypographyStore((s) => s.baseFontSize);
  const setBaseFontSize = useTypographyStore((s) => s.setBaseFontSize);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label className="text-xs text-muted-foreground">Base Size</Label>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              value={baseFontSize}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= 8 && v <= 32) setBaseFontSize(v);
              }}
              min={8}
              max={32}
              step={1}
              className="w-full text-sm font-semibold h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:appearance-auto"
            />
            <span className="text-xs text-muted-foreground shrink-0">px</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <Label className="text-xs text-muted-foreground">Scale</Label>
          <ScaleRatioSelect />
        </div>
      </div>
    </div>
  );
}
