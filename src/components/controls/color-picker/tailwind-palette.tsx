"use client";

import { TAILWIND_COLORS } from "@/lib/tailwind-colors";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TailwindPaletteProps {
  onSelect: (color: string) => void;
}

export function TailwindPalette({ onSelect }: TailwindPaletteProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">
        Tailwind Colors
      </span>
      <div className="flex flex-col gap-px">
        {TAILWIND_COLORS.map((scale) => (
          <div key={scale.name} className="flex gap-px">
            {Object.entries(scale.shades).map(([shade, hex]) => (
              <Tooltip key={shade}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="h-2.5 min-w-0 flex-1 rounded-sm border border-transparent hover:border-foreground/30 hover:scale-110 transition-transform"
                    style={{ backgroundColor: hex }}
                    onClick={() => onSelect(hex)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {scale.name}-{shade}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
