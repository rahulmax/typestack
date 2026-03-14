"use client";

import { RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DEFAULT_CONFIG } from "@/data/default-config";
import { useTypographyStore } from "@/store/typography-store";

const defaults = DEFAULT_CONFIG.mobile;

export function MobileSettings() {
  const mobile = useTypographyStore((s) => s.mobile);
  const updateMobile = useTypographyStore((s) => s.updateMobile);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">Mobile Settings</h3>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Base Size</Label>
              {mobile.baseFontSize !== defaults.baseFontSize && (
                <button type="button" onClick={() => updateMobile({ baseFontSize: defaults.baseFontSize })} className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="size-2.5" />
                </button>
              )}
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground">{mobile.baseFontSize}px</span>
          </div>
          <Slider
            value={[mobile.baseFontSize]}
            onValueChange={([v]) => updateMobile({ baseFontSize: v })}
            min={10}
            max={20}
            step={1}
            formatValue={(v) => `${v}px`}
            onReset={() => updateMobile({ baseFontSize: defaults.baseFontSize })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Scale Ratio</Label>
              {mobile.scaleRatio !== defaults.scaleRatio && (
                <button type="button" onClick={() => updateMobile({ scaleRatio: defaults.scaleRatio })} className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="size-2.5" />
                </button>
              )}
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground">{mobile.scaleRatio.toFixed(3)}</span>
          </div>
          <Slider
            value={[mobile.scaleRatio]}
            onValueChange={([v]) => updateMobile({ scaleRatio: v })}
            min={1.05}
            max={1.5}
            step={0.005}
            onReset={() => updateMobile({ scaleRatio: defaults.scaleRatio })}
          />
        </div>
      </div>
    </div>
  );
}
