"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { GroupProperties } from "@/types/typography";

interface GroupControlsProps {
  title: string;
  group: GroupProperties;
  onUpdate: (props: Partial<GroupProperties>) => void;
  onFontClick: () => void;
}

export function GroupControls({
  title,
  group,
  onUpdate,
  onFontClick,
}: GroupControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">{title}</h3>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Font Family</Label>
        <button
          type="button"
          onClick={onFontClick}
          className="flex h-9 w-full items-center rounded-md border bg-background px-3 text-sm hover:bg-accent"
          style={{ fontFamily: group.fontFamily }}
        >
          {group.fontFamily}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Font Weight: {group.fontWeight}
        </Label>
        <Slider
          value={[group.fontWeight]}
          onValueChange={([v]) => onUpdate({ fontWeight: v })}
          min={100}
          max={900}
          step={100}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Line Height: {group.lineHeight.toFixed(2)}
        </Label>
        <Slider
          value={[group.lineHeight]}
          onValueChange={([v]) => onUpdate({ lineHeight: v })}
          min={0.8}
          max={2.5}
          step={0.05}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Letter Spacing: {group.letterSpacing.toFixed(3)}em
        </Label>
        <Slider
          value={[group.letterSpacing]}
          onValueChange={([v]) => onUpdate({ letterSpacing: v })}
          min={-0.1}
          max={0.2}
          step={0.005}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Word Spacing: {group.wordSpacing.toFixed(3)}em
        </Label>
        <Slider
          value={[group.wordSpacing]}
          onValueChange={([v]) => onUpdate({ wordSpacing: v })}
          min={-0.1}
          max={0.5}
          step={0.01}
        />
      </div>

    </div>
  );
}
