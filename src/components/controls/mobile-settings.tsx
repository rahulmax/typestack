"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useTypographyStore } from "@/store/typography-store";

export function MobileSettings() {
  const mobile = useTypographyStore((s) => s.mobile);
  const updateMobile = useTypographyStore((s) => s.updateMobile);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Mobile Settings</h3>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Base Font Size: {mobile.baseFontSize}px
        </Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[mobile.baseFontSize]}
            onValueChange={([v]) => updateMobile({ baseFontSize: v })}
            min={10}
            max={20}
            step={1}
          />
          <Input
            type="number"
            value={mobile.baseFontSize}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 8 && v <= 24) updateMobile({ baseFontSize: v });
            }}
            className="w-16"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Scale Ratio: {mobile.scaleRatio.toFixed(3)}
        </Label>
        <Slider
          value={[mobile.scaleRatio]}
          onValueChange={([v]) => updateMobile({ scaleRatio: v })}
          min={1.05}
          max={1.5}
          step={0.005}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Breakpoint: {mobile.breakpointWidth}px
        </Label>
        <Input
          type="number"
          value={mobile.breakpointWidth}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 320 && v <= 1200) updateMobile({ breakpointWidth: v });
          }}
          className="w-24"
        />
      </div>
    </div>
  );
}
