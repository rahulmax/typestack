"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { GroupProperties } from "@/types/typography";

interface GroupControlsProps {
  title: string;
  group: GroupProperties;
  onUpdate: (props: Partial<GroupProperties>) => void;
  onFontClick: () => void;
  disabled?: boolean;
}

export function GroupControls({
  title,
  group,
  onUpdate,
  onFontClick,
  disabled,
}: GroupControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold shrink-0">{title}</h3>
        <button
          type="button"
          onClick={onFontClick}
          className="flex h-9 flex-1 min-w-0 items-center rounded-sm border bg-background px-3 text-sm hover:bg-accent truncate"
          style={{ fontFamily: group.fontFamily }}
        >
          {group.fontFamily}
        </button>
      </div>

      <div className={`grid grid-cols-2 gap-x-5 gap-y-4 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Font Weight</Label>
            <span className="text-[10px] tabular-nums text-muted-foreground">{group.fontWeight}</span>
          </div>
          <Slider
            value={[group.fontWeight]}
            onValueChange={([v]) => onUpdate({ fontWeight: v })}
            min={100}
            max={900}
            step={100}
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Line Height</Label>
            <span className="text-[10px] tabular-nums text-muted-foreground">{group.lineHeight.toFixed(2)}</span>
          </div>
          <Slider
            value={[group.lineHeight]}
            onValueChange={([v]) => onUpdate({ lineHeight: v })}
            min={0.8}
            max={2.5}
            step={0.05}
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Letter Spacing</Label>
            <span className="text-[10px] tabular-nums text-muted-foreground">{group.letterSpacing.toFixed(3)}em</span>
          </div>
          <Slider
            value={[group.letterSpacing]}
            onValueChange={([v]) => onUpdate({ letterSpacing: v })}
            min={-0.1}
            max={0.2}
            step={0.005}
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Word Spacing</Label>
            <span className="text-[10px] tabular-nums text-muted-foreground">{group.wordSpacing.toFixed(3)}em</span>
          </div>
          <Slider
            value={[group.wordSpacing]}
            onValueChange={([v]) => onUpdate({ wordSpacing: v })}
            min={-0.1}
            max={0.5}
            step={0.01}
            disabled={disabled}
          />
        </div>
      </div>

    </div>
  );
}
