"use client";

import { RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScaleRatioSelect } from "./scale-ratio-select";
import { DEFAULT_CONFIG } from "@/data/default-config";
import { useTypographyStore } from "@/store/typography-store";

export function BaseSettings() {
  const baseFontSize = useTypographyStore((s) => s.baseFontSize);
  const scaleRatio = useTypographyStore((s) => s.scaleRatio);
  const setBaseFontSize = useTypographyStore((s) => s.setBaseFontSize);
  const setScaleRatio = useTypographyStore((s) => s.setScaleRatio);
  const setScaleRatioPreset = useTypographyStore((s) => s.setScaleRatioPreset);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-xs text-muted-foreground">Base Size</Label>
              {baseFontSize !== DEFAULT_CONFIG.baseFontSize && (
                <button type="button" onClick={() => setBaseFontSize(DEFAULT_CONFIG.baseFontSize)} className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="size-2.5" />
                </button>
              )}
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground">{baseFontSize}px</span>
          </div>
          <Slider
            value={[baseFontSize]}
            onValueChange={([v]) => setBaseFontSize(v)}
            min={8}
            max={32}
            step={1}
            formatValue={(v) => `${v}px`}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-1">
            <Label className="text-xs text-muted-foreground">Scale</Label>
            {scaleRatio !== DEFAULT_CONFIG.scaleRatio && (
              <button type="button" onClick={() => { setScaleRatio(DEFAULT_CONFIG.scaleRatio); setScaleRatioPreset(DEFAULT_CONFIG.scaleRatioPreset); }} className="text-muted-foreground hover:text-foreground">
                <RotateCcw className="size-2.5" />
              </button>
            )}
          </div>
          <ScaleRatioSelect />
        </div>
      </div>
    </div>
  );
}
