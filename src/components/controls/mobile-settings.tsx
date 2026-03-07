"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useTypographyStore } from "@/store/typography-store";

export function MobileSettings() {
  const mobile = useTypographyStore((s) => s.mobile);
  const updateMobile = useTypographyStore((s) => s.updateMobile);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">Mobile Settings</h3>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Base Size</Label>
            <span className="text-[10px] tabular-nums text-muted-foreground">{mobile.baseFontSize}px</span>
          </div>
          <Slider
            value={[mobile.baseFontSize]}
            onValueChange={([v]) => updateMobile({ baseFontSize: v })}
            min={10}
            max={20}
            step={1}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Scale Ratio</Label>
            <span className="text-[10px] tabular-nums text-muted-foreground">{mobile.scaleRatio.toFixed(3)}</span>
          </div>
          <Slider
            value={[mobile.scaleRatio]}
            onValueChange={([v]) => updateMobile({ scaleRatio: v })}
            min={1.05}
            max={1.5}
            step={0.005}
          />
        </div>
      </div>
    </div>
  );
}
